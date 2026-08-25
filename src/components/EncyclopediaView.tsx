import React, { useState } from 'react';
import { KNOWLEDGE_ARTICLES } from '../data/gameData';
import { sounds } from '../utils/audio';
import { BookOpen, Sparkles, Sun, Droplets, FlaskConical, Sprout, ChevronRight } from 'lucide-react';

export const EncyclopediaView: React.FC = () => {
  const [activeArticleId, setActiveArticleId] = useState(KNOWLEDGE_ARTICLES[0].id);

  const activeArticle =
    KNOWLEDGE_ARTICLES.find((a) => a.id === activeArticleId) || KNOWLEDGE_ARTICLES[0];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-teal-700 border-2 border-stone-900 rounded-3xl p-5 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h2 className="font-black text-lg sm:text-xl tracking-tight uppercase">
              สารานุกรมเกษตรกรอัจฉริยะ (Farmpedia)
            </h2>
          </div>
          <p className="text-xs font-bold text-teal-100 mt-1">
            คลังความรู้วิทยาศาสตร์การเกษตร การสังเคราะห์แสง ธาตุอาหารพืช และระบบนิเวศ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Article Selector */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider px-1">
            หัวข้อบทเรียน:
          </h3>
          <div className="space-y-2">
            {KNOWLEDGE_ARTICLES.map((article) => {
              const isSelected = article.id === activeArticle.id;
              return (
                <button
                  key={article.id}
                  onClick={() => {
                    sounds.playPop();
                    setActiveArticleId(article.id);
                  }}
                  className={`w-full cursor-pointer text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-black border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)]'
                      : 'bg-white text-stone-900 font-bold border-stone-900/15 hover:border-emerald-500 hover:bg-emerald-50/50 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-black">{article.title}</div>
                    <div
                      className={`text-[10px] mt-0.5 font-medium ${
                        isSelected ? 'text-emerald-100' : 'text-stone-500'
                      }`}
                    >
                      {article.summary}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 stroke-[2.5] ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Content */}
        <div className="md:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border-2 border-stone-900/15 shadow-sm space-y-4">
          <div className="border-b-2 border-stone-100 pb-3">
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 uppercase tracking-wide">
              {activeArticle.category}
            </span>
            <h3 className="font-black text-lg text-stone-950 mt-2 tracking-tight">{activeArticle.title}</h3>
            <p className="text-xs font-bold text-stone-600 mt-0.5">{activeArticle.summary}</p>
          </div>

          {/* Render markdown / formatted text */}
          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed space-y-3 whitespace-pre-line font-medium">
            {activeArticle.content}
          </div>

          {/* Quick Quiz Invitation */}
          <div className="mt-4 pt-3 border-t border-stone-100 bg-emerald-50 p-3.5 rounded-2xl border-2 border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 stroke-[2.5]" />
              <span className="text-emerald-950 font-bold">
                อ่านจบแล้วลองไปทดสอบความรู้ในโหมด <strong>ควิซวิทยาศาสตร์เกษตร</strong> เพื่อรับรางวัล!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
