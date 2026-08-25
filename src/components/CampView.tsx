import React, { useState } from 'react';
import { CampUpgrade, CropInfo, FarmPlot, HeroStats, InGameTime, Inventory, WeatherState, WeatherType } from '../types';
import { CAMP_UPGRADES, CROPS_DATA } from '../data/gameData';
import { FarmPlotCard } from './FarmPlotCard';
import { WeatherWidget } from './WeatherWidget';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Home, Sparkles, Heart, Zap, BedDouble, Sprout, ArrowUpCircle, Lock, CheckCircle2, Shovel, ShoppingBag, FlaskConical, Map } from 'lucide-react';

interface CampViewProps {
  hero: HeroStats;
  inventory: Inventory;
  plots: FarmPlot[];
  weather?: WeatherState;
  time?: InGameTime;
  onSetWeather?: (type: WeatherType) => void;
  onSelectPlot: (plot: FarmPlot) => void;
  onQuickWater: (plotId: number) => void;
  onQuickFertilize: (plotId: number) => void;
  onQuickHarvest: (plotId: number) => void;
  onQuickSpray: (plotId: number) => void;
  onTillPlot: (plotId: number) => void;
  onRestInBed: () => void;
  onUpgradeCamp: (targetLevel: number) => void;
  onOpenShop: () => void;
  onOpenAlchemy: () => void;
  onOpenWorldMap: () => void;
}

export const CampView: React.FC<CampViewProps> = ({
  hero,
  inventory,
  plots,
  weather,
  time,
  onSetWeather,
  onSelectPlot,
  onQuickWater,
  onQuickFertilize,
  onQuickHarvest,
  onQuickSpray,
  onTillPlot,
  onRestInBed,
  onUpgradeCamp,
  onOpenShop,
  onOpenAlchemy,
  onOpenWorldMap,
}) => {
  const currentCamp = CAMP_UPGRADES.find((c) => c.level === hero.campLevel) || CAMP_UPGRADES[0];
  const nextCamp = CAMP_UPGRADES.find((c) => c.level === hero.campLevel + 1);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isResting, setIsResting] = useState(false);

  // Check if player can afford next upgrade
  const canAffordUpgrade =
    nextCamp &&
    hero.coins >= nextCamp.costGold &&
    (inventory.materials.magic_wood || 0) >= nextCamp.costWood &&
    (inventory.materials.runestone || 0) >= nextCamp.costRunestone &&
    hero.manaCrystals >= nextCamp.costCrystals;

  // Handle Sleep / Rest in bed
  const handleRest = () => {
    setIsResting(true);
    sounds.playHeal();
    setTimeout(() => {
      onRestInBed();
      setIsResting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Camp Hero Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 rounded-3xl border-2 border-stone-900 p-5 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Camp Cabin Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0">
              {currentCamp.cabinIcon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-lg border border-stone-900 shadow-2xs font-mono uppercase">
                  🏕️ CAMP TIER {currentCamp.level}
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  โบนัสเติบโต: +{currentCamp.growthSpeedBonus}%
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 uppercase tracking-tight">
                {currentCamp.title}
              </h2>
              <p className="text-xs text-emerald-100 max-w-lg mt-0.5 leading-relaxed">
                {currentCamp.description}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Rest in Bed Button */}
            <button
              onClick={handleRest}
              disabled={isResting || hero.hp >= hero.maxHp}
              className="cursor-pointer bg-sky-400 hover:bg-sky-500 disabled:opacity-50 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1.5"
              title="ฟื้นฟู HP เต็ม 100%"
            >
              <BedDouble className="w-4 h-4 stroke-[2.5]" />
              <span>{isResting ? 'กำลังนอนหลับ... 💤' : 'พักผ่อนเตียง (Full HP)'}</span>
            </button>

            {/* Upgrade Camp Button */}
            {nextCamp && (
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowUpgradeModal(true);
                }}
                className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ArrowUpCircle className="w-4 h-4 stroke-[2.5]" />
                <span>อัปเกรดแคมป์ (Tier {nextCamp.level})</span>
              </button>
            )}

            {/* Alchemy Lab shortcut */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenAlchemy();
              }}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-3.5 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1"
            >
              <FlaskConical className="w-4 h-4" />
              <span>ห้องปรุงยา</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Weather & Time Widget */}
      {weather && time && (
        <WeatherWidget
          weather={weather}
          time={time}
          onSetWeather={onSetWeather}
        />
      )}

      {/* Farm Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-b-2 border-stone-900/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-stone-900 flex items-center justify-center text-white text-lg">
            🌱
          </div>
          <div>
            <h3 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              แปลงเกษตรเวทมนตร์ (Magic Farm Plots)
            </h3>
            <span className="text-xs text-stone-500 font-bold">
              ดูแลพืช 4 ระยะ รดน้ำ ใส่ปุ๋ย N-P-K และเก็บเกี่ยวเพื่อนำไปปรุงยาหรือขาย
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              onOpenShop();
            }}
            className="cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs px-3 py-2 rounded-xl border-2 border-stone-900 shadow-2xs active:scale-95 transition-all flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
            <span>ร้านค้าเมล็ดพันธุ์</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onOpenWorldMap();
            }}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl border-2 border-stone-900 shadow-2xs active:scale-95 transition-all flex items-center gap-1"
          >
            <Map className="w-3.5 h-3.5" />
            <span>ออกผจญภัย</span>
          </button>
        </div>
      </div>

      {/* 6 Plots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {plots.map((plot) => (
          <FarmPlotCard
            key={plot.id}
            plot={plot}
            playerLevel={hero.level}
            inventory={inventory}
            onSelectPlot={onSelectPlot}
            onQuickWater={onQuickWater}
            onQuickFertilize={onQuickFertilize}
            onQuickHarvest={onQuickHarvest}
            onQuickSpray={onQuickSpray}
          />
        ))}
      </div>

      {/* Upgrade Camp Modal */}
      {showUpgradeModal && nextCamp && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 shadow-[0_8px_0_0_rgba(28,25,23,1)] space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{nextCamp.cabinIcon}</span>
                <div>
                  <h4 className="font-black text-base text-stone-950 uppercase">
                    อัปเกรดแคมป์เป็น {nextCamp.title}
                  </h4>
                  <span className="text-xs text-emerald-700 font-bold">ระดับถัดไป (Tier {nextCamp.level})</span>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="cursor-pointer text-stone-400 hover:text-stone-900 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-stone-600 leading-relaxed">
              {nextCamp.description}
            </p>

            {/* Perks list */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[11px] font-black text-emerald-950 uppercase block">
                สิทธิประโยชน์ที่จะได้รับ:
              </span>
              {nextCamp.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* Cost checklist */}
            <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-black text-stone-950 uppercase block">
                ทรัพยากรที่ต้องใช้:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Gold */}
                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    hero.coins >= nextCamp.costGold ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <span className="font-bold">🪙 {nextCamp.costGold} Gold</span>
                  <span className="font-mono text-[11px]">{hero.coins}/{nextCamp.costGold}</span>
                </div>

                {/* Magic Wood */}
                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    (inventory.materials.magic_wood || 0) >= nextCamp.costWood
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <span className="font-bold">🪵 {nextCamp.costWood} ไม้เวท</span>
                  <span className="font-mono text-[11px]">{inventory.materials.magic_wood || 0}/{nextCamp.costWood}</span>
                </div>

                {/* Runestone */}
                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    (inventory.materials.runestone || 0) >= nextCamp.costRunestone
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <span className="font-bold">🪨 {nextCamp.costRunestone} หินรูน</span>
                  <span className="font-mono text-[11px]">{inventory.materials.runestone || 0}/{nextCamp.costRunestone}</span>
                </div>

                {/* Mana Crystals */}
                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    hero.manaCrystals >= nextCamp.costCrystals
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <span className="font-bold">💎 {nextCamp.costCrystals} คริสตัล</span>
                  <span className="font-mono text-[11px]">{hero.manaCrystals}/{nextCamp.costCrystals}</span>
                </div>
              </div>
            </div>

            {/* Confirm upgrade button */}
            <button
              onClick={() => {
                sounds.playLevelUp();
                confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
                onUpgradeCamp(nextCamp.level);
                setShowUpgradeModal(false);
              }}
              disabled={!canAffordUpgrade}
              className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-black text-sm py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-98 transition-all flex items-center justify-center gap-1.5 uppercase"
            >
              <Sparkles className="w-4 h-4" />
              <span>ยืนยันการอัปเกรดแคมป์</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
