// ============================================
// 特殊事件系统 - 随机事件与限时挑战
// ============================================

const EVENT_TYPES = {
    // 商人来访
    MERCHANT: {
        id: 'merchant',
        name: '神秘商人',
        icon: '🧙‍♂️',
        description: '一个神秘商人出现了！',
        duration: 30, // 持续30秒
        color: '#f39c12'
    },
    // 宝箱雨
    CHEST_RAIN: {
        id: 'chest_rain',
        name: '宝箱雨',
        icon: '🎁',
        description: '天上掉下宝箱！',
        duration: 15,
        color: '#e74c3c'
    },
    // Boss突袭
    BOSS_RUSH: {
        id: 'boss_rush',
        name: 'Boss突袭',
        icon: '👹',
        description: '强大的Boss出现了！',
        duration: 60,
        color: '#c0392b'
    },
    // 限时挑战
    TIME_CHALLENGE: {
        id: 'time_challenge',
        name: '限时挑战',
        icon: '⏱️',
        description: '30秒内击杀20个敌人！',
        duration: 30,
        color: '#9b59b6'
    },
    // 双倍经验
    DOUBLE_XP: {
        id: 'double_xp',
        name: '双倍经验',
        icon: '✨',
        description: '接下来30秒经验翻倍！',
        duration: 30,
        color: '#3498db'
    },
    // 无敌时间
    INVINCIBLE: {
        id: 'invincible',
        name: '无敌时间',
        icon: '🌟',
        description: '10秒内无敌！',
        duration: 10,
        color: '#f1c40f'
    },
    // 精英怪潮
    ELITE_WAVE: {
        id: 'elite_wave',
        name: '精英怪潮',
        icon: '💀',
        description: '大量精英敌人出现！',
        duration: 45,
        color: '#e67e22'
    }
};

class EventSystem {
    constructor() {
        this.currentEvent = null;
        this.eventQueue = [];
        this.lastEventTime = 0;
        this.eventInterval = 60000; // 至少间隔60秒
        this.eventChance = 0.15; // 每次检查15%概率触发
        
        this.challenge = {
            active: false,
            type: null,
            target: 0,
            progress: 0,
            timeLeft: 0,
            reward: null
        };

        this.init();
    }

    init() {
        // 创建事件显示
        const eventDiv = document.createElement('div');
        eventDiv.id = 'event-display';
        eventDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 600;
            display: none;
            text-align: center;
        `;
        document.body.appendChild(eventDiv);

        // 创建挑战显示
        const challengeDiv = document.createElement('div');
        challengeDiv.id = 'challenge-display';
        challengeDiv.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            border: 2px solid #9b59b6;
            border-radius: 10px;
            padding: 15px 25px;
            pointer-events: none;
            z-index: 600;
            display: none;
        `;
        document.body.appendChild(challengeDiv);
    }

    // 检查是否触发事件
    checkEvent() {
        const now = Date.now();
        
        // 检查间隔
        if (now - this.lastEventTime < this.eventInterval) {
            return;
        }

        // 随机触发
        if (Math.random() > this.eventChance) {
            return;
        }

        // 随机选择事件类型
        const eventTypes = Object.values(EVENT_TYPES);
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        this.triggerEvent(eventType);
    }

    // 触发事件
    triggerEvent(eventType) {
        this.lastEventTime = Date.now();
        this.currentEvent = {
            ...eventType,
            startTime: Date.now(),
            endTime: Date.now() + eventType.duration * 1000
        };

        // 显示事件
        this.showEvent(eventType);

        // 执行事件效果
        this.executeEvent(eventType);

        // 通知系统
        if (notificationSystem) {
            notificationSystem.showNotification(
                `${eventType.icon} ${eventType.name}`,
                eventType.description,
                {
                    color: eventType.color,
                    duration: 3000
                }
            );
        }

        console.log(`事件触发: ${eventType.name}`);
    }

    // 显示事件
    showEvent(eventType) {
        const eventDiv = document.getElementById('event-display');
        if (!eventDiv) return;

        eventDiv.style.display = 'block';
        eventDiv.innerHTML = `
            <div style="
                font-size: 64px;
                animation: eventPopup 0.5s ease-out;
            ">
                ${eventType.icon}
            </div>
            <div style="
                font-size: 32px;
                font-weight: bold;
                color: ${eventType.color};
                text-shadow: 0 0 20px ${eventType.color};
                margin-top: 10px;
            ">
                ${eventType.name}
            </div>
            <div style="
                font-size: 18px;
                color: #fff;
                margin-top: 10px;
            ">
                ${eventType.description}
            </div>
        `;

        // 3秒后隐藏
        setTimeout(() => {
            eventDiv.style.display = 'none';
        }, 3000);
    }

    // 执行事件效果
    executeEvent(eventType) {
        switch (eventType.id) {
            case 'chest_rain':
                this.spawnChestRain();
                break;
            case 'boss_rush':
                this.spawnBossRush();
                break;
            case 'time_challenge':
                this.startChallenge('kill', 20, 30, { gold: 200, talentPoints: 5 });
                break;
            case 'double_xp':
                this.applyDoubleXP();
                break;
            case 'invincible':
                this.applyInvincible();
                break;
            case 'elite_wave':
                this.spawnEliteWave();
                break;
            case 'merchant':
                this.spawnMerchant();
                break;
        }
    }

    // 宝箱雨
    spawnChestRain() {
        const count = 10 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                gameState.chests.push({
                    x: randFloat(5, CONFIG.ARENA_SIZE - 5),
                    y: randFloat(5, CONFIG.ARENA_SIZE - 5),
                    type: ['gold', 'xp', 'rare'][Math.floor(Math.random() * 3)],
                    value: randFloat(20, 50),
                    lifetime: 20
                });
            }, i * 200);
        }
    }

    // Boss突袭
    spawnBossRush() {
        if (!gameState || !gameState.running) return;
        
        const bossTypes = Object.keys(BOSS_TYPES);
        const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 15;
        const bx = gameState.player.x + Math.cos(angle) * distance;
        const by = gameState.player.y + Math.sin(angle) * distance;
        
        spawnBoss(bossType, bx, by);
    }

    // 限时挑战
    startChallenge(type, target, time, reward) {
        this.challenge = {
            active: true,
            type: type,
            target: target,
            progress: 0,
            timeLeft: time,
            reward: reward
        };

        this.updateChallengeDisplay();
    }

    // 更新挑战进度
    updateChallengeProgress(amount = 1) {
        if (!this.challenge.active) return;

        this.challenge.progress += amount;

        // 检查是否完成
        if (this.challenge.progress >= this.challenge.target) {
            this.completeChallenge();
        }

        this.updateChallengeDisplay();
    }

    // 完成挑战
    completeChallenge() {
        this.challenge.active = false;

        // 发放奖励
        if (this.challenge.reward) {
            if (this.challenge.reward.gold && gameState.player) {
                gameState.player.gold += this.challenge.reward.gold;
                if (statisticsSystem) {
                    statisticsSystem.recordGold(this.challenge.reward.gold);
                }
            }
            if (this.challenge.reward.talentPoints) {
                persistentData.talentPoints += this.challenge.reward.talentPoints;
            }
        }

        // 通知
        if (notificationSystem) {
            notificationSystem.showNotification(
                '✅ 挑战完成！',
                `获得: ${this.challenge.reward.gold}💰 + ${this.challenge.reward.talentPoints}天赋点`,
                { color: '#2ecc71', duration: 5000 }
            );
        }

        this.updateChallengeDisplay();
    }

    // 更新挑战显示
    updateChallengeDisplay() {
        const challengeDiv = document.getElementById('challenge-display');
        if (!challengeDiv) return;

        if (!this.challenge.active) {
            challengeDiv.style.display = 'none';
            return;
        }

        challengeDiv.style.display = 'block';
        challengeDiv.innerHTML = `
            <div style="color: #9b59b6; font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                ⏱️ 限时挑战
            </div>
            <div style="color: #fff; font-size: 20px; margin-bottom: 5px;">
                ${this.challenge.progress}/${this.challenge.target}
            </div>
            <div style="color: #f39c12; font-size: 16px;">
                剩余时间: ${this.challenge.timeLeft}秒
            </div>
            <div style="color: #2ecc71; font-size: 14px; margin-top: 5px;">
                奖励: ${this.challenge.reward.gold}💰 + ${this.challenge.reward.talentPoints}⭐
            </div>
        `;
    }

    // 双倍经验
    applyDoubleXP() {
        if (!gameState || !gameState.playerStats) return;
        
        const originalXpBonus = gameState.playerStats.xpBonus;
        gameState.playerStats.xpBonus += 1.0; // +100%

        setTimeout(() => {
            if (gameState && gameState.playerStats) {
                gameState.playerStats.xpBonus = originalXpBonus;
            }
        }, 30000);
    }

    // 无敌时间
    applyInvincible() {
        if (!gameState || !gameState.player) return;
        
        const originalInvincible = gameState.player.invincible;
        gameState.player.invincible = true;

        setTimeout(() => {
            if (gameState && gameState.player) {
                gameState.player.invincible = originalInvincible;
            }
        }, 10000);
    }

    // 精英怪潮
    spawnEliteWave() {
        const count = 5 + Math.floor(Math.random() * 3);
        const eliteTypes = ['elite_vampire', 'elite_explosive', 'elite_shield'];

        for (let i = 0; i < count; i++) {
            const eliteType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
            const angle = Math.random() * Math.PI * 2;
            const distance = randFloat(10, 15);
            const ex = gameState.player.x + Math.cos(angle) * distance;
            const ey = gameState.player.y + Math.sin(angle) * distance;

            setTimeout(() => {
                spawnEnemy(eliteType, ex, ey);
            }, i * 500);
        }
    }

    // 商人
    spawnMerchant() {
        // TODO: 实现商人NPC
        console.log('商人来访 - 待实现');
    }

    // 更新事件
    update() {
        // 更新挑战倒计时
        if (this.challenge.active) {
            this.challenge.timeLeft -= 1/60; // 假设60fps
            
            if (this.challenge.timeLeft <= 0) {
                // 挑战失败
                this.challenge.active = false;
                
                if (notificationSystem) {
                    notificationSystem.showNotification(
                        '❌ 挑战失败',
                        '下次继续努力！',
                        { color: '#e74c3c', duration: 3000 }
                    );
                }
                
                this.updateChallengeDisplay();
            }
        }
    }
}

// 添加CSS动画
const eventStyle = document.createElement('style');
eventStyle.textContent = `
    @keyframes eventPopup {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(eventStyle);

// 创建全局实例
const eventSystem = new EventSystem();
window.eventSystem = eventSystem;

console.log('特殊事件系统初始化完成');
