import React, { useState } from 'react';
import { audio } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [sfxOn, setSfxOn] = useState<boolean>(audio.sfxEnabled);
  const [musicOn, setMusicOn] = useState<boolean>(audio.musicEnabled);
  const [fps, setFps] = useState<'60' | '120' | '240'>('240');
  const [haptics, setHaptics] = useState<boolean>(true);

  const toggleSfx = () => {
    const next = audio.toggleSFX();
    setSfxOn(next);
  };

  const toggleMusic = () => {
    const next = audio.toggleMusic();
    setMusicOn(next);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0e1a]/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-[340px] bg-[#171b28] border border-[#00e5ff]/40 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#3b494c]/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00e5ff]">tune</span>
            <h2 className="font-['Anybody'] text-[18px] italic text-[#dfe2f3] font-black uppercase">
              SETTINGS & SYSTEM
            </h2>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#262a37] text-[#bac9cc] flex items-center justify-center hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="space-y-2">
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold tracking-wider">
            AUDIO CHANNELS
          </span>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b1f2c] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 text-[#dfe2f3]">
              <span className="material-symbols-outlined text-[20px] text-[#00e5ff]">volume_up</span>
              <span className="font-['Barlow_Condensed'] text-[14px] font-bold">SOUND EFFECTS (SFX)</span>
            </div>
            <button
              onClick={toggleSfx}
              className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                sfxOn ? 'bg-[#00e5ff]/30 border border-[#00e5ff] justify-end' : 'bg-[#313442] border border-[#849396] justify-start'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${sfxOn ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#849396]'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b1f2c] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 text-[#dfe2f3]">
              <span className="material-symbols-outlined text-[20px] text-[#f5cd00]">music_note</span>
              <span className="font-['Barlow_Condensed'] text-[14px] font-bold">SYNTHWAVE MUSIC</span>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                musicOn ? 'bg-[#00e5ff]/30 border border-[#00e5ff] justify-end' : 'bg-[#313442] border border-[#849396] justify-start'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${musicOn ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#849396]'}`} />
            </button>
          </div>
        </div>

        {/* Graphics Performance */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold tracking-wider">
            FRAME RATE TARGET
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0a0e1a] rounded-lg border border-[#3b494c]/40">
            {(['60', '120', '240'] as const).map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  audio.playClick();
                  setFps(rate);
                }}
                className={`py-1 rounded font-['Barlow_Condensed'] text-[12px] font-black uppercase transition-all cursor-pointer ${
                  fps === rate
                    ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                    : 'text-[#849396] hover:text-[#dfe2f3]'
                }`}
              >
                {rate} FPS
              </button>
            ))}
          </div>
        </div>

        {/* Haptics */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b1f2c] border border-[#3b494c]/30">
          <div className="flex items-center gap-2 text-[#dfe2f3]">
            <span className="material-symbols-outlined text-[20px] text-[#00e5ff]">vibration</span>
            <span className="font-['Barlow_Condensed'] text-[14px] font-bold">HAPTIC SHOCK FEEDBACK</span>
          </div>
          <button
            onClick={() => setHaptics(!haptics)}
            className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              haptics ? 'bg-[#00e5ff]/30 border border-[#00e5ff] justify-end' : 'bg-[#313442] border border-[#849396] justify-start'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full ${haptics ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#849396]'}`} />
          </button>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="w-full h-10 mt-1 bg-[#00e5ff] text-[#0a0e1a] font-['Barlow_Condensed'] font-black uppercase tracking-wider rounded-lg border-b-2 border-[#009bb0] cursor-pointer"
        >
          CONFIRM & SAVE
        </button>
      </div>
    </div>
  );
};
