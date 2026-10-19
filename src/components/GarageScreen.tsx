import React, { useState } from 'react';
import { Vehicle, ScreenType } from '../types/game';
import { audio } from '../utils/audio';

interface GarageScreenProps {
  vehicles: Vehicle[];
  playerCoins: number;
  equippedVehicleId: string;
  onNavigate: (screen: ScreenType) => void;
  onEquipVehicle: (vehicleId: string) => void;
  onBuyVehicle: (vehicleId: string, cost: number) => void;
  onUpgradeStat: (vehicleId: string, statType: 'speed' | 'accel' | 'drift') => void;
  onUpdateLiveryColor: (color: string) => void;
}

export const GarageScreen: React.FC<GarageScreenProps> = ({
  vehicles,
  playerCoins,
  equippedVehicleId,
  onNavigate,
  onEquipVehicle,
  onBuyVehicle,
  onUpgradeStat,
  onUpdateLiveryColor,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(equippedVehicleId);
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [showPaintModal, setShowPaintModal] = useState<boolean>(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const isEquipped = selectedVehicle.id === equippedVehicleId;

  const handleSelectCar = (v: Vehicle) => {
    audio.playClick();
    setSelectedVehicleId(v.id);
  };

  const handleInspect = () => {
    audio.playClick();
    setTurntableRotation((r) => (r + 45) % 360);
  };

  const handlePrimaryAction = () => {
    if (isEquipped) {
      audio.playClick();
      return;
    }
    if (selectedVehicle.unlocked) {
      audio.playClick();
      onEquipVehicle(selectedVehicle.id);
    } else {
      if (playerCoins >= selectedVehicle.cost) {
        audio.playCoin();
        onBuyVehicle(selectedVehicle.id, selectedVehicle.cost);
      } else {
        audio.playCrash();
        alert(`Need ${selectedVehicle.cost - playerCoins} more coins to purchase this machine!`);
      }
    }
  };

  const handleUpgrade = (stat: 'speed' | 'accel' | 'drift') => {
    const upgradeCost = 1200;
    if (playerCoins >= upgradeCost) {
      audio.playNitro();
      onUpgradeStat(selectedVehicle.id, stat);
    } else {
      audio.playCrash();
      alert(`Need ${upgradeCost} coins to upgrade!`);
    }
  };

  const liveryColors = [
    { label: 'Electric Cyan', hex: '#00e5ff' },
    { label: 'Crimson Red', hex: '#c5020b' },
    { label: 'Acid Lime', hex: '#39ff14' },
    { label: 'Podium Gold', hex: '#f5cd00' },
    { label: 'Cobalt Blue', hex: '#00626e' },
    { label: 'Obsidian Purple', hex: '#8a2be2' },
  ];

  return (
    <main className="w-full max-w-[390px] min-h-screen max-h-[844px] bg-[#0a0e1a] relative flex flex-col justify-between overflow-x-hidden border-x border-[#3b494c]/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] pb-20 select-none overflow-y-auto no-scrollbar">
      {/* Cyber Neon Grid Ambient Layer */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00e5ff]/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0a0e1a]/85 px-3 py-2 flex items-center justify-between border-b border-[#3b494c]/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio.playClick();
              onNavigate('home');
            }}
            aria-label="Go back"
            className="w-9 h-9 rounded-lg bg-[#262a37]/80 border border-[#3b494c]/50 flex items-center justify-center text-[#dfe2f3] active:scale-90 transition-transform cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-[#849396] text-[10px] tracking-widest leading-none font-bold">
              SECTOR 04
            </span>
            <h1 className="text-[17px] font-['Anybody'] italic tracking-tight text-[#dfe2f3] font-extrabold uppercase">
              GARAGE & SHOWROOM
            </h1>
          </div>
        </div>

        {/* Currency Coin Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171b28] border border-[#f5cd00]/40 shadow-[0_0_12px_rgba(245,205,0,0.15)]">
          <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            monetization_on
          </span>
          <span className="font-['Barlow_Condensed'] text-[#ffecac] font-black tracking-tight text-[16px]">
            {playerCoins.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Content Stage */}
      <div className="flex-1 flex flex-col px-3 pt-1 space-y-2.5 z-10">
        {/* Vehicle Stage Display Area */}
        <section className="relative w-full rounded-xl bg-[#171b28]/75 border border-[#3b494c]/40 p-3 overflow-hidden flex flex-col items-center shadow-[0_8px_24px_rgba(0,0,0,0.65)] backdrop-blur-md">
          {/* Top Metadata */}
          <div className="w-full flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a0e1a]/80 border border-[#00e5ff]/40">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#00e5ff] tracking-wider uppercase">
                {selectedVehicle.tier} - {selectedVehicle.tierLabel}
              </span>
            </div>
            <button
              onClick={handleInspect}
              className="flex items-center gap-1 text-[#849396] hover:text-[#00e5ff] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">360</span>
              <span className="text-[10px] font-['Barlow_Condensed'] uppercase font-bold">INSPECTION</span>
            </button>
          </div>

          {/* 3D Car Presentation Turntable Showcase */}
          <div className="relative w-full h-40 flex items-center justify-center my-1">
            <div className="absolute w-44 h-16 bg-[#00e5ff]/20 blur-2xl rounded-full bottom-4" />
            <div className="absolute bottom-2 w-56 h-14 rounded-full border-2 border-[#00e5ff]/70 neon-turntable-ring transform scale-y-50 flex items-center justify-center">
              <div className="w-48 h-10 rounded-full border border-[#00e5ff]/30" />
            </div>

            {/* Futuristic Racer Graphic */}
            <div
              className="relative z-10 w-64 h-28 flex flex-col items-center justify-center transition-transform duration-300"
              style={{ transform: `rotateY(${turntableRotation}deg)` }}
            >
              <div
                className="relative w-52 h-18 rounded-2xl border-t-2 shadow-[0_12px_30px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden transition-colors"
                style={{
                  backgroundColor: '#171b28',
                  borderColor: selectedVehicle.liveryColor,
                  backgroundImage: `linear-gradient(135deg, #1b243b, ${selectedVehicle.liveryColor} 80%, #001f24)`,
                }}
              >
                <div className="absolute inset-y-0 w-4 bg-white/20 opacity-80 transform -skew-x-12 left-12" />
                <div className="absolute inset-y-0 w-1 bg-[#00e5ff] opacity-90 transform -skew-x-12 left-18" />
                <div className="w-28 h-7 rounded-t-full bg-[#0a0e1a]/90 border border-[#00e5ff]/40 backdrop-blur-sm -mt-2 flex items-center justify-center">
                  <span className="text-[10px] font-['Barlow_Condensed'] text-[#00e5ff] italic tracking-widest font-bold">
                    {selectedVehicle.name}.OS
                  </span>
                </div>
              </div>

              {/* Lower Diffuser & Exhausts */}
              <div className="w-48 h-5 bg-[#0a0e1a] border-x border-b border-[#3b494c]/60 rounded-b-xl flex items-center justify-between px-6 -mt-1 shadow-lg">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-[#3b494c]" />
                  <div className="w-1 h-3 bg-[#3b494c]" />
                  <div className="w-1 h-3 bg-[#3b494c]" />
                </div>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-ping" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Name & Power */}
          <div className="w-full flex items-baseline justify-between pt-1 z-20">
            <div>
              <h2 className="text-[20px] font-['Anybody'] italic font-black text-[#dfe2f3] tracking-tight leading-none uppercase">
                {selectedVehicle.name}
              </h2>
              <p className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#849396] mt-0.5">
                {selectedVehicle.tagline}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#00e5ff] uppercase tracking-wider block font-bold">
                POWER INDEX
              </span>
              <span className="text-[20px] font-['Barlow_Condensed'] text-[#dfe2f3] font-black leading-none">
                {selectedVehicle.pwrBhp} BHP
              </span>
            </div>
          </div>
        </section>

        {/* Fleet Horizontal Carousel */}
        <section className="w-full flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#bac9cc] uppercase tracking-wider">
              SELECT MACHINE
            </span>
            <span className="text-[11px] font-['Barlow_Condensed'] text-[#00e5ff] font-extrabold">
              {vehicles.filter((v) => v.unlocked).length} / {vehicles.length} UNLOCKED
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 snap-x">
            {vehicles.map((v) => {
              const isCurrent = v.id === selectedVehicleId;
              const isEquippedCar = v.id === equippedVehicleId;

              return (
                <article
                  key={v.id}
                  onClick={() => handleSelectCar(v)}
                  className={`flex-shrink-0 w-28 snap-start rounded-lg p-2 flex flex-col justify-between transition-all cursor-pointer relative ${
                    isCurrent
                      ? 'bg-[#262a37] border-2 border-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.35)]'
                      : v.unlocked
                      ? 'bg-[#171b28]/70 border border-[#3b494c]/40 hover:border-[#849396]'
                      : 'bg-[#0a0e1a]/80 border border-[#3b494c]/30 opacity-70'
                  }`}
                >
                  {isEquippedCar && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00e5ff] text-[#0a0e1a] text-[8px] font-['Barlow_Condensed'] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      EQUIPPED
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-['Barlow_Condensed'] font-extrabold text-[#00e5ff]">
                      {v.tier}
                    </span>
                    {v.unlocked ? (
                      <span className="text-[8px] font-['Barlow_Condensed'] text-[#bac9cc] uppercase bg-[#1b1f2c] px-1 rounded font-bold">
                        OWNED
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[13px] text-[#849396]">lock</span>
                    )}
                  </div>

                  <div className="my-1.5 flex justify-center">
                    <span
                      className={`material-symbols-outlined text-[32px] ${
                        isCurrent ? 'text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]' : 'text-[#849396]'
                      }`}
                    >
                      {v.thumbnailIcon}
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-['Barlow_Condensed'] font-black text-[#dfe2f3] truncate leading-tight uppercase">
                      {v.name}
                    </p>
                    {v.unlocked ? (
                      <p className="text-[9px] font-['Plus_Jakarta_Sans'] text-[#849396] truncate">
                        {v.tierLabel}
                      </p>
                    ) : (
                      <div className="flex items-center gap-0.5 text-[#f5cd00] mt-0.5">
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          monetization_on
                        </span>
                        <span className="text-[10px] font-['Barlow_Condensed'] font-black">
                          {v.cost.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Performance Telemetry Bento Box */}
        <section className="w-full rounded-xl bg-[#171b28]/90 border border-[#3b494c]/40 p-3 space-y-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#3b494c]/30 pb-1.5">
            <span className="text-[12px] font-['Barlow_Condensed'] font-extrabold text-[#dfe2f3] uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00e5ff] text-[16px]">speed</span>
              PERFORMANCE TELEMETRY
            </span>
            <span className="text-[11px] font-['Barlow_Condensed'] font-bold text-[#849396]">
              SPECIFICATION 2.4
            </span>
          </div>

          {/* Stat 1: Top Speed */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold">
                  Top Speed
                </span>
                {selectedVehicle.unlocked && (
                  <button
                    onClick={() => handleUpgrade('speed')}
                    className="text-[9px] bg-[#00e5ff]/20 text-[#00e5ff] px-1 rounded hover:bg-[#00e5ff]/40 cursor-pointer font-bold"
                  >
                    + UPGRADE (1,200g)
                  </button>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[18px] font-['Barlow_Condensed'] text-[#00e5ff] font-black leading-none">
                  {selectedVehicle.topSpeedKmh}
                </span>
                <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396] font-bold">KM/H</span>
              </div>
            </div>
            {/* 10-step segmented bar */}
            <div className="grid grid-cols-10 gap-1 h-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = i < Math.floor(selectedVehicle.topSpeedPercent / 10);
                return (
                  <div
                    key={i}
                    className={`rounded-sm transition-colors ${
                      filled ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#313442]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stat 2: Acceleration */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold">
                  Acceleration
                </span>
                {selectedVehicle.unlocked && (
                  <button
                    onClick={() => handleUpgrade('accel')}
                    className="text-[9px] bg-[#ffb4aa]/20 text-[#ffb4aa] px-1 rounded hover:bg-[#ffb4aa]/40 cursor-pointer font-bold"
                  >
                    + UPGRADE (1,200g)
                  </button>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[18px] font-['Barlow_Condensed'] text-[#ffb4aa] font-black leading-none">
                  {selectedVehicle.accelSec}s
                </span>
                <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396] font-bold">0-100</span>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-1 h-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = i < Math.floor(selectedVehicle.accelPercent / 10);
                return (
                  <div
                    key={i}
                    className={`rounded-sm transition-colors ${
                      filled ? 'bg-[#ffb4aa] shadow-[0_0_6px_#ffb4aa]' : 'bg-[#313442]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Stat 3: Handling & Drift */}
          <div className="pt-0.5 flex items-center justify-between bg-[#1b1f2c]/60 px-2 py-1.5 rounded-lg border border-[#3b494c]/30">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00e5ff] text-[18px]">tune</span>
              <span className="text-[11px] font-['Barlow_Condensed'] text-[#dfe2f3] uppercase font-bold">
                Handling & Drift Stability
              </span>
            </div>
            <span className="text-[16px] font-['Barlow_Condensed'] text-[#00e5ff] font-extrabold">
              {selectedVehicle.driftStabilityPercent}%
            </span>
          </div>
        </section>

        {/* Action CTAs */}
        <section className="grid grid-cols-5 gap-2 pt-0.5">
          <button
            onClick={() => {
              audio.playClick();
              setShowPaintModal(true);
            }}
            className="col-span-2 h-12 rounded-lg bg-[#262a37] border border-[#00e5ff]/40 flex items-center justify-center gap-1.5 text-[#dfe2f3] font-['Barlow_Condensed'] text-[12px] font-extrabold uppercase active:scale-95 transition-transform hover:border-[#00e5ff] hover:text-[#00e5ff] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00e5ff]">palette</span>
            <span>PAINT & WHEELS</span>
          </button>

          <button
            onClick={handlePrimaryAction}
            className={`col-span-3 h-12 rounded-lg font-['Anybody'] font-black italic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isEquipped
                ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_4px_20px_rgba(0,229,255,0.45)] border-b-4 border-[#009bb0]'
                : selectedVehicle.unlocked
                ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_4px_20px_rgba(0,229,255,0.45)] border-b-4 border-[#009bb0] active:translate-y-1'
                : 'bg-[#f5cd00] text-[#695700] shadow-[0_4px_20px_rgba(245,205,0,0.45)] border-b-4 border-[#ab8e00] active:translate-y-1'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isEquipped ? 'check' : selectedVehicle.unlocked ? 'sports_motorsports' : 'lock_open'}
            </span>
            <span className="tracking-wide text-[16px]">
              {isEquipped
                ? 'EQUIPPED'
                : selectedVehicle.unlocked
                ? 'EQUIP MACHINE'
                : `BUY FOR ${selectedVehicle.cost.toLocaleString()} C`}
            </span>
          </button>
        </section>
      </div>

      {/* Paint & Livery Modal Drawer */}
      {showPaintModal && (
        <div className="absolute inset-0 z-50 bg-[#0a0e1a]/85 backdrop-blur-md flex items-end">
          <div className="w-full bg-[#171b28] border-t-2 border-[#00e5ff] rounded-t-2xl p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#3b494c]/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00e5ff]">palette</span>
                <h3 className="font-['Anybody'] text-[16px] italic text-[#dfe2f3] font-bold">
                  CUSTOMIZE LIVERY COLOR
                </h3>
              </div>
              <button
                onClick={() => setShowPaintModal(false)}
                className="w-8 h-8 rounded-full bg-[#262a37] text-[#bac9cc] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {liveryColors.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => {
                    audio.playClick();
                    onUpdateLiveryColor(col.hex);
                    setShowPaintModal(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#1b1f2c] border border-[#3b494c]/50 hover:border-[#00e5ff] transition-all cursor-pointer"
                >
                  <span
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-['Barlow_Condensed'] text-[12px] font-bold text-[#dfe2f3]">
                    {col.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar (Garage Tab Active) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-1.5 pb-3 max-w-[390px] mx-auto bg-[#171b28]/95 border-t border-[#00e5ff]/30 shadow-[0_-8px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <button
          onClick={() => {
            audio.playClick();
            onNavigate('home');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">sports_motorsports</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('garage');
          }}
          className="flex flex-col items-center justify-center text-[#00e5ff] font-['Barlow_Condensed'] relative after:content-[''] after:absolute after:-top-1.5 after:w-8 after:h-[2px] after:bg-[#00e5ff] after:shadow-[0_0_8px_#00e5ff] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            garage
          </span>
          <span className="text-[10px] tracking-wider uppercase font-bold mt-0.5">Garage</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('missions');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">military_tech</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Missions</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('ranks');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">leaderboard</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Ranks</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigate('settings');
          }}
          className="flex flex-col items-center justify-center text-[#849396] font-['Barlow_Condensed'] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="text-[10px] tracking-wider uppercase mt-0.5 font-bold">Settings</span>
        </button>
      </nav>
    </main>
  );
};
