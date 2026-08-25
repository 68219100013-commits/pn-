export type CropCategory = 'leafy' | 'fruit' | 'root' | 'grain' | 'flower';

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: CropCategory;
  unlockLevel: number;
  seedPrice: number;
  sellPrice: number;
  expReward: number;
  growthDurationSeconds: number; // total base time to reach stage 4
  waterDemand: number; // rate of water consumption
  fertilizerDemand: number;
  icon: string;
  stageEmojis: [string, string, string, string]; // [seed, sprout, vegetative, harvestable]
  stageDescriptions: [string, string, string, string];
  scienceFact: string;
  idealFertilizer: 'N' | 'P' | 'K' | 'organic';
}

export type GrowthStage = 0 | 1 | 2 | 3 | 4;
// 0: Empty Plot (ดินว่าง)
// 1: Seed (ระยะเมล็ดเริ่มงอก)
// 2: Sprout / Seedling (ระยะต้นกล้าแตกใบ)
// 3: Vegetative / Plant (ระยะต้นไม้เติบโต/ออกดอก)
// 4: Harvestable (ระยะผลผลิตสุกพร้อมเก็บเกี่ยว)

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
  plantedAt: number | null;
  lastCareAt: number;
}

export interface Inventory {
  seeds: Record<string, number>; // cropId -> count
  harvested: Record<string, number>; // cropId -> count
  waterBuckets: number;
  fertilizerOrganic: number;
  fertilizerN: number;
  fertilizerP: number;
  fertilizerK: number;
  pestSprays: number;
}

export interface Mission {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  type: 'collect_water' | 'answer_quiz' | 'plant_crop' | 'water_crop' | 'fertilize_crop' | 'harvest_crop' | 'reach_level' | 'solve_math';
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardExp: number;
  rewardCoins: number;
  rewardItems?: Partial<Inventory>;
  guideTip?: string;
}

export interface QuizQuestion {
  id: string;
  category: 'photosynthesis' | 'nutrients' | 'soil_water' | 'ecology' | 'crop_science';
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

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  coins: number;
  playerName: string;
  totalHarvests: number;
  totalQuizzesCorrect: number;
  totalWaterCollected: number;
  totalFertilizersCrafted: number;
  totalPestsCleared: number;
  gameTimeDays: number;
}

export type ActiveTab = 'farm' | 'minigames' | 'shop' | 'encyclopedia' | 'badges';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  icon?: string;
}
