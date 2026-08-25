import React, { useState } from 'react';
import { FarmPlot, CropInfo, Inventory } from '../types';
import { CROPS_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';
import { X, Droplets, FlaskConical, Sparkles, Sprout, Bug, Info, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlotModalProps {
  plot: FarmPlot | null;
  playerLevel: number;
  inventory: Inventory;
  onClose: () => void;
  onPlantSeed: (plotId: number, cropId: string) => void;
  onWaterPlot: (plotId: number) => void;
  onFertilizePlot: (plotId: number, fertilizerType: 'organic' | 'N' | 'P' | 'K') => void;
  onSprayPest: (plotId: number) => void;
  onHarvestPlot: (plotId: number) => void;
  onOpenShop: () => void;
}

export const PlotModal: React.FC<PlotModalProps> = ({
  plot,
  playerLevel,
  inventory,
  onClose,
  onPlantSeed,
  onWaterPlot,
  onFertilizePlot,
  onSprayPest,
  onHarvestPlot,
  onOpenShop,
}) => {
  const [selectedFertilizer, setSelectedFertilizer] = useState<'organic' | 'N' | 'P' | 'K'>('organic');

  if (!plot) return null;

  const crop = plot.cropId ? CROPS_DATA[plot.cropId] : null;
  const isPlotEmpty = plot.stage === 0 || !crop;
  const isHarvestReady = plot.stage === 4 || plot.growthProgress >= 100;
  const stageIndex = Math.min(3, Math.max(0, plot.stage - 1));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-stone-900 p-5 relative"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 flex items-center justify-center text-2xl font-black shrink-0">
              {isPlotEmpty ? '🌱' : crop?.icon}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-stone-950 tracking-tight">
                แปลงเกษตรที่ {plot.id + 1} {isPlotEmpty ? '(ดินว่าง)' : `- ${crop?.name}`}
              </h3>
              <p className="text-xs font-bold text-emerald-800">
                {isPlotEmpty
                  ? 'เลือกเมล็ดพันธุ์ที่คุณมีในคลังเพื่อเริ่มต้นเพาะปลูก'
                  : crop?.scientificName}
              </p>
            </div>
          </div>

          {/* Case 1: Empty Plot -> Seed Selector */}
          {isPlotEmpty ? (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-300 text-xs font-medium text-stone-900 leading-relaxed">
                💡 <strong className="font-black text-stone-950">เคล็ดลับเกษตรกร:</strong> พืชแต่ละชนิดมีระยะเวลาเติบโตและความต้องการธาตุอาหารแตกต่างกัน การเลือกปลูกหมุนเวียนจะช่วยบำรุงดินได้ดี
              </div>

              <div className="space-y-2.5">
                <h4 className="font-black text-xs text-stone-950 uppercase tracking-wider">
                  เมล็ดพันธุ์พร้อมปลูก:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(CROPS_DATA).map((cropOption) => {
                    const seedCount = inventory.seeds[cropOption.id] || 0;
                    const isLevelLocked = playerLevel < cropOption.unlockLevel;

                    return (
                      <div
                        key={cropOption.id}
                        className={`p-3 rounded-2xl border-2 flex flex-col justify-between gap-2 transition-all ${
                          isLevelLocked
                            ? 'bg-stone-50 border-stone-200 opacity-60'
                            : seedCount > 0
                            ? 'bg-white border-stone-900/20 hover:border-emerald-600 shadow-xs'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{cropOption.icon}</span>
                            <div>
                              <div className="font-black text-xs text-stone-950">
                                {cropOption.name}
                              </div>
                              <div className="text-[10px] font-bold text-stone-500 font-mono">
                                {cropOption.growthDurationSeconds}s | +{cropOption.expReward} EXP
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wide ${
                              seedCount > 0
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-stone-100 text-stone-600 border-stone-300'
                            }`}
                          >
                            {seedCount} ซอง
                          </span>
                        </div>

                        {/* Science mini fact */}
                        <div className="text-[10px] font-medium text-stone-700 bg-stone-100 p-1.5 rounded-lg border border-stone-200 line-clamp-2">
                          🌱 ธาตุอาหารที่ชอบ: ปุ๋ย {cropOption.idealFertilizer}
                        </div>

                        {/* Plant action */}
                        {isLevelLocked ? (
                          <div className="text-[10px] font-black text-rose-600 text-center py-1">
                            🔒 ปลดล็อกที่เลเวล {cropOption.unlockLevel}
                          </div>
                        ) : seedCount > 0 ? (
                          <button
                            onClick={() => {
                              onPlantSeed(plot.id, cropOption.id);
                              onClose();
                            }}
                            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs py-2 rounded-xl border border-emerald-800 shadow-xs transition-all flex items-center justify-center gap-1"
                          >
                            <Sprout className="w-4 h-4" />
                            <span>หยอดเมล็ดปลูก</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenShop();
                            }}
                            className="w-full cursor-pointer bg-amber-100 hover:bg-amber-200 text-stone-950 font-black text-xs py-2 rounded-xl border border-amber-300 transition-colors"
                          >
                            🛒 ซื้อเมล็ดที่ร้านค้า
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Case 2: Active Growing Plant Inspection */
            <div className="space-y-4">
              {/* Plant 4-Stage visual timeline */}
              <div className="bg-stone-50 border-2 border-stone-900/15 rounded-2xl p-3.5">
                <h4 className="font-black text-xs text-stone-950 mb-2.5 flex items-center justify-between uppercase tracking-wide">
                  <span>วัฏจักรการเติบโต 4 ระยะ</span>
                  <span className="text-emerald-800 font-mono font-black text-[11px]">
                    ความคืบหน้า: {Math.round(plot.growthProgress)}%
                  </span>
                </h4>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {crop?.stageEmojis.map((emoji, idx) => {
                    const stageNum = idx + 1;
                    const isPassed = plot.stage >= stageNum;
                    const isCurrent = plot.stage === stageNum;

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-amber-100 border-amber-500 font-black text-stone-950 ring-2 ring-amber-300 shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-stone-100 border-stone-200 text-stone-400'
                        }`}
                      >
                        <span className="text-2xl mb-1">{emoji}</span>
                        <span className="text-[10px] font-black line-clamp-1">ระยะ {stageNum}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-stone-800 font-medium mt-2.5 bg-white p-2.5 rounded-xl border border-stone-200 leading-relaxed">
                  📖 <strong className="font-black text-stone-950">ระยะปัจจุบัน:</strong> {crop?.stageDescriptions[stageIndex]}
                </p>
              </div>

              {/* Agricultural Science Knowledge Card */}
              <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-3 text-xs text-teal-950">
                <div className="flex items-center gap-1.5 font-black text-teal-950 mb-1 uppercase tracking-wide">
                  <Info className="w-4 h-4 text-teal-700 stroke-[2.5]" />
                  <span>เกร็ดความรู้วิทยาศาสตร์การเกษตร:</span>
                </div>
                <p className="leading-relaxed font-medium">{crop?.scienceFact}</p>
              </div>

              {/* Meters: Water & Nutrition */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-2xl border-2 border-stone-200">
                <div>
                  <div className="flex justify-between text-xs font-black text-stone-900 mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" /> ความชื้นในดิน
                    </span>
                    <span className="font-mono">{Math.round(plot.waterLevel)}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden border border-stone-300">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all"
                      style={{ width: `${plot.waterLevel}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 mt-0.5 block">
                    {plot.waterLevel < 20 ? '⚠️ พืชขาดน้ำ การโตหยุดชะงัก' : '✅ ความชื้นเหมาะสม'}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black text-stone-900 mb-1">
                    <span className="flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> ระดับธาตุอาหาร
                    </span>
                    <span className="font-mono">{Math.round(plot.fertilizerLevel)}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden border border-stone-300">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${plot.fertilizerLevel}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 mt-0.5 block">
                    {plot.fertilizerLevel > 30 ? '🚀 เร่งการเติบโต x1.5' : 'ธรรมดา'}
                  </span>
                </div>
              </div>

              {/* Pest warning */}
              {plot.hasPest && (
                <div className="bg-rose-50 border-2 border-rose-400 p-3 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-rose-950">
                    <Bug className="w-5 h-5 text-rose-600 shrink-0 stroke-[2.5]" />
                    <div>
                      <span className="font-black">พบหนอน/เพลี้ยศัตรูพืช!</span>
                      <p className="text-[10px] font-medium text-rose-800">ฉีดพ่นสารชีวภาพเพื่อป้องกันความเสียหาย</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSprayPest(plot.id)}
                    disabled={inventory.pestSprays <= 0}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3 py-2 rounded-xl border border-rose-800 disabled:opacity-40"
                  >
                    พ่นยา ({inventory.pestSprays} ขวด)
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {isHarvestReady ? (
                <button
                  onClick={() => {
                    onHarvestPlot(plot.id);
                    onClose();
                  }}
                  className="w-full cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>เก็บเกี่ยวผลผลิต (+{crop?.sellPrice} เหรียญ & +{crop?.expReward} EXP)</span>
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    {/* Water Button */}
                    <button
                      onClick={() => onWaterPlot(plot.id)}
                      disabled={inventory.waterBuckets <= 0 || plot.waterLevel >= 95}
                      className="cursor-pointer flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs py-3 rounded-xl border border-sky-800 shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Droplets className="w-4 h-4" />
                      <span>รดน้ำ (เหลือน้ำ {inventory.waterBuckets} ถัง)</span>
                    </button>
                  </div>

                  {/* Fertilizer selection bar */}
                  <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-purple-950">
                      <span>เลือกประเภทปุ๋ยบำรุง:</span>
                      <span className="text-[10px] font-bold text-purple-800">
                        แนะนำ: ปุ๋ย {crop?.idealFertilizer}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      {[
                        { type: 'organic', name: 'อินทรีย์', count: inventory.fertilizerOrganic },
                        { type: 'N', name: 'ไนโตรเจน (N)', count: inventory.fertilizerN },
                        { type: 'P', name: 'ฟอสฟอรัส (P)', count: inventory.fertilizerP },
                        { type: 'K', name: 'โพแทสเซียม (K)', count: inventory.fertilizerK },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => setSelectedFertilizer(item.type as 'organic' | 'N' | 'P' | 'K')}
                          className={`p-1.5 rounded-xl border-2 text-center transition-all ${
                            selectedFertilizer === item.type
                              ? 'bg-purple-700 text-white font-black border-purple-900 shadow-xs'
                              : 'bg-white text-purple-950 font-bold border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          <div>{item.name}</div>
                          <div className="text-[10px] opacity-80 font-mono">{item.count} ถุง</div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onFertilizePlot(plot.id, selectedFertilizer)}
                      disabled={
                        (selectedFertilizer === 'organic' && inventory.fertilizerOrganic <= 0) ||
                        (selectedFertilizer === 'N' && inventory.fertilizerN <= 0) ||
                        (selectedFertilizer === 'P' && inventory.fertilizerP <= 0) ||
                        (selectedFertilizer === 'K' && inventory.fertilizerK <= 0) ||
                        plot.fertilizerLevel >= 90
                      }
                      className="w-full cursor-pointer bg-purple-700 hover:bg-purple-800 text-white font-black text-xs py-2.5 rounded-xl border border-purple-900 shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FlaskConical className="w-4 h-4" />
                      <span>ใส่ปุ๋ย {selectedFertilizer} ที่เลือก</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
