// ============================================
// 连击评分系统 - Combo & Rating
// ============================================

class ComboSystem {
  constructor() {
    this.combo = {
      count: 0,
      maxCombo: 0,
      lastKillTime: 0,
      comboWindow: 2000, // 2秒内连续击杀算连击
      damageDealt: 0,
      damageReceived: 0,
      timePlayed: 0,
      startTime: Date.now(),
    };

    this.rating = {
      grade: "D",
      score: 0,
      kills: 0,
      level: 0,
      time: 0,
      chestsOpened: 0,
      extractions: 0,
    };

    this.comboDisplay = {
      visible: false,
      x: 0,
      y: 0,
      scale: 1,
      alpha: 1,
      shake: 0,
    };

    this.init();
  }

  init() {
    // 创建连击显示元素
    const comboDiv = document.createElement("div");
    comboDiv.id = "combo-display";
    comboDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 500;
            display: none;
            text-align: center;
        `;
    document.body.appendChild(comboDiv);

    // 创建评级显示元素
    const ratingDiv = document.createElement("div");
    ratingDiv.id = "rating-display";
    ratingDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 50px;
            pointer-events: none;
            z-index: 500;
            display: none;
            text-align: right;
        `;
    document.body.appendChild(ratingDiv);
  }

  // 记录击杀
  recordKill(x, y) {
    const now = Date.now();
    const timeSinceLastKill = now - this.combo.lastKillTime;

    // 检查连击窗口
    if (timeSinceLastKill > this.combo.comboWindow) {
      this.combo.count = 1;
    } else {
      this.combo.count++;
    }

    this.combo.lastKillTime = now;

    // 更新最大连击
    if (this.combo.count > this.combo.maxCombo) {
      this.combo.maxCombo = this.combo.count;
    }

    // 显示连击
    if (this.combo.count >= 5) {
      // 5连击开始显示
      this.showCombo(this.combo.count, x, y);
    }

    // 更新统计
    if (statisticsSystem) {
      statisticsSystem.sessionStats.currentCombo = this.combo.count;
      statisticsSystem.sessionStats.maxCombo = Math.max(
        statisticsSystem.sessionStats.maxCombo,
        this.combo.count,
      );
    }
  }

  // 显示连击
  showCombo(count, x, y) {
    const comboDiv = document.getElementById("combo-display");
    if (!comboDiv) return;

    let color, size, text;

    if (count >= 100) {
      color = "#ff0000";
      size = "72px";
      text = "💀 MEGA KILL!";
    } else if (count >= 50) {
      color = "#ff6600";
      size = "64px";
      text = "🔥 GODLIKE!";
    } else if (count >= 30) {
      color = "#ff00ff";
      size = "56px";
      text = "⚡ UNSTOPPABLE!";
    } else if (count >= 20) {
      color = "#ffff00";
      size = "48px";
      text = "💥 RAMPAGE!";
    } else if (count >= 10) {
      color = "#00ffff";
      size = "40px";
      text = "✨ KILLING SPREE!";
    } else {
      color = "#ffffff";
      size = "36px";
      text = "⚔️ COMBO";
    }

    comboDiv.style.display = "block";
    comboDiv.innerHTML = `
            <div style="
                font-size: ${size};
                font-weight: bold;
                color: ${color};
                text-shadow: 0 0 20px ${color}, 0 0 40px ${color};
                animation: comboPulse 0.5s ease-in-out;
            ">
                ${count}
            </div>
            <div style="
                font-size: 24px;
                color: ${color};
                text-shadow: 0 0 10px ${color};
                margin-top: 10px;
            ">
                ${text}
            </div>
        `;

    // 2秒后隐藏
    clearTimeout(this.comboHideTimer);
    this.comboHideTimer = setTimeout(() => {
      comboDiv.style.display = "none";
    }, 2000);
  }

  // 记录伤害
  recordDamage(dealt, received) {
    this.combo.damageDealt += dealt;
    this.combo.damageReceived += received;
  }

  // 游戏结束时计算评级
  calculateRating(extracted) {
    const r = this.rating;
    let score = 0;

    // 击杀分数
    r.kills = gameState.kills;
    score += r.kills * 100;

    // 等级分数
    r.level = gameState.player.level;
    score += r.level * 50;

    // 时间分数
    r.time = gameState.time;
    score += r.time * 10;

    // 宝箱分数
    r.chestsOpened = gameState.chestsOpened || 0;
    score += r.chestsOpened * 200;

    // 撤离加成
    r.extractions = extracted ? 1 : 0;
    if (extracted) {
      score *= 1.5; // 撤离成功+50%
    }

    // 连击加成
    score += this.combo.maxCombo * 50;

    r.score = Math.floor(score);

    // 计算等级
    if (r.score >= 50000) r.grade = "SSS";
    else if (r.score >= 30000) r.grade = "SS";
    else if (r.score >= 20000) r.grade = "S";
    else if (r.score >= 15000) r.grade = "A";
    else if (r.score >= 10000) r.grade = "B";
    else if (r.score >= 5000) r.grade = "C";
    else r.grade = "D";

    return r;
  }

  // 显示评级
  showRating(extracted) {
    const rating = this.calculateRating(extracted);
    const ratingDiv = document.getElementById("rating-display");

    if (!ratingDiv) return;

    const gradeColors = {
      SSS: "#ff0000",
      SS: "#ff6600",
      S: "#ff00ff",
      A: "#ffff00",
      B: "#00ffff",
      C: "#00ff00",
      D: "#ffffff",
    };

    const color = gradeColors[rating.grade] || "#ffffff";

    ratingDiv.style.display = "block";
    ratingDiv.innerHTML = `
            <div style="
                font-size: 72px;
                font-weight: bold;
                color: ${color};
                text-shadow: 0 0 30px ${color};
                animation: ratingGlow 1s ease-in-out infinite;
            ">
                ${rating.grade}
            </div>
            <div style="
                font-size: 24px;
                color: #fff;
                margin-top: 10px;
            ">
                评分: ${rating.score.toLocaleString()}
            </div>
        `;
  }

  // 重置连击
  resetCombo() {
    this.combo.count = 0;
    this.combo.damageDealt = 0;
    this.combo.damageReceived = 0;
    this.combo.startTime = Date.now();

    const comboDiv = document.getElementById("combo-display");
    if (comboDiv) {
      comboDiv.style.display = "none";
    }
  }

  // 开始游戏
  startGame() {
    this.resetCombo();
    this.rating = {
      grade: "D",
      score: 0,
      kills: 0,
      level: 0,
      time: 0,
      chestsOpened: 0,
      extractions: 0,
    };

    const ratingDiv = document.getElementById("rating-display");
    if (ratingDiv) {
      ratingDiv.style.display = "none";
    }
  }

  // 更新连击衰减
  update() {
    const now = Date.now();
    if (
      now - this.combo.lastKillTime > this.combo.comboWindow &&
      this.combo.count > 0
    ) {
      this.combo.count = 0;

      const comboDiv = document.getElementById("combo-display");
      if (comboDiv) {
        comboDiv.style.display = "none";
      }
    }
  }
}

// 添加CSS动画
const comboStyle = document.createElement("style");
comboStyle.textContent = `
    @keyframes comboPulse {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes ratingGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.5); }
    }
`;
document.head.appendChild(comboStyle);

// 创建全局实例
const comboSystem = new ComboSystem();
window.comboSystem = comboSystem;

console.log("连击评分系统加载完成");
