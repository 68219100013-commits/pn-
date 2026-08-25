import React from 'react';
import { HeroStats, NPCQuest } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Scroll, Award, CheckCircle, Sparkles, Coins, Gift, ChevronRight, MessageSquareQuote } from 'lucide-react';

interface QuestGuildViewProps {
  quests: NPCQuest[];
  hero: HeroStats;
  onClaimQuest: (questId: string) => void;
  onNavigateToTask: (taskType: string) => void;
}

export const QuestGuildView: React.FC<QuestGuildViewProps> = ({
  quests,
  hero,
  onClaimQuest,
  onNavigateToTask,
}) => {
  const completedCount = quests.filter((q) => q.isCompleted).length;
  const claimedCount = quests.filter((q) => q.isClaimed).length;

  const handleClaim = (q: NPCQuest) => {
    sounds.playLevelUp();
    sounds.playChestOpen();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClaimQuest(q.id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-yellow-950 to-stone-900 rounded-3xl border-2 border-stone-900 p-5 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-lg border border-stone-900 shadow-2xs font-mono uppercase">
                📜 ADVENTURER GUILD
              </span>
              <span className="text-xs text-amber-200 font-bold">
                กิลด์เควสต์นักผจญภัยประจำหมู่บ้าน
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 uppercase tracking-tight flex items-center gap-2">
              <Scroll className="w-6 h-6 text-amber-400" />
              กระดานภารกิจและเควสต์ NPC
            </h2>
            <p className="text-xs text-amber-100 max-w-xl mt-1 leading-relaxed">
              รับฟังคำร้องขอจากชาวบ้านและผู้เชี่ยวชาญ ออกสำรวจ ต่อสู้ และทดลองทางวิทยาศาสตร์เพื่อรับรางวัล EXP และทรัพยากรระดับสูง!
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-center shrink-0">
            <span className="text-[10px] text-amber-200 block font-bold uppercase">สำเร็จแล้ว</span>
            <span className="text-lg font-black font-mono">
              {claimedCount}/{quests.length} ภารกิจ
            </span>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {quests.map((quest) => {
          const progressPercent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

          return (
            <div
              key={quest.id}
              className={`rounded-3xl border-2 border-stone-900 p-5 transition-all shadow-[0_4px_0_0_rgba(28,25,23,1)] bg-white ${
                quest.isClaimed
                  ? 'opacity-70 bg-stone-50'
                  : quest.isCompleted
                  ? 'bg-amber-50/70 ring-2 ring-amber-400'
                  : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: NPC Avatar & Quest Details */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-13 h-13 rounded-2xl bg-amber-100 border-2 border-stone-900 flex items-center justify-center text-3xl shadow-xs">
                      {quest.npcAvatar}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm sm:text-base text-stone-950">
                        {quest.title}
                      </h4>
                      <span className="text-[10px] font-black bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-300">
                        {quest.npcName} ({quest.npcRole})
                      </span>
                    </div>

                    {/* NPC Dialogue Box */}
                    <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs text-stone-700 font-medium italic flex items-start gap-1.5 mt-1">
                      <MessageSquareQuote className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span>"{quest.dialogue}"</span>
                    </div>

                    <p className="text-[11px] text-amber-900 font-bold mt-1">
                      💡 คำแนะนำ: {quest.hint}
                    </p>
                  </div>
                </div>

                {/* Right: Progress & Action Button */}
                <div className="flex flex-col items-end justify-between shrink-0 space-y-2 min-w-[160px]">
                  {/* Rewards summary */}
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-300 font-mono">
                      +{quest.rewardExp} EXP
                    </span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-300 font-mono">
                      +{quest.rewardGold} 🪙
                    </span>
                    <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-lg border border-indigo-300 font-mono">
                      +{quest.rewardCrystals} 💎
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] text-stone-600 font-bold mb-0.5">
                      <span>ความคืบหน้า</span>
                      <span className="font-mono">{quest.currentCount}/{quest.targetCount}</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden border border-stone-300">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {quest.isClaimed ? (
                    <span className="text-xs font-black text-stone-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      รับรางวัลแล้ว
                    </span>
                  ) : quest.isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest)}
                      className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs px-4 py-2 rounded-xl border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center gap-1 animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>รับรางวัลเควสต์ 🎁</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onNavigateToTask(quest.taskType);
                      }}
                      className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white font-black text-xs px-3.5 py-1.5 rounded-xl border border-stone-900 shadow-2xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>ไปทำภารกิจ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
