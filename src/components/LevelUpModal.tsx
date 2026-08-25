import React from 'react';
import { sounds } from '../utils/audio';
import { Sparkles, Trophy, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LevelUpModalProps {
  level: number;
  rewardCoins: number;
  unlockedItemName?: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  level,
  rewardCoins,
  unlockedItemName,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-[0_8px_0_0_rgba(28,25,23,1)] border-2 border-stone-900 relative space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-4xl shadow-xs animate-bounce">
            🏆
          </div>

          <div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-200 border border-stone-900 text-stone-950 uppercase tracking-widest">
              LEVEL UP!
            </span>
            <h3 className="font-black text-2xl text-stone-950 mt-2 uppercase tracking-tight">
              เลเวล {level} แล้ว!
            </h3>
            <p className="text-xs font-bold text-stone-700 mt-1">
              ทักษะการเกษตรของคุณพัฒนาขึ้นอีกระดับ พร้อมเปิดรับความท้าทายใหม่!
            </p>
          </div>

          {/* Rewards info */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-stone-900 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-black text-stone-950">
              <span>🪙 โบนัสเหรียญทอง:</span>
              <span className="text-amber-700 font-mono text-sm">+{rewardCoins} เหรียญ</span>
            </div>
            {unlockedItemName && (
              <div className="flex items-center justify-between font-black text-stone-950 border-t border-stone-200 pt-1.5">
                <span>🔓 ปลดล็อกใหม่:</span>
                <span className="text-emerald-700">{unlockedItemName}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              sounds.playHarvest();
              onClose();
            }}
            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>รับของขวัญและลุยต่อ!</span>
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
