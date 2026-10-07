# Input and Controls

Task 00 provides a temporary orbit inspection camera only: mouse drag or one-finger drag to orbit, wheel/pinch to zoom, right-drag or two-finger drag to pan. Keyboard-focusable HTML buttons select Sanctuary, whole-world, Dragon showcase and individual marker views. They reposition the inspection camera only and never teleport a player. Native OrbitControls are [documented here](https://threejs.org/docs/pages/OrbitControls.html).

The canvas fills the viewport and uses touch-action none to avoid page scroll. Overlay controls remain usable at narrow/landscape sizes, with visible focus, adequately sized targets and safe-area spacing. Canvas/camera resize and pixel-ratio cap are technical foundation behavior, not final mobile controls.

Future approved Dragon gameplay uses held Left Shift for on-foot Sprint and mounted Boost, plus a dedicated mobile HOLD Boost button. Boost releases smoothly and consumes stamina faster. Other mappings, player/flight controllers, interaction keys, gamepad support and final mobile layout remain TBD. Historical prototype keys do not silently become web requirements. Task 00 implements no player movement, mounting or flight.
