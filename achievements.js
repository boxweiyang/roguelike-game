// ============================================
// 成就系统
// ============================================

const ACHIEVEMENTS = [
    // 新手成就 (5个)
    { id: 'first_blood', name: '第一滴血', description: '击杀第一个敌人', icon: '🩸', category: '新手', condition: (s) => s.totalKills >= 1, reward: { talentPoints: 3 } },
    { id: 'level_up', name: '初露锋芒', description: '到达5级', icon: '⭐', category: '新手', condition: (s) => s.maxLevel >= 5, reward: { talentPoints: 3 } },
    { id: 'first_extraction', name: '成功撤离', description: '第一次提取成功', icon: '🚁', category: '新手', condition: (s) => s.totalExtractions >= 1, reward: { talentPoints: 5 } },
    { id: 'ten_kills', name: '十连杀', description: '单局击杀10个敌人', icon: '💀', category: '新手', condition: (s) => s.singleRunKills >= 10, reward: { talentPoints: 3 } },
    { id: 'first_equip', name: '装备收集', description: '获得第一件装备', icon: '🎒', category: '新手', condition: (s) => s.totalEquipment >= 1, reward: { talentPoints: 3 } },
    
    // 战斗成就 (10个)
    { id: 'hundred_kills', name: '百战百胜', description: '累计击杀100个敌人', icon: '⚔️', category: '战斗', condition: (s) => s.totalKills >= 100, reward: { talentPoints: 10 } },
    { id: 'thousand_kills', name: '杀戮机器', description: '累计击杀1000个敌人', icon: '🗡️', category: '战斗', condition: (s) => s.totalKills >= 1000, reward: { talentPoints: 30 } },
    { id: 'boss_slayer', name: 'Boss终结者', description: '击杀10个Boss', icon: '👑', category: '战斗', condition: (s) => s.bossKills >= 10, reward: { talentPoints: 20 } },
    { id: 'speed_demon', name: '速度恶魔', description: '3分钟内击杀50个敌人', icon: '⚡', category: '战斗', condition: (s) => s.fastKills >= 50, reward: { talentPoints: 15 } },
    { id: 'untouchable', name: '无伤通关', description: '无伤提取成功', icon: '🏆', category: '战斗', condition: (s) => s.noHitExtraction >= 1, reward: { talentPoints: 50 } },
    
    // 收集成就 (8个)
    { id: 'equipment_collector', name: '装备收藏家', description: '收集50件不同装备', icon: '🎯', category: '收集', condition: (s) => s.uniqueEquipment >= 50, reward: { talentPoints: 15 } },
    { id: 'gold_hoarder', name: '金币大亨', description: '累计获得10000金币', icon: '💰', category: '收集', condition: (s) => s.totalGold >= 10000, reward: { talentPoints: 15 } },
    { id: 'all_skills', name: '全能大师', description: '单局获得所有技能', icon: '🌟', category: '收集', condition: (s) => s.allSkillsInRun >= 1, reward: { talentPoints: 30 } },
    { id: 'legendary_find', name: '传说发现', description: '获得第一件传说装备', icon: '💎', category: '收集', condition: (s) => s.legendaryFound >= 1, reward: { talentPoints: 20 } },
    
    // 挑战成就 (10个)
    { id: 'survivor', name: '生存专家', description: '存活超过30分钟', icon: '⏰', category: '挑战', condition: (s) => s.maxSurvivalTime >= 1800, reward: { talentPoints: 30 } },
    { id: 'level_master', name: '等级大师', description: '单局到达50级', icon: '📈', category: '挑战', condition: (s) => s.maxLevel >= 50, reward: { talentPoints: 25 } },
    { id: 'extraction_pro', name: '提取专家', description: '成功提取100次', icon: '🚀', category: '挑战', condition: (s) => s.totalExtractions >= 100, reward: { talentPoints: 50 } },
    { id: 'marathon', name: '马拉松', description: '累计游戏超过10小时', icon: '🏃', category: '挑战', condition: (s) => s.totalPlayTime >= 36000, reward: { talentPoints: 40 } },
    { id: 'perfectionist', name: '完美主义者', description: '完成所有其他成就', icon: '👑', category: '挑战', condition: (s) => s.achievementCount >= 30, reward: { talentPoints: 100 } }
];

// ============================================
// 任务系统
// ============================================

const DAILY_QUESTS = [
    { id: 'daily_kill_50', name: '今日杀戮', description: '击杀50个敌人', icon: '💀', target: 50, stat: 'dailyKills', reward: { gold: 100, materials: { common: 5 } } },
    { id: 'daily_reach_level_10', name: '等级冲刺', description: '到达10级', icon: '📈', target: 1, stat: 'dailyMaxLevel', reward: { gold: 80, materials: { common: 3 } } },
    { id: 'daily_survive_10min', name: '生存挑战', description: '存活10分钟', icon: '⏰', target: 600, stat: 'dailySurvivalTime', reward: { gold: 120, materials: { uncommon: 2 } } },
    { id: 'daily_collect_5_equip', name: '装备收集', description: '获得5件装备', icon: '🎒', target: 5, stat: 'dailyEquipment', reward: { gold: 150, materials: { common: 8 } } },
    { id: 'daily_use_3_skills', name: '技能大师', description: '获得3个不同技能', icon: '⚡', target: 3, stat: 'dailySkills', reward: { gold: 100, materials: { uncommon: 1 } } },
    { id: 'daily_gold_500', name: '金币猎人', description: '获得500金币', icon: '💰', target: 500, stat: 'dailyGold', reward: { materials: { common: 10 } } },
    { id: 'daily_chest_3', name: '宝箱猎人', description: '开启3个宝箱', icon: '📦', target: 3, stat: 'dailyChests', reward: { gold: 80, materials: { uncommon: 3 } } },
    { id: 'daily_search_5', name: '搜索专家', description: '完成5次搜索', icon: '🔍', target: 5, stat: 'dailySearches', reward: { gold: 100, materials: { common: 5 } } }
];

const WEEKLY_QUESTS = [
    { id: 'weekly_kill_500', name: '周杀戮', description: '本周击杀500个敌人', icon: '🗡️', target: 500, stat: 'weeklyKills', reward: { gold: 1000, materials: { rare: 5, uncommon: 10 } } },
    { id: 'weekly_extraction_5', name: '周撤离', description: '本周成功提取5次', icon: '🚁', target: 5, stat: 'weeklyExtractions', reward: { gold: 800, materials: { rare: 3, uncommon: 8 } } },
    { id: 'weekly_boss_3', name: 'Boss狩猎', description: '本周击杀3个Boss', icon: '👑', target: 3, stat: 'weeklyBossKills', reward: { gold: 600, materials: { rare: 4 } } },
    { id: 'weekly_level_30', name: '等级大师', description: '本周单局到达30级', icon: '📈', target: 1, stat: 'weeklyMaxLevel', reward: { gold: 500, materials: { rare: 2, uncommon: 5 } } },
    { id: 'weekly_play_10', name: '忠实玩家', description: '本周进行10局游戏', icon: '🎮', target: 10, stat: 'weeklyGames', reward: { gold: 400, materials: { uncommon: 15 } } }
];

// 检查成就
function checkAchievements() {
    const stats = getAchievementStats();
    let newAchievements = [];
    
    for (const ach of ACHIEVEMENTS) {
        if (persistentData.achievements.includes(ach.id)) continue;
        
        if (ach.condition(stats)) {
            persistentData.achievements.push(ach.id);
            newAchievements.push(ach);
            
            // 发放奖励
            if (ach.reward.talentPoints) {
                persistentData.talentPoints += ach.reward.talentPoints;
            }
            
            addLog(`成就解锁: ${ach.icon} ${ach.name} (+${ach.reward.talentPoints}天赋点)`, 'success');
        }
    }
    
    if (newAchievements.length > 0) {
        saveGame();
        updateUI();
    }
    
    return newAchievements;
}

// 获取成就统计
function getAchievementStats() {
    const p = typeof gameState !== 'undefined' ? gameState.player : null;
    const runKills = typeof gameState !== 'undefined' ? gameState.kills || 0 : 0;
    const runTime = typeof gameState !== 'undefined' ? gameState.time || 0 : 0;

    return {
        totalKills: persistentData.totalKills || 0,
        totalExtractions: persistentData.totalExtractions || 0,
        bossKills: persistentData.bossKills || 0,
        totalGold: persistentData.totalGold || 0,
        totalPlayTime: persistentData.totalPlayTime || 0,
        totalEquipment: persistentData.totalEquipment || 0,
        uniqueEquipment: (persistentData.uniqueEquipment || []).length,
        legendaryFound: persistentData.legendaryFound || 0,
        singleRunKills: runKills,
        fastKills: runTime <= 180 ? runKills : 0,
        allSkillsInRun: p && p.skills && p.skills.length >= Object.keys(SKILLS_DATA || {}).length ? 1 : 0,
        noHitExtraction: p && p.extracted && !p.wasHit ? 1 : 0,
        maxLevel: persistentData.highScoreLevel || 0,
        maxSurvivalTime: persistentData.maxSurvivalTime || 0,
        achievementCount: (persistentData.achievements || []).length
    };
}

// 获取每日任务（每天刷新3个）
function getDailyQuests() {
    const today = new Date().toDateString();
    
    if (!persistentData.dailyQuestDate || persistentData.dailyQuestDate !== today) {
        // 新的一天，刷新任务
        persistentData.dailyQuestDate = today;
        persistentData.currentDailyQuests = [];
        persistentData.dailyQuestProgress = {};
        persistentData.dailyQuestClaimed = [];
        
        const shuffled = [...DAILY_QUESTS].sort(() => Math.random() - 0.5);
        persistentData.currentDailyQuests = shuffled.slice(0, 3).map(q => q.id);
    }
    
    return persistentData.currentDailyQuests || [];
}

// 获取每周任务
function getWeeklyQuests() {
    const weekStart = getWeekStart();
    
    if (!persistentData.weeklyQuestDate || persistentData.weeklyQuestDate !== weekStart) {
        persistentData.weeklyQuestDate = weekStart;
        persistentData.currentWeeklyQuests = [];
        persistentData.weeklyQuestProgress = {};
        persistentData.weeklyQuestClaimed = [];
        
        const shuffled = [...WEEKLY_QUESTS].sort(() => Math.random() - 0.5);
        persistentData.currentWeeklyQuests = shuffled.slice(0, 3).map(q => q.id);
    }
    
    return persistentData.currentWeeklyQuests || [];
}

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toDateString();
}
