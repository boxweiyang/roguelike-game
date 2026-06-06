// ============================================
// 通知系统 - UI/UX改进
// 用于显示成就解锁、任务完成等通知
// ============================================

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 5;
    this.container = null;
    this.init();
  }

  init() {
    // 创建通知容器
    this.container = document.createElement("div");
    this.container.id = "notification-container";
    this.container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
    document.body.appendChild(this.container);
  }

  // 显示成就解锁通知
  showAchievement(achievement) {
    this.show({
      type: "achievement",
      icon: achievement.icon || "🏆",
      title: "成就解锁！",
      message: achievement.name,
      description: achievement.description,
      duration: 5000,
      color: "#f39c12",
      reward: achievement.reward
        ? `+${achievement.reward.talentPoints} 天赋点`
        : null,
    });
  }

  // 显示任务完成通知
  showQuestComplete(quest) {
    this.show({
      type: "quest",
      icon: "✅",
      title: "任务完成！",
      message: quest.name,
      description: quest.description,
      duration: 4000,
      color: "#2ecc71",
      reward: this.formatQuestReward(quest.reward),
    });
  }

  // 显示升级通知
  showLevelUp(level) {
    this.show({
      type: "levelup",
      icon: "⬆️",
      title: "升级！",
      message: `等级 ${level}`,
      duration: 3000,
      color: "#9b59b6",
    });
  }

  // 显示Boss出现警告
  showBossWarning(bossName, bossIcon) {
    this.show({
      type: "warning",
      icon: bossIcon || "⚠️",
      title: "Boss出现！",
      message: bossName,
      duration: 5000,
      color: "#e74c3c",
      urgent: true,
    });
  }

  // 显示普通通知
  showNotification(title, message, options = {}) {
    this.show({
      type: options.type || "info",
      icon: options.icon || "ℹ️",
      title: title,
      message: message,
      description: options.description,
      duration: options.duration || 3000,
      color: options.color || "#3498db",
      reward: options.reward,
    });
  }

  // 显示通知
  show(config) {
    const notification = this.createNotification(config);
    this.notifications.push(notification);
    this.container.appendChild(notification.element);

    // 限制通知数量
    if (this.notifications.length > this.maxNotifications) {
      const old = this.notifications.shift();
      this.removeNotification(old);
    }

    // 自动移除
    if (config.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, config.duration);
    }

    // 播放音效（如果启用）
    if (
      config.urgent &&
      persistentData.visualSettings &&
      persistentData.visualSettings.soundEffects
    ) {
      this.playSound("warning");
    } else if (config.type === "achievement") {
      this.playSound("achievement");
    }
  }

  // 创建通知元素
  createNotification(config) {
    const element = document.createElement("div");
    element.className = "notification-item";
    element.style.cssText = `
            background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95));
            border: 2px solid ${config.color};
            border-radius: 12px;
            padding: 15px 20px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${config.color}40;
            animation: slideIn 0.3s ease-out;
            pointer-events: auto;
            cursor: pointer;
        `;

    let html = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 32px;">${config.icon}</div>
                <div style="flex: 1;">
                    <div style="color: ${config.color}; font-size: 12px; font-weight: bold; margin-bottom: 4px;">
                        ${config.title}
                    </div>
                    <div style="color: #fff; font-size: 16px; font-weight: bold; margin-bottom: 4px;">
                        ${config.message}
                    </div>
                    ${config.description ? `<div style="color: #aaa; font-size: 12px;">${config.description}</div>` : ""}
                    ${config.reward ? `<div style="color: #2ecc71; font-size: 13px; margin-top: 6px; font-weight: bold;">🎁 ${config.reward}</div>` : ""}
                </div>
            </div>
        `;

    element.innerHTML = html;

    // 点击关闭
    element.onclick = () => {
      this.removeNotification({ element });
    };

    // 悬停暂停
    element.onmouseenter = () => {
      element.style.animationPlayState = "paused";
    };

    return { element, config };
  }

  // 移除通知
  removeNotification(notification) {
    const index = this.notifications.indexOf(notification);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }

    if (notification.element && notification.element.parentNode) {
      notification.element.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
        }
      }, 300);
    }
  }

  // 清除所有通知
  clearAll() {
    while (this.notifications.length > 0) {
      this.removeNotification(this.notifications[0]);
    }
  }

  // 格式化任务奖励
  formatQuestReward(reward) {
    if (!reward) return null;

    const parts = [];
    if (reward.gold) parts.push(`${reward.gold}💰`);
    if (reward.materials) {
      for (const [type, count] of Object.entries(reward.materials)) {
        const names = {
          common: "普通",
          uncommon: "稀有",
          rare: "史诗",
          epic: "传说",
        };
        parts.push(`${count}${names[type] || type}`);
      }
    }

    return parts.length > 0 ? parts.join(" + ") : null;
  }

  // 播放音效（预留接口）
  playSound(type) {
    // TODO: 实现音效系统
    // const audio = new Audio(`sounds/${type}.mp3`);
    // audio.play();
  }
}

// 添加CSS动画
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-item:hover {
        transform: scale(1.02);
        transition: transform 0.2s;
    }
`;
document.head.appendChild(style);

// 创建全局实例
const notificationSystem = new NotificationSystem();
window.notificationSystem = notificationSystem;

// 重写checkAchievements函数以添加通知
const originalCheckAchievements = window.checkAchievements;
if (originalCheckAchievements) {
  window.checkAchievements = function () {
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

        addLog(
          `成就解锁: ${ach.icon} ${ach.name} (+${ach.reward.talentPoints}天赋点)`,
          "success",
        );

        // 显示通知
        notificationSystem.showAchievement(ach);
      }
    }

    if (newAchievements.length > 0) {
      saveGame();
      updateUI();
    }

    return newAchievements;
  };
}

console.log("通知系统初始化完成");
