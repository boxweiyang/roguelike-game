// ============================================
// 技能管理系统 - 集成新技能系统到游戏
// ============================================

class SkillManager {
  constructor() {
    this.playerSkills = {}; // 玩家当前拥有的技能 {skillId: {level, data}}
    this.passiveItems = {}; // 玩家当前拥有的被动道具
    this.skillEffects = null; // 特效渲染器
    this.skillCooldowns = {}; // 技能冷却
    this.projectiles = []; // 投射物
    this.orbitals = []; // 环绕物
    this.mines = []; // 地雷
  }

  // 初始化技能管理器
  init(canvas, ctx) {
    this.skillEffects = new SkillEffectRenderer(canvas, ctx);
    console.log("技能管理系统初始化完成");
  }

  // 给玩家添加技能
  addSkill(skillId) {
    if (SKILLS_DATA[skillId]) {
      if (!this.playerSkills[skillId]) {
        this.playerSkills[skillId] = {
          level: 1,
          data: SKILLS_DATA[skillId],
          lastUseTime: 0,
        };

        // 同时也添加到gameState.player.skills
        if (gameState && gameState.player) {
          const existingSkill = gameState.player.skills.find(
            (s) => s.id === skillId,
          );
          if (!existingSkill) {
            gameState.player.skills.push({
              id: skillId,
              name: SKILLS_DATA[skillId].name,
              icon: SKILLS_DATA[skillId].icon,
              type: SKILLS_DATA[skillId].type,
              level: 1,
              timer: 0,
              data: SKILLS_DATA[skillId],
              lastUseTime: 0,
            });
          }
        }

        // 记录到图鉴
        if (skillEncyclopedia) {
          skillEncyclopedia.discoverSkill(skillId);
        }

        return true;
      }
    }
    return false;
  }

  // 升级技能
  upgradeSkill(skillId) {
    if (this.playerSkills[skillId]) {
      const skill = this.playerSkills[skillId];
      if (skill.level < 8) {
        skill.level++;
        return true;
      }
    }
    return false;
  }

  // 添加被动道具
  addPassiveItem(passiveId) {
    if (PASSIVE_ITEMS[passiveId]) {
      if (!this.passiveItems[passiveId]) {
        this.passiveItems[passiveId] = {
          data: PASSIVE_ITEMS[passiveId],
        };

        // 记录到图鉴
        if (skillEncyclopedia) {
          skillEncyclopedia.discoverPassive(passiveId);
        }

        return true;
      }
    }
    return false;
  }

  // 检查是否可以进化
  canEvolve(skillId) {
    const skill = this.playerSkills[skillId];
    if (!skill || skill.level < 8) return false;

    const skillData = skill.data;
    if (!skillData.evolution) return false;

    const requiredPassive = skillData.evolution.requiredPassive;
    return this.passiveItems[requiredPassive] !== undefined;
  }

  // 执行技能进化
  evolveSkill(skillId) {
    if (!this.canEvolve(skillId)) return false;

    const skill = this.playerSkills[skillId];
    const evolution = skill.data.evolution;

    // 解锁进化配方到图鉴
    if (skillEncyclopedia) {
      skillEncyclopedia.unlockEvolution(
        skillId,
        skill.data.evolution.requiredPassive,
        evolution.id,
      );
    }

    // 替换为进化技能
    delete this.playerSkills[skillId];
    this.playerSkills[evolution.id] = {
      level: 1,
      data: {
        id: evolution.id,
        name: evolution.name,
        icon: evolution.icon,
        type: "evolved",
        rarity: "mythic",
        ...evolution,
      },
      lastUseTime: 0,
      evolved: true,
    };

    return true;
  }

  // 更新所有技能（每帧调用）
  update(player, enemies) {
    if (!this.skillEffects) {
      console.warn("skillManager: skillEffects未初始化");
      return;
    }
    if (!player || !player.skills) {
      console.warn("skillManager: player或player.skills不存在");
      return;
    }

    this.skillEffects.update();

    const now = Date.now();

    // 更新技能冷却和使用 - 遍历gameState.player.skills
    player.skills.forEach((skill) => {
      // 确保技能有data属性
      if (!skill.data) {
        skill.data = SKILLS_DATA[skill.id];
      }

      const skillData = skill.data;
      if (!skillData) {
        console.warn("skillManager: 技能", skill.id, "缺少data");
        return;
      }

      const cooldown = this.getSkillCooldown(skillData);
      const timeSinceLastUse = now - (skill.lastUseTime || 0);

      // 调试日志（只在首次或就绪时打印）
      if (!skill._logged) {
        console.log(
          "skillManager: 技能",
          skill.id,
          "| 冷却:",
          cooldown,
          "| 上次使用:",
          skill.lastUseTime,
          "| 经过时间:",
          timeSinceLastUse,
          "| 就绪:",
          timeSinceLastUse >= cooldown,
        );
        skill._logged = true;
      }

      if (timeSinceLastUse >= cooldown) {
        console.log("skillManager: 执行技能", skill.id, "等级", skill.level);
        skill.lastUseTime = now;
        this.useSkill(skill, player, enemies);
      }
    });

    // 更新投射物
    this.updateProjectiles(enemies);

    // 更新环绕物
    this.updateOrbitals(player, enemies);

    // 更新地雷
    this.updateMines(enemies);
  }

  // 获取技能冷却时间（应用被动加成）
  getSkillCooldown(skillData) {
    let cooldown = skillData.baseCooldown || skillData.cooldown || 1000;

    // 应用冷却缩减
    if (this.passiveItems["cooldown_reduction"]) {
      cooldown *=
        1 -
        this.passiveItems["cooldown_reduction"].data.effect.cooldownReduction;
    }

    if (this.passiveItems["attack_speed"]) {
      cooldown *=
        1 - this.passiveItems["attack_speed"].data.effect.cooldownReduction;
    }

    return Math.max(100, cooldown);
  }

  // 使用技能
  useSkill(skill, player, enemies) {
    const skillData = skill.data;
    const level = skill.level;
    const levelData = skillData.levels ? skillData.levels[level - 1] : null;

    console.log(
      "useSkill: 技能=",
      skill.id,
      "等级=",
      level,
      "类型=",
      skillData.type,
    );
    console.log("useSkill: levelData=", levelData);

    if (!levelData) {
      console.warn(
        "useSkill: 没有levelData，技能id=",
        skill.id,
        "等级=",
        level,
      );
      return;
    }

    const baseDamage = levelData.damage || skillData.baseDamage || 0;
    const finalDamage = this.calculateDamage(baseDamage, skillData.type);

    console.log(
      "useSkill: baseDamage=",
      baseDamage,
      "finalDamage=",
      finalDamage,
    );

    switch (skillData.type) {
      case "melee_aoe":
        console.log("useSkill: 执行melee_aoe");
        this.executeMeleeAOE(player, enemies, levelData, finalDamage);
        break;
      case "auto_aoe":
        this.executeAutoAOE(player, enemies, levelData, finalDamage);
        break;
      case "aoe_projectile":
        this.executeAOEProjectile(player, enemies, levelData, finalDamage);
        break;
      case "orbit":
        this.executeOrbit(player, enemies, levelData, finalDamage);
        break;
      case "homing_projectile":
        this.executeHomingProjectile(player, enemies, levelData, finalDamage);
        break;
      case "control_aoe":
        this.executeControlAOE(player, enemies, levelData, finalDamage);
        break;
      case "ranged_single":
        this.executeRangedSingle(player, enemies, levelData, finalDamage);
        break;
      case "aoe_control":
        this.executeAOEControl(player, enemies, levelData, finalDamage);
        break;
      case "dot_aoe":
        this.executeDotAOE(player, enemies, levelData, finalDamage);
        break;
      case "defense":
        this.executeDefense(player, enemies, levelData, finalDamage);
        break;
      case "sustain":
        this.executeSustain(player, enemies, levelData, finalDamage);
        break;
      case "random_aoe":
        this.executeRandomAOE(player, enemies, levelData, finalDamage);
        break;
      case "random_buff":
        this.executeRandomBuff(player, enemies, levelData, finalDamage);
        break;
      case "summon":
        this.executeSummon(player, enemies, levelData, finalDamage);
        break;
      case "passive_trigger":
        this.executePassiveTrigger(player, enemies, levelData, finalDamage);
        break;
    }
  }

  // 伤害计算
  calculateDamage(baseDamage, skillType) {
    let damage = baseDamage;

    // 伤害加成
    if (this.passiveItems["damage_boost"]) {
      damage *= 1 + this.passiveItems["damage_boost"].data.effect.damage;
    }

    // 元素加成
    if (skillType.includes("fire") && this.passiveItems["fire_damage"]) {
      damage *= 1 + this.passiveItems["fire_damage"].data.effect.fireDamage;
    }
    if (
      skillType.includes("lightning") &&
      this.passiveItems["lightning_damage"]
    ) {
      damage *=
        1 + this.passiveItems["lightning_damage"].data.effect.lightningDamage;
    }
    if (skillType.includes("frost") && this.passiveItems["frost_damage"]) {
      damage *= 1 + this.passiveItems["frost_damage"].data.effect.frostDamage;
    }

    return Math.floor(damage);
  }

  // 执行近战AOE（如死亡旋风）
  executeMeleeAOE(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE; // 转换为像素
    const bladeCount = levelData.blades || 4;

    // 玩家位置转换为像素坐标
    const pixelX = player.x * CONFIG.TILE_SIZE;
    const pixelY = player.y * CONFIG.TILE_SIZE;

    // 创建旋风特效 - 添加player引用以便跟随
    if (this.skillEffects) {
      // 清除旧的whirlwind特效，避免叠加
      this.skillEffects.effects = this.skillEffects.effects.filter(
        (e) => e.type !== "whirlwind",
      );

      this.skillEffects.createWhirlwind(
        pixelX,
        pixelY,
        range,
        bladeCount,
        2000,
        player, // 传入player引用
        'death_whirlwind' // 传入skillId用于颜色
      );
    }

    // 对范围内敌人造成伤害
    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist <= levelData.range) {
        this.dealDamage(enemy, damage);
      }
    });
  }

  // 执行自动AOE（如雷暴领域）
  executeAutoAOE(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE;
    const lightningCount = levelData.lightnings || 1;

    // 选择最近的敌人
    const targets = this.findNearestEnemies(
      player,
      enemies,
      lightningCount,
      range,
    );

    targets.forEach((target) => {
      // 创建闪电特效（转换为像素坐标）
      if (this.skillEffects) {
        const colors = SKILL_COLORS.thunderstorm;
        this.skillEffects.createLightning(
          player.x * CONFIG.TILE_SIZE,
          player.y * CONFIG.TILE_SIZE - 30,
          target.x * CONFIG.TILE_SIZE,
          target.y * CONFIG.TILE_SIZE,
          colors.primary,
          3,
        );
      }

      this.dealDamage(target, damage);
    });
  }

  // 执行AOE投射物（如地狱火雨）
  executeAOEProjectile(player, enemies, levelData, damage) {
    const count = levelData.projectiles || 3;
    const range = levelData.range * CONFIG.TILE_SIZE;

    for (let i = 0; i < count; i++) {
      // 随机选择目标位置（像素坐标）
      const playerPixelX = player.x * CONFIG.TILE_SIZE;
      const playerPixelY = player.y * CONFIG.TILE_SIZE;
      const targetX = playerPixelX + (Math.random() - 0.5) * range * 2;
      const targetY = playerPixelY + (Math.random() - 0.5) * range * 2;

      // 添加投射物
      this.projectiles.push({
        x: playerPixelX,
        y: playerPixelY - 100,
        targetX: targetX,
        targetY: targetY,
        damage: damage,
        type: "fireball",
        skillId: 'hellfire_rain', // 用于颜色
        speed: 5,
        range: range * 0.6,
      });
    }
  }

  // 执行环绕物（如剑刃风暴）
  executeOrbit(player, enemies, levelData, damage) {
    const bladeCount = levelData.blades || 4;
    const range = levelData.range * CONFIG.TILE_SIZE;

    // 清空旧环绕物
    this.orbitals = [];

    // 创建新环绕物
    for (let i = 0; i < bladeCount; i++) {
      this.orbitals.push({
        angle: (Math.PI * 2 * i) / bladeCount,
        radius: range,
        damage: damage,
        speed: 0.05,
        skillId: 'blade_storm', // 用于颜色
        lastHit: new Set(),
      });
    }
  }

  // 执行追踪投射物（如爆裂飞弹）
  executeHomingProjectile(player, enemies, levelData, damage) {
    const count = levelData.missiles || 1;
    const range = levelData.range * CONFIG.TILE_SIZE;

    const targets = this.findNearestEnemies(player, enemies, count, range);

    targets.forEach((target) => {
      this.projectiles.push({
        x: player.x * CONFIG.TILE_SIZE,
        y: player.y * CONFIG.TILE_SIZE,
        target: target,
        damage: damage,
        type: "missile",
        skillId: 'explosive_missiles', // 用于颜色
        speed: 4,
        homing: true,
        explosionRadius: levelData.explosionRadius * CONFIG.TILE_SIZE || 100,
      });
    });
  }

  // 执行控制AOE（如黑洞）
  executeControlAOE(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE;
    const duration = levelData.duration || 5000;

    // 清除旧黑洞特效
    if (this.skillEffects) {
      this.skillEffects.effects = this.skillEffects.effects.filter(
        (e) => e.type !== "black_hole",
      );

      this.skillEffects.createBlackHole(
        player.x * CONFIG.TILE_SIZE,
        player.y * CONFIG.TILE_SIZE,
        range,
        duration,
      );
    }

    // 对范围内敌人造成伤害并拉向中心
    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist <= levelData.range) {
        this.dealDamage(enemy, damage);
        // 拉向黑洞中心
        enemy.x += (player.x - enemy.x) * 0.02;
        enemy.y += (player.y - enemy.y) * 0.02;
      }
    });
  }

  // 执行远程单体（如狙击）
  executeRangedSingle(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE;

    const target = this.findNearestEnemy(player, enemies, range);
    if (!target) return;

    this.projectiles.push({
      x: player.x * CONFIG.TILE_SIZE,
      y: player.y * CONFIG.TILE_SIZE,
      targetX: target.x * CONFIG.TILE_SIZE,
      targetY: target.y * CONFIG.TILE_SIZE,
      damage: damage,
      type: "bullet",
      skillId: 'sniper_shot', // 用于颜色
      speed: 15,
      pierce: levelData.pierce || 0,
      critChance: levelData.critChance || 0,
    });
  }

  // 执行AOE控制（如冰霜新星）
  executeAOEControl(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE;

    // 清除旧冰霜特效
    if (this.skillEffects) {
      this.skillEffects.effects = this.skillEffects.effects.filter(
        (e) => e.type !== "frost",
      );

      this.skillEffects.createFrostEffect(
        player.x * CONFIG.TILE_SIZE,
        player.y * CONFIG.TILE_SIZE,
        range,
      );
    }

    // 对范围内敌人造成伤害并减速
    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist <= levelData.range) {
        this.dealDamage(enemy, damage);
        enemy.slowed = true;
        enemy.slowDuration = levelData.freezeDuration || 2000;
      }
    });
  }

  // 执行持续AOE（如死亡之握）
  executeDotAOE(player, enemies, levelData, damage) {
    const range = levelData.range * CONFIG.TILE_SIZE;
    const duration = levelData.duration || 3000;

    // 清除旧特效
    if (this.skillEffects) {
      this.skillEffects.effects = this.skillEffects.effects.filter(
        (e) => e.type !== "fire",
      );

      // 创建黑暗能量场
      this.skillEffects.createFireEffect(
        player.x * CONFIG.TILE_SIZE,
        player.y * CONFIG.TILE_SIZE,
        range,
        duration,
        "#8b00ff",
      );
    }

    // 对范围内敌人造成持续伤害
    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist <= levelData.range) {
        this.dealDamage(enemy, damage);
        // 吸血效果
        if (player.hp < player.maxHp) {
          player.hp = Math.min(player.maxHp, player.hp + damage * 0.3);
        }
      }
    });
  }

  // 执行防御技能（如神圣护盾）
  executeDefense(player, enemies, levelData, damage) {
    const range = levelData.shieldRange * CONFIG.TILE_SIZE || 100;
    const duration = levelData.duration || 5000;

    // 创建护盾特效
    if (this.skillEffects) {
      this.skillEffects.createShield(
        player.x * CONFIG.TILE_SIZE,
        player.y * CONFIG.TILE_SIZE,
        range,
        "#ffd700",
      );
    }

    // 添加护盾状态
    player.shield = (player.shield || 0) + levelData.shieldAmount || 50;
    player.shieldDuration = duration;
  }

  // 执行持续恢复（如生命汲取）
  executeSustain(player, enemies, levelData, damage) {
    const healAmount = levelData.healAmount || 10;

    // 恢复生命
    if (player.hp < player.maxHp) {
      player.hp = Math.min(player.maxHp, player.hp + healAmount);
    }

    // 对范围内敌人造成伤害并吸血
    const range = levelData.range * CONFIG.TILE_SIZE;
    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist <= levelData.range) {
        this.dealDamage(enemy, damage);
        // 额外吸血
        if (player.hp < player.maxHp) {
          player.hp = Math.min(player.maxHp, player.hp + damage * 0.2);
        }
      }
    });
  }

  // 执行随机AOE（如星辰坠落）
  executeRandomAOE(player, enemies, levelData, damage) {
    const count = levelData.stars || 5;
    const range = levelData.range * CONFIG.TILE_SIZE;

    for (let i = 0; i < count; i++) {
      // 随机选择目标位置
      const targetX =
        player.x * CONFIG.TILE_SIZE + (Math.random() - 0.5) * range * 2;
      const targetY =
        player.y * CONFIG.TILE_SIZE + (Math.random() - 0.5) * range * 2;

      // 添加投射物（星辰）
      this.projectiles.push({
        x: targetX,
        y: player.y * CONFIG.TILE_SIZE - 200,
        targetX: targetX,
        targetY: targetY,
        damage: damage,
        type: "star",
        skillId: 'starfall', // 用于颜色
        speed: 6,
        range: 80,
      });
    }
  }

  // 执行随机增益（如幸运轮盘）
  executeRandomBuff(player, enemies, levelData, damage) {
    // 随机选择一个增益效果
    const buffs = [
      "damage_boost",
      "speed_boost",
      "defense_boost",
      "cooldown_reduction",
    ];
    const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];

    // 应用增益
    if (!player.buffs) player.buffs = {};
    player.buffs[randomBuff] = {
      duration: levelData.duration || 5000,
      value: levelData.buffValue || 0.2,
    };

    // 创建特效
    if (this.skillEffects) {
      this.skillEffects.createExplosion(
        player.x * CONFIG.TILE_SIZE,
        player.y * CONFIG.TILE_SIZE,
        "#ffff00",
        15,
        4,
        2,
      );
    }
  }

  // 执行召唤（如镜像分身）
  executeSummon(player, enemies, levelData, damage) {
    const count = levelData.clones || 1;
    const duration = levelData.duration || 10000;

    // 创建分身特效
    if (this.skillEffects) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const dist = 100;
        const cloneX = player.x * CONFIG.TILE_SIZE + Math.cos(angle) * dist;
        const cloneY = player.y * CONFIG.TILE_SIZE + Math.sin(angle) * dist;

        this.skillEffects.createExplosion(cloneX, cloneY, "#00ffff", 10, 3, 2);
      }
    }

    // 注意：实际的分身逻辑需要在game.js中实现
    // 这里只负责特效
  }

  // 执行被动触发（如连锁爆炸）
  executePassiveTrigger(player, enemies, levelData, damage) {
    // 这个技能由敌人死亡时触发
    // 在dealDamage函数中处理
    // 这里创建爆炸特效
    if (this.skillEffects && enemies.length > 0) {
      // 对最近的敌人造成爆炸伤害
      const target = this.findNearestEnemy(
        player,
        enemies,
        levelData.range * CONFIG.TILE_SIZE,
      );
      if (target) {
        this.skillEffects.createExplosion(
          target.x * CONFIG.TILE_SIZE,
          target.y * CONFIG.TILE_SIZE,
          "#ff6600",
          20,
          6,
          3,
        );
        this.dealDamage(target, damage);
      }
    }
  }

  // 更新投射物
  updateProjectiles(enemies) {
    this.projectiles = this.projectiles.filter((proj) => {
      if (proj.homing && proj.target) {
        // 追踪投射物
        const dx = proj.target.x - proj.x;
        const dy = proj.target.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.speed) {
          // 命中
          this.dealDamage(proj.target, proj.damage);
          this.createExplosionEffect(
            proj.target.x,
            proj.target.y,
            proj.explosionRadius,
          );
          return false;
        }

        proj.x += (dx / dist) * proj.speed;
        proj.y += (dy / dist) * proj.speed;
      } else {
        // 直线投射物
        const dx = proj.targetX - proj.x;
        const dy = proj.targetY - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.speed) {
          // 到达目标位置，爆炸
          this.createExplosionEffect(proj.x, proj.y, proj.range);

          // 对范围内敌人造成伤害
          enemies.forEach((enemy) => {
            const enemyDist = Math.sqrt(
              Math.pow(enemy.x - proj.x, 2) + Math.pow(enemy.y - proj.y, 2),
            );

            if (enemyDist <= proj.range) {
              this.dealDamage(enemy, proj.damage);
            }
          });

          return false;
        }

        proj.x += (dx / dist) * proj.speed;
        proj.y += (dy / dist) * proj.speed;
      }

      return true;
    });
  }

  // 更新环绕物
  updateOrbitals(player, enemies) {
    this.orbitals.forEach((orb) => {
      orb.angle += orb.speed;

      const orbX = player.x + Math.cos(orb.angle) * orb.radius;
      const orbY = player.y + Math.sin(orb.angle) * orb.radius;

      // 检测碰撞
      enemies.forEach((enemy) => {
        if (orb.lastHit.has(enemy)) return;

        const dist = Math.sqrt(
          Math.pow(enemy.x - orbX, 2) + Math.pow(enemy.y - orbY, 2),
        );

        if (dist < 30) {
          this.dealDamage(enemy, orb.damage);
          orb.lastHit.add(enemy);

          // 创建刀刃特效
          if (this.skillEffects) {
            this.skillEffects.createTrail(
              orbX - 10,
              orbY,
              orbX + 10,
              orbY,
              "#00ff00",
              2,
            );
          }
        }
      });
    });
  }

  // 更新地雷
  updateMines(enemies) {
    // TODO: 实现地雷逻辑
  }

  // 查找最近敌人
  findNearestEnemy(player, enemies, maxRange) {
    let nearest = null;
    let minDist = maxRange;

    enemies.forEach((enemy) => {
      const dist = Math.sqrt(
        Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
      );

      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    });

    return nearest;
  }

  // 查找最近的多个敌人
  findNearestEnemies(player, enemies, count, maxRange) {
    const enemiesWithDist = enemies
      .map((enemy) => ({
        enemy,
        dist: Math.sqrt(
          Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2),
        ),
      }))
      .filter((e) => e.dist <= maxRange);

    enemiesWithDist.sort((a, b) => a.dist - b.dist);

    return enemiesWithDist.slice(0, count).map((e) => e.enemy);
  }

  // 造成伤害
  dealDamage(enemy, damage) {
    if (!enemy || enemy.hp <= 0) return;

    enemy.hp -= damage;
    enemy.lastHitTime = Date.now();

    // 创建伤害飘字
    if (this.skillEffects) {
      this.skillEffects.createFloatingText(
        enemy.x,
        enemy.y - 20,
        damage.toString(),
        "#ff0000",
        18,
      );
    }

    // 检查是否死亡
    if (enemy.hp <= 0) {
      if (typeof killEnemy === "function") {
        killEnemy(enemy);
      }
    }
  }

  // 创建爆炸特效
  createExplosionEffect(x, y, radius) {
    if (this.skillEffects) {
      this.skillEffects.createExplosion(x, y, "#ff6600", 20, 5, 3);
      this.skillEffects.createFireEffect(x, y, radius, 1000);
    }
  }

  // 渲染所有特效
  render() {
    if (this.skillEffects) {
      this.skillEffects.render();
    }

    // 渲染投射物
    this.projectiles.forEach((proj) => {
      switch (proj.type) {
        case "fireball":
          ctx.fillStyle = "#ff6600";
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "missile":
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "bullet":
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(proj.x, proj.y);
          ctx.lineTo(proj.x - 10, proj.y);
          ctx.stroke();
          break;
      }
    });

    // 渲染环绕物
    if (gameState.player) {
      const player = gameState.player;
      this.orbitals.forEach((orb) => {
        const orbX = player.x + Math.cos(orb.angle) * orb.radius;
        const orbY = player.y + Math.sin(orb.angle) * orb.radius;

        ctx.fillStyle = "#00ff00";
        ctx.beginPath();
        ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // 获取玩家技能列表（用于UI显示）
  getPlayerSkills() {
    return Object.entries(this.playerSkills).map(([id, skill]) => ({
      id: id,
      name: skill.data.name,
      icon: skill.data.icon,
      level: skill.level,
      maxLevel: 8,
      canEvolve: this.canEvolve(id),
      evolution: skill.data.evolution || null,
    }));
  }
}

// 创建全局实例
const skillManager = new SkillManager();
window.skillManager = skillManager;

console.log("技能管理系统加载完成");
