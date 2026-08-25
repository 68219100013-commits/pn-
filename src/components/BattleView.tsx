import React, { useState, useEffect, useRef } from 'react';
import { HeroStats, Inventory, Monster } from '../types';
import { MONSTERS_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Swords, Zap, Heart, Sparkles, Shield, ArrowLeft, RotateCcw, Award, Flame, Droplets, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

interface BattleViewProps {
  monsterId: string;
  hero: HeroStats;
  inventory: Inventory;
  onUpdateHeroHp: (hp: number) => void;
  onVictoryRewards: (rewards: {
    exp: number;
    gold: number;
    crystals: number;
    materials: Partial<Inventory['materials']>;
    seeds: Record<string, number>;
  }) => void;
  onUsePotion: (potionType: keyof Inventory['potions']) => void;
  onBackToMap: () => void;
  onOpenCampToHeal: () => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  monsterId,
  hero,
  inventory,
  onUpdateHeroHp,
  onVictoryRewards,
  onUsePotion,
  onBackToMap,
  onOpenCampToHeal,
}) => {
  const monsterData = MONSTERS_DATA[monsterId] || MONSTERS_DATA['forest_slime'];

  // Battle state
  const [monsterHp, setMonsterHp] = useState(monsterData.maxHp);
  const [heroHp, setHeroHp] = useState(hero.hp);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleState, setBattleState] = useState<'intro' | 'fighting' | 'quiz' | 'victory' | 'defeat'>('fighting');
  const [battleLog, setBattleLog] = useState<string[]>([
    `⚔️ เผชิญหน้ากับ ${monsterData.name}! (ธาตุ: ${monsterData.element})`,
  ]);
  const [damagePopup, setDamagePopup] = useState<{ target: 'monster' | 'hero'; amount: number; isCrit: boolean } | null>(null);
  const [monsterAnimation, setMonsterAnimation] = useState<'idle' | 'hurt' | 'attack'>('idle');
  const [heroAnimation, setHeroAnimation] = useState<'idle' | 'hurt' | 'attack'>('idle');

  // Timing Attack bar oscillation state
  const [timingPosition, setTimingPosition] = useState(50); // 0 to 100
  const [timingDirection, setTimingDirection] = useState<'right' | 'left'>('right');
  const timingIntervalRef = useRef<number | null>(null);

  // Sync internal heroHp with prop
  useEffect(() => {
    setHeroHp(hero.hp);
  }, [hero.hp]);

  // Oscillating timing meter
  useEffect(() => {
    if (battleState !== 'fighting' || !isPlayerTurn) {
      if (timingIntervalRef.current) clearInterval(timingIntervalRef.current);
      return;
    }

    timingIntervalRef.current = window.setInterval(() => {
      setTimingPosition((prev) => {
        if (prev >= 96) {
          setTimingDirection('left');
          return 95;
        }
        if (prev <= 4) {
          setTimingDirection('right');
          return 5;
        }
        return timingDirection === 'right' ? prev + 3 : prev - 3;
      });
    }, 25);

    return () => {
      if (timingIntervalRef.current) clearInterval(timingIntervalRef.current);
    };
  }, [battleState, isPlayerTurn, timingDirection]);

  // Execute Timing Strike
  const handleTimingStrike = () => {
    if (!isPlayerTurn || battleState !== 'fighting') return;

    // Center is 50. Distance from center determines accuracy
    const distFromCenter = Math.abs(timingPosition - 50);
    let multiplier = 1.0;
    let hitType = 'Normal Hit';
    let isCrit = false;

    if (distFromCenter <= 6) {
      multiplier = 2.5;
      hitType = '💥 CRITICAL HIT!';
      isCrit = true;
      sounds.playCriticalHit();
    } else if (distFromCenter <= 16) {
      multiplier = 1.5;
      hitType = '✨ Great Hit!';
      sounds.playSlash();
    } else if (distFromCenter <= 32) {
      multiplier = 1.0;
      hitType = '⚔️ Normal Hit';
      sounds.playSlash();
    } else {
      multiplier = 0.5;
      hitType = '💨 Glancing Hit';
      sounds.playPop();
    }

    const baseDmg = hero.atk + Math.floor(Math.random() * 6);
    const totalDmg = Math.max(8, Math.round(baseDmg * multiplier - monsterData.def * 0.4));

    // Show animations
    setHeroAnimation('attack');
    setTimeout(() => setHeroAnimation('idle'), 300);

    setMonsterAnimation('hurt');
    setTimeout(() => setMonsterAnimation('idle'), 400);

    setDamagePopup({ target: 'monster', amount: totalDmg, isCrit });
    setTimeout(() => setDamagePopup(null), 800);

    const nextMonsterHp = Math.max(0, monsterHp - totalDmg);
    setMonsterHp(nextMonsterHp);
    setBattleLog((prev) => [
      `🗡️ ${hero.playerName} โจมตีจังหวะ [${hitType}] ทำความเสียหาย ${totalDmg} DMG!`,
      ...prev.slice(0, 4),
    ]);

    if (nextMonsterHp <= 0) {
      handleVictory();
      return;
    }

    // End player turn -> Trigger enemy turn
    setIsPlayerTurn(false);
    setTimeout(handleEnemyTurn, 1000);
  };

  // Answer Quiz Academic Strike
  const handleAnswerQuiz = (selectedIndex: number) => {
    const isCorrect = selectedIndex === monsterData.scienceQuiz.correctIndex;

    if (isCorrect) {
      sounds.playCriticalHit();
      sounds.playMagicCast();

      const elementalDmg = Math.round(hero.atk * 3.0 + 30);
      setHeroAnimation('attack');
      setMonsterAnimation('hurt');
      setTimeout(() => {
        setHeroAnimation('idle');
        setMonsterAnimation('idle');
      }, 400);

      setDamagePopup({ target: 'monster', amount: elementalDmg, isCrit: true });
      setTimeout(() => setDamagePopup(null), 800);

      const nextMonsterHp = Math.max(0, monsterHp - elementalDmg);
      setMonsterHp(nextMonsterHp);
      setBattleLog((prev) => [
        `🧠 ตอบถูก! ร่ายเวทวิทยาศาสตร์ธาตุแพ้ทางใส่ ${monsterData.name} รุนแรง ${elementalDmg} DMG!`,
        ...prev.slice(0, 4),
      ]);

      setBattleState('fighting');

      if (nextMonsterHp <= 0) {
        handleVictory();
        return;
      }

      setIsPlayerTurn(false);
      setTimeout(handleEnemyTurn, 1000);
    } else {
      sounds.playWrong();
      setBattleLog((prev) => [
        `❌ คำตอบยังไม่ถูกต้อง! การร่ายเวทล้มเหลว`,
        ...prev.slice(0, 4),
      ]);
      setBattleState('fighting');
      setIsPlayerTurn(false);
      setTimeout(handleEnemyTurn, 1000);
    }
  };

  // Enemy Turn
  const handleEnemyTurn = () => {
    const enemyDmg = Math.max(5, monsterData.atk - Math.floor(hero.def * 0.5) + Math.floor(Math.random() * 4));

    setMonsterAnimation('attack');
    setTimeout(() => setMonsterAnimation('idle'), 350);

    setHeroAnimation('hurt');
    setTimeout(() => setHeroAnimation('idle'), 400);

    sounds.playSlash();
    setDamagePopup({ target: 'hero', amount: enemyDmg, isCrit: false });
    setTimeout(() => setDamagePopup(null), 800);

    const nextHeroHp = Math.max(0, heroHp - enemyDmg);
    setHeroHp(nextHeroHp);
    onUpdateHeroHp(nextHeroHp);

    setBattleLog((prev) => [
      `💥 ${monsterData.name} โจมตีกลับ ทำความเสียหาย ${enemyDmg} DMG!`,
      ...prev.slice(0, 4),
    ]);

    if (nextHeroHp <= 0) {
      sounds.playWrong();
      setBattleState('defeat');
      return;
    }

    setIsPlayerTurn(true);
  };

  // Item Use in Battle
  const handleUseItem = (type: keyof Inventory['potions']) => {
    if (inventory.potions[type] <= 0 || !isPlayerTurn) return;

    if (type === 'hp_small' || type === 'hp_large') {
      const healAmount = type === 'hp_small' ? 80 : 250;
      const nextHp = Math.min(hero.maxHp, heroHp + healAmount);
      setHeroHp(nextHp);
      onUpdateHeroHp(nextHp);
      sounds.playHeal();
      onUsePotion(type);
      setBattleLog((prev) => [
        `💖 ดื่มยาฟื้นฟู HP +${healAmount} หน่วย!`,
        ...prev.slice(0, 4),
      ]);
    } else if (type === 'fire_bomb' || type === 'water_splash') {
      const bombDmg = type === 'fire_bomb' ? 150 : 180;
      sounds.playCriticalHit();
      onUsePotion(type);

      const nextMonsterHp = Math.max(0, monsterHp - bombDmg);
      setMonsterHp(nextMonsterHp);
      setDamagePopup({ target: 'monster', amount: bombDmg, isCrit: true });
      setTimeout(() => setDamagePopup(null), 800);

      setBattleLog((prev) => [
        `💣 ขว้างระเบิดธาตุใส่ ${monsterData.name} ทำดาเมจ ${bombDmg} DMG!`,
        ...prev.slice(0, 4),
      ]);

      if (nextMonsterHp <= 0) {
        handleVictory();
        return;
      }
    } else if (type === 'antidote') {
      sounds.playHeal();
      onUsePotion(type);
      setBattleLog((prev) => [
        `🌿 ใช้ยาถอนพิษชีวภาพ ฟื้นฟูร่างกาย!`,
        ...prev.slice(0, 4),
      ]);
    }

    setIsPlayerTurn(false);
    setTimeout(handleEnemyTurn, 900);
  };

  // Victory
  const handleVictory = () => {
    sounds.playLevelUp();
    sounds.playChestOpen();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    setBattleState('victory');

    // Calculate dropped materials & seeds
    const materialsReward: Partial<Inventory['materials']> = {};
    monsterData.dropMaterials.forEach((drop) => {
      if (Math.random() <= drop.chance) {
        materialsReward[drop.material] = (materialsReward[drop.material] || 0) + drop.count;
      }
    });

    const seedsReward: Record<string, number> = {};
    if (monsterData.dropSeeds) {
      monsterData.dropSeeds.forEach((seed) => {
        seedsReward[seed.cropId] = (seedsReward[seed.cropId] || 0) + seed.count;
      });
    }

    onVictoryRewards({
      exp: monsterData.expReward,
      gold: monsterData.goldReward,
      crystals: monsterData.crystalReward,
      materials: materialsReward,
      seeds: seedsReward,
    });
  };

  const monsterHpPercent = Math.max(0, Math.round((monsterHp / monsterData.maxHp) * 100));
  const heroHpPercent = Math.max(0, Math.round((heroHp / hero.maxHp) * 100));

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-rose-800 via-stone-900 to-rose-950 p-4 rounded-3xl border-2 border-stone-900 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playPop();
            onBackToMap();
          }}
          className="cursor-pointer flex items-center gap-1 text-xs font-black bg-white text-stone-950 px-3 py-1.5 rounded-xl border border-stone-900 hover:bg-stone-100 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>หนีกลับแผนที่</span>
        </button>

        <div className="text-center">
          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight flex items-center justify-center gap-1.5">
            <Swords className="w-5 h-5 text-rose-400" />
            สมรภูมิการต่อสู้มอนสเตอร์
          </h3>
        </div>

        <span className="bg-amber-400 text-stone-950 font-black text-xs px-2.5 py-1 rounded-xl border border-stone-900 shadow-xs font-mono">
          Lv.{monsterData.level}
        </span>
      </div>

      {/* Battle Stage Arena */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-800 rounded-3xl border-2 border-stone-900 p-5 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Arena Characters Row */}
        <div className="grid grid-cols-2 gap-4 items-center justify-items-center py-4 relative z-10">
          {/* Hero Avatar & HP */}
          <div className="flex flex-col items-center space-y-2 text-center w-full max-w-[200px]">
            <div
              className={`text-5xl sm:text-6xl transition-transform duration-200 ${
                heroAnimation === 'attack' ? 'translate-x-4 scale-110' : heroAnimation === 'hurt' ? '-translate-x-2 opacity-60' : ''
              }`}
            >
              🧙‍♂️
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between text-[11px] font-black text-stone-300">
                <span className="truncate">{hero.playerName}</span>
                <span className="font-mono text-rose-400">{heroHp}/{hero.maxHp}</span>
              </div>
              <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden border border-stone-600 mt-0.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${heroHpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Monster Avatar & HP */}
          <div className="flex flex-col items-center space-y-2 text-center w-full max-w-[200px]">
            <div
              className={`text-5xl sm:text-6xl transition-transform duration-200 ${
                monsterAnimation === 'attack' ? '-translate-x-4 scale-110' : monsterAnimation === 'hurt' ? 'translate-x-2 opacity-60' : 'animate-bounce-slow'
              }`}
            >
              {monsterData.icon}
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between text-[11px] font-black text-stone-300">
                <span className="truncate">{monsterData.name.split(' (')[0]}</span>
                <span className="font-mono text-rose-400">{monsterHp}/{monsterData.maxHp}</span>
              </div>
              <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden border border-stone-600 mt-0.5">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${monsterHpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Damage Popups */}
        {damagePopup && (
          <div
            className={`absolute top-1/3 ${
              damagePopup.target === 'monster' ? 'right-1/4' : 'left-1/4'
            } -translate-y-4 font-black text-2xl animate-bounce drop-shadow-md z-20 ${
              damagePopup.isCrit ? 'text-amber-400 text-3xl' : 'text-rose-500'
            }`}
          >
            -{damagePopup.amount} DMG {damagePopup.isCrit ? '💥 CRIT!' : ''}
          </div>
        )}

        {/* Turn Status Indicator */}
        <div className="text-center pt-2 border-t border-stone-700/60 mt-2 flex items-center justify-center gap-2">
          <span
            className={`text-xs font-black px-3 py-1 rounded-full border border-stone-600 ${
              isPlayerTurn ? 'bg-emerald-500 text-stone-950' : 'bg-rose-500 text-white animate-pulse'
            }`}
          >
            {isPlayerTurn ? '👉 ตาของคุณ: เลือกการโจมตี' : '⏳ ศัตรูกำลังร่ายการโจมตี...'}
          </span>
        </div>
      </div>

      {/* Battle Controls Area */}
      {battleState === 'fighting' && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-4 sm:p-5 shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4">
          {/* 1. Timing Attack Meter Bar */}
          <div className="bg-stone-100 rounded-2xl border-2 border-stone-300 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-stone-900">
              <span className="flex items-center gap-1 uppercase">
                <Zap className="w-4 h-4 text-amber-500" />
                จังหวะโจมตี (Timing Attack Bar):
              </span>
              <span className="text-[11px] text-stone-500">กดให้ตรงโซน Critical สีเขียวตรงกลาง</span>
            </div>

            {/* Moving bar */}
            <div className="relative w-full h-8 bg-stone-300 rounded-xl overflow-hidden border-2 border-stone-900">
              {/* Hit zones */}
              <div className="absolute inset-0 flex">
                <div className="w-[30%] bg-stone-400 opacity-40" title="Glancing" />
                <div className="w-[15%] bg-amber-300 opacity-60" title="Normal" />
                <div className="w-[10%] bg-emerald-400 font-black text-[9px] flex items-center justify-center text-emerald-950 border-x-2 border-stone-900" title="CRITICAL">
                  CRIT
                </div>
                <div className="w-[15%] bg-amber-300 opacity-60" title="Normal" />
                <div className="w-[30%] bg-stone-400 opacity-40" title="Glancing" />
              </div>

              {/* Cursor */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-rose-600 border-2 border-white rounded-sm shadow-md transition-none"
                style={{ left: `${timingPosition}%`, transform: 'translateX(-50%)' }}
              />
            </div>

            {/* Big Strike Button */}
            <button
              onClick={handleTimingStrike}
              disabled={!isPlayerTurn}
              className="cursor-pointer w-full bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-50 text-white font-black text-sm py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Swords className="w-5 h-5 stroke-[2.5]" />
              <span>กดจังหวะฟาดฟัน (Strike!)</span>
            </button>
          </div>

          {/* 2. Academic Spell Attack & Potions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Academic Elemental Spell Trigger */}
            <button
              onClick={() => {
                sounds.playPop();
                setBattleState('quiz');
              }}
              disabled={!isPlayerTurn}
              className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white p-3 rounded-2xl border-2 border-stone-900 shadow-xs flex items-center gap-2.5 text-left transition-all active:scale-95"
            >
              <span className="text-3xl">🧠</span>
              <div>
                <span className="font-black text-xs block uppercase">ร่ายเวทวิทยาศาสตร์ธาตุ (3x DMG)</span>
                <span className="text-[10px] text-indigo-200 block">ตอบคำถามชีวภาพ/ธาตุเพื่อสร้างดาเมจมหาศาล</span>
              </div>
            </button>

            {/* Quick Potions in Battle */}
            <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-2.5 flex items-center justify-around gap-1.5">
              {/* HP Potion */}
              <button
                onClick={() => handleUseItem('hp_small')}
                disabled={inventory.potions.hp_small <= 0 || !isPlayerTurn}
                className="cursor-pointer flex flex-col items-center bg-white hover:bg-rose-50 disabled:opacity-40 p-1.5 rounded-xl border border-stone-300 text-xs font-black shadow-2xs transition-all active:scale-95"
                title="ฟื้นฟู HP +80"
              >
                <span className="text-xl">🧪</span>
                <span className="text-[9px] text-rose-700 font-bold">HP x{inventory.potions.hp_small}</span>
              </button>

              {/* Stamina / Large HP */}
              <button
                onClick={() => handleUseItem('hp_large')}
                disabled={inventory.potions.hp_large <= 0 || !isPlayerTurn}
                className="cursor-pointer flex flex-col items-center bg-white hover:bg-rose-50 disabled:opacity-40 p-1.5 rounded-xl border border-stone-300 text-xs font-black shadow-2xs transition-all active:scale-95"
                title="ฟื้นฟู HP +250"
              >
                <span className="text-xl">💖</span>
                <span className="text-[9px] text-rose-700 font-bold">Max x{inventory.potions.hp_large}</span>
              </button>

              {/* Fire Bomb */}
              <button
                onClick={() => handleUseItem('fire_bomb')}
                disabled={inventory.potions.fire_bomb <= 0 || !isPlayerTurn}
                className="cursor-pointer flex flex-col items-center bg-white hover:bg-amber-50 disabled:opacity-40 p-1.5 rounded-xl border border-stone-300 text-xs font-black shadow-2xs transition-all active:scale-95"
                title="ระเบิดเพลิง 150 DMG"
              >
                <span className="text-xl">💣</span>
                <span className="text-[9px] text-amber-700 font-bold">Bomb x{inventory.potions.fire_bomb}</span>
              </button>

              {/* Hydro Splash */}
              <button
                onClick={() => handleUseItem('water_splash')}
                disabled={inventory.potions.water_splash <= 0 || !isPlayerTurn}
                className="cursor-pointer flex flex-col items-center bg-white hover:bg-sky-50 disabled:opacity-40 p-1.5 rounded-xl border border-stone-300 text-xs font-black shadow-2xs transition-all active:scale-95"
                title="น้ำมนต์ 180 DMG"
              >
                <span className="text-xl">🌊</span>
                <span className="text-[9px] text-sky-700 font-bold">Hydro x{inventory.potions.water_splash}</span>
              </button>
            </div>
          </div>

          {/* Battle Logs */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-3 space-y-1 text-xs">
            <span className="font-black text-stone-900 block text-[11px] uppercase">บันทึกการต่อสู้ (Battle Log):</span>
            {battleLog.map((log, idx) => (
              <p key={idx} className={`text-[11px] ${idx === 0 ? 'font-black text-stone-950' : 'text-stone-500 font-medium'}`}>
                {log}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Academic Spell Quiz Modal View */}
      {battleState === 'quiz' && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-5 shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black bg-indigo-100 text-indigo-950 border border-indigo-300 px-3 py-1 rounded-full uppercase">
              🧪 คำถามคาถาธาตุแพ้ทาง (Weakness Strike)
            </span>
            <button
              onClick={() => setBattleState('fighting')}
              className="cursor-pointer text-xs font-bold text-stone-500 hover:text-stone-900"
            >
              ยกเลิก
            </button>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-300 p-4 rounded-2xl">
            <p className="text-sm sm:text-base font-black text-stone-950 leading-relaxed">
              {monsterData.scienceQuiz.question}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {monsterData.scienceQuiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerQuiz(idx)}
                className="cursor-pointer p-3.5 rounded-2xl border-2 border-stone-300 hover:border-indigo-600 hover:bg-indigo-50 text-left text-xs sm:text-sm font-black text-stone-950 transition-all active:scale-95 shadow-xs"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Victory View */}
      {battleState === 'victory' && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-6 text-center shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              ชัยชนะ! คุณปราบ {monsterData.name} สำเร็จ!
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              ได้รับค่าประสบการณ์ เหรียญทอง ผลึกมานา และวัตถุดิบคราฟต์เข้ากระเป๋า
            </p>
          </div>

          {/* Rewards pill list */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 max-w-sm mx-auto space-y-2">
            <span className="font-black text-xs text-stone-950 uppercase block">ของรางวัลที่ได้รับ:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center">
                <span className="text-xl">✨</span>
                <span className="font-black text-emerald-800">+{monsterData.expReward}</span>
                <span className="text-[9px] text-stone-500 font-bold">EXP</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center">
                <span className="text-xl">🪙</span>
                <span className="font-black text-amber-700">+{monsterData.goldReward}</span>
                <span className="text-[9px] text-stone-500 font-bold">เหรียญทอง</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center">
                <span className="text-xl">💎</span>
                <span className="font-black text-indigo-700">+{monsterData.crystalReward}</span>
                <span className="text-[9px] text-stone-500 font-bold">ผลึกมานา</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sounds.playSlash();
                setMonsterHp(monsterData.maxHp);
                setBattleState('fighting');
                setIsPlayerTurn(true);
              }}
              className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-stone-900 shadow-xs active:scale-95 transition-all"
            >
              สู้ซ้ำอีกรอบ ⚔️
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onBackToMap();
              }}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all"
            >
              กลับสู่แผนที่โลก 🗺️
            </button>
          </div>
        </div>
      )}

      {/* Defeat View */}
      {battleState === 'defeat' && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-6 text-center shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 border-2 border-stone-900 text-rose-600 flex items-center justify-center text-3xl shadow-xs">
            💀
          </div>

          <div>
            <h4 className="font-black text-lg text-rose-950 uppercase tracking-tight">
              คุณหมดพลังในการต่อสู้!
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              กลับไปที่ค่ายพักเพื่อ "นอนพักผ่อน" ฟื้นฟู HP หรือดื่มยาโพชั่นก่อนออกผจญภัยใหม่
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sounds.playHeal();
                onOpenCampToHeal();
              }}
              className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs px-6 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all"
            >
              กลับไปพักผ่อนที่ค่าย 🏕️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
