import React, { useState, useEffect } from 'react';
import { GlobalScoreEntry, leaderboardService } from '../services/leaderboardService';
import { PlayerStats } from '../types/game';

interface GlobalLeaderboardProps {
  playerStats: PlayerStats;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({ playerStats }) => {
  const [scores, setScores] = useState<GlobalScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    leaderboardService.getTopGlobalScores().then((data) => {
      if (mounted) {
        setScores(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-[#171b28]/85 border border-[#00e5ff]/40 rounded-xl p-3 shadow-lg backdrop-blur-md flex flex-col gap-2">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emoji_events
          </span>
          <span className="font-['Barlow_Condensed'] text-[13px] font-extrabold text-[#dfe2f3] uppercase tracking-wider">
            WORLD TOP 5 HIGH SCORES
          </span>
        </div>
        <span className="text-[10px] font-['Barlow_Condensed'] font-black text-[#00e5ff] px-1.5 py-0.2 bg-[#00e5ff]/10 rounded border border-[#00e5ff]/30 uppercase">
          LIVE SERVERS
        </span>
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-[#849396] font-['Barlow_Condensed'] text-sm">
          <span className="material-symbols-outlined text-[#00e5ff] text-[18px] animate-spin">sync</span>
          SYNCING GLOBAL SCORES...
        </div>
      ) : (
        <div className="space-y-1.5">
          {scores.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg border transition-all ${
                entry.rank === 1
                  ? 'bg-[#1b1f2c] border-[#f5cd00]/50 shadow-[0_0_12px_rgba(245,205,0,0.15)]'
                  : 'bg-[#121829]/70 border-[#3b494c]/30'
              }`}
            >
              {/* Left: Rank & Player info */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-['Barlow_Condensed'] font-black text-[13px] leading-none ${
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

                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-['Anybody'] text-[12px] italic font-black text-[#dfe2f3] truncate max-w-[110px]">
                      {entry.playerName}
                    </span>
                    <span className="text-[9px] font-['Barlow_Condensed'] text-[#849396] font-bold">
                      [{entry.countryCode}]
                    </span>
                  </div>
                  <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396]">
                    {entry.carName} • {entry.distanceMeters.toLocaleString()}M
                  </span>
                </div>
              </div>

              {/* Right: Score */}
              <div className="text-right leading-tight">
                <span className="font-['Barlow_Condensed'] text-[16px] italic font-black text-[#f5cd00] leading-none block">
                  {entry.scorePts.toLocaleString()}{' '}
                  <span className="text-[10px] text-[#ffecac] font-bold">PTS</span>
                </span>
                <span className="text-[9px] font-['Barlow_Condensed'] text-[#00e5ff] uppercase font-extrabold">
                  {entry.badge}
                </span>
              </div>
            </div>
          ))}

          {/* User's Current Standings Preview */}
          <div className="mt-1 pt-1.5 border-t border-[#3b494c]/30 flex items-center justify-between px-2 py-1 rounded bg-[#0a0e1a]/80 border border-[#00e5ff]/40 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#00e5ff]/20 text-[#00e5ff] font-['Barlow_Condensed'] font-black text-[11px] flex items-center justify-center border border-[#00e5ff]/40">
                #6
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-['Anybody'] text-[11px] italic font-black text-[#00e5ff]">
                  YOU ({playerStats.title})
                </span>
                <span className="text-[9px] font-['Barlow_Condensed'] text-[#849396]">
                  {playerStats.bestDistance.toLocaleString()}M BEST RUN
                </span>
              </div>
            </div>

            <div className="text-right leading-tight">
              <span className="font-['Barlow_Condensed'] text-[15px] italic font-black text-[#c3f5ff] leading-none">
                {(playerStats.endlessHighScore || 28450).toLocaleString()} PTS
              </span>
              <span className="text-[9px] font-['Barlow_Condensed'] text-[#f5cd00] font-bold block">
                GLOBAL CONTENDER
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
