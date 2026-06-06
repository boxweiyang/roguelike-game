// ============================================
// 游戏配置 - 常量定义
// ============================================

const CONFIG = {
  // 场地
  ARENA_SIZE: 50,
  TILE_SIZE: 40, // 从32提升到40，让地图更舒适
  CANVAS_WIDTH: 1280, // 从900提升到1280
  CANVAS_HEIGHT: 800, // 从600提升到800

  // 玩家基础属性
  PLAYER: {
    BASE_HP: 150, // 基础生命（提高到150）
    BASE_SPEED: 4, // 格/秒
    BASE_PICKUP_RANGE: 1.5, // 格
    BASE_CRITICAL_CHANCE: 0.05, // 5%
    BASE_CRITICAL_DAMAGE: 1.5, // 150%（降低）
    BASE_ARMOR: 5, // 基础护甲
    BASE_DAMAGE_REDUCTION: 0.1, // 基础减伤10%

    // 每级成长（优化：提高生存能力）
    HP_PER_LEVEL: 18, // 每级+18HP（原15，提升20%）
    DAMAGE_PER_LEVEL: 3, // 每级+3伤害
    ARMOR_PER_LEVEL: 1, // 每级+1护甲
  },

  // 敌人生成（优化：改善难度曲线）
  ENEMY: {
    SPAWN_INTERVAL: 3000, // 毫秒
    SPAWN_RADIUS_MIN: 15,
    SPAWN_RADIUS_MAX: 20,
    MAX_COUNT: 250,

    // 敌人属性倍数（相对于玩家）
    BASE_ATK_MULT: 0.07, // 基础攻击为玩家HP的7%（原8%，降低12.5%）
    BASE_HP_MULT: 0.18, // 基础HP为玩家HP的18%（原20%，降低10%）
    ATK_SCALE_PER_MIN: 0.04, // 每分钟攻击+4%（原5%，更平缓）
    HP_SCALE_PER_MIN: 0.08, // 每分钟HP+8%（原10%，更平缓）
  },

  // 宝箱
  CHEST: {
    SPAWN_INTERVAL: 15000, // 毫秒
    MAX_COUNT: 5,
    LIFETIME: 25, // 秒
  },

  // 搜索点
  SEARCH_POINT: {
    SPAWN_INTERVAL: 10000, // 毫秒
    MAX_COUNT: 3,
    SEARCH_TIME: 2, // 搜索需要秒数
    RADIUS: 2, // 搜索范围（格）
    DROP_COUNT_MIN: 1, // 最少掉落
    DROP_COUNT_MAX: 3, // 最多掉落
    EQUIPMENT_CHANCE: 0.3, // 30% 掉落装备
    HEAL_CHANCE: 0.4, // 40% 掉落血药
    GOLD_CHANCE: 0.8, // 80% 掉落金币
    XP_CHANCE: 0.5, // 50% 掉落经验
  },

  // 升级
  LEVEL: {
    BASE_XP: 40,
    MULTIPLIER: 1.5,
    CARD_CHOICES: 3,
  },

  // 装备掉落（优化：提高掉落率）
  EQUIPMENT: {
    DROP_CHANCE: 0.12, // 12%掉落率（原8%，提升50%）
    RARITY_WEIGHTS: {
      common: 55, // 普通 55%（原60%）
      uncommon: 25, // 优秀 25%
      rare: 12, // 稀有 12%（原10%）
      epic: 6, // 史诗 6%（原4%）
      legendary: 2, // 传说 2%（原1%）
    },
  },

  // 无尽模式
  ENDLESS: {
    ENABLED: true,
    DIFFICULTY_SCALE: 0.15, // 每波难度增加15%
    BOSS_INTERVAL: 10, // 每10波出现Boss
    REWARD_SCALE: 0.1, // 每波奖励增加10%
  },

  // Boss系统
  BOSS: {
    SPAWN_CHANCE: 0.05, // 5%生成Boss
    MIN_TIME: 120, // 最小生成时间（秒）
    TYPES: ["giant_zombie", "demon_lord", "dragon", "lich", "abomination"],
  },

  // 锻造系统
  FORGING: {
    ENABLED: true,
    REROLL_COST: 50, // 重铸基础金币消耗
    UPGRADE_COST_BASE: 100, // 升级基础金币消耗
    MATERIAL_TYPES: ["common", "uncommon", "rare", "epic", "legendary"],
  },

  // 套装系统
  SETS: {
    warrior: {
      name: "战士套装",
      pieces: ["weapon", "chest", "boots"],
      bonuses: {
        2: { damage: 0.15, armor: 10 },
        3: { damage: 0.3, armor: 25, lifeSteal: 0.1 },
      },
    },
    mage: {
      name: "法师套装",
      pieces: ["weapon", "chest", "accessory"],
      bonuses: {
        2: { skillDamage: 0.2, cooldownReduction: 0.1 },
        3: { skillDamage: 0.4, cooldownReduction: 0.25, projectileCount: 1 },
      },
    },
    rogue: {
      name: "刺客套装",
      pieces: ["weapon", "boots", "accessory"],
      bonuses: {
        2: { criticalChance: 0.15, moveSpeed: 0.1 },
        3: { criticalChance: 0.25, criticalDamage: 0.5, dodge: 0.15 },
      },
    },
  },
};

// ============================================
// 装备稀有度
// ============================================

const RARITY = {
  common: {
    name: "普通",
    color: "#95a5a6",
    multiplier: 1.0,
    maxAffixes: 1,
  },
  uncommon: {
    name: "优秀",
    color: "#2ecc71",
    multiplier: 1.3,
    maxAffixes: 2,
  },
  rare: {
    name: "稀有",
    color: "#3498db",
    multiplier: 1.6,
    maxAffixes: 3,
  },
  epic: {
    name: "史诗",
    color: "#9b59b6",
    multiplier: 2.0,
    maxAffixes: 4,
  },
  legendary: {
    name: "传说",
    color: "#f39c12",
    multiplier: 2.5,
    maxAffixes: 5,
  },
};

// ============================================
// 装备槽位
// ============================================

const EQUIPMENT_SLOT = {
  WEAPON: "weapon",
  CHEST: "chest",
  BOOTS: "boots",
  ACCESSORY: "accessory",
};

// ============================================
// 武器类型
// ============================================

const WEAPON_TYPE = {
  SWORD: "sword", // 近战剑
  BOW: "bow", // 远程弓
  STAFF: "staff", // 法杖
};

// ============================================
// 技能进化系统
// ============================================

const SKILL_EVOLUTION = {
  slash: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "slash_wide",
            name: "宽刃斩",
            description: "范围+50%，伤害+20%",
            effect: { rangeMult: 1.5, damageMult: 1.2 },
          },
          {
            id: "slash_fast",
            name: "快速斩",
            description: "冷却-30%，伤害-10%",
            effect: { cooldownMult: 0.7, damageMult: 0.9 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "slash_spin",
            name: "旋转斩",
            description: "360度旋转攻击，范围+30%",
            effect: { isSpin: true, rangeMult: 1.3 },
          },
          {
            id: "slash_double",
            name: "双重斩",
            description: "攻击2次，伤害各-20%",
            effect: { hitCount: 2, damageMult: 0.8 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "slash_tornado",
            name: "龙卷风斩",
            description: "产生龙卷风追踪敌人",
            effect: { hasTornado: true, damageMult: 1.5, rangeMult: 1.4 },
          },
          {
            id: "slash_void",
            name: "虚空斩",
            description: "穿透敌人，吸血+20%",
            effect: { pierce: true, lifeSteal: 0.2 },
          },
        ],
      },
    ],
  },
  whirlwind: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "whirlwind_big",
            name: "大风暴",
            description: "范围+40%，速度-20%",
            effect: { rangeMult: 1.4, speedMult: 0.8 },
          },
          {
            id: "whirlwind_fast",
            name: "快旋风",
            description: "速度+50%，范围-15%",
            effect: { speedMult: 1.5, rangeMult: 0.85 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "whirlwind_fire",
            name: "火焰风暴",
            description: "附加燃烧伤害",
            effect: { addBurn: true, burnDamage: 0.3 },
          },
          {
            id: "whirlwind_ice",
            name: "冰霜风暴",
            description: "减速敌人30%",
            effect: { slowEnemy: 0.3 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "whirlwind_chaos",
            name: "混沌风暴",
            description: "火冰双属性，范围+50%",
            effect: { addBurn: true, slowEnemy: 0.3, rangeMult: 1.5 },
          },
          {
            id: "whirlwind_vacuum",
            name: "真空风暴",
            description: "吸引敌人，伤害+80%",
            effect: { pullEnemy: true, damageMult: 1.8 },
          },
        ],
      },
    ],
  },
  fireball: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "fireball_big",
            name: "大火球",
            description: "大小+60%，爆炸范围+40%",
            effect: { sizeMult: 1.6, explosionMult: 1.4 },
          },
          {
            id: "fireball_fast",
            name: "速射火球",
            description: "速度+40%，冷却-25%",
            effect: { speedMult: 1.4, cooldownMult: 0.75 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "fireball_multi",
            name: "多重火球",
            description: "发射3个火球",
            effect: { projectileCount: 3, damageMult: 0.7 },
          },
          {
            id: "fireball_homing",
            name: "追踪火球",
            description: "更强追踪，爆炸+50%",
            effect: { betterHoming: true, explosionMult: 1.5 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "fireball_meteor",
            name: "陨石术",
            description: "超大陨石，伤害x3",
            effect: { sizeMult: 2.5, damageMult: 3, explosionMult: 2 },
          },
          {
            id: "fireball_napalm",
            name: "凝固汽油",
            description: "留下火焰区域，持续伤害",
            effect: { leavesFire: true, fireDuration: 3 },
          },
        ],
      },
    ],
  },
  lightning: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "lightning_strong",
            name: "强闪电",
            description: "伤害+40%，范围+20%",
            effect: { damageMult: 1.4, rangeMult: 1.2 },
          },
          {
            id: "lightning_fast",
            name: "快闪电",
            description: "冷却-35%，弹射+1",
            effect: { cooldownMult: 0.65, chainCount: 1 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "lightning_fork",
            name: "叉状闪电",
            description: "每次弹射分裂成2个",
            effect: { forkChain: true },
          },
          {
            id: "lightning_stun",
            name: "麻痹闪电",
            description: "击晕敌人0.5秒",
            effect: { stunDuration: 0.5 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "lightning_storm",
            name: "雷暴",
            description: "召唤雷暴云，持续伤害",
            effect: { summonCloud: true, cloudDuration: 4 },
          },
          {
            id: "lightning_chain",
            name: "无限连锁",
            description: "弹射无限制，伤害+100%",
            effect: { infiniteChain: true, damageMult: 2 },
          },
        ],
      },
    ],
  },
  pistol: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "pistol_strong",
            name: "大口径",
            description: "伤害+50%，速度-20%",
            effect: { damageMult: 1.5, speedMult: 0.8 },
          },
          {
            id: "pistol_fast",
            name: "速射枪",
            description: "射速+50%，伤害-15%",
            effect: { cooldownMult: 0.67, damageMult: 0.85 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "pistol_pierce",
            name: "穿甲弹",
            description: "穿透所有敌人",
            effect: { pierce: true },
          },
          {
            id: "pistol_explosive",
            name: "爆裂弹",
            description: "命中爆炸，范围伤害",
            effect: { explosive: true, explosionRadius: 1.5 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "pistol_laser",
            name: "激光枪",
            description: "持续激光束，极高伤害",
            effect: { isLaser: true, damageMult: 2.5 },
          },
          {
            id: "pistol_ricochet",
            name: "跳弹",
            description: "弹射3次，伤害+80%",
            effect: { ricochet: 3, damageMult: 1.8 },
          },
        ],
      },
    ],
  },
  shotgun: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "shotgun_more",
            name: "更多弹丸",
            description: "弹丸+3，范围+20%",
            effect: { projectileCount: 3, spreadMult: 1.2 },
          },
          {
            id: "shotgun_wide",
            name: "宽散射",
            description: "散射角度+50%，伤害-15%",
            effect: { spreadMult: 1.5, damageMult: 0.85 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "shotgun_fire",
            name: "火焰弹",
            description: "弹丸附带燃烧",
            effect: { addBurn: true, burnDuration: 2 },
          },
          {
            id: "shotgun_slug",
            name: "独头弹",
            description: "单发高伤害，穿透",
            effect: { projectileCount: -4, damageMult: 3, pierce: true },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "shotgun_mega",
            name: "超级散射",
            description: "15发弹丸，全方向",
            effect: { projectileCount: 10, spreadMult: 2 },
          },
          {
            id: "shotgun_nova",
            name: "弹丸新星",
            description: "命中后爆炸",
            effect: { pelletExplode: true, explosionRadius: 1 },
          },
        ],
      },
    ],
  },
  orbit: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "orbit_more",
            name: "更多环绕",
            description: "数量+2，范围+20%",
            effect: { count: 2, radiusMult: 1.2 },
          },
          {
            id: "orbit_fast",
            name: "快环绕",
            description: "旋转速度+60%，伤害+20%",
            effect: { speedMult: 1.6, damageMult: 1.2 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "orbit_fire",
            name: "火焰环绕",
            description: "附加燃烧效果",
            effect: { addBurn: true, burnDuration: 1.5 },
          },
          {
            id: "orbit_push",
            name: "推力环绕",
            description: "击退敌人",
            effect: { knockback: 2 },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "orbit_plasma",
            name: "等离子环绕",
            description: "高伤害，闪电链",
            effect: { damageMult: 2, chainLightning: 2 },
          },
          {
            id: "orbit_blackhole",
            name: "黑洞环绕",
            description: "吸引敌人，持续伤害",
            effect: { pullEnemy: true, dotDamage: 0.5 },
          },
        ],
      },
    ],
  },
  mine: {
    maxLevel: 9,
    evolutions: [
      {
        level: 3,
        choices: [
          {
            id: "mine_big",
            name: "大地雷",
            description: "范围+60%，伤害+40%",
            effect: { radiusMult: 1.6, damageMult: 1.4 },
          },
          {
            id: "mine_many",
            name: "多地雷",
            description: "数量+2，冷却+30%",
            effect: { count: 2, cooldownMult: 1.3 },
          },
        ],
      },
      {
        level: 6,
        choices: [
          {
            id: "mine_fire",
            name: "火焰地雷",
            description: "留下火焰区域",
            effect: { leavesFire: true, fireDuration: 3 },
          },
          {
            id: "mine_sticky",
            name: "粘性地雷",
            description: "附着敌人身上",
            effect: { stickToEnemy: true },
          },
        ],
      },
      {
        level: 9,
        choices: [
          {
            id: "mine_nuke",
            name: "核弹地雷",
            description: "超大范围，秒杀普通敌人",
            effect: { hugeRadius: true, instantKill: true },
          },
          {
            id: "mine_cluster",
            name: "子母地雷",
            description: "爆炸后分裂小地雷",
            effect: { clusterCount: 4, clusterDamage: 0.4 },
          },
        ],
      },
    ],
  },
};

// ============================================
// 普通攻击系统
// ============================================

const BASIC_ATTACKS = {
  sword: {
    name: "剑术",
    icon: "⚔️",
    baseDamage: 10,
    baseCooldown: 600, // ms
    baseRange: 2.0,
    attackArc: Math.PI / 2, // 90度扇形
    upgrades: [
      {
        level: 1,
        name: "锋利",
        description: "伤害+20%",
        effect: { damageMult: 1.2 },
      },
      {
        level: 2,
        name: "范围",
        description: "范围+25%",
        effect: { rangeMult: 1.25 },
      },
      {
        level: 3,
        name: "连击",
        description: "攻击2次",
        effect: { hitCount: 2, damageMult: 0.8 },
      },
      {
        level: 4,
        name: "旋风斩",
        description: "360度攻击",
        effect: { fullCircle: true },
      },
      {
        level: 5,
        name: "剑气",
        description: "发射剑气",
        effect: { hasProjectile: true, projectileDamage: 0.6 },
      },
    ],
  },
  bow: {
    name: "弓术",
    icon: "🏹",
    baseDamage: 8,
    baseCooldown: 800,
    baseRange: 10,
    projectileSpeed: 12,
    upgrades: [
      {
        level: 1,
        name: "强弓",
        description: "伤害+25%",
        effect: { damageMult: 1.25 },
      },
      {
        level: 2,
        name: "速射",
        description: "射速+30%",
        effect: { cooldownMult: 0.7 },
      },
      {
        level: 3,
        name: "散射",
        description: "散射3支箭",
        effect: { projectileCount: 3, spread: 20, damageMult: 0.7 },
      },
      {
        level: 4,
        name: "穿透箭",
        description: "穿透所有敌人",
        effect: { pierce: true },
      },
      {
        level: 5,
        name: "爆炸箭",
        description: "命中爆炸",
        effect: { explosive: true, explosionRadius: 1.5 },
      },
    ],
  },
  staff: {
    name: "魔法弹",
    icon: "✨",
    baseDamage: 12,
    baseCooldown: 1000,
    baseRange: 8,
    projectileSpeed: 7,
    isHoming: true,
    upgrades: [
      {
        level: 1,
        name: "强化魔法",
        description: "伤害+30%",
        effect: { damageMult: 1.3 },
      },
      {
        level: 2,
        name: "快速施法",
        description: "冷却-25%",
        effect: { cooldownMult: 0.75 },
      },
      {
        level: 3,
        name: "多重魔法",
        description: "发射3个魔法弹",
        effect: { projectileCount: 3, damageMult: 0.7 },
      },
      {
        level: 4,
        name: "追踪强化",
        description: "完美追踪，伤害+50%",
        effect: { perfectHoming: true, damageMult: 1.5 },
      },
      {
        level: 5,
        name: "奥术爆炸",
        description: "命中后留下奥术区域",
        effect: { leavesArcane: true, arcaneDuration: 2 },
      },
    ],
  },
};

// ============================================
// 商人系统配置
// ============================================

const MERCHANT_CONFIG = {
  SPAWN_INTERVAL: 30000, // 每30秒出现一次
  DURATION: 20000, // 持续20秒
  WARNING_TIME: 3000, // 出现前3秒警告

  // 商品池
  PRODUCTS: {
    skills: {
      weight: 30, // 30%概率出现技能
      items: [
        { type: "skill", id: "slash", baseCost: 100 },
        { type: "skill", id: "whirlwind", baseCost: 120 },
        { type: "skill", id: "fireball", baseCost: 150 },
        { type: "skill", id: "lightning", baseCost: 140 },
        { type: "skill", id: "pistol", baseCost: 80 },
        { type: "skill", id: "shotgun", baseCost: 130 },
        { type: "skill", id: "orbit", baseCost: 110 },
        { type: "skill", id: "mine", baseCost: 120 },
      ],
    },
    attributes: {
      weight: 40, // 40%概率出现属性
      items: [
        {
          type: "attr",
          id: "damage",
          name: "伤害+10%",
          icon: "💪",
          baseCost: 80,
          effect: { damage: 0.1 },
        },
        {
          type: "attr",
          id: "hp",
          name: "生命+30",
          icon: "❤️",
          baseCost: 60,
          effect: { maxHp: 30 },
        },
        {
          type: "attr",
          id: "speed",
          name: "移速+10%",
          icon: "💨",
          baseCost: 70,
          effect: { moveSpeed: 0.1 },
        },
        {
          type: "attr",
          id: "atkSpeed",
          name: "攻速+15%",
          icon: "⚡",
          baseCost: 90,
          effect: { attackSpeed: 0.15 },
        },
        {
          type: "attr",
          id: "armor",
          name: "护甲+5",
          icon: "🛡️",
          baseCost: 75,
          effect: { armor: 5 },
        },
        {
          type: "attr",
          id: "crit",
          name: "暴击+8%",
          icon: "💥",
          baseCost: 100,
          effect: { criticalChance: 0.08 },
        },
      ],
    },
    consumables: {
      weight: 30, // 30%概率出现消耗品
      items: [
        {
          type: "consumable",
          id: "heal_full",
          name: "完全治疗",
          icon: "💖",
          baseCost: 150,
          effect: { heal: "full" },
        },
        {
          type: "consumable",
          id: "heal_half",
          name: "半血恢复",
          icon: "❤️",
          baseCost: 80,
          effect: { heal: 0.5 },
        },
        {
          type: "consumable",
          id: "temp_damage",
          name: "临时伤害+50%",
          icon: "🔥",
          baseCost: 120,
          effect: { tempDamage: 0.5, duration: 30 },
        },
        {
          type: "consumable",
          id: "temp_speed",
          name: "临时速度+30%",
          icon: "⚡",
          baseCost: 100,
          effect: { tempSpeed: 0.3, duration: 30 },
        },
        {
          type: "consumable",
          id: "shield",
          name: "护盾（吸收50伤害）",
          icon: "🛡️",
          baseCost: 90,
          effect: { shield: 50 },
        },
      ],
    },
  },

  // 刷新成本
  REROLL_BASE_COST: 30,
  REROLL_INCREMENT: 20, // 每次刷新增加的成本

  // 商人出现提示
  ANNOUNCEMENT: "💰 商人来了！持续20秒",
};
