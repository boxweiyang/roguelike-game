// ============================================
// 角色属性系统
// ============================================

class PlayerStats {
    constructor() {
        // 基础属性（会随等级和装备变化）
        this.maxHp = CONFIG.PLAYER.BASE_HP;
        this.currentHp = CONFIG.PLAYER.BASE_HP;
        
        // 攻击属性
        this.damage = 10;              // 基础伤害
        this.attackSpeed = 1.0;        // 攻速倍率（1.0 = 100%）
        this.criticalChance = CONFIG.PLAYER.BASE_CRITICAL_CHANCE;  // 暴击率 0-1
        this.criticalDamage = CONFIG.PLAYER.BASE_CRITICAL_DAMAGE;  // 暴击伤害倍率
        
        // 伤害加成（分开计算方便显示）
        this.meleeDamageBonus = 0;     // 近战伤害加成
        this.rangedDamageBonus = 0;    // 远程伤害加成
        this.magicDamageBonus = 0;     // 魔法伤害加成
        
        // 防御属性
        this.armor = 0;                // 护甲值
        this.damageReduction = 0;      // 减伤百分比 0-1
        this.dodgeChance = 0;          // 闪避率 0-1
        
        // 移动和拾取
        this.moveSpeed = CONFIG.PLAYER.BASE_SPEED;
        this.pickupRange = CONFIG.PLAYER.BASE_PICKUP_RANGE;
        
        // 特殊属性
        this.lifeRegen = 0;            // 生命回复/秒
        this.thorns = 0;               // 荆棘伤害
        this.areaDamage = 0;           // 范围伤害加成
        this.projectileCount = 0;      // 额外投射物数量
        this.pierce = 0;               // 穿透次数
        
        // 经验相关
        this.xpBonus = 0;              // 经验获取加成
        this.goldBonus = 0;            // 金币获取加成
        
        // 技能相关
        this.cooldownReduction = 0;    // 冷却缩减 0-1
        this.skillDamageBonus = 0;     // 技能伤害加成
    }
    
    // 计算实际伤害
    calculateDamage(baseDamage, damageType = 'normal') {
        let damage = baseDamage;
        
        // 添加类型加成
        if (damageType === 'melee') {
            damage += this.meleeDamageBonus;
        } else if (damageType === 'ranged') {
            damage += this.rangedDamageBonus;
        } else if (damageType === 'magic') {
            damage += this.magicDamageBonus;
        }
        
        // 技能加成
        damage *= (1 + this.skillDamageBonus);
        
        // 暴击判定
        const isCritical = Math.random() < this.criticalChance;
        if (isCritical) {
            damage *= this.criticalDamage;
        }
        
        return { damage: Math.floor(damage), isCritical };
    }
    
    // 计算受到伤害
    calculateIncomingDamage(baseDamage) {
        // 先减去护甲
        let damage = baseDamage - this.armor * 0.5;
        
        // 再应用减伤
        damage *= (1 - this.damageReduction);
        
        // 闪避判定
        const isDodged = Math.random() < this.dodgeChance;
        if (isDodged) {
            return { damage: 0, isDodged: true };
        }
        
        return { damage: Math.max(1, Math.floor(damage)), isDodged: false };
    }
    
    // 获取所有属性（用于显示）
    getAllStats() {
        return {
            '最大生命': `${this.maxHp}`,
            '基础伤害': `${this.damage}`,
            '攻击速度': `${(this.attackSpeed * 100).toFixed(0)}%`,
            '暴击率': `${(this.criticalChance * 100).toFixed(1)}%`,
            '暴击伤害': `${(this.criticalDamage * 100).toFixed(0)}%`,
            '近战伤害': `+${this.meleeDamageBonus}`,
            '远程伤害': `+${this.rangedDamageBonus}`,
            '魔法伤害': `+${this.magicDamageBonus}`,
            '护甲': `${this.armor}`,
            '减伤': `${(this.damageReduction * 100).toFixed(1)}%`,
            '闪避': `${(this.dodgeChance * 100).toFixed(1)}%`,
            '移速': `${this.moveSpeed.toFixed(1)}`,
            '拾取范围': `${this.pickupRange.toFixed(1)}`,
            '生命回复': `${this.lifeRegen}/s`,
            '荆棘伤害': `${this.thorns}`,
            '范围伤害': `+${(this.areaDamage * 100).toFixed(0)}%`,
            '额外投射物': `+${this.projectileCount}`,
            '穿透': `+${this.pierce}`,
            '经验加成': `+${(this.xpBonus * 100).toFixed(0)}%`,
            '金币加成': `+${(this.goldBonus * 100).toFixed(0)}%`,
            '冷却缩减': `${(this.cooldownReduction * 100).toFixed(0)}%`,
            '技能伤害': `+${(this.skillDamageBonus * 100).toFixed(0)}%`
        };
    }
    
    // 从装备和升级应用加成
    applyBonuses(equipment = [], levelBonuses = {}) {
        // 重置到基础值
        this.maxHp = CONFIG.PLAYER.BASE_HP;
        this.damage = 10;
        this.moveSpeed = CONFIG.PLAYER.BASE_SPEED;
        this.pickupRange = CONFIG.PLAYER.BASE_PICKUP_RANGE;
        this.criticalChance = CONFIG.PLAYER.BASE_CRITICAL_CHANCE;
        this.armor = 0;
        this.damageReduction = 0;
        this.lifeRegen = 0;
        this.meleeDamageBonus = 0;
        this.rangedDamageBonus = 0;
        this.magicDamageBonus = 0;
        this.attackSpeed = 1.0;
        this.cooldownReduction = 0;
        this.skillDamageBonus = 0;
        this.dodgeChance = 0;
        this.projectileCount = 0;
        this.pierce = 0;
        this.xpBonus = 0;
        this.goldBonus = 0;
        
        // 应用装备加成
        for (const equip of equipment) {
            if (!equip) continue;
            const stats = equip.getStats();
            this.applyStat(stats);
        }
        
        // 应用等级加成
        if (levelBonuses.level) {
            this.maxHp += CONFIG.PLAYER.HP_PER_LEVEL * (levelBonuses.level - 1);
            this.damage += CONFIG.PLAYER.DAMAGE_PER_LEVEL * (levelBonuses.level - 1);
        }
        
        // 更新当前生命（如果最大生命变化）
        if (this.currentHp > this.maxHp) {
            this.currentHp = this.maxHp;
        }
    }
    
    // 应用单个属性
    applyStat(statName, value) {
        if (typeof statName === 'object') {
            // 如果是对象，递归应用
            for (const [key, val] of Object.entries(statName)) {
                this.applyStat(key, val);
            }
            return;
        }
        
        switch (statName) {
            case 'maxHp': this.maxHp += value; break;
            case 'damage': this.damage += value; break;
            case 'attackSpeed': this.attackSpeed *= (1 + value); break;
            case 'criticalChance': this.criticalChance = Math.min(0.8, this.criticalChance + value); break;
            case 'criticalDamage': this.criticalDamage += value; break;
            case 'meleeDamage': this.meleeDamageBonus += value; break;
            case 'rangedDamage': this.rangedDamageBonus += value; break;
            case 'magicDamage': this.magicDamageBonus += value; break;
            case 'armor': this.armor += value; break;
            case 'damageReduction': this.damageReduction = Math.min(0.75, this.damageReduction + value); break;
            case 'dodge': this.dodgeChance = Math.min(0.5, this.dodgeChance + value); break;
            case 'moveSpeed': this.moveSpeed *= (1 + value); break;
            case 'pickupRange': this.pickupRange *= (1 + value); break;
            case 'lifeRegen': this.lifeRegen += value; break;
            case 'cooldownReduction': this.cooldownReduction = Math.min(0.5, this.cooldownReduction + value); break;
            case 'skillDamage': this.skillDamageBonus += value; break;
            case 'projectileCount': this.projectileCount += value; break;
            case 'pierce': this.pierce += value; break;
            case 'xpBonus': this.xpBonus += value; break;
            case 'goldBonus': this.goldBonus += value; break;
        }
    }
    
    // 治疗
    heal(amount) {
        const healed = Math.min(amount, this.maxHp - this.currentHp);
        this.currentHp += healed;
        return healed;
    }
    
    // 受到伤害
    takeDamage(amount) {
        const result = this.calculateIncomingDamage(amount);
        this.currentHp -= result.damage;
        return result;
    }
    
    // 检查是否存活
    isAlive() {
        return this.currentHp > 0;
    }
}
