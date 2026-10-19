import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RaceResult } from '../types/game';
import { audio } from '../utils/audio';

interface VictoryScreenProps {
  result: RaceResult;
  playerLevel: number;
  totalCoins: number;
  onClaimAndContinue: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  result,
  playerLevel,
  totalCoins,
  onClaimAndContinue,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#f5cd00', '#ffffff', '#ffb4aa'],
      });
    } catch {}
  }, []);

  const handleShare = () => {
    audio.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'Pocket Racer - New Stage Record!',
        text: `I just conquered ${result.distance}m in Pocket Racer! Can you beat my record?`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I just conquered ${result.distance}m in Pocket Racer!`);
      alert('Record copied to clipboard! Share with your crew.');
    }
  };

  return (
    <div className="relative w-full max-w-[390px] min-h-screen max-h-[844px] bg-[#0a0e1a] flex flex-col justify-between overflow-hidden shadow-2xl border-x border-[#3b494c]/20 select-none overflow-y-auto no-scrollbar">
      {/* Ambient Neon Laser Beams & Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #00e5ff 0, #00e5ff 1px, transparent 0, transparent 16px)' }}
        />
        {/* Rotating Neon God-Ray Beams */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[540px] h-[540px] anim-beam opacity-30">
          <div className="absolute inset-0 bg-gradient-to-t from-[#00e5ff] via-transparent to-transparent [mask-image:conic-gradient(from_0deg,transparent_0_20deg,white_40deg,transparent_60deg_80deg,white_100deg,transparent_120deg_140deg,white_160deg,transparent_180deg_200deg,white_220deg,transparent_240deg_260deg,white_280deg,transparent_300deg_320deg,white_340deg,transparent_360deg)]" />
        </div>

        {/* Luminous Energy Orb Core */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#f5cd00]/20 rounded-full blur-3xl anim-pulse-glow" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00e5ff]/15 rounded-full blur-2xl" />

        {/* Particle Sparkles */}
        <div className="particle w-2 h-2 bg-[#f5cd00] rounded-full top-[160px] left-[15%]" />
        <div className="particle w-1.5 h-1.5 bg-[#00e5ff] rounded-sm top-[210px] left-[80%]" />
        <div className="particle w-2.5 h-2.5 bg-[#ffe170] rounded-full top-[280px] left-[25%]" />
      </div>

      {/* Screen Header */}
      <header className="relative z-10 w-full px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#171b28]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.25)]">
          <span className="material-symbols-outlined text-[#00e5ff] text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            sports_motorsports
          </span>
          <span className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#c3f5ff] tracking-wider uppercase">
            LVL {playerLevel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#171b28]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#f5cd00]/50 shadow-[0_0_12px_rgba(245,205,0,0.2)]">
          <span className="material-symbols-outlined text-[#f5cd00] text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            toll
          </span>
          <span className="font-['Barlow_Condensed'] text-[18px] font-black text-[#f5cd00] leading-none">
            {totalCoins.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 w-full px-3 flex flex-col items-center flex-grow pt-1 pb-4">
        {/* Giant Trophy & Banner */}
        <div className="relative w-full flex flex-col items-center mb-1">
          {/* Floating Stars */}
          <div className="absolute -top-1 left-12 flex gap-1 items-center animate-bounce">
            <span className="material-symbols-outlined text-[#f5cd00] text-2xl drop-shadow-[0_0_8px_#f5cd00]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div className="absolute top-2 right-12 flex gap-1 items-center animate-bounce" style={{ animationDelay: '0.4s' }}>
            <span className="material-symbols-outlined text-[#ffe170] text-xl drop-shadow-[0_0_8px_#f5cd00]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>

          {/* 3D Prestige Trophy Graphic */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f5cd00] to-[#00e5ff] opacity-25 blur-xl" />
            <div className="relative z-10 w-24 h-24 rounded-2xl bg-[#262a37]/90 border-2 border-[#f5cd00] flex items-center justify-center shadow-[0_0_24px_rgba(245,205,0,0.45)]">
              <span className="material-symbols-outlined text-6xl text-[#f5cd00] drop-shadow-[0_4px_16px_rgba(245,205,0,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#c5020b] text-white px-1.5 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] uppercase italic tracking-widest border border-[#ffb4aa] shadow-[0_0_10px_#c5020b] font-black">
              #1 OVERALL
            </span>
          </div>

          {/* Arcade Slanted Banner Ribbon */}
          <div className="relative mt-2.5 -rotate-1 transform">
            <div className="bg-gradient-to-r from-[#c5020b] via-[#e52e25] to-[#c5020b] px-5 py-1.5 rounded-lg border-y-2 border-[#ffdad5] shadow-[0_4px_16px_rgba(197,2,11,0.65)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-white text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <h1 className="font-['Anybody'] text-[18px] italic font-black text-white tracking-wider uppercase drop-shadow-md">
                NEW STAGE RECORD!
              </h1>
              <span className="material-symbols-outlined text-white text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 bg-[#0a0e1a]/80 px-3 py-0.5 rounded-full border border-[#3b494c]/50">
            <span className="material-symbols-outlined text-[#00e5ff] text-sm">flag</span>
            <span className="font-['Barlow_Condensed'] text-[12px] font-bold text-[#bac9cc] uppercase">
              Neon Metropolis
            </span>
            <span className="text-[#ffdad5] font-['Barlow_Condensed'] text-[12px] font-black">
              • [{result.difficulty.toUpperCase()} MODE]
            </span>
          </div>
        </div>

        {/* Distance Conquered Bento Card */}
        <section className="w-full mt-2 bg-[#1b1f2c]/90 backdrop-blur-xl rounded-xl p-3 border border-[#00e5ff]/40 shadow-[0_8px_32px_rgba(0,0,0,0.7)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent shadow-[0_0_12px_#00e5ff]" />
          <div className="flex items-center justify-between mb-1">
            <span className="font-['Barlow_Condensed'] text-[12px] font-bold text-[#849396] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#00e5ff]">speed</span>
              DISTANCE CONQUERED
            </span>
            <span className="font-['Barlow_Condensed'] text-[11px] font-extrabold text-[#f5cd00] bg-[#f5cd00]/15 px-2 py-0.5 rounded border border-[#f5cd00]/30">
              +{result.distance - result.previousBest > 0 ? `${result.distance - result.previousBest}m BOOST` : 'STAGE CLEARED'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Barlow_Condensed'] text-[48px] text-[#c3f5ff] italic font-black tracking-tight drop-shadow-[0_0_20px_rgba(0,229,255,0.65)] leading-none">
                {result.distance.toLocaleString()}
              </span>
              <span className="font-['Barlow_Condensed'] text-[24px] text-[#00e5ff] italic font-extrabold">
                METERS
              </span>
            </div>
            <div className="text-right">
              <div className="font-['Barlow_Condensed'] text-[11px] text-[#849396] uppercase font-bold">Previous Best</div>
              <div className="font-['Barlow_Condensed'] text-[18px] text-[#bac9cc] line-through decoration-[#c5020b] decoration-2 font-bold leading-none">
                {result.previousBest.toLocaleString()}m
              </div>
            </div>
          </div>

          {/* Segmented bar */}
          <div className="w-full mt-3 bg-[#0a0e1a] p-1.5 rounded-lg border border-[#3b494c]/30 flex items-center gap-1">
            <div className="h-2 flex-1 rounded-sm bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <div className="h-2 flex-1 rounded-sm bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <div className="h-2 flex-1 rounded-sm bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <div className="h-2 flex-1 rounded-sm bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <div className="h-2 flex-1 rounded-sm bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <div className="h-2 flex-1 rounded-sm bg-[#f5cd00] shadow-[0_0_8px_#f5cd00] animate-pulse" />
            <div className="h-2 flex-1 rounded-sm bg-[#313442]" />
          </div>
        </section>

        {/* Bonus Rewards Unlocked */}
        <section className="w-full mt-2.5 bg-[#171b28]/95 backdrop-blur-xl rounded-xl p-3 border border-[#3b494c]/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#f5cd00] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
              <h2 className="font-['Anybody'] text-[16px] italic uppercase text-[#dfe2f3] font-bold">
                BONUS REWARDS
              </h2>
            </div>
            <span className="font-['Barlow_Condensed'] text-[11px] font-black text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/30 uppercase tracking-widest">
              STAGE CLEAR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="relative bg-[#1b1f2c]/80 rounded-lg p-2.5 border border-[#f5cd00]/40 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#313442] flex items-center justify-center mb-1 border border-[#f5cd00]/60 shadow-[0_0_12px_rgba(245,205,0,0.3)]">
                <span className="material-symbols-outlined text-[#f5cd00] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monetization_on
                </span>
              </div>
              <span className="font-['Barlow_Condensed'] text-[24px] text-[#f5cd00] italic font-black leading-none">
                +{result.coinsLooted + 500}
              </span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#bac9cc] uppercase mt-0.5 font-bold">
                Coins Awarded
              </span>
            </div>

            <div className="relative bg-[#1b1f2c]/80 rounded-lg p-2.5 border border-[#00e5ff]/50 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#313442] flex items-center justify-center mb-1 border border-[#00e5ff]/70 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                <span className="material-symbols-outlined text-[#00e5ff] text-2xl">tire_repair</span>
              </div>
              <span className="font-['Barlow_Condensed'] text-[15px] text-[#c3f5ff] font-black uppercase leading-tight">
                {result.bonusRewardPart || 'Neon Cyan Rims'}
              </span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#ffe170] uppercase mt-0.5 font-bold">
                Epic Tuning Part
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-[#0a0e1a]/70 border border-[#3b494c]/30">
            <span className="material-symbols-outlined text-[#f5cd00] text-sm">lock_open</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#bac9cc]">
              Stage Mystery Crate unlocked automatically
            </span>
          </div>
        </section>

        {/* Player Rank Progression */}
        <section className="w-full mt-2 bg-[#1b1f2c]/90 rounded-xl px-3 py-2 border border-[#3b494c]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#262a37] border-2 border-[#00e5ff] flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              <span className="material-symbols-outlined text-[#00e5ff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>
            <div>
              <div className="font-['Barlow_Condensed'] text-[10px] text-[#00e5ff] uppercase font-bold tracking-wider">
                RANK UP CONFIRMED
              </div>
              <div className="font-['Anybody'] text-[15px] italic font-black text-[#dfe2f3] uppercase leading-tight">
                PRO RACER TIER III
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end leading-tight">
            <span className="font-['Barlow_Condensed'] text-[18px] text-[#f5cd00] font-black">9,420 XP</span>
            <span className="font-['Barlow_Condensed'] text-[10px] text-[#849396] uppercase font-bold">+850 XP EARNED</span>
          </div>
        </section>
      </main>

      {/* Bottom Action Dock */}
      <footer className="relative z-20 w-full px-3 pb-6 pt-1 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/95 to-transparent flex flex-col gap-2">
        <button
          onClick={() => {
            audio.playNitro();
            onClaimAndContinue();
          }}
          className="group relative w-full h-14 bg-[#00e5ff] hover:bg-[#00daf3] text-[#0a0e1a] font-['Anybody'] text-[18px] italic uppercase tracking-wider rounded-xl transition-all duration-150 active:translate-y-1 active:border-b-0 border-b-4 border-[#009bb0] shadow-[0_4px_20px_rgba(0,229,255,0.45)] flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
          type="button"
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 pointer-events-none" />
          <span className="relative z-10 drop-shadow-sm font-black">CLAIM & CONTINUE</span>
          <span className="material-symbols-outlined relative z-10 text-2xl font-black transition-transform group-hover:translate-x-1" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
        </button>

        <button
          onClick={handleShare}
          className="w-full h-10 bg-[#171b28]/80 hover:bg-[#262a37]/90 text-[#c3f5ff] hover:text-white font-['Barlow_Condensed'] text-[12px] font-bold uppercase tracking-wider rounded-xl border border-[#00e5ff]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base">share</span>
          <span>SHARE RUN TO CREW</span>
        </button>
      </footer>
    </div>
  );
};
