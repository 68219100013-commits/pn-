import React, { useState } from 'react';
import { AlchemyRecipe, HeroStats, Inventory } from '../types';
import { ALCHEMY_RECIPES, CROPS_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { FlaskConical, Sparkles, Flame, Droplets, Check, AlertCircle, Shield, Zap, Heart } from 'lucide-react';

interface AlchemyViewProps {
  hero: HeroStats;
  inventory: Inventory;
  onCraftRecipe: (recipe: AlchemyRecipe) => void;
}

export const AlchemyView: React.FC<AlchemyViewProps> = ({
  hero,
  inventory,
  onCraftRecipe,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<AlchemyRecipe>(ALCHEMY_RECIPES[0]);
  const [isBrewing, setIsBrewing] = useState(false);

  // Check if ingredients are sufficient
  const canCraft = (recipe: AlchemyRecipe) => {
    if (hero.level < recipe.requiresLevel) return false;

    // Check water
    if (recipe.ingredients.waterCost && inventory.waterBuckets < recipe.ingredients.waterCost) {
      return false;
    }

    // Check crops
    if (recipe.ingredients.crops) {
      for (const cropReq of recipe.ingredients.crops) {
        if ((inventory.harvested[cropReq.cropId] || 0) < cropReq.count) {
          return false;
        }
      }
    }

    // Check materials
    if (recipe.ingredients.materials) {
      for (const matReq of recipe.ingredients.materials) {
        if ((inventory.materials[matReq.material] || 0) < matReq.count) {
          return false;
        }
      }
    }

    return true;
  };

  const handleBrew = (recipe: AlchemyRecipe) => {
    if (!canCraft(recipe) || isBrewing) return;

    setIsBrewing(true);
    sounds.playPotionBrew();

    setTimeout(() => {
      onCraftRecipe(recipe);
      sounds.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setIsBrewing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-stone-900 rounded-3xl border-2 border-stone-900 p-5 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-lg border border-stone-900 shadow-2xs font-mono uppercase">
                🧪 ALCHEMY LAB
              </span>
              <span className="text-xs text-purple-200 font-bold">
                ห้องทดลองแปรธาตุและปรุงยาวิเศษ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 uppercase tracking-tight flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-purple-300 animate-pulse" />
              หม้อต้มปรุงยาและระเบิดธาตุชีวภาพ
            </h2>
            <p className="text-xs text-purple-100 max-w-xl mt-1 leading-relaxed">
              นำผลผลิตพืชเกษตรและวัตถุดิบจากมอนสเตอร์มาสกัดสารสำคัญเพื่อสร้างยาฟื้นฟู HP, ยาถอนพิษ และระเบิดธาตุสำหรับใช้ในการต่อสู้!
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-center shrink-0">
            <span className="text-[10px] text-purple-200 block font-bold uppercase">โพชั่นในกระเป๋า</span>
            <span className="text-lg font-black font-mono">
              {Object.values(inventory.potions).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} ขวด
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recipe List & Cauldron Workshop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Recipe List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-black text-sm text-stone-900 uppercase tracking-tight flex items-center gap-1.5">
            <span>📖</span> ตำราสูตรปรุงยาวิเศษ (Alchemy Recipes):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALCHEMY_RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              const craftable = canCraft(recipe);
              const isLocked = hero.level < recipe.requiresLevel;

              return (
                <div
                  key={recipe.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedRecipe(recipe);
                  }}
                  className={`cursor-pointer rounded-3xl p-4 border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-50 border-purple-600 shadow-[0_4px_0_0_rgba(147,51,234,1)] ring-2 ring-purple-400/40'
                      : 'bg-white border-stone-900 shadow-xs hover:border-purple-400'
                  } ${isLocked ? 'opacity-60 bg-stone-50' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl filter drop-shadow">{recipe.icon}</span>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-stone-950 truncate max-w-[140px]">
                          {recipe.name}
                        </h4>
                        <span className="text-[10px] text-purple-700 font-bold block">
                          {recipe.effectDescription}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-lg border font-mono ${
                        isLocked
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : craftable
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      {isLocked ? `Lv.${recipe.requiresLevel}` : craftable ? 'พร้อมปรุง ✨' : 'ขาดวัตถุดิบ'}
                    </span>
                  </div>

                  {/* Required ingredients preview */}
                  <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-bold">ได้ผลผลิต:</span>
                    <span className="font-black text-purple-950 font-mono">+{recipe.resultCount} ชิ้น</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Cauldron Workshop */}
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-5 shadow-[0_4px_0_0_rgba(28,25,23,1)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedRecipe.icon}</span>
                <div>
                  <h4 className="font-black text-sm text-stone-950 uppercase">{selectedRecipe.name}</h4>
                  <span className="text-[10px] text-purple-700 font-bold">{selectedRecipe.effectDescription}</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-stone-600 mt-3 leading-relaxed">
              {selectedRecipe.description}
            </p>

            {/* Ingredients Requirement Checklist */}
            <div className="bg-purple-50/60 border-2 border-purple-200 rounded-2xl p-3.5 mt-3 space-y-2">
              <span className="text-[11px] font-black text-purple-950 uppercase block">
                วัตถุดิบที่ต้องการ:
              </span>

              {/* Water requirement */}
              {selectedRecipe.ingredients.waterCost && (
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1 text-sky-950">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    น้ำสะอาด ({selectedRecipe.ingredients.waterCost} ถัง)
                  </span>
                  <span
                    className={`font-mono font-black ${
                      inventory.waterBuckets >= selectedRecipe.ingredients.waterCost
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {inventory.waterBuckets}/{selectedRecipe.ingredients.waterCost}
                  </span>
                </div>
              )}

              {/* Crop ingredients */}
              {selectedRecipe.ingredients.crops?.map((req) => {
                const cropInfo = CROPS_DATA[req.cropId];
                const owned = inventory.harvested[req.cropId] || 0;
                return (
                  <div key={req.cropId} className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1 text-stone-950">
                      <span>{cropInfo?.icon || '🌱'}</span>
                      {cropInfo?.name} ({req.count} ชิ้น)
                    </span>
                    <span
                      className={`font-mono font-black ${
                        owned >= req.count ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {owned}/{req.count}
                    </span>
                  </div>
                );
              })}

              {/* Materials */}
              {selectedRecipe.ingredients.materials?.map((req) => {
                const owned = inventory.materials[req.material] || 0;
                const matLabels: Record<string, string> = {
                  magic_wood: '🪵 ไม้เวทมนตร์',
                  runestone: '🪨 หินรูน',
                  monster_essence: '🧪 สารสกัดมอนสเตอร์',
                  star_dust: '✨ ละอองดวงดาว',
                  fire_core: '🔥 แกนเพลิง',
                  ancient_gear: '⚙️ กลไกโบราณ',
                };
                return (
                  <div key={req.material} className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-950">{matLabels[req.material] || req.material} ({req.count} ชิ้น)</span>
                    <span
                      className={`font-mono font-black ${
                        owned >= req.count ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {owned}/{req.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brew Button */}
          <button
            onClick={() => handleBrew(selectedRecipe)}
            disabled={!canCraft(selectedRecipe) || isBrewing}
            className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-sm py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-98 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBrewing ? 'กำลังเคี่ยวสกัดยา... 🫧' : 'เริ่มปรุงยาในหม้อต้ม'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
