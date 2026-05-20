// ============================================
// 数据统计系统 - 详细的游戏数据分析
// ============================================

class StatisticsSystem {
  constructor() {
    this.sessionStats = {
      // 基础统计
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalTimePlayed: 0,

      // 战斗统计
      meleeKills: 0,
      rangedKills: 0,
      skillKills: {},
      criticalHits: 0,
      totalShots: 0,
      shotsHit: 0,

      // 经济统计
      totalGoldEarned: 0,
      totalGoldSpent: 0,
      chestsOpened: 0,
      itemsPickedUp: 0,

      // 升级统计
      maxLevel: 0,
      skillsUnlocked: [],
      skillsUpgraded: {},

      // 特殊统计
      bossesKilled: 0,
      extractions: 0,
      enemiesDodged: 0,
      maxCombo: 0,
      currentCombo: 0,

      // 时间统计
      startTime: Date.now(),
      lastKillTime: 0,
      fastestKill: Infinity,
    };

    this.damageLog = [];
    this.killTimeline = [];
    this.levelTimeline = [];

    this.init();
  }

  init() {
    // 从持久化数据加载历史统计
    if (!persistentData.allTimeStats) {
      persistentData.allTimeStats = {
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        totalGamesLost: 0,
        allTimeKills: 0,
        allTimeDamage: 0,
        bestKillRecord: 0,
        bestSurvivalTime: 0,
        totalPlayTime: 0,
        favoriteSkill: {},
        achievementsUnlocked: 0,
      };
    }
  }

  // 记录伤害
  recordDamage(damage, isCritical, target, skillId) {
    this.sessionStats.totalDamageDealt += damage;

    if (isCritical) {
      this.sessionStats.criticalHits++;
    }

    // 记录伤害日志
    this.damageLog.push({
      time: Date.now(),
      damage: damage,
      critical: isCritical,
      target: target,
      skill: skillId,
      gameTime: gameState.time,
    });

    // 限制日志大小
    if (this.damageLog.length > 1000) {
      this.damageLog = this.damageLog.slice(-500);
    }
  }

  // 记录受到伤害
  recordDamageReceived(damage, source) {
    this.sessionStats.totalDamageReceived += damage;
  }

  // 记录击杀
  recordKill(enemyType, skillId, isBoss = false) {
    const now = Date.now();
    this.sessionStats.totalKills++;

    // 更新连击
    const timeSinceLastKill = now - this.sessionStats.lastKillTime;
    if (timeSinceLastKill < 3000) {
      // 3秒内击杀算连击
      this.sessionStats.currentCombo++;
      if (this.sessionStats.currentCombo > this.sessionStats.maxCombo) {
        this.sessionStats.maxCombo = this.sessionStats.currentCombo;
      }
    } else {
      this.sessionStats.currentCombo = 1;
    }

    this.sessionStats.lastKillTime = now;

    // 记录最快击杀
    if (
      timeSinceLastKill < this.sessionStats.fastestKill &&
      this.sessionStats.totalKills > 1
    ) {
      this.sessionStats.fastestKill = timeSinceLastKill;
    }

    // 按类型统计
    if (isBoss) {
      this.sessionStats.bossesKilled++;
    }

    // 按技能统计
    if (skillId) {
      if (!this.sessionStats.skillKills[skillId]) {
        this.sessionStats.skillKills[skillId] = 0;
      }
      this.sessionStats.skillKills[skillId]++;
    }

    // 近战/远程统计
    const skill = SKILLS[skillId];
    if (skill) {
      if (skill.type === "melee") {
        this.sessionStats.meleeKills++;
      } else if (skill.type === "ranged") {
        this.sessionStats.rangedKills++;
      }
    }

    // 记录时间线
    this.killTimeline.push({
      time: now,
      enemyType: enemyType,
      skill: skillId,
      gameTime: gameState.time,
      combo: this.sessionStats.currentCombo,
    });
  }

  // 记录射击
  recordShot(hit) {
    this.sessionStats.totalShots++;
    if (hit) {
      this.sessionStats.shotsHit++;
    }
  }

  // 记录金币
  recordGold(amount, isSpent = false) {
    if (isSpent) {
      this.sessionStats.totalGoldSpent += amount;
    } else {
      this.sessionStats.totalGoldEarned += amount;
    }
  }

  // 记录升级
  recordLevelUp(level, skillId) {
    this.sessionStats.maxLevel = Math.max(this.sessionStats.maxLevel, level);

    if (skillId) {
      if (!this.sessionStats.skillsUnlocked.includes(skillId)) {
        this.sessionStats.skillsUnlocked.push(skillId);
      }

      if (!this.sessionStats.skillsUpgraded[skillId]) {
        this.sessionStats.skillsUpgraded[skillId] = 0;
      }
      this.sessionStats.skillsUpgraded[skillId]++;
    }

    // 记录时间线
    this.levelTimeline.push({
      time: Date.now(),
      level: level,
      gameTime: gameState.time,
    });
  }

  // 记录宝箱
  recordChestOpened() {
    this.sessionStats.chestsOpened++;
  }

  // 记录拾取
  recordItemPickup() {
    this.sessionStats.itemsPickedUp++;
  }

  // 记录撤离
  recordExtraction() {
    this.sessionStats.extractions++;
  }

  // 游戏结束时统计
  onGameEnd(extracted) {
    const endTime = Date.now();
    const playTime = (endTime - this.sessionStats.startTime) / 1000;
    this.sessionStats.totalTimePlayed = playTime;

    // 更新全局统计
    persistentData.allTimeStats.totalGamesPlayed++;
    if (extracted) {
      persistentData.allTimeStats.totalGamesWon++;
    } else {
      persistentData.allTimeStats.totalGamesLost++;
    }

    persistentData.allTimeStats.allTimeKills += this.sessionStats.totalKills;
    persistentData.allTimeStats.allTimeDamage +=
      this.sessionStats.totalDamageDealt;
    persistentData.allTimeStats.totalPlayTime += playTime;

    if (
      this.sessionStats.totalKills > persistentData.allTimeStats.bestKillRecord
    ) {
      persistentData.allTimeStats.bestKillRecord = this.sessionStats.totalKills;
    }

    if (playTime > persistentData.allTimeStats.bestSurvivalTime) {
      persistentData.allTimeStats.bestSurvivalTime = playTime;
    }

    // 更新最常用技能
    let topSkill = null;
    let topSkillKills = 0;
    for (const [skillId, kills] of Object.entries(
      this.sessionStats.skillKills,
    )) {
      if (kills > topSkillKills) {
        topSkillKills = kills;
        topSkill = skillId;
      }
    }

    if (topSkill) {
      if (!persistentData.allTimeStats.favoriteSkill[topSkill]) {
        persistentData.allTimeStats.favoriteSkill[topSkill] = 0;
      }
      persistentData.allTimeStats.favoriteSkill[topSkill]++;
    }

    saveGame();
  }

  // 获取命中率
  getAccuracy() {
    if (this.sessionStats.totalShots === 0) return 0;
    return (
      (this.sessionStats.shotsHit / this.sessionStats.totalShots) *
      100
    ).toFixed(1);
  }

  // 获取暴击率
  getCriticalRate() {
    const totalHits = this.sessionStats.criticalHits;
    const totalActions = this.sessionStats.totalDamageDealt;
    if (totalActions === 0) return 0;
    return (
      (this.sessionStats.criticalHits /
        Math.max(1, this.sessionStats.totalKills)) *
      100
    ).toFixed(1);
  }

  // 获取DPS
  getDPS() {
    const playTime = this.sessionStats.totalTimePlayed || 1;
    return (this.sessionStats.totalDamageDealt / playTime).toFixed(1);
  }

  // 获取KPM（每分钟击杀）
  getKPM() {
    const playTimeMinutes = this.sessionStats.totalTimePlayed / 60 || 1;
    return (this.sessionStats.totalKills / playTimeMinutes).toFixed(1);
  }

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // 显示统计面板
  showStatisticsPanel() {
    const panel = document.getElementById("statistics-panel");
    if (!panel) {
      this.createStatisticsPanel();
    }

    this.updateStatisticsPanel();
  }

  // 创建统计面板
  createStatisticsPanel() {
    const panel = document.createElement("div");
    panel.id = "statistics-panel";
    panel.className = "statistics-panel";
    panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.98));
            border: 2px solid #3498db;
            border-radius: 15px;
            padding: 30px;
            min-width: 600px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 30px rgba(52,152,219,0.3);
            z-index: 1000;
            display: none;
        `;

    document.body.appendChild(panel);

    // 创建关闭按钮
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✖";
    closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #e74c3c;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        `;
    closeBtn.onclick = () => this.hideStatisticsPanel();
    panel.appendChild(closeBtn);
  }

  // 更新统计面板
  updateStatisticsPanel() {
    const panel = document.getElementById("statistics-panel");
    if (!panel) return;

    const stats = this.sessionStats;
    const allTime = persistentData.allTimeStats;

    let html = `
            <h2 style="color: #3498db; margin-bottom: 20px; text-align: center;">📊 游戏数据统计</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- 本局统计 -->
                <div style="background: rgba(52,152,219,0.1); padding: 15px; border-radius: 10px;">
                    <h3 style="color: #3498db; margin-bottom: 10px;">🎮 本局统计</h3>
                    <div style="color: #fff; line-height: 2;">
                        <div>⏱️ 游戏时长: <span style="color: #f39c12">${this.formatTime(stats.totalTimePlayed)}</span></div>
                        <div>⚔️ 总伤害: <span style="color: #e74c3c">${stats.totalDamageDealt.toLocaleString()}</span></div>
                        <div>💀 总击杀: <span style="color: #e74c3c">${stats.totalKills}</span></div>
                        <div>🎯 命中率: <span style="color: #2ecc71">${this.getAccuracy()}%</span></div>
                        <div>💥 暴击次数: <span style="color: #f39c12">${stats.criticalHits}</span></div>
                        <div>📈 DPS: <span style="color: #e74c3c">${this.getDPS()}</span></div>
                        <div>⚡ KPM: <span style="color: #9b59b6">${this.getKPM()}</span></div>
                        <div>🔥 最高连击: <span style="color: #e67e22">${stats.maxCombo}</span></div>
                    </div>
                </div>
                
                <!-- 战斗统计 -->
                <div style="background: rgba(231,76,60,0.1); padding: 15px; border-radius: 10px;">
                    <h3 style="color: #e74c3c; margin-bottom: 10px;">⚔️ 战斗分析</h3>
                    <div style="color: #fff; line-height: 2;">
                        <div>🗡️ 近战击杀: <span style="color: #f39c12">${stats.meleeKills}</span></div>
                        <div>🔫 远程击杀: <span style="color: #f39c12">${stats.rangedKills}</span></div>
                        <div>👹 Boss击杀: <span style="color: #e74c3c">${stats.bossesKilled}</span></div>
                        <div>💔 受到伤害: <span style="color: #e74c3c">${stats.totalDamageReceived.toLocaleString()}</span></div>
                        <div>🛡️ 伤害比: <span style="color: #2ecc71">${(stats.totalDamageDealt / Math.max(1, stats.totalDamageReceived)).toFixed(1)}:1</span></div>
                        <div>🎲 总射击: <span style="color: #3498db">${stats.totalShots}</span></div>
                        <div>✅ 命中数: <span style="color: #2ecc71">${stats.shotsHit}</span></div>
                    </div>
                </div>
                
                <!-- 经济统计 -->
                <div style="background: rgba(46,204,113,0.1); padding: 15px; border-radius: 10px;">
                    <h3 style="color: #2ecc71; margin-bottom: 10px;">💰 经济统计</h3>
                    <div style="color: #fff; line-height: 2;">
                        <div>💵 获得金币: <span style="color: #f1c40f">${stats.totalGoldEarned.toLocaleString()}</span></div>
                        <div>💸 消耗金币: <span style="color: #e74c3c">${stats.totalGoldSpent.toLocaleString()}</span></div>
                        <div>📦 开启宝箱: <span style="color: #3498db">${stats.chestsOpened}</span></div>
                        <div>🎁 拾取物品: <span style="color: #9b59b6">${stats.itemsPickedUp}</span></div>
                        <div>🏆 撤离次数: <span style="color: #2ecc71">${stats.extractions}</span></div>
                        <div>📊 最高等级: <span style="color: #f39c12">Lv.${stats.maxLevel}</span></div>
                    </div>
                </div>
                
                <!-- 生涯统计 -->
                <div style="background: rgba(155,89,182,0.1); padding: 15px; border-radius: 10px;">
                    <h3 style="color: #9b59b6; margin-bottom: 10px;">🏆 生涯统计</h3>
                    <div style="color: #fff; line-height: 2;">
                        <div>🎮 总游戏: <span style="color: #3498db">${allTime.totalGamesPlayed}</span></div>
                        <div>✅ 胜利: <span style="color: #2ecc71">${allTime.totalGamesWon}</span> / ❌ 失败: <span style="color: #e74c3c">${allTime.totalGamesLost}</span></div>
                        <div>🏅 胜率: <span style="color: #f39c12">${((allTime.totalGamesWon / Math.max(1, allTime.totalGamesPlayed)) * 100).toFixed(1)}%</span></div>
                        <div>💀 总击杀: <span style="color: #e74c3c">${allTime.allTimeKills.toLocaleString()}</span></div>
                        <div>📈 最佳记录: <span style="color: #f1c40f">${allTime.bestKillRecord}杀</span></div>
                        <div>⏱️ 最长生存: <span style="color: #9b59b6">${this.formatTime(allTime.bestSurvivalTime)}</span></div>
                        <div>⏰ 总时长: <span style="color: #3498db">${this.formatTime(allTime.totalPlayTime)}</span></div>
                    </div>
                </div>
            </div>
            
            <!-- 技能使用统计 -->
            ${
              Object.keys(stats.skillKills).length > 0
                ? `
            <div style="margin-top: 20px; background: rgba(243,156,18,0.1); padding: 15px; border-radius: 10px;">
                <h3 style="color: #f39c12; margin-bottom: 10px;">🎯 技能使用统计</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    ${Object.entries(stats.skillKills)
                      .map(([skillId, kills]) => {
                        const skill = SKILLS[skillId];
                        return skill
                          ? `
                            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px;">${skill.icon}</div>
                                <div style="color: #fff; font-size: 12px; margin: 5px 0;">${skill.name}</div>
                                <div style="color: #f39c12; font-size: 18px; font-weight: bold;">${kills}杀</div>
                            </div>
                        `
                          : "";
                      })
                      .join("")}
                </div>
            </div>
            `
                : ""
            }
        `;

    panel.innerHTML = html;
    panel.appendChild(panel.querySelector("button")); // 保留关闭按钮

    panel.style.display = "block";
  }

  // 隐藏统计面板
  hideStatisticsPanel() {
    const panel = document.getElementById("statistics-panel");
    if (panel) {
      panel.style.display = "none";
    }
  }

  // 获取统计数据（用于其他系统）
  getStats() {
    return {
      session: this.sessionStats,
      allTime: persistentData.allTimeStats,
      accuracy: this.getAccuracy(),
      criticalRate: this.getCriticalRate(),
      dps: this.getDPS(),
      kpm: this.getKPM(),
    };
  }
}

// 创建全局实例
const statisticsSystem = new StatisticsSystem();
window.statisticsSystem = statisticsSystem;

// 快捷键打开统计面板
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && gameState && gameState.running) {
    e.preventDefault();
    statisticsSystem.showStatisticsPanel();
  }
});

console.log("数据统计系统初始化完成");
