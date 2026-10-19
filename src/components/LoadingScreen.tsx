import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(84);
  const [engineReady, setEngineReady] = useState(true);
  const [tracksReady, setTracksReady] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    audio.playClick();
    onComplete();
  };

  return (
    <main 
      onClick={handleSkip}
      className="relative w-full max-w-[390px] h-screen max-h-[844px] bg-[#0a0e1a] overflow-hidden flex flex-col justify-between shadow-2xl border-x border-[#3b494c]/30 select-none cursor-pointer"
    >
      {/* SPEEDLINE & MOTION STREAK CANVAS LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-1/4 left-8 w-[2px] h-[340px] bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent line-anim-1 opacity-70 rotate-[22deg]" />
        <div className="absolute -top-1/3 left-24 w-[1.5px] h-[480px] bg-gradient-to-b from-transparent via-[#f5cd00] to-transparent line-anim-2 opacity-50 rotate-[22deg]" />
        <div className="absolute -top-1/4 right-14 w-[2.5px] h-[380px] bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent line-anim-3 opacity-60 rotate-[22deg]" />
        <div className="absolute -top-1/2 right-28 w-[1.5px] h-[520px] bg-gradient-to-b from-transparent via-[#9cf0ff] to-transparent line-anim-4 opacity-40 rotate-[22deg]" />
        <div className="absolute top-1/3 left-4 w-[1px] h-[260px] bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent line-anim-2 opacity-65 rotate-[22deg]" />

        {/* Ambient radial glows */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00e5ff]/10 rounded-full blur-[85px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#f5cd00]/5 rounded-full blur-[95px]" />
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#00e5ff]/15 rounded-full blur-[65px]" />
        
        {/* High-tech diagonal grid hatch pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1b243b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      </div>

      {/* TOP BAR: Safe Zone HUD & Status Badges */}
      <header className="relative z-10 pt-10 px-4 flex items-center justify-between">
        {/* Network & Engine Status Chip */}
        <div className="flex items-center gap-1.5 bg-[#171b28]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#3b494c]/40 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-ping" />
          <span className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#c3f5ff] tracking-wider uppercase">NITRO-NET CONNECTED</span>
        </div>

        {/* Regional Server Ping */}
        <div className="flex items-center gap-1 bg-[#171b28]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#3b494c]/30">
          <span className="material-symbols-outlined text-[#00e5ff] text-[14px]">wifi_tethering</span>
          <span className="font-['Barlow_Condensed'] text-[13px] font-bold text-[#f5cd00] tracking-wider">18ms</span>
        </div>
      </header>

      {/* CENTERPIECE: ARCADE LOGO & CAR SILHOUETTE */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4">
        {/* Top Checkered Wings Accent */}
        <div className="flex items-center justify-center gap-2 mb-1 w-full opacity-90">
          <div className="flex items-center gap-1">
            <span className="w-6 h-[2px] bg-gradient-to-r from-transparent to-[#00e5ff]" />
            <span className="font-['Barlow_Condensed'] text-[11px] font-extrabold text-[#00e5ff] italic tracking-widest">///</span>
            <div className="flex gap-0.5">
              <span className="w-2 h-2 bg-[#dfe2f3]" />
              <span className="w-2 h-2 bg-[#313442]" />
              <span className="w-2 h-2 bg-[#dfe2f3]" />
            </div>
          </div>

          <div className="px-2 py-0.5 bg-[#262a37] rounded-full border border-[#f5cd00]/50 shadow-[0_0_10px_rgba(245,205,0,0.4)] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#f5cd00] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-['Barlow_Condensed'] text-[11px] text-[#ffecac] font-extrabold tracking-widest uppercase">ARCADE RUSH</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <span className="w-2 h-2 bg-[#dfe2f3]" />
              <span className="w-2 h-2 bg-[#313442]" />
              <span className="w-2 h-2 bg-[#dfe2f3]" />
            </div>
            <span className="font-['Barlow_Condensed'] text-[11px] font-extrabold text-[#f5cd00] italic tracking-widest">///</span>
            <span className="w-6 h-[2px] bg-gradient-to-l from-transparent to-[#f5cd00]" />
          </div>
        </div>

        {/* MAIN TITLE: Chrome + Electric Neon Stacking */}
        <div className="relative flex flex-col items-center logo-glow">
          <h1 className="font-['Anybody'] text-[28px] italic font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#c3f5ff] to-[#849396] uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,229,255,0.6)]">
            POCKET
          </h1>

          <div className="relative -mt-1.5 flex items-center justify-center">
            <span className="absolute font-['Anybody'] text-[54px] italic font-black tracking-tight text-[#00e5ff] blur-md opacity-60 select-none">
              RACER
            </span>
            <h2 className="relative font-['Anybody'] text-[54px] leading-none italic font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-white to-[#f5cd00] uppercase drop-shadow-[0_8px_24px_rgba(245,205,0,0.5)] transform -skew-x-6">
              RACER
            </h2>
          </div>
        </div>

        {/* Tagline Ribbon Pill */}
        <div className="mt-1 flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#1b1f2c]/90 border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5cd00] animate-ping" />
          <span className="font-['Barlow_Condensed'] text-[13px] text-[#c3f5ff] tracking-widest font-black uppercase">TURBO EDITION • 240 FPS</span>
        </div>

        {/* CAR SILHOUETTE & GROUND UNDERGLOW POD */}
        <div className="relative w-full mt-7 flex flex-col items-center">
          <div className="absolute -bottom-3 w-64 h-12 bg-[#00e5ff]/45 rounded-full blur-xl" />
          <div className="absolute -bottom-1 w-48 h-4 bg-[#f5cd00]/30 rounded-full blur-md" />

          {/* Racing Grid Asphalt Perspective Floor Lines */}
          <div className="w-64 h-6 border-b-2 border-[#00e5ff]/40 relative flex justify-between items-end px-4">
            <span className="w-4 h-[1px] bg-[#00e5ff]/70 -rotate-12" />
            <span className="w-8 h-[2px] bg-white shadow-[0_0_8px_#ffffff]" />
            <span className="w-8 h-[2px] bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
            <span className="w-8 h-[2px] bg-white shadow-[0_0_8px_#ffffff]" />
            <span className="w-4 h-[1px] bg-[#00e5ff]/70 rotate-12" />
          </div>

          {/* Stylized Sports Car Silhouette SVG */}
          <div className="relative w-72 h-36 flex items-center justify-center -mb-2">
            <div className="absolute -left-4 top-14 w-28 h-10 bg-gradient-to-l from-[#00e5ff]/50 via-[#00e5ff]/15 to-transparent -rotate-6 blur-sm pointer-events-none headlight-beam" />
            <div className="absolute -right-4 top-14 w-28 h-10 bg-gradient-to-r from-[#00e5ff]/50 via-[#00e5ff]/15 to-transparent rotate-6 blur-sm pointer-events-none headlight-beam" />

            <svg className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,229,255,0.45)]" fill="none" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cyberBody" x1="160" x2="160" y1="20" y2="135" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#262A37" />
                  <stop offset="50%" stopColor="#121829" />
                  <stop offset="100%" stopColor="#0A0E1A" />
                </linearGradient>
                <linearGradient id="neonTrim" x1="0" x2="320" y1="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
                <linearGradient id="canopyGlass" x1="160" x2="160" y1="40" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              <path d="M 65 52 L 255 52 L 265 42 L 55 42 Z" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2" />
              <path d="M 90 52 L 85 70 M 230 52 L 235 70" stroke="#00E5FF" strokeWidth="2.5" />
              <path d="M 40 108 L 70 88 L 105 70 L 140 46 L 180 46 L 215 70 L 250 88 L 280 108 L 295 116 L 275 125 L 220 128 L 100 128 L 45 125 L 25 116 Z" fill="url(#cyberBody)" stroke="url(#neonTrim)" strokeWidth="2" />
              <path d="M 112 70 L 142 49 L 178 49 L 208 70 L 200 84 L 120 84 Z" fill="url(#canopyGlass)" stroke="#00E5FF" strokeWidth="1.5" />
              <path d="M 160 49 L 160 84" stroke="#FFFFFF" strokeDasharray="3 3" strokeOpacity="0.6" strokeWidth="1.5" />
              <path d="M 130 92 L 150 90 L 170 90 L 190 92" stroke="#00E5FF" strokeLinecap="round" strokeWidth="1.5" />
              <polygon fill="#00E5FF" opacity="0.4" points="145,95 175,95 168,100 152,100" />
              <polygon fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" points="48,110 68,104 88,106 62,114" />
              <line stroke="#FFFFFF" strokeWidth="2" x1="48" x2="88" y1="110" y2="106" />
              <polygon fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" points="272,110 252,104 232,106 258,114" />
              <line stroke="#FFFFFF" strokeWidth="2" x1="272" x2="232" y1="110" y2="106" />
              <path d="M 60 122 L 110 126 L 160 127 L 210 126 L 260 122" filter="drop-shadow(0 0 8px #00E5FF)" stroke="#00E5FF" strokeLinecap="round" strokeWidth="3" />
              <ellipse cx="68" cy="118" fill="#0A0E1A" rx="16" ry="11" stroke="#313442" strokeWidth="2" />
              <ellipse cx="68" cy="118" fill="#1B1F2C" rx="9" ry="6" stroke="#00E5FF" strokeWidth="1.5" />
              <ellipse cx="252" cy="118" fill="#0A0E1A" rx="16" ry="11" stroke="#313442" strokeWidth="2" />
              <ellipse cx="252" cy="118" fill="#1B1F2C" rx="9" ry="6" stroke="#00E5FF" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Vehicle Spec Tag Chip */}
          <div className="flex items-center gap-2 mt-1 px-2.5 py-0.5 rounded bg-[#262a37]/70 border border-[#3b494c]/30 text-[10px] text-[#bac9cc] font-['Barlow_Condensed'] tracking-wider uppercase font-extrabold">
            <span className="text-[#00e5ff] font-black">PROTOTYPE-X</span>
            <span className="w-1 h-1 rounded-full bg-[#849396]" />
            <span>DUAL NITRO DRIVE</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Progress HUD, Telemetry Checklist & Studio Badge */}
      <footer className="relative z-10 px-4 pb-8 flex flex-col gap-3">
        <div className="bg-[#171b28]/90 backdrop-blur-xl rounded-xl p-3.5 border border-[#3b494c]/40 shadow-[0_8px_24px_rgba(0,0,0,0.7)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00e5ff] text-[18px] animate-spin" style={{ animationDuration: '2.5s' }}>sync</span>
              <span className="font-['Barlow_Condensed'] text-[22px] font-extrabold text-[#c3f5ff] tracking-wide leading-none">LOADING ASSETS</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-['Barlow_Condensed'] text-[32px] text-[#00e5ff] font-black tracking-tight drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] leading-none">
                {progress}
              </span>
              <span className="font-['Barlow_Condensed'] text-[16px] text-[#00daf3] font-bold">%</span>
            </div>
          </div>

          {/* Angled Cyber Progress Bar Track */}
          <div className="relative w-full h-3.5 bg-[#0a0e1a] rounded-full p-[2px] overflow-hidden border border-[#3b494c]/60">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#c3f5ff] via-[#00e5ff] to-[#f5cd00] progress-active transition-all duration-150 relative flex items-center justify-end pr-1"
              style={{ width: `${progress}%` }}
            >
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
            </div>
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
              <span className="w-[1px] h-full bg-[#0f131f]" />
            </div>
          </div>

          {/* Telemetry Checklist Chips */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e1a]/80 border border-[#3b494c]/40">
              <span className="material-symbols-outlined text-[#00e5ff] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#dfe2f3] tracking-wider uppercase font-bold">ENGINE INITIALIZED</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e1a]/80 border border-[#3b494c]/40">
              <span className="material-symbols-outlined text-[#f5cd00] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#dfe2f3] tracking-wider uppercase font-bold">TRACKS READY</span>
            </div>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#c5020b] flex items-center justify-center shadow-[0_0_8px_rgba(197,2,11,0.6)]">
              <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <span className="font-['Anybody'] text-[12px] font-black tracking-widest text-[#dfe2f3] uppercase italic">STUDIO NITRO</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-['Barlow_Condensed'] text-[11px] text-[#849396] tracking-wider font-semibold">v1.2.0-arcade</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]/80" />
            <span className="font-['Barlow_Condensed'] text-[11px] text-[#bac9cc] font-bold tracking-widest uppercase">PROD-ASSET-SYNC</span>
          </div>
        </div>

        <div className="text-center text-[10px] text-[#849396] font-['Barlow_Condensed'] tracking-wider uppercase opacity-70">
          TAP TO SPEED UP
        </div>
      </footer>
    </main>
  );
};
