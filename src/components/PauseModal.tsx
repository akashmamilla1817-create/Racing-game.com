import React, { useState } from 'react';
import { audio } from '../utils/audio';

interface PauseModalProps {
  distance: number;
  coins: number;
  speedMph: number;
  onResume: () => void;
  onRestart: () => void;
  onQuitToHome: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  distance,
  coins,
  speedMph,
  onResume,
  onRestart,
  onQuitToHome,
  onOpenSettings,
}) => {
  const [sfxOn, setSfxOn] = useState<boolean>(audio.sfxEnabled);
  const [musicOn, setMusicOn] = useState<boolean>(audio.musicEnabled);
  const [steeringMode, setSteeringMode] = useState<'buttons' | 'swipe'>('buttons');

  const toggleSfx = () => {
    const next = audio.toggleSFX();
    setSfxOn(next);
  };

  const toggleMusic = () => {
    const next = audio.toggleMusic();
    setMusicOn(next);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#0a0e1a]/80 backdrop-blur-md select-none p-3">
      {/* Top telemetry peek */}
      <header className="pt-2 px-1 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-1.5 bg-[#0a0e1a]/90 border border-[#3b494c]/40 px-3 py-1 rounded-full">
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#bac9cc] italic font-bold">POS</span>
          <span className="text-[18px] font-['Barlow_Condensed'] text-[#c3f5ff] italic font-black">02/08</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0a0e1a]/90 border border-[#3b494c]/40 px-3 py-1 rounded-full">
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#bac9cc] italic font-bold">LAP</span>
          <span className="text-[18px] font-['Barlow_Condensed'] text-[#f5cd00] italic font-black">2/3</span>
        </div>
      </header>

      {/* Floating Glassmorphic Pause Modal */}
      <section className="relative my-auto backdrop-blur-xl bg-[#171b28]/95 rounded-xl border border-[#00e5ff]/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-4 flex flex-col gap-3">
        {/* Glow Flares */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#00e5ff]/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#00e5ff]/10 rounded-full blur-xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex flex-col items-center justify-center text-center pt-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#00e5ff] mb-1.5 shadow-[0_0_12px_rgba(0,229,255,0.35)]">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              pause
            </span>
          </div>
          <h1 className="text-[24px] font-['Anybody'] italic font-extrabold text-[#00e5ff] tracking-wider drop-shadow-[0_0_14px_rgba(0,229,255,0.45)] leading-tight">
            GAME PAUSED
          </h1>
          <p className="text-[11px] font-['Barlow_Condensed'] text-[#bac9cc] uppercase tracking-widest font-extrabold mt-0.5">
            SECTOR 04 // NEO COAST HIGHWAY
          </p>
        </div>

        {/* Quick Run Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#0a0e1a]/70 p-2 rounded-lg border border-[#3b494c]/30">
          <div className="flex flex-col items-center justify-center p-1.5 bg-[#1b1f2c]/60 rounded border border-[#3b494c]/20">
            <div className="flex items-center gap-1 text-[#bac9cc] mb-0.5">
              <span className="material-symbols-outlined text-[14px]">flag</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396] font-bold">DIST</span>
            </div>
            <span className="text-[18px] font-['Barlow_Condensed'] text-[#dfe2f3] italic font-black leading-none">
              {distance.toLocaleString()}<span className="text-[10px] font-normal text-[#849396] ml-0.5">M</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 bg-[#1b1f2c]/60 rounded border border-[#3b494c]/20">
            <div className="flex items-center gap-1 text-[#f5cd00] mb-0.5">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                monetization_on
              </span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#ffecac] font-bold">COINS</span>
            </div>
            <span className="text-[18px] font-['Barlow_Condensed'] text-[#f5cd00] italic font-black leading-none">
              +{coins}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 bg-[#1b1f2c]/60 rounded border border-[#3b494c]/20">
            <div className="flex items-center gap-1 text-[#00e5ff] mb-0.5">
              <span className="material-symbols-outlined text-[14px]">speed</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#9cf0ff] font-bold">SPEED</span>
            </div>
            <span className="text-[18px] font-['Barlow_Condensed'] text-[#00e5ff] italic font-black leading-none">
              {speedMph}<span className="text-[10px] font-normal text-[#bac9cc] ml-0.5">MPH</span>
            </span>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="bg-[#0a0e1a]/60 p-2.5 rounded-lg border border-[#3b494c]/30 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {/* SFX */}
            <div className="flex items-center justify-between bg-[#262a37]/40 px-2.5 py-1.5 rounded border border-[#3b494c]/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#bac9cc]">volume_up</span>
                <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">SFX</span>
              </div>
              <button
                onClick={toggleSfx}
                className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors duration-150 cursor-pointer ${
                  sfxOn ? 'bg-[#00e5ff]/30 border border-[#00e5ff] justify-end' : 'bg-[#313442] border border-[#849396] justify-start'
                }`}
                type="button"
              >
                <span className={`w-3.5 h-3.5 rounded-full ${sfxOn ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#849396]'}`} />
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between bg-[#262a37]/40 px-2.5 py-1.5 rounded border border-[#3b494c]/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#bac9cc]">music_note</span>
                <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">MUSIC</span>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors duration-150 cursor-pointer ${
                  musicOn ? 'bg-[#00e5ff]/30 border border-[#00e5ff] justify-end' : 'bg-[#313442] border border-[#849396] justify-start'
                }`}
                type="button"
              >
                <span className={`w-3.5 h-3.5 rounded-full ${musicOn ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#849396]'}`} />
              </button>
            </div>
          </div>

          {/* Steering mode */}
          <div className="flex items-center justify-between bg-[#262a37]/40 px-2.5 py-1.5 rounded border border-[#3b494c]/20">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#bac9cc]">sports_esports</span>
              <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">STEERING</span>
            </div>
            <div className="flex items-center bg-[#0a0e1a] p-0.5 rounded border border-[#3b494c]/40">
              <button
                onClick={() => setSteeringMode('buttons')}
                className={`px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  steeringMode === 'buttons'
                    ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_6px_rgba(0,229,255,0.4)]'
                    : 'text-[#849396] hover:text-[#dfe2f3]'
                }`}
                type="button"
              >
                BUTTONS
              </button>
              <button
                onClick={() => setSteeringMode('swipe')}
                className={`px-2 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  steeringMode === 'swipe'
                    ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_6px_rgba(0,229,255,0.4)]'
                    : 'text-[#849396] hover:text-[#dfe2f3]'
                }`}
                type="button"
              >
                SWIPE
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {/* 1. Resume Race */}
          <button
            onClick={() => {
              audio.playNitro();
              onResume();
            }}
            className="w-full py-3 px-4 rounded bg-[#00e5ff] text-[#0a0e1a] flex items-center justify-center gap-2 border-b-4 border-[#009bb0] shadow-[0_4px_20px_rgba(0,229,255,0.45)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            <span className="text-[18px] font-['Anybody'] italic font-black tracking-wider">RESUME RACE</span>
          </button>

          {/* 2. Restart Run */}
          <button
            onClick={() => {
              audio.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded bg-[#262a37] text-[#dfe2f3] flex items-center justify-center gap-2 border-b-2 border-[#313442] hover:bg-[#353946] active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#849396]">restart_alt</span>
            <span className="text-[13px] font-['Barlow_Condensed'] font-bold tracking-wider uppercase">
              RESTART RUN
            </span>
          </button>

          {/* 3. Settings */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenSettings();
            }}
            className="w-full py-2 px-4 rounded bg-[#1b1f2c]/40 text-[#bac9cc] flex items-center justify-center gap-2 border border-[#3b494c]/50 hover:border-[#00e5ff]/60 hover:text-[#00e5ff] active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">settings</span>
            <span className="text-[13px] font-['Barlow_Condensed'] font-bold tracking-wider uppercase">
              SETTINGS
            </span>
          </button>

          {/* 4. Quit to Home */}
          <button
            onClick={() => {
              audio.playClick();
              onQuitToHome();
            }}
            className="w-full py-1.5 px-4 flex items-center justify-center gap-1.5 text-[#ffb4ab]/85 hover:text-[#ffb4ab] active:scale-95 transition-all mt-0.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="text-[12px] font-['Barlow_Condensed'] font-black tracking-widest uppercase">
              QUIT TO HOME
            </span>
          </button>
        </div>
      </section>

      {/* Bottom Telemetry Peek */}
      <footer className="pb-4 px-2 flex items-end justify-between opacity-40 pointer-events-none">
        <div className="flex flex-col gap-1 w-24">
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#00e5ff] italic font-bold">NITRO BOOST</span>
          <div className="h-1.5 w-full bg-[#1b1f2c] rounded-full overflow-hidden border border-[#3b494c]/30">
            <div className="h-full w-3/4 bg-[#00e5ff]" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-[32px] font-['Barlow_Condensed'] italic text-[#dfe2f3] font-black leading-none">{speedMph}</div>
          <div className="text-[10px] font-['Barlow_Condensed'] text-[#849396] font-bold">MPH // GEAR 5</div>
        </div>
      </footer>
    </div>
  );
};
