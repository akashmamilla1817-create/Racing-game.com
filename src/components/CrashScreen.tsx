import React from 'react';
import { RaceResult, ScreenType } from '../types/game';
import { audio } from '../utils/audio';

interface CrashScreenProps {
  result: RaceResult;
  totalCoins: number;
  onRaceAgain: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CrashScreen: React.FC<CrashScreenProps> = ({
  result,
  totalCoins,
  onRaceAgain,
  onNavigate,
}) => {
  return (
    <main className="w-full max-w-[390px] h-screen max-h-[844px] relative flex flex-col justify-between overflow-hidden bg-[#0a0e1a] impact-vignette border border-[#3b494c]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] select-none">
      {/* Background Texture Layers */}
      <div className="absolute inset-0 bg-grid-cyber opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#c5020b]/20 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#00e5ff]/15 blur-[80px] pointer-events-none" />

      {/* Top Hazard Tape Graphic Strip */}
      <aside aria-label="Hazard Warnings" className="relative z-10 w-full pt-2 flex flex-col items-center">
        <div className="w-full h-4 hazard-stripe border-y border-[#c5020b] shadow-[0_0_15px_rgba(197,2,11,0.6)]" />

        {/* Top Bar Telemetry & Currency */}
        <div className="w-full px-3 pt-2 flex justify-between items-center text-[13px] font-['Barlow_Condensed'] font-bold text-[#849396]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c5020b] animate-ping" />
            <span className="text-[#ffb4aa] tracking-widest">TELEMETRY OFFLINE</span>
          </div>

          <div className="flex items-center gap-1 bg-[#171b28]/90 px-3 py-0.5 rounded-full border border-[#f5cd00]/40">
            <span className="material-symbols-outlined text-[#f5cd00] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              monetization_on
            </span>
            <span className="text-[#ffecac] font-['Barlow_Condensed'] text-[18px] font-black">
              {totalCoins.toLocaleString()}
            </span>
          </div>
        </div>
      </aside>

      {/* CRASH TITLE HEADER */}
      <header className="relative z-10 px-3 text-center pt-1">
        <div className="inline-flex items-center justify-center gap-1.5 mb-1 px-3 py-0.5 rounded bg-[#c5020b]/30 border border-[#c5020b]">
          <span className="material-symbols-outlined text-[#ffb4aa] animate-bounce text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <span className="font-['Barlow_Condensed'] text-[12px] font-extrabold text-[#ffb4aa] tracking-wider uppercase">
            COLLISION DETECTED
          </span>
          <span className="material-symbols-outlined text-[#ffb4aa] animate-bounce text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
        </div>

        <h1 className="font-['Anybody'] text-[42px] leading-none italic text-white uppercase tracking-tight relative inline-block drop-shadow-[0_0_25px_rgba(197,2,11,0.85)] font-black">
          <span className="text-[#ffdad5]">CRASH</span>
          <span className="text-[#c5020b]">ED!</span>
        </h1>
        <p className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#849396] tracking-widest mt-0.5 uppercase">
          CIRCUIT RUN TERMINATED
        </p>
      </header>

      {/* CENTER RESULTS BENTO CARD */}
      <section className="relative z-10 px-3 my-auto">
        <div className="relative bg-[#171b28]/85 backdrop-blur-xl rounded-xl p-3 border border-[#3b494c]/40 shadow-[0_8px_32px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Angular Corner Accent Lines */}
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute transform rotate-45 bg-[#c5020b]/70 text-[9px] font-['Barlow_Condensed'] font-black py-0.5 right-[-32px] top-[14px] w-[110px] text-center text-white tracking-widest">
              FATAL
            </div>
          </div>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00e5ff]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00e5ff]" />

          {/* New Personal Best Badge */}
          {result.isNewPersonalBest && (
            <div className="flex items-center justify-center gap-1.5 bg-[#f5cd00]/15 border border-[#f5cd00]/60 rounded-full py-1 px-3 mb-2 mx-auto shadow-[0_0_16px_rgba(245,205,0,0.25)]">
              <span className="material-symbols-outlined text-[#f5cd00] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="font-['Barlow_Condensed'] text-[13px] text-[#ffecac] tracking-wider font-black italic uppercase">
                NEW PERSONAL BEST!
              </span>
              <span className="material-symbols-outlined text-[#f5cd00] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
          )}

          {/* FINAL SCORE HERO DISPLAY */}
          <div className="text-center py-2 bg-[#0a0e1a]/60 rounded-lg border border-[#3b494c]/30 mb-2">
            <div className="font-['Barlow_Condensed'] text-[12px] font-bold text-[#849396] tracking-wider uppercase mb-0.5">
              FINAL SCORE
            </div>
            <div className="font-['Barlow_Condensed'] text-[46px] leading-none italic text-[#00e5ff] font-black tracking-wider drop-shadow-[0_0_16px_rgba(0,229,255,0.4)]">
              {result.finalScore.toLocaleString()} <span className="font-['Barlow_Condensed'] text-[20px] text-[#c3f5ff] font-extrabold">PTS</span>
            </div>
          </div>

          {/* TELEMETRY BREAKDOWN METRICS */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Distance */}
            <div className="bg-[#1b1f2c]/70 p-2.5 rounded-lg border border-[#3b494c]/30 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[#bac9cc]">
                <span className="material-symbols-outlined text-[#00e5ff] text-[16px]">edit_road</span>
                <span className="font-['Barlow_Condensed'] text-[12px] font-bold">DISTANCE</span>
              </div>
              <div className="font-['Barlow_Condensed'] text-[26px] italic text-[#dfe2f3] font-black tracking-wide mt-1 leading-none">
                {result.distance.toLocaleString()} <span className="text-[12px] font-['Barlow_Condensed'] text-[#849396] font-bold">M</span>
              </div>
            </div>

            {/* Near Misses */}
            <div className="bg-[#1b1f2c]/70 p-2.5 rounded-lg border border-[#3b494c]/30 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[#bac9cc]">
                <span className="material-symbols-outlined text-[#ffdad5] text-[16px]">bolt</span>
                <span className="font-['Barlow_Condensed'] text-[12px] font-bold">NEAR MISSES</span>
              </div>
              <div className="font-['Barlow_Condensed'] text-[26px] italic text-[#ffdad5] font-black tracking-wide mt-1 leading-none">
                {result.nearMisses} <span className="text-[12px] font-['Barlow_Condensed'] text-[#ffdad5]/80 font-bold">Combos</span>
              </div>
              <div className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#00e5ff] leading-none mt-0.5 font-bold">
                +{result.nearMisses * 50} PTS BONUS
              </div>
            </div>
          </div>

          {/* COINS LOOTED PILL */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1b1f2c] to-[#262a37] px-3 py-1.5 rounded-full border border-[#f5cd00]/50 shadow-[0_0_12px_rgba(245,205,0,0.18)]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#f5cd00]/20 flex items-center justify-center border border-[#f5cd00]">
                <span className="material-symbols-outlined text-[#f5cd00] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  paid
                </span>
              </div>
              <span className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#ffecac]">LOOT SECURED</span>
            </div>
            <div className="font-['Barlow_Condensed'] text-[24px] italic text-[#f5cd00] font-black tracking-wider leading-none">
              +{result.coinsLooted} <span className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#ffecac]">COINS</span>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION BUTTONS CLUSTER */}
      <footer className="relative z-10 px-3 pb-6 flex flex-col gap-2">
        {/* Primary CTA: RACE AGAIN */}
        <button
          onClick={() => {
            audio.playNitro();
            onRaceAgain();
          }}
          className="w-full min-h-[52px] bg-[#00e5ff] text-[#0a0e1a] font-['Anybody'] text-[18px] italic tracking-wide rounded-lg flex items-center justify-center gap-2 border-b-4 border-[#009bb0] shadow-[0_4px_20px_rgba(0,229,255,0.45)] hover:shadow-[0_0_24px_rgba(0,229,255,0.7)] active:translate-y-1 active:border-b-0 transition-all duration-75 cursor-pointer font-black"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            replay
          </span>
          <span>RACE AGAIN</span>
        </button>

        {/* Secondary CTA: GARAGE UPGRADE */}
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('garage');
          }}
          className="w-full min-h-[46px] bg-[#f5cd00] text-[#695700] font-['Anybody'] text-[16px] italic tracking-wide rounded-lg flex items-center justify-center gap-2 border-b-4 border-[#ab8e00] shadow-[0_3px_14px_rgba(245,205,0,0.35)] hover:brightness-105 active:translate-y-1 active:border-b-0 transition-all duration-75 cursor-pointer font-black"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            tune
          </span>
          <span>GARAGE UPGRADE</span>
          <span className="font-['Barlow_Condensed'] text-[11px] bg-[#695700] text-[#f5cd00] px-1.5 py-0.5 rounded-full ml-1 font-black">
            SPEND
          </span>
        </button>

        {/* Tertiary CTA: MAIN MENU */}
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('home');
          }}
          className="w-full h-10 bg-[#171b28]/80 backdrop-blur-md text-[#bac9cc] font-['Barlow_Condensed'] text-[13px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 border border-[#3b494c]/40 hover:text-white hover:border-[#00e5ff]/50 active:scale-95 transition-all duration-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>MAIN MENU</span>
        </button>

        <div className="w-full h-2 hazard-stripe opacity-70 mt-1 border-t border-[#c5020b]/40" />
      </footer>
    </main>
  );
};
