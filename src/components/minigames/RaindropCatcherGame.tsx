import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { Droplets, Sparkles, ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RaindropCatcherGameProps {
  onBack: () => void;
  onReward: (water: number, coins: number, exp: number) => void;
}

interface Drop {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'water' | 'golden' | 'mud';
  size: number;
  emoji: string;
}

export const RaindropCatcherGame: React.FC<RaindropCatcherGameProps> = ({
  onBack,
  onReward,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [bucketPos, setBucketPos] = useState(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const dropIdCounter = useRef(0);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBucketPos((p) => Math.max(8, p - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBucketPos((p) => Math.min(92, p + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch / Mouse sliding handler
  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(8, Math.min(92, (x / rect.width) * 100));
    setBucketPos(percent);
  };

  const startGame = () => {
    sounds.playPop();
    setGameState('playing');
    setScore(0);
    setTimeLeft(25);
    setBucketPos(50);
    dropsRef.current = [];
    dropIdCounter.current = 0;
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastSpawn = Date.now();
    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerInterval);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const loop = () => {
      const now = Date.now();
      // Spawn new drop every 400ms
      if (now - lastSpawn > 450) {
        lastSpawn = now;
        const rand = Math.random();
        const type: 'water' | 'golden' | 'mud' =
          rand > 0.85 ? 'golden' : rand > 0.25 ? 'water' : 'mud';

        dropsRef.current.push({
          id: ++dropIdCounter.current,
          x: Math.random() * 84 + 8, // 8% to 92%
          y: -10,
          speed: 1.2 + Math.random() * 1.6,
          type,
          size: type === 'golden' ? 32 : 28,
          emoji: type === 'golden' ? '⭐' : type === 'water' ? '💧' : '🪨'
        });
      }

      // Update positions & check collisions
      const nextDrops: Drop[] = [];
      for (const drop of dropsRef.current) {
        drop.y += drop.speed;

        // Collision with bucket near bottom (y between 80% and 92%)
        if (drop.y >= 78 && drop.y <= 90) {
          const dist = Math.abs(drop.x - bucketPos);
          if (dist < 12) {
            // Caught!
            if (drop.type === 'water') {
              sounds.playWater();
              setScore((s) => s + 10);
            } else if (drop.type === 'golden') {
              sounds.playCoin();
              setScore((s) => s + 30);
            } else {
              sounds.playWrong();
              setScore((s) => Math.max(0, s - 15));
            }
            continue; // don't add to next drops
          }
        }

        // Drop out of screen
        if (drop.y < 100) {
          nextDrops.push(drop);
        }
      }

      dropsRef.current = nextDrops;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(timerInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, bucketPos]);

  const endGame = () => {
    setGameState('gameover');
    sounds.playLevelUp();
    confetti({ particleCount: 40, spread: 60 });
  };

  const calculateRewards = () => {
    const waterEarned = Math.max(2, Math.min(8, Math.floor(score / 25) + 2));
    const coinsEarned = Math.floor(score / 5) + 10;
    const expEarned = Math.floor(score / 4) + 15;
    return { waterEarned, coinsEarned, expEarned };
  };

  const { waterEarned, coinsEarned, expEarned } = calculateRewards();

  const handleClaim = () => {
    sounds.playHarvest();
    onReward(waterEarned, coinsEarned, expEarned);
    onBack();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-900 overflow-hidden shadow-[0_4px_0_0_rgba(28,25,23,1)] max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-sky-600 p-4 border-b-2 border-stone-900 text-white flex items-center justify-between">
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
            <Droplets className="w-5 h-5 text-sky-200 fill-sky-200" />
            เกมจับหยดน้ำสายฝน
          </h3>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="bg-white text-stone-950 border border-stone-900 px-2.5 py-1 rounded-xl shadow-xs font-mono">⏳ {timeLeft}วิ</span>
            <span className="bg-amber-400 text-stone-950 border border-stone-900 px-2.5 py-1 rounded-xl shadow-xs font-mono">
              คะแนน: {score}
            </span>
          </div>
        )}
        {gameState !== 'playing' && <div className="w-16" />}
      </div>

      {/* Screen 1: Intro */}
      {gameState === 'intro' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-100 border-2 border-stone-900 flex items-center justify-center text-4xl shadow-xs animate-pulse">
            🪣
          </div>
          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">กักเก็บน้ำฝนบริสุทธิ์เพื่อแปลงเกษตร</h4>
            <p className="text-xs font-bold text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
              ลากถังน้ำไปทางซ้ายหรือขวาเพื่อรับหยดน้ำ 💧 (+10) และดาวทอง ⭐ (+30) ระวังก้อนหิน 🪨 (-15)!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-xs bg-sky-50 p-3 rounded-2xl border-2 border-sky-300">
            <div className="flex flex-col items-center">
              <span className="text-2xl">💧</span>
              <span className="font-black text-sky-950">+10 แต้ม</span>
              <span className="text-[10px] text-stone-500 font-bold">หยดน้ำฝน</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">⭐</span>
              <span className="font-black text-amber-700">+30 แต้ม</span>
              <span className="text-[10px] text-stone-500 font-bold">น้ำแร่พิเศษ</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🪨</span>
              <span className="font-black text-rose-700">-15 แต้ม</span>
              <span className="text-[10px] text-stone-500 font-bold">ก้อนกรวด</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-black text-sm px-8 py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all"
          >
            เริ่มเล่นมินิเกมเลย! 🎮
          </button>
        </div>
      )}

      {/* Screen 2: Active Playing Canvas / Area */}
      {gameState === 'playing' && (
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 overflow-hidden cursor-ew-resize select-none touch-none border-b-2 border-stone-900"
        >
          {/* Clouds */}
          <div className="absolute top-2 left-6 text-3xl opacity-80">☁️</div>
          <div className="absolute top-4 right-10 text-4xl opacity-70">☁️</div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl opacity-60">☁️</div>

          {/* Falling Drops */}
          {dropsRef.current.map((drop) => (
            <div
              key={drop.id}
              className="absolute -translate-x-1/2 select-none text-2xl pointer-events-none transition-transform"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
              }}
            >
              {drop.emoji}
            </div>
          ))}

          {/* Player Bucket */}
          <div
            className="absolute bottom-4 -translate-x-1/2 transition-transform duration-75 flex flex-col items-center pointer-events-none"
            style={{ left: `${bucketPos}%` }}
          >
            <span className="text-4xl sm:text-5xl drop-shadow-md">🪣</span>
            <div className="w-12 h-2 bg-sky-600/30 rounded-full blur-xs mt-0.5" />
          </div>

          {/* Mobile touch hint */}
          <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-stone-700 font-bold pointer-events-none">
            แตะหรือเลื่อนนิ้วซ้าย-ขวาเพื่อขยับถังน้ำ
          </div>
        </div>
      )}

      {/* Screen 3: Game Over & Rewards */}
      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">เก่งมาก! ทำคะแนนได้ {score} แต้ม</h4>
            <p className="text-xs font-bold text-stone-600 mt-0.5">
              คุณกักเก็บน้ำฝนได้สำเร็จ ได้รับทรัพยากรสำหรับรดน้ำแปลงเกษตร
            </p>
          </div>

          {/* Rewards Card */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-300">
            <div className="flex flex-col items-center">
              <span className="text-2xl">💧</span>
              <span className="font-black text-sm text-sky-950">+{waterEarned} ถัง</span>
              <span className="text-[10px] text-stone-500 font-bold">น้ำสำหรับรด</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🪙</span>
              <span className="font-black text-sm text-amber-700">+{coinsEarned}</span>
              <span className="text-[10px] text-stone-500 font-bold">เหรียญทอง</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">✨</span>
              <span className="font-black text-sm text-emerald-700">+{expEarned}</span>
              <span className="text-[10px] text-stone-500 font-bold">EXP</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border-2 border-stone-900 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>เล่นอีกครั้ง</span>
            </button>

            <button
              onClick={handleClaim}
              className="cursor-pointer flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-2.5 rounded-xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>รับรางวัลและกลับฟาร์ม</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
