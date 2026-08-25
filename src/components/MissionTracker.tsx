import React, { useState } from 'react';
import { Mission, Inventory } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight, Gift, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionTrackerProps {
  missions: Mission[];
  onClaimReward: (missionId: string) => void;
  onNavigateToTab: (tab: 'farm' | 'minigames' | 'shop' | 'encyclopedia' | 'badges') => void;
}

export const MissionTracker: React.FC<MissionTrackerProps> = ({
  missions,
  onClaimReward,
  onNavigateToTab,
}) => {
  const [showAllMissions, setShowAllMissions] = useState(false);

  // Find the active ongoing mission
  const activeMission = missions.find((m) => !m.isClaimed);

  if (!activeMission && missions.every((m) => m.isClaimed)) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-2xl p-3.5 mb-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h3 className="font-bold text-sm text-emerald-950">ยินดีด้วย! คุณสำเร็จภารกิจทั้งหมดแล้ว</h3>
            <p className="text-xs text-emerald-700">คุณคือสุดยอดเกษตรกรอัจฉริยะ ปลูกพืชและทำคะแนนต่อไปได้เลย!</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeMission) return null;

  const isReadyToClaim = activeMission.isCompleted && !activeMission.isClaimed;
  const progressPercent = Math.min(
    100,
    Math.round((activeMission.currentAmount / activeMission.targetAmount) * 100)
  );

  const handleClaim = (mission: Mission) => {
    sounds.playHarvest();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.3 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899']
    });
    onClaimReward(mission.id);
  };

  const handleQuickAction = () => {
    sounds.playPop();
    if (activeMission.type === 'collect_water' || activeMission.type === 'answer_quiz' || activeMission.type === 'solve_math') {
      onNavigateToTab('minigames');
    } else if (activeMission.type === 'reach_level') {
      onNavigateToTab('farm');
    } else {
      onNavigateToTab('farm');
    }
  };

  return (
    <div className="mb-4">
      {/* Active Step-by-Step Banner */}
      <div
        id="mission-active-banner"
        className={`rounded-2xl border-2 transition-all duration-300 p-3.5 sm:p-4 shadow-sm ${
          isReadyToClaim
            ? 'bg-amber-50/90 border-amber-500 shadow-[0_3px_0_0_rgba(245,158,11,1)]'
            : 'bg-white border-stone-900/15 shadow-[0_2px_0_0_rgba(28,25,23,0.05)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Title */}
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 border-2 ${
                isReadyToClaim
                  ? 'bg-amber-400 text-stone-950 border-stone-900 animate-bounce shadow-sm'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-300'
              }`}
            >
              {isReadyToClaim ? <Gift className="w-6 h-6" /> : `S${activeMission.stepNumber}`}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 uppercase tracking-wider">
                  Step {activeMission.stepNumber}
                </span>
                <h2 className="font-black text-sm sm:text-base text-stone-950 tracking-tight">
                  {activeMission.title}
                </h2>
              </div>
              <p className="text-xs font-medium text-stone-700 mt-0.5 leading-relaxed">
                {activeMission.description}
              </p>

              {/* Guide Tip */}
              {activeMission.guideTip && !isReadyToClaim && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300 inline-flex">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                  <span>{activeMission.guideTip}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action / Claim Button */}
          <div className="shrink-0 flex items-center">
            {isReadyToClaim ? (
              <button
                id="btn-claim-mission"
                onClick={() => handleClaim(activeMission)}
                className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>รับรางวัล!</span>
              </button>
            ) : (
              <button
                id="btn-guide-action"
                onClick={handleQuickAction}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1"
              >
                <span>ทำภารกิจ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Reward Pill */}
        <div className="mt-3 pt-2.5 border-t-2 border-stone-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <span className="text-[11px] font-black text-stone-900 whitespace-nowrap">
              ความคืบหน้า:
            </span>
            <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-black text-stone-900 font-mono">
              {activeMission.currentAmount}/{activeMission.targetAmount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-500">รางวัล:</span>
            <span className="font-black text-emerald-800 text-[11px]">+{activeMission.rewardExp} EXP</span>
            <span className="font-black text-amber-700 text-[11px]">+{activeMission.rewardCoins} 🪙</span>
            <button
              onClick={() => {
                sounds.playPop();
                setShowAllMissions(!showAllMissions);
              }}
              className="text-[11px] text-stone-700 hover:text-stone-950 underline ml-1 cursor-pointer font-bold"
            >
              {showAllMissions ? 'ซ่อน' : 'ดูทั้งหมด'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Mission List Modal / Dropdown */}
      <AnimatePresence>
        {showAllMissions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2 bg-white rounded-2xl border-2 border-stone-900/15 p-3.5 sm:p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-black text-xs text-stone-950 flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                สมุดภารกิจเกษตรกร (Step-by-Step Missions)
              </h4>
              <span className="text-[11px] text-stone-700 font-bold">
                สำเร็จแล้ว {missions.filter((m) => m.isClaimed).length}/{missions.length}
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {missions.map((mission) => {
                const isClaimed = mission.isClaimed;
                const isCurrent = mission.id === activeMission.id;

                return (
                  <div
                    key={mission.id}
                    className={`p-2.5 rounded-xl border-2 text-xs flex items-center justify-between gap-2 ${
                      isClaimed
                        ? 'bg-stone-50 border-stone-200 text-stone-400'
                        : isCurrent
                        ? 'bg-emerald-50 border-emerald-400 text-stone-950 font-bold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isClaimed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center text-[10px] font-black text-stone-700 shrink-0 font-mono">
                          {mission.stepNumber}
                        </span>
                      )}
                      <div>
                        <div className={isClaimed ? 'line-through text-stone-400 font-medium' : 'font-bold'}>
                          {mission.title}
                        </div>
                        <div className="text-[10px] text-stone-500 font-normal">{mission.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-black text-emerald-700">+{mission.rewardExp} EXP</span>
                      <span className="text-[10px] font-black text-amber-600">+{mission.rewardCoins} 🪙</span>
                      {mission.isCompleted && !mission.isClaimed && (
                        <button
                          onClick={() => handleClaim(mission)}
                          className="bg-amber-400 text-stone-950 font-black px-2.5 py-1 rounded-lg text-[10px] border border-stone-900 shadow-xs active:scale-95"
                        >
                          รับ
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
