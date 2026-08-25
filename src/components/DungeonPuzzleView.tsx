import React, { useState, useEffect } from 'react';
import { DungeonRoom, HeroStats, Inventory } from '../types';
import { DUNGEON_ROOMS } from '../data/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Sparkles, Key, CheckCircle, HelpCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DungeonPuzzleViewProps {
  dungeonId: string;
  hero: HeroStats;
  onDungeonCleared: (rewards: DungeonRoom['chestRewards']) => void;
  onBackToMap: () => void;
}

export const DungeonPuzzleView: React.FC<DungeonPuzzleViewProps> = ({
  dungeonId,
  hero,
  onDungeonCleared,
  onBackToMap,
}) => {
  const roomData = DUNGEON_ROOMS.find((r) => r.id === dungeonId) || DUNGEON_ROOMS[0];

  // Grid state
  // 0: floor, 1: wall, 2: block, 3: target, 4: player (or player on target)
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [targetCoords, setTargetCoords] = useState<{ r: number; c: number }[]>([]);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isChestOpened, setIsChestOpened] = useState(false);
  const [cipherSolved, setCipherSolved] = useState(false);
  const [selectedCipherOption, setSelectedCipherOption] = useState<string | null>(null);

  // Initialize room
  const initRoom = () => {
    const raw = roomData.grid.map((row) => [...row]);
    const targets: { r: number; c: number }[] = [];
    let pR = 1;
    let pC = 1;

    for (let r = 0; r < raw.length; r++) {
      for (let c = 0; c < raw[r].length; c++) {
        if (raw[r][c] === 3) {
          targets.push({ r, c });
        }
        if (raw[r][c] === 4) {
          pR = r;
          pC = c;
          raw[r][c] = 0; // Clear floor under player
        }
      }
    }

    setGrid(raw);
    setPlayerPos({ r: pR, c: pC });
    setTargetCoords(targets);
    setIsGateOpen(false);
    setIsChestOpened(false);
    setCipherSolved(false);
    setSelectedCipherOption(null);
  };

  useEffect(() => {
    initRoom();
  }, [dungeonId]);

  // Check if all targets are occupied by blocks
  const checkVictoryCondition = (currGrid: number[][]) => {
    const allFilled = targetCoords.every((t) => currGrid[t.r][t.c] === 2);
    if (allFilled && !isGateOpen) {
      setIsGateOpen(true);
      sounds.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Move Player logic
  const movePlayer = (dr: number, dc: number) => {
    if (isGateOpen && cipherSolved) return;

    const newR = playerPos.r + dr;
    const newC = playerPos.c + dc;

    // Check bounds & wall
    if (newR < 0 || newR >= grid.length || newC < 0 || newC >= grid[0].length) return;
    if (grid[newR][newC] === 1) {
      sounds.playPop();
      return; // Wall
    }

    // Check if stepping on a block
    if (grid[newR][newC] === 2) {
      const pushR = newR + dr;
      const pushC = newC + dc;

      // Check where block will go
      if (pushR < 0 || pushR >= grid.length || pushC < 0 || pushC >= grid[0].length) return;
      if (grid[pushR][pushC] === 1 || grid[pushR][pushC] === 2) {
        sounds.playPop();
        return; // Block blocked by wall or another block
      }

      // Move block
      const nextGrid = grid.map((row) => [...row]);
      nextGrid[newR][newC] = 0;
      nextGrid[pushR][pushC] = 2;

      setGrid(nextGrid);
      setPlayerPos({ r: newR, c: newC });
      sounds.playPuzzleMove();
      checkVictoryCondition(nextGrid);
      return;
    }

    // Normal floor or target plate step
    setPlayerPos({ r: newR, c: newC });
    sounds.playPop();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') movePlayer(-1, 0);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') movePlayer(1, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movePlayer(0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movePlayer(0, 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, grid, isGateOpen, cipherSolved]);

  // Answer Cipher Code
  const handleSolveCipher = (option: string) => {
    setSelectedCipherOption(option);
    if (!roomData.cipherCode) return;

    if (option === roomData.cipherCode.correctAnswer) {
      sounds.playChestOpen();
      setCipherSolved(true);
      setIsChestOpened(true);
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
      onDungeonCleared(roomData.chestRewards);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-4 rounded-3xl border-2 border-stone-900 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playPop();
            onBackToMap();
          }}
          className="cursor-pointer flex items-center gap-1 text-xs font-black bg-white text-stone-950 px-3 py-1.5 rounded-xl border border-stone-900 hover:bg-stone-100 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>ออกจากดันเจี้ยน</span>
        </button>

        <div className="text-center">
          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight flex items-center justify-center gap-1.5">
            <span>🏛️</span>
            {roomData.title}
          </h3>
          <span className="text-[11px] text-amber-300 font-bold">{roomData.dungeonName}</span>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            initRoom();
          }}
          className="cursor-pointer flex items-center gap-1 text-xs font-black bg-amber-400 text-stone-950 px-3 py-1.5 rounded-xl border border-stone-900 hover:bg-amber-500 transition-all shadow-xs"
          title="เริ่มเล่นใหม่"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>รีเซ็ต</span>
        </button>
      </div>

      {/* Sokoban Grid Display */}
      <div className="bg-stone-900 rounded-3xl border-2 border-stone-900 p-4 sm:p-6 text-white shadow-[0_4px_0_0_rgba(28,25,23,1)] flex flex-col items-center">
        {/* Instruction badge */}
        <div className="mb-4 text-center">
          <span className="bg-stone-800 text-amber-300 font-black text-xs px-3 py-1 rounded-full border border-stone-700">
            {isGateOpen ? '✨ ประตูห้องลับเปิดแล้ว! ตอบรหัสโบราณเพื่อเปิดหีบ' : '💡 เข็นบล็อกหินรูน (🪨) ไปทับแท่นพลังงาน (⭐) ทุกจุด'}
          </span>
        </div>

        {/* 2D Grid Cells */}
        <div className="bg-stone-950 p-3 rounded-2xl border-2 border-stone-700 shadow-inner inline-block">
          <div className="flex flex-col gap-1">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                {row.map((cell, cIdx) => {
                  const isPlayer = playerPos.r === rIdx && playerPos.c === cIdx;
                  const isTarget = targetCoords.some((t) => t.r === rIdx && t.c === cIdx);
                  const isBlock = cell === 2;
                  const isWall = cell === 1;

                  return (
                    <div
                      key={cIdx}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black border transition-all ${
                        isWall
                          ? 'bg-stone-800 border-stone-700 text-stone-600 shadow-inner'
                          : isTarget && isBlock
                          ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400'
                          : isTarget
                          ? 'bg-amber-950/40 border-amber-500/60'
                          : 'bg-stone-900 border-stone-800'
                      }`}
                    >
                      {isPlayer ? (
                        <span className="animate-bounce-slow">🧙‍♂️</span>
                      ) : isBlock ? (
                        <span className="filter drop-shadow">🪨</span>
                      ) : isTarget ? (
                        <span className="text-amber-400 animate-pulse text-sm">⭐</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* D-Pad Arrow Controls for Mobile / Click */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="cursor-pointer w-12 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 border border-stone-600 flex items-center justify-center text-white"
          >
            <ChevronUp className="w-6 h-6 stroke-[3]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => movePlayer(0, -1)}
              className="cursor-pointer w-12 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 border border-stone-600 flex items-center justify-center text-white"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>
            <button
              onClick={() => movePlayer(1, 0)}
              className="cursor-pointer w-12 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 border border-stone-600 flex items-center justify-center text-white"
            >
              <ChevronDown className="w-6 h-6 stroke-[3]" />
            </button>
            <button
              onClick={() => movePlayer(0, 1)}
              className="cursor-pointer w-12 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 border border-stone-600 flex items-center justify-center text-white"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Secret Chamber / Cipher Code Modal once Gate is open */}
      {isGateOpen && roomData.cipherCode && !isChestOpened && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-5 sm:p-6 shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4 animate-scaleUp">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🗝️</span>
            <div>
              <h4 className="font-black text-base text-stone-950 uppercase tracking-tight">
                หีบสมบัติโบราณแห่งพฤกษาศาสตร์ (Ancient Rune Chest)
              </h4>
              <span className="text-xs text-amber-800 font-bold">
                คำใบ้: {roomData.cipherCode.clue}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
            <p className="text-sm sm:text-base font-black text-stone-950 leading-relaxed">
              {roomData.cipherCode.question}
            </p>
          </div>

          <div className="space-y-2">
            {roomData.cipherCode.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSolveCipher(opt)}
                className="cursor-pointer w-full p-3 rounded-2xl border-2 border-stone-300 hover:border-amber-500 hover:bg-amber-50 text-left text-xs sm:text-sm font-black text-stone-950 transition-all active:scale-98 shadow-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chest Opened / Victory Rewards */}
      {isChestOpened && (
        <div className="bg-white rounded-3xl border-2 border-stone-900 p-6 text-center shadow-[0_4px_0_0_rgba(28,25,23,1)] space-y-4 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 border-2 border-stone-900 text-stone-950 flex items-center justify-center text-3xl shadow-xs">
            🎁
          </div>

          <div>
            <h4 className="font-black text-lg text-stone-950 uppercase tracking-tight">
              ไขปริศนาดันเจี้ยนสำเร็จ!
            </h4>
            <p className="text-xs font-bold text-stone-600 mt-1">
              ได้รับสมบัติล้ำค่า เมล็ดพันธุ์หายาก และหินรูนโบราณ
            </p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 max-w-sm mx-auto space-y-2">
            <span className="font-black text-xs text-stone-950 uppercase block">รางวัลในหีบสมบัติ:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-bold">🪙 เหรียญทอง</span>
                <span className="font-black text-amber-700">+{roomData.chestRewards.gold}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-bold">💎 มานาคริสตัล</span>
                <span className="font-black text-indigo-700">+{roomData.chestRewards.manaCrystals}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-bold">🪨 หินรูน</span>
                <span className="font-black text-stone-800">+{roomData.chestRewards.runestones}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-bold">⚙️ กลไกโบราณ</span>
                <span className="font-black text-emerald-800">+{roomData.chestRewards.ancientGear}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onBackToMap();
            }}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-2.5 rounded-2xl border-2 border-stone-900 shadow-[0_3px_0_0_rgba(28,25,23,1)] active:scale-95 transition-all"
          >
            กลับสู่แผนที่โลก 🗺️
          </button>
        </div>
      )}
    </div>
  );
};
