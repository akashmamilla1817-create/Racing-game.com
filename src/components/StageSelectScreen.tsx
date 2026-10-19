import React, { useState } from 'react';
import { Stage, Difficulty, GameMode } from '../types/game';
import { audio } from '../utils/audio';

interface StageSelectScreenProps {
  stages: Stage[];
  coins: number;
  onBack: () => void;
  onStartRace: (stage: Stage, difficulty: Difficulty, mode: GameMode) => void;
}

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({
  stages,
  coins,
  onBack,
  onStartRace,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('neon_metropolis');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('endless');

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const handleSelectStage = (stage: Stage) => {
    if (!stage.unlocked) {
      audio.playCrash(); // buzz feedback
      return;
    }
    audio.playClick();
    setSelectedStageId(stage.id);
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    audio.playClick();
    setSelectedDifficulty(diff);
  };

  const handleEnterRace = () => {
    audio.playNitro();
    onStartRace(selectedStage, selectedDifficulty, gameMode);
  };

  const getSpeedRange = () => {
    if (selectedDifficulty === 'easy') return '140 - 180 KM/H';
    if (selectedDifficulty === 'medium') return '180 - 240 KM/H';
    return '240 - 320 KM/H';
  };

  const getObstacleRating = () => {
    if (selectedDifficulty === 'easy') return 'Light';
    if (selectedDifficulty === 'medium') return 'Moderate';
    return 'Severe & Aggressive';
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen max-h-[844px] bg-[#0a0e1a] relative flex flex-col justify-between overflow-x-hidden bg-speed-lines border-x border-[#3b494c]/30 shadow-2xl select-none">
      {/* Ambient Cyber Glows */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-64 h-64 bg-[#c5020b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 w-full px-3 pt-3 pb-2 backdrop-blur-xl bg-[#0a0e1a]/90 border-b border-[#3b494c]/30 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          aria-label="Go Back"
          className="w-10 h-10 rounded-lg bg-[#171b28] border border-[#3b494c]/50 text-[#dfe2f3] flex items-center justify-center active:scale-95 transition-transform hover:border-[#00e5ff] hover:text-[#c3f5ff]"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[13px] font-['Barlow_Condensed'] font-bold text-[#00e5ff] tracking-wider drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
            STAGE SELECT
          </span>
          <h1 className="text-[18px] font-['Anybody'] italic text-[#dfe2f3] font-extrabold tracking-tight">
            SELECT STAGE & DIFFICULTY
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171b28]/95 border border-[#f5cd00]/40 shadow-[0_0_12px_rgba(245,205,0,0.2)]">
          <span className="material-symbols-outlined text-[#f5cd00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            monetization_on
          </span>
          <span className="text-[18px] font-['Barlow_Condensed'] font-extrabold text-[#ffecac] tracking-wide">
            {coins.toLocaleString()}
          </span>
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 px-3 pt-2 flex flex-col gap-3 overflow-y-auto no-scrollbar pb-2">
        {/* GAME MODE SELECTOR */}
        <section className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#171b28] rounded-xl border border-[#00e5ff]/30">
            <button
              onClick={() => {
                audio.playClick();
                setGameMode('endless');
              }}
              className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                gameMode === 'endless'
                  ? 'bg-[#00e5ff] text-[#0a0e1a] shadow-[0_0_14px_rgba(0,229,255,0.4)]'
                  : 'text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  all_inclusive
                </span>
                <span className="font-['Anybody'] italic font-black text-[13px] tracking-wide">
                  ENDLESS RUSH
                </span>
              </div>
              <span className={`text-[10px] font-['Barlow_Condensed'] font-bold ${gameMode === 'endless' ? 'text-[#004f58]' : 'text-[#849396]'}`}>
                INFINITE SURVIVAL
              </span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setGameMode('stage');
              }}
              className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                gameMode === 'stage'
                  ? 'bg-[#f5cd00] text-[#695700] shadow-[0_0_14px_rgba(245,205,0,0.4)]'
                  : 'text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">flag</span>
                <span className="font-['Anybody'] italic font-black text-[13px] tracking-wide">
                  CIRCUIT TRIAL
                </span>
              </div>
              <span className={`text-[10px] font-['Barlow_Condensed'] font-bold ${gameMode === 'stage' ? 'text-[#695700]' : 'text-[#849396]'}`}>
                STAGE DISTANCE RUN
              </span>
            </button>
          </div>
        </section>
        {/* TRACK SELECTION SECTION */}
        <section className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-3.5 bg-[#00e5ff] rounded-xs transform -skew-x-12 inline-block" />
              <span className="text-[13px] font-['Barlow_Condensed'] font-bold text-[#bac9cc] tracking-wider">
                TRACK SELECTION
              </span>
            </div>
            <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#00e5ff]">
              3 VENUES AVAILABLE
            </span>
          </div>

          {/* Horizontal Track Carousel */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pt-1 pb-2 -mx-3 px-3 snap-x snap-mandatory">
            {stages.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              return (
                <article
                  key={stage.id}
                  onClick={() => handleSelectStage(stage)}
                  className={`flex-shrink-0 w-[290px] snap-center rounded-xl overflow-hidden bg-[#171b28] relative flex flex-col transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#00e5ff] shadow-[0_0_24px_rgba(0,229,255,0.35)]'
                      : stage.unlocked
                      ? 'border border-[#3b494c]/50 opacity-90 hover:border-[#00e5ff]/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                      : 'border border-[#3b494c]/30 opacity-75'
                  }`}
                >
                  {/* Selected Tag or Locked Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-[#0a0e1a]/90 backdrop-blur-md border border-[#00e5ff]/70 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                      <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#00e5ff] tracking-wider">
                        SELECTED
                      </span>
                    </div>
                  )}

                  {!stage.unlocked && (
                    <div className="absolute inset-0 z-30 bg-[#0a0e1a]/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 p-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#c5020b]/20 border border-[#c5020b] flex items-center justify-center text-[#ffb4aa] shadow-[0_0_16px_rgba(197,2,11,0.4)]">
                        <span className="material-symbols-outlined text-[26px]">lock</span>
                      </div>
                      <span className="text-[16px] font-['Anybody'] italic text-[#ffb4aa] uppercase font-extrabold tracking-wide">
                        REQUIRES LEVEL {stage.requiredLevel}
                      </span>
                      <span className="text-[11px] font-['Barlow_Condensed'] text-[#bac9cc]">
                        Gain more XP in Medium or Hard stages
                      </span>
                    </div>
                  )}

                  {/* Multiplier Badge */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 bg-[#f5cd00] text-[#0a0e1a] font-['Barlow_Condensed'] text-[11px] rounded font-black shadow-[0_2px_10px_rgba(245,205,0,0.45)]">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      stars
                    </span>
                    <span>{stage.coinMultiplierLabel}</span>
                  </div>

                  {/* Visual Preview */}
                  <div className="relative h-40 w-full overflow-hidden bg-[#313442]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      style={{ backgroundImage: `url('${stage.bgImage}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171b28] via-[#171b28]/30 to-transparent" />

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#0a0e1a]/85 backdrop-blur-sm border border-[#3b494c]/50 text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#dfe2f3]">
                        {stage.lanes} LANES • {stage.distanceKm} KM
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0a0e1a]/85 backdrop-blur-sm border border-[#3b494c]/50 text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#00e5ff] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">{stage.weatherIcon}</span> {stage.weather}
                      </span>
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[20px] font-['Anybody'] italic font-black text-[#dfe2f3] tracking-tight">
                        {stage.name}
                      </h2>
                      <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] uppercase font-bold">
                        {stage.stageNumber}
                      </span>
                    </div>
                    <p className="text-[12px] font-['Plus_Jakarta_Sans'] text-[#bac9cc] line-clamp-2">
                      {stage.description}
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 pt-2 mt-1 border-t border-[#3b494c]/30">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396]">SURFACE</span>
                        <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">{stage.surface}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396]">TRAFFIC</span>
                        <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">{stage.traffic}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-['Barlow_Condensed'] text-[#849396]">RECORD</span>
                        <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#f5cd00]">{stage.record}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* DIFFICULTY SELECTOR TABS */}
        <section className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-3.5 bg-[#00e5ff] rounded-xs transform -skew-x-12 inline-block" />
              <span className="text-[13px] font-['Barlow_Condensed'] font-bold text-[#bac9cc] tracking-wider">
                DIFFICULTY RATING
              </span>
            </div>
            <span className="text-[11px] font-['Barlow_Condensed'] font-extrabold text-[#f5cd00]">
              {selectedDifficulty === 'easy' ? 'STANDARD SPEED' : selectedDifficulty === 'medium' ? '+25% SCORE ACTIVE' : '2X COINS & +75%'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-[#171b28] rounded-xl border border-[#3b494c]/40">
            {/* EASY */}
            <button
              onClick={() => handleSelectDifficulty('easy')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all duration-150 active:scale-95 ${
                selectedDifficulty === 'easy'
                  ? 'bg-[#1b1f2c] border-[#00e5ff] text-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.25)]'
                  : 'border-transparent text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              <span className="text-[16px] font-['Anybody'] italic font-extrabold tracking-wide">EASY</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#3b494c] mt-0.5">CRUISE PACE</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] text-[#849396] mt-0.5">STANDARD</span>
            </button>

            {/* MEDIUM */}
            <button
              onClick={() => handleSelectDifficulty('medium')}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-150 active:scale-95 ${
                selectedDifficulty === 'medium'
                  ? 'bg-[#1b1f2c] border border-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.25)] text-[#00e5ff]'
                  : 'border border-transparent text-[#849396] hover:text-[#dfe2f3]'
              }`}
              type="button"
            >
              {selectedDifficulty === 'medium' && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-[#00e5ff] text-[#0a0e1a] font-['Barlow_Condensed'] text-[9px] rounded-full font-black tracking-widest uppercase">
                  ACTIVE
                </span>
              )}
              <span className="text-[16px] font-['Anybody'] italic font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                MEDIUM
              </span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#9cf0ff] mt-0.5">ARCADE SPEED</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#f5cd00] mt-0.5 font-bold">+25% BONUS</span>
            </button>

            {/* HARD */}
            <button
              onClick={() => handleSelectDifficulty('hard')}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-150 active:scale-95 ${
                selectedDifficulty === 'hard'
                  ? 'border border-[#c5020b] bg-[#c5020b]/20 text-[#ffb4aa] shadow-[0_0_14px_rgba(197,2,11,0.45)]'
                  : 'border border-[#c5020b]/40 bg-[#c5020b]/5 text-[#ffb4aa] hover:border-[#c5020b]'
              }`}
              type="button"
            >
              {selectedDifficulty === 'hard' && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-[#c5020b] text-white font-['Barlow_Condensed'] text-[9px] rounded-full font-black tracking-widest uppercase">
                  ACTIVE
                </span>
              )}
              <span className="text-[16px] font-['Anybody'] italic font-extrabold tracking-wide">HARD</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#ffb4aa]/80 mt-0.5">EXTREME RUSH</span>
              <span className="text-[10px] font-['Barlow_Condensed'] text-[#ffb4aa] mt-0.5 font-extrabold">2X COINS & +75%</span>
            </button>
          </div>

          {/* Selected Difficulty Summary HUD */}
          <div className="px-3 py-1.5 rounded-lg bg-[#1b1f2c]/60 border border-[#3b494c]/30 flex items-center justify-between text-[12px] font-['Plus_Jakarta_Sans']">
            <div className="flex items-center gap-1.5 text-[#dfe2f3]">
              <span className="material-symbols-outlined text-[#00e5ff] text-[18px]">speed</span>
              <span>
                Speed Index: <strong className="text-[#00e5ff] font-['Barlow_Condensed'] text-[14px]">{getSpeedRange()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#bac9cc]">
              <span className="material-symbols-outlined text-[16px]">traffic</span>
              <span>
                Obstacles: <strong className="text-[#dfe2f3]">{getObstacleRating()}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* STAGE MODIFIERS & RACE SPECS */}
        <section className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-3.5 bg-[#00e5ff] rounded-xs transform -skew-x-12 inline-block" />
            <span className="text-[13px] font-['Barlow_Condensed'] font-bold text-[#bac9cc] tracking-wider">
              STAGE MODIFIERS & TUNING SPEC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-[#171b28] border border-[#3b494c]/40 flex flex-col gap-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-['Barlow_Condensed'] text-[#bac9cc] font-bold">ROAD TRACTION</span>
                <span className="material-symbols-outlined text-[#00e5ff] text-[18px]">water</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-['Barlow_Condensed'] text-[#dfe2f3] font-black">{selectedStage.tractionSlip}%</span>
                <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] font-bold">DRIFT SLIP</span>
              </div>
              <div className="flex gap-1 h-1.5 w-full">
                <span className="flex-1 bg-[#00e5ff] rounded-xs" />
                <span className="flex-1 bg-[#00e5ff] rounded-xs" />
                <span className="flex-1 bg-[#00e5ff] rounded-xs" />
                <span className="flex-1 bg-[#313442] rounded-xs" />
                <span className="flex-1 bg-[#313442] rounded-xs" />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#171b28] border border-[#3b494c]/40 flex flex-col gap-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-['Barlow_Condensed'] text-[#bac9cc] font-bold">NITRO REFILL</span>
                <span className="material-symbols-outlined text-[#f5cd00] text-[18px]">bolt</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-['Barlow_Condensed'] text-[#f5cd00] font-black">{selectedStage.nitroRefillRate}x</span>
                <span className="text-[11px] font-['Barlow_Condensed'] text-[#f5cd00] font-bold">DRAFT SPEED</span>
              </div>
              <div className="flex gap-1 h-1.5 w-full">
                <span className="flex-1 bg-[#f5cd00] rounded-xs shadow-[0_0_6px_rgba(245,205,0,0.5)]" />
                <span className="flex-1 bg-[#f5cd00] rounded-xs shadow-[0_0_6px_rgba(245,205,0,0.5)]" />
                <span className="flex-1 bg-[#f5cd00] rounded-xs shadow-[0_0_6px_rgba(245,205,0,0.5)]" />
                <span className="flex-1 bg-[#f5cd00] rounded-xs shadow-[0_0_6px_rgba(245,205,0,0.5)]" />
                <span className="flex-1 bg-[#313442] rounded-xs" />
              </div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#171b28] via-[#1b1f2c] to-[#171b28] border border-[#3b494c]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5cd00] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
              <span className="text-[12px] font-['Barlow_Condensed'] font-bold text-[#dfe2f3]">TOTAL RACE YIELD:</span>
            </div>
            <div className="flex items-center gap-2 font-['Barlow_Condensed'] font-extrabold text-[13px]">
              <span className="text-[#00e5ff]">+{selectedDifficulty === 'easy' ? '10%' : selectedDifficulty === 'medium' ? '25%' : '75%'} EXP</span>
              <span className="w-1 h-1 rounded-full bg-[#849396]" />
              <span className="text-[#f5cd00]">
                {selectedDifficulty === 'hard' ? `${selectedStage.coinMultiplier * 2}X` : `${selectedStage.coinMultiplier}X`} COINS
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* FIXED ARCADE LAUNCH CONTROL CTA */}
      <footer className="sticky bottom-0 z-40 w-full px-3 pt-2 pb-4 backdrop-blur-xl bg-[#0a0e1a]/95 border-t border-[#00e5ff]/20 shadow-[0_-8px_32px_rgba(0,0,0,0.85)]">
        <button
          onClick={handleEnterRace}
          className="w-full h-14 rounded-xl bg-[#00e5ff] border-b-[5px] border-[#008a99] active:border-b-0 active:translate-y-1 text-[#0a0e1a] font-['Anybody'] italic font-black tracking-wider shadow-[0_4px_24px_rgba(0,229,255,0.45)] hover:shadow-[0_0_28px_rgba(0,229,255,0.7)] flex items-center justify-between px-4 transition-all duration-100 group cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_gas_station
            </span>
            <span className="text-[13px] font-['Barlow_Condensed'] font-bold text-[#0a0e1a] tracking-tight">
              10 FUEL
            </span>
          </div>

          <span className="text-[20px] font-['Anybody'] tracking-wider flex items-center gap-2">
            ENTER RACE
            <span className="material-symbols-outlined text-[24px] transform group-hover:translate-x-1 transition-transform">
              sports_motorsports
            </span>
          </span>

          <div className="flex flex-col items-end leading-tight">
            <span className="text-[10px] font-['Barlow_Condensed'] uppercase font-extrabold opacity-80">
              {selectedStage.stageNumber}
            </span>
            <span className="text-[13px] font-['Barlow_Condensed'] text-[#0a0e1a] font-black">
              START
            </span>
          </div>
        </button>

        <div className="mt-1 flex justify-center items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
          <span className="text-[11px] font-['Barlow_Condensed'] text-[#849396] tracking-wider uppercase font-bold">
            Matchmaking server: US-EAST • Ping: 18ms
          </span>
        </div>
      </footer>
    </div>
  );
};
