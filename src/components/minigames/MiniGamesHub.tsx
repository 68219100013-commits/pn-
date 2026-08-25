import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { RaindropCatcherGame } from './RaindropCatcherGame';
import { ScienceQuizGame } from './ScienceQuizGame';
import { FertilizerMathGame } from './FertilizerMathGame';
import { PestPatrolGame } from './PestPatrolGame';
import { Droplets, BookOpen, FlaskConical, Bug, Sparkles, ArrowRight, Award } from 'lucide-react';

interface MiniGamesHubProps {
  onCollectWater: (water: number, coins: number, exp: number) => void;
  onQuizReward: (reward: { water: number; fertilizerN: number; fertilizerP: number; fertilizerK: number; exp: number; coins: number }) => void;
  onQuizCorrect: () => void;
  onMathReward: (reward: { fertilizerOrganic: number; fertilizerN: number; fertilizerP: number; fertilizerK: number; exp: number; coins: number }) => void;
  onSolveMath: () => void;
  onPestReward: (reward: { pestSprays: number; exp: number; coins: number }) => void;
  onPestCleared: () => void;
}

type MiniGameType = 'raindrop' | 'quiz' | 'math' | 'pest' | null;

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  onCollectWater,
  onQuizReward,
  onQuizCorrect,
  onMathReward,
  onSolveMath,
  onPestReward,
  onPestCleared,
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameType>(null);

  if (activeGame === 'raindrop') {
    return <RaindropCatcherGame onBack={() => setActiveGame(null)} onReward={onCollectWater} />;
  }

  if (activeGame === 'quiz') {
    return (
      <ScienceQuizGame
        onBack={() => setActiveGame(null)}
        onReward={onQuizReward}
        onQuizCorrect={onQuizCorrect}
      />
    );
  }

  if (activeGame === 'math') {
    return (
      <FertilizerMathGame
        onBack={() => setActiveGame(null)}
        onReward={onMathReward}
        onSolveMath={onSolveMath}
      />
    );
  }

  if (activeGame === 'pest') {
    return (
      <PestPatrolGame
        onBack={() => setActiveGame(null)}
        onReward={onPestReward}
        onPestCleared={onPestCleared}
      />
    );
  }

  const games = [
    {
      id: 'raindrop' as const,
      title: 'เกมจับหยดน้ำสายฝน (Rain Catcher)',
      tag: 'สะสมน้ำรดแปลง 💧',
      description: 'เลื่อนถังน้ำรับหยดน้ำและดาวทอง เพื่อสะสมน้ำบริสุทธิ์ไว้ใช้รดแปลงผัก',
      rewardsText: 'ได้รับ: น้ำ 2-8 ถัง + EXP + เหรียญทอง',
      icon: '🪣',
      colorBg: 'bg-sky-50 border-sky-300 hover:border-sky-500',
      badgeColor: 'bg-sky-100 border border-sky-300 text-sky-950',
      btnColor: 'bg-sky-600 hover:bg-sky-700 border-sky-800'
    },
    {
      id: 'quiz' as const,
      title: 'ควิซวิทยาศาสตร์การเกษตร (Edutainment Quiz)',
      tag: 'ความรู้พืชและการสังเคราะห์แสง 🧠',
      description: 'ตอบคำถามสังเคราะห์แสง ธาตุอาหาร NPK ดิน และชีววิทยาพืชเพื่อรับน้ำ ปุ๋ย และ EXP',
      rewardsText: 'ได้รับ: ปุ๋ยเฉพาะทาง N/P/K + น้ำ + เหรียญทอง',
      icon: '📖',
      colorBg: 'bg-emerald-50 border-emerald-300 hover:border-emerald-500',
      badgeColor: 'bg-emerald-100 border border-emerald-300 text-emerald-950',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-800'
    },
    {
      id: 'math' as const,
      title: 'แล็บผสมปุ๋ยคณิตศาสตร์ (Math Fertilizer Lab)',
      tag: 'ฝึกคำนวณสูตรปุ๋ย 🧪',
      description: 'คำนวณสัดส่วนและอัตราส่วนผสมเพื่อปรุงปุ๋ยอินทรีย์และเคมีสูตรพรีเมียม',
      rewardsText: 'ได้รับ: ปุ๋ยอินทรีย์ + ปุ๋ย N-P-K คุณภาพสูง',
      icon: '⚗️',
      colorBg: 'bg-purple-50 border-purple-300 hover:border-purple-500',
      badgeColor: 'bg-purple-100 border border-purple-300 text-purple-950',
      btnColor: 'bg-purple-700 hover:bg-purple-800 border-purple-900'
    },
    {
      id: 'pest' as const,
      title: 'ผู้พิทักษ์แปลงผัก (Bio-Pest Patrol)',
      tag: 'กำจัดแมลงและอนุรักษ์เต่าทอง 🐞',
      description: 'จับหนอนและเพลี้ยศัตรูพืช พร้อมอนุรักษ์แมลงเต่าทองที่เป็นมิตรกับสิ่งแวดล้อม',
      rewardsText: 'ได้รับ: สเปรย์ชีวภาพกำจัดศัตรูพืช + เหรียญ',
      icon: '🛡️',
      colorBg: 'bg-rose-50 border-rose-300 hover:border-rose-500',
      badgeColor: 'bg-rose-100 border border-rose-300 text-rose-950',
      btnColor: 'bg-rose-600 hover:bg-rose-700 border-rose-800'
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-teal-700 border-2 border-stone-900 rounded-3xl p-5 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <h2 className="font-black text-lg sm:text-xl tracking-tight uppercase">ศูนย์การเรียนรู้และมินิเกม</h2>
          </div>
          <p className="text-xs font-bold text-teal-100 max-w-xl leading-relaxed">
            เล่นมินิเกมและตอบคำถามเชิงวิชาการ เพื่อสะสมน้ำ ปุ๋ย สเปรย์ชีวภาพ และ EXP สำหรับฟาร์มของคุณ
          </p>
        </div>
      </div>

      {/* Grid of Mini-Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-3xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${game.colorBg}`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl p-2 rounded-2xl bg-white border-2 border-stone-900/10 shadow-xs">{game.icon}</span>
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${game.badgeColor}`}>
                  {game.tag}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm sm:text-base text-stone-950 uppercase tracking-tight">{game.title}</h3>
                <p className="text-xs font-bold text-stone-600 mt-1 leading-relaxed">{game.description}</p>
              </div>

              <div className="text-[11px] font-black text-emerald-950 bg-white p-2 rounded-xl border border-stone-200 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                <span>{game.rewardsText}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveGame(game.id);
              }}
              className={`w-full cursor-pointer text-white font-black text-xs sm:text-sm py-3 rounded-2xl border shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${game.btnColor}`}
            >
              <span>เริ่มเล่นเกมนี้</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
