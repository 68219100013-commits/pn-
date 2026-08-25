import React from 'react';
import { HeroStats, InGameTime, Inventory, WeatherState, WeatherType } from '../types';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Coins, Droplets, FlaskConical, HelpCircle, Heart, Zap, Sparkles, MapPin } from 'lucide-react';
import { WORLD_LOCATIONS } from '../data/gameData';
import { WeatherWidget } from './WeatherWidget';

interface HeaderProps {
  stats?: HeroStats;
  hero?: HeroStats;
  inventory: Inventory;
  weather?: WeatherState;
  time?: InGameTime;
  onSetWeather?: (type: WeatherType) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenWorldMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats: propStats,
  hero: propHero,
  inventory,
  weather,
  time,
  onSetWeather,
  isMuted,
  onToggleMute,
  onOpenHelp,
  onOpenWorldMap,
}) => {
  const stats = propHero || propStats || {
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    atk: 15,
    def: 5,
    title: 'นักผจญภัยฝึกหัด',
    coins: 50,
    manaCrystals: 5,
    playerName: 'เรย์',
    campLevel: 1,
    totalDungeonsCleared: 0,
    totalPotionsBrewed: 0,
    totalHarvests: 0,
    currentLocationId: 'oasis_village',
  };

  const expPercent = Math.min(100, Math.round((stats.exp / stats.maxExp) * 100));
  const hpPercent = Math.min(100, Math.max(0, Math.round((stats.hp / stats.maxHp) * 100)));
  const totalPotions = Object.values(inventory.potions).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
  const currentLocation = WORLD_LOCATIONS[stats.currentLocationId] || WORLD_LOCATIONS['oasis_village'];

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-stone-900 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Left: Player Avatar, Level & HP/Stamina Bars */}
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 flex items-center justify-center text-xl text-white font-black border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)]">
              🧙‍♂️
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 font-black text-[10px] px-1 py-0.2 rounded-lg border-2 border-stone-900 shadow-2xs font-mono">
              Lv.{stats.level}
            </span>
          </div>

          <div className="flex flex-col min-w-[120px] sm:min-w-[170px]">
            {/* Title & Name */}
            <div className="flex items-center justify-between text-[11px] font-black text-stone-900 leading-tight">
              <span className="truncate max-w-[90px] sm:max-w-[110px]">{stats.playerName}</span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded-md border border-amber-300 truncate max-w-[80px]">
                {stats.title}
              </span>
            </div>

            {/* HP Bar */}
            <div className="mt-1 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-600 fill-rose-500 shrink-0" />
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden border border-rose-300 relative">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-rose-950 font-mono shrink-0">
                {stats.hp}/{stats.maxHp}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="mt-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-300">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
              <span className="text-[8px] font-bold text-stone-500 font-mono shrink-0">
                {expPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Center: Location Pill & Resources & Weather */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Weather Widget Compact */}
          {weather && time && (
            <WeatherWidget
              compact
              weather={weather}
              time={time}
              onSetWeather={onSetWeather}
            />
          )}

          {/* Location button */}
          <button
            onClick={() => {
              sounds.playPop();
              if (onOpenWorldMap) onOpenWorldMap();
            }}
            className="cursor-pointer flex items-center gap-1 bg-stone-100 hover:bg-stone-200 border-2 border-stone-900 px-2 py-1 rounded-xl text-[11px] font-black text-stone-900 shadow-xs transition-all"
            title="คลิกเพื่อเปิดแผนที่โลก"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline truncate max-w-[120px]">{currentLocation.thaiName}</span>
            <span className="sm:hidden">{currentLocation.icon}</span>
          </button>

          {/* Gold */}
          <div
            id="resource-coins"
            className="flex items-center gap-1 bg-amber-50 border-2 border-stone-900 px-2 py-1 rounded-xl text-xs font-black text-stone-900 shadow-xs"
            title="เหรียญทองสำหรับซื้อเมล็ดพันธุ์และอัปเกรด"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-mono">{stats.coins}</span>
          </div>

          {/* Mana Crystals */}
          <div
            id="resource-crystals"
            className="flex items-center gap-1 bg-indigo-50 border-2 border-stone-900 px-2 py-1 rounded-xl text-xs font-black text-indigo-950 shadow-xs"
            title="ผลึกมานาเวทมนตร์ (ดรอปจากมอนสเตอร์และดันเจี้ยน)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-400" />
            <span className="font-mono">{stats.manaCrystals}</span>
          </div>

          {/* Water */}
          <div
            id="resource-water"
            className="hidden md:flex items-center gap-1 bg-sky-50 border-2 border-stone-900 px-2 py-1 rounded-xl text-xs font-black text-sky-950 shadow-xs"
            title="น้ำสำหรับรดพืชเวทมนตร์"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-400" />
            <span className="font-mono">{inventory.waterBuckets}</span>
          </div>

          {/* Potions */}
          <div
            id="resource-potions"
            className="hidden sm:flex items-center gap-1 bg-purple-50 border-2 border-stone-900 px-2 py-1 rounded-xl text-xs font-black text-purple-950 shadow-xs"
            title="โพชั่นและระเบิดในกระเป๋า"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600 fill-purple-400" />
            <span className="font-mono">{totalPotions}</span>
          </div>
        </div>

        {/* Right: Sound & Help */}
        <div className="flex items-center gap-1">
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleMute();
              sounds.playPop();
            }}
            className="p-1.5 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 border-2 border-stone-900 shadow-2xs transition-colors cursor-pointer"
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
            className="p-1.5 rounded-xl text-stone-700 hover:bg-stone-100 active:bg-stone-200 border-2 border-stone-900 shadow-2xs transition-colors cursor-pointer"
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
