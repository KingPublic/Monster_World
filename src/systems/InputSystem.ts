import '../ui/styles/mobile.css';

export interface MovementInput { readonly x: number; readonly y: number; }
export interface LookDelta { x: number; y: number; }
const gameplayCodes = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'KeyE', 'KeyR', 'KeyC', 'Space', 'ControlLeft', 'ControlRight', 'KeyF', 'Escape']);

export interface ControlContext {
  mounted?: boolean;
  airborne?: boolean;
  mountKind?: 'foot' | 'dragon' | 'horse';
  canInteract?: boolean;
}

/** A single input source for foot movement, flight and held touch actions. */
export class InputSystem {
  private readonly keyboard = new Set<string>();
  private readonly edges = new Set<string>();
  private readonly buttons = new Map<number, { code: string; element: HTMLButtonElement }>();
  private readonly actionButtons = new Map<string, HTMLButtonElement>();
  private readonly events = new AbortController();
  private readonly touchRoot: HTMLDivElement;
  private readonly joystickZone: HTMLDivElement;
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

    // Auto-activate touch controls on touch-capable devices
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(any-pointer: coarse)').matches;
    if (isTouch) {
      this.touchRoot.classList.add('is-touch');
      document.documentElement.classList.add('has-touch-device');
    }
    window.addEventListener('touchstart', () => {
      this.touchRoot.classList.add('is-touch');
      document.documentElement.classList.add('has-touch-device');
    }, { signal, once: true, passive: true });

    // Dedicated joystick zone covering lower-left screen area
    this.joystickZone = document.createElement('div');
    this.joystickZone.className = 'mobile-joystick-zone';
    this.joystickZone.setAttribute('role', 'group');
    this.joystickZone.setAttribute('aria-label', 'Movement joystick area');

    this.joystick = document.createElement('div');
    this.joystick.className = 'mobile-joystick';
    this.joystick.setAttribute('role', 'group');
    this.joystick.setAttribute('aria-label', 'Movement joystick');

    const ring = document.createElement('span');
    ring.className = 'mobile-joystick-ring';
    this.joystick.append(ring);

    this.stick = document.createElement('span');
    this.stick.className = 'mobile-joystick-stick';
    this.joystick.append(this.stick);

    const hint = document.createElement('span');
    hint.className = 'mobile-move-label';
    hint.textContent = 'MOVE';
    this.joystick.append(hint);

    this.joystickZone.append(this.joystick);
    this.touchRoot.append(this.joystickZone);

    this.joystickZone.addEventListener('pointerdown', this.onJoystickStart, { signal });
    this.joystickZone.addEventListener('pointermove', this.onJoystickMove, { signal });
    this.joystickZone.addEventListener('pointerup', this.onJoystickEnd, { signal });
    this.joystickZone.addEventListener('pointercancel', this.onJoystickEnd, { signal });
    this.joystickZone.addEventListener('lostpointercapture', this.onJoystickEnd, { signal });

    const actions = document.createElement('div');
    actions.className = 'mobile-actions';
    const specs: readonly [string, string, string, string, string][] = [
      ['KeyE', 'Interact', '✦', 'INTERACT', 'interact'],
      ['Space', 'Jump or ascend', '▲', 'UP / JUMP', 'jump'],
      ['ControlLeft', 'Descend', '▼', 'DOWN', 'descend'],
      ['KeyF', 'Dismount', '⏏', 'DISMOUNT', 'dismount'],
      ['ShiftLeft', 'Hold sprint or boost', '⚡', 'HOLD SPRINT / BOOST', 'sprint'],
    ];

    for (const [code, label, icon, text, action] of specs) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-action mobile-action-button' + (code === 'ShiftLeft' ? ' mobile-boost' : '') + (code === 'KeyE' ? ' mobile-interact' : '') + (code === 'KeyF' ? ' mobile-dismount' : '');
      button.dataset.code = code;
      button.dataset.action = action;
      button.setAttribute('aria-label', label);

      const iconSpan = document.createElement('span');
      iconSpan.className = 'mobile-action-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = icon;

      const textSpan = document.createElement('span');
      textSpan.className = 'mobile-action-text';
      textSpan.textContent = text;

      button.append(iconSpan, textSpan);
      button.addEventListener('pointerdown', event => this.startButton(event, code, button), { signal });
      button.addEventListener('pointerup', this.onPointerRelease, { signal });
      button.addEventListener('pointercancel', this.onPointerRelease, { signal });
      button.addEventListener('lostpointercapture', this.onPointerRelease, { signal });
      button.addEventListener('contextmenu', event => event.preventDefault(), { signal });

      this.actionButtons.set(code, button);
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

  pressed(code: string): boolean {
    const wasPressed = this.edges.has(code);
    this.edges.delete(code);
    return wasPressed;
  }

  consumeLook(): LookDelta {
    const delta = { x: this.lookX, y: this.lookY };
    this.lookX = 0;
    this.lookY = 0;
    return delta;
  }

  setContext(ctx: ControlContext): void {
    const isMounted = !!ctx.mounted;
    const isDragon = ctx.mountKind === 'dragon';

    const jumpBtn = this.actionButtons.get('Space');
    if (jumpBtn) {
      const text = jumpBtn.querySelector('.mobile-action-text');
      if (text) text.textContent = isMounted && isDragon ? 'ASCEND' : 'UP / JUMP';
      const icon = jumpBtn.querySelector('.mobile-action-icon');
      if (icon) icon.textContent = isMounted && isDragon ? '▲' : '▲';
    }

    const downBtn = this.actionButtons.get('ControlLeft');
    if (downBtn) {
      downBtn.classList.toggle('is-inactive', !isMounted || !isDragon);
    }

    const boostBtn = this.actionButtons.get('ShiftLeft');
    if (boostBtn) {
      const text = boostBtn.querySelector('.mobile-action-text');
      if (text) text.textContent = isMounted && isDragon ? 'BOOST' : 'SPRINT';
    }

    const dismountBtn = this.actionButtons.get('KeyF');
    if (dismountBtn) {
      dismountBtn.classList.toggle('is-visible', isMounted);
      dismountBtn.classList.toggle('is-inactive', !isMounted);
    }

    const interactBtn = this.actionButtons.get('KeyE');
    if (interactBtn) {
      interactBtn.classList.toggle('has-target', !!ctx.canInteract);
    }
  }

  clear(): void {
    this.keyboard.clear();
    this.edges.clear();
    this.lookX = 0;
    this.lookY = 0;
    const lookPointer = this.lookPointer;
    this.lookPointer = null;
    if (lookPointer !== null) this.releaseCapture(this.canvas, lookPointer);

    const joystickPointer = this.joystickPointer;
    this.joystickPointer = null;
    if (joystickPointer !== null) this.releaseCapture(this.joystickZone, joystickPointer);
    this.joystickX = 0;
    this.joystickY = 0;
    this.stick.style.transform = 'translate(0px, 0px)';
    this.joystick.classList.remove('is-active', 'is-anchored');
    this.joystick.style.left = '';
    this.joystick.style.bottom = '';
    this.joystick.style.transform = '';

    const buttons = [...this.buttons.entries()];
    this.buttons.clear();
    for (const [id, button] of buttons) {
      button.element.classList.remove('is-held');
      this.releaseCapture(button.element, id);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.clear();
    this.events.abort();
    this.touchRoot.remove();
    this.canvas.style.touchAction = this.previousTouchAction;
    if (this.previousTabIndex === null) this.canvas.removeAttribute('tabindex');
    else this.canvas.setAttribute('tabindex', this.previousTabIndex);
  }

  private editable(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]') !== null;
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (this.canvas.classList.contains('menu-canvas')) return;
    if (!gameplayCodes.has(event.code) || this.editable(event.target) || event.metaKey || event.altKey) return;
    event.preventDefault();
    if (!this.held(event.code) && !event.repeat) this.edges.add(event.code);
    this.keyboard.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keyboard.delete(event.code);
  };

  private readonly onBlur = (): void => {
    this.clear();
  };

  private readonly onVisibility = (): void => {
    if (document.hidden) this.clear();
  };

  private readonly onLookStart = (event: PointerEvent): void => {
    if (this.lookPointer !== null || (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 2)) return;
    event.preventDefault();
    this.canvas.focus({ preventScroll: true });
    this.lookPointer = event.pointerId;
    this.lastLookX = event.clientX;
    this.lastLookY = event.clientY;
    this.capture(this.canvas, event.pointerId);
  };

  private readonly onLookMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.lookPointer) return;
    event.preventDefault();
    const dx = event.clientX - this.lastLookX;
    const dy = event.clientY - this.lastLookY;
    this.lookX += dx;
    this.lookY += dy;
    this.lastLookX = event.clientX;
    this.lastLookY = event.clientY;
  };

  private readonly onLookEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.lookPointer) return;
    this.lookPointer = null;
    this.releaseCapture(this.canvas, event.pointerId);
  };

  private startButton(event: PointerEvent, code: string, element: HTMLButtonElement): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.held(code)) this.edges.add(code);
    this.buttons.set(event.pointerId, { code, element });
    element.classList.add('is-held');
    this.capture(element, event.pointerId);
  }

  private readonly onPointerRelease = (event: PointerEvent): void => {
    const button = this.buttons.get(event.pointerId);
    if (button) {
      this.buttons.delete(event.pointerId);
      if (![...this.buttons.values()].some(value => value.element === button.element)) {
        button.element.classList.remove('is-held');
      }
      this.releaseCapture(button.element, event.pointerId);
    }
    this.onJoystickEnd(event);
    this.onLookEnd(event);
  };

  private readonly onJoystickStart = (event: PointerEvent): void => {
    if (this.joystickPointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    this.joystickPointer = event.pointerId;
    this.capture(this.joystickZone, event.pointerId);

    const zoneRect = this.joystickZone.getBoundingClientRect();
    const radius = 60;
    const clientX = Math.max(zoneRect.left + radius, Math.min(zoneRect.right - radius, event.clientX));
    const clientY = Math.max(zoneRect.top + radius, Math.min(zoneRect.bottom - radius, event.clientY));


    // Anchor joystick smoothly at touch origin within touch zone
    this.joystick.style.left = `${clientX - zoneRect.left}px`;
    this.joystick.style.top = `${clientY - zoneRect.top}px`;
    this.joystick.style.bottom = 'auto';
    this.joystick.classList.add('is-active', 'is-anchored');

    this.setJoystick(event);
  };

  private readonly onJoystickMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.joystickPointer) return;
    event.preventDefault();
    this.setJoystick(event);
  };

  private readonly onJoystickEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.joystickPointer) return;
    this.joystickPointer = null;
    this.joystickX = 0;
    this.joystickY = 0;
    this.stick.style.transform = 'translate(0px, 0px)';
    this.joystick.classList.remove('is-active', 'is-anchored');
    this.joystick.style.left = '';
    this.joystick.style.top = '';
    this.joystick.style.bottom = '';
    this.releaseCapture(this.joystickZone, event.pointerId);
  };

  private setJoystick(event: PointerEvent): void {
    const rect = this.joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = Math.max(34, rect.width * 0.35);

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    let x = dx / maxRadius;
    let y = -dy / maxRadius;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }

    this.joystickX = Math.abs(x) < 0.07 ? 0 : x;
    this.joystickY = Math.abs(y) < 0.07 ? 0 : y;

    const stickDist = Math.min(maxRadius, distance);
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * stickDist;
    const vy = Math.sin(angle) * stickDist;
    this.stick.style.transform = `translate(${vx}px, ${vy}px)`;
  }

  private capture(element: Element, id: number): void {
    try {
      element.setPointerCapture(id);
    } catch {
      /* Detached/cancelled pointer. Window release still clears it. */
    }
  }

  private releaseCapture(element: Element, id: number): void {
    try {
      if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
    } catch {
      /* Capture can end before visibility/blur cleanup. */
    }
  }
}
