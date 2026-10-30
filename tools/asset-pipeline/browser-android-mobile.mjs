import { createServer } from 'vite';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';

const require = createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');

const outDir = 'ASSET_WORK/iteration8';
const fixture = JSON.parse(await readFile('ASSET_WORK/iteration6/dragon-care-close.json', 'utf8')).mobile.state;

const vite = await createServer({
  server: { port: 5176 },
  logLevel: 'error'
});
await vite.listen();
const serverUrl = 'http://127.0.0.1:5176/?debug=1';

const result = {
  pass: false,
  timestamp: new Date().toISOString(),
  device: 'Pixel 7 (Android 14) / Mobile Emulation',
  errors: [],
  logs: [],
  checks: {}
};

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
});

try {
  // 1. Android Portrait Viewport (Pixel 7: 412 x 915)
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/UQ1A.240105.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
  });

  await context.addInitScript((s) => {
    if (location.protocol === 'http:') {
      localStorage.setItem('monster-world-save', JSON.stringify(s));
    }
  }, fixture);

  const page = await context.newPage();
  page.on('pageerror', (err) => {
    result.errors.push(err.message);
    console.error('Page error:', err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') result.errors.push(msg.text());
  });

  console.log('Navigating to', serverUrl);
  await page.goto(serverUrl);
  await page.waitForFunction(() => !!window.__MW);

  // Click continue if welcome screen present
  const continueBtn = page.getByRole('button', { name: 'Continue adventure' });
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
  }

  // Wait for player to be ready
  await page.waitForFunction(
    () => window.__MW?.snapshot()?.assets?.player?.status === 'ready',
    null,
    { timeout: 30000 }
  );
  console.log('Player model ready');

  // Verify viewport tag has user-scalable=no
  const viewportMeta = await page.$eval('meta[name="viewport"]', (el) => el.getAttribute('content'));
  result.checks.viewportMeta = viewportMeta;
  result.checks.viewportPreventsZoom = viewportMeta?.includes('user-scalable=no') ?? false;

  // Verify touch classes detected
  result.checks.touchClassApplied = await page.evaluate(() => {
    const controls = document.querySelector('.mobile-controls');
    return controls?.classList.contains('is-touch') && document.documentElement.classList.contains('has-touch-device');
  });

  // Verify UI elements exist
  result.checks.joystickZoneExists = await page.locator('.mobile-joystick-zone').isVisible();
  result.checks.joystickRingExists = await page.locator('.mobile-joystick-ring').isVisible();
  result.checks.joystickKnobExists = await page.locator('.mobile-joystick-stick').isVisible();
  result.checks.actionClusterExists = await page.locator('.mobile-actions').isVisible();

  // Verify action buttons
  const buttonsInfo = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.mobile-action-button'));
    return btns.map(b => ({
      action: b.getAttribute('data-action'),
      code: b.getAttribute('data-code'),
      text: b.querySelector('.mobile-action-text')?.textContent,
      icon: b.querySelector('.mobile-action-icon')?.textContent,
      disabled: b.classList.contains('is-inactive')
    }));
  });
  result.checks.buttons = buttonsInfo;

  // Verify on foot: DOWN button is inactive/dimmed
  const downBtnOnFoot = buttonsInfo.find(b => b.action === 'descend');
  result.checks.downDimmedOnFoot = downBtnOnFoot?.disabled ?? false;

  // Verify jump text on foot is UP / JUMP
  const jumpBtnOnFoot = buttonsInfo.find(b => b.action === 'jump');
  result.checks.jumpLabelOnFoot = jumpBtnOnFoot?.text;

  // Test joystick touch movement via PointerEvents
  console.log('Testing joystick pointer movement...');
  const initialPos = await page.evaluate(() => window.__MW.snapshot().position);
  
  await page.evaluate(() => {
    const zone = document.querySelector('.mobile-joystick-zone');
    const rect = zone.getBoundingClientRect();
    const touchX = rect.left + rect.width / 2;
    const touchY = rect.top + rect.height / 2;

    zone.dispatchEvent(new PointerEvent('pointerdown', {
      pointerId: 10,
      pointerType: 'touch',
      clientX: touchX,
      clientY: touchY,
      bubbles: true,
      cancelable: true
    }));

    // Move up by 45px (forward walk)
    zone.dispatchEvent(new PointerEvent('pointermove', {
      pointerId: 10,
      pointerType: 'touch',
      clientX: touchX,
      clientY: touchY - 45,
      bubbles: true,
      cancelable: true
    }));
  });

  // Hold joystick for 800ms
  await page.waitForTimeout(800);

  // Release joystick
  await page.evaluate(() => {
    const zone = document.querySelector('.mobile-joystick-zone');
    zone.dispatchEvent(new PointerEvent('pointerup', {
      pointerId: 10,
      pointerType: 'touch',
      bubbles: true,
      cancelable: true
    }));
  });

  const movedPos = await page.evaluate(() => window.__MW.snapshot().position);
  const distanceWalked = Math.hypot(movedPos[0] - initialPos[0], movedPos[2] - initialPos[2]);
  result.checks.distanceWalkedViaJoystick = distanceWalked;
  result.checks.joystickMovedPlayer = distanceWalked > 0.1;
  console.log('Distance walked via touch joystick:', distanceWalked.toFixed(2), 'm');

  // Test Sprint pointerdown
  console.log('Testing sprint button pointerdown...');
  await page.evaluate(() => {
    const sprintBtn = document.querySelector('[data-action="sprint"]');
    sprintBtn.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 2, pointerType: 'touch', bubbles: true }));
  });
  await page.waitForTimeout(100);
  const sprintHeld = await page.evaluate(() => {
    const sprintBtn = document.querySelector('[data-action="sprint"]');
    return sprintBtn?.classList.contains('is-held') ?? false;
  });
  result.checks.sprintButtonActive = sprintHeld;
  console.log('Sprint button held state:', sprintHeld);

  await page.evaluate(() => {
    const sprintBtn = document.querySelector('[data-action="sprint"]');
    sprintBtn.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2, pointerType: 'touch', bubbles: true }));
  });

  // Capture walking in portrait screenshot
  await page.screenshot({ path: `${outDir}/android-portrait-walking.png` });

  // Test teleport to mount & context change
  console.log('Teleporting to Mount Court...');
  await page.evaluate(() => window.__MW.teleport('mount'));
  await page.waitForFunction(() => window.__MW.snapshot().context?.kind === 'mount', null, { timeout: 10000 });
  await page.waitForTimeout(300);

  // Tap interact to mount dragon
  console.log('Tapping interact button to mount dragon...');
  const interactBtn = page.locator('.mobile-action[data-action="interact"]');
  await interactBtn.dispatchEvent('pointerdown', { pointerId: 3, pointerType: 'touch', bubbles: true });
  await page.waitForTimeout(50);
  await interactBtn.dispatchEvent('pointerup', { pointerId: 3, pointerType: 'touch', bubbles: true });

  await page.waitForFunction(() => !!window.__MW.snapshot().mountedId, null, { timeout: 10000 });
  const mountedSnap = await page.evaluate(() => window.__MW.snapshot());
  result.checks.mountedId = mountedSnap.mountedId;
  result.checks.isMounted = true;
  console.log('Mounted Dragon:', mountedSnap.mountedId);

  // Verify dynamic context changes on buttons
  const mountedButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.mobile-action-button'));
    return btns.map(b => ({
      action: b.getAttribute('data-action'),
      text: b.querySelector('.mobile-action-text')?.textContent,
      disabled: b.classList.contains('is-inactive')
    }));
  });
  result.checks.mountedButtons = mountedButtons;

  const jumpMounted = mountedButtons.find(b => b.action === 'jump');
  result.checks.jumpShowsAscendWhenMounted = jumpMounted?.text === 'ASCEND';

  const sprintMounted = mountedButtons.find(b => b.action === 'sprint');
  result.checks.sprintShowsBoostWhenMounted = sprintMounted?.text === 'BOOST';

  const downMounted = mountedButtons.find(b => b.action === 'descend');
  result.checks.downActiveWhenMounted = !downMounted?.disabled;

  // Test Dragon flight ascent via ASCEND button
  console.log('Ascending via ASCEND button touch...');
  const ascendBtn = page.locator('[data-action="jump"]');
  await ascendBtn.dispatchEvent('pointerdown', { pointerId: 4, pointerType: 'touch', bubbles: true });
  await page.waitForFunction(
    () => {
      const s = window.__MW.snapshot();
      return s.airborne && s.position[1] > s.floor + 10;
    },
    null,
    { timeout: 10000 }
  );
  await ascendBtn.dispatchEvent('pointerup', { pointerId: 4, pointerType: 'touch', bubbles: true });

  const flightSnap = await page.evaluate(() => {
    const s = window.__MW.snapshot();
    return { position: s.position, floor: s.floor, airborne: s.airborne };
  });
  result.checks.flightAirborne = flightSnap.airborne;
  result.checks.flightAltitude = flightSnap.position[1] - flightSnap.floor;
  console.log('Ascended into flight at altitude:', result.checks.flightAltitude.toFixed(1), 'm');

  // Screenshot in flight (portrait)
  await page.screenshot({ path: `${outDir}/android-portrait-flight.png` });

  // Test Dragon descent via DOWN button (mapped to ControlLeft)
  console.log('Descending via DOWN button touch...');
  const downBtn = page.locator('[data-action="descend"]');
  await downBtn.dispatchEvent('pointerdown', { pointerId: 5, pointerType: 'touch', bubbles: true });
  await page.waitForFunction(
    () => !window.__MW.snapshot().airborne,
    null,
    { timeout: 10000 }
  );
  await downBtn.dispatchEvent('pointerup', { pointerId: 5, pointerType: 'touch', bubbles: true });

  const landedSnap = await page.evaluate(() => {
    const s = window.__MW.snapshot();
    return { position: s.position, floor: s.floor, airborne: s.airborne, mountedId: s.mountedId };
  });
  result.checks.landedAirborne = landedSnap.airborne;
  result.checks.landedFloor = Math.abs(landedSnap.position[1] - landedSnap.floor) < 0.05;
  result.checks.stillMounted = !!landedSnap.mountedId;
  console.log('Landed safely on floor:', result.checks.landedFloor);

  // Test Dismount button
  console.log('Tapping DISMOUNT button...');
  const dismountBtn = page.locator('[data-action="dismount"]');
  await dismountBtn.dispatchEvent('pointerdown', { pointerId: 6, pointerType: 'touch', bubbles: true });
  await page.waitForTimeout(50);
  await dismountBtn.dispatchEvent('pointerup', { pointerId: 6, pointerType: 'touch', bubbles: true });

  await page.waitForFunction(() => !window.__MW.snapshot().mountedId, null, { timeout: 8000 });
  result.checks.dismountSuccess = !(await page.evaluate(() => !!window.__MW.snapshot().mountedId));
  console.log('Dismounted successfully:', result.checks.dismountSuccess);

  // 2. Test Android Landscape Viewport (915 x 412)
  console.log('Testing Android Landscape orientation...');
  await page.setViewportSize({ width: 915, height: 412 });
  await page.waitForTimeout(300);

  // Check no overlaps in landscape
  const layoutCheck = await page.evaluate(() => {
    const hud = document.querySelector('.hud-root')?.getBoundingClientRect();
    const joystick = document.querySelector('.mobile-joystick-zone')?.getBoundingClientRect();
    const actions = document.querySelector('.mobile-actions')?.getBoundingClientRect();
    const interaction = document.querySelector('.interaction')?.getBoundingClientRect();

    const joyOverlapHud = joystick && hud && !(joystick.right < hud.left || joystick.left > hud.right || joystick.bottom < hud.top || joystick.top > hud.bottom);
    const actionsOverlapHud = actions && hud && !(actions.right < hud.left || actions.left > hud.right || actions.bottom < hud.top || actions.top > hud.bottom);

    return {
      joystick: { width: joystick?.width, height: joystick?.height, bottom: joystick?.bottom },
      actions: { width: actions?.width, height: actions?.height, bottom: actions?.bottom },
      hud: { top: hud?.top, height: hud?.height },
      joyOverlapHud,
      actionsOverlapHud
    };
  });
  result.checks.landscapeLayout = layoutCheck;

  // Screenshot in landscape
  await page.screenshot({ path: `${outDir}/android-landscape.png` });

  // Final validation
  result.pass = (
    result.errors.length === 0 &&
    result.checks.viewportPreventsZoom &&
    result.checks.touchClassApplied &&
    result.checks.joystickMovedPlayer &&
    result.checks.sprintButtonActive &&
    result.checks.isMounted &&
    result.checks.jumpShowsAscendWhenMounted &&
    result.checks.downActiveWhenMounted &&
    result.checks.flightAirborne &&
    !result.checks.landedAirborne &&
    result.checks.dismountSuccess
  );

  console.log('\n=== ANDROID MOBILE VERIFICATION RESULT ===');
  console.log('PASS:', result.pass);
  console.log('Errors:', result.errors);
  console.log('Distance Walked:', result.checks.distanceWalkedViaJoystick);
  console.log('Flight Altitude:', result.checks.flightAltitude);
  console.log('Screenshots saved to', outDir);

} catch (err) {
  result.error = err.message;
  console.error('Test execution failed:', err);
} finally {
  await writeFile(`${outDir}/android-mobile-browser.json`, JSON.stringify(result, null, 2));
  await browser.close();
  await vite.close();
}
