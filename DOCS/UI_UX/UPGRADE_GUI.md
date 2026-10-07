# Rider Upgrade GUI

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 9–10 and 23.

The GUI covers permanent universal **Speed Multiplier, Stamina Multiplier, Boost Multiplier, and Carry Capacity**. Growth-adjusted dragon base Speed/Stamina/Boost are multiplied by the corresponding rider upgrades; image additive bonuses are not the formula.

Carry levels 1/2/3 hold 1/2/3 eggs, maximum 3. Visual carry is one rider egg; then one rider + one physical dragon egg; then one rider + one egg per talon.

## Active References

[Rider-upgrades-v1.png](../../REFERENCES/GUI/Rider-upgrades-v1.png) guides four-row organization, current/next comparison, readable icons/actions, and fantasy borders. [Dragon-flight-carry-v1.png](../../REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) guides physical carry poses. [Player-nest-services-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) guides the physical upgrade location.

Keep the clean desktop/mobile presentation. Exact prices, currency rules for upgrade purchases, multiplier curves, other level requirements, numerical layouts, and extra image-only categories such as Glide Control remain TBD/unapproved.

See [Rider Upgrades](../CREATURES/DRAGONS/RIDER_UPGRADES.md), [Upgrade Values](../../DATA/RIDER_UPGRADE_VALUES.md), and [Reference Index](../../REFERENCES/REFERENCE_INDEX.md). No shop or GUI implementation occurs here.

The web UI direction uses an HTML/CSS overlay above the Three.js canvas. Task 00 exposes inspection controls only; this gameplay interface remains unimplemented.
