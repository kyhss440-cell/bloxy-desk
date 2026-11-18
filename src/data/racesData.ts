import { BloxRace } from '../types/bloxfruits';
import dracoImg from '../assets/images/race_draco_showcase_clean.png';
import sharkImg from '../assets/images/race_shark_clean.png';
import angelImg from '../assets/images/race_angel_clean.png';
import rabbitImg from '../assets/images/race_rabbit_clean.png';
import humanImg from '../assets/images/race_human_clean.png';
import ghoulImg from '../assets/images/race_ghoul_clean.png';
import cyborgImg from '../assets/images/race_cyborg_clean.png';

export const BLOX_RACES_DATABASE: BloxRace[] = [
  {
    id: 'draco',
    name: 'Draco',
    lore: 'The legendary Draconic lineage born from primal leviathans. Draco warriors manifest draconic horns, obsidian scales, and ethereal flame wings capable of incinerating foes.',
    image: dracoImg,
    colorScheme: 'from-amber-500 via-orange-600 to-red-800',
    pvpRating: 10,
    mobilityRating: 9,
    defenseRating: 9,
    advantages: [
      'Wyrm Fire passive ignites enemies on any melee or sword strike',
      'Immense damage reduction against fire and elemental attacks',
      'Draconic Flight and aerial dash in V3 & V4',
      'Devastating Dragon Roar that breaks Instinct and stuns',
    ],
    v1: {
      title: 'Draco V1 (Base Bloodline)',
      requirements: 'Rerolled via Tort NPC (3,000 Frags) or 90 Robux.',
      buffs: [
        'Visible dragon crest and subtle horns',
        '+5% base physical melee & sword damage',
        'Slight flame resistance',
      ],
    },
    v2: {
      title: 'Draco V2 (Ignited Heritage)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        '+15% Stamina / Energy pool',
        'Draco Ember passive: melee attacks inflict lingering fire burn damage',
        '+10% Dash distance with fiery visual particle trail',
      ],
    },
    v3: {
      title: 'Draco V3 (Dragon Heart Awakening)',
      requirements: 'Arowe Quest in Sea 2 (Mansion) + 2,000,000 Beli. Defeat 3 raid bosses without dying.',
      buffs: [
        'Skill: "Dragon Roar" (T-Key): Releases a mighty shockwave that strips enemy Instinct (Ken Haki) for 4 seconds',
        '+20% overall damage during roar effect',
        'Cooldown: 30 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time (Third Sea Great Tree), Draco Door',
      trialPuzzle: 'Trial of the Wyrm: Navigate through molten pillars and defeat the Dragon Warden within 60 seconds.',
      transformationName: 'Awakened Ancient Wyrm',
      transformationBuffs: [
        'Sprouts radiant draconic wings of golden flame',
        'Draconic flight with infinite sky dash',
        'Wyrm Fury aura: surrounding enemies take continuous burning tick damage',
        'Damage reduction +25% against all sources',
      ],
      gears: [
        {
          gearName: 'Infernal Wyrm Breath (Gear 1)',
          passiveName: 'Solar Ignition',
          description: 'Attacks shoot fiery shockwaves that reduce enemy health regeneration by 50%.',
        },
        {
          gearName: 'Dragon Scale Carapace (Gear 2)',
          passiveName: 'Impervious Hide',
          description: 'Taking heavy damage triggers a fiery counter-blast, granting 3 seconds of immunity.',
        },
      ],
    },
  },
  {
    id: 'shark',
    name: 'Shark (Fishman)',
    lore: 'Rulers of the open seas. Shark race characters are completely immune to drowning in water, possess unbreakable armored scales, and can withstand catastrophic damage.',
    image: sharkImg,
    colorScheme: 'from-cyan-400 via-blue-600 to-indigo-900',
    pvpRating: 9,
    mobilityRating: 8,
    defenseRating: 10,
    advantages: [
      '100% immune to water damage at V2, even with Devil Fruits!',
      'Unstoppable water swimming speed (faster than boats)',
      'Water Body skill grants 80% damage reduction at V3',
      'V4 grants a Leviathan shield that absorbs thousands of damage points',
    ],
    v1: {
      title: 'Shark V1 (Fishman Base)',
      requirements: 'Starter roll or Tort NPC in Sea 2/3 (3,000 Frags).',
      buffs: [
        'Visible shark fin on the back',
        'Takes significantly reduced damage when submerged in water with a fruit',
        '+100% swimming speed in water',
      ],
    },
    v2: {
      title: 'Shark V2 (Aquatic Mastery)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        'ZERO WATER DAMAGE: Can swim in water infinitely even with any Devil Fruit equipped!',
        'Sprint and swim speed in water tripled',
      ],
    },
    v3: {
      title: 'Shark V3 (Water Body)',
      requirements: 'Arowe Quest in Sea 2. Defeat a Sea Beast + 2,000,000 Beli.',
      buffs: [
        'Skill: "Water Body" (T-Key): Reduces ALL incoming damage by 80% for 6.5 seconds',
        'Prevents being one-shotted by 100-to-0 combos',
        'Cooldown: 30 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Shark Door',
      trialPuzzle: 'Trial of Water: Defeat the Sea King beast within the submerged arena before air runs out.',
      transformationName: 'Leviathan Leviathan Carapace',
      transformationBuffs: [
        'Sprouts great blue shark tail and ocean whirlpool aura',
        'Spawns a massive blue shield that absorbs up to 40% of max health as temporary armor',
        'Attacks apply "Whirlpool" slow debuff onto targets',
        'Immunity to stun effects while shield is active',
      ],
      gears: [
        {
          gearName: 'Whirlpool Field (Gear 1)',
          passiveName: 'Torrential Drag',
          description: 'Walking near enemies slows their movement and dash by 45%.',
        },
        {
          gearName: 'Leviathan Armor (Gear 2)',
          passiveName: 'Abyssal Barrier',
          description: 'Regenerates the water shield continuously every 12 seconds in combat.',
        },
      ],
    },
  },
  {
    id: 'angel',
    name: 'Angel (Skypian)',
    lore: 'Ascended beings from the holy Skylands. Blessed with feathered wings, extraordinary jump heights, holy regeneration, and devastating V4 Heavenly Aura.',
    image: angelImg,
    colorScheme: 'from-amber-200 via-yellow-400 to-sky-300',
    pvpRating: 9,
    mobilityRating: 9,
    defenseRating: 9,
    advantages: [
      'Multi-tier sky jumps to escape combos and snipe from above',
      'Heavenly Blood skill instantly regenerates health and energy',
      'V4 Holy Aura automatically damages and blinds nearby enemies',
      'Wings can fly effortlessly across tall island cliffs',
    ],
    v1: {
      title: 'Angel V1 (Sky Islander)',
      requirements: 'Starter roll or Tort NPC (3,000 Frags).',
      buffs: [
        'Feathered white wings on back',
        'Can jump higher and perform multi-jumps in midair',
      ],
    },
    v2: {
      title: 'Angel V2 (Heavenly Wings)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        'Wings grow larger',
        'Grants +2 extra Geppo/Air jumps and reduced energy consumption for jumping',
        'Fall damage completely eliminated',
      ],
    },
    v3: {
      title: 'Angel V3 (Heavenly Blood)',
      requirements: 'Arowe Quest in Sea 2. Defeat another Angel player + 2,000,000 Beli.',
      buffs: [
        'Skill: "Heavenly Blood" (T-Key): Instantly heals 20% max HP and restores 50% Energy',
        'Increases defense by 15% for 6.5 seconds',
        'Cooldown: 25 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Angel Door',
      trialPuzzle: 'Trial of the Sky: Platform across disappearing holy cloud steps without falling.',
      transformationName: 'Seraphic Deity',
      transformationBuffs: [
        'Six radiant glowing golden wings with floating holy halo',
        'Passive Flight: Hold jump to fly smoothly in any 3D direction',
        'Heavenly Aura: Enemies within 15 studs are constantly struck by divine beams',
        'Restricts enemy jumping and prevents their air escape',
      ],
      gears: [
        {
          gearName: 'Prince of the Skies (Gear 1)',
          passiveName: 'Divine Levitation',
          description: 'Allows perpetual flight without spending energy, firing holy bolts at ground targets.',
        },
        {
          gearName: 'King of the Heavens (Gear 2)',
          passiveName: 'Holy Domain',
          description: 'Aura expands by 50% and drains enemy stamina while restoring user HP.',
        },
      ],
    },
  },
  {
    id: 'rabbit',
    name: 'Rabbit (Mink)',
    lore: 'Agile warriors blessed with the swift spirit of the rabbit. The fastest race in all three seas, capable of outrunning boats and dodging incoming projectiles.',
    image: rabbitImg,
    colorScheme: 'from-amber-300 via-emerald-400 to-teal-700',
    pvpRating: 8,
    mobilityRating: 10,
    defenseRating: 6,
    advantages: [
      'Fastest base movement speed in the game',
      'Dash distance is doubled with zero stamina consumption at V3',
      'V4 Tornado trail leaves tornadoes that trip and stun pursuers',
      'Incredible for bounty hunting, running down runners, and fruit collecting',
    ],
    v1: {
      title: 'Rabbit V1 (Mink Base)',
      requirements: 'Starter roll or Tort NPC (3,000 Frags).',
      buffs: [
        'Bunny ears and rabbit tail',
        '+25% base movement speed',
        'Slightly increased dash distance',
      ],
    },
    v2: {
      title: 'Rabbit V2 (Electro Fleet)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        'Dash distance increased by 50%',
        'Dash energy cost reduced by 50%',
        'Movement speed increased to +50%',
      ],
    },
    v3: {
      title: 'Rabbit V3 (Agility)',
      requirements: 'Arowe Quest in Sea 2. Collect 30 chests in under 60 seconds + 2,000,000 Beli.',
      buffs: [
        'Skill: "Agility" (T-Key): Boosts speed by +100% and makes dash distance enormous for 6.5 seconds',
        'Cooldown: 30 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Rabbit Door',
      trialPuzzle: 'Trial of Speed: Complete a high-speed obstacle maze with laser traps within 60 seconds.',
      transformationName: 'Thunderous Rabbit Overdrive',
      transformationBuffs: [
        'Crackling lightning fur and neon electrical trails',
        'Speed capped at maximum engine velocity (faster than any boat or light flight)',
        'Dashing spawns small tornadoes that fling enemies into the sky',
        'Immunity to movement slows and ice traps',
      ],
      gears: [
        {
          gearName: 'Lightning Flash (Gear 1)',
          passiveName: 'Electro Dash',
          description: 'Dashing through opponents shocks and breaks their Ken Haki.',
        },
        {
          gearName: 'Tempest Strides (Gear 2)',
          passiveName: 'Vortex Step',
          description: 'Spawns larger whirlwinds when chaining 3 or more dashes.',
        },
      ],
    },
  },
  {
    id: 'human',
    name: 'Human',
    lore: 'The indomitable fighting spirit of humanity. While seemingly humble at first, Human V4 awakens the destructive Psycho Rage that delivers the highest raw damage combos in Blox Fruits.',
    image: humanImg,
    colorScheme: 'from-red-500 via-rose-700 to-amber-600',
    pvpRating: 10,
    mobilityRating: 8,
    defenseRating: 7,
    advantages: [
      'Psycho Rage delivers the highest burst damage potential in the game',
      'Flash Step cooldown reduced to near zero in V3',
      '3 extra Flash Step charges',
      'Unstoppable one-shot combo damage multiplier',
    ],
    v1: {
      title: 'Human V1 (Base Mortal)',
      requirements: 'Default starting race for most players.',
      buffs: ['Standard mortal form with balanced stats.'],
    },
    v2: {
      title: 'Human V2 (Limit Break)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        'Flash Step (Teleport) cooldown reduced significantly',
        'Flash Step range increased by 50%',
      ],
    },
    v3: {
      title: 'Human V3 (Last Resort)',
      requirements: 'Arowe Quest in Sea 2. Defeat Diamond, Jeremy, and Fajita + 2,000,000 Beli.',
      buffs: [
        'Skill: "Last Resort" (T-Key): Deals bonus damage inversely proportional to current HP (up to +133% damage when low HP!)',
        'Lasts 6.5 seconds. Cooldown: 30 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Human Door',
      trialPuzzle: 'Trial of Strength: Defeat a horde of berserker clones within 60 seconds.',
      transformationName: 'Psycho Berserker',
      transformationBuffs: [
        'Aura of fiery crimson blood flames and demonic red eyes',
        'Rage Meter: Dealing or taking damage fills Rage, boosting all damage up to +150%',
        'Flash Step gains 3 rapid consecutive charges without cooldown',
        'Attacks trigger screen shake and explosive shockwaves',
      ],
      gears: [
        {
          gearName: 'Psycho Blade (Gear 1)',
          passiveName: 'Limitless Ferocity',
          description: 'Max rage grants immunity to knockback and turns all melee hits into critical strikes.',
        },
        {
          gearName: 'Flash Master (Gear 2)',
          passiveName: 'Phantom Step',
          description: 'Flash stepping leaves an afterimage clone that explodes for heavy damage.',
        },
      ],
    },
  },
  {
    id: 'ghoul',
    name: 'Ghoul',
    lore: 'Creatures of the cursed shadows that feed on the life essence of foes. Ghoul players excel at vampiric life-leech, night speed, and infinite cooldown resets.',
    image: ghoulImg,
    colorScheme: 'from-purple-600 via-rose-900 to-slate-950',
    pvpRating: 9,
    mobilityRating: 8,
    defenseRating: 8,
    advantages: [
      'Vampiric Life Leech: Heal back 25% of all melee damage dealt!',
      'Night-time buff: Speed and damage increase by 30% after dark',
      'V3 Heightened Senses reduces skill cooldowns by 40%',
      'V4 Crow Domain blinds enemies and prevents them from using skills',
    ],
    v1: {
      title: 'Ghoul V1 (Cursed Soul)',
      requirements: 'Obtain Hellfire Torch from Cursed Captain (Sea 2) + 100 Ectoplasm + talk to Experimic.',
      buffs: [
        'Black demon horns',
        'Life Leech: Melee fighting styles heal 25% of damage dealt back to user',
        'Increased run speed at nighttime',
      ],
    },
    v2: {
      title: 'Ghoul V2 (Bloodlust)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        'Life Leech now applies to swords as well',
        'Health regenerates 10% faster in combat',
      ],
    },
    v3: {
      title: 'Ghoul V3 (Heightened Senses)',
      requirements: 'Arowe Quest in Sea 2. Kill 5 players while having bounty quest active + 2,000,000 Beli.',
      buffs: [
        'Skill: "Heightened Senses" (T-Key): Reduces ALL skill cooldowns by 40% and boosts speed by 50%',
        'Allows spamming moves in rapid succession. Cooldown: 25 seconds',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Ghoul Door',
      trialPuzzle: 'Trial of Darkness: Defeat the Phantom Shadows in total pitch-black room.',
      transformationName: 'Abyssal Vampire Sovereign',
      transformationBuffs: [
        'Flock of cursed red spirit crows swirling around user',
        'Crow Domain: Surrounding enemies are afflicted with blindness and cannot use skills for 2.5s',
        'Life Leech increased to 50% across all moves including Devil Fruits',
      ],
      gears: [
        {
          gearName: 'Blood Siphon (Gear 1)',
          passiveName: 'Essence Devourer',
          description: 'Excess healing over max HP converts into a temporary 2000 HP blood shield.',
        },
        {
          gearName: 'Nightfall Crows (Gear 2)',
          passiveName: 'Grim Murmuration',
          description: 'Crows automatically attack nearby enemies, draining their energy pool.',
        },
      ],
    },
  },
  {
    id: 'cyborg',
    name: 'Cyborg',
    lore: 'High-tech bionic transhumans infused with cybernetic cores and advanced weaponry. Built to neutralize Devil Fruit users and reflect damage with energy shields.',
    image: cyborgImg,
    colorScheme: 'from-blue-500 via-cyan-400 to-stone-800',
    pvpRating: 9,
    mobilityRating: 7,
    defenseRating: 10,
    advantages: [
      'Energy Core converts damage taken into instant stamina',
      'V3 Energy Core reflects damage and strips Ken Haki from all surrounding enemies',
      'V4 Supercharge fires missile barrages and electric chains',
      'Supreme counter to combo-heavy fruit users',
    ],
    v1: {
      title: 'Cyborg V1 (Bionic Core)',
      requirements: 'Fist of Darkness + Core Brain drop from Law/Order Raid (Sea 2) + 2,500 Frags.',
      buffs: [
        'Futuristic cybernetic ocular implant and metallic headset',
        'Converts 10% of all incoming damage into Energy',
        'Defense increased by +10%',
      ],
    },
    v2: {
      title: 'Cyborg V2 (Cyber Overdrive)',
      requirements: 'Complete Alchemist quest in Green Zone (Sea 2) with 3 flowers + 500k Beli.',
      buffs: [
        '+15% Defense against all physical attacks',
        'Jump height and dash distance boosted by hydraulic pistons',
      ],
    },
    v3: {
      title: 'Cyborg V3 (Energy Core)',
      requirements: 'Arowe Quest in Sea 2. Give any physical fruit to Trevor + 2,000,000 Beli.',
      buffs: [
        'Skill: "Energy Core" (T-Key): Emits a crackling electric field for 6.5s that reduces damage taken by 30% and shocks all attackers',
        'Destroys enemy Instinct (Ken Haki) instantly on contact',
      ],
    },
    v4: {
      trialLocation: 'Temple of Time, Cyborg Door',
      trialPuzzle: 'Trial of Machines: Survive against explosive automated defense drones.',
      transformationName: 'Apex Mecha Overlord',
      transformationBuffs: [
        'Twin floating plasma energy cannons and electric exoskeleton',
        'Supercharge: Attacks launch homing cyber rockets that shock and stun',
        'Electric Web: Attacking creates chain-lightning that arcs between up to 4 targets',
      ],
      gears: [
        {
          gearName: 'Plasma Battery (Gear 1)',
          passiveName: 'Overclock Shock',
          description: 'Electric arcs disable enemy air jumps for 3 seconds.',
        },
        {
          gearName: 'Defense Matrix (Gear 2)',
          passiveName: 'Titanium Shell',
          description: 'Gain 20% passive defense and nullify the first combo hit received every 15s.',
        },
      ],
    },
  },
];
