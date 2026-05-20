// ============================================
// 深渊撤离区 - 割草 Roguelike v4.0
// 整合新架构
// ============================================

// 注意：CONFIG, PlayerStats, Equipment 等已在其他文件定义
// 本文件只包含游戏逻辑

// ============================================
// 技能定义
// ============================================

const SKILLS = {
  slash: {
    id: "slash",
    name: "斩击",
    icon: "⚔️",
    type: "melee",
    description: "对周围2.5格内敌人造成伤害",
    damage: 18,
    range: 2.5,
    cooldown: 900,
  },
  whirlwind: {
    id: "whirlwind",
    name: "旋风斩",
    icon: "🌀",
    type: "melee",
    description: "旋转攻击周围3.5格所有敌人",
    damage: 12,
    range: 3.5,
    cooldown: 1400,
  },
  pistol: {
    id: "pistol",
    name: "手枪",
    icon: "🔫",
    type: "ranged",
    description: "向最近敌人发射子弹",
    damage: 15,
    speed: 10,
    range: 12,
    cooldown: 700,
    projectileCount: 1,
  },
  shotgun: {
    id: "shotgun",
    name: "霰弹枪",
    icon: "💥",
    type: "ranged",
    description: "扇形散射5发子弹",
    damage: 10,
    speed: 8,
    range: 9,
    cooldown: 1200,
    projectileCount: 5,
    spread: 30,
  },
  rifle: {
    id: "rifle",
    name: "自动步枪",
    icon: "🎯",
    type: "ranged",
    description: "快速连发子弹",
    damage: 8,
    speed: 12,
    range: 14,
    cooldown: 350,
    projectileCount: 1,
  },
  fireball: {
    id: "fireball",
    name: "火球术",
    icon: "🔥",
    type: "ranged",
    description: "发射追踪火球，爆炸造成范围伤害",
    damage: 25,
    speed: 6,
    range: 11,
    cooldown: 1500,
    projectileCount: 1,
    explosive: true,
    explosionRadius: 2,
  },
  orbit: {
    id: "orbit",
    name: "环绕物",
    icon: "🔮",
    type: "orbit",
    description: "2个环绕物保护自身",
    damage: 15, // 从12提升到15（+25%）
    count: 2,
    radius: 2.8, // 从2.5提升到2.8
    cooldown: 0,
  },
  mine: {
    id: "mine",
    name: "地雷",
    icon: "💣",
    type: "mine",
    description: "在身后放置地雷",
    damage: 50, // 从35提升到50（+43%）
    cooldown: 3000, // 从3500降低到3000（-14%）
    duration: 15000, // 从12000提升到15000（+25%）
    radius: 2.5, // 从2提升到2.5（+25%）
  },
  lightning: {
    id: "lightning",
    name: "闪电链",
    icon: "⚡",
    type: "lightning",
    description: "闪电弹射4个敌人",
    damage: 18,
    range: 12,
    cooldown: 1800,
    chainCount: 4,
  },
};

// 升级卡牌
const UPGRADE_CARDS = [
  { id: "slash", type: "skill", ...SKILLS.slash },
  { id: "whirlwind", type: "skill", ...SKILLS.whirlwind },
  { id: "pistol", type: "skill", ...SKILLS.pistol },
  { id: "shotgun", type: "skill", ...SKILLS.shotgun },
  { id: "rifle", type: "skill", ...SKILLS.rifle },
  { id: "fireball", type: "skill", ...SKILLS.fireball },
  { id: "orbit", type: "skill", ...SKILLS.orbit },
  { id: "mine", type: "skill", ...SKILLS.mine },
  { id: "lightning", type: "skill", ...SKILLS.lightning },
  {
    id: "dmg_up",
    type: "stat",
    name: "伤害强化",
    icon: "💪",
    description: "伤害 +20%",
    effect: { damage: 2 },
  },
  {
    id: "spd_up",
    type: "stat",
    name: "攻速强化",
    icon: "⚡",
    description: "攻击速度 +15%",
    effect: { attackSpeed: 0.15 },
  },
  {
    id: "hp_up",
    type: "stat",
    name: "生命强化",
    icon: "❤️",
    description: "最大生命 +30",
    effect: { maxHp: 30 },
  },
  {
    id: "move_up",
    type: "stat",
    name: "移速强化",
    icon: "💨",
    description: "移动速度 +20%",
    effect: { moveSpeed: 0.2 },
  },
  {
    id: "regen_up",
    type: "stat",
    name: "回复强化",
    icon: "💚",
    description: "每秒回复 2 HP",
    effect: { lifeRegen: 2 },
  },
  {
    id: "crit_up",
    type: "special",
    name: "暴击",
    icon: "💥",
    description: "暴击率 +10%",
    effect: { criticalChance: 0.1 },
  },
  {
    id: "xp_up",
    type: "special",
    name: "经验获取",
    icon: "📚",
    description: "经验获取 +30%",
    effect: { xpBonus: 0.3 },
  },
];

const ENEMY_TYPES = {
  rat: {
    name: "变异鼠",
    icon: "🐀",
    hp: 15,
    atk: 3,
    speed: 1.8,
    xp: 8,
    gold: 5,
    size: 0.5,
    color: "#8B4513",
  },
  zombie: {
    name: "丧尸",
    icon: "🧟",
    hp: 25,
    atk: 5,
    speed: 1.0,
    xp: 12,
    gold: 8,
    size: 0.7,
    color: "#2ecc71",
  },
  skeleton: {
    name: "骷髅",
    icon: "💀",
    hp: 20,
    atk: 7,
    speed: 1.3,
    xp: 18,
    gold: 12,
    size: 0.7,
    color: "#ecf0f1",
  },
  demon: {
    name: "恶魔",
    icon: "👹",
    hp: 40,
    atk: 10,
    speed: 1.1,
    xp: 30,
    gold: 20,
    size: 0.9,
    color: "#e74c3c",
  },
  golem: {
    name: "魔像",
    icon: "🗿",
    hp: 60,
    atk: 12,
    speed: 0.7,
    xp: 45,
    gold: 30,
    size: 1,
    color: "#7f8c8d",
  },
  dragon: {
    name: "幼龙",
    icon: "🐉",
    hp: 80,
    atk: 15,
    speed: 1.3,
    xp: 70,
    gold: 50,
    size: 1.1,
    color: "#f39c12",
  },
  // 新敌人类型
  ghost: {
    name: "幽灵",
    icon: "👻",
    hp: 30,
    atk: 8,
    speed: 1.6,
    xp: 25,
    gold: 15,
    size: 0.8,
    color: "#9b59b6",
    ability: "phase", // 可以穿过敌人
  },
  spider: {
    name: "毒蛛",
    icon: "🕷️",
    hp: 20,
    atk: 6,
    speed: 1.5,
    xp: 20,
    gold: 12,
    size: 0.6,
    color: "#2c3e50",
    ability: "poison", // 攻击附带中毒
  },
  mage: {
    name: "暗黑法师",
    icon: "🧙",
    hp: 35,
    atk: 12,
    speed: 0.9,
    xp: 40,
    gold: 25,
    size: 0.8,
    color: "#8e44ad",
    ability: "ranged", // 远程攻击
  },
  assassin: {
    name: "暗影刺客",
    icon: "🗡️",
    hp: 25,
    atk: 18,
    speed: 2.0,
    xp: 35,
    gold: 22,
    size: 0.7,
    color: "#34495e",
    ability: "blink", // 可以瞬移
  },
  tank: {
    name: "重装战士",
    icon: "🛡️",
    hp: 120,
    atk: 10,
    speed: 0.6,
    xp: 50,
    gold: 35,
    size: 1.2,
    color: "#7f8c8d",
    ability: "armor", // 高护甲
  },
  // 精英敌人（带词缀）
  elite_vampire: {
    name: "吸血鬼精英",
    icon: "🧛",
    hp: 150,
    atk: 20,
    speed: 1.4,
    xp: 100,
    gold: 80,
    size: 1.0,
    color: "#c0392b",
    isElite: true,
    affixes: ["life_steal"], // 吸血
  },
  elite_explosive: {
    name: "自爆精英",
    icon: "💣",
    hp: 50,
    atk: 30,
    speed: 1.8,
    xp: 80,
    gold: 60,
    size: 0.9,
    color: "#e67e22",
    isElite: true,
    affixes: ["explosive"], // 死亡爆炸
  },
  elite_shield: {
    name: "护盾精英",
    icon: "🔰",
    hp: 200,
    atk: 15,
    speed: 1.0,
    xp: 120,
    gold: 100,
    size: 1.1,
    color: "#3498db",
    isElite: true,
    affixes: ["shield"], // 有护盾
  },
};

// Boss类型
const BOSS_TYPES = {
  giant_zombie: {
    name: "巨型丧尸",
    icon: "🧟‍♂️",
    hp: 500,
    atk: 30,
    speed: 0.8,
    xp: 200,
    gold: 100,
    size: 2,
    color: "#1abc9c",
    isBoss: true,
  },
  demon_lord: {
    name: "恶魔领主",
    icon: "👿",
    hp: 800,
    atk: 45,
    speed: 1.0,
    xp: 350,
    gold: 150,
    size: 2.2,
    color: "#e74c3c",
    isBoss: true,
  },
  ancient_dragon: {
    name: "远古巨龙",
    icon: "🐲",
    hp: 1200,
    atk: 60,
    speed: 0.9,
    xp: 500,
    gold: 200,
    size: 2.5,
    color: "#f39c12",
    isBoss: true,
  },
  lich_king: {
    name: "巫妖王",
    icon: "💀",
    hp: 1000,
    atk: 55,
    speed: 0.7,
    xp: 450,
    gold: 180,
    size: 2,
    color: "#9b59b6",
    isBoss: true,
  },
  abomination: {
    name: "憎恶",
    icon: "👾",
    hp: 1500,
    atk: 40,
    speed: 0.6,
    xp: 600,
    gold: 250,
    size: 3,
    color: "#2ecc71",
    isBoss: true,
  },
};

// ============================================
// 技能皮肤系统
// ============================================

const SKILL_SKINS = {
  // 斩击皮肤
  slash: [
    {
      id: "slash_default",
      name: "标准斩击",
      skillId: "slash",
      rarity: "default",
      colors: ["#ffffff"],
      particleType: "slash",
      description: "基础斩击特效",
    },
    {
      id: "slash_fire",
      name: "烈焰斩",
      skillId: "slash",
      rarity: "rare",
      colors: ["#ff4500", "#ff8c00", "#ffd700"],
      particleType: "fire_slash",
      description: "燃烧火焰斩击，附带灼烧粒子",
      unlockCondition: { achievement: "first_blood" },
    },
    {
      id: "slash_ice",
      name: "寒冰斩",
      skillId: "slash",
      rarity: "rare",
      colors: ["#00ffff", "#87ceeb", "#ffffff"],
      particleType: "ice_slash",
      description: "冰冷寒冰斩击，冰冻粒子效果",
      unlockCondition: { achievement: "ten_kills" },
    },
    {
      id: "slash_lightning",
      name: "闪电斩",
      skillId: "slash",
      rarity: "epic",
      colors: ["#ffff00", "#00ffff", "#ffffff"],
      particleType: "lightning_slash",
      description: "闪电环绕的斩击，电弧粒子",
      unlockCondition: { achievement: "hundred_kills" },
    },
    {
      id: "slash_void",
      name: "虚空斩",
      skillId: "slash",
      rarity: "legendary",
      colors: ["#8b00ff", "#ff00ff", "#000000"],
      particleType: "void_slash",
      description: "来自虚空的黑暗斩击",
      unlockCondition: { achievement: "thousand_kills" },
    },
  ],

  // 旋风斩皮肤
  whirlwind: [
    {
      id: "whirlwind_default",
      name: "标准旋风",
      skillId: "whirlwind",
      rarity: "default",
      colors: ["#ffffff"],
      particleType: "whirlwind",
      description: "基础旋风特效",
    },
    {
      id: "whirlwind_fire",
      name: "火焰漩涡",
      skillId: "whirlwind",
      rarity: "rare",
      colors: ["#ff4500", "#ff6347"],
      particleType: "fire_whirlwind",
      description: "燃烧的火焰漩涡",
      unlockCondition: { quest: "daily_kill_50" },
    },
    {
      id: "whirlwind_nature",
      name: "自然风暴",
      skillId: "whirlwind",
      rarity: "rare",
      colors: ["#228b22", "#32cd32"],
      particleType: "nature_whirlwind",
      description: "自然之力的风暴",
      unlockCondition: { quest: "daily_survive_10min" },
    },
    {
      id: "whirlwind_shadow",
      name: "暗影旋风",
      skillId: "whirlwind",
      rarity: "epic",
      colors: ["#2f2f2f", "#808080"],
      particleType: "shadow_whirlwind",
      description: "暗影能量的旋转风暴",
      unlockCondition: { achievement: "speed_demon" },
    },
  ],

  // 火球术皮肤
  fireball: [
    {
      id: "fireball_default",
      name: "标准火球",
      skillId: "fireball",
      rarity: "default",
      colors: ["#ff4500"],
      particleType: "fireball",
      description: "基础火球特效",
    },
    {
      id: "fireball_solar",
      name: "太阳火球",
      skillId: "fireball",
      rarity: "rare",
      colors: ["#ffd700", "#ff8c00", "#ffff00"],
      particleType: "solar_fireball",
      description: "如太阳般耀眼的金色火球",
      unlockCondition: { level: 15 },
    },
    {
      id: "fireball_void",
      name: "虚空火球",
      skillId: "fireball",
      rarity: "epic",
      colors: ["#8b00ff", "#4b0082"],
      particleType: "void_fireball",
      description: "虚空能量的紫色火球",
      unlockCondition: { level: 25 },
    },
    {
      id: "fireball_frost",
      name: "冰霜火球",
      skillId: "fireball",
      rarity: "epic",
      colors: ["#00ffff", "#ffffff", "#87ceeb"],
      particleType: "frost_fireball",
      description: "冰火双重 paradox 效果",
      unlockCondition: { achievement: "boss_slayer" },
    },
  ],

  // 闪电链皮肤
  lightning: [
    {
      id: "lightning_default",
      name: "标准闪电",
      skillId: "lightning",
      rarity: "default",
      colors: ["#00ffff"],
      particleType: "lightning",
      description: "基础闪电特效",
    },
    {
      id: "lightning_plasma",
      name: "等离子链",
      skillId: "lightning",
      rarity: "rare",
      colors: ["#ff00ff", "#8b00ff"],
      particleType: "plasma_lightning",
      description: "紫色等离子闪电链",
      unlockCondition: { level: 20 },
    },
    {
      id: "lightning_solar",
      name: "太阳闪电",
      skillId: "lightning",
      rarity: "epic",
      colors: ["#ffd700", "#ff8c00"],
      particleType: "solar_lightning",
      description: "金色太阳闪电链",
      unlockCondition: { achievement: "lightning_reflex" },
    },
    {
      id: "lightning_chaos",
      name: "混沌闪电",
      skillId: "lightning",
      rarity: "legendary",
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
      particleType: "chaos_lightning",
      description: "混沌多彩闪电，随机颜色",
      unlockCondition: { achievement: "untouchable" },
    },
  ],

  // 霰弹枪皮肤
  shotgun: [
    {
      id: "shotgun_default",
      name: "标准霰弹",
      skillId: "shotgun",
      rarity: "default",
      colors: ["#ffffff"],
      particleType: "shotgun",
      description: "基础霰弹特效",
    },
    {
      id: "shotgun_fire",
      name: "火焰弹丸",
      skillId: "shotgun",
      rarity: "rare",
      colors: ["#ff4500", "#ff8c00"],
      particleType: "fire_shotgun",
      description: "燃烧的火焰弹丸",
      unlockCondition: { quest: "weekly_kill_500" },
    },
    {
      id: "shotgun_ice",
      name: "冰霜弹丸",
      skillId: "shotgun",
      rarity: "rare",
      colors: ["#00ffff", "#ffffff"],
      particleType: "ice_shotgun",
      description: "冰冻弹丸，冰晶粒子",
      unlockCondition: { quest: "weekly_extraction_5" },
    },
  ],

  // 环绕物皮肤
  orbit: [
    {
      id: "orbit_default",
      name: "标准环绕",
      skillId: "orbit",
      rarity: "default",
      colors: ["#87ceeb"],
      particleType: "orbit",
      description: "基础环绕特效",
    },
    {
      id: "orbit_fire",
      name: "火焰环绕",
      skillId: "orbit",
      rarity: "rare",
      colors: ["#ff4500", "#ffd700"],
      particleType: "fire_orbit",
      description: "燃烧的火焰球环绕",
      unlockCondition: { achievement: "first_equip" },
    },
    {
      id: "orbit_shadow",
      name: "暗影环绕",
      skillId: "orbit",
      rarity: "epic",
      colors: ["#2f2f2f", "#808080"],
      particleType: "shadow_orbit",
      description: "暗影能量的黑暗球体",
      unlockCondition: { achievement: "equipment_collector" },
    },
  ],
};

// 皮肤稀有度配置
const SKIN_RARITY = {
  default: { name: "默认", color: "#ffffff", order: 0 },
  rare: { name: "稀有", color: "#2ecc71", order: 1 },
  epic: { name: "史诗", color: "#9b59b6", order: 2 },
  legendary: { name: "传说", color: "#f39c12", order: 3 },
};

// ============================================
// 多层级天赋树系统
// ============================================

const TALENT_TREE = {
  // 第1层 - 基础天赋（直接可用）
  tier1: [
    {
      id: "vitality",
      name: "生命力",
      description: "最大生命 +10%",
      icon: "❤️",
      maxLevel: 10,
      baseCost: 1,
      costPerLevel: 1,
      effect: { maxHp: 0.1 },
    },
    {
      id: "attack_power",
      name: "攻击力",
      description: "伤害 +8%",
      icon: "⚔️",
      maxLevel: 10,
      baseCost: 1,
      costPerLevel: 1,
      effect: { damage: 0.08 },
    },
    {
      id: "iron_skin",
      name: "铁甲",
      description: "护甲 +5",
      icon: "🛡️",
      maxLevel: 10,
      baseCost: 1,
      costPerLevel: 1,
      effect: { armor: 5 },
    },
    {
      id: "swift_foot",
      name: "迅捷",
      description: "移速 +5%",
      icon: "💨",
      maxLevel: 5,
      baseCost: 1,
      costPerLevel: 1,
      effect: { moveSpeed: 0.05 },
    },
    {
      id: "magnet",
      name: "磁吸",
      description: "拾取范围 +15%",
      icon: "🧲",
      maxLevel: 5,
      baseCost: 1,
      costPerLevel: 1,
      effect: { pickupRange: 0.15 },
    },
    {
      id: "experience",
      name: "求知",
      description: "经验获取 +15%",
      icon: "📚",
      maxLevel: 5,
      baseCost: 1,
      costPerLevel: 1,
      effect: { xpBonus: 0.15 },
    },
    {
      id: "greed",
      name: "贪婪",
      description: "金币获取 +15%",
      icon: "💰",
      maxLevel: 5,
      baseCost: 1,
      costPerLevel: 1,
      effect: { goldBonus: 0.15 },
    },
    {
      id: "recovery",
      name: "恢复",
      description: "生命回复 +1/秒",
      icon: "💚",
      maxLevel: 5,
      baseCost: 1,
      costPerLevel: 1,
      effect: { lifeRegen: 1 },
    },
  ],

  // 第2层 - 专精（需要第1层任意2个解锁）
  tier2: [
    // 近战专精
    {
      id: "melee_master",
      name: "近战大师",
      description: "近战伤害 +20%",
      icon: "🗡️",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 2,
      effect: { meleeDamage: 0.2 },
      requires: { tier1Count: 2 },
    },
    {
      id: "slash_range",
      name: "斩击扩展",
      description: "近战范围 +15%",
      icon: "⚔️",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 1,
      effect: { meleeRange: 0.15 },
      requires: { tier1Count: 2 },
    },
    {
      id: "attack_speed",
      name: "狂热",
      description: "攻击速度 +10%",
      icon: "⚡",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 2,
      effect: { attackSpeed: 0.1 },
      requires: { tier1Count: 2 },
    },

    // 远程专精
    {
      id: "ranged_master",
      name: "神射手",
      description: "远程伤害 +20%",
      icon: "🏹",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 2,
      effect: { rangedDamage: 0.2 },
      requires: { tier1Count: 2 },
    },
    {
      id: "bullet_speed",
      name: "速射",
      description: "子弹速度 +20%",
      icon: "💨",
      maxLevel: 3,
      baseCost: 2,
      costPerLevel: 1,
      effect: { projectileSpeed: 0.2 },
      requires: { tier1Count: 2 },
    },
    {
      id: "pierce",
      name: "穿透",
      description: "穿透 +1",
      icon: "🔱",
      maxLevel: 3,
      baseCost: 2,
      costPerLevel: 3,
      effect: { pierce: 1 },
      requires: { tier1Count: 2 },
    },

    // 魔法专精
    {
      id: "magic_master",
      name: "奥术掌控",
      description: "技能伤害 +20%",
      icon: "🔮",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 2,
      effect: { skillDamage: 0.2 },
      requires: { tier1Count: 2 },
    },
    {
      id: "cooldown",
      name: "急速",
      description: "冷却缩减 +10%",
      icon: "⏱️",
      maxLevel: 3,
      baseCost: 2,
      costPerLevel: 3,
      effect: { cooldownReduction: 0.1 },
      requires: { tier1Count: 2 },
    },
    {
      id: "projectile",
      name: "多重射击",
      description: "投射物 +1",
      icon: "🎯",
      maxLevel: 2,
      baseCost: 2,
      costPerLevel: 5,
      effect: { projectileCount: 1 },
      requires: { tier1Count: 2 },
    },

    // 生存专精
    {
      id: "fortitude",
      name: "坚韧",
      description: "减伤 +5%",
      icon: "🏰",
      maxLevel: 5,
      baseCost: 2,
      costPerLevel: 2,
      effect: { damageReduction: 0.05 },
      requires: { tier1Count: 2 },
    },
    {
      id: "dodge",
      name: "闪避",
      description: "闪避率 +5%",
      icon: "🌀",
      maxLevel: 3,
      baseCost: 2,
      costPerLevel: 3,
      effect: { dodge: 0.05 },
      requires: { tier1Count: 2 },
    },
    {
      id: "critical_resist",
      name: "抗性",
      description: "暴击抵抗 +10%",
      icon: "💎",
      maxLevel: 3,
      baseCost: 2,
      costPerLevel: 2,
      effect: { criticalResist: 0.1 },
      requires: { tier1Count: 2 },
    },
  ],

  // 第3层 - 高级天赋（需要第2层对应专精3个解锁）
  tier3: [
    {
      id: "lightning_reflex",
      name: "闪电反射",
      description: "首次受击无敌1秒（每30秒）",
      icon: "⚡",
      maxLevel: 1,
      baseCost: 5,
      costPerLevel: 5,
      effect: { lightningReflex: 1 },
      requires: { tier2Count: 3, specific: ["attack_speed", "swift_foot"] },
    },
    {
      id: "vampire_aura",
      name: "吸血光环",
      description: "击杀回复5%最大生命",
      icon: "🧛",
      maxLevel: 3,
      baseCost: 5,
      costPerLevel: 3,
      effect: { lifeSteal: 0.05 },
      requires: { tier2Count: 3, specific: ["melee_master", "vitality"] },
    },
    {
      id: "critical_master",
      name: "暴击大师",
      description: "暴击率 +10%，暴击伤害 +30%",
      icon: "💥",
      maxLevel: 3,
      baseCost: 5,
      costPerLevel: 4,
      effect: { criticalChance: 0.1, criticalDamage: 0.3 },
      requires: { tier2Count: 3, specific: ["attack_power", "ranged_master"] },
    },
    {
      id: "elemental_damage",
      name: "元素附加",
      description: "攻击附带20点元素伤害",
      icon: "🔥",
      maxLevel: 5,
      baseCost: 5,
      costPerLevel: 3,
      effect: { elementalDamage: 20 },
      requires: { tier2Count: 3, specific: ["magic_master"] },
    },
    {
      id: "thorns",
      name: "荆棘",
      description: "反弹30%近战伤害",
      icon: "🌵",
      maxLevel: 3,
      baseCost: 5,
      costPerLevel: 4,
      effect: { thorns: 0.3 },
      requires: { tier2Count: 3, specific: ["iron_skin", "fortitude"] },
    },
    {
      id: "executioner",
      name: "处决者",
      description: "对低于30%生命敌人伤害 +50%",
      icon: "☠️",
      maxLevel: 1,
      baseCost: 5,
      costPerLevel: 5,
      effect: { execute: 0.5 },
      requires: { tier2Count: 3, specific: ["melee_master", "slash_range"] },
    },
    {
      id: "phoenix_shield",
      name: "凤凰护盾",
      description: "生命低于20%时获得50%减伤（持续5秒，每60秒）",
      icon: "🔰",
      maxLevel: 1,
      baseCost: 5,
      costPerLevel: 5,
      effect: { phoenixShield: 1 },
      requires: { tier2Count: 3, specific: ["fortitude", "vitality"] },
    },
    {
      id: "treasure_hunter",
      name: "宝藏猎人",
      description: "稀有掉落率 +30%",
      icon: "💎",
      maxLevel: 3,
      baseCost: 5,
      costPerLevel: 3,
      effect: { rareDrop: 0.3 },
      requires: { tier2Count: 3, specific: ["greed", "experience"] },
    },
  ],

  // 第4层 - 终极天赋（需要第3层任意6个解锁）
  tier4: [
    {
      id: "phoenix_rebirth",
      name: "凤凰涅槃",
      description: "死亡时复活一次（每局1次）",
      icon: "🔥",
      maxLevel: 1,
      baseCost: 10,
      costPerLevel: 10,
      effect: { phoenixRebirth: 1 },
      requires: { tier3Count: 6 },
    },
    {
      id: "time_warp",
      name: "时间扭曲",
      description: "所有技能冷却 -30%",
      icon: "⏳",
      maxLevel: 1,
      baseCost: 10,
      costPerLevel: 10,
      effect: { timeWarp: 0.3 },
      requires: { tier3Count: 6 },
    },
    {
      id: "immortal_body",
      name: "不灭之躯",
      description: "最大生命 +50%，护甲 +20",
      icon: "🏛️",
      maxLevel: 1,
      baseCost: 10,
      costPerLevel: 10,
      effect: { maxHp: 0.5, armor: 20 },
      requires: { tier3Count: 6 },
    },
    {
      id: "destroyer",
      name: "毁灭化身",
      description: "所有伤害 +40%",
      icon: "💀",
      maxLevel: 1,
      baseCost: 10,
      costPerLevel: 10,
      effect: { allDamage: 0.4 },
      requires: { tier3Count: 6 },
    },
  ],
};

// 保留旧的天赋兼容性
const TALENTS = {};
for (const tier of Object.values(TALENT_TREE)) {
  for (const talent of tier) {
    TALENTS[talent.id] = talent;
  }
}

let gameState = {
  running: false,
  paused: false,
  time: 0,
  player: null,
  playerStats: null,
  equipment: { weapon: null, chest: null, boots: null, accessory: null },
  enemies: [],
  projectiles: [],
  orbitals: [],
  mines: [],
  groundItems: [],
  xpOrbs: [],
  chests: [],
  searchPoints: [],
  whirlwinds: [],
  particles: [],
  floatingTexts: [],
  lightnings: [],
  merchants: [],
  lastSpawnTime: 0,
  lastChestTime: 0,
  lastSearchTime: 0,
  lastMerchantTime: -999999,
  lastTime: 0,
  startTime: 0,
  kills: 0,
  keys: {},
  levelUpChoices: [],
  rerollCount: 0,
  inventoryOpen: false,
  merchantsShown: false,
};

let persistentData = {
  totalGold: 0,
  diamonds: 0, // 钻石货币
  inventorySize: 25, // 背包初始格数 (5x5)
  talentPoints: 0, // 可用的天赋点
  talents: {}, // 已解锁的天赋 {id: level}
  highScore: 0,
  gamesPlayed: 0,
  totalKills: 0,
  totalExtractions: 0,
  achievements: [], // 已完成的成就
  unlockedSkins: [
    "slash_default",
    "whirlwind_default",
    "fireball_default",
    "lightning_default",
    "shotgun_default",
    "orbit_default",
  ],
  equippedSkins: {},
  visualSettings: {
    screenShake: true,
    damageNumbers: true,
    particleEffects: true,
  },
  runStats: {
    // 当前局统计
    timeAlive: 0,
    kills: 0,
    level: 1,
    extracted: false,
  },
};

// 检查皮肤解锁
function checkSkinUnlocks() {
  const playerLevel = gameState.player ? gameState.player.level : 1;

  for (const [skillId, skins] of Object.entries(SKILL_SKINS)) {
    for (const skin of skins) {
      if (persistentData.unlockedSkins.includes(skin.id)) continue;

      let unlocked = false;
      if (skin.unlockCondition) {
        if (
          skin.unlockCondition.achievement &&
          persistentData.achievements.includes(skin.unlockCondition.achievement)
        )
          unlocked = true;
        if (
          skin.unlockCondition.level &&
          playerLevel >= skin.unlockCondition.level
        )
          unlocked = true;
        if (skin.unlockCondition.quest) {
          const claimed =
            (persistentData.dailyQuestClaimed || []).includes(
              skin.unlockCondition.quest,
            ) ||
            (persistentData.weeklyQuestClaimed || []).includes(
              skin.unlockCondition.quest,
            );
          if (claimed) unlocked = true;
        }
      }

      if (unlocked && !persistentData.unlockedSkins.includes(skin.id)) {
        persistentData.unlockedSkins.push(skin.id);
        addLog(`🎨 皮肤解锁: ${skin.name}!`, "success");
        saveGame();
      }
    }
  }
}

// 检查套装效果
function checkSetBonuses() {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !stats) return;

  const equippedSlots = {};
  for (const [slot, equip] of Object.entries(gameState.equipment)) {
    if (equip && equip.setType) {
      if (!equippedSlots[equip.setType]) equippedSlots[equip.setType] = [];
      equippedSlots[equip.setType].push(slot);
    }
  }

  for (const [setId, slots] of Object.entries(equippedSlots)) {
    const set = CONFIG.SETS[setId];
    if (!set) continue;

    const count = slots.length;
    for (const [needed, bonus] of Object.entries(set.bonuses)) {
      if (count >= needed) {
        for (const [stat, value] of Object.entries(bonus)) {
          stats.applyStat({ [stat]: value });
        }
      }
    }
  }
}

// 装备皮肤
function equipSkin(skillId, skinId) {
  if (!persistentData.equippedSkins) persistentData.equippedSkins = {};

  if (persistentData.equippedSkins[skillId] === skinId) {
    delete persistentData.equippedSkins[skillId];
  } else {
    persistentData.equippedSkins[skillId] = skinId;
  }

  saveGame();
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// 注意：gameCtx, minimapCanvas, minimapCtx 已在 renderer.js 中声明为全局变量
// initRender() 会在 startGame() 时初始化它们

// ============================================
// 工具
// ============================================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function chance(pct) {
  return Math.random() < pct / 100;
}

function getSlotName(slot) {
  const names = {
    weapon: "武器",
    chest: "胸甲",
    boots: "鞋子",
    accessory: "饰品",
  };
  return names[slot] || slot;
}

function getWeaponTypeName(type) {
  const names = { sword: "剑", bow: "弓", staff: "法杖" };
  return names[type] || type;
}

function getStatName(key) {
  const names = {
    damage: "伤害",
    maxHp: "最大生命",
    armor: "护甲",
    attackSpeed: "攻击速度",
    criticalChance: "暴击率",
    criticalDamage: "暴击伤害",
    meleeDamage: "近战伤害",
    rangedDamage: "远程伤害",
    magicDamage: "魔法伤害",
    moveSpeed: "移速",
    dodge: "闪避",
    damageReduction: "减伤",
    pickupRange: "拾取范围",
    lifeRegen: "生命回复",
    cooldownReduction: "冷却缩减",
    skillDamage: "技能伤害",
    projectileCount: "投射物",
    pierce: "穿透",
    xpBonus: "经验加成",
    goldBonus: "金币加成",
  };
  return names[key] || key;
}

function formatStatValue(key, value) {
  const percentStats = [
    "attackSpeed",
    "criticalChance",
    "criticalDamage",
    "moveSpeed",
    "dodge",
    "damageReduction",
    "pickupRange",
    "cooldownReduction",
    "skillDamage",
    "xpBonus",
    "goldBonus",
  ];
  if (percentStats.includes(key)) {
    return `${(value * 100).toFixed(0)}%`;
  }
  return Math.floor(value);
}

// ============================================
// 持久化
// ============================================

function initTalents() {
  for (const [key] of Object.entries(TALENTS)) {
    if (!persistentData.talents[key]) persistentData.talents[key] = 0;
  }
}

function loadGame() {
  const saved = localStorage.getItem("abyss_v5");
  if (saved) {
    const data = JSON.parse(saved);
    persistentData = { ...persistentData, ...data };
  }
  initTalents();
}

function saveGame() {
  localStorage.setItem("abyss_v5", JSON.stringify(persistentData));
}

function initTalents() {
  // 初始化天赋数据
  if (!persistentData.talents) persistentData.talents = {};
  if (!persistentData.talentPoints) persistentData.talentPoints = 0;
  if (!persistentData.achievements) persistentData.achievements = [];

  // 计算天赋点
  calculateTalentPoints();
}

// 计算天赋点（基于历史表现）
function calculateTalentPoints() {
  let points = 0;

  // 基于总游戏时间（每30秒 = 1点）
  points += Math.floor((persistentData.totalPlayTime || 0) / 30);

  // 基于总击杀（每50个 = 1点）
  points += Math.floor((persistentData.totalKills || 0) / 50);

  // 基于提取成功次数（每次 = 5点）
  points += (persistentData.totalExtractions || 0) * 5;

  // 基于成就完成（每个 = 3点）
  points += (persistentData.achievements || []).length * 3;

  // 减去已使用的天赋点
  let spent = 0;
  for (const level of Object.values(persistentData.talents)) {
    spent += level;
  }

  persistentData.talentPoints = Math.max(0, points - spent);
}

// 获取天赋加成（应用到属性）
function getTalentBonuses() {
  const b = {};
  const talents = persistentData.talents || {};

  for (const [talentId, level] of Object.entries(talents)) {
    if (level <= 0) continue;

    // 查找天赋定义
    let talentDef = null;
    for (const tier of Object.values(TALENT_TREE)) {
      talentDef = tier.find((t) => t.id === talentId);
      if (talentDef) break;
    }

    if (!talentDef) continue;

    // 应用效果
    for (const [stat, baseValue] of Object.entries(talentDef.effect)) {
      if (!b[stat]) b[stat] = 0;
      b[stat] += baseValue * level;
    }
  }

  return b;
}

// ============================================
// 日志
// ============================================

function addLog(msg, type = "info") {
  const log = document.getElementById("log-content");
  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.textContent = `[${formatTime((Date.now() - gameState.startTime) / 1000)}] ${msg}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 50) log.removeChild(log.firstChild);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ============================================
// 特效
// ============================================

function addFloatingText(x, y, text, color) {
  const ft = getFloatingTextFromPool();
  ft.x = x * CONFIG.TILE_SIZE;
  ft.y = y * CONFIG.TILE_SIZE - 10;
  ft.text = text;
  ft.color = color;
  ft.life = 40;
  ft.maxLife = 40;
  ft.vy = -2;
  gameState.floatingTexts.push(ft);
}

function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const particle = getParticleFromPool();
    particle.x = x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    particle.y = y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    particle.vx = (Math.random() - 0.5) * 6;
    particle.vy = (Math.random() - 0.5) * 6;
    particle.life = rand(15, 30);
    particle.maxLife = 30;
    particle.color = color;
    particle.size = rand(2, 5);
    gameState.particles.push(particle);
  }
}

function updateEffects() {
  gameState.particles = gameState.particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    p.size *= 0.95;
    p.vy += 0.15;
    if (p.life <= 0) {
      releaseParticleToPool(p);
      return false;
    }
    return p.life > 0;
  });
  gameState.floatingTexts = gameState.floatingTexts.filter((ft) => {
    ft.y += ft.vy;
    ft.life--;
    if (ft.life <= 0) {
      releaseFloatingTextToPool(ft);
      return false;
    }
    return ft.life > 0;
  });
  gameState.lightnings = gameState.lightnings.filter((l) => {
    l.life--;
    if (l.life <= 0) {
      releaseLightningToPool(l);
      return false;
    }
    return l.life > 0;
  });
  gameState.whirlwinds = gameState.whirlwinds.filter((w) => {
    w.life--;
    w.angle += 0.2;
    if (w.life <= 0) {
      releaseWhirlwindToPool(w);
      return false;
    }
    return w.life > 0;
  });
}

// ============================================
// 玩家初始化和更新
// ============================================

function initPlayer() {
  const talentBonuses = getTalentBonuses();

  // 创建属性对象
  gameState.playerStats = new PlayerStats();
  gameState.playerStats.maxHp =
    CONFIG.PLAYER.BASE_HP + (talentBonuses.maxHp || 0);
  gameState.playerStats.currentHp = gameState.playerStats.maxHp;
  gameState.playerStats.damage = 10 + (talentBonuses.damage || 0);
  gameState.playerStats.armor = CONFIG.PLAYER.BASE_ARMOR;
  gameState.playerStats.damageReduction = CONFIG.PLAYER.BASE_DAMAGE_REDUCTION;
  if (talentBonuses.damageReduction)
    gameState.playerStats.damageReduction += talentBonuses.damageReduction;
  if (talentBonuses.criticalChance)
    gameState.playerStats.criticalChance = talentBonuses.criticalChance;
  if (talentBonuses.lifeRegen)
    gameState.playerStats.lifeRegen = talentBonuses.lifeRegen;
  if (talentBonuses.goldBonus)
    gameState.playerStats.goldBonus = talentBonuses.goldBonus;

  // 创建玩家
  gameState.player = {
    x: CONFIG.ARENA_SIZE / 2,
    y: CONFIG.ARENA_SIZE / 2,
    level: 1,
    xp: 0,
    xpToNext: CONFIG.LEVEL.BASE_XP,
    gold: 0,
    skills: [{ ...SKILLS.slash, level: 1, timer: 0 }],
    inventory: [],
    kills: 0,
  };

  // 应用装备加成
  updateEquipmentStats();
}

function updateEquipmentStats() {
  if (!gameState.player || !gameState.playerStats) return;

  const equipmentList = Object.values(gameState.equipment).filter(
    (e) => e !== null,
  );
  gameState.playerStats.applyBonuses(equipmentList, {
    level: gameState.player.level,
  });
}

function updatePlayer(dt) {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !stats) return;

  // 更新状态效果
  if (effectSystem) {
    effectSystem.updateEffects(p);
  }

  let dx = 0,
    dy = 0;
  if (gameState.keys["w"] || gameState.keys["arrowup"]) dy = -1;
  if (gameState.keys["s"] || gameState.keys["arrowdown"]) dy = 1;
  if (gameState.keys["a"] || gameState.keys["arrowleft"]) dx = -1;
  if (gameState.keys["d"] || gameState.keys["arrowright"]) dx = 1;

  // B键打开背包
  if (gameState.keys["b"]) {
    toggleInventory();
    gameState.keys["b"] = false;
    return;
  }

  // 检查是否可以移动（眩晕/冰冻状态）
  const canMove = effectSystem ? effectSystem.canMove(p) : true;

  if (canMove && (dx !== 0 || dy !== 0)) {
    const len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;

    // 应用速度修正
    const speedModifier = effectSystem ? effectSystem.getSpeedModifier(p) : 1.0;
    p.x = clamp(
      p.x + dx * stats.moveSpeed * speedModifier * dt,
      1,
      CONFIG.ARENA_SIZE - 1,
    );
    p.y = clamp(
      p.y + dy * stats.moveSpeed * speedModifier * dt,
      1,
      CONFIG.ARENA_SIZE - 1,
    );
  }

  autoPickup();

  // 生命回复
  if (stats.lifeRegen > 0) {
    stats.heal(stats.lifeRegen * dt);
  }
}

function autoPickup() {
  const p = gameState.player;
  if (!p) return;

  const stats = gameState.playerStats;
  const range = stats.pickupRange;

  let changed = false;
  const toPickup = gameState.groundItems.filter(
    (item) => dist(item.x, item.y, p.x, p.y) <= range,
  );
  for (const item of toPickup) {
    if (item.type === "gold") {
      const val = Math.floor(item.value * (1 + stats.goldBonus));
      p.gold += val;
      persistentData.totalGold += val;

      // 记录金币统计
      if (statisticsSystem) {
        statisticsSystem.recordGold(val);
      }

      changed = true;

      // 更新任务进度 - 金币
      updateQuestProgress("daily_gold_500", val);
    } else if (item.type === "heal") {
      const healed = stats.heal(item.heal);
      if (healed > 0) {
        addFloatingText(p.x, p.y, `+${healed}HP`, "#2ecc71");
        changed = true;
      }
    } else if (item.type === "equipment" && item.equipment) {
      // 拾取装备
      if (p.inventory.length < (persistentData.inventorySize || 25)) {
        item.seen = false; // 标记为未查看
        p.inventory.push(item);
        addLog(
          `获得装备: ${item.equipment.icon} ${item.equipment.name}`,
          "item",
        );
        changed = true;
        updateInventoryBadge(); // 更新角标

        // 更新任务进度 - 装备收集
        updateQuestProgress("daily_collect_5_equip", 1);
      }
    }
    gameState.groundItems = gameState.groundItems.filter((i) => i !== item);
  }

  if (changed) updateUI();
}

// ============================================
// 装备系统
// ============================================

function equipItem(inventoryIndex) {
  console.log("=== equipItem 调用 ===", inventoryIndex);
  const p = gameState.player;
  if (!p) {
    console.log("玩家不存在");
    return;
  }
  if (!p.inventory[inventoryIndex]) {
    console.log(
      "索引",
      inventoryIndex,
      "不存在，当前库存:",
      p.inventory.length,
    );
    return;
  }

  const item = p.inventory[inventoryIndex];
  console.log("物品类型:", item.type, "物品数据:", item);

  if (item.type !== "equipment" || !item.equipment) {
    console.log("不是装备或装备数据缺失");
    return;
  }

  const equip = item.equipment;
  const slot = equip.slot;
  console.log("装备槽位:", slot, "装备:", equip.name);

  // 如果该槽位已有装备，先卸下
  if (gameState.equipment[slot]) {
    console.log("卸下现有装备:", gameState.equipment[slot].name);
    p.inventory.push({
      type: "equipment",
      equipment: gameState.equipment[slot],
    });
    addLog(
      `卸下 ${gameState.equipment[slot].icon} ${gameState.equipment[slot].name}`,
      "info",
    );
  }

  // 装备新物品
  console.log("装备新物品到", slot);
  gameState.equipment[slot] = equip;
  p.inventory.splice(inventoryIndex, 1);

  // 更新属性
  updateEquipmentStats();

  addLog(`装备 ${equip.icon} ${equip.name}`, "success");
  console.log("装备成功，更新UI");
  updateUI();
}

function unequipItem(slot) {
  const p = gameState.player;
  if (!p || !gameState.equipment[slot]) return;

  if (p.inventory.length >= 12) {
    addLog("背包已满!", "warning");
    return;
  }

  p.inventory.push({ type: "equipment", equipment: gameState.equipment[slot] });
  addLog(
    `卸下 ${gameState.equipment[slot].icon} ${gameState.equipment[slot].name}`,
    "info",
  );
  gameState.equipment[slot] = null;
  updateEquipmentStats();
  updateUI();
}

// ============================================
// 升级
// ============================================

function checkLevelUp() {
  const p = gameState.player;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level++;
    p.xpToNext = Math.floor(
      CONFIG.LEVEL.BASE_XP * CONFIG.LEVEL.MULTIPLIER ** (p.level - 1),
    );

    // 更新属性
    if (gameState.playerStats) {
      gameState.playerStats.maxHp += CONFIG.PLAYER.HP_PER_LEVEL;
      gameState.playerStats.currentHp += CONFIG.PLAYER.HP_PER_LEVEL;
      gameState.playerStats.damage += CONFIG.PLAYER.DAMAGE_PER_LEVEL;
    }

    addLog(`升级! 等级 ${p.level}!`, "level");
    showLevelUpChoices();
    updateUI();

    // 更新任务进度 - 等级
    updateQuestProgress("daily_reach_level_10", p.level >= 10 ? 1 : 0);
    updateQuestProgress("weekly_level_30", p.level >= 30 ? 1 : 0);
  }
}

function showLevelUpChoices() {
  gameState.paused = true;
  gameState.levelUpChoices = [];

  const p = gameState.player;
  const modal = document.getElementById("level-up-modal");
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  // 创建新技能卡池
  const pool = [];
  
  // 添加新技能
  Object.keys(SKILLS_DATA).forEach(skillId => {
    pool.push({
      id: skillId,
      type: 'skill',
      ...SKILLS_DATA[skillId]
    });
  });
  
  // 添加被动道具
  Object.keys(PASSIVE_ITEMS).forEach(passiveId => {
    pool.push({
      id: passiveId,
      type: 'passive',
      ...PASSIVE_ITEMS[passiveId]
    });
  });
  
  // 添加旧属性卡
  const oldStatCards = UPGRADE_CARDS.filter(c => c.type === 'stat' || c.type === 'special');
  pool.push(...oldStatCards);

  const choices = [];

  while (choices.length < CONFIG.LEVEL.CARD_CHOICES && pool.length > 0) {
    const idx = rand(0, pool.length - 1);
    const card = pool.splice(idx, 1)[0];
    if (choices.find((c) => c.id === card.id)) continue;
    choices.push(card);
  }

  gameState.levelUpChoices = choices;

  for (let i = 0; i < choices.length; i++) {
    const card = choices[i];
    const div = document.createElement("div");
    div.className = "skill-card";
    div.dataset.index = i + 1;

    const existing = p.skills.find((s) => s.id === card.id);
    const owned = !!existing;
    const currentLevel = existing ? existing.level : 0;
    const nextLevel = currentLevel + 1;

    // 构建详细描述
    let descHtml = card.description || '';
    let statsHtml = "";
    let nextHtml = "";
    let evolutionHtml = "";

    if (owned && SKILLS_DATA[card.id]) {
      // 已有技能 - 显示升级信息
      const skillData = SKILLS_DATA[card.id];
      const levelData = skillData.levels[currentLevel - 1];
      const nextLevelData = skillData.levels[currentLevel];

      if (levelData && nextLevelData) {
        statsHtml = `<div class="card-stats">当前 Lv.${currentLevel} | 伤害: ${levelData.damage}</div>`;
        nextHtml = `<div class="card-next">➤ 升级到 Lv.${nextLevel}: 伤害 ${nextLevelData.damage}</div>`;
      }

      // 检查是否可以进化
      if (skillManager && skillManager.canEvolve(card.id)) {
        const evo = skillData.evolution;
        evolutionHtml = `<div class="card-next" style="color: #ff69b4; font-weight: bold;">★ 点击进化为 ${evo.icon} ${evo.name}！</div>`;
      } else if (currentLevel === 8 && skillData.evolution) {
        const evo = skillData.evolution;
        evolutionHtml = `<div class="card-next" style="color: #888;">🔒 需要被动: ${PASSIVE_ITEMS[skillData.evolution.requiredPassive]?.icon || ''}</div>`;
      }
    } else if (!owned && card.type === "skill") {
      // 新技能
      const skillData = SKILLS_DATA[card.id];
      if (skillData && skillData.levels && skillData.levels[0]) {
        const level1 = skillData.levels[0];
        statsHtml = `<div class="card-stats">伤害: ${level1.damage} | 范围: ${level1.range || '-'} | 稀有度: ${skillData.rarity}</div>`;
        nextHtml = `<div class="card-next">➤ 获得技能，从 Lv.1 开始</div>`;
      }
    } else if (card.type === "passive") {
      // 被动道具
      statsHtml = `<div class="card-stats">${card.description}</div>`;
      nextHtml = `<div class="card-next">➤ 获得被动增强</div>`;
      
      // 显示进化配方
      if (card.evolutionRecipe) {
        const recipes = Object.entries(card.evolutionRecipe);
        evolutionHtml = recipes.map(([skillId, evoId]) => {
          const skill = SKILLS_DATA[skillId];
          const evo = skill?.evolution;
          return `<div class="card-next" style="color: #f39c12; font-size: 11px;">${skill?.icon} ${skill?.name} Lv.8 + ${card.icon} = ${evo?.icon} ${evo?.name}</div>`;
        }).join('');
      }
    }

    const cardTypeLabel = card.type === "skill" ? 
      (owned ? "🔼 技能升级" : "✨ 新技能") : 
      card.type === "passive" ? "🎁 被动道具" : 
      card.type === "stat" ? "💪 属性强化" : "⭐ 特殊能力";

    div.innerHTML = `
      <div class="card-number">${i + 1}</div>
      <div class="card-icon">${card.icon}</div>
      <div class="card-name">${card.name} ${owned ? `<span style="color:#9b59b6;">Lv.${currentLevel}</span>` : ""}</div>
      <div class="card-desc">${descHtml}</div>
      ${statsHtml}
      ${nextHtml}
      ${evolutionHtml}
      <div class="card-type">${cardTypeLabel}</div>
    `;
    
    // 检查进化
    if (owned && skillManager && skillManager.canEvolve(card.id)) {
      div.onclick = () => {
        if (skillManager.evolveSkill(card.id)) {
          const evo = SKILLS_DATA[card.id].evolution;
          addLog(`🎉 ${card.name} 进化为 ${evo.icon} ${evo.name}！`, "legendary");
        }
        document.getElementById("level-up-modal").classList.remove("show");
        gameState.paused = false;
        updateUI();
      };
    } else {
      div.onclick = () => selectUpgrade(card);
    }
    
    container.appendChild(div);
  }

  modal.classList.add("show");
}

function selectUpgrade(card) {
  console.log("=== selectUpgrade 调用 ===");
  console.log("选择的卡牌:", card);
  console.log("卡牌类型:", card.type, "ID:", card.id);

  const p = gameState.player;
  if (!p) {
    console.log("玩家不存在，退出");
    document.getElementById("level-up-modal").classList.remove("show");
    gameState.paused = false;
    return;
  }

  // 检查是否是新技能系统
  const isNewSkill = SKILLS_DATA[card.id] !== undefined;
  const isPassive = PASSIVE_ITEMS[card.id] !== undefined;

  if (isNewSkill) {
    // 使用新技能系统
    const existing = p.skills.find((s) => s.id === card.id);
    
    if (existing) {
      // 升级技能
      if (skillManager) {
        const success = skillManager.upgradeSkill(card.id);
        if (success) {
          addLog(`${card.icon} ${card.name} -> Lv.${existing.level + 1}`, "success");
          
          // 检查进化
          if (skillManager.canEvolve(card.id)) {
            addLog(`⭐ ${card.name} 可以进化！`, "legendary");
          }
        }
      }
    } else {
      // 获得新技能
      if (skillManager) {
        const success = skillManager.addSkill(card.id);
        if (success) {
          addLog(`获得技能: ${card.icon} ${card.name}`, "success");
        }
      }
    }
  } else if (isPassive) {
    // 获得被动道具
    if (skillManager) {
      const success = skillManager.addPassiveItem(card.id);
      if (success) {
        addLog(`获得被动: ${card.icon} ${card.name}`, "info");
        
        // 检查是否有技能可以进化
        Object.keys(SKILLS_DATA).forEach(skillId => {
          if (skillManager.canEvolve(skillId)) {
            const skillData = SKILLS_DATA[skillId];
            addLog(`⭐ ${skillData.name} 可以进化为 ${skillData.evolution.name}！`, "legendary");
          }
        });
      }
    }
  } else {
    // 旧系统 - 属性强化
    console.log("非技能卡牌，类型:", card.type);
    if (card.effect && gameState.playerStats) {
      gameState.playerStats.applyStat(card.effect);
    }
    addLog(`获得强化: ${card.icon} ${card.name}`, "success");
  }

  document.getElementById("level-up-modal").classList.remove("show");
  gameState.paused = false;
  console.log("升级完成，技能列表:", p.skills);
  updateUI();
}

// ============================================
// 技能战斗
// ============================================

function updateSkills(dt) {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !stats) return;

  // 首次调用时打印技能列表
  if (!updateSkills.hasLogged) {
    console.log(
      "玩家技能列表:",
      p.skills.map((s) => ({
        name: s.name,
        cooldown: s.cooldown,
        type: s.type,
      })),
    );
    updateSkills.hasLogged = true;
  }

  for (const skill of p.skills) {
    if (skill.cooldown === 0 || skill.type === "orbit") {
      // 只打印一次，避免刷屏
      if (!updateSkills.skipLogged) {
        console.log(
          "跳过技能 (cooldown=0 或 orbit):",
          skill.name,
          "cooldown:",
          skill.cooldown,
        );
        updateSkills.skipLogged = true;
      }
      continue;
    }

    skill.timer = (skill.timer || 0) + dt * 1000;
    const cdMult = 1 - stats.cooldownReduction;
    const asMult = stats.attackSpeed;
    const actualCd = (skill.cooldown * Math.max(0.3, cdMult)) / asMult;

    if (skill.timer >= actualCd) {
      console.log(
        "技能就绪:",
        skill.name,
        "timer:",
        Math.floor(skill.timer),
        "cd:",
        Math.floor(actualCd),
      );
      skill.timer = 0;
      useSkill(skill, stats);
    }
  }

  // 更新环绕物
  const orbitSkills = p.skills.filter((s) => s.type === "orbit");
  if (orbitSkills.length > 0) {
    const skill = orbitSkills[0];
    const count = skill.count + stats.projectileCount;

    if (
      gameState.orbitals.length !== count ||
      gameState.orbitals.length === 0
    ) {
      gameState.orbitals = [];
      for (let i = 0; i < count; i++) {
        gameState.orbitals.push({
          angle: ((Math.PI * 2) / count) * i,
          radius: skill.radius || 2.5,
          damage: skill.damage * (1 + stats.skillDamageBonus),
          size: 0.3,
          hitCooldown: 0,
          hitTimer: 0,
        });
      }
    }

    for (const orb of gameState.orbitals) {
      orb.angle += dt * 3;
      const ox = p.x + Math.cos(orb.angle) * orb.radius;
      const oy = p.y + Math.sin(orb.angle) * orb.radius;

      // 更新击中冷却
      if (orb.hitTimer > 0) {
        orb.hitTimer -= dt * 1000;
      }

      for (const enemy of [...gameState.enemies]) {
        if (
          dist(enemy.x, enemy.y, ox, oy) < enemy.size * 0.5 + orb.size &&
          orb.hitTimer <= 0
        ) {
          damageEnemy(enemy, orb.damage, false);
          orb.hitTimer = 300; // 300ms冷却
        }
      }
    }
  }
}
updateSkills.hasLogged = false;
updateSkills.skipLogged = false;

function useSkill(skill, stats) {
  const p = gameState.player;
  console.log("=== useSkill 调用 ===", skill.name, skill.type);
  const critChance = stats.criticalChance;

  switch (skill.type) {
    case "melee": {
      console.log("近战技能:", skill.id, "范围:", skill.range);
      // 特殊处理旋风斩
      if (skill.id === "whirlwind") {
        console.log("旋风斩触发! 范围:", skill.range, "伤害:", skill.damage);
        // 对范围内所有敌人造成伤害
        for (const enemy of gameState.enemies) {
          if (dist(enemy.x, enemy.y, p.x, p.y) <= skill.range) {
            const result = stats.calculateDamage(skill.damage, "melee");
            damageEnemy(enemy, result.damage, result.isCritical);
          }
        }
        // 添加旋风特效 - 增加持续时间到 500ms
        const whirlwindData = {
          x: p.x,
          y: p.y,
          radius: skill.range,
          life: 500,
          maxLife: 500,
          angle: 0,
        };
        console.log("添加旋风特效:", whirlwindData);
        gameState.whirlwinds.push(whirlwindData);
        console.log("当前旋风数量:", gameState.whirlwinds.length);
        spawnParticles(p.x, p.y, "#e74c3c", 15);
        spawnParticles(p.x, p.y, "#f39c12", 10);
      } else {
        // 普通斩击
        for (const enemy of gameState.enemies) {
          if (dist(enemy.x, enemy.y, p.x, p.y) <= skill.range) {
            const result = stats.calculateDamage(skill.damage, "melee");
            damageEnemy(enemy, result.damage, result.isCritical);
          }
        }
        spawnParticles(p.x, p.y, "#f39c12", 5);
      }
      break;
    }
    case "ranged": {
      const count = (skill.projectileCount || 1) + stats.projectileCount;
      const pierce = stats.pierce;

      // 散弹枪特殊处理 - 扇形散射
      if (skill.id === "shotgun" && count >= 5) {
        // 找到最近的敌人作为目标方向
        const nearestEnemy = gameState.enemies
          .filter((e) => dist(e.x, e.y, p.x, p.y) <= skill.range)
          .sort(
            (a, b) => dist(a.x, a.y, p.x, p.y) - dist(b.x, b.y, p.x, p.y),
          )[0];

        const baseAngle = nearestEnemy
          ? Math.atan2(nearestEnemy.y - p.y, nearestEnemy.x - p.x)
          : Math.random() * Math.PI * 2;

        const spreadAngle = ((skill.spread || 30) * Math.PI) / 180; // 转换为弧度
        const projectileAngle = spreadAngle / (count - 1); // 每个子弹的角度间隔

        for (let i = 0; i < count; i++) {
          const angle = baseAngle - spreadAngle / 2 + projectileAngle * i;
          const result = stats.calculateDamage(skill.damage, "ranged");

          gameState.projectiles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(angle) * skill.speed,
            vy: Math.sin(angle) * skill.speed,
            damage: result.damage,
            pierce,
            range: skill.range,
            startX: p.x,
            startY: p.y,
            color: "#ff6600",
            size: 0.3,
            explosive: false,
            explosionRadius: 0,
            isCritical: result.isCritical,
          });
        }

        // 散弹枪特效 - 扇形粒子
        spawnParticles(p.x, p.y, "#ff6600", 8);
      } else {
        // 其他远程技能 - 追踪目标
        const targets = gameState.enemies
          .filter((e) => dist(e.x, e.y, p.x, p.y) <= skill.range)
          .sort((a, b) => dist(a.x, a.y, p.x, p.y) - dist(b.x, b.y, p.x, p.y))
          .slice(0, count);

        for (const target of targets) {
          const angle = Math.atan2(target.y - p.y, target.x - p.x);
          const result = stats.calculateDamage(
            skill.damage,
            skill.explosive ? "magic" : "ranged",
          );
          gameState.projectiles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(angle) * skill.speed,
            vy: Math.sin(angle) * skill.speed,
            damage: result.damage,
            pierce,
            range: skill.range,
            startX: p.x,
            startY: p.y,
            color: skill.explosive ? "#ff6600" : "#f1c40f",
            size: skill.explosive ? 0.35 : 0.25,
            explosive: skill.explosive || false,
            explosionRadius: skill.explosionRadius || 0,
            isCritical: result.isCritical,
          });
        }
      }
      break;
    }
    case "mine": {
      gameState.mines.push({
        x: p.x,
        y: p.y,
        damage: skill.damage,
        duration: skill.duration,
        radius: skill.radius,
      });
      break;
    }
    case "lightning": {
      const targets = gameState.enemies
        .filter((e) => dist(e.x, e.y, p.x, p.y) <= skill.range)
        .sort(() => Math.random() - 0.5)
        .slice(0, skill.chainCount);

      if (targets.length > 0) {
        let lx = p.x,
          ly = p.y;
        for (const t of targets) {
          gameState.lightnings.push({
            x1: lx,
            y1: ly,
            x2: t.x,
            y2: t.y,
            life: 12,
          });
          const result = stats.calculateDamage(skill.damage, "magic");
          damageEnemy(t, result.damage, result.isCritical);
          lx = t.x;
          ly = t.y;
        }
      }
      break;
    }
  }
}

function damageEnemy(enemy, damage, isCrit) {
  enemy.hp -= damage;
  enemy.hitFlash = 5;
  addFloatingText(
    enemy.x,
    enemy.y,
    isCrit ? `暴击! ${Math.floor(damage)}` : `-${Math.floor(damage)}`,
    isCrit ? "#f1c40f" : "#e74c3c",
  );
  spawnParticles(enemy.x, enemy.y, enemy.color, 3);

  // 记录伤害统计
  if (statisticsSystem) {
    statisticsSystem.recordDamage(
      damage,
      isCrit,
      enemy.type,
      enemy.lastHitSkill,
    );
  }

  if (enemy.hp <= 0) killEnemy(enemy);
}

function killEnemy(enemy) {
  const p = gameState.player;
  const stats = gameState.playerStats;
  p.kills++;
  gameState.kills++;

  // 记录连击
  if (comboSystem) {
    comboSystem.recordKill(enemy.x, enemy.y);
  }

  // 更新挑战进度
  if (eventSystem && eventSystem.challenge.active) {
    eventSystem.updateChallengeProgress(1);
  }

  // 记录击杀统计
  if (statisticsSystem) {
    statisticsSystem.recordKill(enemy.type, enemy.lastHitSkill, enemy.isBoss);
  }

  // 更新任务进度 - 击杀数
  updateQuestProgress("daily_kill_50", 1);
  updateQuestProgress("weekly_kill_500", 1);

  gameState.xpOrbs.push({
    x: enemy.x + randFloat(-0.3, 0.3),
    y: enemy.y + randFloat(-0.3, 0.3),
    value: enemy.xp * (1 + stats.xpBonus),
  });
  gameState.groundItems.push({
    type: "gold",
    x: enemy.x + randFloat(-0.3, 0.3),
    y: enemy.y + randFloat(-0.3, 0.3),
    value: enemy.gold * (1 + stats.goldBonus),
  });

  // 装备掉落
  if (chance(CONFIG.EQUIPMENT.DROP_CHANCE * 100)) {
    const equip = generateEquipment(p.level);
    if (equip) {
      gameState.groundItems.push({
        type: "equipment",
        x: enemy.x,
        y: enemy.y,
        icon: equip.icon,
        name: equip.name,
        equipment: equip,
      });
      addLog(
        `${enemy.name} 掉落了 ${equip.icon} ${RARITY[equip.rarity].name} ${equip.name}!`,
        "item",
      );

      // 更新任务进度 - 装备收集
      updateQuestProgress("daily_collect_5_equip", 1);
    }
  }

  if (chance(3)) {
    gameState.groundItems.push({
      type: "heal",
      x: enemy.x,
      y: enemy.y,
      icon: "❤️",
      name: "生命药水",
      heal: 30,
    });
  }

  spawnParticles(enemy.x, enemy.y, enemy.color, 10);

  // 释放敌人回对象池
  releaseEnemyToPool(enemy);

  gameState.enemies = gameState.enemies.filter((e) => e !== enemy);
}

// ============================================
// 敌人和宝箱
// ============================================

function spawnEnemies() {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (gameState.enemies.length >= CONFIG.ENEMY.MAX_COUNT) return;

  // 基于时间的难度缩放（分钟）
  const timeMinutes = gameState.time / 60;

  // 敌人属性基于玩家属性的百分比
  const playerHpBase = stats.maxHp || CONFIG.PLAYER.BASE_HP;
  const atkMult =
    CONFIG.ENEMY.BASE_ATK_MULT + timeMinutes * CONFIG.ENEMY.ATK_SCALE_PER_MIN;
  const hpMult =
    CONFIG.ENEMY.BASE_HP_MULT + timeMinutes * CONFIG.ENEMY.HP_SCALE_PER_MIN;

  // 计算敌人数值
  const enemyAtkBase = playerHpBase * atkMult; // 攻击为玩家HP的百分比
  const enemyHpBase = playerHpBase * hpMult; // HP为玩家HP的百分比

  const count = Math.floor(2 + timeMinutes * 2); // 逐渐增加数量

  const types = Object.entries(ENEMY_TYPES).filter(([_, e]) => {
    if (timeMinutes > 3) return true; // 3分钟后出所有怪
    if (timeMinutes > 1.5) return e.atk <= 10; // 1.5分钟后出恶魔
    return e.atk <= 7; // 前期只出老鼠和骷髅
  });

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const d = randFloat(
      CONFIG.ENEMY.SPAWN_RADIUS_MIN,
      CONFIG.ENEMY.SPAWN_RADIUS_MAX,
    );
    const ex = p.x + Math.cos(angle) * d;
    const ey = p.y + Math.sin(angle) * d;

    if (
      ex < 1 ||
      ex >= CONFIG.ARENA_SIZE - 1 ||
      ey < 1 ||
      ey >= CONFIG.ARENA_SIZE - 1
    )
      continue;

    const [type, tmpl] = types[rand(0, types.length - 1)];

    // 应用类型倍数
    const typeMult = tmpl.atk / 5; // 以丧尸攻击为基准
    const finalAtk = Math.floor(enemyAtkBase * typeMult * randFloat(0.8, 1.2));
    const finalHp = Math.floor(enemyHpBase * typeMult * randFloat(0.8, 1.2));

    // 从对象池获取敌人
    const enemy = getEnemyFromPool();
    enemy.type = type;
    enemy.x = ex;
    enemy.y = ey;
    enemy.hp = Math.max(10, finalHp);
    enemy.maxHp = Math.max(10, finalHp);
    enemy.atk = Math.max(2, finalAtk);
    enemy.speed = tmpl.speed;
    enemy.xp = Math.floor(tmpl.xp * (1 + timeMinutes * 0.1));
    enemy.gold = Math.floor(tmpl.gold * (1 + timeMinutes * 0.1));
    enemy.icon = tmpl.icon;
    enemy.size = tmpl.size;
    enemy.color = tmpl.color;
    enemy.hitFlash = 0;
    enemy.name = tmpl.name;
    enemy.isBoss = false;

    gameState.enemies.push(enemy);
  }
}

// 生成Boss
function spawnBoss() {
  const p = gameState.player;
  if (!p) return;

  const bossKeys = Object.keys(BOSS_TYPES);
  const bossType = bossKeys[rand(0, bossKeys.length - 1)];
  const tmpl = BOSS_TYPES[bossType];

  const angle = Math.random() * Math.PI * 2;
  const d = randFloat(12, 15);
  const bx = p.x + Math.cos(angle) * d;
  const by = p.y + Math.sin(angle) * d;

  const timeMinutes = gameState.time / 60;
  const hpMult = 1 + timeMinutes * 0.2;
  const atkMult = 1 + timeMinutes * 0.15;

  // 从对象池获取Boss
  const boss = getEnemyFromPool();
  boss.type = bossType;
  boss.x = bx;
  boss.y = by;
  boss.hp = Math.floor(tmpl.hp * hpMult);
  boss.maxHp = Math.floor(tmpl.hp * hpMult);
  boss.atk = Math.floor(tmpl.atk * atkMult);
  boss.speed = tmpl.speed;
  boss.xp = Math.floor(tmpl.xp * (1 + timeMinutes * 0.1));
  boss.gold = Math.floor(tmpl.gold * (1 + timeMinutes * 0.1));
  boss.icon = tmpl.icon;
  boss.size = tmpl.size;
  boss.color = tmpl.color;
  boss.hitFlash = 0;
  boss.isBoss = true;
  boss.name = tmpl.name;

  gameState.enemies.push(boss);

  addLog(`⚠️ Boss出现: ${tmpl.icon} ${tmpl.name}!`, "warning");
  spawnParticles(bx, by, tmpl.color, 30);
}

// 无尽模式难度递增
function applyEndlessScaling() {
  const wave = gameState.endlessWave || 1;
  const scale = 1 + wave * CONFIG.ENDLESS.DIFFICULTY_SCALE;

  // 增加敌人数量和强度
  CONFIG.ENEMY.SPAWN_INTERVAL = Math.max(1000, 3000 - wave * 100);
  CONFIG.ENEMY.MAX_COUNT = Math.min(400, 250 + wave * 10);

  return scale;
}

function spawnChest() {
  if (gameState.chests.length >= CONFIG.CHEST.MAX_COUNT) return;

  const p = gameState.player;
  const angle = Math.random() * Math.PI * 2;
  const d = randFloat(5, 10);
  const cx = p.x + Math.cos(angle) * d;
  const cy = p.y + Math.sin(angle) * d;

  if (
    cx < 2 ||
    cx >= CONFIG.ARENA_SIZE - 2 ||
    cy < 2 ||
    cy >= CONFIG.ARENA_SIZE - 2
  )
    return;

  const types = [
    { name: "金币箱", icon: "💰", type: "gold", value: rand(15, 40) },
    { name: "经验箱", icon: "📦", type: "xp", value: rand(20, 50) },
    { name: "医疗箱", icon: "🏥", type: "heal", value: 40 },
    { name: "宝箱", icon: "🎁", type: "rare", value: rand(30, 60) },
  ];
  const chest = types[rand(0, types.length - 1)];

  gameState.chests.push({
    x: cx,
    y: cy,
    ...chest,
    life: CONFIG.CHEST.LIFETIME,
  });
}

// ============================================
// 搜索点系统
// ============================================

function spawnSearchPoint() {
  if (gameState.searchPoints.length >= CONFIG.SEARCH_POINT.MAX_COUNT) return;

  const p = gameState.player;
  const angle = Math.random() * Math.PI * 2;
  const d = randFloat(3, 8);
  const sx = p.x + Math.cos(angle) * d;
  const sy = p.y + Math.sin(angle) * d;

  if (
    sx < 2 ||
    sx >= CONFIG.ARENA_SIZE - 2 ||
    sy < 2 ||
    sy >= CONFIG.ARENA_SIZE - 2
  )
    return;

  gameState.searchPoints.push({
    x: sx,
    y: sy,
    searching: false,
    searchProgress: 0,
    radius: CONFIG.SEARCH_POINT.RADIUS,
  });

  addLog("发现新的搜索点!", "info");
}

function updateSearchPoints(dt) {
  const p = gameState.player;
  if (!p) return;

  const searchRadius = CONFIG.SEARCH_POINT.RADIUS;
  const searchTime = CONFIG.SEARCH_POINT.SEARCH_TIME;

  for (const sp of gameState.searchPoints) {
    const d = dist(p.x, p.y, sp.x, sp.y);

    if (d <= searchRadius) {
      // 玩家在搜索范围内
      if (!sp.searching) {
        sp.searching = true;
        sp.searchProgress = 0;
        addLog("开始搜索...", "info");
      }

      sp.searchProgress += dt;

      if (sp.searchProgress >= searchTime) {
        // 搜索完成
        searchPointSuccess(sp);

        // 更新任务进度 - 搜索
        updateQuestProgress("daily_search_5", 1);

        gameState.searchPoints = gameState.searchPoints.filter((s) => s !== sp);
        break;
      }
    } else {
      // 玩家离开范围，重置
      if (sp.searching) {
        sp.searching = false;
        sp.searchProgress = 0;
        addLog("搜索中断", "warning");
      }
    }
  }
}

function searchPointSuccess(sp) {
  addLog("搜索成功!", "success");
  spawnParticles(sp.x, sp.y, "#f1c40f", 15);
  addFloatingText(sp.x, sp.y, "搜索完成!", "#f1c40f");

  // 决定掉落数量
  const dropCount = rand(
    CONFIG.SEARCH_POINT.DROP_COUNT_MIN,
    CONFIG.SEARCH_POINT.DROP_COUNT_MAX,
  );

  for (let i = 0; i < dropCount; i++) {
    const roll = Math.random() * 100;
    let dropped = false;

    // 30% 掉落装备
    if (roll < CONFIG.SEARCH_POINT.EQUIPMENT_CHANCE * 100) {
      const equip = generateEquipment(gameState.player.level);
      if (equip) {
        gameState.groundItems.push({
          type: "equipment",
          x: sp.x + randFloat(-0.5, 0.5),
          y: sp.y + randFloat(-0.5, 0.5),
          icon: equip.icon,
          name: equip.name,
          equipment: equip,
        });
        addLog(
          `发现 ${RARITY[equip.rarity].name} ${equip.icon} ${equip.name}!`,
          "item",
        );
        dropped = true;
      }
    }

    // 40% 掉落血药
    if (
      !dropped &&
      roll <
        (CONFIG.SEARCH_POINT.EQUIPMENT_CHANCE +
          CONFIG.SEARCH_POINT.HEAL_CHANCE) *
          100
    ) {
      const healValue = rand(20, 50);
      gameState.groundItems.push({
        type: "heal",
        x: sp.x + randFloat(-0.5, 0.5),
        y: sp.y + randFloat(-0.5, 0.5),
        icon: "❤️",
        name: "生命药水",
        heal: healValue,
      });
      addFloatingText(sp.x, sp.y, `+${healValue}HP`, "#2ecc71");
      dropped = true;
    }

    // 80% 掉落金币（独立）
    if (roll < CONFIG.SEARCH_POINT.GOLD_CHANCE * 100) {
      const goldValue = rand(10, 30);
      gameState.groundItems.push({
        type: "gold",
        x: sp.x + randFloat(-0.5, 0.5),
        y: sp.y + randFloat(-0.5, 0.5),
        value: goldValue,
      });
      addFloatingText(sp.x, sp.y, `+${goldValue}💰`, "#f1c40f");
    }

    // 50% 掉落经验（独立）
    if (roll < CONFIG.SEARCH_POINT.XP_CHANCE * 100) {
      const xpValue = rand(15, 40);
      gameState.groundItems.push({
        type: "xp",
        x: sp.x + randFloat(-0.5, 0.5),
        y: sp.y + randFloat(-0.5, 0.5),
        value: xpValue,
      });
      addFloatingText(sp.x, sp.y, `+${xpValue}XP`, "#3498db");
    }
  }
}

function openChest(chest) {
  const p = gameState.player;
  const stats = gameState.playerStats;

  // 记录宝箱统计
  if (statisticsSystem) {
    statisticsSystem.recordChestOpened();
  }

  switch (chest.type) {
    case "gold":
      const gold = Math.floor(chest.value * (1 + stats.goldBonus));
      p.gold += gold;
      persistentData.totalGold += gold;
      addFloatingText(chest.x, chest.y, `+${gold}💰`, "#f1c40f");

      // 记录金币统计
      if (statisticsSystem) {
        statisticsSystem.recordGold(gold);
      }
      break;
    case "xp":
      p.xp += chest.value * (1 + stats.xpBonus);
      addFloatingText(chest.x, chest.y, `+${chest.value}XP`, "#3498db");
      checkLevelUp();
      break;
    case "heal":
      const healed = stats.heal(chest.value);
      addFloatingText(chest.x, chest.y, `+${healed}HP`, "#2ecc71");
      break;
    case "rare":
      p.gold += chest.value;
      persistentData.totalGold += chest.value;
      addFloatingText(chest.x, chest.y, `+${chest.value}💰`, "#f1c40f");

      // 记录金币统计
      if (statisticsSystem) {
        statisticsSystem.recordGold(chest.value);
      }
      break;
  }

  spawnParticles(chest.x, chest.y, "#f1c40f", 15);
  gameState.chests = gameState.chests.filter((c) => c !== chest);
}

// ============================================
// 更新实体
// ============================================

function updateEntities(dt) {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !stats) return;

  // 投射物
  gameState.projectiles = gameState.projectiles.filter((proj) => {
    proj.x += proj.vx * dt;
    proj.y += proj.vy * dt;
    if (dist(proj.x, proj.y, proj.startX, proj.startY) > proj.range)
      return false;

    for (const enemy of [...gameState.enemies]) {
      if (
        dist(enemy.x, enemy.y, proj.x, proj.y) <
        enemy.size * 0.5 + proj.size
      ) {
        if (proj.explosive) {
          for (const e of [...gameState.enemies]) {
            if (dist(e.x, e.y, proj.x, proj.y) < proj.explosionRadius) {
              damageEnemy(e, proj.damage, proj.isCritical);
            }
          }
          spawnParticles(proj.x, proj.y, "#ff6600", 20);
          addFloatingText(proj.x, proj.y, "💥", "#ff6600");
        } else {
          damageEnemy(enemy, proj.damage, proj.isCritical);
        }
        if (!proj.explosive && proj.pierce <= 0) return false;
        if (proj.explosive) return false;
        proj.pierce--;
      }
    }
    return true;
  });

  // 地雷
  gameState.mines = gameState.mines.filter((mine) => {
    mine.duration -= dt * 1000;
    if (mine.duration <= 0) return false;

    for (const enemy of gameState.enemies) {
      if (dist(enemy.x, enemy.y, mine.x, mine.y) < mine.radius) {
        for (const e of [...gameState.enemies]) {
          if (dist(e.x, e.y, mine.x, mine.y) < mine.radius * 2)
            damageEnemy(e, mine.damage, false);
        }
        spawnParticles(mine.x, mine.y, "#e74c3c", 15);
        addFloatingText(mine.x, mine.y, "💥", "#e74c3c");
        return false;
      }
    }
    return true;
  });

  // 敌人
  for (const enemy of gameState.enemies) {
    const dx = p.x - enemy.x;
    const dy = p.y - enemy.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > 0.5) {
      const nx = enemy.x + (dx / d) * enemy.speed * dt;
      const ny = enemy.y + (dy / d) * enemy.speed * dt;

      let blocked = false;
      for (const other of gameState.enemies) {
        if (other === enemy) continue;
        if (dist(nx, ny, other.x, other.y) < 0.6) {
          blocked = true;
          break;
        }
      }
      if (!blocked) {
        enemy.x = nx;
        enemy.y = ny;
      }
    }

    if (d < 0.7) {
      const result = stats.takeDamage(enemy.atk);
      if (!result.isDodged && result.damage > 0) {
        // 荆棘伤害
        if (stats.thorns > 0) {
          enemy.hp -= stats.thorns;
          if (enemy.hp <= 0) killEnemy(enemy);
        }
      }
      if (!stats.isAlive()) {
        gameOver();
        return;
      }
    }

    if (enemy.hitFlash > 0) enemy.hitFlash--;
  }

  // 经验球
  gameState.xpOrbs = gameState.xpOrbs.filter((orb) => {
    const d = dist(orb.x, orb.y, p.x, p.y);
    if (d < stats.pickupRange * 3) {
      orb.x += (p.x - orb.x) * 6 * dt;
      orb.y += (p.y - orb.y) * 6 * dt;
    }
    if (d < stats.pickupRange) {
      p.xp += orb.value;
      checkLevelUp();
      return false;
    }
    return true;
  });

  // 宝箱倒计时
  gameState.chests = gameState.chests.filter((c) => {
    c.life -= dt;
    return c.life > 0;
  });

  updateEffects();
}

// ============================================
// 渲染
// ============================================

function render() {
  const ts = CONFIG.TILE_SIZE;
  const p = gameState.player;
  if (!p) return;

  const stats = gameState.playerStats;
  const camX = p.x * ts - canvas.width / 2;
  const camY = p.y * ts - canvas.height / 2;

  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 地面网格
  const startX = Math.floor(camX / ts);
  const startY = Math.floor(camY / ts);
  const endX = Math.ceil((camX + canvas.width) / ts);
  const endY = Math.ceil((camY + canvas.height) / ts);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const sx = x * ts - camX;
      const sy = y * ts - camY;

      if (x < 0 || x >= CONFIG.ARENA_SIZE || y < 0 || y >= CONFIG.ARENA_SIZE) {
        ctx.fillStyle = "#1a1a2e";
      } else {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#151515" : "#1a1a1a";
      }
      ctx.fillRect(sx, sy, ts, ts);
    }
  }

  ctx.strokeStyle = "#e74c3c";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    0 - camX,
    0 - camY,
    CONFIG.ARENA_SIZE * ts,
    CONFIG.ARENA_SIZE * ts,
  );

  // 宝箱
  for (const chest of gameState.chests) {
    const sx = chest.x * ts - camX + ts / 2;
    const sy = chest.y * ts - camY + ts / 2;
    const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;

    ctx.fillStyle = `rgba(241, 196, 15, ${pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(sx, sy, ts * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(chest.icon, sx, sy);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    ctx.fillText(`${Math.ceil(chest.life)}s`, sx, sy + ts * 0.5);
  }

  // 搜索点
  for (const sp of gameState.searchPoints) {
    const sx = sp.x * ts - camX + ts / 2;
    const sy = sp.y * ts - camY + ts / 2;

    // 搜索范围圈
    ctx.strokeStyle = sp.searching
      ? "rgba(46, 204, 113, 0.6)"
      : "rgba(155, 89, 182, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, sp.radius * ts, 0, Math.PI * 2);
    ctx.stroke();

    // 中心图标
    const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(155, 89, 182, ${pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(sx, sy, ts * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔍", sx, sy);

    // 搜索进度条
    if (sp.searching) {
      const progress = sp.searchProgress / CONFIG.SEARCH_POINT.SEARCH_TIME;
      const barWidth = ts * 0.8;
      const barHeight = 4;
      const barY = sy + ts * 0.7;

      ctx.fillStyle = "#333";
      ctx.fillRect(sx - barWidth / 2, barY, barWidth, barHeight);
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(sx - barWidth / 2, barY, barWidth * progress, barHeight);

      ctx.font = "10px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(`${Math.floor(progress * 100)}%`, sx, barY + 12);
    } else {
      ctx.font = "10px Arial";
      ctx.fillStyle = "#888";
      ctx.fillText("靠近搜索", sx, sy + ts * 0.7);
    }
  }

  // 地雷
  for (const mine of gameState.mines) {
    const sx = mine.x * ts - camX + ts / 2;
    const sy = mine.y * ts - camY + ts / 2;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💣", sx, sy);
  }

  // 旋风斩特效
  if (gameState.whirlwinds.length > 0) {
    console.log("渲染旋风斩特效，数量:", gameState.whirlwinds.length);
  }
  for (const w of gameState.whirlwinds) {
    const sx = w.x * ts - camX + ts / 2;
    const sy = w.y * ts - camY + ts / 2;
    const alpha = w.life / w.maxLife;
    const radius = w.radius * ts;

    console.log(
      "渲染单个旋风:",
      "x:",
      w.x,
      "y:",
      w.y,
      "alpha:",
      alpha,
      "radius:",
      radius,
    );

    // 外圈旋转弧线 - 更粗更亮
    ctx.strokeStyle = `rgba(231, 76, 60, ${alpha * 0.9})`;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(sx, sy, radius, w.angle, w.angle + Math.PI * 1.8);
    ctx.stroke();

    // 第二条旋转弧线
    ctx.strokeStyle = `rgba(243, 156, 18, ${alpha * 0.7})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sx, sy, radius * 0.85, w.angle + Math.PI, w.angle + Math.PI * 2.5);
    ctx.stroke();

    // 内部填充光
    ctx.fillStyle = `rgba(231, 76, 60, ${alpha * 0.15})`;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 中心闪光
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
    ctx.beginPath();
    ctx.arc(sx, sy, ts * 0.8 * alpha, 0, Math.PI * 2);
    ctx.fill();

    // 边缘粒子效果
    for (let i = 0; i < 8; i++) {
      const angle = w.angle + ((Math.PI * 2) / 8) * i;
      const px = sx + Math.cos(angle) * radius;
      const py = sy + Math.sin(angle) * radius;
      ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(px, py, 2 + alpha * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 经验球
  for (const orb of gameState.xpOrbs) {
    const sx = orb.x * ts - camX + ts / 2;
    const sy = orb.y * ts - camY + ts / 2;
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 物品（包括装备）
  for (const item of gameState.groundItems) {
    const sx = item.x * ts - camX + ts / 2;
    const sy = item.y * ts - camY + ts / 2;

    // 脉冲光效
    const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;

    if (item.type === "equipment") {
      // 装备发光效果 - 根据品质
      const rarity = item.equipment.rarity;
      const glowColor = RARITY[rarity].color;

      // 外层光晕 - 品质颜色
      ctx.fillStyle = glowColor + "30"; // 20%透明度
      ctx.beginPath();
      ctx.arc(sx, sy, ts * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // 中层光晕
      ctx.fillStyle = glowColor + "50"; // 30%透明度
      ctx.beginPath();
      ctx.arc(sx, sy, ts * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // 高价值物品特殊发光特效（史诗和传奇）
      if (rarity === "epic" || rarity === "legendary") {
        // 旋转光环
        const time = Date.now() / 1000;
        ctx.strokeStyle = glowColor + "80";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, ts * 0.7, time, time + Math.PI * 1.5);
        ctx.stroke();

        // 粒子效果
        for (let i = 0; i < 6; i++) {
          const angle = time * 2 + ((Math.PI * 2) / 6) * i;
          const px = sx + Math.cos(angle) * ts * 0.6;
          const py = sy + Math.sin(angle) * ts * 0.6;
          ctx.fillStyle = glowColor + "60";
          ctx.beginPath();
          ctx.arc(px, py, 2 + pulse * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // 普通物品（金币等）
      ctx.fillStyle = `rgba(241, 196, 15, ${pulse * 0.2})`;
      ctx.beginPath();
      ctx.arc(sx, sy, ts * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 放大物品图标 - 从14提升到20
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.icon || "💰", sx, sy);
  }

  // 敌人
  for (const enemy of gameState.enemies) {
    const sx = enemy.x * ts - camX + ts / 2;
    const sy = enemy.y * ts - camY + ts / 2;

    // 放大怪物图标 - 从20提升到28
    ctx.font = `${28 * enemy.size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (enemy.hitFlash > 0) ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    ctx.fillText(enemy.icon, sx, sy);
    ctx.globalAlpha = 1;

    // 放大血条 - 从ts*0.9提升到ts*1.2，高度从3提升到5
    const bw = ts * 1.2;
    const hpPct = enemy.hp / enemy.maxHp;
    ctx.fillStyle = "#333";
    ctx.fillRect(sx - bw / 2, sy - ts * 0.65, bw, 5);
    ctx.fillStyle =
      hpPct > 0.5 ? "#27ae60" : hpPct > 0.25 ? "#f39c12" : "#e74c3c";
    ctx.fillRect(sx - bw / 2, sy - ts * 0.65, bw * hpPct, 5);
  }

  // 投射物
  for (const proj of gameState.projectiles) {
    const sx = proj.x * ts - camX + ts / 2;
    const sy = proj.y * ts - camY + ts / 2;

    // 火球术特效 - 更大的火球带焰尾
    if (proj.explosive) {
      // 焰尾
      ctx.fillStyle = "rgba(255, 102, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(
        sx - proj.vx * 3,
        sy - proj.vy * 3,
        proj.size * ts,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // 主体大火球
      ctx.fillStyle = "#ff4500";
      ctx.beginPath();
      ctx.arc(sx, sy, proj.size * ts, 0, Math.PI * 2);
      ctx.fill();

      // 内核
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(sx, sy, proj.size * ts * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // 外围光晕
      ctx.fillStyle = "rgba(255, 69, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(sx, sy, proj.size * ts * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 普通子弹
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(sx, sy, (proj.size * ts) / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = proj.explosive
        ? "rgba(255, 102, 0, 0.5)"
        : "rgba(241, 196, 15, 0.3)";
      ctx.beginPath();
      ctx.arc(
        sx - proj.vx * 2,
        sy - proj.vy * 2,
        (proj.size * ts) / 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // 环绕物
  for (const orb of gameState.orbitals) {
    const ox = p.x + Math.cos(orb.angle) * orb.radius;
    const oy = p.y + Math.sin(orb.angle) * orb.radius;
    const sx = ox * ts - camX + ts / 2;
    const sy = oy * ts - camY + ts / 2;
    ctx.fillStyle = "#9b59b6";
    ctx.beginPath();
    ctx.arc(sx, sy, (orb.size * ts) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(sx, sy, (orb.size * ts) / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 玩家
  const px = p.x * ts - camX + ts / 2;
  const py = p.y * ts - camY + ts / 2;

  ctx.fillStyle = "rgba(52, 152, 219, 0.3)";
  ctx.beginPath();
  ctx.arc(px, py, ts * 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🧑‍🚀", px, py);

  // 角色头顶的血条和经验条
  const barWidth = ts * 1.5;
  const barHeight = 5;
  const barY = py - ts * 0.9; // 头顶偏移

  // 血条背景
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(px - barWidth / 2, barY, barWidth, barHeight);

  // 血条（绿色）
  const hpPercent = stats.currentHp / stats.maxHp;
  ctx.fillStyle =
    hpPercent > 0.5 ? "#27ae60" : hpPercent > 0.25 ? "#f39c12" : "#e74c3c";
  ctx.fillRect(px - barWidth / 2, barY, barWidth * hpPercent, barHeight);

  // 血条边框
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.strokeRect(px - barWidth / 2, barY, barWidth, barHeight);

  // 经验条背景
  const xpBarY = barY + barHeight + 2;
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(px - barWidth / 2, xpBarY, barWidth, barHeight);

  // 经验条（蓝色）
  const xpPercent = p.xp / p.xpToNext;
  ctx.fillStyle = "#3498db";
  ctx.fillRect(px - barWidth / 2, xpBarY, barWidth * xpPercent, barHeight);

  // 经验条边框
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.strokeRect(px - barWidth / 2, xpBarY, barWidth, barHeight);

  // 等级显示（在血条和经验条上方）
  ctx.font = "bold 10px Arial";
  ctx.fillStyle = "#3498db";
  ctx.fillText(`Lv.${p.level}`, px, barY - 8);

  // 闪电
  for (const l of gameState.lightnings) {
    const x1 = l.x1 * ts - camX + ts / 2;
    const y1 = l.y1 * ts - camY + ts / 2;
    const x2 = l.x2 * ts - camX + ts / 2;
    const y2 = l.y2 * ts - camY + ts / 2;
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i <= 5; i++) {
      const t = i / 5;
      ctx.lineTo(
        x1 + (x2 - x1) * t + (Math.random() - 0.5) * 25,
        y1 + (y2 - y1) * t + (Math.random() - 0.5) * 25,
      );
    }
    ctx.stroke();
  }

  // 粒子
  for (const part of gameState.particles) {
    const alpha = part.life / part.maxLife;
    ctx.fillStyle = part.color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(part.x - camX, part.y - camY, part.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const ft of gameState.floatingTexts) {
    const alpha = ft.life / ft.maxLife;
    ctx.fillStyle = ft.color;
    ctx.globalAlpha = alpha;
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(ft.text, ft.x - camX, ft.y - camY);
  }
  ctx.globalAlpha = 1;

  // 渲染新技能特效
  if (skillManager) {
    skillManager.render();
  }

  renderMinimap();
}

// renderMinimap 已移至 renderer.js 中

// ============================================
// UI
// ============================================

function updateUI() {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !stats) return;

  document.getElementById("hp-display").textContent =
    `${Math.floor(stats.currentHp)}/${stats.maxHp}`;
  document.getElementById("hp-bar").style.width =
    (stats.currentHp / stats.maxHp) * 100 + "%";
  document.getElementById("level-display").textContent = p.level;
  document.getElementById("xp-display").textContent =
    `${Math.floor(p.xp)}/${p.xpToNext}`;
  document.getElementById("xp-bar").style.width =
    (p.xp / p.xpToNext) * 100 + "%";
  document.getElementById("gold-display").textContent = p.gold;
  document.getElementById("kills-display").textContent = gameState.kills;
  document.getElementById("time-display").textContent = formatTime(
    gameState.time,
  );

  // 更新背包格子显示
  const slotsDisplay = document.getElementById("inventory-slots-display");
  if (slotsDisplay)
    slotsDisplay.textContent = persistentData.inventorySize || 25;

  // 装备面板
  for (const slot of Object.values(EQUIPMENT_SLOT)) {
    const slotDiv = document.querySelector(`[data-slot="${slot}"]`);
    if (slotDiv) {
      const itemSpan = slotDiv.querySelector(".slot-item");
      if (gameState.equipment[slot]) {
        const equip = gameState.equipment[slot];
        itemSpan.textContent = `${equip.icon} ${equip.name}`;
        itemSpan.style.color = RARITY[equip.rarity].color;
        slotDiv.onclick = () => unequipItem(slot);
      } else {
        const slotNames = {
          weapon: "武器",
          chest: "胸甲",
          boots: "鞋子",
          accessory: "饰品",
        };
        itemSpan.textContent = slotNames[slot] || slot;
        itemSpan.style.color = "#666";
        slotDiv.onclick = null;
      }
    }
  }

  // 属性面板
  const statsDiv = document.getElementById("stats-display");
  if (statsDiv) {
    const allStats = stats.getAllStats();
    statsDiv.innerHTML = Object.entries(allStats)
      .map(
        ([name, value]) => `
            <div class="stat-row">
                <span class="stat-name">${name}</span>
                <span class="stat-value">${value}</span>
            </div>
        `,
      )
      .join("");
  }

  // 技能列表
  const skillsList = document.getElementById("skills-list");
  if (skillsList) {
    skillsList.innerHTML = "";
    for (const skill of p.skills) {
      const div = document.createElement("div");
      div.className = "skill-item";

      // 检查是否已进化
      const evolutionName = skill.evolution
        ? skill.evolution
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "";
      const evolvedClass = skill.evolution ? "skill-evolved" : "";

      div.innerHTML = `
                <span class="skill-icon ${evolvedClass}">${skill.icon}</span>
                <span class="skill-name">${skill.name}${skill.evolution ? "★" : ""}</span>
                <span class="skill-level">Lv.${skill.level || 1}${skill.evolutionLevel ? " (E" + skill.evolutionLevel + ")" : ""}</span>
            `;

      if (skill.evolution) {
        div.title = `已进化: ${evolutionName}`;
      }

      // 添加悬停提示
      div.addEventListener("mouseenter", (e) => showSkillTooltip(div, skill));
      div.addEventListener("mouseleave", hideSkillTooltip);

      skillsList.appendChild(div);
    }
  }

  // 技能悬停提示
  function showSkillTooltip(element, skill) {
    // 移除旧提示
    hideSkillTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.id = "active-skill-tooltip";

    // 构建提示内容
    let statsHtml = "";
    if (skill.damage)
      statsHtml += `<div><span>伤害:</span><span>${skill.damage}</span></div>`;
    if (skill.range)
      statsHtml += `<div><span>范围:</span><span>${skill.range}</span></div>`;
    if (skill.cooldown)
      statsHtml += `<div><span>冷却:</span><span>${(skill.cooldown / 1000).toFixed(1)}s</span></div>`;
    if (skill.projectileCount)
      statsHtml += `<div><span>投射物:</span><span>${skill.projectileCount}</span></div>`;
    if (skill.chainCount)
      statsHtml += `<div><span>连锁数:</span><span>${skill.chainCount}</span></div>`;
    if (skill.count)
      statsHtml += `<div><span>数量:</span><span>${skill.count}</span></div>`;
    if (skill.radius)
      statsHtml += `<div><span>半径:</span><span>${skill.radius}</span></div>`;
    if (skill.speed)
      statsHtml += `<div><span>速度:</span><span>${skill.speed}</span></div>`;
    if (skill.pierce)
      statsHtml += `<div><span>穿透:</span><span style="color:#2ecc71;">是</span></div>`;
    if (skill.explosive)
      statsHtml += `<div><span>爆炸:</span><span style="color:#2ecc71;">是</span></div>`;

    let evolutionHtml = "";
    if (skill.evolution) {
      evolutionHtml = `<div class="tooltip-evolution">★ 已进化: ${skill.evolution.replace("_", " ")}</div>`;
    } else {
      const evoData = SKILL_EVOLUTION[skill.id];
      if (evoData) {
        const nextEvo = evoData.evolutions.find((e) => e.level > skill.level);
        if (nextEvo) {
          evolutionHtml = `<div class="tooltip-evolution">★ 下次进化: Lv.${nextEvo.level} (还差 ${nextEvo.level - skill.level} 级)</div>`;
        }
      }
    }

    tooltip.innerHTML = `
            <div class="tooltip-name">${skill.icon} ${skill.name} Lv.${skill.level}</div>
            <div class="tooltip-stats">${statsHtml}</div>
            ${evolutionHtml}
        `;

    // 定位
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.right + 10 + "px";
    tooltip.style.top = rect.top + "px";

    document.body.appendChild(tooltip);
  }

  function hideSkillTooltip() {
    const old = document.getElementById("active-skill-tooltip");
    if (old) old.remove();
  }

  // 背包
  const invList = document.getElementById("inventory-list");
  if (invList) {
    invList.innerHTML = "";
    const invSize = persistentData.inventorySize || 25;
    for (let i = 0; i < invSize; i++) {
      const slot = document.createElement("div");
      slot.className = "item-slot";
      slot.dataset.index = i;

      if (p.inventory[i]) {
        const item = p.inventory[i];
        let icon = item.icon || "📦";
        let name = item.name || "物品";

        if (item.type === "equipment" && item.equipment) {
          icon = item.equipment.icon;
          name = item.equipment.name;
        }

        slot.textContent = icon;
        slot.title = name;
        slot.style.zIndex = "100";

        if (item.type === "equipment") {
          slot.style.borderColor = RARITY[item.equipment.rarity].color;
          slot.style.cursor = "pointer";
          slot.style.pointerEvents = "auto";

          // 点击事件
          slot.onclick = (e) => {
            e.stopPropagation();
            equipItem(i);
          };

          // 悬停 tooltip 事件
          slot.onmouseenter = (e) => showItemTooltip(e, item);
          slot.onmouseleave = hideItemTooltip;
          slot.onmousemove = moveItemTooltip;
        } else if (item.type === "heal") {
          slot.onclick = (e) => {
            e.stopPropagation();
            useInventoryItem(i);
          };
        }
      }
      invList.appendChild(slot);
    }
  }
}

function showItemTooltip(e, item) {
  if (item.type !== "equipment" || !item.equipment) return;

  const tooltip = document.getElementById("item-tooltip");
  const equip = item.equipment;
  const rarity = equip.rarity;
  const rarityName = RARITY[rarity].name;
  const rarityColor = RARITY[rarity].color;
  const slotName = getSlotName(equip.slot);
  const weaponTypeName = equip.weaponType
    ? getWeaponTypeName(equip.weaponType)
    : "";

  let html = `<div style="padding: 8px; background: #0d0d0d; border: 2px solid ${rarityColor}; border-radius: 6px; min-width: 200px;">`;
  html += `<div style="color: ${rarityColor}; font-weight: bold; font-size: 14px; margin-bottom: 4px;">${equip.icon} ${equip.name}</div>`;
  html += `<div style="color: #888; font-size: 11px; margin-bottom: 8px;">${rarityName} ${slotName}${weaponTypeName ? " · " + weaponTypeName : ""}</div>`;

  // 基础属性
  if (equip.baseStats) {
    for (const [key, value] of Object.entries(equip.baseStats)) {
      const statName = getStatName(key);
      const formattedValue = formatStatValue(key, value);
      html += `<div style="color: #2ecc71; font-size: 11px;">+${formattedValue} ${statName}</div>`;
    }
  }

  // 词缀
  if (equip.affixes && equip.affixes.length > 0) {
    html += `<div style="margin-top: 6px; border-top: 1px solid #333; padding-top: 6px;">`;
    for (const affix of equip.affixes) {
      const formattedValue = formatStatValue(affix.id, affix.value);
      html += `<div style="color: #3498db; font-size: 11px;">+${formattedValue} ${affix.name}</div>`;
    }
    html += `</div>`;
  }

  // 特效
  if (equip.effect) {
    html += `<div style="margin-top: 6px; border-top: 1px solid #333; padding-top: 6px;">`;
    html += `<div style="color: #f1c40f; font-size: 11px;">特效: ${equip.effect.icon} ${equip.effect.name}</div>`;
    html += `<div style="color: #888; font-size: 10px; margin-top: 2px;">${equip.effect.description}</div>`;
    html += `</div>`;
  }

  html += `<div style="margin-top: 6px; color: #666; font-size: 10px;">点击装备</div>`;
  html += `</div>`;

  tooltip.innerHTML = html;
  tooltip.classList.add("show");
  moveItemTooltip(e);
}

function hideItemTooltip() {
  const tooltip = document.getElementById("item-tooltip");
  if (tooltip) tooltip.classList.remove("show");
}

function moveItemTooltip(e) {
  const tooltip = document.getElementById("item-tooltip");
  if (!tooltip.classList.contains("show")) return;

  const x = e.clientX + 15;
  const y = e.clientY - 10;

  // 防止超出屏幕
  const rect = tooltip.getBoundingClientRect();
  const finalX = x + rect.width > window.innerWidth ? x - rect.width - 30 : x;
  const finalY =
    y + rect.height > window.innerHeight
      ? window.innerHeight - rect.height - 10
      : y;

  tooltip.style.left = finalX + "px";
  tooltip.style.top = finalY + "px";
}

function useInventoryItem(idx) {
  const p = gameState.player;
  const stats = gameState.playerStats;
  if (!p || !p.inventory[idx]) return;
  const item = p.inventory[idx];
  if (item.type !== "heal") return;

  const healed = stats.heal(item.heal);
  if (healed > 0) {
    addLog(`使用 ${item.name}, +${healed}HP`, "success");
    p.inventory.splice(idx, 1);
    updateUI();
  }
}

// ============================================
// 天赋树 UI
// ============================================

function showTalentTree() {
  const modal = document.getElementById("talent-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateTalentUI();
}

function hideTalentTree() {
  const modal = document.getElementById("talent-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function updateTalentUI() {
  const div = document.getElementById("talent-list");
  if (!div) return;
  div.innerHTML = "";

  const pointsSpan = document.getElementById("talent-gold");
  if (pointsSpan) {
    pointsSpan.textContent = persistentData.talentPoints || 0;
    pointsSpan.previousSibling &&
      (pointsSpan.previousSibling.textContent = "天赋点: ");
  }

  // 显示总统计信息
  const statsDiv = document.createElement("div");
  statsDiv.style.cssText =
    "background: #0d0d0d; border: 1px solid #333; border-radius: 6px; padding: 10px; margin-bottom: 15px;";
  statsDiv.innerHTML = `
        <div style="color: #f1c40f; font-weight: bold; margin-bottom: 8px;">游戏统计</div>
        <div style="font-size: 12px; color: #888; line-height: 1.8;">
            <div>总击杀: ${persistentData.totalKills || 0}</div>
            <div>提取成功: ${persistentData.totalExtractions || 0}</div>
            <div>成就完成: ${(persistentData.achievements || []).length}个</div>
            <div style="color: #2ecc71; margin-top: 5px;">天赋点来源:</div>
            <div>· 时间: ${Math.floor((persistentData.totalPlayTime || 0) / 30)}点 (每30秒)</div>
            <div>· 击杀: ${Math.floor((persistentData.totalKills || 0) / 50)}点 (每50击杀)</div>
            <div>· 提取: ${(persistentData.totalExtractions || 0) * 5}点 (每次)</div>
            <div>· 成就: ${(persistentData.achievements || []).length * 3}点 (每个)</div>
        </div>
    `;
  div.appendChild(statsDiv);

  // 分层级显示天赋
  const tierNames = {
    tier1: "基础天赋",
    tier2: "专精天赋",
    tier3: "高级天赋",
    tier4: "终极天赋",
  };

  const tierColors = {
    tier1: "#2ecc71",
    tier2: "#3498db",
    tier3: "#f39c12",
    tier4: "#e74c3c",
  };

  // 计算已解锁的各层级数量
  const tierCounts = {
    tier1: Object.keys(persistentData.talents || {}).filter((id) =>
      TALENT_TREE.tier1.find((t) => t.id === id),
    ).length,
    tier2: 0,
    tier3: 0,
    tier4: 0,
  };

  // 检查解锁状态
  const unlockedTiers = checkTierUnlocks();

  for (const [tierKey, talents] of Object.entries(TALENT_TREE)) {
    const tierNum = tierKey.replace("tier", "");
    const isUnlocked = unlockedTiers[tierKey];

    // 层级标题
    const titleDiv = document.createElement("div");
    titleDiv.style.cssText =
      "margin: 15px 0 10px; padding: 8px; background: #1a1a2e; border-radius: 4px;";
    titleDiv.innerHTML = `
            <div style="color: ${tierColors[tierKey]}; font-weight: bold; font-size: 14px;">
                ${isUnlocked ? "🔓" : "🔒"} ${tierNames[tierKey]} (第${tierNum}层)
            </div>
            ${!isUnlocked ? `<div style="color: #888; font-size: 11px; margin-top: 4px;">需要: ${getTierUnlockReq(tierKey)}</div>` : ""}
        `;
    div.appendChild(titleDiv);

    // 天赋网格
    const grid = document.createElement("div");
    grid.style.cssText = `display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; ${!isUnlocked ? "opacity: 0.4;" : ""}`;

    for (const talent of talents) {
      const level = (persistentData.talents || {})[talent.id] || 0;
      const cost = talent.baseCost + (talent.costPerLevel || 0) * level;
      const canAfford = (persistentData.talentPoints || 0) >= cost;
      const atMax = level >= talent.maxLevel;
      const isUnlockedTier = isUnlocked;

      const item = document.createElement("div");
      item.style.cssText = `
                background: ${level > 0 ? "#1a1a2e" : "#0d0d0d"};
                border: 2px solid ${level > 0 ? tierColors[tierKey] : canAfford && isUnlockedTier ? "#555" : "#333"};
                border-radius: 6px;
                padding: 8px;
                cursor: ${canAfford && !atMax && isUnlockedTier ? "pointer" : "not-allowed"};
                transition: all 0.2s;
                opacity: ${isUnlockedTier ? 1 : 0.5};
            `;
      item.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 4px;">${talent.icon}</div>
                    <div style="font-size: 10px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${talent.name}</div>
                    <div style="font-size: 10px; color: ${tierColors[tierKey]}; margin-top: 2px;">Lv.${level}/${talent.maxLevel}</div>
                    ${!atMax && isUnlockedTier ? `<div style="font-size: 9px; color: ${canAfford ? "#f1c40f" : "#666"}; margin-top: 2px;">${cost}点</div>` : ""}
                    ${atMax ? '<div style="font-size: 9px; color: #2ecc71; margin-top: 2px;">已满</div>' : ""}
                </div>
            `;

      // 悬停显示详情
      item.onmouseenter = () => {
        item.style.borderColor = tierColors[tierKey];
        item.style.transform = "scale(1.05)";
      };
      item.onmouseleave = () => {
        if (level === 0)
          item.style.borderColor =
            canAfford && isUnlockedTier ? "#555" : "#333";
        item.style.transform = "scale(1)";
      };

      if (canAfford && !atMax && isUnlockedTier) {
        item.onclick = () => {
          if (!persistentData.talents) persistentData.talents = {};
          persistentData.talents[talent.id] = level + 1;
          persistentData.talentPoints -= cost;
          saveGame();
          updateTalentUI();
        };
      }

      grid.appendChild(item);
    }
    div.appendChild(grid);
  }
}

// 检查各层级解锁状态
function checkTierUnlocks() {
  const talents = persistentData.talents || {};

  // 统计各层级已解锁的天赋数量
  const tierCounts = {
    tier1: 0,
    tier2: 0,
    tier3: 0,
  };

  for (const [id, level] of Object.entries(talents)) {
    if (level <= 0) continue;
    for (const [tierKey, tierTalents] of Object.entries(TALENT_TREE)) {
      if (tierTalents.find((t) => t.id === id)) {
        tierCounts[tierKey] = (tierCounts[tierKey] || 0) + 1;
      }
    }
  }

  return {
    tier1: true, // 第1层始终解锁
    tier2: tierCounts.tier1 >= 2, // 需要第1层任意2个
    tier3: tierCounts.tier2 >= 3, // 需要第2层任意3个
    tier4: tierCounts.tier3 >= 6, // 需要第3层任意6个
  };
}

// 获取层级解锁需求文本
function getTierUnlockReq(tierKey) {
  switch (tierKey) {
    case "tier1":
      return "始终可用";
    case "tier2":
      return "解锁第1层任意2个天赋";
    case "tier3":
      return "解锁第2层任意3个天赋";
    case "tier4":
      return "解锁第3层任意6个天赋";
    default:
      return "";
  }
}

// ============================================
// 游戏循环
// ============================================

function gameLoop(timestamp) {
  if (!gameState.lastTime) gameState.lastTime = timestamp;
  const dt = Math.min((timestamp - gameState.lastTime) / 1000, 0.1);
  gameState.lastTime = timestamp;

  if (gameState.running && !gameState.paused) {
    gameState.time += dt;

    // 更新任务进度 - 生存时间（每5秒更新一次）
    if (Math.floor(gameState.time) % 5 === 0) {
      updateQuestProgress("daily_survive_10min", dt);
    }

    updatePlayer(dt);
    
    // 更新新技能系统
    if (skillManager) {
      skillManager.update(gameState.player, gameState.enemies);
    }
    
    updateSkills(dt);
    updateEntities(dt);
    updateSearchPoints(dt);

    // 更新特殊事件
    if (eventSystem) {
      eventSystem.update();
      // 每分钟检查一次事件
      if (
        Math.floor(gameState.time) % 60 === 0 &&
        Math.floor(gameState.time) !== Math.floor(gameState.time - dt)
      ) {
        eventSystem.checkEvent();
      }
    }

    if (timestamp - gameState.lastSpawnTime > CONFIG.ENEMY.SPAWN_INTERVAL) {
      spawnEnemies();
      gameState.lastSpawnTime = timestamp;
    }

    if (timestamp - gameState.lastChestTime > CONFIG.CHEST.SPAWN_INTERVAL) {
      spawnChest();
      gameState.lastChestTime = timestamp;
    }

    if (
      timestamp - gameState.lastSearchTime >
      CONFIG.SEARCH_POINT.SPAWN_INTERVAL
    ) {
      spawnSearchPoint();
      gameState.lastSearchTime = timestamp;
    }

    // Boss生成检查
    if (
      gameState.time > CONFIG.BOSS.MIN_TIME &&
      Math.random() < CONFIG.BOSS.SPAWN_CHANCE * dt &&
      !gameState.enemies.some((e) => e.isBoss)
    ) {
      spawnBoss();
    }

    // 商人系统已改为按钮触发商店
  }

  render(gameState); // 使用新的渲染系统
  requestAnimationFrame(gameLoop);
}

// ============================================
// 输入
// ============================================

document.addEventListener("keydown", (e) => {
  gameState.keys[e.key.toLowerCase()] = true;
  if (
    [
      "w",
      "a",
      "s",
      "d",
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      " ",
    ].includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
  }

  if (gameState.paused && gameState.levelUpChoices) {
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < gameState.levelUpChoices.length) {
      selectUpgrade(gameState.levelUpChoices[idx]);
    }
  }
});

document.addEventListener("keyup", (e) => {
  gameState.keys[e.key.toLowerCase()] = false;
});

// ============================================
// 初始化
// ============================================

function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("death-screen").classList.add("hidden");

  // 初始化对象池（性能优化）
  initAllPools();

  // 初始化连击系统
  if (comboSystem) {
    comboSystem.startGame();
  }

  // 初始化技能管理器（新系统）
  if (skillManager) {
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
      skillManager.init(gameCanvas, ctx);
    }
  }

  gameState = {
    running: true,
    paused: false,
    time: 0,
    player: null,
    playerStats: null,
    equipment: { weapon: null, chest: null, boots: null, accessory: null },
    enemies: [],
    projectiles: [],
    orbitals: [],
    mines: [],
    groundItems: [],
    xpOrbs: [],
    chests: [],
    searchPoints: [],
    whirlwinds: [],
    particles: [],
    floatingTexts: [],
    lightnings: [],
    lastSpawnTime: 0,
    lastChestTime: 0,
    lastSearchTime: 0,
    lastMerchantTime: -999999,
    lastUIUpdate: 0,
    lastTime: 0,
    startTime: Date.now(),
    kills: 0,
    keys: {},
    levelUpChoices: [],
    inventoryOpen: false,
    shopOpen: false,
    diamondShopOpen: false,
    shopProducts: [],
  };

  document.getElementById("log-content").innerHTML = "";
  initPlayer();
  spawnChest();

  requestAnimationFrame(gameLoop);
  addLog("欢迎来到深渊撤离区 v7.0 - 割草体验重制版!", "info");
  addLog("WASD移动, 自动攻击", "info");
  addLog("消灭敌人获取经验、金币和装备", "info");
  addLog("点击背包中的装备进行装备", "info");
  addLog("左侧面板查看属性和装备", "info");
  addLog("右上角📖按钮查看技能图鉴", "info");
}

function gameOver() {
  gameState.running = false;

  // 更新统计数据
  persistentData.totalKills += gameState.kills;
  persistentData.gamesPlayed++;
  persistentData.totalPlayTime =
    (persistentData.totalPlayTime || 0) + gameState.time;
  persistentData.runStats = {
    timeAlive: gameState.time,
    kills: gameState.kills,
    level: gameState.player.level,
    extracted: false,
  };

  // 更新最高记录
  if (gameState.player.level > (persistentData.highScoreLevel || 0)) {
    persistentData.highScoreLevel = gameState.player.level;
  }
  if (gameState.time > (persistentData.maxSurvivalTime || 0)) {
    persistentData.maxSurvivalTime = gameState.time;
  }

  // 计算获得的天赋点（优化：提高天赋点获取）
  let earnedPoints = 0;
  earnedPoints += Math.floor(gameState.time / 25); // 每25秒1点（原30秒，提升20%）
  earnedPoints += Math.floor(gameState.kills / 40); // 每40杀1点（原50杀，提升25%）
  earnedPoints += Math.floor(gameState.player.level / 4); // 每4级1点（原5级，提升25%）
  earnedPoints += gameState.player.extracted ? 10 : 0; // 撤离成功额外+10点

  persistentData.talentPoints += earnedPoints;

  // 检查成就
  checkAchievements();

  // 检查皮肤解锁
  checkSkinUnlocks();

  // 记录游戏结束统计
  if (statisticsSystem) {
    statisticsSystem.onGameEnd(gameState.player.extracted);
  }

  saveGame();

  document.getElementById("death-screen").classList.remove("hidden");
  document.getElementById("death-stats").innerHTML = `
        <p>存活: ${formatTime(gameState.time)} | 等级: ${gameState.player.level}</p>
        <p>击杀: ${gameState.kills}</p>
        <p>获得天赋点: +${earnedPoints}</p>
        ${comboSystem ? `<p style="color: #9b59b6; margin-top: 5px;">🔥 最高连击: ${comboSystem.combo.maxCombo}</p>` : ""}
        <p style="color: #f1c40f; margin-top: 10px;">可用天赋点: ${persistentData.talentPoints}</p>
        ${statisticsSystem ? `<p style="color: #3498db; margin-top: 5px; cursor: pointer;" onclick="statisticsSystem.showStatisticsPanel()">📊 查看详细统计</p>` : ""}
    `;

  // 显示评级
  if (comboSystem) {
    setTimeout(() => {
      comboSystem.showRating(gameState.player.extracted);
    }, 500);
  }
}

// ============================================
// 成就面板
// ============================================

function showAchievementPanel() {
  const modal = document.getElementById("achievement-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateAchievementUI();
}

function hideAchievementPanel() {
  const modal = document.getElementById("achievement-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function updateAchievementUI() {
  const achievements = ACHIEVEMENTS;
  const unlocked = persistentData.achievements || [];

  document.getElementById("achievement-count").textContent = unlocked.length;
  document.getElementById("achievement-total").textContent =
    achievements.length;

  const list = document.getElementById("achievement-list");
  list.innerHTML = "";

  // 按类别分组
  const categories = {};
  for (const ach of achievements) {
    if (!categories[ach.category]) {
      categories[ach.category] = [];
    }
    categories[ach.category].push(ach);
  }

  const categoryColors = {
    新手: "#2ecc71",
    战斗: "#e74c3c",
    收集: "#f39c12",
    挑战: "#9b59b6",
  };

  // 显示每个类别
  for (const [category, achs] of Object.entries(categories)) {
    const categoryDiv = document.createElement("div");
    categoryDiv.style.marginBottom = "25px";

    const titleDiv = document.createElement("div");
    titleDiv.style.cssText = `
            color: ${categoryColors[category] || "#f1c40f"};
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #333;
        `;
    titleDiv.textContent = `${category} (${achs.filter((a) => unlocked.includes(a.id)).length}/${achs.length})`;
    categoryDiv.appendChild(titleDiv);

    const gridDiv = document.createElement("div");
    gridDiv.style.cssText =
      "display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;";

    for (const ach of achs) {
      const isUnlocked = unlocked.includes(ach.id);
      const achDiv = document.createElement("div");
      achDiv.style.cssText = `
                background: ${isUnlocked ? "rgba(46, 204, 113, 0.1)" : "rgba(13, 13, 13, 0.5)"};
                border: 1px solid ${isUnlocked ? "#2ecc71" : "#333"};
                border-radius: 6px;
                padding: 12px;
                opacity: ${isUnlocked ? 1 : 0.6};
                transition: all 0.2s;
            `;

      achDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 24px;">${ach.icon}</span>
                    <div>
                        <div style="color: ${isUnlocked ? "#2ecc71" : "#888"}; font-size: 13px; font-weight: bold;">${ach.name}</div>
                        <div style="color: #666; font-size: 11px;">${ach.description}</div>
                    </div>
                </div>
                ${
                  isUnlocked
                    ? '<div style="color: #2ecc71; font-size: 10px; margin-top: 5px;">✓ 已完成</div>'
                    : `<div style="color: #f39c12; font-size: 10px; margin-top: 5px;">奖励: +${ach.reward.talentPoints} 天赋点</div>`
                }
            `;

      gridDiv.appendChild(achDiv);
    }

    categoryDiv.appendChild(gridDiv);
    list.appendChild(categoryDiv);
  }
}

// ============================================
// 任务面板
// ============================================

function showQuestPanel() {
  const modal = document.getElementById("quest-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateQuestUI();
}

function hideQuestPanel() {
  const modal = document.getElementById("quest-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

// 皮肤面板
function showSkinPanel() {
  const modal = document.getElementById("skin-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateSkinUI();
}

function hideSkinPanel() {
  const modal = document.getElementById("skin-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function updateSkinUI() {
  const allSkins = Object.values(SKILL_SKINS).flat();
  const unlocked = persistentData.unlockedSkins || [];

  document.getElementById("skin-count").textContent = unlocked.length;
  document.getElementById("skin-total").textContent = allSkins.length;

  const list = document.getElementById("skin-list");
  list.innerHTML = "";

  // 按技能分组
  for (const [skillId, skins] of Object.entries(SKILL_SKINS)) {
    const skill = SKILLS[skillId];
    if (!skill) continue;

    const equippedSkinId = persistentData.equippedSkins?.[skillId];

    const skillDiv = document.createElement("div");
    skillDiv.style.cssText = "margin-bottom: 25px;";

    const titleDiv = document.createElement("div");
    titleDiv.style.cssText =
      "color: #ff69b4; font-size: 18px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #333;";
    titleDiv.textContent = `${skill.icon} ${skill.name} (${skins.length}个皮肤)`;
    skillDiv.appendChild(titleDiv);

    const gridDiv = document.createElement("div");
    gridDiv.style.cssText =
      "display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;";

    for (const skin of skins) {
      const isUnlocked = unlocked.includes(skin.id);
      const isEquipped = equippedSkinId === skin.id;
      const rarityInfo = SKIN_RARITY[skin.rarity];

      const skinDiv = document.createElement("div");
      skinDiv.style.cssText = `
                background: ${isEquipped ? "rgba(255, 105, 180, 0.15)" : isUnlocked ? "rgba(13, 13, 13, 0.7)" : "rgba(13, 13, 13, 0.3)"};
                border: 2px solid ${isEquipped ? "#ff69b4" : isUnlocked ? rarityInfo.color : "#333"};
                border-radius: 8px;
                padding: 12px;
                opacity: ${isUnlocked ? 1 : 0.5};
                cursor: ${isUnlocked ? "pointer" : "not-allowed"};
            `;

      skinDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="color: ${rarityInfo.color}; font-size: 13px; font-weight: bold;">${skin.name}</div>
                    <div style="background: ${rarityInfo.color}; color: #000; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">${rarityInfo.name}</div>
                </div>
                <div style="color: #888; font-size: 11px; margin-bottom: 8px;">${skin.description}</div>
                ${
                  isUnlocked
                    ? isEquipped
                      ? '<div style="background: #ff69b4; color: white; text-align: center; padding: 5px; border-radius: 4px; font-size: 11px; font-weight: bold;">已装备</div>'
                      : '<div style="background: #333; color: #fff; text-align: center; padding: 5px; border-radius: 4px; font-size: 11px;">点击装备</div>'
                    : '<div style="color: #666; text-align: center; font-size: 11px;">🔒 未解锁</div>'
                }
            `;

      if (isUnlocked) {
        skinDiv.onclick = () => {
          equipSkin(skillId, skin.id);
          updateSkinUI();
        };
      }

      gridDiv.appendChild(skinDiv);
    }

    skillDiv.appendChild(gridDiv);
    list.appendChild(skillDiv);
  }
}

function updateQuestUI() {
  const dailyQuestIds = getDailyQuests();
  const weeklyQuestIds = getWeeklyQuests();

  const list = document.getElementById("quest-list");
  list.innerHTML = "";

  // 每日任务
  const dailyDiv = document.createElement("div");
  dailyDiv.style.marginBottom = "25px";

  const dailyTitle = document.createElement("div");
  dailyTitle.style.cssText =
    "color: #3498db; font-size: 18px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #333;";
  dailyTitle.textContent = "🌅 每日任务 (每天刷新)";
  dailyDiv.appendChild(dailyTitle);

  const dailyGrid = document.createElement("div");
  dailyGrid.style.cssText = "display: grid; gap: 10px;";

  for (const questId of dailyQuestIds) {
    const quest = DAILY_QUESTS.find((q) => q.id === questId);
    if (!quest) continue;

    const progress = persistentData.dailyQuestProgress?.[questId] || 0;
    const isComplete = progress >= quest.target;
    const isClaimed =
      persistentData.dailyQuestClaimed?.includes(questId) || false;

    const questDiv = document.createElement("div");
    questDiv.style.cssText = `
            background: ${isClaimed ? "rgba(102, 102, 102, 0.1)" : isComplete ? "rgba(46, 204, 113, 0.1)" : "rgba(13, 13, 13, 0.5)"};
            border: 1px solid ${isClaimed ? "#666" : isComplete ? "#2ecc71" : "#333"};
            border-radius: 6px;
            padding: 15px;
        `;

    const progressPct = Math.min((progress / quest.target) * 100, 100);

    questDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 28px;">${quest.icon}</span>
                <div style="flex: 1;">
                    <div style="color: ${isClaimed ? "#888" : isComplete ? "#2ecc71" : "#f1c40f"}; font-size: 14px; font-weight: bold;">${quest.name}</div>
                    <div style="color: #666; font-size: 12px; margin-top: 3px;">${quest.description}</div>
                </div>
                ${
                  isClaimed
                    ? '<div style="color: #888; font-size: 12px; font-weight: bold;">已领取</div>'
                    : isComplete
                      ? '<button style="padding: 5px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;" onclick="claimQuestReward(\'' +
                        questId +
                        "'); updateQuestUI();\">领取</button>"
                      : ""
                }
            </div>
            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                    <span style="color: #888;">进度</span>
                    <span style="color: #3498db;">${Math.floor(progress)}/${quest.target}</span>
                </div>
                <div style="width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${progressPct}%; height: 100%; background: ${isClaimed ? "#666" : isComplete ? "#2ecc71" : "#3498db"}; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="color: #f39c12; font-size: 11px; margin-top: 8px;">
                奖励: ${quest.reward.gold ? quest.reward.gold + " 金币" : ""}${quest.reward.gold && quest.reward.materials ? ", " : ""}${quest.reward.materials ? formatMaterials(quest.reward.materials) : ""}
            </div>
        `;

    dailyGrid.appendChild(questDiv);
  }

  dailyDiv.appendChild(dailyGrid);
  list.appendChild(dailyDiv);

  // 每周任务
  const weeklyDiv = document.createElement("div");

  const weeklyTitle = document.createElement("div");
  weeklyTitle.style.cssText =
    "color: #9b59b6; font-size: 18px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #333;";
  weeklyTitle.textContent = "📅 每周任务 (每周刷新)";
  weeklyDiv.appendChild(weeklyTitle);

  const weeklyGrid = document.createElement("div");
  weeklyGrid.style.cssText = "display: grid; gap: 10px;";

  for (const questId of weeklyQuestIds) {
    const quest = WEEKLY_QUESTS.find((q) => q.id === questId);
    if (!quest) continue;

    const progress = persistentData.weeklyQuestProgress?.[questId] || 0;
    const isComplete = progress >= quest.target;
    const isClaimed =
      persistentData.weeklyQuestClaimed?.includes(questId) || false;

    const questDiv = document.createElement("div");
    questDiv.style.cssText = `
            background: ${isClaimed ? "rgba(102, 102, 102, 0.1)" : isComplete ? "rgba(155, 89, 182, 0.1)" : "rgba(13, 13, 13, 0.5)"};
            border: 1px solid ${isClaimed ? "#666" : isComplete ? "#9b59b6" : "#333"};
            border-radius: 6px;
            padding: 15px;
        `;

    const progressPct = Math.min((progress / quest.target) * 100, 100);

    questDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 28px;">${quest.icon}</span>
                <div style="flex: 1;">
                    <div style="color: ${isClaimed ? "#888" : isComplete ? "#9b59b6" : "#f1c40f"}; font-size: 14px; font-weight: bold;">${quest.name}</div>
                    <div style="color: #666; font-size: 12px; margin-top: 3px;">${quest.description}</div>
                </div>
                ${
                  isClaimed
                    ? '<div style="color: #888; font-size: 12px; font-weight: bold;">已领取</div>'
                    : isComplete
                      ? '<button style="padding: 5px 15px; background: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;" onclick="claimQuestReward(\'' +
                        questId +
                        "'); updateQuestUI();\">领取</button>"
                      : ""
                }
            </div>
            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                    <span style="color: #888;">进度</span>
                    <span style="color: #3498db;">${Math.floor(progress)}/${quest.target}</span>
                </div>
                <div style="width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${progressPct}%; height: 100%; background: ${isClaimed ? "#666" : isComplete ? "#9b59b6" : "#3498db"}; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="color: #f39c12; font-size: 11px; margin-top: 8px;">
                奖励: ${quest.reward.gold ? quest.reward.gold + " 金币" : ""}${quest.reward.gold && quest.reward.materials ? ", " : ""}${quest.reward.materials ? formatMaterials(quest.reward.materials) : ""}
            </div>
        `;

    weeklyGrid.appendChild(questDiv);
  }

  weeklyDiv.appendChild(weeklyGrid);
  list.appendChild(weeklyDiv);
}

function formatMaterials(materials) {
  const materialNames = {
    common: "普通材料",
    uncommon: "稀有材料",
    rare: "史诗材料",
  };

  const parts = [];
  for (const [type, count] of Object.entries(materials)) {
    parts.push(`${count} ${materialNames[type] || type}`);
  }
  return parts.join(", ");
}

// 更新任务进度
function updateQuestProgress(questId, amount = 1) {
  if (!persistentData.dailyQuestProgress) {
    persistentData.dailyQuestProgress = {};
  }
  if (!persistentData.weeklyQuestProgress) {
    persistentData.weeklyQuestProgress = {};
  }

  // 检查每日任务
  const dailyQuests = getDailyQuests();
  if (dailyQuests.includes(questId)) {
    if (!persistentData.dailyQuestProgress[questId]) {
      persistentData.dailyQuestProgress[questId] = 0;
    }
    persistentData.dailyQuestProgress[questId] += amount;
  }

  // 检查每周任务
  const weeklyQuests = getWeeklyQuests();
  if (weeklyQuests.includes(questId)) {
    if (!persistentData.weeklyQuestProgress[questId]) {
      persistentData.weeklyQuestProgress[questId] = 0;
    }
    persistentData.weeklyQuestProgress[questId] += amount;
  }
}

// 领取任务奖励
function claimQuestReward(questId) {
  const dailyQuests = getDailyQuests();
  const weeklyQuests = getWeeklyQuests();

  let quest = DAILY_QUESTS.find((q) => q.id === questId);
  let isDaily = dailyQuests.includes(questId);

  if (!quest) {
    quest = WEEKLY_QUESTS.find((q) => q.id === questId);
    isDaily = false;
  }

  if (!quest) {
    addLog("任务不存在", "warning");
    return;
  }

  const progress = isDaily
    ? persistentData.dailyQuestProgress?.[questId] || 0
    : persistentData.weeklyQuestProgress?.[questId] || 0;

  if (progress < quest.target) {
    addLog("任务未完成", "warning");
    return;
  }

  // 检查是否已领取
  const claimedKey = isDaily ? "dailyQuestClaimed" : "weeklyQuestClaimed";
  if (!persistentData[claimedKey]) {
    persistentData[claimedKey] = [];
  }
  if (persistentData[claimedKey].includes(questId)) {
    addLog("奖励已领取", "info");
    return;
  }

  // 发放奖励
  if (quest.reward.gold) {
    const p = gameState.player;
    if (p) {
      p.gold += quest.reward.gold;
      persistentData.totalGold += quest.reward.gold;
    }
  }

  // 标记为已领取
  persistentData[claimedKey].push(questId);

  addLog(`任务奖励领取成功!`, "success");
  saveGame();
  updateUI();
}

// ============================================
// 事件监听
// ============================================

window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const talentBtn = document.getElementById("talent-btn");
  const achievementBtn = document.getElementById("achievement-btn");
  const questBtn = document.getElementById("quest-btn");
  const skinBtn = document.getElementById("skin-btn");
  const inventoryBtn = document.getElementById("inventory-btn");
  const shopBtn = document.getElementById("shop-btn");
  const diamondShopBtn = document.getElementById("diamond-shop-btn");

  if (startBtn) startBtn.addEventListener("click", startGame);
  if (restartBtn) restartBtn.addEventListener("click", startGame);
  if (talentBtn) talentBtn.addEventListener("click", showTalentTree);
  if (achievementBtn)
    achievementBtn.addEventListener("click", showAchievementPanel);
  if (questBtn) questBtn.addEventListener("click", showQuestPanel);
  if (skinBtn) skinBtn.addEventListener("click", showSkinPanel);
  if (inventoryBtn) inventoryBtn.addEventListener("click", toggleInventory);
  if (shopBtn) shopBtn.addEventListener("click", openShop);
  if (diamondShopBtn) diamondShopBtn.addEventListener("click", openDiamondShop);

  // 关闭按钮
  const closeInventoryBtn = document.getElementById("close-inventory");
  const closeShopBtn = document.getElementById("close-shop");
  const closeDiamondShopBtn = document.getElementById("close-diamond-shop");
  const closeTalentBtn = document.getElementById("close-talent");
  const closeAchievementBtn = document.getElementById("close-achievement");
  const closeQuestBtn = document.getElementById("close-quest");
  const closeSkinBtn = document.getElementById("close-skin");

  if (closeInventoryBtn)
    closeInventoryBtn.addEventListener("click", toggleInventory);
  if (closeShopBtn) closeShopBtn.addEventListener("click", closeShop);
  if (closeDiamondShopBtn)
    closeDiamondShopBtn.addEventListener("click", closeDiamondShop);
  if (closeTalentBtn) closeTalentBtn.addEventListener("click", hideTalentTree);
  if (closeAchievementBtn)
    closeAchievementBtn.addEventListener("click", hideAchievementPanel);
  if (closeQuestBtn) closeQuestBtn.addEventListener("click", hideQuestPanel);
  if (closeSkinBtn) closeSkinBtn.addEventListener("click", hideSkinPanel);
});

// ESC键关闭弹窗
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (gameState.inventoryOpen) toggleInventory();
    else if (gameState.shopOpen) closeShop();
    else if (gameState.diamondShopOpen) closeDiamondShop();
  }
});

loadGame();
// ============================================
// 迭代6：背包系统、商人系统、技能进化
// ============================================

// 打开/关闭背包
function toggleInventory() {
  gameState.inventoryOpen = !gameState.inventoryOpen;

  if (gameState.inventoryOpen) {
    gameState.paused = true;
    const modal = document.getElementById("inventory-modal");
    modal.classList.remove("hidden");
    modal.classList.add("show");
    updateInventoryUI();
    updateInventoryBadge(); // 打开背包时清除角标
  } else {
    gameState.paused = false;
    const modal = document.getElementById("inventory-modal");
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }
}

// 更新背包角标
function updateInventoryBadge() {
  const badge = document.getElementById("inventory-badge");
  if (!badge || !gameState.player) return;

  // 计算新物品数量（未查看过的物品）
  const newItems = gameState.player.inventory.filter(
    (item) => item && !item.seen,
  ).length;

  if (newItems > 0) {
    badge.textContent = newItems > 9 ? "9+" : newItems;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function updateInventoryUI() {
  const p = gameState.player;
  if (!p) return;

  const grid = document.getElementById("inventory-grid");
  grid.innerHTML = "";

  const invSize = persistentData.inventorySize || 25;

  // 标记所有物品为已查看
  p.inventory.forEach((item) => {
    if (item) item.seen = true;
  });
  updateInventoryBadge(); // 清除角标

  for (let i = 0; i < invSize; i++) {
    const item = p.inventory[i];
    const div = document.createElement("div");
    div.style.cssText = `
            background: ${item ? "rgba(13, 13, 13, 0.8)" : "rgba(13, 13, 13, 0.3)"};
            border: 2px solid ${item && item.equipment ? RARITY[item.equipment.rarity].color : "#333"};
            border-radius: 8px;
            padding: 15px;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: ${item ? "pointer" : "default"};
        `;

    if (item) {
      const icon = item.equipment ? item.equipment.icon : item.icon || "📦";
      const name = item.equipment ? item.equipment.name : item.name || "物品";
      const sellPrice = item.equipment
        ? Math.floor(
            item.equipment.rarity === "legendary"
              ? 100
              : item.equipment.rarity === "epic"
                ? 60
                : item.equipment.rarity === "rare"
                  ? 35
                  : item.equipment.rarity === "uncommon"
                    ? 20
                    : 10,
          )
        : 5;

      div.innerHTML = `
                <div style="font-size: 32px; margin-bottom: 5px;">${icon}</div>
                <div style="color: #fff; font-size: 12px; text-align: center; font-weight: bold;">${name}</div>
                <div style="display: flex; gap: 5px; margin-top: 8px;">
                    <button style="padding: 3px 10px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 10px;" onclick="event.stopPropagation(); sellItem(${i}, ${sellPrice})">出售 ${sellPrice}G</button>
                    <button style="padding: 3px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 10px;" onclick="event.stopPropagation(); discardItem(${i})">丢弃</button>
                </div>
            `;

      div.onclick = () => {
        if (item.type === "equipment") {
          equipItem(i);
          updateInventoryUI();
        }
      };
    } else {
      div.innerHTML = '<div style="color: #666; font-size: 12px;">空</div>';
    }

    grid.appendChild(div);
  }
}

function sellItem(index, price) {
  const p = gameState.player;
  if (!p || !p.inventory[index]) return;

  p.gold += price;
  persistentData.totalGold += price;
  p.inventory.splice(index, 1);

  addLog(`出售物品，获得 ${price} 金币`, "success");
  updateInventoryUI();
  updateUI();
  saveGame();
}

function discardItem(index) {
  const p = gameState.player;
  if (!p || !p.inventory[index]) return;

  p.inventory.splice(index, 1);
  addLog(`丢弃物品`, "info");
  updateInventoryUI();
}

// ============================================
// 商人系统
// ============================================

function spawnMerchant() {
  if (gameState.merchants.length > 0) return;

  const p = gameState.player;
  const angle = Math.random() * Math.PI * 2;
  const d = randFloat(6, 10);

  gameState.merchants.push({
    x: p.x + Math.cos(angle) * d,
    y: p.y + Math.sin(angle) * d,
    spawnTime: gameState.time,
    duration: MERCHANT_CONFIG.DURATION / 1000,
    products: generateMerchantProducts(),
    rerollCost: MERCHANT_CONFIG.REROLL_BASE_COST,
  });

  addLog(MERCHANT_CONFIG.ANNOUNCEMENT, "success");
  showMerchantUI();
}

function generateMerchantProducts() {
  const products = [];
  const totalWeight = Object.values(MERCHANT_CONFIG.PRODUCTS).reduce(
    (sum, cat) => sum + cat.weight,
    0,
  );

  // 生成6-8个商品
  const count = rand(6, 8);

  for (let i = 0; i < count; i++) {
    let roll = Math.random() * totalWeight;
    let category = null;

    for (const [catId, catData] of Object.entries(MERCHANT_CONFIG.PRODUCTS)) {
      roll -= catData.weight;
      if (roll <= 0) {
        category = catData;
        break;
      }
    }

    if (category) {
      const item = category.items[rand(0, category.items.length - 1)];
      const price = Math.floor(item.baseCost * randFloat(0.8, 1.3));
      products.push({ ...item, price });
    }
  }

  return products;
}

// ============================================
// 商店系统 (按钮触发)
// ============================================

let shopProducts = [];
let shopRerollCost = 30;

function openShop() {
  gameState.paused = true;
  gameState.shopOpen = true;

  // 生成商品
  if (shopProducts.length === 0) {
    shopProducts = generateShopProducts();
  }

  const modal = document.getElementById("shop-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateShopUI();
}

function closeShop() {
  const modal = document.getElementById("shop-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
  gameState.paused = false;
  gameState.shopOpen = false;
}

function generateShopProducts() {
  const products = [];
  const types = ["skill", "attr", "consumable"];

  // 生成 6-9 个商品
  const count = rand(6, 9);
  for (let i = 0; i < count; i++) {
    const type = types[rand(0, types.length - 1)];
    let product = { type, id: `shop_${i}` };

    if (type === "skill") {
      const skillKeys = Object.keys(SKILLS);
      const skillId = skillKeys[rand(0, skillKeys.length - 1)];
      const skill = SKILLS[skillId];
      product.id = skillId;
      product.name = skill.name;
      product.icon = skill.icon;
      product.description = skill.description;
      product.price = rand(80, 200);
    } else if (type === "attr") {
      const attrs = [
        {
          name: "伤害强化",
          icon: "💪",
          desc: "伤害 +20%",
          effect: { damage: 20 },
          price: rand(50, 100),
        },
        {
          name: "攻速强化",
          icon: "⚡",
          desc: "攻击速度 +15%",
          effect: { attackSpeed: 15 },
          price: rand(50, 100),
        },
        {
          name: "生命强化",
          icon: "❤️",
          desc: "最大生命 +30",
          effect: { maxHp: 30 },
          price: rand(40, 80),
        },
        {
          name: "移速强化",
          icon: "💨",
          desc: "移动速度 +20%",
          effect: { moveSpeed: 20 },
          price: rand(50, 90),
        },
        {
          name: "回复强化",
          icon: "💚",
          desc: "每秒回复 2 HP",
          effect: { lifeRegen: 2 },
          price: rand(60, 120),
        },
      ];
      const attr = attrs[rand(0, attrs.length - 1)];
      Object.assign(product, attr);
    } else if (type === "consumable") {
      const consumables = [
        {
          name: "生命药水",
          icon: "🧪",
          desc: "恢复 50% HP",
          effect: { healPercent: 0.5 },
          price: rand(30, 60),
        },
        {
          name: "护盾药水",
          icon: "🛡️",
          desc: "获得 30 点护盾",
          effect: { shield: 30 },
          price: rand(40, 70),
        },
        {
          name: "经验药水",
          icon: "📚",
          desc: "获得 100 经验",
          effect: { xp: 100 },
          price: rand(50, 80),
        },
      ];
      const cons = consumables[rand(0, consumables.length - 1)];
      Object.assign(product, cons);
    }

    products.push(product);
  }

  return products;
}

function updateShopUI() {
  const p = gameState.player;
  document.getElementById("shop-gold").textContent = p ? p.gold : 0;

  const productsDiv = document.getElementById("shop-products");
  productsDiv.innerHTML = "";

  for (let i = 0; i < shopProducts.length; i++) {
    const product = shopProducts[i];
    const div = document.createElement("div");
    div.style.cssText = `
            background: rgba(13, 13, 13, 0.9);
            border: 2px solid #f39c12;
            border-radius: 10px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
        `;

    div.onmouseenter = () => (div.style.transform = "translateY(-3px)");
    div.onmouseleave = () => (div.style.transform = "");

    const canAfford = p && p.gold >= product.price;

    div.innerHTML = `
            <div style="font-size: 48px; text-align: center; margin-bottom: 12px;">${product.icon || "📦"}</div>
            <div style="color: #fff; font-size: 16px; text-align: center; font-weight: bold; margin-bottom: 8px;">${product.name}</div>
            <div style="color: #aaa; font-size: 14px; text-align: center; margin-bottom: 12px; line-height: 1.4;">${product.description || product.desc || ""}</div>
            <button style="width: 100%; padding: 10px; background: ${canAfford ? "#2ecc71" : "#666"}; color: white; border: none; border-radius: 6px; cursor: ${canAfford ? "pointer" : "not-allowed"}; font-size: 15px; font-weight: bold;">
                购买 (${product.price}G)
            </button>
        `;

    if (canAfford) {
      div.querySelector("button").onclick = () => buyShopProduct(i);
    }

    productsDiv.appendChild(div);
  }

  // 刷新按钮
  const rerollBtn = document.getElementById("shop-reroll");
  rerollBtn.textContent = `刷新商品 (${shopRerollCost}金币)`;
  rerollBtn.onclick = () => {
    if (p && p.gold >= shopRerollCost) {
      p.gold -= shopRerollCost;
      shopRerollCost += 10;
      shopProducts = generateShopProducts();
      updateShopUI();
      saveGame();
    }
  };
}

function buyShopProduct(index) {
  const p = gameState.player;
  const product = shopProducts[index];
  if (!product || !p || p.gold < product.price) return;

  p.gold -= product.price;
  persistentData.totalGold += product.price;

  // 应用购买效果
  if (product.type === "skill") {
    const existing = p.skills.find((s) => s.id === product.id);
    if (existing) {
      existing.level++;
      existing.damage = Math.floor(existing.damage * 1.25);
      if (existing.range) existing.range *= 1.1;
      addLog(
        `${product.icon} ${product.name} -> Lv.${existing.level}`,
        "success",
      );
      checkSkillEvolution(existing);
    } else {
      const skill = SKILLS[product.id];
      if (skill) {
        p.skills.push({ ...skill, level: 1, timer: 0 });
        addLog(`购买技能: ${skill.icon} ${skill.name}`, "success");
      }
    }
  } else if (product.type === "attr") {
    if (gameState.playerStats) {
      gameState.playerStats.applyStat(product.effect);
      addLog(`购买属性: ${product.icon} ${product.name}`, "success");
    }
  } else if (product.type === "consumable") {
    applyShopConsumable(product.effect);
    addLog(`使用消耗品: ${product.icon} ${product.name}`, "success");
  }

  shopProducts.splice(index, 1);
  updateShopUI();
  updateUI();
  saveGame();
}

function applyShopConsumable(effect) {
  const stats = gameState.playerStats;
  if (!stats) return;

  if (effect.healPercent) {
    stats.currentHp = Math.min(
      stats.maxHp,
      stats.currentHp + stats.maxHp * effect.healPercent,
    );
  }
  if (effect.shield) {
    addLog(`获得 ${effect.shield} 点护盾`, "info");
  }
  if (effect.xp) {
    gameState.player.xp += effect.xp;
    checkLevelUp();
  }
}

// ============================================
// 钻石商店系统
// ============================================

function openDiamondShop() {
  gameState.paused = true;
  gameState.diamondShopOpen = true;

  const modal = document.getElementById("diamond-shop-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  updateDiamondShopUI();
}

function closeDiamondShop() {
  const modal = document.getElementById("diamond-shop-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
  gameState.paused = false;
  gameState.diamondShopOpen = false;
}

function updateDiamondShopUI() {
  document.getElementById("diamond-count").textContent =
    persistentData.diamonds || 0;

  const productsDiv = document.getElementById("diamond-products");
  productsDiv.innerHTML = "";

  const products = [
    {
      name: "背包扩展 +5格",
      icon: "🎒",
      description:
        "增加5个背包格子 (当前: " +
        (persistentData.inventorySize || 25) +
        "格)",
      price: 300,
      effect: "inventory_slots",
    },
    {
      name: "背包扩展 +5格",
      icon: "🎒",
      description:
        "增加5个背包格子 (购买后: " +
        ((persistentData.inventorySize || 25) + 5) +
        "格)",
      price: 500,
      effect: "inventory_slots_2",
    },
    {
      name: "100 钻石",
      icon: "💎",
      description: "获得 100 钻石 (暂未开放获取途径)",
      price: 0,
      effect: "test_diamonds",
      test: true,
    },
  ];

  for (const product of products) {
    const div = document.createElement("div");
    div.style.cssText = `
            background: rgba(13, 13, 13, 0.9);
            border: 2px solid #00d4ff;
            border-radius: 10px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
        `;

    div.onmouseenter = () => (div.style.transform = "translateY(-3px)");
    div.onmouseleave = () => (div.style.transform = "");

    const canAfford = (persistentData.diamonds || 0) >= product.price;

    div.innerHTML = `
            <div style="font-size: 48px; text-align: center; margin-bottom: 12px;">${product.icon}</div>
            <div style="color: #fff; font-size: 18px; text-align: center; font-weight: bold; margin-bottom: 8px;">${product.name}</div>
            <div style="color: #aaa; font-size: 14px; text-align: center; margin-bottom: 12px; line-height: 1.4;">${product.description}</div>
            <button style="width: 100%; padding: 12px; background: ${product.test ? "#666" : canAfford ? "#00d4ff" : "#666"}; color: white; border: none; border-radius: 6px; cursor: ${canAfford ? "pointer" : "not-allowed"}; font-size: 16px; font-weight: bold;">
                ${product.test ? "测试功能" : `购买 (${product.price}💎)`}
            </button>
        `;

    if (!product.test && canAfford) {
      div.querySelector("button").onclick = () => buyDiamondProduct(product);
    }

    productsDiv.appendChild(div);
  }
}

function buyDiamondProduct(product) {
  if (persistentData.diamonds < product.price) return;

  persistentData.diamonds -= product.price;

  if (product.effect === "inventory_slots") {
    persistentData.inventorySize = (persistentData.inventorySize || 25) + 5;
    addLog(
      `背包扩展成功! 现在拥有 ${persistentData.inventorySize} 格`,
      "success",
    );
  } else if (product.effect === "inventory_slots_2") {
    persistentData.inventorySize = (persistentData.inventorySize || 25) + 5;
    addLog(
      `背包扩展成功! 现在拥有 ${persistentData.inventorySize} 格`,
      "success",
    );
  }

  updateDiamondShopUI();
  saveGame();
}

// ============================================
// 技能进化系统
// ============================================

function checkSkillEvolution(skill) {
  const evolutionData = SKILL_EVOLUTION[skill.id];
  if (!evolutionData) return;

  // 检查是否达到进化等级
  for (const evo of evolutionData.evolutions) {
    const evoLevel = skill.evolutionLevel || 0;
    if (skill.level >= evo.level && evoLevel < evo.level) {
      // 弹出进化选择
      showEvolutionChoices(skill, evo.choices);
      return;
    }
  }
}

function showEvolutionChoices(skill, choices) {
  gameState.paused = true;
  gameState.levelUpChoices = choices;

  const modal = document.getElementById("level-up-modal");
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  document.getElementById("level-up-header").innerHTML = `
        <h2 style="color: #ff69b4; font-size: 28px; text-shadow: 0 0 20px #ff69b4;">技能进化!</h2>
        <p style="color: #888; font-size: 14px; margin-top: 10px;">${skill.icon} ${skill.name} 达到 Lv.${skill.level} - 选择进化方向</p>
    `;

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const div = document.createElement("div");
    div.className = "skill-card highlight";
    div.dataset.index = i + 1;

    div.innerHTML = `
            <div class="card-number">${i + 1}</div>
            <div class="card-icon">✨</div>
            <div class="card-name">${choice.name}</div>
            <div class="card-desc">${choice.description}</div>
            <div class="card-type" style="color: #ff69b4;">进化</div>
        `;

    div.onclick = () => selectEvolution(skill, choice);
    container.appendChild(div);
  }

  modal.classList.add("show");
}

function selectEvolution(skill, choice) {
  skill.evolution = choice.id;
  skill.evolutionLevel = skill.level;
  skill.evolutionData = skill.evolutionData || {};

  // 合并进化效果
  Object.assign(skill.evolutionData, choice.effect);

  // 应用进化效果 - 基础属性
  if (choice.effect.damageMult)
    skill.damage = Math.floor(skill.damage * choice.effect.damageMult);
  if (choice.effect.rangeMult)
    skill.range = (skill.range || 1) * choice.effect.rangeMult;
  if (choice.effect.cooldownMult)
    skill.cooldown = Math.floor(skill.cooldown * choice.effect.cooldownMult);

  // 应用特殊效果
  if (choice.effect.chainCount !== undefined)
    skill.chainCount = (skill.chainCount || 4) + choice.effect.chainCount;
  if (choice.effect.projectileCount !== undefined) {
    if (choice.effect.projectileCount > 0)
      skill.projectileCount =
        (skill.projectileCount || 1) + choice.effect.projectileCount;
    else
      skill.projectileCount = Math.max(
        1,
        (skill.projectileCount || 5) + choice.effect.projectileCount,
      );
  }
  if (choice.effect.spreadMult !== undefined)
    skill.spread = (skill.spread || 30) * choice.effect.spreadMult;
  if (choice.effect.speedMult !== undefined)
    skill.speed = (skill.speed || 8) * choice.effect.speedMult;
  if (choice.effect.sizeMult !== undefined)
    skill.size = (skill.size || 1) * choice.effect.sizeMult;
  if (choice.effect.explosionMult !== undefined)
    skill.explosionRadius =
      (skill.explosionRadius || 2) * choice.effect.explosionMult;

  // 应用特殊标记
  if (choice.effect.pierce) skill.pierce = true;
  if (choice.effect.explosive) skill.explosive = true;
  if (choice.effect.explosionRadius)
    skill.explosionRadius = choice.effect.explosionRadius;
  if (choice.effect.addBurn) skill.addBurn = true;
  if (choice.effect.burnDuration)
    skill.burnDuration = choice.effect.burnDuration;
  if (choice.effect.burnDamage) skill.burnDamage = choice.effect.burnDamage;
  if (choice.effect.slowEnemy) skill.slowEffect = choice.effect.slowEnemy;
  if (choice.effect.stunDuration)
    skill.stunDuration = choice.effect.stunDuration;
  if (choice.effect.forkChain) skill.forkChain = true;
  if (choice.effect.summonCloud) skill.summonCloud = true;
  if (choice.effect.cloudDuration)
    skill.cloudDuration = choice.effect.cloudDuration;
  if (choice.effect.infiniteChain) skill.infiniteChain = true;
  if (choice.effect.betterHoming) skill.betterHoming = true;
  if (choice.effect.leavesFire) skill.leavesFire = true;
  if (choice.effect.fireDuration)
    skill.fireDuration = choice.effect.fireDuration;
  if (choice.effect.pullEnemy) skill.pullEnemy = true;
  if (choice.effect.hitCount) skill.hitCount = choice.effect.hitCount;
  if (choice.effect.isSpin) skill.isSpin = true;
  if (choice.effect.hasTornado) skill.hasTornado = true;
  if (choice.effect.lifeSteal) skill.lifeSteal = choice.effect.lifeSteal;
  if (choice.effect.isLaser) skill.isLaser = true;
  if (choice.effect.ricochet) skill.ricochet = choice.effect.ricochet;

  addLog(`${skill.icon} ${skill.name} 进化为: ${choice.name}!`, "success");

  document.getElementById("level-up-modal").classList.remove("show");
  gameState.paused = false;
  saveGame();
}
