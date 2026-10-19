/**
 * Mock data service for Global Arcade Leaderboard scores.
 */

export interface GlobalScoreEntry {
  rank: number;
  playerName: string;
  playerTitle: string;
  scorePts: number;
  distanceMeters: number;
  carName: string;
  countryCode: string;
  countryName: string;
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'TOP 5';
  verified: boolean;
  avatarIcon: string;
}

export const TOP_5_GLOBAL_SCORES: GlobalScoreEntry[] = [
  {
    rank: 1,
    playerName: 'CYBER_VORTEX',
    playerTitle: 'APEX LEGEND',
    scorePts: 38920,
    distanceMeters: 3892,
    carName: 'APEX COUPE',
    countryCode: 'US',
    countryName: 'United States',
    badge: 'GOLD',
    verified: true,
    avatarIcon: 'sports_motorsports',
  },
  {
    rank: 2,
    playerName: 'NEO_DRIFTER',
    playerTitle: 'ASPHALT PHANTOM',
    scorePts: 34150,
    distanceMeters: 3415,
    carName: 'VORTEX GT',
    countryCode: 'JP',
    countryName: 'Japan',
    badge: 'SILVER',
    verified: true,
    avatarIcon: 'electric_car',
  },
  {
    rank: 3,
    playerName: 'TURBO_RAZOR',
    playerTitle: 'HIGHWAY DEVIL',
    scorePts: 31200,
    distanceMeters: 3120,
    carName: 'PHANTOM HYPER',
    countryCode: 'DE',
    countryName: 'Germany',
    badge: 'BRONZE',
    verified: true,
    avatarIcon: 'rocket_launch',
  },
  {
    rank: 4,
    playerName: 'REDLINE_KID',
    playerTitle: 'STREET REAPER',
    scorePts: 29840,
    distanceMeters: 2984,
    carName: 'DRIFT PULSE',
    countryCode: 'KR',
    countryName: 'South Korea',
    badge: 'TOP 5',
    verified: false,
    avatarIcon: 'sports_score',
  },
  {
    rank: 5,
    playerName: 'NIGHT_VIPER',
    playerTitle: 'NITRO RUNNER',
    scorePts: 28910,
    distanceMeters: 2891,
    carName: 'APEX COUPE',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    badge: 'TOP 5',
    verified: true,
    avatarIcon: 'minor_crash',
  },
];

class LeaderboardService {
  async getTopGlobalScores(): Promise<GlobalScoreEntry[]> {
    // Simulated micro-network latency
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...TOP_5_GLOBAL_SCORES];
  }
}

export const leaderboardService = new LeaderboardService();
