# Input and Controls

[InputSystem](../../src/systems/InputSystem.ts) combines desktop keys and touch pointers. Held actions clear on blur, hidden document, cancellation, panel transitions and teardown. Interactions consume press edges each frame; theft requires a continuous 1.1-second hold.

| Action | Desktop | Touch |
| --- | --- | --- |
| Move / fly | WASD | Virtual joystick |
| Camera yaw / pitch | Mouse drag | Swipe world |
| Sprint / Boost | Hold Left Shift | Hold Sprint / Boost |
| Interact / steal | E / hold E | Tap / hold Interact |
| Jump / ascend | Space | Up / Jump |
| Descend / land | Left Ctrl | Down |
| Dismount when landed | F | Dismount |
| Close panel | Escape | Close button |

[FollowCamera](../../src/systems/FollowCamera.ts) uses smooth third-person tracking, limited pitch, wider mounted distance, banking response and Boost FOV. It does not use OrbitControls. Dragging is intentional; pointer lock/gamepad support are deferred.

The canvas uses touch-action none, mobile controls respect safe areas, and panels cover touch controls while open. An emulated 390×844 touch-device pass verified movement, interaction/mounting and ascent. Physical-device certification and advanced camera collision remain pending.
