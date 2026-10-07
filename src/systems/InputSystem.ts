import '../ui/styles/mobile.css';

export interface MovementInput { readonly x: number; readonly y: number; }
export interface LookDelta { x: number; y: number; }
const gameplayCodes = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'KeyE', 'Space', 'ControlLeft', 'ControlRight', 'KeyF', 'Escape']);

/** A single input source for foot movement, flight and held touch actions. */
export class InputSystem {
  private readonly keyboard = new Set<string>();
  private readonly edges = new Set<string>();
  private readonly buttons = new Map<number, { code: string; element: HTMLButtonElement }>();
  private readonly events = new AbortController();
  private readonly touchRoot: HTMLDivElement;
  private readonly joystick: HTMLDivElement;
  private readonly stick: HTMLSpanElement;
  private joystickPointer: number | null = null;
  private joystickX = 0;
  private joystickY = 0;
  private lookPointer: number | null = null;
  private lookX = 0;
  private lookY = 0;
  private lastLookX = 0;
  private lastLookY = 0;
  private readonly previousTouchAction: string;
  private readonly previousTabIndex: string | null;
  private disposed = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.previousTouchAction = canvas.style.touchAction;
    this.previousTabIndex = canvas.getAttribute('tabindex');
    canvas.style.touchAction = 'none';
    canvas.tabIndex = 0;
    const signal = this.events.signal;
    window.addEventListener('keydown', this.onKeyDown, { signal });
    window.addEventListener('keyup', this.onKeyUp, { signal });
    window.addEventListener('blur', this.onBlur, { signal });
    document.addEventListener('visibilitychange', this.onVisibility, { signal });
    document.addEventListener('focusin', event => { if (this.editable(event.target)) this.clear(); }, { signal });
    canvas.addEventListener('pointerdown', this.onLookStart, { signal });
    canvas.addEventListener('pointermove', this.onLookMove, { signal });
    canvas.addEventListener('pointerup', this.onLookEnd, { signal });
    canvas.addEventListener('pointercancel', this.onLookEnd, { signal });
    canvas.addEventListener('lostpointercapture', this.onLookEnd, { signal });
    canvas.addEventListener('contextmenu', event => event.preventDefault(), { signal });
    // Window releases also cover cancellation before a browser grants capture.
    window.addEventListener('pointerup', this.onPointerRelease, { signal });
    window.addEventListener('pointercancel', this.onPointerRelease, { signal });
    this.touchRoot = document.createElement('div');
    this.touchRoot.className = 'mobile-controls';
    this.touchRoot.setAttribute('aria-label', 'Touch movement and actions');
    this.joystick = document.createElement('div');
    this.joystick.className = 'mobile-joystick';
    this.joystick.setAttribute('role', 'group');
    this.joystick.setAttribute('aria-label', 'Movement joystick');
    this.stick = document.createElement('span');
    this.stick.className = 'mobile-joystick-stick';
    this.joystick.append(this.stick);
    const hint = document.createElement('span'); hint.className = 'mobile-move-label'; hint.textContent = 'MOVE'; this.joystick.append(hint);
    this.touchRoot.append(this.joystick);
    this.joystick.addEventListener('pointerdown', this.onJoystickStart, { signal });
    this.joystick.addEventListener('pointermove', this.onJoystickMove, { signal });
    this.joystick.addEventListener('pointerup', this.onJoystickEnd, { signal });
    this.joystick.addEventListener('pointercancel', this.onJoystickEnd, { signal });
    this.joystick.addEventListener('lostpointercapture', this.onJoystickEnd, { signal });
    const actions = document.createElement('div'); actions.className = 'mobile-actions';
    const specs: readonly [string, string, string][] = [
      ['KeyE', 'Interact', 'INTERACT'], ['Space', 'Jump or ascend', 'UP / JUMP'],
      ['ControlLeft', 'Descend', 'DOWN'], ['ShiftLeft', 'Hold sprint or boost', 'HOLD SPRINT / BOOST'], ['KeyF', 'Dismount', 'DISMOUNT'],
    ];
    for (const [code, label, text] of specs) {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'mobile-action' + (code === 'ShiftLeft' ? ' mobile-boost' : '');
      button.dataset.code = code; button.setAttribute('aria-label', label); button.textContent = text;
      button.addEventListener('pointerdown', event => this.startButton(event, code, button), { signal });
      button.addEventListener('pointerup', this.onPointerRelease, { signal });
      button.addEventListener('pointercancel', this.onPointerRelease, { signal });
      button.addEventListener('lostpointercapture', this.onPointerRelease, { signal });
      button.addEventListener('contextmenu', event => event.preventDefault(), { signal });
      actions.append(button);
    }
    this.touchRoot.append(actions);
    (canvas.parentElement ?? document.body).append(this.touchRoot);
  }

  get movement(): MovementInput {
    let x = Number(this.held('KeyD') || this.held('ArrowRight')) - Number(this.held('KeyA') || this.held('ArrowLeft')) + this.joystickX;
    let y = Number(this.held('KeyW') || this.held('ArrowUp')) - Number(this.held('KeyS') || this.held('ArrowDown')) + this.joystickY;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    return { x, y };
  }
  held(code: string): boolean {
    if (this.keyboard.has(code)) return true;
    if (code === 'ShiftLeft' && this.keyboard.has('ShiftRight')) return true;
    if (code === 'ControlLeft' && this.keyboard.has('ControlRight')) return true;
    for (const button of this.buttons.values()) if (button.code === code) return true;
    return false;
  }
  pressed(code: string): boolean { const wasPressed = this.edges.has(code); this.edges.delete(code); return wasPressed; }
  consumeLook(): LookDelta { const delta = { x: this.lookX, y: this.lookY }; this.lookX = 0; this.lookY = 0; return delta; }

  clear(): void {
    this.keyboard.clear(); this.edges.clear(); this.lookX = 0; this.lookY = 0;
    const lookPointer = this.lookPointer; this.lookPointer = null;
    if (lookPointer !== null) this.releaseCapture(this.canvas, lookPointer);
    const joystickPointer = this.joystickPointer; this.joystickPointer = null;
    if (joystickPointer !== null) this.releaseCapture(this.joystick, joystickPointer);
    this.joystickX = 0; this.joystickY = 0; this.stick.style.transform = 'translate(0px, 0px)';
    const buttons = [...this.buttons.entries()]; this.buttons.clear();
    for (const [id, button] of buttons) { button.element.classList.remove('is-held'); this.releaseCapture(button.element, id); }
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true; this.clear(); this.events.abort(); this.touchRoot.remove();
    this.canvas.style.touchAction = this.previousTouchAction;
    if (this.previousTabIndex === null) this.canvas.removeAttribute('tabindex'); else this.canvas.setAttribute('tabindex', this.previousTabIndex);
  }

  private editable(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]') !== null;
  }
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!gameplayCodes.has(event.code) || this.editable(event.target) || event.metaKey || event.altKey) return;
    event.preventDefault();
    if (!this.held(event.code) && !event.repeat) this.edges.add(event.code);
    this.keyboard.add(event.code);
  };
  private readonly onKeyUp = (event: KeyboardEvent): void => { this.keyboard.delete(event.code); };
  private readonly onBlur = (): void => { this.clear(); };
  private readonly onVisibility = (): void => { if (document.hidden) this.clear(); };
  private readonly onLookStart = (event: PointerEvent): void => {
    if (this.lookPointer !== null || (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 2)) return;
    event.preventDefault(); this.canvas.focus({ preventScroll: true });
    this.lookPointer = event.pointerId; this.lastLookX = event.clientX; this.lastLookY = event.clientY;
    this.capture(this.canvas, event.pointerId);
  };
  private readonly onLookMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.lookPointer) return;
    event.preventDefault();
    this.lookX += event.clientX - this.lastLookX; this.lookY += event.clientY - this.lastLookY;
    this.lastLookX = event.clientX; this.lastLookY = event.clientY;
  };
  private readonly onLookEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.lookPointer) return;
    this.lookPointer = null; this.releaseCapture(this.canvas, event.pointerId);
  };
  private startButton(event: PointerEvent, code: string, element: HTMLButtonElement): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault(); event.stopPropagation();
    if (!this.held(code)) this.edges.add(code);
    this.buttons.set(event.pointerId, { code, element }); element.classList.add('is-held'); this.capture(element, event.pointerId);
  }
  private readonly onPointerRelease = (event: PointerEvent): void => {
    const button = this.buttons.get(event.pointerId);
    if (button) { this.buttons.delete(event.pointerId); if (![...this.buttons.values()].some(value => value.element === button.element)) button.element.classList.remove('is-held'); this.releaseCapture(button.element, event.pointerId); }
    this.onJoystickEnd(event); this.onLookEnd(event);
  };
  private readonly onJoystickStart = (event: PointerEvent): void => {
    if (this.joystickPointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault(); event.stopPropagation(); this.joystickPointer = event.pointerId; this.capture(this.joystick, event.pointerId); this.setJoystick(event);
  };
  private readonly onJoystickMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.joystickPointer) return;
    event.preventDefault(); this.setJoystick(event);
  };
  private readonly onJoystickEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.joystickPointer) return;
    this.joystickPointer = null; this.joystickX = 0; this.joystickY = 0; this.stick.style.transform = 'translate(0px, 0px)'; this.releaseCapture(this.joystick, event.pointerId);
  };
  private setJoystick(event: PointerEvent): void {
    const rect = this.joystick.getBoundingClientRect(), radius = rect.width * 0.3;
    if (radius <= 0) return;
    let x = (event.clientX - rect.left - rect.width / 2) / radius, y = -(event.clientY - rect.top - rect.height / 2) / radius;
    const length = Math.hypot(x, y); if (length > 1) { x /= length; y /= length; }
    this.joystickX = Math.abs(x) < 0.08 ? 0 : x; this.joystickY = Math.abs(y) < 0.08 ? 0 : y;
    this.stick.style.transform = 'translate(' + (x * radius) + 'px, ' + (-y * radius) + 'px)';
  }
  private capture(element: Element, id: number): void { try { element.setPointerCapture(id); } catch { /* Detached/cancelled pointer. Window release still clears it. */ } }
  private releaseCapture(element: Element, id: number): void { try { if (element.hasPointerCapture(id)) element.releasePointerCapture(id); } catch { /* Capture can end before visibility/blur cleanup. */ } }
}
