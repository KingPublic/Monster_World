# HUD Specification

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 11, 21, and 23.

The HUD should be clean, readable, modern, polished, fantasy themed, and appropriate for desktop/mobile without excessive clutter. Expected information includes Coins/resources, stamina, hold-to-use Boost, carry count, current dragon, and tutorial objectives.

## Confirmed Input

- On foot: **Hold Left Shift = Sprint**.
- Riding: **Hold Left Shift = Dragon Boost**.
- Mobile: dedicated **HOLD Boost** button.

Boost increases flight speed, drains stamina substantially faster while held, and smoothly returns toward normal speed after release. Exact mobile button sizing is implementation-dependent. Other inputs, stamina rates, and resource mechanics remain TBD.

## Active References

- [HUD-v1.png](../../REFERENCES/GUI/HUD-v1.png): tutorial card and information grouping.
- [HUD-v2.png](../../REFERENCES/GUI/HUD-v2.png): existing alternate tutorial composition and Shift prompt.
- [Flight-hud-v1.png](../../REFERENCES/GUI/Flight-hud-v1.png): mounted information, return objective, pursuit warning, stamina/carry/current mount.
- [Mobile-HUD-v1.png](../../REFERENCES/GUI/Mobile-HUD-v1.png): broad touch-control placement and dedicated held Boost.

Preserve all filenames/versions; this pass does not retire either HUD variation. Q in HUD-v1 does not override confirmed Left Shift. A bar near the guardian is not an approved HP system; a displayed Boost bar does not establish a separate resource. Image numbers, balances, ranges, premium currency, extra controls, or minimaps are not canonical.

## Tutorial and Growth Presentation

Tutorial objectives now include Hatch Baby → explain hunger → free Starter Food → Feed → Growth Progress → rideable Young/Juvenile → first mount → basic flight. Baby is not immediately mountable. Growth Progress can appear where appropriate; final placement/layout and pixel values remain TBD.

See [Reference Index](../../REFERENCES/REFERENCE_INDEX.md), [Tutorial](../GAMEPLAY/TUTORIAL_FLOW.md), and [Growth](../DRAGONS/DRAGON_GROWTH.md). No GUI is implemented in this pass.
