import { useState, useEffect } from 'react';
import {
  ScreenType,
  Vehicle,
  Stage,
  Mission,
  PlayerStats,
  Difficulty,
  GameMode,
  RaceResult,
} from './types/game';
import {
  INITIAL_VEHICLES,
  INITIAL_STAGES,
  INITIAL_MISSIONS,
  INITIAL_PLAYER_STATS,
} from './data/mockData';
import { LoadingScreen } from './components/LoadingScreen';
import { HomeScreen } from './components/HomeScreen';
import { StageSelectScreen } from './components/StageSelectScreen';
import { ActiveRaceScreen } from './components/ActiveRaceScreen';
import { CrashScreen } from './components/CrashScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { PauseModal } from './components/PauseModal';
import { GarageScreen } from './components/GarageScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { RanksScreen } from './components/RanksScreen';
import { DailyCrateModal } from './components/DailyCrateModal';
import { SettingsModal } from './components/SettingsModal';
import { audio } from './utils/audio';

const STORAGE_KEY_STATS = 'pocket_racer_stats_v2';
const STORAGE_KEY_VEHICLES = 'pocket_racer_vehicles_v2';
const STORAGE_KEY_MISSIONS = 'pocket_racer_missions_v2';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('loading');

  // Persistent States
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VEHICLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VEHICLES;
  });

  const [stages] = useState<Stage[]>(INITIAL_STAGES);

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MISSIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MISSIONS;
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PLAYER_STATS;
  });

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(playerStats));
    } catch {}
  }, [playerStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
    } catch {}
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
    } catch {}
  }, [missions]);

  // Active race state
  const [selectedStage, setSelectedStage] = useState<Stage>(INITIAL_STAGES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('endless');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastRaceResult, setLastRaceResult] = useState<RaceResult>({
    finalScore: 28450,
    distance: 2840,
    previousBest: 3890,
    isNewPersonalBest: true,
    nearMisses: 14,
    coinsLooted: 125,
    xpEarned: 700,
    bonusRewardPart: 'Neon Cyan Rims',
    stageId: 'neon_metropolis',
    difficulty: 'medium',
    gameMode: 'endless',
  });

  // Modals
  const [showDailyCrate, setShowDailyCrate] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const equippedVehicle =
    vehicles.find((v) => v.id === playerStats.equippedCarId) || vehicles[0];

  // Starts synth music on first interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      audio.startMusic();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  // Handlers
  const handleStartRace = (
    stage: Stage,
    difficulty: Difficulty,
    mode: GameMode = 'endless'
  ) => {
    setSelectedStage(stage);
    setSelectedDifficulty(difficulty);
    setGameMode(mode);
    setIsPaused(false);
    setCurrentScreen('racing');
  };

  const handleCrash = (result: RaceResult) => {
    setLastRaceResult(result);
    setPlayerStats((prev) => {
      const nextXp = prev.xp + result.xpEarned;
      const leveledUp = nextXp >= prev.nextLevelXp;
      return {
        ...prev,
        coins: prev.coins + result.coinsLooted,
        xp: leveledUp ? nextXp - prev.nextLevelXp : nextXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        bestDistance: Math.max(prev.bestDistance, result.distance),
        endlessHighScore: Math.max(prev.endlessHighScore || 0, result.finalScore),
        totalRuns: (prev.totalRuns || 0) + 1,
      };
    });
    setCurrentScreen('crashed');
  };

  const handleVictory = (result: RaceResult) => {
    setLastRaceResult(result);
    setPlayerStats((prev) => {
      const nextXp = prev.xp + result.xpEarned + 850;
      const leveledUp = nextXp >= prev.nextLevelXp;
      return {
        ...prev,
        coins: prev.coins + result.coinsLooted + 500,
        xp: leveledUp ? nextXp - prev.nextLevelXp : nextXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        bestDistance: Math.max(prev.bestDistance, result.distance),
        totalRuns: (prev.totalRuns || 0) + 1,
      };
    });
    setCurrentScreen('victory');
  };

  const handleEquipVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        equipped: v.id === vehicleId,
      }))
    );
    setPlayerStats((prev) => ({
      ...prev,
      equippedCarId: vehicleId,
    }));
  };

  const handleBuyVehicle = (vehicleId: string, cost: number) => {
    if (playerStats.coins < cost) return;
    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      equippedCarId: vehicleId,
    }));
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, unlocked: true, equipped: true }
          : { ...v, equipped: false }
      )
    );
  };

  const handleUpgradeStat = (
    vehicleId: string,
    statType: 'speed' | 'accel' | 'drift'
  ) => {
    const cost = 1200;
    if (playerStats.coins < cost) return;

    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
    }));

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        if (statType === 'speed') {
          return {
            ...v,
            pwrBhp: v.pwrBhp + 15,
            topSpeedKmh: v.topSpeedKmh + 8,
            topSpeedPercent: Math.min(100, v.topSpeedPercent + 5),
          };
        } else if (statType === 'accel') {
          return {
            ...v,
            pwrBhp: v.pwrBhp + 10,
            accelSec: Math.max(1.8, +(v.accelSec - 0.2).toFixed(1)),
            accelPercent: Math.min(100, v.accelPercent + 5),
          };
        } else {
          return {
            ...v,
            driftStabilityPercent: Math.min(100, v.driftStabilityPercent + 4),
          };
        }
      })
    );
  };

  const handleUpdateLiveryColor = (colorHex: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === playerStats.equippedCarId ? { ...v, liveryColor: colorHex } : v
      )
    );
  };

  const handleClaimMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.claimed) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins + mission.rewardCoins,
      xp: prev.xp + mission.rewardXp,
    }));
  };

  const handleClaimDailyCrate = (coins: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      xp: prev.xp + 400,
    }));
  };

  return (
    <div className="w-screen min-h-screen bg-[#070a12] flex items-center justify-center p-0 m-0 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Container simulating portrait mobile screen */}
      <div className="relative w-full max-w-[390px] h-screen max-h-[844px] bg-[#0a0e1a] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,229,255,0.15)] border-x border-[#3b494c]/30">
        {/* Screen Switcher */}
        {currentScreen === 'loading' && (
          <LoadingScreen onComplete={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            playerStats={playerStats}
            equippedVehicle={equippedVehicle}
            onNavigate={(screen) => {
              if (screen === 'settings') {
                setShowSettings(true);
              } else {
                setCurrentScreen(screen);
              }
            }}
            onOpenDailyCrate={() => setShowDailyCrate(true)}
            onUpdateLiveryColor={handleUpdateLiveryColor}
          />
        )}

        {currentScreen === 'stage_select' && (
          <StageSelectScreen
            stages={stages}
            coins={playerStats.coins}
            onBack={() => setCurrentScreen('home')}
            onStartRace={handleStartRace}
          />
        )}

        {currentScreen === 'racing' && (
          <div className="relative w-full h-full">
            <ActiveRaceScreen
              stage={selectedStage}
              vehicle={equippedVehicle}
              difficulty={selectedDifficulty}
              bestDistance={playerStats.bestDistance}
              onPause={() => setIsPaused(true)}
              onCrash={handleCrash}
              onVictory={handleVictory}
            />

            {/* Paused Modal overlay */}
            {isPaused && (
              <PauseModal
                distance={1840}
                coins={64}
                speedMph={148}
                onResume={() => {
                  audio.startEngine(0.6);
                  setIsPaused(false);
                }}
                onRestart={() => {
                  setIsPaused(false);
                  setCurrentScreen('racing');
                }}
                onQuitToHome={() => {
                  audio.stopEngine();
                  setIsPaused(false);
                  setCurrentScreen('home');
                }}
                onOpenSettings={() => setShowSettings(true)}
              />
            )}
          </div>
        )}

        {currentScreen === 'crashed' && (
          <CrashScreen
            result={lastRaceResult}
            totalCoins={playerStats.coins}
            onRaceAgain={() => {
              setCurrentScreen('racing');
            }}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'victory' && (
          <VictoryScreen
            result={lastRaceResult}
            playerLevel={playerStats.level}
            totalCoins={playerStats.coins}
            onClaimAndContinue={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'garage' && (
          <GarageScreen
            vehicles={vehicles}
            playerCoins={playerStats.coins}
            equippedVehicleId={playerStats.equippedCarId}
            onNavigate={(screen) => {
              if (screen === 'settings') {
                setShowSettings(true);
              } else {
                setCurrentScreen(screen);
              }
            }}
            onEquipVehicle={handleEquipVehicle}
            onBuyVehicle={handleBuyVehicle}
            onUpgradeStat={handleUpgradeStat}
            onUpdateLiveryColor={handleUpdateLiveryColor}
          />
        )}

        {currentScreen === 'missions' && (
          <MissionsScreen
            missions={missions}
            coins={playerStats.coins}
            onClaimReward={handleClaimMission}
            onNavigate={(screen) => {
              if (screen === 'settings') {
                setShowSettings(true);
              } else {
                setCurrentScreen(screen);
              }
            }}
          />
        )}

        {currentScreen === 'ranks' && (
          <RanksScreen
            playerStats={playerStats}
            onNavigate={(screen) => {
              if (screen === 'settings') {
                setShowSettings(true);
              } else {
                setCurrentScreen(screen);
              }
            }}
          />
        )}

        {/* Global Modals */}
        {showDailyCrate && (
          <DailyCrateModal
            onClose={() => setShowDailyCrate(false)}
            onClaimReward={handleClaimDailyCrate}
          />
        )}

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}
