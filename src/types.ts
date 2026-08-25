export type CropCategory = 'leafy' | 'fruit' | 'root' | 'grain' | 'flower' | 'magic';

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: CropCategory;
  unlockLevel: number;
  seedPrice: number;
  sellPrice: number;
  expReward: number;
  growthDurationSeconds: number;
  waterDemand: number;
  fertilizerDemand: number;
  icon: string;
  stageEmojis: [string, string, string, string];
  stageDescriptions: [string, string, string, string];
  scienceFact: string;
  idealFertilizer: 'N' | 'P' | 'K' | 'organic';
  magicElement?: 'earth' | 'water' | 'fire' | 'wind' | 'light';
  alchemyYield?: string;
}

export type GrowthStage = 0 | 1 | 2 | 3 | 4;

export interface FarmPlot {
  id: number;
  isUnlocked: boolean;
  unlockLevel: number;
  cropId: string | null;
  stage: GrowthStage;
  growthProgress: number; // 0 to 100%
  waterLevel: number; // 0 to 100%
  fertilizerLevel: number; // 0 to 100%
  hasPest: boolean;
  isTilled?: boolean; // Plowing bonus (+25% growth)
  plantedAt: number | null;
  lastCareAt: number;
}

export interface Inventory {
  seeds: Record<string, number>;
  harvested: Record<string, number>;
  waterBuckets: number;
  fertilizerOrganic: number;
  fertilizerN: number;
  fertilizerP: number;
  fertilizerK: number;
  pestSprays: number;
  // RPG Inventory additions:
  potions: {
    hp_small: number;
    hp_large: number;
    stamina_elixir: number;
    antidote: number;
    fire_bomb: number;
    water_splash: number;
  };
  materials: {
    magic_wood: number;
    runestone: number;
    monster_essence: number;
    star_dust: number;
    fire_core: number;
    ancient_gear: number;
  };
}

export type ElementType = 'earth' | 'water' | 'fire' | 'wind' | 'light';

export interface Monster {
  id: string;
  name: string;
  title: string;
  icon: string;
  element: ElementType;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  expReward: number;
  goldReward: number;
  crystalReward: number;
  dropMaterials: {
    material: keyof Inventory['materials'];
    chance: number;
    count: number;
  }[];
  dropSeeds?: {
    cropId: string;
    count: number;
  }[];
  weakness: ElementType;
  scienceQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface WorldLocation {
  id: string;
  name: string;
  thaiName: string;
  recommendedLevel: number;
  icon: string;
  bannerBg: string;
  description: string;
  monsters: string[]; // monster IDs
  hasDungeon: boolean;
  dungeonId?: string;
  unlocked: boolean;
}

// Alias for convenience
export type LocationNode = WorldLocation;

export interface CampUpgrade {
  level: number;
  title: string;
  cabinName: string;
  description: string;
  cabinIcon: string;
  costGold: number;
  costWood: number;
  costRunestone: number;
  costCrystals: number;
  perks: string[];
  maxHpBonus: number;
  atkBonus: number;
  growthSpeedBonus: number;
}

export interface AlchemyRecipe {
  id: string;
  name: string;
  icon: string;
  category: 'potion' | 'buff' | 'offensive' | 'cure';
  description: string;
  requiresLevel: number;
  ingredients: {
    crops?: { cropId: string; count: number }[];
    materials?: { material: keyof Inventory['materials']; count: number }[];
    waterCost?: number;
  };
  resultItem: keyof Inventory['potions'];
  resultCount: number;
  effectDescription: string;
  expReward?: number;
}

export interface CodexCard {
  id: string;
  title: string;
  thaiTitle: string;
  category: 'botany' | 'monster' | 'elemental' | 'soil_science';
  icon: string;
  summary: string;
  scienceKnowledge: string;
  passiveBuff: {
    description: string;
    type: 'atk' | 'hp' | 'exp' | 'growth_speed';
    value: number;
  };
  isUnlocked: boolean;
}

export interface NPCQuest {
  id: string;
  npcName: string;
  npcAvatar: string;
  npcRole: string;
  title: string;
  dialogue: string;
  taskType: 'battle' | 'harvest' | 'alchemy' | 'dungeon' | 'quiz' | 'upgrade_camp' | 'farm';
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardExp: number;
  rewardGold: number;
  rewardCrystals: number;
  rewardItems?: Partial<Inventory['potions']> & Partial<Inventory['materials']>;
  hint: string;
}

export interface Mission {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  hint: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardCoins: number;
  rewardExp: number;
  rewardItem?: {
    type: 'water' | 'fertilizer' | 'seed' | 'pestSpray';
    name: string;
    amount: number;
  };
  relatedTab?: string;
}


export interface DungeonRoom {
  id: string;
  title: string;
  dungeonName: string;
  reqLevel: number;
  // Sokoban layout: 0 = floor, 1 = wall, 2 = stone block, 3 = target magic plate, 4 = player start
  grid: number[][];
  cipherCode?: {
    question: string;
    clue: string;
    options: string[];
    correctAnswer: string;
  };
  chestRewards: {
    gold: number;
    manaCrystals: number;
    rareSeed: { cropId: string; count: number };
    runestones: number;
    ancientGear: number;
  };
}

export interface HeroStats {
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  stamina?: number;
  maxStamina?: number;
  mana?: number;
  maxMana?: number;
  atk: number;
  def: number;
  title: string;
  coins: number;
  manaCrystals: number;
  playerName: string;
  campLevel: number;
  totalMonstersDefeated?: number;
  totalBattlesWon?: number;
  totalDungeonsCleared: number;
  totalPotionsBrewed: number;
  totalHarvests: number;
  totalQuizzesCorrect?: number;
  discoveredCards?: string[];
  currentLocationId: string;
  heroClass?: string;
}

export type PlayerStats = HeroStats;

export type ActiveTab = 'world_map' | 'worldmap' | 'battle' | 'adventure' | 'camp' | 'alchemy' | 'dungeon' | 'quests' | 'codex' | 'shop' | 'minigames';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'battle';
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  category: 'photosynthesis' | 'nutrients' | 'soil_water' | 'ecology' | 'crop_science' | 'alchemy';
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardType: 'water' | 'fertilizer' | 'seed' | 'coin';
  rewardAmount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  current: number;
  target: number;
  unlockedAt?: number;
}

export type WeatherType = 'sunny' | 'rainy' | 'thunderstorm' | 'breeze' | 'moonlit';
export type TimeOfDay = 'morning' | 'day' | 'sunset' | 'night';

export interface WeatherState {
  type: WeatherType;
  name: string;
  thaiName: string;
  icon: string;
  description: string;
  cropBuffDescription: string;
  temperature: number; // in Celsius e.g. 28°C
  humidity: number; // in %
  growthMultiplier: number;
  autoWaterRate: number; // % water added to soil per second
  waterEvaporationMultiplier: number;
  pestRisk: number;
  magicCropBonus: number;
}

export interface InGameTime {
  hours: number;
  minutes: number;
  day: number;
  timeOfDay: TimeOfDay;
}
