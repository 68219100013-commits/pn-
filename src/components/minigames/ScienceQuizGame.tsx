import React, { useState } from 'react';
import { QuizQuestion, Inventory } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/gameData';
import { sounds } from '../../utils/audio';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, BookOpen, Lightbulb, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScienceQuizGameProps {
  onBack: () => void;
  onReward: (reward: { water: number; fertilizerN: number; fertilizerP: number; fertilizerK: number; exp: number; coins: number }) => void;
  onQuizCorrect: () => void;
}

export const ScienceQuizGame: React.FC<ScienceQuizGameProps> = ({
  onBack,
  onReward,
  onQuizCorrect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex % QUIZ_QUESTIONS.length];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
      setScore((s) => s + 1);
      onQuizCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex + 1 >= 4) {
      // 4 questions per round
      setIsFinished(true);
      sounds.playLevelUp();
      confetti({ particleCount: 50, spread: 70 });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const calculateFinalRewards = () => {
    const water = score * 2;
    const fertilizerN = score >= 2 ? 1 : 0;
    const fertilizerP = score >= 3 ? 1 : 0;
    const fertilizerK = score >= 4 ? 1 : 0;
    const exp = score * 30 + 20;
    const coins = score * 25 + 15;
    return { water, fertilizerN, fertilizerP, fertilizerK, exp, coins };
  };

  const handleFinishClaim = () => {
    sounds.playHarvest();
    const rewards = calculateFinalRewards();
    onReward(rewards);
    onBack();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-900 overflow-hidden shadow-[0_4px_0_0_rgba(28,25,23,1)] max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-emerald-600 p-4 border-b-2 border-stone-900 text-white flex items-center justify-between">
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
            <BookOpen className="w-5 h-5 text-emerald-200" />
            ควิซวิทยาศาสตร์เกษตรอัจฉริยะ
          </h3>
        </div>

        {!isFinished && (
          <span className="bg-white text-stone-950 border border-stone-900 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs font-mono">
            ข้อ {currentIndex + 1}/4
          </span>
        )}
        {isFinished && <div className="w-16" />}
      </div>

      {!isFinished ? (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-1.5 uppercase">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
              หมวด: {question.categoryLabel}
            </span>
            <span className="text-xs font-bold text-stone-600">
              ตอบถูกแล้ว: <strong className="text-emerald-700 font-black">{score}</strong> ข้อ
            </span>
          </div>

          {/* Question Box */}
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300">
            <h4 className="font-black text-base sm:text-lg text-stone-950 leading-snug">
              {question.question}
            </h4>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              let btnStyle = 'bg-white border-2 border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-stone-900 font-bold';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white font-black border-2 border-stone-900 shadow-xs';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white font-black border-2 border-stone-900';
                } else {
                  btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 opacity-60 font-medium';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full cursor-pointer text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg border border-current flex items-center justify-center font-mono font-black text-xs shrink-0">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 text-white stroke-[2.5]" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 shrink-0 text-white stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Detailed Pedagogical Explanation Box */}
          {isAnswered && (
            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-black text-amber-950 uppercase">
                <Lightbulb className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                <span>คำอธิบายทางวิทยาศาสตร์:</span>
              </div>
              <p className="text-stone-800 font-medium leading-relaxed">{question.explanation}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1 border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)]"
                >
                  <span>{currentIndex + 1 >= 4 ? 'ดูสรุปผลคะแนน' : 'ข้อถัดไป'}</span>
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Round Finish Summary */
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              จบรอบควิซ! คุณตอบถูก {score} จาก 4 ข้อ
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              {score === 4
                ? 'ยอดเยี่ยมมาก! คุณมีความรู้ด้านการเกษตรระดับอัจฉริยะ 🌟'
                : score >= 2
                ? 'เก่งมาก! เรียนรู้และนำความรู้ไปปรับปรุงแปลงผักของคุณ 🌱'
                : 'เริ่มต้นได้ดี! ตอบบ่อยๆ จะช่วยให้จำหลักการเกษตรได้แม่นยำขึ้น'}
            </p>
          </div>

          {/* Reward cards */}
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 max-w-sm mx-auto space-y-2">
            <span className="font-black text-xs text-stone-950 uppercase block">ทรัพยากรที่ได้รับ:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">💧</span>
                <span className="font-black text-sky-950">+{calculateFinalRewards().water} ถัง</span>
                <span className="text-[9px] font-bold text-stone-500">น้ำรดแปลง</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🧪</span>
                <span className="font-black text-purple-950">
                  +{calculateFinalRewards().fertilizerN + calculateFinalRewards().fertilizerP + calculateFinalRewards().fertilizerK} ซอง
                </span>
                <span className="text-[9px] font-bold text-stone-500">ปุ๋ยธาตุ NPK</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">✨</span>
                <span className="font-black text-emerald-700">+{calculateFinalRewards().exp}</span>
                <span className="text-[9px] font-bold text-stone-500">EXP + เหรียญ</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleFinishClaim}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-8 py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] transition-all active:scale-95"
            >
              รับรางวัลและกลับไปดูแลฟาร์ม 🧑‍🌾
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
