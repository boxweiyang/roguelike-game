// ============================================
// 被动道具系统 - 用于技能进化和属性增强
// ============================================

const PASSIVE_ITEMS = {
    // ==================== 攻击类 ====================
    
    attack_speed: {
        id: 'attack_speed',
        name: '攻击速度',
        icon: '⚡',
        rarity: 'common',
        description: '提升所有攻击和技能的释放速度',
        details: [
            '✅ 攻击速度: +25%',
            '✅ 冷却缩减: -15%',
            '',
            '影响范围:',
            '- 所有技能冷却时间减少15%',
            '- 投射物发射间隔缩短25%',
            '- 近战攻击速度提升25%',
            '',
            '进化配方:',
            '⚔️ 斩击 Lv.8 + 攻击速度 → 双重斩击'
        ],
        effect: {
            attackSpeed: 0.25,
            cooldownReduction: 0.15
        },
        evolutionRecipe: {
            'slash': 'dual_slash'
        }
    },
    
    damage_boost: {
        id: 'damage_boost',
        name: '伤害强化',
        icon: '💪',
        rarity: 'common',
        description: '提升所有伤害输出',
        details: [
            '✅ 伤害: +35%',
            '',
            '影响范围:',
            '- 所有技能基础伤害+35%',
            '- 普通攻击伤害+35%',
            '',
            '计算公式:',
            '最终伤害 = 基础伤害 × (1 + 0.35)'
        ],
        effect: {
            damage: 0.35
        }
    },
    
    range_boost: {
        id: 'range_boost',
        name: '范围扩大',
        icon: '📏',
        rarity: 'common',
        description: '增加技能和攻击的范围',
        details: [
            '✅ 范围: +30%',
            '',
            '影响范围:',
            '- 近战攻击范围+30%',
            '- 远程技能射程+30%',
            '- AOE技能影响范围+30%'
        ],
        effect: {
            range: 0.30
        },
        evolutionRecipe: {
            'whirlwind': 'tornado'
        }
    },
    
    fire_rate: {
        id: 'fire_rate',
        name: '射速提升',
        icon: '🔥',
        rarity: 'uncommon',
        description: '大幅提升投射类技能的射速',
        details: [
            '✅ 射速: +50%',
            '✅ 冷却缩减: -20%',
            '',
            '影响范围:',
            '- 手枪、步枪、霰弹枪射速+50%',
            '- 火球、飞弹等投射物冷却-20%',
            '',
            '进化配方:',
            '🎯 狙击射击 Lv.8 + 射速提升 → 激光炮'
        ],
        effect: {
            fireRate: 0.50,
            cooldownReduction: 0.20
        },
        evolutionRecipe: {
            'sniper_shot': 'laser_cannon'
        }
    },
    
    projectile_count: {
        id: 'projectile_count',
        name: '数量增加',
        icon: '🔢',
        rarity: 'uncommon',
        description: '增加投射物和召唤物的数量',
        details: [
            '✅ 投射物数量: +3',
            '✅ 召唤物数量: +2',
            '',
            '影响范围:',
            '- 手枪、飞弹等投射物+3个',
            '- 剑刃风暴剑数+2',
            '- 火球术每次+3个火球',
            '',
            '进化配方:',
            '🗡️ 剑刃风暴 Lv.8 + 数量增加 → 万剑归宗'
        ],
        effect: {
            projectileCount: 3,
            summonCount: 2
        },
        evolutionRecipe: {
            'blade_storm': 'ten_thousand_swords'
        }
    },
    
    pierce: {
        id: 'pierce',
        name: '穿透',
        icon: '🔪',
        rarity: 'uncommon',
        description: '投射物可以穿透敌人',
        details: [
            '✅ 穿透: +2个敌人',
            '',
            '影响范围:',
            '- 子弹、飞弹、剑刃等可以穿透额外2个敌人',
            '- 穿透后伤害不衰减'
        ],
        effect: {
            pierce: 2
        }
    },
    
    // ==================== 暴击类 ====================
    
    crit_chance: {
        id: 'crit_chance',
        name: '暴击率',
        icon: '🎯',
        rarity: 'rare',
        description: '提升暴击概率',
        details: [
            '✅ 暴击率: +15%',
            '',
            '影响范围:',
            '- 所有攻击和技能有15%概率暴击',
            '- 暴击造成200%伤害',
            '',
            '进化配方:',
            '🎰 幸运轮盘 Lv.8 + 暴击率 → 命运之轮'
        ],
        effect: {
            critChance: 0.15
        },
        evolutionRecipe: {
            'lucky_wheel': 'wheel_of_fate'
        }
    },
    
    crit_damage: {
        id: 'crit_damage',
        name: '暴击伤害',
        icon: '💥',
        rarity: 'rare',
        description: '提升暴击时的伤害倍率',
        details: [
            '✅ 暴击伤害: +100%',
            '',
            '影响范围:',
            '- 暴击伤害从200%提升至300%',
            '- 与其他暴击加成叠加'
        ],
        effect: {
            critDamage: 1.0
        }
    },
    
    // ==================== 生存类 ====================
    
    life_steal: {
        id: 'life_steal',
        name: '生命汲取',
        icon: '🩸',
        rarity: 'rare',
        description: '攻击时恢复生命值',
        details: [
            '✅ 吸血: +10%',
            '',
            '影响范围:',
            '- 造成伤害的10%转化为生命值',
            '- 对所有技能生效'
        ],
        effect: {
            lifeSteal: 0.10
        }
    },
    
    move_speed: {
        id: 'move_speed',
        name: '移动速度',
        icon: '💨',
        rarity: 'common',
        description: '提升移动速度，更容易躲避攻击',
        details: [
            '✅ 移动速度: +20%',
            '',
            '影响范围:',
            '- 玩家移动速度+20%',
            '- 不影响技能速度'
        ],
        effect: {
            moveSpeed: 0.20
        }
    },
    
    health_regen: {
        id: 'health_regen',
        name: '生命恢复',
        icon: '💚',
        rarity: 'uncommon',
        description: '每秒自动恢复生命值',
        details: [
            '✅ 生命恢复: +20/秒',
            '',
            '影响范围:',
            '- 每秒恢复20点生命值',
            '- 战斗中持续生效'
        ],
        effect: {
            healthRegen: 20
        }
    },
    
    armor: {
        id: 'armor',
        name: '护甲',
        icon: '🛡️',
        rarity: 'common',
        description: '减少受到的伤害',
        details: [
            '✅ 护甲: +15',
            '',
            '影响范围:',
            '- 受到伤害减少15点',
            '- 最低受到1点伤害',
            '',
            '进化配方:',
            '🛡️ 神圣护盾 Lv.8 + 护甲 → 无敌领域'
        ],
        effect: {
            armor: 15
        },
        evolutionRecipe: {
            'holy_shield': 'invincible_field'
        }
    },
    
    extra_health: {
        id: 'extra_health',
        name: '额外生命',
        icon: '❤️',
        rarity: 'common',
        description: '增加最大生命值',
        details: [
            '✅ 最大HP: +50',
            '',
            '影响范围:',
            '- 玩家最大生命值+50'
        ],
        effect: {
            maxHealth: 50
        }
    },
    
    // ==================== 元素类 ====================
    
    fire_damage: {
        id: 'fire_damage',
        name: '火焰伤害',
        icon: '🔥',
        rarity: 'rare',
        description: '提升火焰类技能伤害',
        details: [
            '✅ 火焰伤害: +50%',
            '',
            '影响范围:',
            '- 火球术、地狱火雨等火系技能伤害+50%',
            '- 火焰持续伤害+50%',
            '',
            '进化配方:',
            '🔥 地狱火雨 Lv.8 + 火焰伤害 → 陨石天灾'
        ],
        effect: {
            fireDamage: 0.50
        },
        evolutionRecipe: {
            'hellfire_rain': 'meteor_disaster'
        }
    },
    
    lightning_damage: {
        id: 'lightning_damage',
        name: '闪电伤害',
        icon: '⚡',
        rarity: 'rare',
        description: '提升闪电类技能伤害和范围',
        details: [
            '✅ 闪电伤害: +50%',
            '✅ 连锁数量: +2',
            '',
            '影响范围:',
            '- 雷暴领域、闪电链等雷系技能伤害+50%',
            '- 闪电连锁额外+2个目标',
            '',
            '进化配方:',
            '⚡ 雷暴领域 Lv.8 + 闪电伤害 → 天罚雷暴'
        ],
        effect: {
            lightningDamage: 0.50,
            chainCount: 2
        },
        evolutionRecipe: {
            'thunderstorm': 'divine_thunderstorm'
        }
    },
    
    frost_damage: {
        id: 'frost_damage',
        name: '冰霜伤害',
        icon: '❄️',
        rarity: 'rare',
        description: '提升冰霜类技能伤害和持续时间',
        details: [
            '✅ 冰霜伤害: +50%',
            '✅ 冻结时间: +50%',
            '',
            '影响范围:',
            '- 冰霜新星等冰系技能伤害+50%',
            '- 冻结、减速持续时间+50%',
            '',
            '进化配方:',
            '❄️ 冰霜新星 Lv.8 + 冰霜伤害 → 绝对零度'
        ],
        effect: {
            frostDamage: 0.50,
            freezeDuration: 0.50
        },
        evolutionRecipe: {
            'frost_nova': 'absolute_zero'
        }
    },
    
    poison_damage: {
        id: 'poison_damage',
        name: '毒素伤害',
        icon: '☠️',
        rarity: 'rare',
        description: '提升毒素类技能伤害',
        details: [
            '✅ 毒素伤害: +50%',
            '',
            '影响范围:',
            '- 中毒、毒云等毒系技能伤害+50%',
            '- 毒素持续时间+25%'
        ],
        effect: {
            poisonDamage: 0.50,
            poisonDuration: 0.25
        }
    },
    
    // ==================== 特殊类 ====================
    
    explosion_radius: {
        id: 'explosion_radius',
        name: '爆炸范围',
        icon: '💣',
        rarity: 'rare',
        description: '增加爆炸类技能的范围和伤害',
        details: [
            '✅ 爆炸范围: +40%',
            '✅ 爆炸伤害: +30%',
            '',
            '影响范围:',
            '- 地雷、飞弹等爆炸技能范围+40%',
            '- 爆炸伤害+30%',
            '',
            '进化配方:',
            '💥 爆裂飞弹 Lv.8 + 爆炸范围 → 核弹飞弹',
            '💣 连锁爆炸 Lv.8 + 爆炸范围 → 核爆连锁'
        ],
        effect: {
            explosionRadius: 0.40,
            explosionDamage: 0.30
        },
        evolutionRecipe: {
            'explosive_missiles': 'nuke_missiles',
            'chain_explosion': 'nuke_chain'
        }
    },
    
    duration: {
        id: 'duration',
        name: '持续时间',
        icon: '⏰',
        rarity: 'uncommon',
        description: '增加持续性技能的持续时间',
        details: [
            '✅ 持续时间: +50%',
            '',
            '影响范围:',
            '- 护盾、光环、DOT等技能持续时间+50%',
            '- 火焰地面、冰霜区域等持续效果+50%',
            '',
            '进化配方:',
            '🌀 黑洞吞噬 Lv.8 + 持续时间 → 维度裂隙',
            '☠️ 死亡之握 Lv.8 + 持续时间 → 灵魂收割',
            '🔥 地狱火雨 Lv.8 + 持续时间 → 陨石天灾',
            '👥 镜像分身 Lv.8 + 持续时间 → 军团'
        ],
        effect: {
            duration: 0.50
        },
        evolutionRecipe: {
            'black_hole': 'dimensional_rift',
            'death_grasp': 'soul_reaping',
            'hellfire_rain': 'meteor_disaster',
            'mirror_clone': 'clone_legion'
        }
    },
    
    cooldown_reduction: {
        id: 'cooldown_reduction',
        name: '冷却缩减',
        icon: '⏱️',
        rarity: 'uncommon',
        description: '减少所有技能的冷却时间',
        details: [
            '✅ 冷却缩减: -25%',
            '',
            '影响范围:',
            '- 所有技能冷却时间减少25%',
            '- 最低冷却时间0.1秒',
            '',
            '进化配方:',
            '🌟 星辰坠落 Lv.8 + 冷却缩减 → 星爆'
        ],
        effect: {
            cooldownReduction: 0.25
        },
        evolutionRecipe: {
            'starfall': 'starburst'
        }
    },
    
    experience_boost: {
        id: 'experience_boost',
        name: '经验获取',
        icon: '✨',
        rarity: 'uncommon',
        description: '增加获得的经验值',
        details: [
            '✅ 经验获取: +30%',
            '',
            '影响范围:',
            '- 击杀敌人获得经验+30%',
            '- 升级更快'
        ],
        effect: {
            experienceBoost: 0.30
        }
    }
};

// 导出被动道具数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PASSIVE_ITEMS;
}

console.log('被动道具系统加载完成 - 20个被动道具');
