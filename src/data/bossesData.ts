import { BloxBoss } from '../types/bloxfruits';

export const BLOX_BOSSES_DATABASE: BloxBoss[] = [
  // ==========================================================
  // RAID BOSSES (14 TOTAL: 1 SEA 1 · 4 SEA 2 · 9 SEA 3)
  // ==========================================================
  {
    id: 'rip_indra',
    name: 'rip_indra (True Form)',
    level: 5000,
    sea: 3,
    location: 'Sea Castle (Third Sea)',
    respawnTime: 'Manual Spawn (God’s Chalice + 3 Legendary Haki Aura buttons)',
    isRaidBoss: true,
    strategy:
      'Blinds the entire server in dense white fog and unleashes Dark Blade V3 slashes. Stay airborne or keep range with Portal/Buddha teams. Defeating him activates Sea Castle portals and opens the Tushita secret waterfall door!',
    rewards: {
      beli: '$100,000',
      exp: '250,000,000 EXP',
    },
    drops: [
      { name: 'Valkyrie Helm', chance: '100%', type: 'Accessory' },
      { name: 'Dark Dagger', chance: '2.5%', type: 'Sword' },
      { name: 'Castle Portals + Tushita Door', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'tyrant_of_the_skies',
    name: 'Tyrant of the Skies',
    level: 2600,
    sea: 3,
    location: 'Tiki Outpost Shrine (Third Sea)',
    respawnTime: 'Manual / Event Trigger (Destroy Tiki Eagle Eyes)',
    isRaidBoss: true,
    strategy:
      'Massive avian raid boss atop Tiki Outpost. Uses wide aerial cyclone barrages and dive-bombs—bring high-mobility Fruits or Sharkman/Sanguine sustain.',
    rewards: {
      beli: '$150,000',
      exp: '260,000,000 EXP',
    },
    drops: [
      { name: 'Eagle Feather / Moonstone', chance: 'High', type: 'Material' },
      { name: 'Prehistoric & Tiki Upgrade Materials', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'leviathan',
    name: 'Leviathan',
    level: 2500,
    sea: 3,
    location: 'Rough Sea (Danger Level 6 · Frozen Dimension)',
    respawnTime: 'Spy NPC "Frozen Dimension" + 5 Player Boat Crew',
    isRaidBoss: true,
    strategy:
      'Colossal abyssal sea serpent whose armor segments must be shattered before piercing the core. Requires Beast Hunter boat harpoon to retrieve the Leviathan Heart back at Tiki Outpost.',
    rewards: {
      beli: '$250,000',
      exp: '300,000,000 EXP',
    },
    drops: [
      { name: 'Leviathan Heart (Harpoon required)', chance: '100%', type: 'Material' },
      { name: 'Leviathan Scales', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'dough_king',
    name: 'Dough King',
    level: 2300,
    sea: 3,
    location: 'Cake Land Dimensional Mirror (Sea of Treats)',
    respawnTime: 'Manual Spawn (500 NPCs defeated + Sweet Chalice)',
    isRaidBoss: true,
    strategy:
      'Uses awakened Dough moves with devastating AoE knockback. Equip Buddha + Shark V3/V4 and coordinate 5+ players to split aggro.',
    rewards: {
      beli: '$50,000',
      exp: '140,000,000 EXP',
    },
    drops: [
      { name: 'Mirror Fractal (Race V4)', chance: '100%', type: 'Item' },
      { name: 'Red Key (Dough Raid)', chance: '100%', type: 'Item' },
      { name: 'Spikey Trident', chance: '15%', type: 'Sword' },
      { name: 'Pale Scarf', chance: '100%', type: 'Accessory' },
    ],
  },
  {
    id: 'cake_prince',
    name: 'Cake Prince',
    level: 2300,
    sea: 3,
    location: 'Cake Land Dimensional Mirror (Sea of Treats)',
    respawnTime: 'Manual Spawn (500 NPCs defeated + talk to drip_mama)',
    isRaidBoss: true,
    strategy:
      'Standard version of the Cake Dimension raid without Sweet Chalice. Uses Pastry River and Dough Fist Barrage—watch for the summon animation.',
    rewards: {
      beli: '$30,000',
      exp: '100,000,000 EXP',
    },
    drops: [
      { name: 'Pale Scarf', chance: '100%', type: 'Accessory' },
      { name: 'Spikey Trident', chance: '5–10%', type: 'Sword' },
      { name: 'Fragments (1,000)', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'soul_reaper',
    name: 'Soul Reaper',
    level: 2100,
    sea: 3,
    location: 'Haunted Castle Crypt (Third Sea)',
    respawnTime: 'Manual Spawn (Hallow Essence on Altar)',
    isRaidBoss: true,
    strategy:
      'Roll Hallow Essence from Death King using Bones, then place it on the Crypt Altar. Essential for Hallow Scythe and the "Fear the Reaper" CDK trial!',
    rewards: {
      beli: '$45,000',
      exp: '95,000,000 EXP',
    },
    drops: [
      { name: 'Hallow Scythe', chance: '5%', type: 'Sword' },
      { name: 'Holy Crown', chance: '100%', type: 'Accessory' },
    ],
  },
  {
    id: 'terror_shark',
    name: 'Terror Shark',
    level: 2000,
    sea: 3,
    location: 'Sea Danger Levels 2 – 6',
    respawnTime: 'Random Sea Event Encounter',
    isRaidBoss: true,
    strategy:
      'Aggressive 150k HP sea predator that inflicts Terror vision blur and drags players underwater. Kite from mid-air with Awakened Magma, Buddha, or Dragonstorm.',
    rewards: {
      beli: '$75,000',
      exp: '85,000,000 EXP',
    },
    drops: [
      { name: 'Terror Eyes', chance: '50%', type: 'Material' },
      { name: 'Mutant Tooth', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'anchored_terrorshark',
    name: 'Anchored Terrorshark',
    level: 2000,
    sea: 3,
    location: 'Sea Danger Levels 2 – 6 (Monster Magnet Active)',
    respawnTime: 'Guaranteed when carrying Monster Magnet craft',
    isRaidBoss: true,
    strategy:
      'Empowered 195k HP Terror Shark variant tethered to the Shark Anchor. Whoever triggers it with Monster Magnet guarantees the Mythical Shark Anchor drop!',
    rewards: {
      beli: '$90,000',
      exp: '110,000,000 EXP',
    },
    drops: [
      { name: 'Shark Anchor (Monster Magnet owner)', chance: '100%', type: 'Sword' },
      { name: 'Terror Eyes & Mutant Tooth', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'rumbling_waters',
    name: 'Rumbling Waters (Triple Sea Beasts)',
    level: 1750,
    sea: 3,
    location: 'Sea Danger Levels 1 – 6 (Ocean Event)',
    respawnTime: 'Random Ocean Event Encounter',
    isRaidBoss: true,
    strategy:
      'Spawns three synchronized Sea Beasts simultaneously in a raging storm. Awakened Magma Z/V melts all three HP bars for huge Beli, Fragments, and Fist of Darkness.',
    rewards: {
      beli: '$300,000+ Total',
      exp: '90,000,000 EXP',
    },
    drops: [
      { name: 'Fist of Darkness / Leviathan Shield Parts', chance: 'Rare', type: 'Material' },
      { name: 'Top Hat / Choppa Hat', chance: '10%', type: 'Accessory' },
    ],
  },
  {
    id: 'cursed_captain',
    name: 'Cursed Captain',
    level: 1325,
    sea: 2,
    location: 'Cursed Ship (Dining Hall · Second Sea)',
    respawnTime: 'Spawns every 3rd night (33% night cycle chance)',
    isRaidBoss: true,
    strategy:
      'Appears inside the ghostly Cursed Ship when night falls. Wields Midnight Blade slashes—farm him for Ectoplasm and the Hellfire Torch to unlock Ghoul Race.',
    rewards: {
      beli: '$25,000',
      exp: '55,000,000 EXP',
    },
    drops: [
      { name: 'Hellfire Torch (Ghoul Race Unlock)', chance: '1–2%', type: 'Item' },
      { name: 'Ectoplasm (10–15)', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'order_law',
    name: 'Order (Trafalgar Law)',
    level: 1250,
    sea: 2,
    location: 'Hot and Cold · Secret Lab Chamber',
    respawnTime: 'Manual Spawn (1,000 Fragment Microchip from Arithmeth)',
    isRaidBoss: true,
    strategy:
      'Teleports inside a massive Control Room dome and slices targets cleanly. Stay close with Buddha M1s or stun-lock immediately upon spawn.',
    rewards: {
      beli: '$35,000',
      exp: '60,000,000 EXP',
    },
    drops: [
      { name: 'Koko (Mythical/Legendary Sword)', chance: '5–10%', type: 'Sword' },
      { name: 'Zebra Cap', chance: '10–15%', type: 'Accessory' },
      { name: 'Core Brain (Cyborg Race · w/ Fist)', chance: '2.5%', type: 'Item' },
    ],
  },
  {
    id: 'factory_core',
    name: 'Factory Core Raid',
    level: 1000,
    sea: 2,
    location: 'Kingdom of Rose · Factory (Second Sea)',
    respawnTime: 'Server Event every 1 Hour 30 Minutes',
    isRaidBoss: true,
    strategy:
      'Server-wide DPS race to break the locked Factory Core within 5 minutes. Highest damage dealer wins a guaranteed Physical Blox Fruit!',
    rewards: {
      beli: '$50,000',
      exp: '40,000,000 EXP',
    },
    drops: [
      { name: 'Random Physical Blox Fruit (Top DPS)', chance: '100%', type: 'Item' },
      { name: 'Acidum Rifle', chance: '10%', type: 'Item' },
    ],
  },
  {
    id: 'darkbeard',
    name: 'Darkbeard (Blackbeard)',
    level: 1000,
    sea: 2,
    location: 'Dark Arena (Second Sea)',
    respawnTime: 'Manual Spawn (Insert Fist of Darkness into Altar)',
    isRaidBoss: true,
    strategy:
      'Combines Dark black holes with Quake tremors. Keep elevated in the air and coordinate burst combos—guaranteed Dark Fragment drop for Race V3 & Skull Guitar.',
    rewards: {
      beli: '$50,000',
      exp: '70,000,000 EXP',
    },
    drops: [
      { name: 'Dark Coat', chance: '2%', type: 'Accessory' },
      { name: 'Dark Fragment', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'greybeard',
    name: 'Greybeard (Whitebeard)',
    level: 750,
    sea: 1,
    location: 'Marine Fortress (First Sea)',
    respawnTime: 'Server Timer every 6 Hours',
    image: '/assets/aistudio/image_e51d7cc9.png',
    isRaidBoss: true,
    strategy:
      'Highest-level First Sea boss with colossal Quake waves. Stay above ground level and strike between his Quake punch slams to unlock Bisento V2.',
    rewards: {
      beli: '$50,000',
      exp: '45,000,000 EXP',
    },
    drops: [
      { name: 'Bisento V2 Upgrade (if Bisento owned)', chance: '100%', type: 'Sword' },
      { name: '+1–3 Levels & Huge Beli', chance: '100%', type: 'Item' },
    ],
  },

  // ==========================================================
  // REGULAR BOSSES (34 TOTAL: 16 SEA 1 · 7 SEA 2 · 11 SEA 3)
  // ==========================================================
  // --- THIRD SEA REGULAR BOSSES (11) ---
  {
    id: 'cursed_skeleton',
    name: 'Cursed Skeleton',
    level: 2200,
    sea: 3,
    location: 'Floating Turtle Mansion (Crypt Master Chamber)',
    respawnTime: 'Quest Trial Spawn (All 6 Alucard Fragments)',
    image: '/assets/aistudio/image_e45723c2.png',
    isRaidBoss: false,
    strategy:
      'Final boss of the Cursed Dual Katana puzzle. Can only be damaged cleanly by Yama, Tushita, or CDK skills—kite in circles inside the crypt room.',
    rewards: {
      beli: '$40,000',
      exp: '90,000,000 EXP',
    },
    drops: [
      { name: 'Cursed Dual Katana (CDK)', chance: '100%', type: 'Sword' },
    ],
  },
  {
    id: 'cake_queen',
    name: 'Cake Queen',
    level: 2175,
    sea: 3,
    location: 'Ice Cream Land (Sea of Treats · Third Sea)',
    respawnTime: '30 Minutes',
    image: '/assets/aistudio/image_34e074cf.png',
    isRaidBoss: false,
    strategy:
      'Wields the Buddy Sword with fast lightning-fire slashes. Also required as the final target for the "Soulless" Tushita CDK trial!',
    rewards: {
      beli: '$30,000',
      exp: '110,000,000 EXP',
    },
    drops: [
      { name: 'Buddy Sword', chance: '5%', type: 'Sword' },
    ],
  },
  {
    id: 'longma',
    name: 'Longma',
    level: 2000,
    sea: 3,
    location: 'Floating Turtle Secret Temple (Third Sea)',
    respawnTime: '30 Minutes',
    image: '/assets/aistudio/image_75840d2d.png',
    isRaidBoss: false,
    strategy:
      'Unlocked permanently behind the secret temple door after lighting all 5 Holy Torches during rip_indra’s fog. Uses fast Tushita dash slashes.',
    rewards: {
      beli: '$30,000',
      exp: '85,000,000 EXP',
    },
    drops: [
      { name: 'Tushita (Legendary Sword)', chance: '100%', type: 'Sword' },
    ],
  },
  {
    id: 'beautiful_pirate',
    name: 'Beautiful Pirate',
    level: 1950,
    sea: 3,
    location: 'Hydra / Floating Turtle Secret Cavern (Third Sea)',
    respawnTime: '30 Minutes',
    image: '/assets/aistudio/image_6357fc24.png',
    isRaidBoss: false,
    strategy:
      'Dashes swiftly across his underground arena with Canvander thrusts. Defeating him opens his personal portal shortcuts back to Mansion.',
    rewards: {
      beli: '$25,000',
      exp: '78,000,000 EXP',
    },
    drops: [
      { name: 'Canvander (Legendary Sword)', chance: '5%', type: 'Sword' },
    ],
  },
  {
    id: 'captain_elephant',
    name: 'Captain Elephant',
    level: 1875,
    sea: 3,
    location: 'Floating Turtle · Mansion Courtyard (Third Sea)',
    respawnTime: '30 Minutes',
    image: '/assets/aistudio/image_d653e141.png',
    isRaidBoss: false,
    strategy:
      'Required for the Citizen Quest (Musketeer Hat & Instinct V2). Bait him onto the stone courtyard steps for safe M1 grinding.',
    rewards: {
      beli: '$25,000',
      exp: '80,000,000 EXP',
    },
    drops: [
      { name: 'Twin Hooks', chance: '5%', type: 'Sword' },
    ],
  },
  {
    id: 'diablo',
    name: 'Diablo (Elite Pirate)',
    level: 1750,
    sea: 3,
    location: 'Random Third Sea Island (Elite Hunter Tracked)',
    respawnTime: '10 Minutes (Shared Elite Timer)',
    isRaidBoss: false,
    strategy:
      'Elite Pirate wielding Awakened Dark pulls and teleport slams. Defeat 30 combined Elites to pull Yama safely!',
    rewards: {
      beli: '$15,000',
      exp: '35,000,000 EXP',
    },
    drops: [
      { name: 'God’s Chalice', chance: '1–2%', type: 'Item' },
      { name: 'Hunter Cape / Bandanna', chance: '10%', type: 'Accessory' },
      { name: '100 Fragments', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'deandre',
    name: 'Deandre (Elite Pirate)',
    level: 1750,
    sea: 3,
    location: 'Random Third Sea Island (Elite Hunter Tracked)',
    respawnTime: '10 Minutes (Shared Elite Timer)',
    isRaidBoss: false,
    strategy:
      'Elite Pirate casting Awakened Magma eruptions. Counts toward Yama’s 30 Elite kill requirement and awards 100 Fragments.',
    rewards: {
      beli: '$15,000',
      exp: '35,000,000 EXP',
    },
    drops: [
      { name: 'God’s Chalice', chance: '1–2%', type: 'Item' },
      { name: 'Hunter Cape / Bandanna', chance: '10%', type: 'Accessory' },
      { name: '100 Fragments', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'urban',
    name: 'Urban (Elite Pirate)',
    level: 1750,
    sea: 3,
    location: 'Random Third Sea Island (Elite Hunter Tracked)',
    respawnTime: '10 Minutes (Shared Elite Timer)',
    isRaidBoss: false,
    strategy:
      'Elite Pirate casting Awakened Rumble lightning strikes. Keep Rubber or Flash Step ready to dodge his telegraphed stun.',
    rewards: {
      beli: '$15,000',
      exp: '35,000,000 EXP',
    },
    drops: [
      { name: 'God’s Chalice', chance: '1–2%', type: 'Item' },
      { name: 'Hunter Cape / Bandanna', chance: '10%', type: 'Accessory' },
      { name: '100 Fragments', chance: '100%', type: 'Material' },
    ],
  },
  {
    id: 'kilo_admiral',
    name: 'Kilo Admiral',
    level: 1750,
    sea: 3,
    location: 'Great Tree Plateau (Third Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Uses Umbrella/Weight slams that knock players away. Great quest boss atop Great Tree before moving to Floating Turtle.',
    rewards: {
      beli: '$25,000',
      exp: '72,000,000 EXP',
    },
    drops: [
      { name: 'Lei (Health Regen Accessory)', chance: '10%', type: 'Accessory' },
    ],
  },
  {
    id: 'island_empress',
    name: 'Island Empress',
    level: 1675,
    sea: 3,
    location: 'Hydra Island · Empress Palace (Third Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Fights with Love-fruit charmed hearts and kicks inside Hydra Palace. Farm her for the Venom Bow!',
    rewards: {
      beli: '$25,000',
      exp: '68,000,000 EXP',
    },
    drops: [
      { name: 'Venom Bow (Serpent Bow)', chance: '10%', type: 'Item' },
    ],
  },
  {
    id: 'stone',
    name: 'Stone',
    level: 1550,
    sea: 3,
    location: 'Port Town Fortress (Third Sea)',
    respawnTime: '30 Minutes',
    image: '/assets/aistudio/stone_boss.jpg',
    isRaidBoss: false,
    strategy:
      'First Third Sea boss encountered right at Port Town. Uses Flame blasts—drops one of the best speed accessories in the game (Pilot Helmet).',
    rewards: {
      beli: '$25,000',
      exp: '58,000,000 EXP',
    },
    drops: [
      { name: 'Pilot Helmet (+130% Speed)', chance: '10%', type: 'Accessory' },
    ],
  },

  // --- SECOND SEA REGULAR BOSSES (7) ---
  {
    id: 'tide_keeper',
    name: 'Tide Keeper',
    level: 1475,
    sea: 2,
    location: 'Forgotten Island (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Summons a Sea Beast minion and wields Dragon Trident. Pull Tide Keeper onto the high cliff shore to bypass the minion safely.',
    rewards: {
      beli: '$25,000',
      exp: '65,000,000 EXP',
    },
    drops: [
      { name: 'Water Key (Sharkman Karate)', chance: '15%', type: 'Item' },
      { name: 'Dragon Trident', chance: '10%', type: 'Sword' },
    ],
  },
  {
    id: 'awakened_ice_admiral',
    name: 'Awakened Ice Admiral',
    level: 1400,
    sea: 2,
    location: 'Ice Castle Throne Room (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Casts Awakened Ice surges and freezes the room floor. Drops both the Hidden Key (Rengoku) and Library Key (Death Step)!',
    rewards: {
      beli: '$25,000',
      exp: '58,000,000 EXP',
    },
    drops: [
      { name: 'Hidden Key (Rengoku Sword)', chance: '5–10%', type: 'Item' },
      { name: 'Library Key (Death Step)', chance: '15%', type: 'Item' },
    ],
  },
  {
    id: 'smoke_admiral',
    name: 'Smoke Admiral',
    level: 1150,
    sea: 2,
    location: 'Hot and Cold · Hot Volcano Side (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Uses Smoke Bomber flights and grabs. Keep mid-distance with Sword/Fruit M1s inside the volcanic pit.',
    rewards: {
      beli: '$20,000',
      exp: '42,000,000 EXP',
    },
    drops: [
      { name: 'Flail (Jitte)', chance: '10%', type: 'Sword' },
    ],
  },
  {
    id: 'don_swan',
    name: 'Don Swan',
    level: 1000,
    sea: 2,
    location: 'Swan Mansion (Secret Boss Room)',
    respawnTime: '30 Minutes (Requires $1M+ Fruit to Trevor)',
    isRaidBoss: false,
    strategy:
      'Two-phase boss utilizing Awakened Spider strings. Mandatory defeat before Arowe unlocks Race V3 and Captain unlocks Third Sea.',
    rewards: {
      beli: '$35,000',
      exp: '45,000,000 EXP',
    },
    drops: [
      { name: 'Swan Glasses', chance: '2.5%', type: 'Accessory' },
      { name: 'Third Sea / Race V3 Quest Progress', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'fajita',
    name: 'Orbitus (Fajita)',
    level: 925,
    sea: 2,
    location: 'Green Zone Crater (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Pulls targets down with Gravity Blade meteors. Jump immediately whenever his Gravity Crush circle appears.',
    rewards: {
      beli: '$20,000',
      exp: '28,000,000 EXP',
    },
    drops: [
      { name: 'Gravity Blade (Gravity Cane)', chance: '5%', type: 'Sword' },
    ],
  },
  {
    id: 'jeremy',
    name: 'Jeremy',
    level: 850,
    sea: 2,
    location: 'Kingdom of Rose Mountain Peak (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'Spring-fruit bouncer required for Bartilo’s Colosseum quest. Stays near the upper stone cliff ridge.',
    rewards: {
      beli: '$20,000',
      exp: '20,000,000 EXP',
    },
    drops: [
      { name: 'Black Spikey Coat', chance: '10%', type: 'Accessory' },
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    level: 750,
    sea: 2,
    location: 'Kingdom of Rose · Sunflower Hill (Second Sea)',
    respawnTime: '30 Minutes',
    isRaidBoss: false,
    strategy:
      'First Second Sea boss. Activates Diamond armor reducing physical damage—use high-combo Fruit skills to break through.',
    rewards: {
      beli: '$15,000',
      exp: '14,000,000 EXP',
    },
    drops: [
      { name: 'Longsword', chance: '5%', type: 'Sword' },
    ],
  },

  // --- FIRST SEA REGULAR BOSSES (16) ---
  {
    id: 'ice_admiral',
    name: 'Ice Admiral',
    level: 700,
    sea: 1,
    location: 'Frozen Village Secret Ice Chamber (First Sea)',
    respawnTime: '5 Minutes (Unlocked by Prison Detective Key)',
    image: '/assets/aistudio/image_a97f6bdd.png',
    isRaidBoss: false,
    strategy:
      'Mandatory Level 700 boss needed to unlock Second Sea passage. Hide behind the wooden cave doorway frame if you are soloing right at Lv 700.',
    rewards: {
      beli: '$15,000',
      exp: '1,200,000 EXP',
    },
    drops: [
      { name: 'Second Sea Passage Clearance', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'cyborg_boss',
    name: 'Cyborg (Franky)',
    level: 675,
    sea: 1,
    location: 'Fountain City (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_84b18bea.png',
    isRaidBoss: false,
    strategy:
      'Highest quested First Sea boss. Deals high missile knockback—corner him against the fountain wall.',
    rewards: {
      beli: '$20,000',
      exp: '7,000,000 EXP',
    },
    drops: [
      { name: 'Cool Shades', chance: '2%', type: 'Accessory' },
    ],
  },
  {
    id: 'thunder_god',
    name: 'Thunder God (Enel)',
    level: 575,
    sea: 1,
    location: 'Upper Skylands Temple (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_f16ec7c2.png',
    isRaidBoss: false,
    strategy:
      'Casts Rumble lightning pillars across the temple dome. Rubber fruit renders you 100% immune to his elemental attacks!',
    rewards: {
      beli: '$20,000',
      exp: '4,500,000 EXP',
    },
    drops: [
      { name: 'Pole (1st Form)', chance: '5%', type: 'Sword' },
    ],
  },
  {
    id: 'wysper',
    name: 'Wysper',
    level: 500,
    sea: 1,
    location: 'Upper Skylands Ruin Plaza (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_823ceef5.png',
    isRaidBoss: false,
    strategy:
      'Fires explosive Bazooka blasts at mid-range. Dash behind his shoulder before casting burst moves.',
    rewards: {
      beli: '$15,000',
      exp: '3,000,000 EXP',
    },
    drops: [
      { name: 'Bazooka', chance: '5–10%', type: 'Item' },
    ],
  },
  {
    id: 'fishman_lord',
    name: 'Fishman Lord',
    level: 425,
    sea: 1,
    location: 'Underwater City Palace (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_0f9e4765.png',
    isRaidBoss: false,
    strategy:
      'Uses Water Kung Fu blasts and long Trident sweeps inside the dome. Great boss to farm from Level 425 to 475.',
    rewards: {
      beli: '$15,000',
      exp: '2,100,000 EXP',
    },
    drops: [
      { name: 'Trident', chance: '10%', type: 'Sword' },
    ],
  },
  {
    id: 'magma_admiral',
    name: 'Magma Admiral',
    level: 350,
    sea: 1,
    location: 'Magma Village Volcano Summit (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_c75c2b10.png',
    isRaidBoss: false,
    strategy:
      'Drops lava puddles around the crater floor. Fight from the outer stone rim with ranged abilities.',
    rewards: {
      beli: '$15,000',
      exp: '1,300,000 EXP',
    },
    drops: [
      { name: 'Magma Blaster (Refined Musket)', chance: '10%', type: 'Item' },
    ],
  },
  {
    id: 'chief_warden',
    name: 'Chief Warden',
    level: 230,
    sea: 1,
    location: 'Prison Island Front Hall (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_a30bfbc4.png',
    imageFit: 'contain',
    isRaidBoss: false,
    strategy:
      'Heavy melee strikes inside Prison courtyard. Part of the famous "server-hop Prison bosses" grinding method.',
    rewards: {
      beli: '$10,000',
      exp: '700,000 EXP',
    },
    drops: [
      { name: 'Warden’s Sword', chance: '10%', type: 'Sword' },
    ],
  },
  {
    id: 'warden',
    name: 'Warden',
    level: 220,
    sea: 1,
    location: 'Prison Island Courtyard (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_6aa9cc1d.png',
    imageFit: 'contain',
    isRaidBoss: false,
    strategy:
      'First of the three Prison courtyard bosses. Simple M1 kite with Light, Ice, or Flame.',
    rewards: {
      beli: '$6,000',
      exp: '600,000 EXP',
    },
    drops: [
      { name: 'Guaranteed Beli & Fast Leveling EXP', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'saber_expert',
    name: 'Saber Expert (Shanks)',
    level: 200,
    sea: 1,
    location: 'Jungle Secret Basement Temple (First Sea)',
    respawnTime: '30 Minutes (After Jungle 5-Button & Relic Quest)',
    image: '/assets/aistudio/image_daa7be73.png',
    isRaidBoss: false,
    strategy:
      'High-damage sword boss capable of two-shotting low-level players. Pull him to the narrow stairs so he gets stuck while you strike!',
    rewards: {
      beli: '$10,000',
      exp: '180,000 EXP',
    },
    drops: [
      { name: 'Saber (Legendary Sword)', chance: '100%', type: 'Sword' },
    ],
  },
  {
    id: 'vice_admiral',
    name: 'Vice Admiral',
    level: 130,
    sea: 1,
    location: 'Marine Fortress (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_1f82387c.png',
    isRaidBoss: false,
    strategy:
      'Guards the upper Marine courtyard. Drops the Coat accessory (+10% Melee damage & +200 Energy).',
    rewards: {
      beli: '$15,000',
      exp: '210,000 EXP',
    },
    drops: [
      { name: 'Marine Coat', chance: '10%', type: 'Accessory' },
    ],
  },
  {
    id: 'mob_leader',
    name: 'Mob Leader',
    level: 120,
    sea: 1,
    location: 'Middle Town Tiny Island (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_f2b27fba.png',
    isRaidBoss: false,
    strategy:
      'Hidden on the small island outside Middle Town harbor. Required step in the Rich Man Saber Expert quest!',
    rewards: {
      beli: '$10,000',
      exp: '160,000 EXP',
    },
    drops: [
      { name: 'Rich Man Saber Quest Stolen Loot', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'yeti',
    name: 'Yeti',
    level: 105,
    sea: 1,
    location: 'Frozen Village Plateau (First Sea)',
    respawnTime: '20 Minutes',
    image: '/assets/aistudio/image_fcbbda31.png',
    isRaidBoss: false,
    strategy:
      'Uses Ice stomp knockbacks near the village houses. Kite along the lower snow ridge for easy kills.',
    rewards: {
      beli: '$10,000',
      exp: '125,000 EXP',
    },
    drops: [
      { name: 'Yeti Fur', chance: '10%', type: 'Accessory' },
    ],
  },
  {
    id: 'the_saw',
    name: 'The Saw',
    level: 100,
    sea: 1,
    location: 'Middle Town Docks (First Sea)',
    respawnTime: 'Every 75 Minutes',
    image: '/assets/aistudio/image_5da483a3.png',
    isRaidBoss: false,
    strategy:
      'Spawns inside Middle Town every 75 minutes with rapid spinning Shark Saw lunges. Climb onto Middle Town building roofs to chip safely.',
    rewards: {
      beli: '$12,000',
      exp: '110,000 EXP',
    },
    drops: [
      { name: 'Shark Saw', chance: '10%', type: 'Sword' },
    ],
  },
  {
    id: 'awakened_gorilla_king',
    name: 'Awakened Gorilla King',
    level: 60,
    sea: 1,
    location: 'Jungle Island · Banana Tree Arena (First Sea)',
    respawnTime: 'Secret Spawn (Shake Banana Tree until overflowing)',
    image: '/assets/aistudio/image_475097b4.png',
    isRaidBoss: false,
    strategy:
      'Empowered secret Jungle boss triggered by M1-shaking the special Banana Tree near the Gorilla King ridge. Uses faster heavy shockwave slams and rewards Jungle Star progression.',
    rewards: {
      beli: '$8,500',
      exp: '55,000 EXP',
    },
    drops: [
      { name: 'Jungle Star Secret Progress', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'bobby',
    name: 'Bobby (The Clown)',
    level: 55,
    sea: 1,
    location: 'Pirate Village Center (First Sea)',
    respawnTime: '15 Minutes',
    image: '/assets/aistudio/image_63b41940.png',
    isRaidBoss: false,
    strategy:
      'Immune to un-Aura Sword hits thanks to his Chop passive! Use Fighting Style M1s or Fruit skills instead of Katanas.',
    rewards: {
      beli: '$8,000',
      exp: '45,000 EXP',
    },
    drops: [
      { name: 'Early Pirate Village EXP & Beli', chance: '100%', type: 'Item' },
    ],
  },
  {
    id: 'the_gorilla_king',
    name: 'The Gorilla King',
    level: 20,
    sea: 1,
    location: 'Jungle Island Back Ridge (First Sea)',
    respawnTime: '10 Minutes',
    image: '/assets/aistudio/image_be3e1e79.png',
    isRaidBoss: false,
    strategy:
      'The very first island boss in Blox Fruits. Circle-strafe his ground slams for fast starter Beli and Jungle levels.',
    rewards: {
      beli: '$2,000',
      exp: '9,500 EXP',
    },
    drops: [
      { name: 'Starter Boss EXP & Beli', chance: '100%', type: 'Item' },
    ],
  },
];
