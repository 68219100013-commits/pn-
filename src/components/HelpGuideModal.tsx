import React from 'react';
import { sounds } from '../utils/audio';
import { X, CheckCircle2, Sparkles, Sprout, Droplets, BookOpen, Trophy, Swords, Home, FlaskConical, Map } from 'lucide-react';
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
          className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-[0_8px_0_0_rgba(28,25,23,1)] border-2 border-stone-900 relative space-y-4"
        >
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧙‍♂️</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-stone-950 uppercase tracking-tight">
                คู่มือนักผจญภัยพฤกษาศาสตร์ (EcoQuest RPG Guide)
              </h3>
              <p className="text-xs font-bold text-emerald-800">
                เรียนรู้ระบบการเล่น RPG การต่อสู้ ดันเจี้ยน การปรุงยา และการทำฟาร์ม
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-800">
            {/* Step 1 */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 border border-emerald-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                1
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase flex items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-emerald-700" />
                  แผนที่โลก & เควสต์กิลด์ (World Map & NPC Quests)
                </strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  รับภารกิจจากผู้เฒ่าอารอน, นายพรานการ์รอน และนักปรุงยาเอลฟ์ลิลลี่ ออกสำรวจป่ากระซิบ ถ้ำโบราณ และหุบเขาอัคนี
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-rose-50 rounded-2xl border-2 border-rose-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-rose-600 border border-rose-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                2
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5 text-rose-600" />
                  ระบบต่อสู้ Timing Attack & เวทวิทยาศาสตร์ธาตุ
                </strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  กดจังหวะในแถบ Critical สีเขียวเพื่อทำดาเมจ 2.5 เท่า หรือตอบคำถามควิซชีวภาพ/ธาตุเพื่อร่ายเวทแพ้ทางทำดาเมจ 3 เท่า!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-500 border border-amber-800 text-stone-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                3
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase flex items-center gap-1">
                  <span>🗝️</span>
                  ดันเจี้ยนปริศนาเข็นบล็อก & ถอดรหัสโบราณ
                </strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  เข็นหินรูนทับแท่นพลังงานเพื่อเปิดประตูกล แล้วตอบรหัสวิทยาศาสตร์เพื่อปลดล็อกหีบสมบัติเมล็ดพันธุ์ในตำนาน!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-purple-50 rounded-2xl border-2 border-purple-300 flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-600 border border-purple-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                4
              </span>
              <div>
                <strong className="text-stone-950 text-xs font-black uppercase flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-purple-700" />
                  สร้างฐานค่ายพัก & ห้องปรุงยา (Camp & Alchemy)
                </strong>
                <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-relaxed">
                  อัปเกรดเต็นท์เป็นกระท่อมไม้เพื่อรับบัฟ Max HP และความเร็วในการปลูกพืช นำผลผลิตและชิ้นส่วนมอนสเตอร์มาปรุงเป็นโพชั่น
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
              className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] transition-colors active:scale-95 uppercase tracking-wide"
            >
              เข้าใจแล้ว เริ่มการผจญภัยได้เลย! ⚔️
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
