import React from 'react';
import { ScreenType, PlayerStats } from '../types/game';
import { LEADERBOARD_ENTRIES } from '../data/mockData';
import { audio } from '../utils/audio';

interface RanksScreenProps {
  playerStats: PlayerStats;
  onNavigate: (screen: ScreenType) => void;
}

export const RanksScreen: React.FC<RanksScreenProps> = ({ playerStats, onNavigate }) => {
  return (
    <main className="w-full max-w-[390px] min-h-screen max-h-[844px] bg-[#0a0e1a] relative flex flex-col justify-between overflow-x-hidden border-x border-[#3b494c]/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] pb-20 select-none overflow-y-auto no-scrollbar">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0a0e1a]/85 px-3 py-2 flex items-center justify-between border-b border-[#3b494c]/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio.playClick();
              onNavigate('home');
            }}
            className="w-9 h-9 rounded-lg bg-[#262a37]/80 border border-[#3b494c]/50 flex items-center justify-center text-[#dfe2f3] active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-[#849396] text-[10px] tracking-widest font-bold">ARCADE CIRCUITS</span>
            <h1 className="text-[18px] font-['Anybody'] italic tracking-tight text-[#dfe2f3] font-extrabold uppercase">
              LEADERBOARDS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171b28] border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
          <span className="material-symbols-outlined text-[#00e5ff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emoji_events
          </span>
          <span className="font-['Barlow_Condensed'] text-[#c3f5ff] font-black text-[16px]">
            {playerStats.rating.toLocaleString()}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col px-3 pt-2 space-y-3 z-10">
        {/* Championship Division Podium Card */}
        <section className="p-3 rounded-xl bg-gradient-to-br from-[#171b28] via-[#1b1f2c] to-[#121829] border border-[#f5cd00]/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-[#262a37] border-2 border-[#f5cd00] flex items-center justify-center text-[#f5cd00] shadow-[0_0_16px_rgba(245,205,0,0.4)]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
              </div>
              <div>
                <span className="text-[10px] font-['Barlow_Condensed'] text-[#00e5ff] font-extrabold uppercase tracking-wider">
                  GLOBAL RANKING #2
                </span>
                <h2 className="font-['Anybody'] text-[18px] italic text-white font-black leading-tight">
                  PRO RACER TIER III
                </h2>
                <p className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#bac9cc]">
                  Season 4 ends in 2d 14h
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-['Barlow_Condensed'] text-[#f5cd00] font-black block">TOP 1%</span>
              <span className="text-[9px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold">+15,000c Season Reward</span>
            </div>
          </div>
        </section>

        {/* Global Standings Table */}
        <section className="space-y-1.5">
          <div className="flex justify-between items-center px-1 text-[11px] font-['Barlow_Condensed'] text-[#849396] font-bold uppercase">
            <span>PILOT & MACHINE</span>
            <span>BEST SCORE</span>
          </div>

          {LEADERBOARD_ENTRIES.map((entry) => (
            <div
              key={entry.rank}
              className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                entry.isUser
                  ? 'bg-[#1b1f2c] border-2 border-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.3)]'
                  : 'bg-[#171b28]/70 border-[#3b494c]/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-['Barlow_Condensed'] font-black text-[14px] ${
                    entry.rank === 1
                      ? 'bg-[#f5cd00] text-[#695700] shadow-[0_0_8px_#f5cd00]'
                      : entry.rank === 2
                      ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_8px_#00e5ff]'
                      : entry.rank === 3
                      ? 'bg-[#c5020b] text-white shadow-[0_0_8px_#c5020b]'
                      : 'bg-[#262a37] text-[#849396]'
                  }`}
                >
                  {entry.rank}
                </span>

                <div className="flex flex-col">
                  <span className="font-['Anybody'] text-[13px] italic font-bold text-[#dfe2f3] leading-tight">
                    {entry.name}
                  </span>
                  <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396] font-semibold">
                    {entry.car} • {entry.title}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-['Barlow_Condensed'] text-[16px] italic text-[#f5cd00] font-black leading-none block">
                  {entry.score}
                </span>
                <span className="text-[9px] font-['Barlow_Condensed'] text-[#00e5ff] uppercase font-bold">
                  {entry.badge}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Docked Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-1.5 pb-3 max-w-[390px] mx-auto bg-[#171b28]/95 border-t border-[#00e5ff]/30 shadow-[0_-8px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('home');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">sports_motorsports</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('garage');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">garage</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Garage</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('missions');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">military_tech</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Missions</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('ranks');
          }}
          className="flex flex-col items-center justify-center text-[#00e5ff] font-['Barlow_Condensed'] relative after:content-[''] after:absolute after:-top-1.5 after:w-8 after:h-[2px] after:bg-[#00e5ff] after:shadow-[0_0_8px_#00e5ff] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            leaderboard
          </span>
          <span className="text-[10px] tracking-wider uppercase font-bold mt-0.5">Ranks</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('settings');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Settings</span>
        </button>
      </nav>
    </main>
  );
};
