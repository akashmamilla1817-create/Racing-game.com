import React, { useState } from 'react';
import { Vehicle, PlayerStats, ScreenType } from '../types/game';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { audio } from '../utils/audio';

interface HomeScreenProps {
  playerStats: PlayerStats;
  equippedVehicle: Vehicle;
  onNavigate: (screen: ScreenType) => void;
  onOpenDailyCrate: () => void;
  onUpdateLiveryColor: (color: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerStats,
  equippedVehicle,
  onNavigate,
  onOpenDailyCrate,
  onUpdateLiveryColor,
}) => {
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [statsView, setStatsView] = useState<'telemetry' | 'leaderboard'>('telemetry');

  const colors = [
    { label: 'Cyan', color: '#00e5ff', bg: 'bg-[#00e5ff]', glow: 'shadow-[0_0_10px_#00e5ff]' },
    { label: 'Crimson', color: '#c5020b', bg: 'bg-[#c5020b]', glow: 'shadow-[0_0_10px_#c5020b]' },
    { label: 'Acid Green', color: '#39ff14', bg: 'bg-[#39ff14]', glow: 'shadow-[0_0_10px_#39ff14]' },
    { label: 'Sunset Gold', color: '#f5cd00', bg: 'bg-[#f5cd00]', glow: 'shadow-[0_0_10px_#f5cd00]' },
  ];

  const handleRotate = () => {
    audio.playClick();
    setTurntableRotation((prev) => (prev + 90) % 360);
  };

  const handleColorChange = (hex: string) => {
    audio.playClick();
    onUpdateLiveryColor(hex);
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen max-h-[844px] bg-[#0a0e1a] flex flex-col relative pb-20 arcade-grid-bg border-x border-[#3b494c]/20 shadow-2xl select-none overflow-y-auto no-scrollbar">
      {/* Top Navigation Anchor */}
      <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-3 py-2 backdrop-blur-md bg-[#0a0e1a]/90 border-b border-[#3b494c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
        {/* Player Profile / Level Pill */}
        <div 
          onClick={() => {
            audio.playClick();
            onNavigate('ranks');
          }}
          className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#262a37] border border-[#00e5ff]/40 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
            <span className="material-symbols-outlined text-[#00e5ff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_motorsports
            </span>
            <span className="absolute -bottom-1 -right-1 bg-[#c5020b] text-[#dfe2f3] text-[9px] font-['Barlow_Condensed'] px-1 rounded-full font-bold">
              {playerStats.level}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-[#bac9cc] text-[10px] leading-tight font-bold">
              LVL {playerStats.level}
            </span>
            <span className="font-['Barlow_Condensed'] text-[11px] text-[#00e5ff] uppercase tracking-wider leading-none font-extrabold">
              {playerStats.title}
            </span>
          </div>
        </div>

        {/* Brand Logo Header */}
        <span className="font-['Anybody'] text-[18px] italic font-black text-[#00e5ff] tracking-wider drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
          POCKET RACER
        </span>

        {/* Settings Icon */}
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('settings');
          }}
          aria-label="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#171b28] text-[#bac9cc] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-all duration-150 active:scale-95 border border-[#3b494c]/30 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>
      </header>

      {/* Top HUD Cluster (Player Currencies & Stats) */}
      <div className="pt-2 px-3 grid grid-cols-2 gap-2 z-10">
        {/* Gold Coin Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#171b28]/80 backdrop-blur-md border border-[#f5cd00]/30 rounded-full shadow-[0_2px_10px_rgba(245,205,0,0.15)]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#f5cd00] flex items-center justify-center text-[#695700] shadow-[0_0_8px_rgba(245,205,0,0.5)]">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                monetization_on
              </span>
            </div>
            <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#ffecac] tracking-wide">
              COINS
            </span>
          </div>
          <span className="font-['Barlow_Condensed'] text-[18px] font-black text-[#f5cd00] italic pr-1">
            {playerStats.coins.toLocaleString()}
          </span>
        </div>

        {/* Trophy Rating Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#171b28]/80 backdrop-blur-md border border-[#00e5ff]/30 rounded-full shadow-[0_2px_10px_rgba(0,229,255,0.15)]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#00e5ff] flex items-center justify-center text-[#00626e] shadow-[0_0_8px_rgba(0,229,255,0.5)]">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#c3f5ff] tracking-wide">
              RATING
            </span>
          </div>
          <span className="font-['Barlow_Condensed'] text-[18px] font-black text-[#00e5ff] italic pr-1">
            {playerStats.rating.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Content Flow */}
      <main className="flex-1 flex flex-col px-3 pt-2 space-y-2.5 z-10">
        {/* HERO SHOWCASE: Interactive Turntable & Apex Coupe */}
        <section className="relative bg-[#171b28]/85 backdrop-blur-xl border border-[#3b494c]/40 rounded-xl p-3 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.65)] flex flex-col items-center">
          {/* Turntable Header */}
          <div className="w-full flex justify-between items-center mb-1 z-10">
            <div className="flex items-center gap-1.5">
              <span className="bg-[#00e5ff] text-[#00626e] font-['Barlow_Condensed'] text-[13px] px-2 py-0.5 rounded font-black italic">
                {equippedVehicle.tier}
              </span>
              <h2 className="font-['Anybody'] text-[20px] italic font-black text-[#dfe2f3] tracking-tight uppercase">
                {equippedVehicle.name}
              </h2>
            </div>

            <button
              onClick={handleRotate}
              className="flex items-center gap-1 text-[#00e5ff] bg-[#0a0e1a]/60 px-2 py-0.5 rounded border border-[#00e5ff]/30 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">3d_rotation</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold tracking-wider">
                360° VIEW
              </span>
            </button>
          </div>

          {/* Car Turntable Display Area */}
          <div className="relative w-full h-44 flex items-center justify-center my-1 float-turntable">
            {/* Turntable Radial Floor Grid */}
            <div className="absolute bottom-2 w-64 h-20 rounded-full border border-[#00e5ff]/40 bg-gradient-to-t from-[#00e5ff]/20 to-transparent blur-[1px] shadow-[0_0_24px_rgba(0,229,255,0.35)] transform -rotate-1" />
            <div className="absolute bottom-4 w-52 h-14 rounded-full border-t border-[#00daf3]/60 opacity-60" />

            {/* Car Image with dynamic rotation */}
            <div 
              className="relative z-10 w-full flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotateY(${turntableRotation}deg)` }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZI0P-asBfqUZDrIvLsqopNCiYdU2thheNNgDC1mtB9d-Je6XaX-ftExBn56sz9-Irqb23Qbd2qiBESYqgDTnF6E2gUY5KUzUWTUpKzrftM3jZMx7vYh1nb4UsUpCsU-ryctkw4zkPqLJ28Y5uR3eDacEpsf5inT8pqQqbwh4k4lBay998hJkhet-yYbX4jTsIU72AS5VqJbsnt7V9v1Hg90d4nMPfCzb-3L1YbA0smm49oDxn9BFn"
                alt={equippedVehicle.imageAlt}
                className="w-full max-h-36 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.9)]"
                style={{
                  filter: equippedVehicle.liveryColor === '#c5020b' 
                    ? 'hue-rotate(140deg) saturate(1.4)' 
                    : equippedVehicle.liveryColor === '#39ff14'
                    ? 'hue-rotate(270deg) saturate(1.8)'
                    : equippedVehicle.liveryColor === '#f5cd00'
                    ? 'hue-rotate(45deg) saturate(1.5)'
                    : 'none',
                }}
              />
            </div>

            {/* Floating Spec Badges */}
            <div className="absolute top-2 left-1 bg-[#0a0e1a]/90 border border-[#3b494c]/50 px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-bold text-[#bac9cc] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
              {equippedVehicle.tierLabel}
            </div>

            <div className="absolute top-2 right-1 bg-[#0a0e1a]/90 border border-[#3b494c]/50 px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-bold text-[#f5cd00] flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">bolt</span>
              NITRO BOOST
            </div>
          </div>

          {/* Quick Paint Swatch Selector */}
          <div className="w-full flex items-center justify-between pt-1 border-t border-[#3b494c]/30 mt-1 z-10">
            <span className="font-['Barlow_Condensed'] text-[#bac9cc] text-[11px] uppercase tracking-wider font-extrabold">
              LIVERY COLOR
            </span>
            <div className="flex items-center gap-2">
              {colors.map((c) => {
                const isActive = equippedVehicle.liveryColor.toLowerCase() === c.color.toLowerCase();
                return (
                  <button
                    key={c.color}
                    onClick={() => handleColorChange(c.color)}
                    aria-label={`${c.label} Paint`}
                    className={`w-6 h-6 rounded-full ${c.bg} transition-all duration-150 cursor-pointer ${
                      isActive ? `border-2 border-white scale-110 ${c.glow}` : 'border border-[#849396] hover:scale-105 opacity-80'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION TOGGLE: LOCAL STATS VS GLOBAL RANKS */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#00e5ff] rounded-xs" />
            <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#bac9cc] uppercase tracking-wider">
              {statsView === 'telemetry' ? 'CHASSIS SPECIFICATIONS' : 'WORLD CHAMPIONSHIP'}
            </span>
          </div>

          {/* Small Global Ranks Toggle */}
          <div className="flex items-center bg-[#171b28] p-0.5 rounded-lg border border-[#3b494c]/40 shadow-inner">
            <button
              onClick={() => {
                audio.playClick();
                setStatsView('telemetry');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                statsView === 'telemetry'
                  ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]">speed</span>
              LOCAL STATS
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setStatsView('leaderboard');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                statsView === 'leaderboard'
                  ? 'bg-[#f5cd00] text-[#695700] shadow-[0_0_8px_rgba(245,205,0,0.4)]'
                  : 'text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
              GLOBAL RANKS
            </button>
          </div>
        </div>

        {/* CAR PERFORMANCE STATS OR GLOBAL LEADERBOARD */}
        {statsView === 'telemetry' ? (
          <section className="bg-[#171b28]/70 border border-[#3b494c]/30 rounded-xl p-3 shadow-md backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-['Barlow_Condensed'] text-[#849396] uppercase tracking-wider text-[12px] font-bold">
                VEHICLE TELEMETRY
              </span>
              <span className="font-['Barlow_Condensed'] text-[#00e5ff] italic text-[14px] font-black">
                PWR {equippedVehicle.pwrBhp} HP
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Speed */}
              <div className="flex items-center justify-between gap-2">
                <div className="w-16 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#00e5ff] text-xs">speed</span>
                  <span className="font-['Barlow_Condensed'] text-[#bac9cc] text-[11px] font-bold">SPEED</span>
                </div>
                <div className="flex-1 flex gap-1 h-2 bg-[#0a0e1a] rounded-sm p-0.5 border border-[#3b494c]/30">
                  <div
                    className="h-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] rounded-xs transition-all duration-300"
                    style={{ width: `${equippedVehicle.topSpeedPercent}%` }}
                  />
                </div>
                <span className="font-['Barlow_Condensed'] font-extrabold text-[#dfe2f3] w-9 text-right text-xs">
                  {equippedVehicle.topSpeedPercent}%
                </span>
              </div>

              {/* Drift */}
              <div className="flex items-center justify-between gap-2">
                <div className="w-16 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#f5cd00] text-xs">alt_route</span>
                  <span className="font-['Barlow_Condensed'] text-[#bac9cc] text-[11px] font-bold">DRIFT</span>
                </div>
                <div className="flex-1 flex gap-1 h-2 bg-[#0a0e1a] rounded-sm p-0.5 border border-[#3b494c]/30">
                  <div
                    className="h-full bg-[#f5cd00] shadow-[0_0_6px_#f5cd00] rounded-xs transition-all duration-300"
                    style={{ width: `${equippedVehicle.driftStabilityPercent}%` }}
                  />
                </div>
                <span className="font-['Barlow_Condensed'] font-extrabold text-[#dfe2f3] w-9 text-right text-xs">
                  {equippedVehicle.driftStabilityPercent}%
                </span>
              </div>

              {/* Nitro */}
              <div className="flex items-center justify-between gap-2">
                <div className="w-16 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffb4aa] text-xs">local_fire_department</span>
                  <span className="font-['Barlow_Condensed'] text-[#bac9cc] text-[11px] font-bold">NITRO</span>
                </div>
                <div className="flex-1 flex gap-1 h-2 bg-[#0a0e1a] rounded-sm p-0.5 border border-[#3b494c]/30">
                  <div
                    className="h-full bg-[#ffb4aa] shadow-[0_0_6px_#ffb4aa] rounded-xs transition-all duration-300"
                    style={{ width: `${equippedVehicle.nitroPercent}%` }}
                  />
                </div>
                <span className="font-['Barlow_Condensed'] font-extrabold text-[#dfe2f3] w-9 text-right text-xs">
                  {equippedVehicle.nitroPercent}%
                </span>
              </div>
            </div>
          </section>
        ) : (
          <GlobalLeaderboard playerStats={playerStats} />
        )}

        {/* SECONDARY QUICK-ACTION CARDS */}
        <section className="grid grid-cols-2 gap-2">
          {/* Daily Crate */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenDailyCrate();
            }}
            className="relative bg-[#171b28]/85 border border-[#3b494c]/40 rounded-xl p-2.5 text-left hover:border-[#f5cd00]/60 transition-all duration-150 active:scale-95 group overflow-hidden shadow-lg cursor-pointer"
          >
            <div className="absolute -top-6 -right-6 w-14 h-14 bg-[#f5cd00]/10 rounded-full blur-md" />
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#262a37] border border-[#f5cd00]/40 flex items-center justify-center text-[#f5cd00] shadow-[0_0_10px_rgba(245,205,0,0.3)]">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  featured_seasonal_and_gifts
                </span>
              </div>
              <span className="bg-[#f5cd00] text-[#695700] text-[9px] font-['Barlow_Condensed'] px-1.5 py-0.5 rounded font-black animate-pulse">
                READY!
              </span>
            </div>
            <h3 className="font-['Anybody'] italic text-[#dfe2f3] leading-tight text-sm font-bold">
              DAILY CRATE
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-[#bac9cc] text-[11px] mt-0.5">Claim Free Parts</p>
          </button>

          {/* Missions */}
          <button
            onClick={() => {
              audio.playClick();
              onNavigate('missions');
            }}
            className="relative bg-[#171b28]/85 border border-[#3b494c]/40 rounded-xl p-2.5 text-left hover:border-[#00e5ff]/60 transition-all duration-150 active:scale-95 group overflow-hidden shadow-lg cursor-pointer"
          >
            <div className="absolute -top-6 -right-6 w-14 h-14 bg-[#00e5ff]/10 rounded-full blur-md" />
            <div className="flex items-center justify-between mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#262a37] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  assignment
                </span>
              </div>
              <span className="text-[#00e5ff] font-['Barlow_Condensed'] font-black text-xs">
                2/3 DONE
              </span>
            </div>
            <h3 className="font-['Anybody'] italic text-[#dfe2f3] leading-tight text-sm font-bold">
              MISSIONS
            </h3>
            <div className="w-full bg-[#0a0e1a] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#3b494c]/20">
              <div className="bg-[#00e5ff] h-full rounded-full" style={{ width: '66%' }} />
            </div>
          </button>
        </section>

        {/* PRIMARY ACTION CTA: TACTILE ARCADE "START RACE" */}
        <section className="pt-1">
          <button
            onClick={() => {
              audio.playNitro();
              onNavigate('stage_select');
            }}
            className="w-full h-14 relative bg-[#00e5ff] hover:bg-[#00daf3] rounded-xl flex items-center justify-center gap-2 text-[#00363d] font-['Anybody'] italic font-black tracking-wider uppercase border-b-4 border-[#008A99] active:border-b-0 active:translate-y-1 transition-all duration-75 cta-glow-pulse cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_score
            </span>
            <span className="text-[22px] font-['Anybody']">START RACE</span>
            <span className="material-symbols-outlined text-[28px] leading-none rotate-45">
              double_arrow
            </span>
          </button>
        </section>
      </main>

      {/* Docked Shared Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-1.5 pb-3 max-w-[390px] mx-auto bg-[#171b28]/95 border-t border-[#00e5ff]/30 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.7)]">
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('home');
          }}
          className="flex flex-col items-center justify-center text-[#00e5ff] font-['Barlow_Condensed'] relative after:content-[''] after:absolute after:-top-1.5 after:w-8 after:h-[2px] after:bg-[#00e5ff] after:shadow-[0_0_8px_#00e5ff] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            sports_motorsports
          </span>
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('garage');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] hover:text-[#00e5ff] transition-colors active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">garage</span>
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Garage</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('missions');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] hover:text-[#00e5ff] transition-colors active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">military_tech</span>
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Missions</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('ranks');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] hover:text-[#00e5ff] transition-colors active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">leaderboard</span>
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Ranks</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('settings');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] hover:text-[#00e5ff] transition-colors active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};
