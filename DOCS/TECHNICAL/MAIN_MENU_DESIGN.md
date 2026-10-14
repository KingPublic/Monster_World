# Monster World illustrated menu — current user preference,2026-10-13–14

The user first requested a bespoke moving start screen, then explicitly preferred **no3DDragon model**: keep the generated panorama and add a good transparent foreground Dragon illustration with gentle motion. This later preference replaces the earlier live-rig design recorded in Task08/report history.

Use the original generated Sanctuary panorama and separately generated RGBA Dragon overlay. CSS float/parallax/mist/motes supply motion; MainMenuScene updates DOM transforms from a smoothed pointer/time. Canvas is hidden during the menu. No menu Scene/model/rig/cache import exists. This is moving illustration, not MP4; illustrated architecture is concept art, not a qualified placed Castle pack.

Retain native Begin/Continue adventure, How to play and Motion controls. Honor live/initial reduced-motion and the separate cosmetic preference, support390×844/320×568/844×390 touch and missing images. No audio/dependencies/awards/menu player movement. Start removes art/listeners, restores canvas/focus/controls and continues the existing save. Recreating Game retains one canvas/controls root.

Implementation: src/ui/MainMenuScene.ts owns art DOM/pointer/time/listeners/canvas-attribute restoration; UIManager owns welcome controls. Game freezes gameplay until Begin. Runtime images reside in public/assets/images/menu; original generated files remain in the tool's generated_images folder. MAIN_MENU_ART_PROMPT/MANIFEST and MAIN_MENU_DRAGON_PROMPT/MANIFEST record provenance/hash. No source/downloaded asset is used as image-generation reference.

Actual illustrated-menu checks passed motion/paused pixels/preference/Help/keyboard/touch/Continue/flight/missing images. Recreation originally exposed an unrelated city procedural fallback-resource leak, corrected with owned-resource disposal and tracked by the final scoped browser run. See SANCTUARY_COMFORT_REPORT/HANDOFF for the current build/evidence and remaining quality limits. Earlier menu performance measurements describe the older live-rig version.
