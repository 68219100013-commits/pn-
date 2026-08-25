import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveTab,
  Badge,
  FarmPlot,
  Inventory,
  Mission,
  PlayerStats,
  ToastMessage,
} from './types';
import { CROPS_DATA, INITIAL_BADGES, INITIAL_MISSIONS } from './data/gameData';
import { Header } from './components/Header';
import { MissionTracker } from './components/MissionTracker';
import { FarmPlotCard } from './components/FarmPlotCard';
import { PlotModal } from './components/PlotModal';
import { MiniGamesHub } from './components/minigames/MiniGamesHub';
import { ShopView } from './components/ShopView';
import { EncyclopediaView } from './components/EncyclopediaView';
import { BadgesView } from './components/BadgesView';
import { LevelUpModal } from './components/LevelUpModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { ToastContainer } from './components/Toast';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { Sprout, Gamepad2, Store, BookOpen, Award, Sparkles, Droplets, FlaskConical } from 'lucide-react';

const STORAGE_KEY = 'ecofarm_game_save_v1';

export default function App() {
  // 1. Initial State
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) return parsed.stats;
      }
    } catch {}
    return {
      level: 1,
      exp: 0,
      maxExp: 100,
      coins: 50,
      playerName: 'เกษตรกรน้อย',
      totalHarvests: 0,
      totalQuizzesCorrect: 0,
      totalWaterCollected: 0,
      totalFertilizersCrafted: 0,
      totalPestsCleared: 0,
      gameTimeDays: 1,
    };
  });

  const [plots, setPlots] = useState<FarmPlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plots) return parsed.plots;
      }
    } catch {}
    return [
      { id: 0, isUnlocked: true, unlockLevel: 1, cropId: null, stage: 0, growthProgress: 0, waterLevel: 60, fertilizerLevel: 40, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
      { id: 1, isUnlocked: true, unlockLevel: 1, cropId: null, stage: 0, growthProgress: 0, waterLevel: 60, fertilizerLevel: 40, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
      { id: 2, isUnlocked: true, unlockLevel: 1, cropId: null, stage: 0, growthProgress: 0, waterLevel: 60, fertilizerLevel: 40, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
      { id: 3, isUnlocked: true, unlockLevel: 1, cropId: null, stage: 0, growthProgress: 0, waterLevel: 60, fertilizerLevel: 40, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
      { id: 4, isUnlocked: false, unlockLevel: 2, cropId: null, stage: 0, growthProgress: 0, waterLevel: 0, fertilizerLevel: 0, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
      { id: 5, isUnlocked: false, unlockLevel: 3, cropId: null, stage: 0, growthProgress: 0, waterLevel: 0, fertilizerLevel: 0, hasPest: false, plantedAt: null, lastCareAt: Date.now() },
    ];
  });

  const [inventory, setInventory] = useState<Inventory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inventory) return parsed.inventory;
      }
    } catch {}
    return {
      seeds: {
        morning_glory: 2,
        tomato: 1,
      },
      harvested: {},
      waterBuckets: 0, // Starts at 0 to motivate playing the first mini-game mission!
      fertilizerOrganic: 1,
      fertilizerN: 0,
      fertilizerP: 0,
      fertilizerK: 0,
      pestSprays: 1,
    };
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.missions) return parsed.missions;
      }
    } catch {}
    return INITIAL_MISSIONS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.badges) return parsed.badges;
      }
    } catch {}
    return INITIAL_BADGES;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('farm');
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{
    level: number;
    rewardCoins: number;
    unlockedItemName?: string;
  } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'achievement' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev.slice(-3), { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stats, plots, inventory, missions, badges })
      );
    } catch {}
  }, [stats, plots, inventory, missions, badges]);

  // Check plot unlocks upon level change
  useEffect(() => {
    setPlots((prev) =>
      prev.map((plot) => {
        if (!plot.isUnlocked && stats.level >= plot.unlockLevel) {
          return { ...plot, isUnlocked: true, waterLevel: 60, fertilizerLevel: 30 };
        }
        return plot;
      })
    );
  }, [stats.level]);

  // EXP & Level Progression System
  const addExp = (amount: number) => {
    setStats((prev) => {
      let newExp = prev.exp + amount;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let leveledUp = false;
      let bonusCoins = 0;
      let unlockedName = '';

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * 1.4);
        leveledUp = true;
        bonusCoins += newLevel * 50;

        if (newLevel === 2) unlockedName = 'ข้าวโพดหวาน 🌽 & แครอท 🥕 & แปลงที่ 5';
        else if (newLevel === 3) unlockedName = 'ทานตะวัน 🌻 & แปลงที่ 6';
        else if (newLevel === 4) unlockedName = 'สตรอว์เบอร์รีหวานฉ่ำ 🍓';
        else if (newLevel === 5) unlockedName = 'ข้าวหอมมะลิอินทรีย์ 🌾';
      }

      if (leveledUp) {
        sounds.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.4 },
        });
        setLevelUpModal({
          level: newLevel,
          rewardCoins: bonusCoins,
          unlockedItemName: unlockedName,
        });

        // Trigger level reach mission
        updateMissionProgress('reach_level', 1);

        return {
          ...prev,
          level: newLevel,
          exp: newExp,
          maxExp: newMaxExp,
          coins: prev.coins + bonusCoins,
        };
      }

      return { ...prev, exp: newExp };
    });
  };

  // Mission Progress Evaluator
  const updateMissionProgress = (type: Mission['type'], amount: number) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.type === type && !mission.isCompleted) {
          const nextAmount = mission.currentAmount + amount;
          const isCompleted = nextAmount >= mission.targetAmount;
          if (isCompleted) {
            sounds.playLevelUp();
            addToast('🎉 ภารกิจสำเร็จ!', `สำเร็จ: ${mission.title}`, 'achievement');
          }
          return {
            ...mission,
            currentAmount: nextAmount,
            isCompleted,
          };
        }
        return mission;
      })
    );
  };

  // Badge Progress Evaluator
  const updateBadgeProgress = (badgeId: string, amount: number) => {
    setBadges((prev) =>
      prev.map((badge) => {
        if (badge.id === badgeId && !badge.isUnlocked) {
          const nextCurrent = badge.current + amount;
          const isUnlocked = nextCurrent >= badge.target;
          if (isUnlocked) {
            sounds.playLevelUp();
            addToast(`🏆 ปลดล็อกเหรียญตรา: ${badge.title}`, badge.description, 'achievement');
          }
          return {
            ...badge,
            current: nextCurrent,
            isUnlocked,
            unlockedAt: isUnlocked ? Date.now() : undefined,
          };
        }
        return badge;
      })
    );
  };

  // 2. Main Game Engine (1-second tick loop for crop growth & moisture consumption)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (!plot.isUnlocked || plot.stage === 0 || !plot.cropId) {
            return plot;
          }

          const crop = CROPS_DATA[plot.cropId];
          if (!crop) return plot;

          // If crop is already 100% harvestable (stage 4)
          if (plot.growthProgress >= 100) {
            return { ...plot, stage: 4 };
          }

          // Consume water & fertilizer
          let nextWater = Math.max(0, plot.waterLevel - 0.45 * crop.waterDemand);
          let nextFertilizer = Math.max(0, plot.fertilizerLevel - 0.3 * crop.fertilizerDemand);

          // Growth step calculation
          let growthIncrement = 0;
          if (plot.waterLevel > 0) {
            // Base growth per second
            const baseGrowth = (100 / crop.growthDurationSeconds);
            // Multiplier from fertilizer & moisture
            const fertilizerMultiplier = plot.fertilizerLevel > 20 ? 1.4 : 1.0;
            growthIncrement = baseGrowth * fertilizerMultiplier;
          }

          const nextProgress = Math.min(100, plot.growthProgress + growthIncrement);

          // Determine 4-Stage
          let nextStage: 1 | 2 | 3 | 4 = 1;
          if (nextProgress >= 100) nextStage = 4;
          else if (nextProgress >= 60) nextStage = 3;
          else if (nextProgress >= 25) nextStage = 2;
          else nextStage = 1;

          // Sprout badge progress on reaching stage 2
          if (plot.stage === 1 && nextStage === 2) {
            updateBadgeProgress('first_sprout', 1);
          }

          // Occasional pest spawn (0.4% chance if in stage 2 or 3 and no pest)
          let nextPest = plot.hasPest;
          if (!nextPest && (nextStage === 2 || nextStage === 3) && Math.random() < 0.005) {
            nextPest = true;
          }

          return {
            ...plot,
            waterLevel: nextWater,
            fertilizerLevel: nextFertilizer,
            growthProgress: nextProgress,
            stage: nextStage,
            hasPest: nextPest,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Farming Actions
  const handlePlantSeed = (plotId: number, cropId: string) => {
    if ((inventory.seeds[cropId] || 0) <= 0) return;

    sounds.playPlant();
    setInventory((prev) => ({
      ...prev,
      seeds: {
        ...prev.seeds,
        [cropId]: prev.seeds[cropId] - 1,
      },
    }));

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? {
              ...plot,
              cropId,
              stage: 1,
              growthProgress: 5,
              plantedAt: Date.now(),
              lastCareAt: Date.now(),
              hasPest: false,
            }
          : plot
      )
    );

    updateMissionProgress('plant_crop', 1);
    addToast('🌱 เพาะเมล็ดพันธุ์สำเร็จ!', `ปลูก ${CROPS_DATA[cropId]?.name} เรียบร้อยแล้ว`);
  };

  const handleWaterPlot = (plotId: number) => {
    if (inventory.waterBuckets <= 0) {
      addToast('💧 น้ำหมดแล้ว!', 'ไปที่มินิเกมเพื่อจับหยดน้ำหรือตอบควิซเติมน้ำ', 'warning');
      return;
    }

    sounds.playWater();
    setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets - 1 }));

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? { ...plot, waterLevel: Math.min(100, plot.waterLevel + 50) }
          : plot
      )
    );

    updateMissionProgress('water_crop', 1);
    addToast('💧 รดน้ำเรียบร้อย!', 'ความชื้นในดินเพิ่มขึ้นเต็มที่');
  };

  const handleFertilizePlot = (plotId: number, fertilizerType: 'organic' | 'N' | 'P' | 'K') => {
    const key =
      fertilizerType === 'organic'
        ? 'fertilizerOrganic'
        : fertilizerType === 'N'
        ? 'fertilizerN'
        : fertilizerType === 'P'
        ? 'fertilizerP'
        : 'fertilizerK';

    if (inventory[key] <= 0) {
      addToast('🧪 ปุ๋ยไม่เพียงพอ!', 'เล่นแล็บผสมปุ๋ยคณิตศาสตร์เพื่อปรุงปุ๋ยใหม่', 'warning');
      return;
    }

    sounds.playPop();
    setInventory((prev) => ({ ...prev, [key]: prev[key] - 1 }));

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? { ...plot, fertilizerLevel: Math.min(100, plot.fertilizerLevel + 50) }
          : plot
      )
    );

    updateMissionProgress('fertilize_crop', 1);
    addToast('🧪 บำรุงปุ๋ยสำเร็จ!', `ใส่ปุ๋ย ${fertilizerType} เร่งการเจริญเติบโต x1.5`);
  };

  const handleSprayPest = (plotId: number) => {
    if (inventory.pestSprays <= 0) {
      addToast('🧴 สเปรย์หมด!', 'เล่นมินิเกมผู้พิทักษ์แปลงผักเพื่อรับสเปรย์ชีวภาพ', 'warning');
      return;
    }

    sounds.playPop();
    setInventory((prev) => ({ ...prev, pestSprays: prev.pestSprays - 1 }));

    setPlots((prev) =>
      prev.map((plot) => (plot.id === plotId ? { ...plot, hasPest: false } : plot))
    );

    setStats((prev) => ({ ...prev, totalPestsCleared: prev.totalPestsCleared + 1 }));
    updateBadgeProgress('pest_defender', 1);
    addToast('🛡️ กำจัดศัตรูพืชสำเร็จ!', 'แปลงผักกลับมาปลอดภัยและแข็งแรง');
  };

  const handleHarvestPlot = (plotId: number) => {
    const plot = plots.find((p) => p.id === plotId);
    if (!plot || !plot.cropId || plot.stage < 4) return;

    const crop = CROPS_DATA[plot.cropId];
    if (!crop) return;

    sounds.playHarvest();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

    // Update inventory
    setInventory((prev) => ({
      ...prev,
      harvested: {
        ...prev.harvested,
        [crop.id]: (prev.harvested[crop.id] || 0) + 1,
      },
    }));

    // Reset plot to empty
    setPlots((prev) =>
      prev.map((p) =>
        p.id === plotId
          ? {
              ...p,
              cropId: null,
              stage: 0,
              growthProgress: 0,
              waterLevel: 40,
              fertilizerLevel: 20,
              hasPest: false,
              plantedAt: null,
            }
          : p
      )
    );

    // Stats & EXP
    setStats((prev) => ({
      ...prev,
      totalHarvests: prev.totalHarvests + 1,
      coins: prev.coins + crop.sellPrice,
    }));
    addExp(crop.expReward);

    updateMissionProgress('harvest_crop', 1);
    updateBadgeProgress('master_harvester', 1);

    addToast(
      `🌾 เก็บเกี่ยว ${crop.name} สำเร็จ!`,
      `ได้รับ ${crop.sellPrice} 🪙 และ +${crop.expReward} EXP`,
      'achievement'
    );
  };

  // 4. Mission Claim Reward
  const handleClaimMissionReward = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || !mission.isCompleted || mission.isClaimed) return;

    // Apply items
    if (mission.rewardItems) {
      setInventory((prev) => {
        const nextSeeds = { ...prev.seeds };
        if (mission.rewardItems?.seeds) {
          Object.entries(mission.rewardItems.seeds).forEach(([cid, count]) => {
            nextSeeds[cid] = (nextSeeds[cid] || 0) + count;
          });
        }
        return {
          ...prev,
          seeds: nextSeeds,
          waterBuckets: prev.waterBuckets + (mission.rewardItems?.waterBuckets || 0),
          fertilizerOrganic: prev.fertilizerOrganic + (mission.rewardItems?.fertilizerOrganic || 0),
          fertilizerN: prev.fertilizerN + (mission.rewardItems?.fertilizerN || 0),
          fertilizerP: prev.fertilizerP + (mission.rewardItems?.fertilizerP || 0),
          fertilizerK: prev.fertilizerK + (mission.rewardItems?.fertilizerK || 0),
          pestSprays: prev.pestSprays + (mission.rewardItems?.pestSprays || 0),
        };
      });
    }

    setStats((prev) => ({ ...prev, coins: prev.coins + mission.rewardCoins }));
    addExp(mission.rewardExp);

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m))
    );

    addToast(
      '🎁 รับรางวัลภารกิจเรียบร้อย!',
      `+${mission.rewardExp} EXP & +${mission.rewardCoins} 🪙`,
      'achievement'
    );
  };

  // 5. Mini-Game Reward Callbacks
  const handleCollectWater = (water: number, coins: number, exp: number) => {
    setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets + water }));
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      totalWaterCollected: prev.totalWaterCollected + water,
    }));
    addExp(exp);

    updateMissionProgress('collect_water', water);
    updateBadgeProgress('water_keeper', water);
    addToast('💧 กักเก็บน้ำสำเร็จ!', `ได้รับน้ำ ${water} ถัง, ${coins} 🪙, +${exp} EXP`);
  };

  const handleQuizReward = (reward: {
    water: number;
    fertilizerN: number;
    fertilizerP: number;
    fertilizerK: number;
    exp: number;
    coins: number;
  }) => {
    setInventory((prev) => ({
      ...prev,
      waterBuckets: prev.waterBuckets + reward.water,
      fertilizerN: prev.fertilizerN + reward.fertilizerN,
      fertilizerP: prev.fertilizerP + reward.fertilizerP,
      fertilizerK: prev.fertilizerK + reward.fertilizerK,
    }));
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + reward.coins,
      totalQuizzesCorrect: prev.totalQuizzesCorrect + 1,
    }));
    addExp(reward.exp);

    updateMissionProgress('answer_quiz', 1);
    updateBadgeProgress('green_scholar', 1);
    addToast('🧠 ควิซเสร็จสิ้น!', `รับปุ๋ย NPK, น้ำ และ EXP ครบถ้วน!`, 'achievement');
  };

  const handleMathReward = (reward: {
    fertilizerOrganic: number;
    fertilizerN: number;
    fertilizerP: number;
    fertilizerK: number;
    exp: number;
    coins: number;
  }) => {
    setInventory((prev) => ({
      ...prev,
      fertilizerOrganic: prev.fertilizerOrganic + reward.fertilizerOrganic,
      fertilizerN: prev.fertilizerN + reward.fertilizerN,
      fertilizerP: prev.fertilizerP + reward.fertilizerP,
      fertilizerK: prev.fertilizerK + reward.fertilizerK,
    }));
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + reward.coins,
      totalFertilizersCrafted: prev.totalFertilizersCrafted + 1,
    }));
    addExp(reward.exp);

    updateMissionProgress('solve_math', 1);
    updateBadgeProgress('fertilizer_chemist', 1);
    addToast('🧪 สังเคราะห์ปุ๋ยสำเร็จ!', 'ได้รับปุ๋ยคุณภาพสูงนำไปบำรุงแปลงเกษตร');
  };

  const handlePestReward = (reward: { pestSprays: number; exp: number; coins: number }) => {
    setInventory((prev) => ({ ...prev, pestSprays: prev.pestSprays + reward.pestSprays }));
    setStats((prev) => ({ ...prev, coins: prev.coins + reward.coins }));
    addExp(reward.exp);
    addToast('🛡️ ภารกิจลาดตระเวนสำเร็จ!', `ได้รับสเปรย์ชีวภาพ +${reward.pestSprays} ขวด`);
  };

  // 6. Shop Handlers
  const handleBuySeed = (cropId: string, count: number, totalCost: number) => {
    if (stats.coins < totalCost) return;
    setStats((prev) => ({ ...prev, coins: prev.coins - totalCost }));
    setInventory((prev) => ({
      ...prev,
      seeds: {
        ...prev.seeds,
        [cropId]: (prev.seeds[cropId] || 0) + count,
      },
    }));
    addToast('🛒 ซื้อเมล็ดพันธุ์สำเร็จ', `ซื้อ ${CROPS_DATA[cropId]?.name} x${count} ซอง`);
  };

  const handleSellHarvest = (cropId: string, count: number, totalEarnings: number) => {
    setInventory((prev) => ({
      ...prev,
      harvested: {
        ...prev.harvested,
        [cropId]: Math.max(0, (prev.harvested[cropId] || 0) - count),
      },
    }));
    setStats((prev) => ({ ...prev, coins: prev.coins + totalEarnings }));
    addToast('💰 ขายผลผลิตสำเร็จ!', `ได้รับเหรียญทอง +${totalEarnings} 🪙`);
  };

  const handleBuyWater = (count: number, cost: number) => {
    if (stats.coins < cost) return;
    setStats((prev) => ({ ...prev, coins: prev.coins - cost }));
    setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets + count }));
    addToast('💧 ซื้อน้ำสำเร็จ', `ได้รับน้ำ +${count} ถัง`);
  };

  const handleBuyFertilizer = (type: 'organic' | 'N' | 'P' | 'K', cost: number) => {
    if (stats.coins < cost) return;
    setStats((prev) => ({ ...prev, coins: prev.coins - cost }));
    const key =
      type === 'organic'
        ? 'fertilizerOrganic'
        : type === 'N'
        ? 'fertilizerN'
        : type === 'P'
        ? 'fertilizerP'
        : 'fertilizerK';
    setInventory((prev) => ({ ...prev, [key]: prev[key] + 3 }));
    addToast('🧪 ซื้อปุ๋ยสำเร็จ', `ได้รับปุ๋ย ${type} +3 ถุง`);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header Status */}
      <Header
        stats={stats}
        inventory={inventory}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          sounds.isMuted = !isMuted;
        }}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5 pb-24">
        {/* Step-by-Step Guided Mission Tracker */}
        <MissionTracker
          missions={missions}
          onClaimReward={handleClaimMissionReward}
          onNavigateToTab={setActiveTab}
        />

        {/* Tab 1: Farming Field (หน้าแปลงเกษตร) */}
        {activeTab === 'farm' && (
          <div className="space-y-4">
            {/* Field Banner */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-base sm:text-lg text-stone-950 flex items-center gap-2 tracking-tight uppercase">
                  <Sprout className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
                  แปลงเกษตรอินทรีย์อัจฉริยะ
                </h2>
                <p className="text-xs font-medium text-stone-600 mt-0.5">
                  แตะที่แปลงเพื่อหยอดเมล็ด หรือดูแลด้วยน้ำและปุ๋ยจนครบ 4 ระยะ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-goto-minigames"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('minigames');
                  }}
                  className="cursor-pointer bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-xl border border-sky-800 shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>เล่นมินิเกมเก็บน้ำ/ปุ๋ย</span>
                </button>
              </div>
            </div>

            {/* Farm Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {plots.map((plot) => (
                <FarmPlotCard
                  key={plot.id}
                  plot={plot}
                  playerLevel={stats.level}
                  inventory={inventory}
                  onSelectPlot={(p) => setSelectedPlot(p)}
                  onQuickWater={handleWaterPlot}
                  onQuickFertilize={(id) => handleFertilizePlot(id, 'organic')}
                  onQuickHarvest={handleHarvestPlot}
                  onQuickSpray={handleSprayPest}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Mini-Games & Edutainment Quiz */}
        {activeTab === 'minigames' && (
          <MiniGamesHub
            onCollectWater={handleCollectWater}
            onQuizReward={handleQuizReward}
            onQuizCorrect={() => {
              updateMissionProgress('answer_quiz', 1);
              updateBadgeProgress('green_scholar', 1);
            }}
            onMathReward={handleMathReward}
            onSolveMath={() => {
              updateMissionProgress('solve_math', 1);
              updateBadgeProgress('fertilizer_chemist', 1);
            }}
            onPestReward={handlePestReward}
            onPestCleared={() => {
              updateBadgeProgress('pest_defender', 1);
            }}
          />
        )}

        {/* Tab 3: Shop & Market */}
        {activeTab === 'shop' && (
          <ShopView
            stats={stats}
            inventory={inventory}
            onBuySeed={handleBuySeed}
            onSellHarvest={handleSellHarvest}
            onBuyWater={handleBuyWater}
            onBuyFertilizer={handleBuyFertilizer}
          />
        )}

        {/* Tab 4: Farmpedia Encyclopedia */}
        {activeTab === 'encyclopedia' && <EncyclopediaView />}

        {/* Tab 5: Badges & Leaderboard */}
        {activeTab === 'badges' && <BadgesView badges={badges} stats={stats} />}
      </main>

      {/* Bottom Floating Navigation Bar (Mobile-First Touch Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-stone-900/15 py-1.5 px-3 shadow-lg">
        <div className="max-w-lg mx-auto grid grid-cols-5 gap-1.5 text-center">
          {[
            { id: 'farm', label: 'แปลงผัก', icon: Sprout, emoji: '🌱' },
            { id: 'minigames', label: 'มินิเกม', icon: Gamepad2, emoji: '🎮' },
            { id: 'shop', label: 'ร้านค้า', icon: Store, emoji: '🏪' },
            { id: 'encyclopedia', label: 'ความรู้', icon: BookOpen, emoji: '📚' },
            { id: 'badges', label: 'เหรียญตรา', icon: Award, emoji: '🏆' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as ActiveTab);
                }}
                className={`cursor-pointer flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-stone-950 font-black bg-emerald-100 border-2 border-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 font-bold border border-transparent'
                }`}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className="text-[10px] mt-0.5 tracking-tight font-black">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <PlotModal
        plot={selectedPlot}
        playerLevel={stats.level}
        inventory={inventory}
        onClose={() => setSelectedPlot(null)}
        onPlantSeed={handlePlantSeed}
        onWaterPlot={handleWaterPlot}
        onFertilizePlot={handleFertilizePlot}
        onSprayPest={handleSprayPest}
        onHarvestPlot={handleHarvestPlot}
        onOpenShop={() => {
          setSelectedPlot(null);
          setActiveTab('shop');
        }}
      />

      {levelUpModal && (
        <LevelUpModal
          level={levelUpModal.level}
          rewardCoins={levelUpModal.rewardCoins}
          unlockedItemName={levelUpModal.unlockedItemName}
          onClose={() => setLevelUpModal(null)}
        />
      )}

      <HelpGuideModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
