import React from 'react';
import { HeroStats, WorldLocation } from '../types';
import { WORLD_LOCATIONS, MONSTERS_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';
import { MapPin, Swords, Shield, Lock, Sparkles, Navigation, Compass, ChevronRight } from 'lucide-react';

interface WorldMapViewProps {
  stats: HeroStats;
  onSelectLocation: (locId: string) => void;
  onStartBattle: (monsterId: string) => void;
  onEnterDungeon: (dungeonId: string) => void;
  onOpenQuests: () => void;
  onOpenCamp: () => void;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  stats,
  onSelectLocation,
  onStartBattle,
  onEnterDungeon,
  onOpenQuests,
  onOpenCamp,
}) => {
  const locations = Object.values(WORLD_LOCATIONS);
  const currentLoc = WORLD_LOCATIONS[stats.currentLocationId] || WORLD_LOCATIONS['oasis_village'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 rounded-3xl border-2 border-stone-900 p-5 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-lg border border-stone-900 shadow-2xs font-mono uppercase">
                🗺️ WORLD MAP
              </span>
              <span className="text-xs text-emerald-200 font-bold">
                ตำแหน่งปัจจุบัน: <strong className="text-white">{currentLoc.thaiName}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 uppercase tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
              แผนที่โลกแห่งพงไพรและอาณาจักรเวทมนตร์
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed">
              เลือกสถานที่เพื่อออกสำรวจ ต่อสู้กับมอนสเตอร์เพื่อฟาร์มวัตถุดิบคราฟต์ หรือท้าทายดันเจี้ยนปริศนาเพื่อค้นหาเมล็ดพันธุ์ในตำนาน!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playPop();
                onOpenQuests();
              }}
              className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs px-3.5 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>📜 เควสต์กิลด์</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                onOpenCamp();
              }}
              className="cursor-pointer bg-white hover:bg-stone-100 text-stone-950 font-black text-xs px-3.5 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>🏕️ กลับค่ายพัก</span>
            </button>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {locations.map((loc) => {
          const isCurrent = stats.currentLocationId === loc.id;
          const isUnlocked = stats.level >= loc.recommendedLevel;
          const locMonsters = loc.monsters.map((mId) => MONSTERS_DATA[mId]).filter(Boolean);

          return (
            <div
              key={loc.id}
              className={`rounded-3xl border-2 border-stone-900 overflow-hidden shadow-[0_4px_0_0_rgba(28,25,23,1)] transition-all bg-white flex flex-col justify-between ${
                isCurrent ? 'ring-4 ring-emerald-500/40' : ''
              }`}
            >
              {/* Card Header with background banner */}
              <div className={`p-4 bg-gradient-to-r ${loc.bannerBg} text-white border-b-2 border-stone-900 flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl filter drop-shadow">{loc.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-base uppercase tracking-tight">{loc.thaiName}</h3>
                      {isCurrent && (
                        <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-stone-900">
                          อยู่ที่นี่ 📍
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/80 font-bold">{loc.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-black px-2.5 py-1 rounded-xl border border-stone-900 shadow-2xs ${
                      isUnlocked ? 'bg-white text-stone-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isUnlocked ? `แนะนำ Lv.${loc.recommendedLevel}+` : `🔒 ต้องมี Lv.${loc.recommendedLevel}`}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs font-bold text-stone-600 leading-relaxed">
                  {loc.description}
                </p>

                {/* Monsters in Area */}
                {locMonsters.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-black text-stone-900 uppercase flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-rose-600" />
                      มอนสเตอร์ประจำพื้นที่:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {locMonsters.map((monster) => (
                        <div
                          key={monster.id}
                          className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-2xl">{monster.icon}</span>
                            <div className="truncate">
                              <span className="text-xs font-black text-stone-950 block truncate">
                                {monster.name.split(' (')[0]}
                              </span>
                              <span className="text-[10px] font-bold text-rose-700">
                                HP: {monster.maxHp} | ธาตุ: {monster.element}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              sounds.playSlash();
                              onSelectLocation(loc.id);
                              onStartBattle(monster.id);
                            }}
                            disabled={!isUnlocked}
                            className="cursor-pointer bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-[11px] px-3 py-1.5 rounded-xl border border-stone-900 shadow-2xs active:scale-95 transition-all shrink-0"
                          >
                            สู้ ⚔️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dungeon Feature */}
                {loc.hasDungeon && loc.dungeonId && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🗝️</span>
                      <div>
                        <span className="text-xs font-black text-stone-950 block">ดันเจี้ยนปริศนาถ้ำโบราณ</span>
                        <span className="text-[10px] font-bold text-amber-900">เข็นบล็อกรูน & ถอดรหัสชิงกล่องสมบัติ</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playPuzzleMove();
                        onSelectLocation(loc.id);
                        onEnterDungeon(loc.dungeonId!);
                      }}
                      disabled={!isUnlocked}
                      className="cursor-pointer bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-stone-900 shadow-2xs active:scale-95 transition-all shrink-0"
                    >
                      เข้าดันเจี้ยน 🏛️
                    </button>
                  </div>
                )}

                {/* Safe Village features */}
                {loc.id === 'oasis_village' && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <span className="text-xs font-black text-emerald-950 block">เขตปลอดภัย (Safe Sanctuary)</span>
                        <span className="text-[10px] font-bold text-emerald-800">ไม่มีมอนสเตอร์ เหมาะสำหรับพักผ่อน รับเควสต์ และซื้อขาย</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onSelectLocation(loc.id);
                        onOpenQuests();
                      }}
                      className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-1.5 rounded-xl border border-stone-900 shadow-2xs active:scale-95 transition-all shrink-0"
                    >
                      เข้าหมู่บ้าน 🏡
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
