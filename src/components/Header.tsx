import React from 'react';
import { PlayerStats, Inventory } from '../types';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Coins, Droplets, FlaskConical, HelpCircle, Sprout } from 'lucide-react';

interface HeaderProps {
  stats: PlayerStats;
  inventory: Inventory;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  inventory,
  isMuted,
  onToggleMute,
  onOpenHelp,
}) => {
  const expPercent = Math.min(100, Math.round((stats.exp / stats.maxExp) * 100));
  const totalSeeds = Object.values(inventory.seeds).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
  const totalFertilizers =
    inventory.fertilizerOrganic +
    inventory.fertilizerN +
    inventory.fertilizerP +
    inventory.fertilizerK;

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-stone-900/15 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Player Avatar & Level */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 flex items-center justify-center text-xl text-white font-black border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)]">
              🧑‍🌾
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 font-black text-[11px] px-1.5 py-0.5 rounded-lg border-2 border-stone-900 shadow-xs tracking-tighter">
              Lv.{stats.level}
            </span>
          </div>

          <div className="flex flex-col min-w-[110px] sm:min-w-[140px]">
            <div className="flex items-center justify-between text-xs font-black text-stone-900">
              <span className="truncate max-w-[90px] uppercase tracking-wide">{stats.playerName}</span>
              <span className="text-[11px] text-emerald-800 font-black font-mono">
                {stats.exp}/{stats.maxExp} EXP
              </span>
            </div>
            {/* Level Progress Bar */}
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-1 border border-stone-900/20">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Resources Quick Pill Counters */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Coins */}
          <div
            id="resource-coins"
            className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-400/80 px-2.5 py-1 rounded-xl text-xs font-black text-stone-900 shadow-xs"
            title="เหรียญทองสำหรับซื้อเมล็ดพันธุ์"
          >
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-mono tracking-tight">{stats.coins.toLocaleString()}</span>
          </div>

          {/* Water */}
          <div
            id="resource-water"
            className="flex items-center gap-1.5 bg-sky-50 border-2 border-sky-300 px-2.5 py-1 rounded-xl text-xs font-black text-sky-950 shadow-xs"
            title="น้ำสำหรับรดพืช (เล่นมินิเกมเพื่อเติมน้ำ)"
          >
            <Droplets className="w-4 h-4 text-sky-600 fill-sky-400" />
            <span className="font-mono tracking-tight">{inventory.waterBuckets} ถัง</span>
          </div>

          {/* Fertilizer */}
          <div
            id="resource-fertilizer"
            className="hidden sm:flex items-center gap-1.5 bg-purple-50 border-2 border-purple-300 px-2.5 py-1 rounded-xl text-xs font-black text-purple-950 shadow-xs"
            title="ปุ๋ยบำรุงพืช"
          >
            <FlaskConical className="w-4 h-4 text-purple-600 fill-purple-400" />
            <span className="font-mono tracking-tight">{totalFertilizers} ซอง</span>
          </div>

          {/* Seeds */}
          <div
            id="resource-seeds"
            className="hidden md:flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-300 px-2.5 py-1 rounded-xl text-xs font-black text-emerald-950 shadow-xs"
            title="เมล็ดพันธุ์พร้อมปลูก"
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-mono tracking-tight">{totalSeeds} ซอง</span>
          </div>
        </div>

        {/* Right: Sound Toggle & Help */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleMute();
              sounds.playPop();
            }}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          <button
            id="btn-open-help"
            onClick={() => {
              sounds.playPop();
              onOpenHelp();
            }}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
            title="คู่มือวิธีการเล่น"
            aria-label="Help Guide"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
