import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { ArrowLeft, FlaskConical, Sparkles, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FertilizerMathGameProps {
  onBack: () => void;
  onReward: (reward: { fertilizerOrganic: number; fertilizerN: number; fertilizerP: number; fertilizerK: number; exp: number; coins: number }) => void;
  onSolveMath: () => void;
}

interface MathProblem {
  id: number;
  formulaName: string;
  fertilizerTarget: 'N' | 'P' | 'K' | 'organic';
  question: string;
  numA: number;
  operator: '+' | '-' | '×';
  numB: number | null; // null if we want to find numB
  targetResult: number;
  options: number[];
  correctAnswer: number;
  hint: string;
}

export const FertilizerMathGame: React.FC<FertilizerMathGameProps> = ({
  onBack,
  onReward,
  onSolveMath,
}) => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Generate 4 math lab puzzles
  const problems: MathProblem[] = [
    {
      id: 1,
      formulaName: 'สูตรปุ๋ยไนโตรเจนเร่งใบเขียว (N-High)',
      fertilizerTarget: 'N',
      question: 'สูตรผสม: ยูเรียไนโตรเจน 24 กก. + สารตัวเติม [ ? ] กก. = ปุ๋ยน้ำหนักรวม 50 กก.',
      numA: 24,
      operator: '+',
      numB: null,
      targetResult: 50,
      options: [22, 26, 30, 24],
      correctAnswer: 26,
      hint: 'คำนวณ: 50 - 24 = 26'
    },
    {
      id: 2,
      formulaName: 'สูตรฟอสฟอรัสเร่งรากและตาดอก (P-Bloom)',
      fertilizerTarget: 'P',
      question: 'ต้องการผสมปุ๋ยฟอสฟอรัส 6 กระสอบ โดยแต่ละกระสอบใช้หินฟอสเฟต [ ? ] กก. รวมเป็น 48 กก.',
      numA: 6,
      operator: '×',
      numB: null,
      targetResult: 48,
      options: [7, 8, 9, 6],
      correctAnswer: 8,
      hint: 'คำนวณ: 48 ÷ 6 = 8'
    },
    {
      id: 3,
      formulaName: 'สูตรโพแทสเซียมเพิ่มความหวานผลผลิต (K-Sweet)',
      fertilizerTarget: 'K',
      question: 'สูตรปุ๋ยโพแทสเซียม 75 กก. ถูกแบ่งใช้ในแปลงแรกไป 38 กก. เหลือนำไปผสมแปลงที่สอง [ ? ] กก.',
      numA: 75,
      operator: '-',
      numB: 38,
      targetResult: 37,
      options: [35, 37, 43, 47],
      correctAnswer: 37,
      hint: 'คำนวณ: 75 - 38 = 37'
    },
    {
      id: 4,
      formulaName: 'สูตรปุ๋ยหมักอินทรีย์ชีวภาพ (Organic Bio-Compost)',
      fertilizerTarget: 'organic',
      question: 'ผสมมูลไส้เดือน 15 ส่วน + เศษใบไม้แห้ง [ ? ] ส่วน เพื่อให้อัตราส่วนอินทรีย์วัตถุรวมเป็น 45 ส่วน',
      numA: 15,
      operator: '+',
      numB: null,
      targetResult: 45,
      options: [25, 30, 35, 20],
      correctAnswer: 30,
      hint: 'คำนวณ: 45 - 15 = 30'
    }
  ];

  const currentProb = problems[problemIndex];

  const handleChoose = (ans: number) => {
    if (feedback !== null) return;
    setSelectedAns(ans);

    if (ans === currentProb.correctAnswer) {
      sounds.playCorrect();
      setFeedback('correct');
      setSolvedCount((c) => c + 1);
      onSolveMath();
    } else {
      sounds.playWrong();
      setFeedback('wrong');
    }
  };

  const handleNextProblem = () => {
    sounds.playPop();
    if (problemIndex + 1 >= problems.length) {
      setIsFinished(true);
      sounds.playLevelUp();
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setProblemIndex((i) => i + 1);
      setSelectedAns(null);
      setFeedback(null);
    }
  };

  const handleClaimRewards = () => {
    sounds.playHarvest();
    onReward({
      fertilizerOrganic: solvedCount >= 1 ? 2 : 1,
      fertilizerN: solvedCount >= 2 ? 2 : 1,
      fertilizerP: solvedCount >= 3 ? 2 : 0,
      fertilizerK: solvedCount >= 4 ? 2 : 0,
      exp: solvedCount * 35 + 20,
      coins: solvedCount * 25 + 20
    });
    onBack();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-900 overflow-hidden shadow-[0_4px_0_0_rgba(28,25,23,1)] max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-purple-700 p-4 border-b-2 border-stone-900 text-white flex items-center justify-between">
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
            <FlaskConical className="w-5 h-5 text-purple-200" />
            แล็บผสมปุ๋ยคณิตศาสตร์
          </h3>
        </div>

        {!isFinished && (
          <span className="bg-white text-stone-950 border border-stone-900 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs font-mono">
            สูตรที่ {problemIndex + 1}/{problems.length}
          </span>
        )}
        {isFinished && <div className="w-16" />}
      </div>

      {!isFinished ? (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Formula Target Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-950 flex items-center gap-1.5 uppercase">
              🧪 เป้าหมาย: {currentProb.formulaName}
            </span>
            <span className="text-xs text-stone-600 font-bold">
              ผสมสำเร็จ: <strong className="text-purple-700 font-black">{solvedCount}</strong> สูตร
            </span>
          </div>

          {/* Problem Card */}
          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-2xl space-y-2">
            <div className="text-xs text-purple-900 font-black uppercase">โจทย์สัดส่วนการผสมปุ๋ย:</div>
            <p className="text-sm sm:text-base font-black text-stone-950 leading-relaxed">
              {currentProb.question}
            </p>
          </div>

          {/* Interactive Option Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentProb.options.map((optionValue, idx) => {
              const isSelected = selectedAns === optionValue;
              const isCorrect = optionValue === currentProb.correctAnswer;

              let btnStyle =
                'bg-white border-2 border-stone-300 text-stone-950 hover:bg-stone-50 hover:border-stone-900';

              if (feedback !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white font-black border-2 border-stone-900 shadow-md';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white font-black border-2 border-stone-900';
                } else {
                  btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleChoose(optionValue)}
                  disabled={feedback !== null}
                  className={`cursor-pointer p-4 rounded-2xl text-center text-lg sm:text-xl font-black transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
                >
                  <span>{optionValue} กก./ส่วน</span>
                  {feedback !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next step */}
          {feedback !== null && (
            <div
              className={`p-3.5 rounded-2xl border-2 text-xs flex items-center justify-between gap-2 animate-fadeIn ${
                feedback === 'correct'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div>
                <strong className="font-black uppercase">{feedback === 'correct' ? '🎉 คำนวณถูกต้อง!' : '❌ ยังไม่ถูกต้อง'}</strong>
                <p className="text-[11px] font-bold opacity-90 mt-0.5">{currentProb.hint}</p>
              </div>

              <button
                onClick={handleNextProblem}
                className="cursor-pointer bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 border border-stone-900 shadow-xs shrink-0"
              >
                <span>{problemIndex + 1 >= problems.length ? 'สรุปผลแล็บ' : 'สูตรถัดไป'}</span>
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Round Finish */
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              สังเคราะห์สูตรปุ๋ยสำเร็จ {solvedCount} จาก {problems.length} สูตร!
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              คุณได้รับปุ๋ยอินทรีย์และปุ๋ยเคมีคุณภาพสูง พร้อมใช้งานในแปลงเกษตร
            </p>
          </div>

          {/* Reward cards */}
          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-300 max-w-sm mx-auto space-y-2">
            <span className="font-black text-xs text-stone-950 uppercase block">ปุ๋ยและรางวัลที่ปรุงสำเร็จ:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🌿</span>
                <span className="font-black text-emerald-800">ปุ๋ย N +2</span>
                <span className="text-[9px] font-bold text-stone-500">เร่งใบเขียว</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🌸</span>
                <span className="font-black text-purple-800">ปุ๋ย P +2</span>
                <span className="text-[9px] font-bold text-stone-500">เร่งดอกและราก</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex flex-col items-center shadow-2xs">
                <span className="text-xl">🍅</span>
                <span className="font-black text-amber-800">ปุ๋ย K +2</span>
                <span className="text-[9px] font-bold text-stone-500">เร่งผลหวาน</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClaimRewards}
              className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-8 py-3 rounded-2xl border-2 border-stone-900 shadow-[0_4px_0_0_rgba(28,25,23,1)] transition-all active:scale-95"
            >
              นำปุ๋ยที่ปรุงได้ไปใช้ในแปลงเกษตร 🧪
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
