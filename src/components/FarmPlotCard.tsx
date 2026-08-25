import React from 'react';
import { FarmPlot, CropInfo, Inventory } from '../types';
import { CROPS_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';
import { Droplets, Sparkles, AlertTriangle, Lock, Plus, Bug, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';

interface FarmPlotCardProps {
  plot: FarmPlot;
  playerLevel: number;
  inventory: Inventory;
  onSelectPlot: (plot: FarmPlot) => void;
  onQuickWater: (plotId: number) => void;
  onQuickFertilize: (plotId: number) => void;
  onQuickHarvest: (plotId: number) => void;
  onQuickSpray: (plotId: number) => void;
}

export const FarmPlotCard: React.FC<FarmPlotCardProps> = ({
  plot,
  playerLevel,
  inventory,
  onSelectPlot,
  onQuickWater,
  onQuickFertilize,
  onQuickHarvest,
  onQuickSpray,
}) => {
  const crop = plot.cropId ? CROPS_DATA[plot.cropId] : null;

  // If locked
  if (!plot.isUnlocked) {
    return (
      <div
        id={`plot-locked-${plot.id}`}
        className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[220px] text-center text-stone-400 select-none shadow-xs"
      >
        <div className="w-12 h-12 rounded-2xl bg-stone-200 border-2 border-stone-300 flex items-center justify-center text-stone-500 mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <p className="font-black text-xs text-stone-700 uppercase tracking-wide">แปลงที่ {plot.id + 1} ล็อกอยู่</p>
        <span className="text-[11px] font-bold text-stone-500 mt-0.5">
          ปลดล็อกเมื่อถึงเลเวล {plot.unlockLevel}
        </span>
      </div>
    );
  }

  // If Empty Plot
  if (plot.stage === 0 || !crop) {
    return (
      <button
        id={`plot-empty-${plot.id}`}
        onClick={() => {
          sounds.playPop();
          onSelectPlot(plot);
        }}
        className="cursor-pointer group bg-amber-50/70 hover:bg-amber-100/80 border-2 border-dashed border-amber-300 hover:border-emerald-600 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[220px] text-center transition-all duration-200 shadow-xs hover:shadow-md active:scale-98"
      >
        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-700 transition-colors shadow-xs mb-2">
          <Plus className="w-7 h-7 stroke-[3]" />
        </div>
        <p className="font-black text-sm text-stone-900 group-hover:text-emerald-900 tracking-tight">
          แปลงที่ {plot.id + 1}: ดินว่าง
        </p>
        <span className="text-xs text-stone-600 group-hover:text-emerald-800 mt-1 font-bold">
          แตะเพื่อเลือกเมล็ดพันธุ์ 🌾
        </span>
      </button>
    );
  }

  // Active growing / ready crop
  const stageIndex = Math.min(3, Math.max(0, plot.stage - 1));
  const currentEmoji = crop.stageEmojis[stageIndex];
  const stageName = [
    'ระยะที่ 1: เมล็ดกำลังแทงราก',
    'ระยะที่ 2: ต้นกล้าเริ่มผลิใบ',
    'ระยะที่ 3: ต้นเติบโตและออกดอก',
    'ระยะที่ 4: สุกเต็มที่พร้อมเก็บเกี่ยว! 🌟'
  ][stageIndex];

  const isHarvestReady = plot.stage === 4 || plot.growthProgress >= 100;
  const isWaterLow = plot.waterLevel < 25;
  const isFertilizerLow = plot.fertilizerLevel < 20;

  return (
    <div
      id={`plot-active-${plot.id}`}
      className={`relative rounded-3xl p-4 flex flex-col justify-between min-h-[230px] border-2 transition-all ${
        isHarvestReady
          ? 'bg-amber-50/90 border-amber-400 shadow-[0_4px_0_0_rgba(245,158,11,1)]'
          : isWaterLow
          ? 'bg-amber-50/60 border-amber-400 shadow-sm'
          : 'bg-white border-stone-900/15 shadow-[0_2px_0_0_rgba(28,25,23,0.06)]'
      }`}
    >
      {/* Top Bar: Crop Name & Stage Badge */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xs sm:text-sm text-stone-950 flex items-center gap-1 tracking-tight">
            {crop.name}
          </span>
        </div>

        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
            isHarvestReady
              ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-xs animate-pulse'
              : 'bg-emerald-100 text-emerald-950 border-emerald-300'
          }`}
        >
          {isHarvestReady ? 'พร้อมเก็บ!' : `ระยะ ${plot.stage}/4`}
        </span>
      </div>

      {/* Center: Interactive Plant Visualizer */}
      <div
        className="my-auto py-2 flex flex-col items-center justify-center cursor-pointer group"
        onClick={() => {
          sounds.playPop();
          onSelectPlot(plot);
        }}
        title="แตะเพื่อดูรายละเอียดเชิงวิชาการและการดูแล"
      >
        <div className="relative">
          {/* Pest indicator */}
          {plot.hasPest && (
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-3 -right-3 z-10 bg-rose-600 text-white p-1 rounded-full text-xs shadow-md border border-white"
              title="มีแมลงศัตรูพืช! รีบฉีดพ่นสารชีวภาพ"
            >
              <Bug className="w-4 h-4" />
            </motion.div>
          )}

          {/* Plant Graphic */}
          <motion.div
            key={`${plot.id}-${plot.stage}`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`text-5xl sm:text-6xl drop-shadow-sm select-none transition-transform group-hover:scale-110 ${
              isHarvestReady ? 'animate-bounce' : ''
            }`}
          >
            {currentEmoji}
          </motion.div>

          {/* Sparkles on harvest ready */}
          {isHarvestReady && (
            <span className="absolute -bottom-1 -left-2 text-xl animate-spin">✨</span>
          )}
        </div>

        <span className="text-[11px] text-stone-700 font-bold mt-1 text-center line-clamp-1">
          {stageName}
        </span>
      </div>

      {/* Plant Needs & Growth Progress Bar */}
      <div className="space-y-1.5 pt-1">
        {/* Growth Bar */}
        <div>
          <div className="flex justify-between text-[10px] text-stone-700 font-bold mb-0.5">
            <span>การเจริญเติบโต</span>
            <span className="font-black text-emerald-800 font-mono">{Math.round(plot.growthProgress)}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isHarvestReady ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${plot.growthProgress}%` }}
            />
          </div>
        </div>

        {/* Moisture & Nutrient mini bars */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {/* Water */}
          <div className="flex items-center gap-1">
            <Droplets className={`w-3.5 h-3.5 ${isWaterLow ? 'text-rose-500 animate-bounce' : 'text-sky-600'}`} />
            <div className="flex-1 bg-sky-100 h-1.5 rounded-full overflow-hidden border border-sky-200">
              <div
                className={`h-full rounded-full ${isWaterLow ? 'bg-rose-500' : 'bg-sky-600'}`}
                style={{ width: `${plot.waterLevel}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-stone-600">{Math.round(plot.waterLevel)}%</span>
          </div>

          {/* Fertilizer */}
          <div className="flex items-center gap-1">
            <FlaskConical className={`w-3.5 h-3.5 ${isFertilizerLow ? 'text-amber-500' : 'text-purple-600'}`} />
            <div className="flex-1 bg-purple-100 h-1.5 rounded-full overflow-hidden border border-purple-200">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${plot.fertilizerLevel}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-stone-600">{Math.round(plot.fertilizerLevel)}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 pt-2 border-t-2 border-stone-100 flex items-center gap-1.5">
        {isHarvestReady ? (
          <button
            id={`btn-harvest-${plot.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickHarvest(plot.id);
            }}
            className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs py-2 px-2 rounded-xl border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>เก็บเกี่ยว (+{crop.expReward} EXP)</span>
          </button>
        ) : (
          <>
            {/* Quick Water Button */}
            <button
              id={`btn-water-${plot.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickWater(plot.id);
              }}
              disabled={inventory.waterBuckets <= 0 || plot.waterLevel >= 90}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-black transition-all ${
                plot.waterLevel < 35
                  ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-xs border border-sky-600'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-300'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title="รดน้ำต้นไม้"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>รดน้ำ</span>
            </button>

            {/* Quick Pest spray if pest, or Quick fertilizer */}
            {plot.hasPest ? (
              <button
                id={`btn-spray-${plot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickSpray(plot.id);
                }}
                disabled={inventory.pestSprays <= 0}
                className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all border border-rose-700 disabled:opacity-40"
                title="ฉีดพ่นกำจัดแมลงศัตรูพืช"
              >
                <Bug className="w-3.5 h-3.5" />
                <span>พ่นยา</span>
              </button>
            ) : (
              <button
                id={`btn-fertilize-${plot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickFertilize(plot.id);
                }}
                disabled={
                  inventory.fertilizerOrganic +
                    inventory.fertilizerN +
                    inventory.fertilizerP +
                    inventory.fertilizerK <=
                  0
                }
                className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-black bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="ใส่ปุ๋ยบำรุงพืช"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>ใส่ปุ๋ย</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
