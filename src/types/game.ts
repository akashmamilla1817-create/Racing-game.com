export type ScreenType = 
  | 'loading' 
  | 'home' 
  | 'stage_select' 
  | 'racing' 
  | 'crashed' 
  | 'victory' 
  | 'garage' 
  | 'missions' 
  | 'ranks' 
  | 'settings';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'endless' | 'stage';

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  tier: string;
  tierLabel: string;
  pwrBhp: number;
  topSpeedKmh: number;
  topSpeedPercent: number;
  accelSec: number;
  accelPercent: number;
  driftStabilityPercent: number;
  nitroPercent: number;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  liveryColor: string; // hex color for main body
  accentColor: string;
  wheelStyle: 'cyber' | 'turbofan' | 'spoke' | 'aero';
  imageAlt: string;
  thumbnailIcon: string;
  driveType: string;
}

export interface Stage {
  id: string;
  stageNumber: string;
  name: string;
  description: string;
  lanes: number;
  distanceKm: number;
  weather: string;
  weatherIcon: string;
  surface: string;
  traffic: string;
  record: string;
  coinMultiplier: number;
  coinMultiplierLabel: string;
  unlocked: boolean;
  requiredLevel: number;
  bgImage: string;
  imageAlt: string;
  tractionSlip: number; // e.g. -15%
  nitroRefillRate: number; // e.g. 1.25x
}

export interface Mission {
  id: string;
  title: string;
  category: string;
  progress: number;
  total: number;
  completed: boolean;
  claimed: boolean;
  rewardCoins: number;
  rewardXp: number;
}

export interface PlayerStats {
  level: number;
  title: string;
  coins: number;
  rating: number;
  xp: number;
  nextLevelXp: number;
  equippedCarId: string;
  fuel: number;
  maxFuel: number;
  bestDistance: number;
  endlessHighScore: number;
  totalRuns: number;
}

export interface RaceResult {
  finalScore: number;
  distance: number;
  previousBest: number;
  isNewPersonalBest: boolean;
  nearMisses: number;
  coinsLooted: number;
  xpEarned: number;
  bonusRewardPart?: string;
  stageId: string;
  difficulty: Difficulty;
  gameMode?: GameMode;
  checkpointsReached?: number;
}
