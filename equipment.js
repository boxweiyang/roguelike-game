// ============================================
// 装备系统
// ============================================

// 装备词缀池
const AFFIXES = {
    // 攻击词缀
    damage: { name: '伤害', min: 3, max: 10, weight: 10 },
    attackSpeed: { name: '攻速', min: 0.05, max: 0.2, weight: 8 },
    criticalChance: { name: '暴击率', min: 0.02, max: 0.08, weight: 7 },
    criticalDamage: { name: '暴击伤害', min: 0.1, max: 0.5, weight: 6 },
    meleeDamage: { name: '近战伤害', min: 2, max: 8, weight: 8 },
    rangedDamage: { name: '远程伤害', min: 2, max: 8, weight: 8 },
    
    // 防御词缀
    maxHp: { name: '最大生命', min: 10, max: 40, weight: 10 },
    armor: { name: '护甲', min: 3, max: 15, weight: 9 },
    damageReduction: { name: '减伤', min: 0.03, max: 0.1, weight: 5 },
    dodge: { name: '闪避', min: 0.02, max: 0.08, weight: 4 },
    
    // 功能词缀
    moveSpeed: { name: '移速', min: 0.05, max: 0.15, weight: 7 },
    pickupRange: { name: '拾取范围', min: 0.1, max: 0.3, weight: 6 },
    lifeRegen: { name: '生命回复', min: 0.5, max: 3, weight: 5 },
    cooldownReduction: { name: '冷却缩减', min: 0.03, max: 0.1, weight: 5 },
    skillDamage: { name: '技能伤害', min: 0.05, max: 0.2, weight: 7 },
    projectileCount: { name: '投射物', min: 1, max: 2, weight: 3 },
    pierce: { name: '穿透', min: 1, max: 2, weight: 3 }
};

// 武器特效
const WEAPON_EFFECTS = {
    // 剑特效
    sword: [
        { id: 'bleed', name: '流血', description: '攻击使敌人流血3秒', icon: '🩸' },
        { id: 'slash', name: '斩击', description: '攻击范围+20%', icon: '⚔️' },
        { id: 'vampiric', name: '吸血', description: '攻击回复3%伤害生命', icon: '🧛' }
    ],
    // 弓特效
    bow: [
        { id: 'poison', name: '剧毒', description: '箭矢附带中毒效果', icon: '☠️' },
        { id: 'multishot', name: '齐射', description: '额外发射1支箭', icon: '🎯' },
        { id: 'piercing', name: '穿透箭', description: '箭矢可穿透2个敌人', icon: '🔱' }
    ],
    // 法杖特效
    staff: [
        { id: 'chain', name: '连锁闪电', description: '10%概率触发闪电链', icon: '⚡' },
        { id: 'explode', name: '爆炸', description: '火球爆炸范围+50%', icon: '💥' },
        { id: 'frost', name: '冰霜', description: '减缓敌人30%移速', icon: '❄️' }
    ]
};

// 装备特效（胸甲/鞋子/饰品）
const ARMOR_EFFECTS = {
    chest: [
        { id: 'thorns', name: '荆棘', description: '反弹10%受到伤害', icon: '🌵' },
        { id: 'fortify', name: '坚固', description: '护甲+30%', icon: '🏰' },
        { id: 'recovery', name: '恢复', description: '受击后每秒回复2HP持续5秒', icon: '💚' }
    ],
    boots: [
        { id: 'swift', name: '迅捷', description: '移速+20%', icon: '💨' },
        { id: 'stomp', name: '践踏', description: '移动时对周围敌人造成伤害', icon: '👣' },
        { id: 'evasion', name: '飘逸', description: '闪避+10%', icon: '🌀' }
    ],
    accessory: [
        { id: 'greed', name: '贪婪', description: '金币获取+30%', icon: '💰' },
        { id: 'knowledge', name: '知识', description: '经验获取+30%', icon: '📚' },
        { id: 'luck', name: '幸运', description: '稀有掉落率+20%', icon: '🍀' },
        { id: 'cooldown', name: '急速', description: '冷却缩减+15%', icon: '⏱️' }
    ]
};

// 装备模板
const EQUIPMENT_TEMPLATES = {
    // 剑
    iron_sword: {
        id: 'iron_sword',
        name: '铁剑',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.SWORD,
        icon: '🗡️',
        baseStats: { damage: 8, meleeDamage: 3 },
        minLevel: 1
    },
    steel_sword: {
        id: 'steel_sword',
        name: '钢剑',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.SWORD,
        icon: '⚔️',
        baseStats: { damage: 15, meleeDamage: 5, attackSpeed: 0.1 },
        minLevel: 3
    },
    flame_sword: {
        id: 'flame_sword',
        name: '烈焰之剑',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.SWORD,
        icon: '🔥',
        baseStats: { damage: 25, meleeDamage: 10, criticalChance: 0.05 },
        minLevel: 5
    },
    
    // 弓
    short_bow: {
        id: 'short_bow',
        name: '短弓',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.BOW,
        icon: '🏹',
        baseStats: { damage: 10, rangedDamage: 5, attackSpeed: 0.15 },
        minLevel: 1
    },
    long_bow: {
        id: 'long_bow',
        name: '长弓',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.BOW,
        icon: '🎯',
        baseStats: { damage: 18, rangedDamage: 8, criticalChance: 0.1 },
        minLevel: 3
    },
    wind_bow: {
        id: 'wind_bow',
        name: '疾风之弓',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.BOW,
        icon: '💨',
        baseStats: { damage: 28, rangedDamage: 12, attackSpeed: 0.2, criticalChance: 0.08 },
        minLevel: 5
    },
    
    // 法杖
    wood_staff: {
        id: 'wood_staff',
        name: '木法杖',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.STAFF,
        icon: '🪄',
        baseStats: { damage: 12, magicDamage: 5, skillDamage: 0.1 },
        minLevel: 1
    },
    crystal_staff: {
        id: 'crystal_staff',
        name: '水晶法杖',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.STAFF,
        icon: '💎',
        baseStats: { damage: 20, magicDamage: 10, skillDamage: 0.2, cooldownReduction: 0.05 },
        minLevel: 3
    },
    storm_staff: {
        id: 'storm_staff',
        name: '风暴法杖',
        slot: EQUIPMENT_SLOT.WEAPON,
        weaponType: WEAPON_TYPE.STAFF,
        icon: '⚡',
        baseStats: { damage: 32, magicDamage: 15, skillDamage: 0.3, cooldownReduction: 0.1 },
        minLevel: 5
    },
    
    // 胸甲
    leather_armor: {
        id: 'leather_armor',
        name: '皮甲',
        slot: EQUIPMENT_SLOT.CHEST,
        icon: '🦺',
        baseStats: { armor: 5, maxHp: 10 },
        minLevel: 1
    },
    chain_armor: {
        id: 'chain_armor',
        name: '锁子甲',
        slot: EQUIPMENT_SLOT.CHEST,
        icon: '🛡️',
        baseStats: { armor: 10, maxHp: 20, damageReduction: 0.05 },
        minLevel: 3
    },
    plate_armor: {
        id: 'plate_armor',
        name: '板甲',
        slot: EQUIPMENT_SLOT.CHEST,
        icon: '🏰',
        baseStats: { armor: 18, maxHp: 35, damageReduction: 0.08 },
        minLevel: 5
    },
    
    // 鞋子
    leather_boots: {
        id: 'leather_boots',
        name: '皮靴',
        slot: EQUIPMENT_SLOT.BOOTS,
        icon: '👢',
        baseStats: { moveSpeed: 0.08, dodge: 0.02 },
        minLevel: 1
    },
    iron_boots: {
        id: 'iron_boots',
        name: '铁靴',
        slot: EQUIPMENT_SLOT.BOOTS,
        icon: '👞',
        baseStats: { moveSpeed: 0.12, armor: 3, dodge: 0.03 },
        minLevel: 3
    },
    wind_boots: {
        id: 'wind_boots',
        name: '疾风靴',
        slot: EQUIPMENT_SLOT.BOOTS,
        icon: '💨',
        baseStats: { moveSpeed: 0.18, dodge: 0.05, pickupRange: 0.2 },
        minLevel: 5
    },
    
    // 饰品
    copper_ring: {
        id: 'copper_ring',
        name: '铜戒指',
        slot: EQUIPMENT_SLOT.ACCESSORY,
        icon: '💍',
        baseStats: { criticalChance: 0.03, xpBonus: 0.1 },
        minLevel: 1
    },
    gold_amulet: {
        id: 'gold_amulet',
        name: '金护符',
        slot: EQUIPMENT_SLOT.ACCESSORY,
        icon: '📿',
        baseStats: { criticalChance: 0.05, goldBonus: 0.2, cooldownReduction: 0.05 },
        minLevel: 3
    },
    diamond_necklace: {
        id: 'diamond_necklace',
        name: '钻石项链',
        slot: EQUIPMENT_SLOT.ACCESSORY,
        icon: '💎',
        baseStats: { criticalChance: 0.08, criticalDamage: 0.3, goldBonus: 0.3, xpBonus: 0.2 },
        minLevel: 5
    }
};

// ============================================
// 装备类
// ============================================

class Equipment {
    constructor(template, rarity, level) {
        this.id = template.id;
        this.name = template.name;
        this.slot = template.slot;
        this.weaponType = template.weaponType || null;
        this.icon = template.icon;
        this.rarity = rarity;
        this.level = level;
        this.baseStats = { ...template.baseStats };
        this.affixes = [];
        this.effect = null;
        
        // 应用稀有度倍率
        const rarityMult = RARITY[rarity].multiplier;
        for (const [key, value] of Object.entries(this.baseStats)) {
            this.baseStats[key] = typeof value === 'number' ? Math.floor(value * rarityMult * (1 + level * 0.1)) : value;
        }
        
        // 生成词缀
        this.generateAffixes();
        
        // 生成特效
        this.generateEffect();
    }
    
    // 生成随机词缀
    generateAffixes() {
        const maxAffixes = RARITY[this.rarity].maxAffixes;
        const availableAffixes = this.getAffixesForSlot();
        
        const count = Math.min(maxAffixes, availableAffixes.length);
        const shuffled = availableAffixes.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < count; i++) {
            const affix = shuffled[i];
            const value = randFloat(affix.min, affix.max) * (1 + this.level * 0.08);
            this.affixes.push({
                id: affix.id || affix.name,
                name: affix.name,
                value: Math.round(value * 100) / 100
            });
        }
    }
    
    // 获取该槽位可用的词缀
    getAffixesForSlot() {
        switch (this.slot) {
            case EQUIPMENT_SLOT.WEAPON:
                return Object.entries(AFFIXES)
                    .filter(([id]) => ['damage', 'attackSpeed', 'criticalChance', 'criticalDamage', 'meleeDamage', 'rangedDamage', 'magicDamage', 'projectileCount', 'pierce'].includes(id))
                    .map(([id, data]) => ({ id, ...data }));
            case EQUIPMENT_SLOT.CHEST:
                return Object.entries(AFFIXES)
                    .filter(([id]) => ['maxHp', 'armor', 'damageReduction', 'lifeRegen', 'thorns'].includes(id))
                    .map(([id, data]) => ({ id, ...data }));
            case EQUIPMENT_SLOT.BOOTS:
                return Object.entries(AFFIXES)
                    .filter(([id]) => ['moveSpeed', 'dodge', 'pickupRange', 'armor'].includes(id))
                    .map(([id, data]) => ({ id, ...data }));
            case EQUIPMENT_SLOT.ACCESSORY:
                return Object.entries(AFFIXES)
                    .filter(([id]) => ['criticalChance', 'criticalDamage', 'xpBonus', 'goldBonus', 'cooldownReduction', 'skillDamage', 'luck'].includes(id))
                    .map(([id, data]) => ({ id, ...data }));
            default:
                return [];
        }
    }
    
    // 生成特效
    generateEffect() {
        const effects = this.getEffectsForSlot();
        if (effects.length > 0 && Math.random() < 0.3 * RARITY[this.rarity].multiplier) {
            this.effect = effects[rand(0, effects.length - 1)];
        }
    }
    
    // 获取该槽位可用的特效
    getEffectsForSlot() {
        switch (this.slot) {
            case EQUIPMENT_SLOT.WEAPON:
                return WEAPON_EFFECTS[this.weaponType] || [];
            case EQUIPMENT_SLOT.CHEST:
                return ARMOR_EFFECTS.chest || [];
            case EQUIPMENT_SLOT.BOOTS:
                return ARMOR_EFFECTS.boots || [];
            case EQUIPMENT_SLOT.ACCESSORY:
                return ARMOR_EFFECTS.accessory || [];
            default:
                return [];
        }
    }
    
    // 获取所有属性（包括词缀）
    getStats() {
        const stats = { ...this.baseStats };
        for (const affix of this.affixes) {
            stats[affix.id] = (stats[affix.id] || 0) + affix.value;
        }
        return stats;
    }
    
    // 获取描述
    getDescription() {
        let desc = [];
        
        // 基础属性
        for (const [key, value] of Object.entries(this.baseStats)) {
            const name = this.getStatName(key);
            desc.push(`${name}: +${this.formatValue(key, value)}`);
        }
        
        // 词缀
        for (const affix of this.affixes) {
            desc.push(`${affix.name}: +${this.formatValue(affix.id, affix.value)}`);
        }
        
        // 特效
        if (this.effect) {
            desc.push(`\n特效: ${this.effect.icon} ${this.effect.name}`);
            desc.push(`  ${this.effect.description}`);
        }
        
        return desc.join('\n');
    }
    
    // 获取属性中文名
    getStatName(key) {
        const names = {
            damage: '伤害',
            maxHp: '最大生命',
            armor: '护甲',
            attackSpeed: '攻击速度',
            criticalChance: '暴击率',
            criticalDamage: '暴击伤害',
            meleeDamage: '近战伤害',
            rangedDamage: '远程伤害',
            magicDamage: '魔法伤害',
            moveSpeed: '移速',
            dodge: '闪避',
            damageReduction: '减伤',
            pickupRange: '拾取范围',
            lifeRegen: '生命回复',
            cooldownReduction: '冷却缩减',
            skillDamage: '技能伤害',
            projectileCount: '投射物',
            pierce: '穿透',
            xpBonus: '经验加成',
            goldBonus: '金币加成'
        };
        return names[key] || key;
    }
    
    // 格式化值
    formatValue(key, value) {
        const percentStats = ['attackSpeed', 'criticalChance', 'criticalDamage', 'moveSpeed', 'dodge', 'damageReduction', 'pickupRange', 'cooldownReduction', 'skillDamage', 'xpBonus', 'goldBonus'];
        if (percentStats.includes(key)) {
            return `${(value * 100).toFixed(0)}%`;
        }
        return value.toFixed(0);
    }
}

// ============================================
// 装备生成器
// ============================================

function generateEquipment(level, slot = null) {
    // 选择槽位
    if (!slot) {
        const slots = Object.values(EQUIPMENT_SLOT);
        slot = slots[rand(0, slots.length - 1)];
    }
    
    // 筛选可用装备
    const available = Object.values(EQUIPMENT_TEMPLATES).filter(e => 
        e.slot === slot && e.minLevel <= level
    );
    
    if (available.length === 0) return null;
    
    const template = available[rand(0, available.length - 1)];
    
    // 根据等级和随机数决定稀有度
    const rarity = rollRarity(level);
    
    return new Equipment(template, rarity, level);
}

// 随机稀有度
function rollRarity(level) {
    const weights = { ...CONFIG.EQUIPMENT.RARITY_WEIGHTS };
    
    // 高等级增加稀有度
    if (level > 5) {
        weights.rare += 5;
        weights.epic += 3;
    }
    if (level > 10) {
        weights.epic += 5;
        weights.legendary += 2;
    }
    
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    
    for (const [rarity, weight] of Object.entries(weights)) {
        roll -= weight;
        if (roll <= 0) return rarity;
    }
    
    return 'common';
}
