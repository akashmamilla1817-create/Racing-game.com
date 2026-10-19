import React, { useState, useEffect, useRef } from 'react';
import { Stage, Vehicle, Difficulty, RaceResult } from '../types/game';
import { audio } from '../utils/audio';

interface ActiveRaceScreenProps {
  stage: Stage;
  vehicle: Vehicle;
  difficulty: Difficulty;
  bestDistance: number;
  onPause: () => void;
  onCrash: (result: RaceResult) => void;
  onVictory: (result: RaceResult) => void;
}

interface Obstacle {
  id: number;
  type: 'taxi' | 'rival' | 'truck' | 'police' | 'oil';
  lane: number;
  x: number; // 0 to 1
  y: number; // 0 to 100%
  speed: number;
  swerving?: boolean;
}

interface PowerUpItem {
  id: number;
  type: 'nitro_can' | 'shield' | 'magnet' | 'boost_pad';
  x: number;
  y: number;
  collected: boolean;
}

interface CoinItem {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export const ActiveRaceScreen: React.FC<ActiveRaceScreenProps> = ({
  stage,
  vehicle,
  difficulty,
  bestDistance,
  onPause,
  onCrash,
  onVictory,
}) => {
  // Lateral X position of player: 0.16 (far left) to 0.68 (far right)
  const [playerX, setPlayerX] = useState<number>(0.42);
  const [carAngle, setCarAngle] = useState<number>(0);
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const [nitroFuel, setNitroFuel] = useState<number>(85);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [magnetTimer, setMagnetTimer] = useState<number>(0);

  // Stats
  const [distance, setDistance] = useState<number>(1420);
  const [coinsCollected, setCoinsCollected] = useState<number>(48);
  const [nearMisses, setNearMisses] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);
  const [nearMissAlert, setNearMissAlert] = useState<string | null>('NEAR MISS! +50');
  const [checkpointAlert, setCheckpointAlert] = useState<string | null>(null);
  const [speedMph, setSpeedMph] = useState<number>(148);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [gear, setGear] = useState<number>(4);

  // Entities
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 1, type: 'rival', lane: 0, x: 0.18, y: 22, speed: 0.35 },
    { id: 2, type: 'taxi', lane: 2, x: 0.66, y: 15, speed: 0.3 },
    { id: 3, type: 'oil', lane: 0, x: 0.18, y: 62, speed: 0 },
    { id: 4, type: 'truck', lane: 1, x: 0.42, y: -25, speed: 0.22 },
  ]);

  const [powerups, setPowerups] = useState<PowerUpItem[]>([
    { id: 201, type: 'shield', x: 0.18, y: -40, collected: false },
    { id: 202, type: 'nitro_can', x: 0.66, y: -70, collected: false },
  ]);

  const [coins, setCoins] = useState<CoinItem[]>([
    { id: 101, x: 0.42, y: 38, collected: false },
    { id: 102, x: 0.42, y: 48, collected: false },
    { id: 103, x: 0.42, y: 58, collected: false },
  ]);

  // Steering key state
  const steerDirRef = useRef<number>(0); // -1 (left), 0 (none), 1 (right)
  const isDraggingRef = useRef<boolean>(false);
  const roadContainerRef = useRef<HTMLDivElement>(null);

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;
  const isNitroRef = useRef(isNitroActive);
  isNitroRef.current = isNitroActive;
  const hasShieldRef = useRef(hasShield);
  hasShieldRef.current = hasShield;
  const magnetTimerRef = useRef(magnetTimer);
  magnetTimerRef.current = magnetTimer;
  const distanceRef = useRef(distance);
  distanceRef.current = distance;
  const coinsRef = useRef(coinsCollected);
  coinsRef.current = coinsCollected;
  const nearMissesRef = useRef(nearMisses);
  nearMissesRef.current = nearMisses;

  // Audio start & stop
  useEffect(() => {
    audio.startEngine(0.5);
    return () => {
      audio.stopEngine();
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steerDirRef.current = -1;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steerDirRef.current = 1;
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        triggerNitro();
      } else if (e.key === 'h' || e.key === 'H') {
        audio.playHonk();
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        audio.stopEngine();
        audio.playClick();
        onPause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
        steerDirRef.current === -1
      ) {
        steerDirRef.current = 0;
      }
      if (
        (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
        steerDirRef.current === 1
      ) {
        steerDirRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nitroFuel, isNitroActive, onPause]);

  const triggerNitro = () => {
    if (nitroFuel > 15 && !isNitroActive) {
      audio.playNitro();
      setIsNitroActive(true);
      setNitroFuel((prev) => Math.max(0, prev - 30));
      setTimeout(() => {
        setIsNitroActive(false);
      }, 2600);
    }
  };

  // Touch and mouse road steering
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    updatePointerX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      updatePointerX(e.clientX);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const updatePointerX = (clientX: number) => {
    if (!roadContainerRef.current) return;
    const rect = roadContainerRef.current.getBoundingClientRect();
    const relativeX = (clientX - rect.left) / rect.width;
    // Clamp to highway lanes range 0.16 to 0.68
    const clamped = Math.max(0.16, Math.min(0.68, relativeX));
    const delta = clamped - playerXRef.current;
    setCarAngle(delta > 0.02 ? 8 : delta < -0.02 ? -8 : 0);
    setPlayerX(clamped);
  };

  // Determine Sector based on distance
  const getSectorInfo = (dist: number) => {
    if (dist < 2000) return { name: 'SECTOR 01: NEON METROPOLIS', weather: 'RAIN SLICK' };
    if (dist < 4500) return { name: 'SECTOR 02: CYBER HIGHWAY BYPASS', weather: 'TURBO DRAFT' };
    if (dist < 7500) return { name: 'SECTOR 03: ACID RAIN INDUSTRIAL', weather: 'HEAVY SLICK' };
    if (dist < 11000) return { name: 'SECTOR 04: HYPERSPACE UNDERGROUND', weather: 'MAX SPEED' };
    return { name: 'SECTOR 05: APEX OVERDRIVE', weather: 'EXTREME' };
  };

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let nextCheckpointMilestone = Math.floor(distanceRef.current / 1000) * 1000 + 1000;

    const gameTick = (time: number) => {
      const dt = Math.min(0.08, (time - lastTime) / 1000);
      lastTime = time;

      // Handle Continuous Steering from key/button hold
      if (steerDirRef.current !== 0) {
        const steerSpeed = 0.55 * dt;
        setPlayerX((prev) => {
          const next = Math.max(0.16, Math.min(0.68, prev + steerDirRef.current * steerSpeed));
          return next;
        });
        setCarAngle(steerDirRef.current * 7);
      } else if (!isDraggingRef.current) {
        setCarAngle((prev) => prev * 0.85);
      }

      // Drafting calculation
      let draftingDetected = false;
      for (const obs of obstacles) {
        if (
          obs.type !== 'oil' &&
          Math.abs(obs.x - playerXRef.current) < 0.12 &&
          obs.y > 45 &&
          obs.y < 70
        ) {
          draftingDetected = true;
          break;
        }
      }
      setIsDrafting(draftingDetected);

      // Base Speed & Nitro calculations
      const diffMultiplier = difficulty === 'easy' ? 48 : difficulty === 'medium' ? 62 : 82;
      let effectiveSpeed = diffMultiplier;
      if (isNitroRef.current) effectiveSpeed *= 1.65;
      if (draftingDetected) effectiveSpeed *= 1.15;

      const currentMph = Math.floor(effectiveSpeed * 2.35);
      setSpeedMph(currentMph);

      // Gear calculation
      const computedGear = Math.min(6, Math.max(1, Math.floor(currentMph / 42) + 1));
      setGear(computedGear);

      // Audio engine update
      audio.updateEngine(effectiveSpeed / 130);

      // Increment Distance
      setDistance((d) => {
        const nextDist = Math.floor(d + effectiveSpeed * dt * 3.2);

        // Checkpoint detection every 1,000m
        if (nextDist >= nextCheckpointMilestone) {
          audio.playVictory();
          setCheckpointAlert(`CHECKPOINT ${nextCheckpointMilestone}M! +250 COINS`);
          setCoinsCollected((c) => c + 250);
          nextCheckpointMilestone += 1000;
          setTimeout(() => setCheckpointAlert(null), 2500);
        }

        return nextDist;
      });

      // Passive Nitro Refill (faster if drafting)
      const refillSpeed = (stage.nitroRefillRate || 1.25) * (draftingDetected ? 2.2 : 1.0);
      setNitroFuel((fuel) => Math.min(100, fuel + refillSpeed * dt * 5.5));

      // Magnet timer
      if (magnetTimerRef.current > 0) {
        setMagnetTimer((t) => Math.max(0, t - dt));
      }

      // Update Obstacles
      setObstacles((prevObs) => {
        const nextObs: Obstacle[] = [];

        for (const obs of prevObs) {
          const moveSpeed = (effectiveSpeed * 0.42 + (obs.speed || 0.25) * 18) * dt;
          let newY = obs.y + moveSpeed;
          let newX = obs.x;

          // Civilian Taxi gentle lane swerve
          if (obs.type === 'taxi' && Math.random() < 0.01) {
            newX = Math.max(0.18, Math.min(0.66, obs.x + (Math.random() - 0.5) * 0.1));
          }

          // Collision Detection
          // Player car sits around y = 68% to 84%, x = playerXRef.current
          const deltaX = Math.abs(newX - playerXRef.current);
          const inCollisionZone = newY > 65 && newY < 81;

          if (deltaX < 0.13 && inCollisionZone) {
            if (obs.type === 'oil') {
              // Oil slick makes car skid
              audio.playScreech();
              setCarAngle(24);
              setTimeout(() => setCarAngle(-18), 120);
              setTimeout(() => setCarAngle(0), 300);
              continue;
            }

            if (isNitroRef.current) {
              // Smash through obstacles during nitro!
              audio.playCrash();
              audio.playNearMiss();
              setNearMissAlert('NITRO RAM! +150');
              setCoinsCollected((c) => c + 15);
              continue;
            }

            if (hasShieldRef.current) {
              // Shield absorbs crash!
              audio.playShieldBreak();
              setHasShield(false);
              setNearMissAlert('SHIELD SAVED YOU!');
              setTimeout(() => setNearMissAlert(null), 1500);
              continue;
            }

            // Fatal Crash
            audio.playCrash();
            const result: RaceResult = {
              finalScore: Math.floor(
                distanceRef.current * 10 +
                  nearMissesRef.current * 120 +
                  coinsRef.current * 25
              ),
              distance: distanceRef.current,
              previousBest: bestDistance,
              isNewPersonalBest: distanceRef.current > bestDistance,
              nearMisses: nearMissesRef.current,
              coinsLooted: coinsRef.current,
              xpEarned: 450,
              stageId: stage.id,
              difficulty,
              gameMode: 'endless',
              checkpointsReached: Math.floor(distanceRef.current / 1000),
            };
            onCrash(result);
            return prevObs;
          }

          // Near-miss check
          if (
            deltaX >= 0.13 &&
            deltaX < 0.24 &&
            newY > 70 &&
            newY < 74 &&
            obs.type !== 'oil'
          ) {
            audio.playNearMiss();
            setNearMisses((n) => n + 1);
            setComboMultiplier((prev) => Math.min(5, prev + 1));
            setNearMissAlert(`NEAR MISS! +${50 * comboMultiplier}`);
            setCoinsCollected((c) => c + 5);
            setTimeout(() => setNearMissAlert(null), 1200);
          }

          if (newY < 120) {
            nextObs.push({ ...obs, y: newY, x: newX });
          }
        }

        // Spawn new obstacles dynamically to maintain density
        if (nextObs.length < 4) {
          const types: ('taxi' | 'rival' | 'truck' | 'police' | 'oil')[] = [
            'taxi',
            'rival',
            'truck',
            'rival',
            'oil',
            'police',
          ];
          const chosenType = types[Math.floor(Math.random() * types.length)];
          const lanesX = [0.18, 0.42, 0.66];
          const chosenLane = Math.floor(Math.random() * 3);
          const chosenX = lanesX[chosenLane];

          // Ensure not spawning directly atop existing obstacle
          const tooClose = nextObs.some(
            (o) => Math.abs(o.x - chosenX) < 0.1 && o.y < 10
          );
          if (!tooClose) {
            nextObs.push({
              id: Date.now() + Math.random(),
              type: chosenType,
              lane: chosenLane,
              x: chosenX,
              y: -18,
              speed:
                chosenType === 'oil'
                  ? 0
                  : chosenType === 'truck'
                  ? 0.18
                  : chosenType === 'police'
                  ? 0.45
                  : 0.28 + Math.random() * 0.15,
            });
          }
        }

        return nextObs;
      });

      // Update Powerups
      setPowerups((prevPow) => {
        const nextPow: PowerUpItem[] = [];
        for (const p of prevPow) {
          const newY = p.y + effectiveSpeed * 0.45 * dt;

          if (
            !p.collected &&
            Math.abs(p.x - playerXRef.current) < 0.16 &&
            newY > 66 &&
            newY < 82
          ) {
            p.collected = true;
            if (p.type === 'shield') {
              audio.playShieldPickup();
              setHasShield(true);
              setNearMissAlert('CYBER SHIELD ACTIVE! 🛡️');
            } else if (p.type === 'nitro_can') {
              audio.playNitro();
              setNitroFuel(100);
              setNearMissAlert('MAX NITRO REFILLED! ⚡');
            } else if (p.type === 'magnet') {
              audio.playCoin();
              setMagnetTimer(10);
              setNearMissAlert('COIN MAGNET ACTIVE! 🧲');
            } else if (p.type === 'boost_pad') {
              audio.playNitro();
              triggerNitro();
            }
            setTimeout(() => setNearMissAlert(null), 1500);
          }

          if (newY < 120 && !p.collected) {
            nextPow.push({ ...p, y: newY });
          }
        }

        // Random powerup spawn
        if (nextPow.length < 2 && Math.random() < 0.015) {
          const powTypes: ('nitro_can' | 'shield' | 'magnet')[] = [
            'nitro_can',
            'shield',
            'magnet',
          ];
          const lanesX = [0.18, 0.42, 0.66];
          nextPow.push({
            id: Date.now() + Math.random(),
            type: powTypes[Math.floor(Math.random() * powTypes.length)],
            x: lanesX[Math.floor(Math.random() * 3)],
            y: -20,
            collected: false,
          });
        }

        return nextPow;
      });

      // Update Coins
      setCoins((prevCoins) => {
        const nextCoins: CoinItem[] = [];

        for (const coin of prevCoins) {
          let newY = coin.y + effectiveSpeed * 0.5 * dt;
          let newX = coin.x;

          // Magnet Attraction
          if (magnetTimerRef.current > 0) {
            const dx = playerXRef.current - newX;
            newX += dx * 0.15;
          }

          // Pickup
          if (
            !coin.collected &&
            Math.abs(newX - playerXRef.current) < 0.15 &&
            newY > 66 &&
            newY < 81
          ) {
            audio.playCoin();
            setCoinsCollected((c) => c + Math.ceil(stage.coinMultiplier));
            coin.collected = true;
          }

          if (newY < 120 && !coin.collected) {
            nextCoins.push({ ...coin, y: newY, x: newX });
          }
        }

        if (nextCoins.length < 4) {
          const lanesX = [0.18, 0.42, 0.66];
          const lane = lanesX[Math.floor(Math.random() * 3)];
          const baseOffset = -10;
          for (let i = 0; i < 4; i++) {
            nextCoins.push({
              id: Date.now() + i + Math.random(),
              x: lane,
              y: baseOffset - i * 8,
              collected: false,
            });
          }
        }

        return nextCoins;
      });

      animId = requestAnimationFrame(gameTick);
    };

    animId = requestAnimationFrame(gameTick);
    return () => cancelAnimationFrame(animId);
  }, [difficulty, stage, bestDistance, onCrash, comboMultiplier]);

  const currentSector = getSectorInfo(distance);

  return (
    <main
      ref={roadContainerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full max-w-[390px] h-screen max-h-[844px] bg-[#0a0e1a] overflow-hidden shadow-2xl flex flex-col justify-between border-x border-[#3b494c]/30 select-none touch-none"
    >
      {/* HIGHWAY 3-LANE CANVAS */}
      <div className="absolute inset-0 w-full h-full highway-track overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00e5ff]/10 via-transparent to-[#0f131f]/90 pointer-events-none" />

        {/* Dynamic rain streaks when in Sector 1 or 3 */}
        {(distance < 2000 || (distance >= 4500 && distance < 7500)) && (
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#c3f5ff_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
        )}

        {/* Curb Rumble Strips */}
        <div className="absolute left-3 top-0 bottom-0 w-2 curb-left shadow-[0_0_8px_rgba(255,59,48,0.5)] z-0" />
        <div className="absolute right-3 top-0 bottom-0 w-2 curb-right shadow-[0_0_8px_rgba(255,59,48,0.5)] z-0" />

        {/* Lane Dividers */}
        <div className="absolute left-[34%] top-0 bottom-0 w-[4px] road-stripes opacity-75 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
        <div className="absolute left-[65%] top-0 bottom-0 w-[4px] road-stripes opacity-75 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />

        {/* OBSTACLES */}
        {obstacles.map((obs) => {
          if (obs.type === 'oil') {
            return (
              <div
                key={obs.id}
                className="absolute w-20 flex flex-col items-center pointer-events-none transition-all duration-75 -translate-x-1/2"
                style={{ top: `${obs.y}%`, left: `${obs.x * 100}%` }}
              >
                <div className="w-16 h-8 bg-[#0a0e1a]/90 rounded-[50%] border border-[#f5cd00]/60 shadow-[0_0_14px_rgba(245,205,0,0.4)] flex items-center justify-center transform -rotate-6">
                  <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                </div>
                <span className="font-['Barlow_Condensed'] text-[11px] text-[#f5cd00] font-bold italic tracking-widest mt-1 bg-[#0a0e1a]/80 px-1 rounded shadow">
                  OIL HAZARD
                </span>
              </div>
            );
          }

          if (obs.type === 'truck') {
            return (
              <div
                key={obs.id}
                className="absolute w-18 flex flex-col items-center transition-all duration-75 -translate-x-1/2"
                style={{ top: `${obs.y}%`, left: `${obs.x * 100}%` }}
              >
                <div className="w-16 h-28 bg-[#1b1f2c] rounded-t-lg rounded-b-md border-2 border-[#849396] shadow-[0_8px_24px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between p-1">
                  <div className="w-12 h-3 bg-[#0a0e1a] rounded-sm flex justify-between px-1 items-center">
                    <span className="w-1 h-1 bg-[#f5cd00] rounded-full animate-ping" />
                    <span className="w-1 h-1 bg-[#f5cd00] rounded-full animate-ping" />
                  </div>
                  <div className="text-[9px] font-['Barlow_Condensed'] font-black text-[#849396] uppercase">
                    CYBER FREIGHT
                  </div>
                  <div className="w-full flex justify-between px-1">
                    <div className="w-3 h-2 bg-[#ff3b30] rounded-xs shadow-[0_0_8px_#ff3b30]" />
                    <div className="w-3 h-2 bg-[#ff3b30] rounded-xs shadow-[0_0_8px_#ff3b30]" />
                  </div>
                </div>
                <span className="font-['Barlow_Condensed'] text-[10px] text-[#849396] mt-0.5 font-bold">HAULER</span>
              </div>
            );
          }

          if (obs.type === 'police') {
            return (
              <div
                key={obs.id}
                className="absolute w-16 flex flex-col items-center transition-all duration-75 -translate-x-1/2"
                style={{ top: `${obs.y}%`, left: `${obs.x * 100}%` }}
              >
                {/* Flashing Police Lightbar */}
                <div className="w-10 h-2 rounded flex overflow-hidden mb-0.5 shadow-[0_0_12px_#00e5ff]">
                  <div className="flex-1 bg-[#00e5ff] animate-pulse" />
                  <div className="flex-1 bg-[#ff3b30] animate-pulse" />
                </div>
                <div className="relative w-14 h-24 bg-gradient-to-b from-[#1b243b] to-[#0a0e1a] rounded-t-2xl rounded-b-lg border-2 border-white shadow-[0_8px_20px_rgba(0,229,255,0.45)] flex flex-col items-center">
                  <div className="w-9 h-6 bg-[#0a0e1a] rounded-t-lg mt-2 border border-white/50" />
                  <div className="absolute -bottom-1 w-full flex justify-between px-2">
                    <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
                    <div className="w-2 h-2 rounded-full bg-[#ff3b30] shadow-[0_0_8px_#ff3b30]" />
                  </div>
                </div>
                <span className="font-['Barlow_Condensed'] text-[11px] text-[#00e5ff] mt-1 font-black tracking-wider">
                  INTERCEPTOR
                </span>
              </div>
            );
          }

          if (obs.type === 'taxi') {
            return (
              <div
                key={obs.id}
                className="absolute w-16 flex flex-col items-center transition-all duration-75 -translate-x-1/2"
                style={{ top: `${obs.y}%`, left: `${obs.x * 100}%` }}
              >
                <div className="w-6 h-2 bg-[#f5cd00] rounded-sm shadow-[0_0_8px_#f5cd00] mb-0.5" />
                <div className="relative w-14 h-24 bg-gradient-to-b from-[#f5cd00] to-[#d6af00] rounded-t-xl rounded-b-md border border-[#ffecac] shadow-[0_6px_16px_rgba(0,0,0,0.85)] flex flex-col items-center overflow-hidden">
                  <div className="w-10 h-4 bg-[#0a0e1a]/80 rounded-t mt-3 border-t border-[#3b494c]/50" />
                  <div className="w-full h-2 bg-[#0a0e1a] my-2 flex justify-around items-center px-1">
                    <span className="w-1.5 h-1.5 bg-[#f5cd00]" />
                    <span className="w-1.5 h-1.5 bg-[#f5cd00]" />
                    <span className="w-1.5 h-1.5 bg-[#f5cd00]" />
                  </div>
                  <div className="absolute bottom-1 w-full flex justify-between px-1.5">
                    <div className="w-2.5 h-1.5 bg-[#c5020b] rounded-sm shadow-[0_0_6px_#c5020b]" />
                    <div className="w-2.5 h-1.5 bg-[#c5020b] rounded-sm shadow-[0_0_6px_#c5020b]" />
                  </div>
                </div>
                <span className="font-['Barlow_Condensed'] text-[11px] text-[#bac9cc] mt-1 font-bold">CAB #402</span>
              </div>
            );
          }

          // Rival Sports Coupe
          return (
            <div
              key={obs.id}
              className="absolute w-16 flex flex-col items-center transition-all duration-75 -translate-x-1/2"
              style={{ top: `${obs.y}%`, left: `${obs.x * 100}%` }}
            >
              <div className="w-14 h-1.5 bg-[#0a0e1a] rounded-full border border-[#c5020b] shadow-[0_0_4px_#c5020b] -mb-0.5 z-10" />
              <div className="relative w-14 h-24 bg-gradient-to-b from-[#e52e25] to-[#c5020b] rounded-t-2xl rounded-b-lg border border-[#c5020b] shadow-[0_8px_20px_rgba(197,2,11,0.45)] flex flex-col items-center">
                <div className="w-9 h-6 bg-[#0a0e1a]/90 rounded-t-lg mt-2 border border-[#3b494c]/40" />
                <div className="absolute -bottom-1 w-full flex justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff3b30] shadow-[0_0_8px_#ff3b30]" />
                  <div className="w-2 h-2 rounded-full bg-[#ff3b30] shadow-[0_0_8px_#ff3b30]" />
                </div>
              </div>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#ffb4aa] mt-1 font-black tracking-wider">
                RIVAL
              </span>
            </div>
          );
        })}

        {/* POWERUPS */}
        {powerups.map((p) => (
          <div
            key={p.id}
            className="absolute flex flex-col items-center pointer-events-none -translate-x-1/2 animate-bounce"
            style={{ top: `${p.y}%`, left: `${p.x * 100}%` }}
          >
            {p.type === 'shield' && (
              <div className="w-8 h-8 rounded-full bg-[#00e5ff]/20 border-2 border-[#00e5ff] shadow-[0_0_16px_#00e5ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00e5ff] text-[18px]">security</span>
              </div>
            )}
            {p.type === 'nitro_can' && (
              <div className="w-8 h-8 rounded-full bg-[#f5cd00]/20 border-2 border-[#f5cd00] shadow-[0_0_16px_#f5cd00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#f5cd00] text-[18px]">bolt</span>
              </div>
            )}
            {p.type === 'magnet' && (
              <div className="w-8 h-8 rounded-full bg-[#ff3b30]/20 border-2 border-[#ff3b30] shadow-[0_0_16px_#ff3b30] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ff3b30] text-[18px]">magnet</span>
              </div>
            )}
          </div>
        ))}

        {/* COIN COLLECTIBLES */}
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute flex flex-col items-center animate-coin pointer-events-none -translate-x-1/2"
            style={{ top: `${coin.y}%`, left: `${coin.x * 100}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e9c400] via-[#f5cd00] to-[#ffecac] border-2 border-[#ffe170] shadow-[0_0_14px_#f5cd00] flex items-center justify-center">
              <span className="font-['Barlow_Condensed'] text-[16px] text-[#0a0e1a] font-black">$</span>
            </div>
            <div className="w-3 h-1 bg-[#f5cd00]/40 rounded-full blur-[2px] mt-1" />
          </div>
        ))}

        {/* PLAYER RACER */}
        <div
          className="absolute bottom-[160px] w-20 flex flex-col items-center z-20 pointer-events-none transition-transform duration-75 ease-out -translate-x-1/2"
          style={{
            left: `${playerX * 100}%`,
            transform: `rotate(${carAngle}deg) ${isNitroActive ? 'scale(1.1) translateY(-14px)' : 'scale(1)'}`,
          }}
        >
          {/* Forcefield Bubble if shield active */}
          {hasShield && (
            <div className="absolute -inset-4 rounded-full border-2 border-[#00e5ff] bg-[#00e5ff]/15 shadow-[0_0_24px_#00e5ff] animate-pulse pointer-events-none z-40" />
          )}

          {/* Drafting Slipstream Air Trails */}
          {isDrafting && (
            <div className="absolute -top-16 w-16 h-18 pointer-events-none flex justify-between opacity-80 animate-pulse">
              <span className="w-1 h-full bg-gradient-to-t from-[#00e5ff] to-transparent blur-xs" />
              <span className="w-1 h-full bg-gradient-to-t from-[#00e5ff] to-transparent blur-xs" />
            </div>
          )}

          {/* Aerodynamic Slipstream Trail */}
          <div className="absolute -top-12 w-12 h-14 bg-gradient-to-t from-[#00e5ff]/30 to-transparent blur-md" />

          {/* Spoiler */}
          <div
            className="w-16 h-2 bg-[#0a0e1a] rounded-sm border-t shadow-[0_0_10px_#00e5ff] z-30"
            style={{ borderColor: vehicle.liveryColor || '#00e5ff' }}
          />

          {/* Car Hull */}
          <div
            className="relative w-16 h-28 rounded-t-2xl rounded-b-xl border-2 shadow-[0_0_24px_rgba(0,229,255,0.65)] flex flex-col items-center"
            style={{
              backgroundColor: '#121829',
              borderColor: vehicle.liveryColor || '#00e5ff',
              backgroundImage: `linear-gradient(to bottom, #1b243b, ${vehicle.liveryColor || '#00e5ff'} 70%, #004f58)`,
            }}
          >
            <div className="absolute top-2 w-1.5 h-16 bg-[#0a0e1a]/40 rounded-full" />
            <div className="w-10 h-9 bg-[#0a0e1a]/90 rounded-t-xl rounded-b-md mt-4 border border-[#00e5ff]/70 shadow-inner flex items-center justify-center">
              <div className="w-7 h-5 bg-gradient-to-b from-[#00daf3]/30 to-transparent rounded" />
            </div>
            <div className="absolute top-14 left-1 w-1.5 h-6 bg-[#0a0e1a] rounded-sm" />
            <div className="absolute top-14 right-1 w-1.5 h-6 bg-[#0a0e1a] rounded-sm" />
            <div className="absolute bottom-1 w-full flex justify-between items-center px-2">
              <div className="w-3 h-2 bg-[#ff3b30] rounded-sm shadow-[0_0_12px_#ff3b30] ring-1 ring-white" />
              <div className="w-4 h-3 bg-[#00e5ff] rounded-full shadow-[0_0_16px_#00e5ff] animate-pulse" />
              <div className="w-3 h-2 bg-[#ff3b30] rounded-sm shadow-[0_0_12px_#ff3b30] ring-1 ring-white" />
            </div>
          </div>

          {/* Nitro Flames */}
          <div
            className={`w-6 rounded-b-full blur-xs transition-all duration-150 ${
              isNitroActive
                ? 'h-14 bg-gradient-to-b from-[#00e5ff] via-white to-transparent opacity-100 shadow-[0_6px_20px_#00e5ff]'
                : 'h-5 bg-gradient-to-b from-[#00e5ff] to-transparent opacity-85 shadow-[0_4px_14px_#00e5ff]'
            }`}
          />
        </div>
      </div>

      {/* TOP HUD CLUSTER */}
      <header className="relative z-30 pt-3 px-3 flex flex-col gap-1 pointer-events-auto">
        <div className="flex justify-between items-start">
          {/* Distance Pod */}
          <div className="bg-[#171b28]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#00e5ff]/30 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-['Barlow_Condensed'] text-[13px] text-[#bac9cc] uppercase font-bold">DIST</span>
              <span className="font-['Barlow_Condensed'] text-[28px] text-[#00e5ff] italic font-black tracking-tight leading-none">
                {distance.toLocaleString()}<span className="text-xs font-semibold text-[#c3f5ff] ml-0.5">M</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 border-t border-[#3b494c]/30 pt-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[#f5cd00] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#849396] font-bold">
                BEST: <span className="text-[#ffecac]">{bestDistance.toLocaleString()} M</span>
              </span>
            </div>
          </div>

          {/* Coins & Powerups & Pause */}
          <div className="flex items-center gap-2">
            {hasShield && (
              <div className="w-8 h-8 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff] flex items-center justify-center text-[#00e5ff] shadow-[0_0_8px_#00e5ff]">
                <span className="material-symbols-outlined text-[16px]">security</span>
              </div>
            )}
            {magnetTimer > 0 && (
              <div className="w-8 h-8 rounded-full bg-[#ff3b30]/20 border border-[#ff3b30] flex items-center justify-center text-[#ff3b30] shadow-[0_0_8px_#ff3b30] animate-pulse">
                <span className="material-symbols-outlined text-[16px]">magnet</span>
              </div>
            )}

            <div className="bg-[#171b28]/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#f5cd00]/50 shadow-[0_2px_12px_rgba(245,205,0,0.2)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                monetization_on
              </span>
              <span className="font-['Barlow_Condensed'] text-[18px] text-[#ffecac] font-black tracking-tight leading-none">
                {coinsCollected}
              </span>
            </div>

            <button
              onClick={() => {
                audio.stopEngine();
                audio.playClick();
                onPause();
              }}
              className="w-10 h-10 rounded-full bg-[#262a37]/90 border border-[#849396] hover:border-[#00e5ff] text-[#dfe2f3] hover:text-[#00e5ff] transition-all flex items-center justify-center active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">pause</span>
            </button>
          </div>
        </div>

        {/* Checkpoint Banner */}
        {checkpointAlert && (
          <div className="self-center mt-1 animate-bounce">
            <div className="px-4 py-1.5 bg-[#f5cd00] text-[#0a0e1a] border-2 border-white rounded-full shadow-[0_0_24px_rgba(245,205,0,0.8)] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                flag
              </span>
              <span className="font-['Anybody'] text-[15px] italic font-black uppercase tracking-wider">
                {checkpointAlert}
              </span>
            </div>
          </div>
        )}

        {/* Near-Miss Alert Banner */}
        {nearMissAlert && !checkpointAlert && (
          <div className="self-center mt-1 animate-combo-float transition-all duration-300">
            <div className="px-4 py-1 bg-[#0a0e1a]/90 border-2 border-[#f5cd00] rounded-full shadow-[0_0_18px_rgba(245,205,0,0.65)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="font-['Anybody'] text-[14px] italic font-extrabold text-[#f5cd00] tracking-wider drop-shadow-[0_0_8px_#f5cd00]">
                {nearMissAlert}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* MID-RIGHT HUD: SPEEDOMETER & SECTOR */}
      <div className="relative z-30 px-3 flex justify-between items-end pointer-events-none mb-1">
        {/* Stage Zone & Drafting Tag */}
        <div className="flex flex-col gap-1">
          <div className="bg-[#0a0e1a]/85 backdrop-blur-md border-l-2 border-[#00e5ff] px-2.5 py-1 rounded-r-md">
            <span className="font-['Barlow_Condensed'] text-[10px] text-[#849396] uppercase font-bold block leading-none">
              ZONE
            </span>
            <span className="font-['Anybody'] text-[13px] italic text-[#dfe2f3] font-extrabold tracking-wide">
              {currentSector.name}
            </span>
          </div>

          {isDrafting && (
            <div className="bg-[#00e5ff]/20 border border-[#00e5ff] px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-black text-[#00e5ff] uppercase animate-pulse flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">air</span>
              DRAFTING SPEED BOOST (+15%)
            </div>
          )}
        </div>

        {/* Circular Speedometer Gauge */}
        <div className="relative w-28 h-28 rounded-full bg-[#171b28]/90 backdrop-blur-md border border-[#00e5ff]/40 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex flex-col items-center justify-center pointer-events-auto">
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="42" stroke="#1b1f2c" strokeDasharray="210" strokeDashoffset="30" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="42"
              stroke="url(#speedoGradient)"
              strokeDasharray="210"
              strokeDashoffset={Math.max(20, 210 - (speedMph / 280) * 180)}
              strokeLinecap="round"
              strokeWidth="6"
            />
            <defs>
              <linearGradient id="speedoGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="70%" stopColor="#f5cd00" />
                <stop offset="100%" stopColor="#ff3b30" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-['Barlow_Condensed'] text-[32px] leading-none text-[#00e5ff] italic font-black drop-shadow-[0_0_10px_#00e5ff]">
            {speedMph}
          </span>
          <span className="font-['Barlow_Condensed'] text-[11px] text-[#849396] tracking-wider -mt-1 font-bold">
            MPH // GEAR {gear}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] shadow-[0_0_6px_#ff3b30] mt-0.5" />
        </div>
      </div>

      {/* BOTTOM THUMB-ZONE CONTROLS */}
      <footer className="relative z-40 pb-5 px-3 pt-1 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Steer Left */}
          <button
            onPointerDown={() => {
              steerDirRef.current = -1;
              audio.playClick();
            }}
            onPointerUp={() => {
              steerDirRef.current = 0;
            }}
            onPointerLeave={() => {
              steerDirRef.current = 0;
            }}
            className="w-15 h-15 rounded-2xl bg-[#262a37]/75 backdrop-blur-lg border border-[#3b494c]/60 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center active:scale-90 active:border-[#00e5ff] active:bg-[#00e5ff]/20 transition-all text-[#dfe2f3] hover:text-[#00e5ff] cursor-pointer"
            id="btnLeft"
          >
            <span className="material-symbols-outlined text-[32px]">arrow_left_alt</span>
          </button>

          {/* Steer Right */}
          <button
            onPointerDown={() => {
              steerDirRef.current = 1;
              audio.playClick();
            }}
            onPointerUp={() => {
              steerDirRef.current = 0;
            }}
            onPointerLeave={() => {
              steerDirRef.current = 0;
            }}
            className="w-15 h-15 rounded-2xl bg-[#262a37]/75 backdrop-blur-lg border border-[#3b494c]/60 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center active:scale-90 active:border-[#00e5ff] active:bg-[#00e5ff]/20 transition-all text-[#dfe2f3] hover:text-[#00e5ff] cursor-pointer"
            id="btnRight"
          >
            <span className="material-symbols-outlined text-[32px]">arrow_right_alt</span>
          </button>

          {/* Horn button */}
          <button
            onClick={() => audio.playHonk()}
            className="w-10 h-15 rounded-xl bg-[#1b1f2c]/80 border border-[#3b494c]/40 text-[#849396] hover:text-[#f5cd00] active:scale-90 flex items-center justify-center cursor-pointer"
            title="Honk Horn"
          >
            <span className="material-symbols-outlined text-[18px]">volume_up</span>
          </button>
        </div>

        {/* Nitro Boost Button */}
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 rounded-2xl bg-[#00e5ff]/20 blur-md animate-nitro-glow pointer-events-none" />
          <button
            onClick={triggerNitro}
            disabled={nitroFuel < 15}
            className={`relative w-24 h-16 rounded-2xl bg-gradient-to-b from-[#00e5ff] to-[#00b2c7] border-t border-[#c3f5ff] text-[#00363d] font-['Anybody'] italic font-black tracking-wider shadow-[0_4px_0_#008a99,0_8px_20px_rgba(0,229,255,0.5)] active:translate-y-1 active:shadow-[0_0_0_#008a99,0_0_24px_rgba(0,229,255,0.8)] transition-all flex flex-col items-center justify-center cursor-pointer ${
              nitroFuel < 15 ? 'opacity-50 grayscale' : ''
            }`}
            id="btnNitro"
          >
            <div className="flex items-center gap-1 leading-none">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="text-[18px] font-['Anybody']">NITRO</span>
            </div>
            <div className="w-14 h-1.5 bg-[#0a0e1a]/40 rounded-full mt-1 overflow-hidden p-0.5">
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${nitroFuel}%` }}
              />
            </div>
          </button>
        </div>
      </footer>
    </main>
  );
};
