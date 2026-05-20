// ============================================
// 技能数据定义 - 割草体验重制版
// 包含15个技能、升级路线、进化配方、特效配置
// ============================================

const SKILLS_DATA = {
    // ==================== T0 神技 ====================
    
    // 1. 死亡旋风
    death_whirlwind: {
        id: 'death_whirlwind',
        name: '死亡旋风',
        icon: '🌪️',
        type: 'melee_aoe',
        rarity: 'legendary',
        description: '释放旋转刀刃攻击周围所有敌人',
        
        // 基础属性
        baseDamage: 25,
        baseRange: 3,
        baseCooldown: 1200,
        bladeCount: 4,
        
        // 伤害公式说明
        damageFormula: '最终伤害 = 基础伤害 × 等级倍率 × (1 + 伤害加成%) × (1 + 技能伤害%)',
        
        // 每级详细配置
        levels: [
            {
                level: 1,
                damage: 25,
                range: 3,
                blades: 4,
                cooldown: 1200,
                description: '释放4个旋转刀刃，每个造成25点伤害，范围3格',
                visual: '小型蓝色刀刃，旋转轨迹',
                effect: 'blade_spin'
            },
            {
                level: 2,
                damage: 30,
                range: 3,
                blades: 4,
                cooldown: 1100,
                description: '刀刃伤害提升至30，冷却缩短至1.1秒',
                visual: '刀刃体积增大20%，蓝色光效增强',
                effect: 'blade_spin_enhanced'
            },
            {
                level: 3,
                damage: 38,
                range: 4,
                blades: 6,
                cooldown: 1000,
                description: '刀刃数量+2，范围+1格，每秒伤害提升50%',
                visual: '6个刀刃同时旋转，范围明显扩大',
                effect: 'blade_spin_wide'
            },
            {
                level: 4,
                damage: 45,
                range: 4,
                blades: 6,
                cooldown: 900,
                description: '刀刃可以穿透1个敌人，伤害提升',
                visual: '刀刃带穿透光效，击中后继续飞行',
                effect: 'blade_piercing'
            },
            {
                level: 5,
                damage: 55,
                range: 5,
                blades: 8,
                cooldown: 800,
                description: '刀刃+2，范围+1，移动时留下火焰轨迹(每秒10点伤害)',
                visual: '8个大型刀刃，地面留下燃烧轨迹',
                effect: 'blade_fire_trail'
            },
            {
                level: 6,
                damage: 65,
                range: 5,
                blades: 8,
                cooldown: 700,
                description: '火焰轨迹伤害提升至15/秒，范围扩大',
                visual: '火焰轨迹更宽更亮，伤害数字跳动',
                effect: 'blade_fire_trail_intense'
            },
            {
                level: 7,
                damage: 78,
                range: 6,
                blades: 10,
                cooldown: 600,
                description: '刀刃+2，范围+1，刀刃附带5%吸血效果',
                visual: '10个刀刃带红色吸血光效',
                effect: 'blade_lifesteal'
            },
            {
                level: 8,
                damage: 93,
                range: 7,
                blades: 12,
                cooldown: 500,
                description: '满级！12个刀刃，范围7格，吸血提升至10%',
                visual: '12个刀刃高速旋转，强烈红色光效',
                effect: 'blade_lifesteal_max',
                evolution: {
                    requiredPassive: 'attack_speed',
                    evolvedSkill: 'apocalypse_tornado',
                    evolvedName: '末日龙卷风'
                }
            }
        ],
        
        // 超武进化
        evolution: {
            id: 'apocalypse_tornado',
            name: '末日龙卷风',
            icon: '🌪️🌪️',
            rarity: 'mythic',
            damage: 150,
            range: 15,
            hitsPerSecond: 10,
            description: '龙卷风可移动并自动追踪敌人，每秒造成10次伤害',
            visual: '巨型黑色龙卷风，全屏可见，闪电特效',
            effects: ['tracking', 'knockback', 'lifesteal_15%']
        }
    },
    
    // 2. 雷暴领域
    thunderstorm: {
        id: 'thunderstorm',
        name: '雷暴领域',
        icon: '⚡',
        type: 'auto_aoe',
        rarity: 'legendary',
        description: '召唤闪电劈向敌人，可以连锁攻击',
        
        baseDamage: 30,
        baseRange: 5,
        baseCooldown: 800,
        lightningCount: 1,
        chainCount: 0,
        
        damageFormula: '最终伤害 = 基础伤害 × 等级倍率 × (1 + 伤害加成%) × (1 + 闪电伤害%)',
        
        levels: [
            {
                level: 1,
                damage: 30,
                range: 5,
                lightnings: 1,
                chain: 0,
                cooldown: 800,
                description: '召唤1道闪电劈向最近敌人，造成30点伤害',
                visual: '蓝色闪电，从天而降',
                effect: 'lightning_single'
            },
            {
                level: 2,
                damage: 36,
                range: 5,
                lightnings: 1,
                chain: 2,
                cooldown: 750,
                description: '闪电可以连锁2个额外敌人',
                visual: '闪电击中后弹跳到附近敌人',
                effect: 'lightning_chain_2'
            },
            {
                level: 3,
                damage: 45,
                range: 6,
                lightnings: 2,
                chain: 2,
                cooldown: 700,
                description: '闪电数量+1，范围+1格，伤害提升',
                visual: '2道闪电同时劈下',
                effect: 'lightning_double'
            },
            {
                level: 4,
                damage: 54,
                range: 6,
                lightnings: 2,
                chain: 5,
                cooldown: 650,
                description: '连锁+3，范围扩大，伤害提升',
                visual: '连锁范围明显扩大，闪电更粗',
                effect: 'lightning_chain_5'
            },
            {
                level: 5,
                damage: 66,
                range: 8,
                lightnings: 3,
                chain: 5,
                cooldown: 600,
                description: '闪电+1，范围+2格，每次3道闪电',
                visual: '3道闪电密集劈下，范围覆盖大',
                effect: 'lightning_triple'
            },
            {
                level: 6,
                damage: 78,
                range: 8,
                lightnings: 3,
                chain: 8,
                cooldown: 550,
                description: '连锁+3，闪电麻痹敌人0.5秒',
                visual: '闪电带紫色麻痹光效，敌人眩晕',
                effect: 'lightning_paralyze'
            },
            {
                level: 7,
                damage: 93,
                range: 10,
                lightnings: 5,
                chain: 8,
                cooldown: 500,
                description: '闪电+2，范围+2格，5道闪电同时攻击',
                visual: '5道闪电同时劈下，雷声轰鸣',
                effect: 'lightning_penta'
            },
            {
                level: 8,
                damage: 111,
                range: 15,
                lightnings: 8,
                chain: 10,
                cooldown: 400,
                description: '满级！头顶形成雷暴云持续放电',
                visual: '玩家头顶巨大雷暴云，闪电不断落下',
                effect: 'thundercloud',
                evolution: {
                    requiredPassive: 'lightning_damage',
                    evolvedSkill: 'divine_thunderstorm',
                    evolvedName: '天罚雷暴'
                }
            }
        ],
        
        evolution: {
            id: 'divine_thunderstorm',
            name: '天罚雷暴',
            icon: '⚡⚡',
            rarity: 'mythic',
            damage: 200,
            range: 'fullscreen',
            lightningsPerSecond: 20,
            description: '全屏雷暴，每秒20道闪电，麻痹敌人2秒',
            visual: '全屏闪电风暴，玩家头顶巨型雷暴云跟随',
            effects: ['fullscreen', 'paralyze_2s', 'thundercloud_follows']
        }
    },
    
    // 3. 地狱火雨
    hellfire_rain: {
        id: 'hellfire_rain',
        name: '地狱火雨',
        icon: '🔥',
        type: 'aoe_projectile',
        rarity: 'legendary',
        description: '从天上掉落火球轰炸敌人，造成范围伤害',
        
        baseDamage: 40,
        baseRange: 3,
        baseCooldown: 2000,
        projectileCount: 3,
        
        damageFormula: '最终伤害 = 基础伤害 × 等级倍率 × (1 + 伤害加成%) × (1 + 火焰伤害%)',
        
        levels: [
            {
                level: 1,
                damage: 40,
                range: 3,
                projectiles: 3,
                cooldown: 2000,
                description: '每次掉落3个火球，爆炸范围3格',
                visual: '小型火球从天而降，橙色爆炸',
                effect: 'fireball_small'
            },
            {
                level: 2,
                damage: 48,
                range: 3,
                projectiles: 4,
                cooldown: 1900,
                description: '火球+1，爆炸伤害提升',
                visual: '火球稍大，爆炸范围扩大',
                effect: 'fireball_medium'
            },
            {
                level: 3,
                damage: 60,
                range: 4,
                projectiles: 5,
                cooldown: 1800,
                description: '火球+1，范围+1格，爆炸更剧烈',
                visual: '5个火球，爆炸产生冲击波',
                effect: 'fireball_explosion'
            },
            {
                level: 4,
                damage: 72,
                range: 4,
                projectiles: 6,
                cooldown: 1700,
                description: '火球+1，爆炸后留下火焰地面(2秒，每秒8伤害)',
                visual: '地面燃烧，持续伤害数字',
                effect: 'fire_ground'
            },
            {
                level: 5,
                damage: 88,
                range: 5,
                projectiles: 8,
                cooldown: 1600,
                description: '火球+2，范围+1，火焰地面伤害提升至12/秒',
                visual: '8个火球覆盖大范围，地面火焰更旺',
                effect: 'fire_ground_intense'
            },
            {
                level: 6,
                damage: 104,
                range: 5,
                projectiles: 10,
                cooldown: 1500,
                description: '火球+2，火焰地面持续3秒',
                visual: '火焰地面持续更久，红色区域明显',
                effect: 'fire_ground_long'
            },
            {
                level: 7,
                damage: 124,
                range: 6,
                projectiles: 12,
                cooldown: 1400,
                description: '火球+2，范围+1，爆炸击退敌人',
                visual: '火球爆炸产生冲击波击飞敌人',
                effect: 'fireball_knockback'
            },
            {
                level: 8,
                damage: 148,
                range: 7,
                projectiles: 15,
                cooldown: 1200,
                description: '满级！15个火球覆盖大范围',
                visual: '密集火球雨，地面全在燃烧',
                effect: 'meteor_rain',
                evolution: {
                    requiredPassive: 'duration',
                    evolvedSkill: 'meteor_disaster',
                    evolvedName: '陨石天灾'
                }
            }
        ],
        
        evolution: {
            id: 'meteor_disaster',
            name: '陨石天灾',
            icon: '🔥🔥',
            rarity: 'mythic',
            damage: 300,
            range: 10,
            projectiles: 30,
            description: '掉落陨石而不是火球，每个范围10格，击飞敌人',
            visual: '巨型陨石从天而降，全屏爆炸，熔岩区域',
            effects: ['meteor', 'knockback', 'lava_ground']
        }
    },
    
    // ==================== T1 强力技能 ====================
    
    // 4. 剑刃风暴
    blade_storm: {
        id: 'blade_storm',
        name: '剑刃风暴',
        icon: '🗡️',
        type: 'orbit',
        rarity: 'epic',
        description: '剑刃围绕玩家旋转，自动攻击接触的敌人',
        
        baseDamage: 20,
        baseRange: 2,
        baseCooldown: 0,
        bladeCount: 4,
        rotationSpeed: 1,
        
        damageFormula: '最终伤害 = 基础伤害 × 等级倍率 × (1 + 伤害加成%) × 击中次数',
        
        levels: [
            {
                level: 1,
                damage: 20,
                range: 2,
                blades: 4,
                rotationSpeed: 1,
                description: '4把剑围绕玩家旋转，每把造成20点伤害',
                visual: '4把剑缓慢旋转，蓝色光效',
                effect: 'swords_orbit'
            },
            {
                level: 2,
                damage: 24,
                range: 2.5,
                blades: 4,
                rotationSpeed: 1.2,
                description: '范围+0.5格，旋转速度+20%',
                visual: '剑旋转更快',
                effect: 'swords_fast'
            },
            {
                level: 3,
                damage: 30,
                range: 3,
                blades: 8,
                rotationSpeed: 1.2,
                description: '剑刃+4，范围+1，可以穿透敌人',
                visual: '8把剑，穿透效果',
                effect: 'swords_piercing'
            },
            {
                level: 4,
                damage: 36,
                range: 3.5,
                blades: 8,
                rotationSpeed: 1.4,
                description: '剑刃变大，范围+0.5格，旋转速度提升',
                visual: '剑刃明显变大',
                effect: 'swords_large'
            },
            {
                level: 5,
                damage: 44,
                range: 4,
                blades: 12,
                rotationSpeed: 1.4,
                description: '剑刃+4，范围+1，剑刃带毒(每秒5伤害，持续2秒)',
                visual: '12把剑带绿色毒光',
                effect: 'swords_poison'
            },
            {
                level: 6,
                damage: 52,
                range: 4.5,
                blades: 12,
                rotationSpeed: 1.6,
                description: '毒伤害提升至8/秒，持续3秒',
                visual: '毒光更明显，伤害数字跳动',
                effect: 'swords_poison_strong'
            },
            {
                level: 7,
                damage: 62,
                range: 5,
                blades: 16,
                rotationSpeed: 1.6,
                description: '剑刃+4，范围+1，形成剑刃风暴',
                visual: '16把剑形成密集风暴',
                effect: 'blade_storm'
            },
            {
                level: 8,
                damage: 74,
                range: 6,
                blades: 20,
                rotationSpeed: 1.8,
                description: '满级！20把剑，范围6格，高速旋转',
                visual: '20把剑高速旋转，剑刃风暴成型',
                effect: 'blade_storm_max',
                evolution: {
                    requiredPassive: 'projectile_count',
                    evolvedSkill: 'ten_thousand_swords',
                    evolvedName: '万剑归宗'
                }
            }
        ],
        
        evolution: {
            id: 'ten_thousand_swords',
            name: '万剑归宗',
            icon: '🗡️🗡️',
            rarity: 'mythic',
            damage: 100,
            bladeCount: 100,
            description: '100把剑形成剑阵，可手动释放集火',
            visual: '百把剑形成巨大剑阵，金光闪闪',
            effects: ['sword_array', 'manual_target', 'lifesteal']
        }
    },
    
    // 5. 爆裂飞弹
    explosive_missiles: {
        id: 'explosive_missiles',
        name: '爆裂飞弹',
        icon: '💥',
        type: 'homing_projectile',
        rarity: 'epic',
        description: '发射追踪飞弹，命中后爆炸',
        
        baseDamage: 35,
        baseRange: 10,
        baseCooldown: 1000,
        missileCount: 1,
        explosionRadius: 2,
        
        damageFormula: '最终伤害 = 基础伤害 × 等级倍率 × (1 + 伤害加成%) × 爆炸范围加成',
        
        levels: [
            {
                level: 1,
                damage: 35,
                missiles: 1,
                range: 10,
                explosionRadius: 2,
                cooldown: 1000,
                description: '发射1个追踪飞弹，爆炸范围2格',
                visual: '小型飞弹，橙色尾焰',
                effect: 'missile_single'
            },
            {
                level: 2,
                damage: 42,
                missiles: 2,
                range: 10,
                explosionRadius: 2,
                cooldown: 950,
                description: '飞弹+1，追踪速度+50%',
                visual: '2个飞弹同时发射',
                effect: 'missile_double'
            },
            {
                level: 3,
                damage: 53,
                missiles: 3,
                range: 12,
                explosionRadius: 3,
                cooldown: 900,
                description: '飞弹+1，范围+2格，爆炸范围+1',
                visual: '3个飞弹，爆炸更大',
                effect: 'missile_triple'
            },
            {
                level: 4,
                damage: 63,
                missiles: 3,
                range: 12,
                explosionRadius: 4,
                cooldown: 850,
                description: '爆炸范围+1，穿透+1',
                visual: '飞弹穿透敌人继续飞行',
                effect: 'missile_piercing'
            },
            {
                level: 5,
                damage: 77,
                missiles: 6,
                range: 14,
                explosionRadius: 5,
                cooldown: 800,
                description: '飞弹+3，范围+2，爆炸范围+1',
                visual: '6个飞弹密集发射',
                effect: 'missile_six'
            },
            {
                level: 6,
                damage: 91,
                missiles: 6,
                range: 14,
                explosionRadius: 6,
                cooldown: 750,
                description: '爆炸范围+1，穿透+2',
                visual: '爆炸范围巨大，穿透多个敌人',
                effect: 'missile_big_explosion'
            },
            {
                level: 7,
                damage: 109,
                missiles: 8,
                range: 16,
                explosionRadius: 7,
                cooldown: 700,
                description: '飞弹+2，范围+2，智能追踪必中',
                visual: '8个飞弹精准追踪',
                effect: 'missile_smart'
            },
            {
                level: 8,
                damage: 130,
                missiles: 10,
                range: 18,
                explosionRadius: 8,
                cooldown: 600,
                description: '满级！10个飞弹，智能追踪，穿透无限',
                visual: '10个飞弹全覆盖，爆炸不断',
                effect: 'missile_max',
                evolution: {
                    requiredPassive: 'explosion_radius',
                    evolvedSkill: 'nuke_missiles',
                    evolvedName: '核弹飞弹'
                }
            }
        ],
        
        evolution: {
            id: 'nuke_missiles',
            name: '核弹飞弹',
            icon: '💥💥',
            rarity: 'mythic',
            damage: 500,
            explosionRadius: 20,
            missiles: 20,
            description: '每发飞弹变成微型核弹，爆炸范围20格',
            visual: '飞弹变成核弹，蘑菇云升起，辐射区域',
            effects: ['nuke', 'radiation', 'massive_explosion']
        }
    },
    
    // 6. 黑洞吞噬
    black_hole: {
        id: 'black_hole',
        name: '黑洞吞噬',
        icon: '🌀',
        type: 'control_aoe',
        rarity: 'epic',
        description: '生成黑洞吸入敌人并造成伤害',
        
        baseDamage: 15,
        baseRange: 5,
        baseCooldown: 8000,
        duration: 3000,
        pullSpeed: 1,
        
        damageFormula: '最终伤害 = 基础伤害 × 每秒伤害次数 × 等级倍率 × (1 + 伤害加成%)',
        
        levels: [
            {
                level: 1,
                damage: 15,
                range: 5,
                duration: 3000,
                pullSpeed: 1,
                cooldown: 8000,
                description: '生成黑洞，范围5格，持续3秒，吸入敌人',
                visual: '小型黑色漩涡，紫色光效',
                effect: 'black_hole_small'
            },
            {
                level: 2,
                damage: 18,
                range: 8,
                duration: 4000,
                pullSpeed: 1.2,
                cooldown: 7500,
                description: '范围+3格，持续+1秒，吸入后爆炸(50伤害)',
                visual: '黑洞变大，爆炸效果',
                effect: 'black_hole_explode'
            },
            {
                level: 3,
                damage: 23,
                range: 10,
                duration: 5000,
                pullSpeed: 1.4,
                cooldown: 7000,
                description: '范围+2格，持续+1秒，爆炸伤害提升至80',
                visual: '黑洞更强，爆炸更大',
                effect: 'black_hole_big'
            },
            {
                level: 4,
                damage: 28,
                range: 12,
                duration: 6000,
                pullSpeed: 1.6,
                cooldown: 6500,
                description: '范围+2格，持续+1秒，可以吸入精英怪',
                visual: '黑洞吸力更强，精英怪被拉入',
                effect: 'black_hole_elite'
            },
            {
                level: 5,
                damage: 34,
                range: 12,
                duration: 7000,
                pullSpeed: 1.8,
                cooldown: 6000,
                description: '持续+1秒，爆炸伤害+200%',
                visual: '黑洞爆炸产生巨大冲击波',
                effect: 'black_hole_mega'
            },
            {
                level: 6,
                damage: 41,
                range: 15,
                duration: 8000,
                pullSpeed: 2,
                cooldown: 5500,
                description: '范围+3格，持续+1秒，可以吸入Boss',
                visual: '巨型黑洞，Boss也被吸入',
                effect: 'black_hole_boss'
            },
            {
                level: 7,
                damage: 50,
                range: 18,
                duration: 9000,
                pullSpeed: 2.2,
                cooldown: 5000,
                description: '范围+3格，黑洞可以缓慢移动',
                visual: '黑洞跟随玩家移动',
                effect: 'black_hole_move'
            },
            {
                level: 8,
                damage: 60,
                range: 20,
                duration: 10000,
                pullSpeed: 2.5,
                cooldown: 4500,
                description: '满级！范围20格，持续10秒，吞噬一切',
                visual: '超大黑洞，全屏可见',
                effect: 'black_hole_ultimate',
                evolution: {
                    requiredPassive: 'duration',
                    evolvedSkill: 'dimensional_rift',
                    evolvedName: '维度裂隙'
                }
            }
        ],
        
        evolution: {
            id: 'dimensional_rift',
            name: '维度裂隙',
            icon: '🌀🌀',
            rarity: 'mythic',
            damage: 100,
            holeCount: 3,
            description: '同时存在3个黑洞，产生引力波',
            visual: '3个黑洞互相旋转，引力波扭曲空间',
            effects: ['triple_hole', 'gravity_wave', 'space_rift']
        }
    }
};

// 导出技能数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SKILLS_DATA;
}

console.log('技能数据加载完成 - 15个割草技能');
