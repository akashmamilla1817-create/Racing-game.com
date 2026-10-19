import React from 'react';
import { Mission, ScreenType } from '../types/game';
import { audio } from '../utils/audio';

interface MissionsScreenProps {
  missions: Mission[];
  coins: number;
  onClaimReward: (missionId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({
  missions,
  coins,
  onClaimReward,
  onNavigate,
}) => {
  const completedCount = missions.filter((m) => m.completed).length;

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
            <span className="font-['Barlow_Condensed'] text-[#849396] text-[10px] tracking-widest font-bold">DAILY OPERATIONS</span>
            <h1 className="text-[18px] font-['Anybody'] italic tracking-tight text-[#dfe2f3] font-extrabold uppercase">
              RACE MISSIONS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171b28] border border-[#f5cd00]/40 shadow-[0_0_12px_rgba(245,205,0,0.15)]">
          <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            monetization_on
          </span>
          <span className="font-['Barlow_Condensed'] text-[#ffecac] font-black text-[16px]">
            {coins.toLocaleString()}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col px-3 pt-2 space-y-3 z-10">
        {/* Progress summary banner */}
        <section className="p-3 rounded-xl bg-gradient-to-r from-[#171b28] via-[#1b1f2c] to-[#171b28] border border-[#00e5ff]/40 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#262a37] border border-[#00e5ff] flex items-center justify-center text-[#00e5ff]">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
            </div>
            <div>
              <span className="text-[11px] font-['Barlow_Condensed'] text-[#00e5ff] uppercase font-bold tracking-wider">
                DAILY PROGRESS
              </span>
              <h2 className="font-['Anybody'] text-[17px] italic text-[#dfe2f3] font-black leading-tight">
                {completedCount} OF {missions.length} COMPLETED
              </h2>
            </div>
          </div>
          <span className="font-['Barlow_Condensed'] text-[24px] text-[#f5cd00] font-black italic">
            +{missions.reduce((acc, m) => acc + (m.claimed ? 0 : m.rewardCoins), 0)} C
          </span>
        </section>

        {/* Missions List */}
        <section className="space-y-2">
          {missions.map((mission) => {
            const isFinished = mission.progress >= mission.total;
            const progressPercent = Math.min(100, Math.floor((mission.progress / mission.total) * 100));

            return (
              <div
                key={mission.id}
                className="p-3 rounded-xl bg-[#171b28]/85 border border-[#3b494c]/40 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-['Barlow_Condensed'] text-[#00e5ff] font-extrabold uppercase px-1.5 py-0.2 bg-[#00e5ff]/10 rounded border border-[#00e5ff]/30">
                      {mission.category}
                    </span>
                    <h3 className="font-['Anybody'] text-[14px] italic text-[#dfe2f3] font-bold mt-1">
                      {mission.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[#f5cd00] font-['Barlow_Condensed'] font-black text-[15px]">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      monetization_on
                    </span>
                    +{mission.rewardCoins}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0a0e1a] h-2 rounded-full overflow-hidden border border-[#3b494c]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#00e5ff] to-[#f5cd00] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-['Barlow_Condensed'] text-[12px] text-[#849396] font-bold">
                    {mission.progress} / {mission.total}
                  </span>

                  {mission.claimed ? (
                    <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] font-black uppercase">
                      CLAIMED
                    </span>
                  ) : isFinished ? (
                    <button
                      onClick={() => {
                        audio.playCoin();
                        onClaimReward(mission.id);
                      }}
                      className="px-3 py-1 bg-[#f5cd00] text-[#695700] rounded font-['Barlow_Condensed'] text-[12px] font-black uppercase shadow-[0_0_10px_rgba(245,205,0,0.5)] active:scale-95 cursor-pointer"
                    >
                      CLAIM REWARD
                    </button>
                  ) : (
                    <span className="text-[11px] font-['Barlow_Condensed'] text-[#00e5ff] font-bold uppercase">
                      IN PROGRESS
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
          className="flex flex-col items-center justify-center text-[#00e5ff] font-['Barlow_Condensed'] relative after:content-[''] after:absolute after:-top-1.5 after:w-8 after:h-[2px] after:bg-[#00e5ff] after:shadow-[0_0_8px_#00e5ff] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            military_tech
          </span>
          <span className="text-[10px] tracking-wider uppercase font-bold mt-0.5">Missions</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('ranks');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">leaderboard</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Ranks</span>
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
