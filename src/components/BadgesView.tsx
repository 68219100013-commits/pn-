import React from 'react';
import { Badge, PlayerStats } from '../types';
import { sounds } from '../utils/audio';
import { Trophy, Award, Medal, Sparkles, CheckCircle2, Star, Flame } from 'lucide-react';

interface BadgesViewProps {
  badges: Badge[];
  stats: PlayerStats;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ badges, stats }) => {
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return '👑 ปรมาจารย์เกษตรอัจฉริยะ (Master Agronomist)';
    if (lvl >= 4) return '🌟 ผู้เชี่ยวชาญเกษตรอินทรีย์ (Organic Farming Expert)';
    if (lvl >= 3) return '🌿 เกษตรกรมือโปร (Pro Farmer)';
    if (lvl >= 2) return '🌱 เกษตรกรก้าวหน้า (Advanced Grower)';
    return '🧑‍🌾 เกษตรกรฝึกหัด (Beginner Farmer)';
  };

  // Dynamic leaderboard ranking based on EXP
  const mockLeaderboard = [
    { rank: 1, name: 'น้องฟ้าใส ฟาร์มไฮโดรโปนิกส์', exp: 1850, level: 6, avatar: '👩‍🌾' },
    { rank: 2, name: 'ครูสมศักดิ์ เกษตรพอเพียง', exp: 1420, level: 5, avatar: '👨‍🌾' },
    { rank: 3, name: 'หนุ่มนาข้าว เกษตรทฤษฎีใหม่', exp: 980, level: 4, avatar: '🌾' },
    {
      rank: 4,
      name: `${stats.playerName} (คุณ)`,
      exp: stats.exp + (stats.level - 1) * 100,
      level: stats.level,
      avatar: '🧑‍🌾',
      isMe: true,
    },
    { rank: 5, name: 'พี่ต้นกล้า ผักปลอดสาร', exp: 320, level: 2, avatar: '🥬' },
  ].sort((a, b) => b.exp - a.exp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile & Honor Rank Banner */}
      <div className="bg-amber-500 border-2 border-stone-900 rounded-3xl p-5 text-stone-950 shadow-[0_4px_0_0_rgba(28,25,23,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-900 flex items-center justify-center text-3xl shadow-xs">
            🏅
          </div>
          <div>
            <div className="text-xs font-black text-stone-900 uppercase tracking-wide">
              ฉายาเกียรติยศเกษตรกร:
            </div>
            <h2 className="font-black text-base sm:text-lg uppercase tracking-tight">{getRankTitle(stats.level)}</h2>
            <div className="text-xs font-bold text-stone-800 mt-0.5">
              ปลดล็อกเหรียญตราแล้ว {unlockedCount}/{badges.length} เหรียญ
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-stone-900 px-4 py-2 rounded-2xl text-center text-xs font-black shadow-xs">
          <div className="text-stone-700">สถิติการเก็บเกี่ยวรวม</div>
          <div className="text-xl text-stone-950 font-mono mt-0.5">{stats.totalHarvests} ครั้ง 🧺</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center gap-2 uppercase tracking-wide">
            <Award className="w-5 h-5 text-amber-500 stroke-[2.5]" />
            เหรียญเกียรติยศชาวสวน (Badges & Achievements)
          </h3>
          <span className="text-xs font-black text-stone-700 font-mono">
            {unlockedCount} / {badges.length} ปลดล็อกแล้ว
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.isUnlocked;
            const progress = Math.min(100, Math.round((badge.current / badge.target) * 100));

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-stone-900 shadow-xs'
                    : 'bg-stone-50 border-stone-200 opacity-70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                    isUnlocked
                      ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-xs'
                      : 'bg-stone-200 text-stone-400 border-stone-300 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-black text-xs text-stone-950 truncate">{badge.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[3] shrink-0" />}
                  </div>
                  <p className="text-[11px] font-medium text-stone-700 mt-0.5 leading-snug line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden border border-stone-300">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isUnlocked ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-700">
                      {badge.current}/{badge.target}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="w-5 h-5 text-amber-500 stroke-[2.5]" />
            ตารางคะแนนชาวสวนยอดเยี่ยม (Leaderboard)
          </h3>
          <span className="text-xs text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 font-black">
            อัปเดตสัปดาห์นี้
          </span>
        </div>

        <div className="space-y-2">
          {mockLeaderboard.map((player) => (
            <div
              key={player.rank}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 text-xs ${
                player.isMe
                  ? 'bg-amber-100 border-stone-900 font-black shadow-[0_2px_0_0_rgba(28,25,23,1)]'
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                    player.rank === 1
                      ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-xs'
                      : player.rank === 2
                      ? 'bg-stone-200 text-stone-900 border-stone-400'
                      : player.rank === 3
                      ? 'bg-amber-700 text-white border-amber-900'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {player.rank}
                </span>

                <span className="text-2xl">{player.avatar}</span>

                <div>
                  <div className="font-black text-stone-950">{player.name}</div>
                  <div className="text-[10px] text-stone-600 font-bold">ระดับ Lv.{player.level}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-emerald-700 font-mono text-sm">
                  {player.exp.toLocaleString()} EXP
                </div>
                <div className="text-[10px] text-stone-500 font-bold">คะแนนสะสม</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
