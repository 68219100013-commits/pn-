import React from 'react';
import { CROPS_DATA } from '../data/gameData';
import { Inventory, HeroStats } from '../types';
import { sounds } from '../utils/audio';
import { ShoppingBag, Coins, Sparkles, Sprout, ArrowDownRight, ArrowUpRight, Lock, Heart, FlaskConical } from 'lucide-react';

interface ShopViewProps {
  stats: HeroStats;
  inventory: Inventory;
  onBuySeed: (cropId: string, count: number, totalCost: number) => void;
  onSellHarvest: (cropId: string, count: number, totalEarnings: number) => void;
  onBuyWater: (count: number, cost: number) => void;
  onBuyFertilizer: (type: 'organic' | 'N' | 'P' | 'K', cost: number) => void;
  onBuyPotion?: (potionType: keyof Inventory['potions'], cost: number) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  stats,
  inventory,
  onBuySeed,
  onSellHarvest,
  onBuyWater,
  onBuyFertilizer,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-amber-500 border-2 border-stone-900 rounded-3xl p-5 text-stone-950 shadow-[0_4px_0_0_rgba(28,25,23,1)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏪</span>
            <h2 className="font-black text-lg sm:text-xl tracking-tight uppercase">ร้านค้าสหกรณ์การเกษตร</h2>
          </div>
          <p className="text-xs font-bold text-stone-900 mt-1">
            ซื้อเมล็ดพันธุ์คุณภาพดี และนำผลผลิตที่เก็บเกี่ยวมาขายเพื่อสะสมเหรียญทอง
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border-2 border-stone-900 px-3.5 py-1.5 rounded-2xl text-stone-950 font-black text-sm shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-mono">{stats.coins.toLocaleString()} 🪙</span>
        </div>
      </div>

      {/* Section 1: Sell Harvested Crops */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center gap-2 uppercase tracking-wide">
            <ArrowUpRight className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
            ขายผลผลิตในคลัง (Sell Harvest)
          </h3>
          <span className="text-xs text-stone-700 font-black font-mono">
            มีผลผลิตรอขาย {Object.values(inventory.harvested).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} ชิ้น
          </span>
        </div>

        {Object.values(inventory.harvested).reduce((a: number, b: number) => a + (Number(b) || 0), 0) === 0 ? (
          <div className="bg-stone-50 p-4 rounded-2xl text-center text-xs text-stone-600 font-bold border-2 border-dashed border-stone-200">
            ยังไม่มีผลผลิตในคลัง ปลูกและดูแลพืชในแปลงจนครบ 4 ระยะแล้วเก็บเกี่ยวมาขายที่นี่! 🌾
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {Object.entries(inventory.harvested).map(([cropId, rawCount]) => {
              const count = Number(rawCount) || 0;
              if (count <= 0) return null;
              const crop = CROPS_DATA[cropId];
              if (!crop) return null;

              return (
                <div
                  key={cropId}
                  className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <div className="font-black text-xs text-stone-950">{crop.name}</div>
                      <div className="text-[10px] text-stone-600 font-bold font-mono">
                        มี {count} ชิ้น (ชิ้นละ {crop.sellPrice} 🪙)
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playCoin();
                      onSellHarvest(cropId, count, crop.sellPrice * count);
                    }}
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl border border-emerald-800 shadow-xs active:scale-95 transition-all"
                  >
                    ขายทั้งหมด (+{crop.sellPrice * count} 🪙)
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Buy Seeds */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center gap-2 uppercase tracking-wide">
            <Sprout className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
            ซื้อเมล็ดพันธุ์ (Buy Seeds)
          </h3>
          <span className="text-xs text-stone-700 font-black">เลเวลผู้เล่น: Lv.{stats.level}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(CROPS_DATA).map((crop) => {
            const isLocked = stats.level < crop.unlockLevel;
            const seedCount = inventory.seeds[crop.id] || 0;
            const canAfford = stats.coins >= crop.seedPrice;

            return (
              <div
                key={crop.id}
                className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between gap-2.5 transition-all ${
                  isLocked
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white border-stone-900/20 hover:border-emerald-600 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl p-1 rounded-xl bg-emerald-50 border border-emerald-200">{crop.icon}</span>
                      <div>
                        <div className="font-black text-xs sm:text-sm text-stone-950">{crop.name}</div>
                        <div className="text-[10px] text-stone-600 font-bold font-mono">
                          โต {crop.growthDurationSeconds}s | ขายได้ {crop.sellPrice} 🪙
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] font-bold text-stone-700 bg-stone-100 p-1.5 rounded-lg border border-stone-200">
                    🌱 ในคลังมี: <strong className="text-stone-950">{seedCount}</strong> ซอง | +{crop.expReward} EXP
                  </div>
                </div>

                {isLocked ? (
                  <div className="text-center py-1.5 text-[11px] font-black text-rose-600 flex items-center justify-center gap-1 bg-rose-50 border border-rose-200 rounded-xl">
                    <Lock className="w-3.5 h-3.5" />
                    <span>ปลดล็อกที่เลเวล {crop.unlockLevel}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sounds.playCoin();
                        onBuySeed(crop.id, 1, crop.seedPrice);
                      }}
                      disabled={!canAfford}
                      className="flex-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs py-2 rounded-xl border border-emerald-800 shadow-xs transition-all active:scale-95 text-center"
                    >
                      ซื้อ 1 ซอง ({crop.seedPrice} 🪙)
                    </button>
                    <button
                      onClick={() => {
                        sounds.playCoin();
                        onBuySeed(crop.id, 5, crop.seedPrice * 5);
                      }}
                      disabled={stats.coins < crop.seedPrice * 5}
                      className="cursor-pointer bg-emerald-100 hover:bg-emerald-200 disabled:opacity-40 text-emerald-950 font-black text-xs px-2.5 py-2 rounded-xl border border-emerald-300 transition-all"
                      title="ซื้อชุด 5 ซอง"
                    >
                      x5
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Essential Farm Supplies */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900/15 shadow-sm space-y-3">
        <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center gap-2 uppercase tracking-wide">
          <ShoppingBag className="w-5 h-5 text-purple-700 stroke-[2.5]" />
          อุปกรณ์และทรัพยากรเสริม (Supplies)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Water Pack */}
          <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">💧</span>
              <div>
                <div className="font-black text-xs sm:text-sm text-sky-950">ชุดน้ำรดแปลง x5 ถัง</div>
                <div className="text-[10px] font-bold text-sky-800">เติมน้ำสำรองทันใจโดยไม่ต้องเล่นมินิเกม</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playCoin();
                onBuyWater(5, 15);
              }}
              disabled={stats.coins < 15}
              className="cursor-pointer bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-black text-xs px-3.5 py-2 rounded-xl border border-sky-800 shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              ซื้อ (15 🪙)
            </button>
          </div>

          {/* Organic Fertilizer Pack */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🧪</span>
              <div>
                <div className="font-black text-xs sm:text-sm text-purple-950">ปุ๋ยหมักอินทรีย์ x3 ถุง</div>
                <div className="text-[10px] font-bold text-purple-800">บำรุงดิน เร่งการเติบโตของพืชทุกชนิด</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playCoin();
                onBuyFertilizer('organic', 20);
              }}
              disabled={stats.coins < 20}
              className="cursor-pointer bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-black text-xs px-3.5 py-2 rounded-xl border border-purple-900 shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              ซื้อ (20 🪙)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
