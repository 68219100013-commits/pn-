import React, { useState } from 'react';
import { CodexCard, HeroStats } from '../types';
import { CODEX_CARDS, QUIZ_QUESTIONS } from '../data/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Award, Lock, CheckCircle2, Zap, HelpCircle, Shield, Brain } from 'lucide-react';

interface CodexViewProps {
  hero: HeroStats;
  onAnswerQuizReward: (rewardType: string, amount: number) => void;
}

export const CodexView: React.FC<CodexViewProps> = ({
  hero,
  onAnswerQuizReward,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'quiz'>('cards');
  const [selectedCard, setSelectedCard] = useState<CodexCard>(CODEX_CARDS[0]);

  // Quiz game state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const currentQuiz = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectAnswer = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    if (idx === currentQuiz.correctIndex) {
      sounds.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setQuizScore((prev) => prev + 1);
      onAnswerQuizReward(currentQuiz.rewardType, currentQuiz.rewardAmount);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuiz = () => {
    sounds.playPop();
    setQuizAnswered(false);
    setSelectedOption(null);
    setCurrentQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-stone-900 rounded-3xl border-2 border-stone-900 p-5 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-lg border border-stone-900 shadow-2xs font-mono uppercase">
                📚 LORE & KNOWLEDGE CODEX
              </span>
              <span className="text-xs text-blue-200 font-bold">
                สารานุกรมวิทยาศาสตร์และพลังการ์ดบัฟ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-300" />
              สมุดบันทึกพฤกษาศาสตร์และการ์ดปัญญา
            </h2>
            <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed">
              การ์ดความรู้ทุกใบมอบบัฟติดตัวถาวร (Passive Buffs) ให้กับฮีโร่และแปลงผัก! เล่นควิซทดสอบความรู้เพื่อสะสมทรัพยากร
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('cards');
              }}
              className={`cursor-pointer font-black text-xs px-3.5 py-2 rounded-2xl border-2 border-stone-900 shadow-2xs transition-all ${
                activeTab === 'cards' ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🃏 การ์ดความรู้
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('quiz');
              }}
              className={`cursor-pointer font-black text-xs px-3.5 py-2 rounded-2xl border-2 border-stone-900 shadow-2xs transition-all ${
                activeTab === 'quiz' ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🧠 ควิซท้าประลอง
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card list */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CODEX_CARDS.map((card) => {
              const isSelected = selectedCard.id === card.id;
              const isUnlocked = card.isUnlocked || hero.level >= 2;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCard(card);
                  }}
                  className={`cursor-pointer rounded-3xl p-4 border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 shadow-[0_4px_0_0_rgba(37,99,235,1)] ring-2 ring-blue-400/40'
                      : 'bg-white border-stone-900 shadow-xs hover:border-blue-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-3xl filter drop-shadow">{card.icon}</span>
                      <span className="text-[10px] font-black bg-blue-100 text-blue-950 px-2 py-0.5 rounded-lg border border-blue-300">
                        {card.category}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-stone-950 mt-2">{card.title}</h4>
                    <span className="text-[11px] text-stone-500 font-bold block">{card.thaiTitle}</span>
                    <p className="text-xs text-stone-600 font-medium mt-1 line-clamp-2">{card.summary}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {card.passiveBuff.description.split(':')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card Detail Drawer */}
          <div className="bg-white rounded-3xl border-2 border-stone-900 p-5 shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 border-b-2 border-stone-100 pb-3">
                <span className="text-4xl">{selectedCard.icon}</span>
                <div>
                  <h4 className="font-black text-base text-stone-950 uppercase">{selectedCard.title}</h4>
                  <span className="text-xs text-blue-800 font-bold">{selectedCard.thaiTitle}</span>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-3.5">
                  <span className="text-[11px] font-black text-blue-950 uppercase block mb-1">
                    🔬 หลักการทางวิทยาศาสตร์:
                  </span>
                  <p className="text-xs font-bold text-stone-700 leading-relaxed">
                    {selectedCard.scienceKnowledge}
                  </p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5">
                  <span className="text-[11px] font-black text-emerald-950 uppercase block mb-1">
                    ✨ บัฟติดตัวถาวร (Active Passive Buff):
                  </span>
                  <p className="text-xs font-black text-emerald-900">
                    {selectedCard.passiveBuff.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-stone-500">
                สถานะ: <strong className="text-emerald-700">เปิดใช้งานบัฟอัตโนมัติ 🌟</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Challenge View */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-5 sm:p-6 shadow-[0_4px_0_0_rgba(28,25,23,1)] max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
            <span className="text-xs font-black bg-blue-100 text-blue-950 px-3 py-1 rounded-full uppercase">
              🧪 คำถามที่ {currentQuizIndex + 1}/{QUIZ_QUESTIONS.length}: {currentQuiz.categoryLabel}
            </span>
            <span className="text-xs font-black text-amber-700 font-mono">
              ตอบถูก: {quizScore} ข้อ
            </span>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl">
            <p className="text-sm sm:text-base font-black text-stone-950 leading-relaxed">
              {currentQuiz.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuiz.correctIndex;

              let btnClass = 'bg-white border-stone-300 hover:bg-stone-50';
              if (quizAnswered) {
                if (isCorrect) btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                else if (isSelected) btnClass = 'bg-rose-100 border-rose-500 text-rose-950 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={quizAnswered}
                  className={`cursor-pointer w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all active:scale-98 shadow-xs ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {quizAnswered && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-stone-50 border-2 border-stone-200 p-3.5 rounded-2xl">
                <span className="font-black text-xs text-stone-950 uppercase block mb-0.5">💡 คำอธิบายเชิงวิชาการ:</span>
                <p className="text-xs font-bold text-stone-600 leading-relaxed">{currentQuiz.explanation}</p>
              </div>

              <button
                onClick={handleNextQuiz}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-98 transition-all uppercase"
              >
                ข้อถัดไป ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
