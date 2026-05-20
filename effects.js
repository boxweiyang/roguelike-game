// ============================================
// 状态效果系统 - Buff/Debuff管理
// ============================================

const BUFF_TYPES = {
  // 增益效果
  SPEED_BOOST: {
    id: "speed_boost",
    name: "加速",
    icon: "💨",
    type: "buff",
    color: "#2ecc71",
    description: "移动速度提升",
  },
  DAMAGE_BOOST: {
    id: "damage_boost",
    name: "攻击强化",
    icon: "⚔️",
    type: "buff",
    color: "#e74c3c",
    description: "伤害提升",
  },
  ARMOR_BOOST: {
    id: "armor_boost",
    name: "护盾",
    icon: "🛡️",
    type: "buff",
    color: "#3498db",
    description: "护甲提升",
  },
  REGEN: {
    id: "regen",
    name: "生命恢复",
    icon: "💚",
    type: "buff",
    color: "#2ecc71",
    description: "持续恢复生命",
    tickDamage: -5, // 负数表示治疗
  },
  CRIT_BOOST: {
    id: "crit_boost",
    name: "暴击强化",
    icon: "💥",
    type: "buff",
    color: "#f39c12",
    description: "暴击率提升",
  },

  // 减益效果
  SLOW: {
    id: "slow",
    name: "减速",
    icon: "🐌",
    type: "debuff",
    color: "#9b59b6",
    description: "移动速度降低",
  },
  POISON: {
    id: "poison",
    name: "中毒",
    icon: "☠️",
    type: "debuff",
    color: "#27ae60",
    description: "持续受到伤害",
    tickDamage: 8,
  },
  BURN: {
    id: "burn",
    name: "燃烧",
    icon: "🔥",
    type: "debuff",
    color: "#e67e22",
    description: "持续受到火焰伤害",
    tickDamage: 12,
  },
  FREEZE: {
    id: "freeze",
    name: "冰冻",
    icon: "❄️",
    type: "debuff",
    color: "#00ffff",
    description: "无法移动",
  },
  STUN: {
    id: "stun",
    name: "眩晕",
    icon: "💫",
    type: "debuff",
    color: "#f1c40f",
    description: "无法行动",
  },
  BLEED: {
    id: "bleed",
    name: "流血",
    icon: "🩸",
    type: "debuff",
    color: "#c0392b",
    description: "持续流血受伤",
    tickDamage: 6,
  },
  WEAKEN: {
    id: "weaken",
    name: "虚弱",
    icon: "😰",
    type: "debuff",
    color: "#95a5a6",
    description: "伤害降低",
  },
};

class EffectSystem {
  constructor() {
    this.effects = {};
  }

  // 添加效果
  addEffect(target, effectId, duration, stacks = 1, source = null) {
    if (!target.effects) {
      target.effects = [];
    }

    const effectDef = BUFF_TYPES[effectId.toUpperCase()];
    if (!effectDef) {
      console.warn(`未找到效果定义: ${effectId}`);
      return null;
    }

    // 检查是否已存在相同效果
    const existing = target.effects.find((e) => e.id === effectId);

    if (existing) {
      // 叠加层数或刷新持续时间
      if (existing.stacks < 10) {
        // 最多叠加10层
        existing.stacks += stacks;
      }
      existing.duration = Math.max(existing.duration, duration);
      existing.source = source;
      return existing;
    }

    // 创建新效果
    const effect = {
      id: effectId,
      name: effectDef.name,
      icon: effectDef.icon,
      type: effectDef.type,
      color: effectDef.color,
      description: effectDef.description,
      duration: duration, // 帧数
      maxDuration: duration,
      stacks: stacks,
      tickDamage: effectDef.tickDamage || 0,
      tickTimer: 0,
      tickInterval: 30, // 每30帧触发一次（约0.5秒）
      source: source,
      onApply: null,
      onRemove: null,
    };

    target.effects.push(effect);

    // 应用即时效果
    this.applyInstantEffect(target, effect);

    return effect;
  }

  // 应用即时效果
  applyInstantEffect(target, effect) {
    switch (effect.id) {
      case "freeze":
      case "stun":
        // 这些效果在更新时处理
        break;
    }
  }

  // 更新所有效果
  updateEffects(target) {
    if (!target.effects || target.effects.length === 0) return;

    target.effects = target.effects.filter((effect) => {
      effect.duration--;

      // 周期性伤害/治疗
      effect.tickTimer++;
      if (effect.tickTimer >= effect.tickInterval && effect.tickDamage !== 0) {
        effect.tickTimer = 0;

        const damage = effect.tickDamage * effect.stacks;
        if (damage > 0) {
          // 伤害
          if (target === gameState.player) {
            target.hp -= damage;
            addFloatingText(target.x, target.y, `-${damage}`, effect.color);
          } else {
            damageEnemy(target, damage, false);
          }
        } else if (damage < 0) {
          // 治疗
          const heal = Math.abs(damage);
          if (target === gameState.player) {
            target.hp = Math.min(target.maxHp, target.hp + heal);
            addFloatingText(target.x, target.y, `+${heal}`, "#2ecc71");
          }
        }
      }

      // 效果结束
      if (effect.duration <= 0) {
        this.removeEffect(target, effect);
        return false;
      }

      return true;
    });
  }

  // 移除效果
  removeEffect(target, effect) {
    const index = target.effects.indexOf(effect);
    if (index !== -1) {
      target.effects.splice(index, 1);
    }
  }

  // 清除所有效果
  clearAllEffects(target) {
    if (target.effects) {
      target.effects = [];
    }
  }

  // 清除指定类型的效果
  clearEffectsByType(target, type) {
    if (!target.effects) return;
    target.effects = target.effects.filter((e) => {
      if (e.type === type) {
        this.removeEffect(target, e);
        return false;
      }
      return true;
    });
  }

  // 检查是否有某个效果
  hasEffect(target, effectId) {
    if (!target.effects) return false;
    return target.effects.some((e) => e.id === effectId);
  }

  // 获取效果层数
  getEffectStacks(target, effectId) {
    if (!target.effects) return 0;
    const effect = target.effects.find((e) => e.id === effectId);
    return effect ? effect.stacks : 0;
  }

  // 获取移动速度修正
  getSpeedModifier(target) {
    if (!target.effects) return 1.0;

    let modifier = 1.0;
    target.effects.forEach((effect) => {
      switch (effect.id) {
        case "speed_boost":
          modifier += 0.3 * effect.stacks;
          break;
        case "slow":
          modifier -= 0.25 * effect.stacks;
          break;
        case "freeze":
          modifier = 0;
          break;
      }
    });

    return Math.max(0, Math.min(3.0, modifier));
  }

  // 获取伤害修正
  getDamageModifier(target) {
    if (!target.effects) return 1.0;

    let modifier = 1.0;
    target.effects.forEach((effect) => {
      switch (effect.id) {
        case "damage_boost":
          modifier += 0.2 * effect.stacks;
          break;
        case "weaken":
          modifier -= 0.15 * effect.stacks;
          break;
      }
    });

    return Math.max(0.1, Math.min(3.0, modifier));
  }

  // 获取暴击率修正
  getCritModifier(target) {
    if (!target.effects) return 0;

    let bonus = 0;
    target.effects.forEach((effect) => {
      if (effect.id === "crit_boost") {
        bonus += 0.1 * effect.stacks;
      }
    });

    return bonus;
  }

  // 检查是否可以行动
  canAct(target) {
    if (!target.effects) return true;
    return !target.effects.some((e) => e.id === "stun" || e.id === "freeze");
  }

  // 检查是否可以移动
  canMove(target) {
    if (!target.effects) return true;
    return !target.effects.some((e) => e.id === "freeze");
  }

  // 渲染效果图标
  renderEffects(target, offsetX, offsetY) {
    if (!target.effects || target.effects.length === 0) return;

    const iconSize = 20;
    const gap = 5;
    const startX = offsetX;
    const startY = offsetY - 40;

    target.effects.forEach((effect, index) => {
      const x = startX + index * (iconSize + gap);
      const y = startY;

      // 效果背景
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(x - 2, y - 2, iconSize + 4, iconSize + 4);

      // 效果图标
      ctx.font = `${iconSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(effect.icon, x + iconSize / 2, y + iconSize / 2);

      // 持续时间条
      const progress = effect.duration / effect.maxDuration;
      ctx.fillStyle = effect.color;
      ctx.fillRect(x, y + iconSize + 2, iconSize * progress, 3);

      // 层数
      if (effect.stacks > 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "right";
        ctx.fillText(effect.stacks, x + iconSize, y);
      }
    });
  }
}

// 创建全局实例
const effectSystem = new EffectSystem();
window.effectSystem = effectSystem;

console.log("状态效果系统加载完成");
