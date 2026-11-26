export type FruitRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical';
export type FruitCategory = 'Natural' | 'Elemental' | 'Beast';

export interface MoveAbility {
  key: 'Z' | 'X' | 'C' | 'V' | 'F' | 'TAP';
  name: string;
  mastery: number;
  description: string;
}

export interface AwakeningMove {
  key: 'Z' | 'X' | 'C' | 'V' | 'F';
  originalName: string;
  awakenedName: string;
  fragCost: number;
  description: string;
}

export interface AwakeningInfo {
  isAwakeningAvailable: boolean;
  totalFrags: number;
  raidChipPrice: string;
  details: string;
  moves: AwakeningMove[];
}

export interface BloxFruit {
  id: string;
  name: string;
  rarity: FruitRarity;
  category: FruitCategory;
  priceBeli: number;
  priceRobux: number;
  tradingValue: number; // Midpoint in Beli units for Trade Calculator sorting
  tradingValueMin?: number; // Minimum physical trading value
  tradingValueMax?: number; // Maximum physical trading value
  tradingValueRange?: string; // Physical trading range, e.g. "450M - 600M"
  image?: string;
  tradingDemand: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | 'Insane';
  pvpTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  grindTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  description: string;
  iconBg: string;
  symbol: string;
  abilities: MoveAbility[];
  awakening?: AwakeningInfo;
  hasTransformation?: boolean;
  transformationName?: string;
  transformationImage?: string;
  transformationDescription?: string;
  bestFor: string;
}

export interface RaceVDetails {
  title: string;
  requirements: string;
  buffs: string[];
}

export interface RaceGearDetails {
  gearName: string;
  passiveName: string;
  description: string;
}

export interface BloxRace {
  id: string;
  name: string;
  lore: string;
  image?: string;
  colorScheme: string;
  v1: RaceVDetails;
  v2: RaceVDetails;
  v3: RaceVDetails;
  v4: {
    trialLocation: string;
    trialPuzzle: string;
    transformationName: string;
    transformationBuffs: string[];
    gears: RaceGearDetails[];
  };
  advantages: string[];
  pvpRating: number; // 1-10
  mobilityRating: number; // 1-10
  defenseRating: number; // 1-10
}

export type SwordShape =
  | 'katana'
  | 'cutlass'
  | 'dual'
  | 'triple'
  | 'mace'
  | 'saw'
  | 'hooks'
  | 'pipe'
  | 'cane'
  | 'trident'
  | 'flail'
  | 'gravity'
  | 'longsword'
  | 'bisento'
  | 'buddy'
  | 'canvander'
  | 'dagger'
  | 'dragonheart'
  | 'koko'
  | 'midnight'
  | 'pole'
  | 'rengoku'
  | 'saber'
  | 'tushita'
  | 'yama'
  | 'trophy'
  | 'dogblade'
  | 'scythe'
  | 'anchor'
  | 'lantern'
  | 'darkblade';

export type SpecialCollectionKey =
  | 'cdk'
  | 'ttk'
  | 'dark_blade'
  | 'tushita'
  | 'yama'
  | 'shisui'
  | 'saddi'
  | 'wando'
  | 'hallow_scythe'
  | 'spikey_trident'
  | 'shark_anchor'
  | 'dragonheart'
  | 'other';

export interface SwordMove {
  key: 'Z' | 'X';
  name: string;
  mastery: number;
  masteryNote?: string;
  description: string;
  damageNotes?: string;
  effects?: string;
  breaksInstinct?: string;
}

export interface SwordM1Info {
  name: string;
  description: string;
  damageNotes: string;
  effects: string;
}

export interface SwordUpgradeInfo {
  canUpgrade: boolean;
  boost: string;
  materials: string;
  notes: string;
}

export interface SwordSynergyInfo {
  fruits: string[];
  fightingStyles: string[];
  summary: string;
}

export interface BloxSword {
  id: string;
  name: string;
  legacyName?: string;
  rarity: FruitRarity;
  howToObtain: string;
  npcOrBoss: string;
  location: string;
  unlockRequirements: string;
  priceBeli: number | null;
  priceDisplay: string;
  masteryReqTotal: number;
  masteryNote?: string;
  m1: SwordM1Info;
  moves: SwordMove[];
  sea: 1 | 2 | 3;
  description: string;
  damageProfile: string;
  effectsAndAnimations: string;
  upgradeInfo: SwordUpgradeInfo;
  synergies: SwordSynergyInfo;
  specialCollections: SpecialCollectionKey[];
  weaponShape: SwordShape;
  pvpTier: 'S+' | 'S' | 'A' | 'B' | 'C';
  image?: string;
  isUnverifiedNote?: string;
  iconStyle: {
    bladeColor: string;
    auraColor: string;
    glyph: string;
  };
}

export type FightingStyleCategory =
  | 'Starter Style'
  | 'First Sea Base'
  | 'Second Sea Base'
  | 'V2 Mastery Evolution'
  | 'Endgame Mythical Art'
  | 'Secret Evolution';

export type FightingStyleTheme = 'crimson' | 'purple' | 'electric';

export interface FightingStyleMove {
  key: 'M1' | 'Z' | 'X' | 'C' | 'V';
  name: string;
  mastery: number;
  description: string;
  damageInfo: string;
  rangeAoe: string;
  cooldown: string;
  cooldownVerified: boolean;
  visualEffects: string;
  upgradeNote?: string;
}

export interface FightingStyleUpgrade {
  title: string;
  npcName: string;
  location: string;
  requirements: string;
  details: string[];
}

export interface FightingStyleTrainerGuide {
  npcName: string;
  island: string;
  sea: 1 | 2 | 3;
  exactLocation: string;
  directions: string;
  altThirdSeaLocation?: string;
  outdatedNote?: string;
}

export interface FightingStyle {
  id: string;
  name: string;
  aliases?: string[];
  category: FightingStyleCategory;
  theme: FightingStyleTheme;
  requirements: string;
  prerequisiteStyles: string[];
  requiredMasteryToUnlock: number;
  maxMoveMastery: number;
  requiredItems: string[];
  unlockSteps: string[];
  costBeli: number;
  costFragments: number;
  npcName: string;
  location: string;
  island: string;
  sea: 1 | 2 | 3;
  trainerGuide: FightingStyleTrainerGuide;
  description: string;
  moves: FightingStyleMove[];
  upgrades?: FightingStyleUpgrade;
  pvpTier: 'S+' | 'S' | 'A' | 'B' | 'C';
  grindTier: 'S+' | 'S' | 'A' | 'B' | 'C';
  mobilityTier: 'S+' | 'S' | 'A' | 'B' | 'C';
  pvpUses: string;
  grindingUses: string;
  combosAndSynergies: {
    fruits: string[];
    swords: string[];
    comboExample: string;
  };
  verificationNote?: string;
  outdatedInfoNote?: string;
}

export interface BloxAccessory {
  id: string;
  name: string;
  rarity: FruitRarity;
  buffs: {
    stat: string;
    value: string;
  }[];
  sea: 1 | 2 | 3;
  location: string;
  howToObtain: string;
  dropRate?: string;
  image?: string;
  description: string;
}

export interface BossDrop {
  name: string;
  chance: string;
  type: 'Item' | 'Sword' | 'Accessory' | 'Material';
}

export interface BloxBoss {
  id: string;
  name: string;
  level: number;
  sea: 1 | 2 | 3;
  location: string;
  respawnTime: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
  drops: BossDrop[];
  rewards: {
    beli: string;
    exp: string;
  };
  isRaidBoss?: boolean;
  strategy: string;
}

export interface IslandLocation {
  id: string;
  name: string;
  sea: 1 | 2 | 3;
  recommendedLevel: string;
  npcs: {
    name: string;
    role: string;
    description: string;
  }[];
  enemies: string[];
  bosses: string[];
  notableFeatures: string[];
  secretTip: string;
  mapPosition?: {
    x: number;
    y: number;
    routeOrder: number;
  };
}

export interface SecretQuest {
  id: string;
  title: string;
  sea: 1 | 2 | 3;
  category: 'Weapons & Swords' | 'Haki & Combat' | 'Races & Trials' | 'World & Raid Access';
  levelRequirement: string;
  startingLocation: string;
  keyNpcOrBoss: string;
  costOrPrerequisites: string;
  reward: string;
  summary: string;
  steps: string[];
  warningNote?: string;
}

export interface StarQuestItem {
  starNumber: 1 | 2 | 3;
  name: string;
  triggerType: 'Puzzle' | 'Exploration' | 'Hourly / Event' | 'Awakened Boss';
  howToComplete: string;
  rewardNote: string;
}

export interface FirstSeaIslandSecret {
  id: string;
  islandName: string;
  recommendedLevel: string;
  totalStars: 0 | 3;
  teleporterUnlock: boolean;
  overview: string;
  stars: StarQuestItem[];
}

export type GunShape =
  | 'guitar'
  | 'dragonstorm'
  | 'slingshot'
  | 'bow'
  | 'rifle'
  | 'revolver'
  | 'pistol'
  | 'cannon'
  | 'bazooka'
  | 'musket';

export interface GunMove {
  key: 'Z' | 'X';
  name: string;
  mastery: number;
  description: string;
  effects: string;
  breaksInstinct: string;
}

export interface BloxGun {
  id: string;
  name: string;
  legacyName?: string;
  rarity: FruitRarity;
  sea: 1 | 2 | 3;
  howToObtain: string;
  npcOrBoss: string;
  location: string;
  unlockRequirements: string;
  priceBeli: number | null;
  priceDisplay: string;
  masteryReqTotal: number;
  gunShape: GunShape;
  pvpTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  description: string;
  m1: {
    name: string;
    description: string;
    effects: string;
  };
  moves: GunMove[];
  upgradeInfo: {
    canUpgrade: boolean;
    boost: string;
    materials: string;
    notes: string;
  };
  synergies: {
    fruits: string[];
    swords: string[];
    summary: string;
  };
  image?: string;
  accentColor: string;
}

