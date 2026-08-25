import React from 'react';
import { sounds } from '../utils/audio';
import { X, CheckCircle2, Sparkles, Sprout, Droplets, BookOpen, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-[0_8px_0_0_rgba(28,25,23,1)] border-2 border-stone-900 relative space-y-4"
        >
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-3xl">📖</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-stone-950 uppercase tracking-tight">
                คู่มือการเล่นเกมเกษตรกรอัจฉริยะ (EcoFarm Guide)
              </h3>
              <p className="text-xs font-bold text-emerald-800">เรียนรู้วงจรการทำฟาร์มและการศึกษาอย่างสนุกสนาน</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-800">
            {/* Step 1 */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 border border-emerald-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                1
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase">ทำตามภารกิจแนะนำ (Mission System)</strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  แถบภารกิจด้านบนจะคอยแนะนำขั้นตอนทีละ Step เช่น หาน้ำ 2 ถัง, เพาะเมล็ด, รดน้ำต้นกล้า ทำตามและกดรับรางวัล EXP และเหรียญทอง
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-sky-50 rounded-2xl border-2 border-sky-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-sky-600 border border-sky-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                2
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase">เล่นมินิเกมเก็บทรัพยากร (Mini-Games)</strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  ไปที่หน้า <strong>มินิเกม</strong> เพื่อเล่นจับหยดน้ำสายฝน 💧, ตอบควิซสังเคราะห์แสง 🧠, คำนวณสูตรปุ๋ย 🧪 หรือกำจัดศัตรูพืช 🐞
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-500 border border-amber-800 text-stone-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                3
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase">ปลูกและดูแลพืช 4 ระยะ (4 Growth Stages)</strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  หยอดเมล็ด 🌰 ➔ ต้นกล้า 🌱 ➔ ต้นไม้เติบโต/ออกดอก 🌿 ➔ ผลผลิตสุกพร้อมเก็บเกี่ยว 🍅 คอยรดน้ำและใส่ปุ๋ย NPK ให้เหมาะสม
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-purple-50 rounded-2xl border-2 border-purple-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-600 border border-purple-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                4
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase">เก็บเกี่ยวและสะสมเหรียญรางวัล (Harvest & Badges)</strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  เก็บเกี่ยวเพื่อรับ EXP และเหรียญทอง นำไปขายในร้านค้า ปลดล็อกแปลงใหม่ พืชชนิดใหม่ และเหรียญตราเกียรติยศ!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] transition-colors active:scale-95"
            >
              เข้าใจแล้ว เริ่มสนุกได้เลย! 🧑‍🌾
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
