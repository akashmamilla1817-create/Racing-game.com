import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

interface DailyCrateModalProps {
  onClose: () => void;
  onClaimReward: (coins: number, partName: string) => void;
}

export const DailyCrateModal: React.FC<DailyCrateModalProps> = ({ onClose, onClaimReward }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const rewardCoins = 1500;
  const rewardPart = 'Aero Titanium Wing V2';

  const handleOpenCrate = () => {
    if (opened) return;
    audio.playVictory();
    setOpened(true);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#f5cd00', '#00e5ff', '#ffffff'],
      });
    } catch {}
  };

  const handleClaim = () => {
    audio.playCoin();
    onClaimReward(rewardCoins, rewardPart);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0e1a]/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-[340px] bg-[#171b28] border-2 border-[#f5cd00]/60 rounded-2xl p-4 shadow-[0_12px_40px_rgba(245,205,0,0.3)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#f5cd00]/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#262a37] text-[#bac9cc] flex items-center justify-center hover:text-white cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {!opened ? (
          <>
            <span className="text-[11px] font-['Barlow_Condensed'] text-[#f5cd00] font-black uppercase tracking-widest mt-1">
              FREE DAILY DROP
            </span>
            <h2 className="font-['Anybody'] text-[20px] italic text-[#dfe2f3] font-black uppercase mt-0.5">
              MYSTERY CRATE
            </h2>

            {/* Pulsing Crate Box */}
            <div
              onClick={handleOpenCrate}
              className="my-5 relative w-32 h-32 rounded-2xl bg-gradient-to-tr from-[#262a37] to-[#313442] border-2 border-[#f5cd00] shadow-[0_0_24px_rgba(245,205,0,0.4)] flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform group"
            >
              <span className="material-symbols-outlined text-6xl text-[#f5cd00] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                featured_seasonal_and_gifts
              </span>
              <span className="absolute -bottom-2.5 px-2.5 py-0.5 bg-[#f5cd00] text-[#695700] text-[10px] font-['Barlow_Condensed'] font-black rounded-full uppercase shadow">
                TAP TO OPEN
              </span>
            </div>

            <p className="text-[12px] font-['Plus_Jakarta_Sans'] text-[#bac9cc]">
              Guaranteed rare chassis tuning parts and bonus coin packs!
            </p>
          </>
        ) : (
          <>
            <span className="text-[11px] font-['Barlow_Condensed'] text-[#00e5ff] font-black uppercase tracking-widest mt-1">
              LOOT REVEALED
            </span>
            <h2 className="font-['Anybody'] text-[22px] italic text-[#f5cd00] font-black uppercase mt-0.5">
              EPIC REWARDS!
            </h2>

            <div className="my-4 w-full grid grid-cols-2 gap-2">
              <div className="bg-[#1b1f2c] p-3 rounded-xl border border-[#f5cd00]/50 flex flex-col items-center">
                <span className="material-symbols-outlined text-3xl text-[#f5cd00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monetization_on
                </span>
                <span className="font-['Barlow_Condensed'] text-[22px] font-black text-[#f5cd00] italic leading-tight mt-1">
                  +{rewardCoins}
                </span>
                <span className="text-[10px] font-['Barlow_Condensed'] text-[#bac9cc] uppercase font-bold">
                  Gold Coins
                </span>
              </div>

              <div className="bg-[#1b1f2c] p-3 rounded-xl border border-[#00e5ff]/50 flex flex-col items-center">
                <span className="material-symbols-outlined text-3xl text-[#00e5ff]">
                  hardware
                </span>
                <span className="font-['Barlow_Condensed'] text-[13px] font-black text-[#00e5ff] leading-tight mt-1 truncate max-w-[110px]">
                  {rewardPart}
                </span>
                <span className="text-[10px] font-['Barlow_Condensed'] text-[#bac9cc] uppercase font-bold">
                  Epic Tuning Part
                </span>
              </div>
            </div>

            <button
              onClick={handleClaim}
              className="w-full h-12 rounded-xl bg-[#00e5ff] text-[#0a0e1a] font-['Anybody'] italic font-black uppercase tracking-wider border-b-4 border-[#009bb0] shadow-[0_4px_16px_rgba(0,229,255,0.4)] active:translate-y-1 active:border-b-0 transition-all cursor-pointer text-[16px]"
            >
              COLLECT ALL
            </button>
          </>
        )}
      </div>
    </div>
  );
};
