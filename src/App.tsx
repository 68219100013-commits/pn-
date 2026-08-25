import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AlchemyRecipe,
  DungeonRoom,
  FarmPlot,
  HeroStats,
  InGameTime,
  Inventory,
  Monster,
  NPCQuest,
  ToastMessage,
  WeatherState,
  WeatherType,
  WorldLocation,
} from './types';
import {
  ALCHEMY_RECIPES,
  CROPS_DATA,
  DUNGEON_ROOMS,
  NPC_QUESTS,
  WORLD_LOCATIONS,
  MONSTERS_DATA,
  CAMP_UPGRADES,
} from './data/gameData';
import { WEATHER_CONFIGS, getTimeOfDay } from './data/weatherData';
import { Header } from './components/Header';
import { WorldMapView } from './components/WorldMapView';
import { BattleView } from './components/BattleView';
import { DungeonPuzzleView } from './components/DungeonPuzzleView';
import { CampView } from './components/CampView';
import { AlchemyView } from './components/AlchemyView';
import { QuestGuildView } from './components/QuestGuildView';
import { CodexView } from './components/CodexView';
import { ShopView } from './components/ShopView';
import { MiniGamesHub } from './components/minigames/MiniGamesHub';
import { PlotModal } from './components/PlotModal';
import { LevelUpModal } from './components/LevelUpModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { WeatherOverlay } from './components/WeatherOverlay';
import { ToastContainer } from './components/Toast';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import {
  Map,
  Home,
  Scroll,
  FlaskConical,
  BookOpen,
  ShoppingBag,
  Gamepad2,
} from 'lucide-react';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('camp');

  // RPG Hero Stats
  const [hero, setHero] = useState<HeroStats>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_hero');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse hero data', e);
      }
    }
    return {
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: 100,
      maxHp: 100,
      stamina: 50,
      maxStamina: 50,
      atk: 18,
      def: 6,
      title: 'นักผจญภัยฝึกหัด (Novice Adventurer)',
      coins: 80,
      manaCrystals: 5,
      playerName: 'เรย์ (Ray)',
      campLevel: 1,
      totalMonstersDefeated: 0,
      totalBattlesWon: 0,
      totalDungeonsCleared: 0,
      totalPotionsBrewed: 0,
      totalHarvests: 0,
      totalQuizzesCorrect: 0,
      discoveredCards: ['card_photosynthesis', 'card_npk_chemistry'],
      currentLocationId: 'oasis_village',
    };
  });

  // RPG Inventory
  const [inventory, setInventory] = useState<Inventory>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inventory data', e);
      }
    }
    return {
      seeds: {
        morning_glory: 4,
        tomato: 2,
        corn: 1,
      },
      harvested: {},
      waterBuckets: 8,
      fertilizerOrganic: 4,
      fertilizerN: 2,
      fertilizerP: 2,
      fertilizerK: 2,
      pestSprays: 3,
      potions: {
        hp_small: 3,
        hp_large: 1,
        stamina_elixir: 1,
        antidote: 2,
        fire_bomb: 2,
        water_splash: 2,
      },
      materials: {
        magic_wood: 4,
        runestone: 2,
        monster_essence: 1,
        star_dust: 0,
        fire_core: 0,
        ancient_gear: 0,
      },
    };
  });

  // Farm Plots
  const [plots, setPlots] = useState<FarmPlot[]>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_plots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse plot data', e);
      }
    }
    return [
      {
        id: 0,
        isUnlocked: true,
        unlockLevel: 1,
        cropId: 'morning_glory',
        stage: 2,
        growthProgress: 60,
        waterLevel: 80,
        fertilizerLevel: 70,
        hasPest: false,
        isTilled: true,
        plantedAt: Date.now() - 5000,
        lastCareAt: Date.now(),
      },
      {
        id: 1,
        isUnlocked: true,
        unlockLevel: 1,
        cropId: null,
        stage: 0,
        growthProgress: 0,
        waterLevel: 60,
        fertilizerLevel: 40,
        hasPest: false,
        isTilled: false,
        plantedAt: null,
        lastCareAt: Date.now(),
      },
      {
        id: 2,
        isUnlocked: true,
        unlockLevel: 1,
        cropId: null,
        stage: 0,
        growthProgress: 0,
        waterLevel: 50,
        fertilizerLevel: 30,
        hasPest: false,
        isTilled: false,
        plantedAt: null,
        lastCareAt: Date.now(),
      },
      {
        id: 3,
        isUnlocked: true,
        unlockLevel: 1,
        cropId: null,
        stage: 0,
        growthProgress: 0,
        waterLevel: 50,
        fertilizerLevel: 30,
        hasPest: false,
        isTilled: false,
        plantedAt: null,
        lastCareAt: Date.now(),
      },
      {
        id: 4,
        isUnlocked: true,
        unlockLevel: 2,
        cropId: null,
        stage: 0,
        growthProgress: 0,
        waterLevel: 40,
        fertilizerLevel: 20,
        hasPest: false,
        isTilled: false,
        plantedAt: null,
        lastCareAt: Date.now(),
      },
      {
        id: 5,
        isUnlocked: false,
        unlockLevel: 3,
        cropId: null,
        stage: 0,
        growthProgress: 0,
        waterLevel: 0,
        fertilizerLevel: 0,
        hasPest: false,
        isTilled: false,
        plantedAt: null,
        lastCareAt: Date.now(),
      },
    ];
  });

  // NPC Quests
  const [quests, setQuests] = useState<NPCQuest[]>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse quests', e);
      }
    }
    return NPC_QUESTS;
  });

  // Active Combat / Dungeon Selection
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('forest_slime');
  const [selectedDungeonId, setSelectedDungeonId] = useState<string>('ruin_chamber_1');

  // Modals & UI States
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(null);
  const [levelUpModal, setLevelUpModal] = useState<{ level: number; rewardCoins: number; unlockedItemName: string } | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // In-Game Time & Dynamic Weather System
  const [inGameTime, setInGameTime] = useState<InGameTime>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_time');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inGameTime', e);
      }
    }
    return { day: 1, hours: 8, minutes: 30, timeOfDay: 'morning' };
  });

  const [weatherType, setWeatherType] = useState<WeatherType>(() => {
    const saved = localStorage.getItem('ecoquest_rpg_weather');
    if (saved && saved in WEATHER_CONFIGS) {
      return saved as WeatherType;
    }
    return 'sunny';
  });

  const currentWeather = WEATHER_CONFIGS[weatherType] || WEATHER_CONFIGS['sunny'];

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_hero', JSON.stringify(hero));
  }, [hero]);

  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_time', JSON.stringify(inGameTime));
  }, [inGameTime]);

  useEffect(() => {
    localStorage.setItem('ecoquest_rpg_weather', weatherType);
  }, [weatherType]);

  // Toast Helper
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'info', icon?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}_${Math.random()}`,
      title,
      description,
      type,
      icon,
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  // Quest Tracker
  const updateQuestProgress = (type: NPCQuest['taskType'], amount = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.taskType === type && !q.isCompleted) {
          const nextCount = q.currentCount + amount;
          const completed = nextCount >= q.targetCount;
          if (completed && !q.isCompleted) {
            sounds.playQuestComplete();
            addToast(`📜 ภารกิจสำเร็จ: ${q.title}!`, 'รับรางวัลที่กิลด์นักผจญภัยได้แล้ว!', 'achievement');
          }
          return {
            ...q,
            currentCount: Math.min(q.targetCount, nextCount),
            isCompleted: completed,
          };
        }
        return q;
      })
    );
  };

  // Hero Experience & Level-Up
  const addExp = (amount: number) => {
    setHero((prev) => {
      let currentExp = prev.exp + amount;
      let currentLevel = prev.level;
      let maxExp = prev.maxExp;
      let currentMaxHp = prev.maxHp;
      let currentAtk = prev.atk;
      let currentCoins = prev.coins;

      let leveledUp = false;
      let unlockedName = '';

      while (currentExp >= maxExp) {
        currentExp -= maxExp;
        currentLevel += 1;
        maxExp = Math.round(maxExp * 1.45);
        currentMaxHp += 25;
        currentAtk += 4;
        currentCoins += currentLevel * 50;
        leveledUp = true;

        if (currentLevel === 2) unlockedName = 'ข้าวโพดหวาน, แครอท & ยาถอนพิษ';
        else if (currentLevel === 3) unlockedName = 'ทานตะวัน, โสมเวทมนตร์ & ระเบิดเพลิง';
        else if (currentLevel === 4) unlockedName = 'สตรอว์เบอร์รี & น้ำทิพย์ฟื้นฟูมานา';
        else if (currentLevel === 5) unlockedName = 'ดอกบัวดวงดาว & ดันเจี้ยนหุบเขาเพลิง';
        else unlockedName = `ทักษะขั้นสูงระดับ Lv.${currentLevel}`;
      }

      if (leveledUp) {
        sounds.playLevelUp();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setLevelUpModal({
          level: currentLevel,
          rewardCoins: currentLevel * 50,
          unlockedItemName: unlockedName,
        });

        // Unlock farm plots for new level
        setPlots((prevPlots) =>
          prevPlots.map((plot) =>
            plot.unlockLevel <= currentLevel ? { ...plot, isUnlocked: true } : plot
          )
        );
      }

      return {
        ...prev,
        level: currentLevel,
        exp: currentExp,
        maxExp,
        maxHp: currentMaxHp,
        hp: leveledUp ? currentMaxHp : prev.hp,
        atk: currentAtk,
        coins: currentCoins,
      };
    });
  };

  // In-Game Clock & Weather Progression (every 2.5s = +5 in-game minutes)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setInGameTime((prevTime) => {
        let newMinutes = prevTime.minutes + 5;
        let newHours = prevTime.hours;
        let newDay = prevTime.day;

        if (newMinutes >= 60) {
          newMinutes = newMinutes % 60;
          newHours += 1;
        }

        if (newHours >= 24) {
          newHours = 0;
          newDay += 1;
        }

        const newTimeOfDay = getTimeOfDay(newHours);

        return {
          day: newDay,
          hours: newHours,
          minutes: newMinutes,
          timeOfDay: newTimeOfDay,
        };
      });
    }, 2500);

    return () => clearInterval(clockInterval);
  }, []);

  // Weather Rotation (natural transitions based on time of day)
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      // 35% chance of weather shifting periodically
      if (Math.random() < 0.35) {
        const timeOfDay = inGameTime.timeOfDay;
        let candidateWeathers: WeatherType[] = ['sunny', 'breeze', 'rainy'];

        if (timeOfDay === 'night') {
          candidateWeathers = ['moonlit', 'rainy', 'thunderstorm', 'breeze'];
        } else if (timeOfDay === 'sunset') {
          candidateWeathers = ['breeze', 'sunny', 'rainy'];
        } else if (timeOfDay === 'morning' || timeOfDay === 'day') {
          candidateWeathers = ['sunny', 'breeze', 'rainy', 'thunderstorm'];
        }

        const nextWeatherType = candidateWeathers[Math.floor(Math.random() * candidateWeathers.length)];
        if (nextWeatherType !== weatherType) {
          setWeatherType(nextWeatherType);
          const nextWeatherConfig = WEATHER_CONFIGS[nextWeatherType];
          sounds.playPop();
          addToast(
            `🌤️ สภาพอากาศเปลี่ยนเป็น: ${nextWeatherConfig.name} ${nextWeatherConfig.icon}`,
            nextWeatherConfig.cropBuffDescription,
            'info'
          );
        }
      }
    }, 45000); // Check every 45s

    return () => clearInterval(weatherInterval);
  }, [inGameTime.timeOfDay, weatherType]);

  // Manual Weather Change Handler
  const handleSetWeather = (type: WeatherType) => {
    setWeatherType(type);
    sounds.playPop();
    const config = WEATHER_CONFIGS[type];
    addToast(
      `✨ ควบคุมสภาพอากาศ: ${config.name} ${config.icon}`,
      config.cropBuffDescription,
      'achievement'
    );
  };

  // Plant Growth Loop (1-second tick with Camp bonus & Weather Effects)
  useEffect(() => {
    const campBonus = CAMP_UPGRADES.find((c) => c.level === hero.campLevel)?.growthSpeedBonus || 0;

    const interval = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (!plot.isUnlocked || !plot.cropId || plot.stage === 0 || plot.stage >= 4) {
            return plot;
          }

          const crop = CROPS_DATA[plot.cropId];
          if (!crop) return plot;

          // Weather impact on water:
          // Rain / Thunderstorm naturally waters plants
          let nextWater = plot.waterLevel;
          if (currentWeather.autoWaterRate > 0) {
            nextWater = Math.min(100, nextWater + currentWeather.autoWaterRate);
          } else {
            // Evaporation affected by weather
            const waterDecay = 0.6 * crop.waterDemand * currentWeather.waterEvaporationMultiplier;
            nextWater = Math.max(0, nextWater - waterDecay);
          }

          // Growth calculation with weather multipliers
          let growthRate = (100 / crop.growthDurationSeconds) * currentWeather.growthMultiplier;

          // Moonlit night bonus for magic crops
          if (crop.category === 'magic' && currentWeather.type === 'moonlit') {
            growthRate *= currentWeather.magicCropBonus;
          }

          if (plot.waterLevel < 20) growthRate *= 0.3; // Thirst penalty
          if (plot.fertilizerLevel > 20) growthRate *= 1.35; // Fertilizer boost
          if (plot.isTilled) growthRate *= 1.25; // Tilling bonus
          if (campBonus > 0) growthRate *= 1 + campBonus / 100; // Camp cabin bonus
          if (plot.hasPest) growthRate *= 0.2; // Pest debuff

          const nextProgress = Math.min(100, plot.growthProgress + growthRate);

          let nextStage = plot.stage;
          if (nextProgress >= 100) nextStage = 4;
          else if (nextProgress >= 66) nextStage = 3;
          else if (nextProgress >= 33) nextStage = 2;
          else nextStage = 1;

          // Random pest check (modulated by weather pestRisk)
          let nextPest = plot.hasPest;
          if (!nextPest && nextStage >= 2 && nextStage < 4 && currentWeather.pestRisk > 0 && Math.random() < 0.008 * currentWeather.pestRisk) {
            nextPest = true;
            addToast(`🐛 ศัตรูพืชบุกแปลงที่ ${plot.id + 1}!`, 'ใช้สเปรย์ชีวภาพกำจัดเพื่อไม่ให้ต้นไม้หยุดโต', 'warning');
          }

          return {
            ...plot,
            waterLevel: nextWater,
            growthProgress: nextProgress,
            stage: nextStage,
            hasPest: nextPest,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [hero.campLevel, currentWeather]);

  // World Map Navigation
  const handleSelectLocation = (locId: string) => {
    setHero((prev) => ({ ...prev, currentLocationId: locId }));
    const location = WORLD_LOCATIONS[locId];
    if (location) {
      addToast(`🗺️ เดินทางสู่ ${location.thaiName}!`, location.description);
    }
  };

  const handleStartBattle = (monsterId: string) => {
    setSelectedMonsterId(monsterId);
    setActiveTab('battle');
    sounds.playPop();
    const monster = MONSTERS_DATA[monsterId];
    if (monster) {
      addToast(`⚔️ เข้าสู่สมรภูมิ: ${monster.name}!`, 'โจมตีด้วยจังหวะ Timing Attack เพื่อทำความเสียหาย Critical!');
    }
  };

  const handleEnterDungeon = (dungeonId: string) => {
    setSelectedDungeonId(dungeonId);
    setActiveTab('dungeon');
    sounds.playChestOpen();
    const dungeon = DUNGEON_ROOMS.find((d) => d.id === dungeonId);
    if (dungeon) {
      addToast(`🗝️ เข้าสู่ ${dungeon.title}!`, 'เข็นบล็อกหินรูนและตอบรหัสวิทยาศาสตร์เพื่อเปิดหีบสมบัติ');
    }
  };

  // Battle Victory Callback
  const handleBattleVictory = (rewards: {
    exp: number;
    gold: number;
    crystals: number;
    materials: Partial<Inventory['materials']>;
    seeds: Record<string, number>;
  }) => {
    sounds.playLevelUp();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    // Grant drop materials and seeds
    setInventory((prev) => {
      const nextSeeds = { ...prev.seeds };
      if (rewards.seeds) {
        Object.entries(rewards.seeds).forEach(([sid, count]) => {
          nextSeeds[sid] = (nextSeeds[sid] || 0) + count;
        });
      }

      const nextMaterials = { ...prev.materials };
      if (rewards.materials) {
        Object.entries(rewards.materials).forEach(([mid, count]) => {
          const key = mid as keyof Inventory['materials'];
          nextMaterials[key] = (nextMaterials[key] || 0) + (count || 0);
        });
      }

      return {
        ...prev,
        seeds: nextSeeds,
        materials: nextMaterials,
      };
    });

    setHero((prev) => ({
      ...prev,
      coins: prev.coins + rewards.gold,
      manaCrystals: prev.manaCrystals + rewards.crystals,
      totalMonstersDefeated: (prev.totalMonstersDefeated || 0) + 1,
      totalBattlesWon: (prev.totalBattlesWon || 0) + 1,
    }));

    addExp(rewards.exp);
    updateQuestProgress('battle', 1);
    addToast(
      '🏆 ได้รับชัยชนะในการต่อสู้!',
      `+${rewards.exp} EXP, +${rewards.gold} 🪙, +${rewards.crystals} 💎`,
      'achievement'
    );
  };

  // Potion Consumption
  const handleUsePotion = (potionType: keyof Inventory['potions']) => {
    if ((inventory.potions[potionType] || 0) <= 0) return;

    sounds.playPotionBrew();
    setInventory((prev) => ({
      ...prev,
      potions: {
        ...prev.potions,
        [potionType]: prev.potions[potionType] - 1,
      },
    }));

    if (potionType === 'hp_small') {
      setHero((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 80) }));
      addToast('💚 ฟื้นฟู HP +80!');
    } else if (potionType === 'hp_large') {
      setHero((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 250) }));
      addToast('💚 ฟื้นฟู HP +250!');
    } else if (potionType === 'stamina_elixir') {
      setHero((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 100), atk: prev.atk + 5 }));
      addToast('🪷 ฟื้นฟูมานา & บัฟ ATK +5!');
    } else if (potionType === 'antidote') {
      setHero((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 50) }));
      addToast('🌿 ล้างพิษ & ฟื้นฟู HP +50!');
    }
  };

  // Dungeon Cleared
  const handleDungeonCleared = (rewards: DungeonRoom['chestRewards']) => {
    sounds.playChestOpen();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

    setInventory((prev) => {
      const nextSeeds = { ...prev.seeds };
      if (rewards.rareSeed) {
        nextSeeds[rewards.rareSeed.cropId] =
          (nextSeeds[rewards.rareSeed.cropId] || 0) + rewards.rareSeed.count;
      }

      const nextMaterials = {
        ...prev.materials,
        runestone: prev.materials.runestone + (rewards.runestones || 0),
        ancient_gear: prev.materials.ancient_gear + (rewards.ancientGear || 0),
      };

      return {
        ...prev,
        seeds: nextSeeds,
        materials: nextMaterials,
      };
    });

    setHero((prev) => ({
      ...prev,
      coins: prev.coins + rewards.gold,
      manaCrystals: prev.manaCrystals + rewards.manaCrystals,
      totalDungeonsCleared: prev.totalDungeonsCleared + 1,
    }));

    addExp(200);
    updateQuestProgress('dungeon', 1);
    addToast(
      '🗝️ ไขปริศนาดันเจี้ยนสำเร็จ!',
      `เปิดหีบโบราณ ได้รับ +200 EXP, +${rewards.gold} 🪙, +${rewards.manaCrystals} 💎`,
      'achievement'
    );
  };

  // Camp Bed Rest
  const handleRestInBed = () => {
    sounds.playLevelUp();
    setHero((prev) => ({
      ...prev,
      hp: prev.maxHp,
    }));
    addToast('🛌 พักผ่อนเต็มอิ่ม!', 'ฟื้นฟูพลังชีวิต (HP) เต็ม 100% เรียบร้อยแล้ว!');
  };

  // Camp Upgrade
  const handleUpgradeCamp = (targetLevel: number) => {
    const upgradeInfo = CAMP_UPGRADES.find((c) => c.level === targetLevel);
    if (!upgradeInfo) return;

    if (
      hero.coins < upgradeInfo.costGold ||
      inventory.materials.magic_wood < upgradeInfo.costWood ||
      inventory.materials.runestone < upgradeInfo.costRunestone
    ) {
      addToast('⚠️ ทรัพยากรไม่เพียงพอ!', 'สะสมเหรียญ ไม้เวทมนตร์ และหินรูนให้ครบ', 'warning');
      return;
    }

    sounds.playLevelUp();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    setInventory((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        magic_wood: prev.materials.magic_wood - upgradeInfo.costWood,
        runestone: prev.materials.runestone - upgradeInfo.costRunestone,
      },
    }));

    setHero((prev) => ({
      ...prev,
      campLevel: targetLevel,
      coins: prev.coins - upgradeInfo.costGold,
      manaCrystals: Math.max(0, prev.manaCrystals - upgradeInfo.costCrystals),
      maxHp: prev.maxHp + upgradeInfo.maxHpBonus,
      hp: prev.maxHp + upgradeInfo.maxHpBonus,
      atk: prev.atk + upgradeInfo.atkBonus,
    }));

    updateQuestProgress('upgrade_camp', 1);
    addToast(
      `🏕️ ยกระดับแคมป์เป็น: ${upgradeInfo.title}!`,
      `เพิ่ม Max HP +${upgradeInfo.maxHpBonus}, ATK +${upgradeInfo.atkBonus}, พืชโตไวขึ้น +${upgradeInfo.growthSpeedBonus}%`,
      'achievement'
    );
  };

  // Alchemy Craft Recipe
  const handleCraftRecipe = (recipe: AlchemyRecipe) => {
    setInventory((prev) => {
      let nextWater = prev.waterBuckets;
      if (recipe.ingredients.waterCost) {
        nextWater = Math.max(0, nextWater - recipe.ingredients.waterCost);
      }

      const nextHarvested = { ...prev.harvested };
      if (recipe.ingredients.crops) {
        recipe.ingredients.crops.forEach((req) => {
          nextHarvested[req.cropId] = Math.max(0, (nextHarvested[req.cropId] || 0) - req.count);
        });
      }

      const nextMaterials = { ...prev.materials };
      if (recipe.ingredients.materials) {
        recipe.ingredients.materials.forEach((req) => {
          nextMaterials[req.material] = Math.max(0, (nextMaterials[req.material] || 0) - req.count);
        });
      }

      const nextPotions = { ...prev.potions };
      nextPotions[recipe.resultItem] = (nextPotions[recipe.resultItem] || 0) + recipe.resultCount;

      return {
        ...prev,
        waterBuckets: nextWater,
        harvested: nextHarvested,
        materials: nextMaterials,
        potions: nextPotions,
      };
    });

    sounds.playPotionBrew();
    setHero((prev) => ({
      ...prev,
      totalPotionsBrewed: prev.totalPotionsBrewed + recipe.resultCount,
    }));

    const expGain = recipe.expReward || 60;
    addExp(expGain);
    updateQuestProgress('alchemy', 1);
    addToast('🧪 ปรุงยาสำเร็จ!', `สร้าง ${recipe.name} x${recipe.resultCount} ขวด (+${expGain} EXP)`);
  };

  // Quest Claim
  const handleClaimQuest = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || !q.isCompleted || q.isClaimed) return;

    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, isClaimed: true } : item))
    );

    setHero((prev) => ({
      ...prev,
      coins: prev.coins + q.rewardGold,
      manaCrystals: prev.manaCrystals + q.rewardCrystals,
    }));

    if (q.rewardItems) {
      setInventory((prev) => {
        const nextPotions = { ...prev.potions };
        const nextMaterials = { ...prev.materials };

        (Object.keys(q.rewardItems || {}) as Array<keyof Inventory['potions'] | keyof Inventory['materials']>).forEach((key) => {
          const val = (q.rewardItems as any)[key] || 0;
          if (key in nextPotions) {
            (nextPotions as any)[key] = ((nextPotions as any)[key] || 0) + val;
          } else if (key in nextMaterials) {
            (nextMaterials as any)[key] = ((nextMaterials as any)[key] || 0) + val;
          }
        });

        return {
          ...prev,
          potions: nextPotions,
          materials: nextMaterials,
        };
      });
    }

    addExp(q.rewardExp);
    addToast('📜 รับรางวัลเควสต์สำเร็จ!', `+${q.rewardGold} 🪙, +${q.rewardCrystals} 💎, +${q.rewardExp} EXP`, 'achievement');
  };

  // Farming Actions
  const handlePlantSeed = (plotId: number, cropId: string) => {
    if ((inventory.seeds[cropId] || 0) <= 0) {
      addToast('เมล็ดพันธุ์หมด!', 'แวะซื้อเมล็ดที่ร้านค้าหรือรับจากเควสต์', 'warning');
      return;
    }

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

    updateQuestProgress('farm', 1);
    addToast('🌱 หยอดเมล็ดพันธุ์สำเร็จ!', `ปลูก ${CROPS_DATA[cropId]?.name} ในแปลงที่ ${plotId + 1}`);
  };

  const handleWaterPlot = (plotId: number) => {
    if (inventory.waterBuckets <= 0) {
      addToast('💧 น้ำหมด!', 'เล่นมินิเกมสายฝนหรือตอบควิซเพื่อรับน้ำเพิ่ม', 'warning');
      return;
    }

    sounds.playWater();
    setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets - 1 }));
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, waterLevel: Math.min(100, p.waterLevel + 50) } : p))
    );
    addToast('💧 รดน้ำเรียบร้อย!', 'ดินชุ่มชื้นพร้อมเร่งการสังเคราะห์แสง');
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
      addToast('🧪 ปุ๋ยไม่พอ!', 'เล่นมินิเกมแล็บสูตรปุ๋ยเพื่อผสมปุ๋ยใหม่', 'warning');
      return;
    }

    sounds.playPop();
    setInventory((prev) => ({ ...prev, [key]: prev[key] - 1 }));
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, fertilizerLevel: Math.min(100, p.fertilizerLevel + 50) } : p))
    );
    addToast('🧪 ใส่ปุ๋ยสำเร็จ!', `ใส่ปุ๋ย ${fertilizerType} เร่งการเจริญเติบโต`);
  };

  const handleHarvestPlot = (plotId: number) => {
    const plot = plots.find((p) => p.id === plotId);
    if (!plot || !plot.cropId || plot.stage < 4) return;

    const crop = CROPS_DATA[plot.cropId];
    if (!crop) return;

    sounds.playHarvest();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

    setInventory((prev) => ({
      ...prev,
      harvested: {
        ...prev.harvested,
        [crop.id]: (prev.harvested[crop.id] || 0) + 1,
      },
    }));

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

    setHero((prev) => ({
      ...prev,
      totalHarvests: prev.totalHarvests + 1,
      coins: prev.coins + crop.sellPrice,
    }));

    addExp(crop.expReward);
    updateQuestProgress('harvest', 1);
    addToast(`🌾 เก็บเกี่ยว ${crop.name}!`, `ได้รับ ${crop.sellPrice} 🪙 และ +${crop.expReward} EXP`, 'achievement');
  };

  const handleSprayPest = (plotId: number) => {
    if (inventory.pestSprays <= 0) {
      addToast('🧴 สเปรย์หมด!', 'เล่นมินิเกมผู้พิทักษ์แปลงผักเพื่อรับสเปรย์ชีวภาพ', 'warning');
      return;
    }

    sounds.playPop();
    setInventory((prev) => ({ ...prev, pestSprays: prev.pestSprays - 1 }));
    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, hasPest: false } : p)));
    addToast('🛡️ กำจัดศัตรูพืชสำเร็จ!', 'แปลงผักปลอดภัยแล้ว');
  };

  const handleTillPlot = (plotId: number) => {
    sounds.playPop();
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, isTilled: true } : p))
    );
    addToast('⛏️ พรวนดินสำเร็จ!', 'ดินร่วนซุย เพิ่มอัตราการโต +25%');
  };

  // Shop Handlers
  const handleBuySeed = (cropId: string, count: number, totalCost: number) => {
    if (hero.coins < totalCost) return;
    setHero((prev) => ({ ...prev, coins: prev.coins - totalCost }));
    setInventory((prev) => ({
      ...prev,
      seeds: {
        ...prev.seeds,
        [cropId]: (prev.seeds[cropId] || 0) + count,
      },
    }));
    addToast('🛒 ซื้อเมล็ดสำเร็จ!', `ซื้อ ${CROPS_DATA[cropId]?.name} x${count} ซอง`);
  };

  const handleSellHarvest = (cropId: string, count: number, totalEarnings: number) => {
    setInventory((prev) => ({
      ...prev,
      harvested: {
        ...prev.harvested,
        [cropId]: Math.max(0, (prev.harvested[cropId] || 0) - count),
      },
    }));
    setHero((prev) => ({ ...prev, coins: prev.coins + totalEarnings }));
    addToast('💰 ขายผลผลิตสำเร็จ!', `ได้รับเหรียญทอง +${totalEarnings} 🪙`);
  };

  const handleBuyWater = (count: number, cost: number) => {
    if (hero.coins < cost) return;
    setHero((prev) => ({ ...prev, coins: prev.coins - cost }));
    setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets + count }));
    addToast('💧 ซื้อน้ำสำเร็จ', `ได้รับน้ำ +${count} ถัง`);
  };

  const handleBuyFertilizer = (type: 'organic' | 'N' | 'P' | 'K', cost: number) => {
    if (hero.coins < cost) return;
    setHero((prev) => ({ ...prev, coins: prev.coins - cost }));
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
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 relative overflow-x-hidden">
      {/* Immersive Weather & Atmospheric FX Overlay */}
      <WeatherOverlay weather={currentWeather} time={inGameTime} />

      {/* RPG Top Navigation & Character Status Header */}
      <Header
        hero={hero}
        inventory={inventory}
        weather={currentWeather}
        time={inGameTime}
        onSetWeather={handleSetWeather}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          sounds.isMuted = !isMuted;
        }}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenWorldMap={() => setActiveTab('world_map')}
      />

      {/* Main RPG Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5 pb-24 space-y-4 relative z-10">
        {/* World Map View */}
        {activeTab === 'world_map' && (
          <WorldMapView
            stats={hero}
            onSelectLocation={handleSelectLocation}
            onStartBattle={handleStartBattle}
            onEnterDungeon={handleEnterDungeon}
            onOpenQuests={() => setActiveTab('quests')}
            onOpenCamp={() => setActiveTab('camp')}
          />
        )}

        {/* Camp & Magic Farm View */}
        {activeTab === 'camp' && (
          <CampView
            hero={hero}
            inventory={inventory}
            plots={plots}
            weather={currentWeather}
            time={inGameTime}
            onSetWeather={handleSetWeather}
            onSelectPlot={(p) => setSelectedPlot(p)}
            onQuickWater={handleWaterPlot}
            onQuickFertilize={(id) => handleFertilizePlot(id, 'organic')}
            onQuickHarvest={handleHarvestPlot}
            onQuickSpray={handleSprayPest}
            onTillPlot={handleTillPlot}
            onRestInBed={handleRestInBed}
            onUpgradeCamp={handleUpgradeCamp}
            onOpenShop={() => setActiveTab('shop')}
            onOpenAlchemy={() => setActiveTab('alchemy')}
            onOpenWorldMap={() => setActiveTab('world_map')}
          />
        )}

        {/* Combat Battle View */}
        {activeTab === 'battle' && (
          <BattleView
            monsterId={selectedMonsterId}
            hero={hero}
            inventory={inventory}
            onUpdateHeroHp={(newHp) => setHero((prev) => ({ ...prev, hp: newHp }))}
            onVictoryRewards={handleBattleVictory}
            onUsePotion={handleUsePotion}
            onBackToMap={() => setActiveTab('world_map')}
            onOpenCampToHeal={() => setActiveTab('camp')}
          />
        )}

        {/* Dungeon Puzzle View */}
        {activeTab === 'dungeon' && (
          <DungeonPuzzleView
            dungeonId={selectedDungeonId}
            hero={hero}
            onDungeonCleared={handleDungeonCleared}
            onBackToMap={() => setActiveTab('world_map')}
          />
        )}

        {/* Alchemy Lab View */}
        {activeTab === 'alchemy' && (
          <AlchemyView
            hero={hero}
            inventory={inventory}
            onCraftRecipe={handleCraftRecipe}
          />
        )}

        {/* Adventurer Quest Guild View */}
        {activeTab === 'quests' && (
          <QuestGuildView
            quests={quests}
            hero={hero}
            onClaimQuest={handleClaimQuest}
            onNavigateToTask={(taskType) => {
              if (taskType === 'battle') setActiveTab('world_map');
              else if (taskType === 'dungeon') setActiveTab('world_map');
              else if (taskType === 'alchemy') setActiveTab('alchemy');
              else if (taskType === 'farm' || taskType === 'harvest') setActiveTab('camp');
              else setActiveTab('world_map');
            }}
          />
        )}

        {/* Lore Codex & Cards View */}
        {activeTab === 'codex' && (
          <CodexView
            hero={hero}
            onAnswerQuizReward={(rewardType, amount) => {
              if (rewardType === 'exp') addExp(amount);
              else if (rewardType === 'water') setInventory((p) => ({ ...p, waterBuckets: p.waterBuckets + amount }));
              else if (rewardType === 'crystals') setHero((p) => ({ ...p, manaCrystals: p.manaCrystals + amount }));
              else if (rewardType === 'fertilizer') setInventory((p) => ({ ...p, fertilizerN: p.fertilizerN + amount, fertilizerP: p.fertilizerP + amount, fertilizerK: p.fertilizerK + amount }));
              addToast('🧠 ตอบถูก!', `ได้รับรางวัล +${amount} ${rewardType}`, 'achievement');
            }}
          />
        )}

        {/* Shop Market View */}
        {activeTab === 'shop' && (
          <ShopView
            stats={hero}
            inventory={inventory}
            onBuySeed={handleBuySeed}
            onSellHarvest={handleSellHarvest}
            onBuyWater={handleBuyWater}
            onBuyFertilizer={handleBuyFertilizer}
          />
        )}

        {/* Mini-Games Hub */}
        {activeTab === 'minigames' && (
          <MiniGamesHub
            onCollectWater={(w, c, e) => {
              setInventory((prev) => ({ ...prev, waterBuckets: prev.waterBuckets + w }));
              setHero((prev) => ({ ...prev, coins: prev.coins + c }));
              addExp(e);
              addToast('💧 กักเก็บน้ำสำเร็จ!', `+${w} ถังน้ำ, +${c} 🪙, +${e} EXP`);
            }}
            onQuizReward={(reward) => {
              setInventory((prev) => ({
                ...prev,
                waterBuckets: prev.waterBuckets + reward.water,
                fertilizerN: prev.fertilizerN + reward.fertilizerN,
                fertilizerP: prev.fertilizerP + reward.fertilizerP,
                fertilizerK: prev.fertilizerK + reward.fertilizerK,
              }));
              setHero((prev) => ({ ...prev, coins: prev.coins + reward.coins }));
              addExp(reward.exp);
              addToast('🧠 ควิซสำเร็จ!', `รับปุ๋ย NPK, น้ำ และ EXP ครบถ้วน!`, 'achievement');
            }}
            onQuizCorrect={() => {}}
            onMathReward={(reward) => {
              setInventory((prev) => ({
                ...prev,
                fertilizerOrganic: prev.fertilizerOrganic + reward.fertilizerOrganic,
                fertilizerN: prev.fertilizerN + reward.fertilizerN,
                fertilizerP: prev.fertilizerP + reward.fertilizerP,
                fertilizerK: prev.fertilizerK + reward.fertilizerK,
              }));
              setHero((prev) => ({ ...prev, coins: prev.coins + reward.coins }));
              addExp(reward.exp);
              addToast('🧪 สังเคราะห์ปุ๋ยสำเร็จ!', 'ได้รับปุ๋ยคุณภาพสูงนำไปบำรุงแปลงเกษตร');
            }}
            onSolveMath={() => {}}
            onPestReward={(reward) => {
              setInventory((prev) => ({ ...prev, pestSprays: prev.pestSprays + reward.pestSprays }));
              setHero((prev) => ({ ...prev, coins: prev.coins + reward.coins }));
              addExp(reward.exp);
              addToast('🛡️ ภารกิจลาดตระเวนสำเร็จ!', `ได้รับสเปรย์ชีวภาพ +${reward.pestSprays} ขวด`);
            }}
            onPestCleared={() => {}}
          />
        )}
      </main>

      {/* RPG Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-stone-900 py-1.5 px-3 shadow-[0_-4px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-1 overflow-x-auto">
          {[
            { id: 'camp', label: 'แคมป์/ฟาร์ม', icon: Home, emoji: '🏕️' },
            { id: 'world_map', label: 'แผนที่โลก', icon: Map, emoji: '🗺️' },
            { id: 'quests', label: 'กิลด์เควสต์', icon: Scroll, emoji: '📜' },
            { id: 'alchemy', label: 'ห้องปรุงยา', icon: FlaskConical, emoji: '🧪' },
            { id: 'codex', label: 'การ์ดความรู้', icon: BookOpen, emoji: '📚' },
            { id: 'shop', label: 'ร้านค้า', icon: ShoppingBag, emoji: '🏪' },
            { id: 'minigames', label: 'มินิเกม', icon: Gamepad2, emoji: '🎮' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as ActiveTab);
                }}
                className={`cursor-pointer flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-2xl transition-all shrink-0 ${
                  isActive
                    ? 'text-stone-950 font-black bg-amber-400 border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)] scale-105'
                    : 'text-stone-600 hover:text-stone-950 font-bold border-2 border-transparent'
                }`}
              >
                <span className="text-base sm:text-lg leading-none">{tab.emoji}</span>
                <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-black whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals & Overlays */}
      <PlotModal
        plot={selectedPlot}
        playerLevel={hero.level}
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
export default App;
