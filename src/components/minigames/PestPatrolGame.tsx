import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { ArrowLeft, Bug, ShieldCheck, Sparkles, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PestPatrolGameProps {
  onBack: () => void;
  onReward: (reward: { pestSprays: number; exp: number; coins: number }) => void;
  onPestCleared: () => void;
}

interface HoleItem {
  id: number;
  type: 'pest' | 'ladybug' | null;
  emoji: string;
  points: number;
}

export const PestPatrolGame: React.FC<PestPatrolGameProps> = ({
  onBack,
  onReward,
  onPestCleared,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [holes, setHoles] = useState<HoleItem[]>([
    { id: 0, type: null, emoji: '', points: 0 },
    { id: 1, type: null, emoji: '', points: 0 },
    { id: 2, type: null, emoji: '', points: 0 },
    { id: 3, type: null, emoji: '', points: 0 },
    { id: 4, type: null, emoji: '', points: 0 },
    { id: 5, type: null, emoji: '', points: 0 },
  ]);
  const [score, setScore] = useState(0);
  const [pestsHit, setPestsHit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);

  const startGame = () => {
    sounds.playPop();
    setGameState('playing');
    setScore(0);
    setPestsHit(0);
    setTimeLeft(20);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Random popup interval
    const popupInterval = setInterval(() => {
      const randomHole = Math.floor(Math.random() * 6);
      const isLadybug = Math.random() > 0.7; // 30% friendly ladybug

      setHoles((prev) =>
        prev.map((h, i) => {
          if (i === randomHole) {
            return {
              id: i,
              type: isLadybug ? 'ladybug' : 'pest',
              emoji: isLadybug ? '🐞' : Math.random() > 0.5 ? '🐛' : '🦗',
              points: isLadybug ? -15 : 10
            };
          }
          return h;
        })
      );

      // Disappear after 1.1s
      setTimeout(() => {
        setHoles((prev) =>
          prev.map((h, i) => (i === randomHole ? { id: i, type: null, emoji: '', points: 0 } : h))
        );
      }, 1100);
    }, 700);

    return () => {
      clearInterval(timer);
      clearInterval(popupInterval);
    };
  }, [gameState]);

  const handleTapHole = (index: number) => {
    const item = holes[index];
    if (!item.type) return;

    if (item.type === 'pest') {
      sounds.playPop();
      setScore((s) => s + 10);
      setPestsHit((p) => p + 1);
      onPestCleared();
    } else {
      sounds.playWrong();
      setScore((s) => Math.max(0, s - 15));
    }

    // Hide tapped item
    setHoles((prev) =>
      prev.map((h, i) => (i === index ? { id: i, type: null, emoji: '', points: 0 } : h))
    );
  };

  const endGame = () => {
    setGameState('gameover');
    sounds.playLevelUp();
    confetti({ particleCount: 40, spread: 60 });
  };

  const calculateRewards = () => {
    const sprays = Math.max(1, Math.floor(pestsHit / 3) + 1);
    const exp = pestsHit * 15 + 20;
    const coins = pestsHit * 10 + 15;
    return { sprays, exp, coins };
  };

  const { sprays, exp, coins } = calculateRewards();

  const handleClaim = () => {
    sounds.playHarvest();
    onReward({
      pestSprays: sprays,
      exp,
      coins
    });
    onBack();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-900 overflow-hidden shadow-[0_4px_0_0_rgba(28,25,23,1)] max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-rose-600 p-4 border-b-2 border-stone-900 text-white flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-black bg-white text-stone-950 border border-stone-900 hover:bg-stone-100 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>ย้อนกลับ</span>
        </button>

        <div className="text-center">
          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight flex items-center justify-center gap-1.5">
            <Bug className="w-5 h-5 text-rose-200" />
            ผู้พิทักษ์แปลงผัก
          </h3>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="bg-white text-stone-950 border border-stone-900 px-2.5 py-1 rounded-xl shadow-xs font-mono">⏳ {timeLeft}วิ</span>
            <span className="bg-amber-400 text-stone-950 border border-stone-900 px-2.5 py-1 rounded-xl shadow-xs font-mono">
              แต้ม: {score}
            </span>
          </div>
        )}
        {gameState !== 'playing' && <div className="w-16" />}
      </div>

      {gameState === 'intro' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 border-2 border-stone-900 flex items-center justify-center text-4xl shadow-xs">
            🛡️
          </div>
          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">ปกป้องพืชผักด้วยการควบคุมทางชีวภาพ</h4>
            <p className="text-xs font-bold text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
              แตะจับหนอน 🐛 และตั๊กแตน 🦗 (+10 แต้ม) <strong>ห้ามแตะแมลงเต่าทอง 🐞</strong> (-15 แต้ม) เพราะเป็นแมลงตัวห้ำที่เป็นมิตร!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs bg-rose-50 p-3 rounded-2xl border-2 border-rose-300">
            <div className="flex flex-col items-center">
              <span className="text-2xl">🐛 🦗</span>
              <span className="font-black text-rose-950">แตะเพื่อจับ (+10)</span>
              <span className="text-[10px] text-stone-500 font-bold">ศัตรูพืชกัดกินใบ</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🐞</span>
              <span className="font-black text-emerald-800">ห้ามแตะ! (-15)</span>
              <span className="text-[10px] text-stone-500 font-bold">แมลงเต่าทองมิตรแท้</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-black text-sm px-8 py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all"
          >
            เริ่มลาดตระเวนแปลง 🎮
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="p-5 bg-gradient-to-b from-emerald-50 to-stone-100 border-b-2 border-stone-900">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
            {holes.map((hole, idx) => (
              <button
                key={idx}
                onClick={() => handleTapHole(idx)}
                className="cursor-pointer aspect-square rounded-3xl bg-amber-200 border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] flex items-center justify-center relative overflow-hidden active:translate-y-1 active:shadow-none transition-all"
              >
                {/* Hole Grass decor */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent pointer-events-none" />

                {hole.emoji ? (
                  <span className="text-4xl sm:text-5xl animate-bounce drop-shadow-md select-none">
                    {hole.emoji}
                  </span>
                ) : (
                  <span className="text-stone-400 text-xl opacity-30">🕳️</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              ภารกิจสำเร็จ! กำจัดศัตรูพืชได้ {pestsHit} ตัว (ได้ {score} แต้ม)
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              แปลงเกษตรปลอดภัยขึ้น! คุณได้รับสเปรย์สารชีวภาพสำหรับพ่นป้องกันแปลงผัก
            </p>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-300 max-w-sm mx-auto space-y-2">
            <span className="font-black text-xs text-stone-950 uppercase block">ของรางวัลผู้พิทักษ์:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🧴</span>
                <span className="font-black text-rose-800">+{sprays} ขวด</span>
                <span className="text-[9px] font-bold text-stone-500">สเปรย์ชีวภาพ</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🪙</span>
                <span className="font-black text-amber-700">+{coins}</span>
                <span className="text-[9px] font-bold text-stone-500">เหรียญทอง</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">✨</span>
                <span className="font-black text-emerald-700">+{exp}</span>
                <span className="text-[9px] font-bold text-stone-500">EXP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl border-2 border-stone-900 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>เล่นอีกครั้ง</span>
            </button>

            <button
              onClick={handleClaim}
              className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-6 py-2.5 rounded-xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] transition-all active:scale-95"
            >
              รับรางวัล 🧴
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
