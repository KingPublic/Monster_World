/** Original temporary art. These profiles can be replaced by qualified GLBs without changing identity. */
export const adventureDragonProfiles = {
  emberdrake: {
    family: 'Emberdrake', silhouette: 'stout four-legged fire dragon', anatomy: 'quadruped',
    body: [1.42, 1.04, 2.08], bodyY: 2.2, head: [1.03, .87, .99], neck: 1.2,
    tail: 5.8, wing: 6.8, crest: 'flame', horns: 'short',
    skin: 0xb94b38, shade: 0x73392f, belly: 0xffd69c, accent: 0xffa449,
    membrane: 0xec8847, iris: 0xffc75d, roughness: .64, metalness: .03,
  },
  crystalwyvern: {
    family: 'Crystalwyvern', silhouette: 'two-legged wyvern with angular crystal sails', anatomy: 'wyvern',
    body: [.96, .95, 1.85], bodyY: 2.55, head: [.81, .78, 1.08], neck: 1.65,
    tail: 6.4, wing: 8.1, crest: 'crystal', horns: 'spear',
    skin: 0x88c3dc, shade: 0x436b9e, belly: 0xe9f3f4, accent: 0x9cecf1,
    membrane: 0xc2e6ed, iris: 0x4357c5, roughness: .37, metalness: .13,
  },
  stormserpent: {
    family: 'Stormserpent', silhouette: 'long antlered dragon with flowing ribbon fins', anatomy: 'serpent',
    body: [.68, .69, 3.7], bodyY: 2.6, head: [.76, .68, 1.18], neck: 2.55,
    tail: 9.2, wing: 5.7, crest: 'ribbon', horns: 'antler',
    skin: 0x527eaa, shade: 0x334e77, belly: 0xdde7ef, accent: 0x8be4d6,
    membrane: 0x90bcdb, iris: 0xdbd5ff, roughness: .58, metalness: .05,
  },
  suncrest: {
    family: 'Suncrest', silhouette: 'solar mane and layered feather wings', anatomy: 'quadruped',
    body: [1.06, 1.12, 2.06], bodyY: 2.6, head: [.91, .93, .99], neck: 1.65,
    tail: 6.1, wing: 7.9, crest: 'feather', horns: 'crown',
    skin: 0xe2b873, shade: 0x94704b, belly: 0xfff1c4, accent: 0xf5d66e,
    membrane: 0xf8e6af, iris: 0x44796a, roughness: .63, metalness: .06,
  },
  moonveil: {
    family: 'Moonveil', silhouette: 'crescent horns and broad scalloped bat wings', anatomy: 'quadruped',
    body: [1.1, .91, 2.36], bodyY: 2.25, head: [.86, .83, 1.16], neck: 1.45,
    tail: 7.5, wing: 8.5, crest: 'night', horns: 'crescent',
    skin: 0x726693, shade: 0x45445e, belly: 0xcac5de, accent: 0xc8cfed,
    membrane: 0x9990bc, iris: 0x89e5df, roughness: .58, metalness: .04,
  },
  duneback: {
    family: 'Duneback', silhouette: 'heavy desert dragon with overlapping armored plates', anatomy: 'quadruped',
    body: [1.71, .99, 2.45], bodyY: 2.07, head: [1.13, .81, 1.02], neck: .99,
    tail: 5.1, wing: 5.8, crest: 'armor', horns: 'ram',
    skin: 0xba9368, shade: 0x725943, belly: 0xedcfa0, accent: 0xe0b76b,
    membrane: 0xc9b18d, iris: 0x8cd0a1, roughness: .83, metalness: .03,
  },
} as const;

export type AdventureDragonProfileId = keyof typeof adventureDragonProfiles;
export type AdventureDragonProfile = (typeof adventureDragonProfiles)[AdventureDragonProfileId];
export const ADVENTURE_DRAGON_PROFILE_IDS = Object.keys(adventureDragonProfiles) as AdventureDragonProfileId[];
