// ============================================
// 对象池系统 - 性能优化
// 用于复用频繁创建/销毁的对象，减少GC压力
// ============================================

class ObjectPool {
  constructor(createFunc, resetFunc, initialSize = 50) {
    this.createFunc = createFunc; // 创建新对象的函数
    this.resetFunc = resetFunc; // 重置对象的函数
    this.pool = []; // 空闲对象池
    this.active = []; // 活跃对象列表

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFunc());
    }
  }

  // 获取对象
  get() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFunc();
    }
    this.active.push(obj);
    return obj;
  }

  // 释放对象
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index !== -1) {
      this.active.splice(index, 1);
      this.resetFunc(obj);
      this.pool.push(obj);
    }
  }

  // 释放所有活跃对象
  releaseAll() {
    while (this.active.length > 0) {
      const obj = this.active.pop();
      this.resetFunc(obj);
      this.pool.push(obj);
    }
  }

  // 获取池状态
  getStatus() {
    return {
      poolSize: this.pool.length,
      activeSize: this.active.length,
      totalSize: this.pool.length + this.active.length,
    };
  }

  // 清理池（可选，用于内存管理）
  clear() {
    this.releaseAll();
    this.pool = [];
  }
}

// ============================================
// 敌人对象池
// ============================================

function createEnemy() {
  return {
    type: "",
    x: 0,
    y: 0,
    hp: 0,
    maxHp: 0,
    atk: 0,
    speed: 0,
    xp: 0,
    gold: 0,
    icon: "",
    size: 0,
    color: "",
    hitFlash: 0,
    isBoss: false,
    name: "",
  };
}

function resetEnemy(enemy) {
  enemy.type = "";
  enemy.x = 0;
  enemy.y = 0;
  enemy.hp = 0;
  enemy.maxHp = 0;
  enemy.atk = 0;
  enemy.speed = 0;
  enemy.xp = 0;
  enemy.gold = 0;
  enemy.icon = "";
  enemy.size = 0;
  enemy.color = "";
  enemy.hitFlash = 0;
  enemy.isBoss = false;
  enemy.name = "";
}

// 全局敌人对象池
let enemyPool = null;

function initEnemyPool(size = 300) {
  enemyPool = new ObjectPool(createEnemy, resetEnemy, size);
  console.log(`敌人对象池初始化: ${size} 个对象`);
}

function getEnemyFromPool() {
  if (!enemyPool) initEnemyPool();
  return enemyPool.get();
}

function releaseEnemyToPool(enemy) {
  if (!enemyPool) return;
  enemyPool.release(enemy);
}

function releaseAllEnemies() {
  if (!enemyPool) return;
  enemyPool.releaseAll();
}

// ============================================
// 投射物对象池
// ============================================

function createProjectile() {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    damage: 0,
    pierce: 0,
    range: 0,
    startX: 0,
    startY: 0,
    color: "",
    size: 0,
    explosive: false,
    explosionRadius: 0,
    isCritical: false,
  };
}

function resetProjectile(proj) {
  proj.x = 0;
  proj.y = 0;
  proj.vx = 0;
  proj.vy = 0;
  proj.damage = 0;
  proj.pierce = 0;
  proj.range = 0;
  proj.startX = 0;
  proj.startY = 0;
  proj.color = "";
  proj.size = 0;
  proj.explosive = false;
  proj.explosionRadius = 0;
  proj.isCritical = false;
}

let projectilePool = null;

function initProjectilePool(size = 200) {
  projectilePool = new ObjectPool(createProjectile, resetProjectile, size);
  console.log(`投射物对象池初始化: ${size} 个对象`);
}

function getProjectileFromPool() {
  if (!projectilePool) initProjectilePool();
  return projectilePool.get();
}

function releaseProjectileToPool(proj) {
  if (!projectilePool) return;
  projectilePool.release(proj);
}

function releaseAllProjectiles() {
  if (!projectilePool) return;
  projectilePool.releaseAll();
}

// ============================================
// 粒子对象池
// ============================================

function createParticle() {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0,
    color: "",
    size: 0,
  };
}

function resetParticle(particle) {
  particle.x = 0;
  particle.y = 0;
  particle.vx = 0;
  particle.vy = 0;
  particle.life = 0;
  particle.maxLife = 0;
  particle.color = "";
  particle.size = 0;
}

let particlePool = null;

function initParticlePool(size = 500) {
  particlePool = new ObjectPool(createParticle, resetParticle, size);
  console.log(`粒子对象池初始化: ${size} 个对象`);
}

function getParticleFromPool() {
  if (!particlePool) initParticlePool();
  return particlePool.get();
}

function releaseParticleToPool(particle) {
  if (!particlePool) return;
  particlePool.release(particle);
}

function releaseAllParticles() {
  if (!particlePool) return;
  particlePool.releaseAll();
}

// ============================================
// 浮动文字对象池
// ============================================

function createFloatingText() {
  return {
    x: 0,
    y: 0,
    text: "",
    color: "",
    life: 0,
    maxLife: 0,
    vy: 0,
  };
}

function resetFloatingText(ft) {
  ft.x = 0;
  ft.y = 0;
  ft.text = "";
  ft.color = "";
  ft.life = 0;
  ft.maxLife = 0;
  ft.vy = 0;
}

let floatingTextPool = null;

function initFloatingTextPool(size = 100) {
  floatingTextPool = new ObjectPool(
    createFloatingText,
    resetFloatingText,
    size,
  );
  console.log(`浮动文字对象池初始化: ${size} 个对象`);
}

function getFloatingTextFromPool() {
  if (!floatingTextPool) initFloatingTextPool();
  return floatingTextPool.get();
}

function releaseFloatingTextToPool(ft) {
  if (!floatingTextPool) return;
  floatingTextPool.release(ft);
}

function releaseAllFloatingTexts() {
  if (!floatingTextPool) return;
  floatingTextPool.releaseAll();
}

// ============================================
// 闪电效果对象池
// ============================================

function createLightning() {
  return {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    life: 0,
  };
}

function resetLightning(lightning) {
  lightning.x1 = 0;
  lightning.y1 = 0;
  lightning.x2 = 0;
  lightning.y2 = 0;
  lightning.life = 0;
}

let lightningPool = null;

function initLightningPool(size = 50) {
  lightningPool = new ObjectPool(createLightning, resetLightning, size);
  console.log(`闪电效果对象池初始化: ${size} 个对象`);
}

function getLightningFromPool() {
  if (!lightningPool) initLightningPool();
  return lightningPool.get();
}

function releaseLightningToPool(lightning) {
  if (!lightningPool) return;
  lightningPool.release(lightning);
}

function releaseAllLightnings() {
  if (!lightningPool) return;
  lightningPool.releaseAll();
}

// ============================================
// 旋风效果对象池
// ============================================

function createWhirlwind() {
  return {
    x: 0,
    y: 0,
    radius: 0,
    life: 0,
    maxLife: 0,
    angle: 0,
  };
}

function resetWhirlwind(whirlwind) {
  whirlwind.x = 0;
  whirlwind.y = 0;
  whirlwind.radius = 0;
  whirlwind.life = 0;
  whirlwind.maxLife = 0;
  whirlwind.angle = 0;
}

let whirlwindPool = null;

function initWhirlwindPool(size = 20) {
  whirlwindPool = new ObjectPool(createWhirlwind, resetWhirlwind, size);
  console.log(`旋风效果对象池初始化: ${size} 个对象`);
}

function getWhirlwindFromPool() {
  if (!whirlwindPool) initWhirlwindPool();
  return whirlwindPool.get();
}

function releaseWhirlwindToPool(whirlwind) {
  if (!whirlwindPool) return;
  whirlwindPool.release(whirlwind);
}

function releaseAllWhirlwinds() {
  if (!whirlwindPool) return;
  whirlwindPool.releaseAll();
}

// ============================================
// 初始化和清理
// ============================================

function initAllPools() {
  initEnemyPool(300);
  initProjectilePool(200);
  initParticlePool(500);
  initFloatingTextPool(100);
  initLightningPool(50);
  initWhirlwindPool(20);
  console.log("所有对象池初始化完成");
}

function clearAllPools() {
  if (enemyPool) enemyPool.clear();
  if (projectilePool) projectilePool.clear();
  if (particlePool) particlePool.clear();
  if (floatingTextPool) floatingTextPool.clear();
  if (lightningPool) lightningPool.clear();
  if (whirlwindPool) whirlwindPool.clear();
  console.log("所有对象池已清理");
}

function getAllPoolsStatus() {
  return {
    enemy: enemyPool ? enemyPool.getStatus() : null,
    projectile: projectilePool ? projectilePool.getStatus() : null,
    particle: particlePool ? particlePool.getStatus() : null,
    floatingText: floatingTextPool ? floatingTextPool.getStatus() : null,
    lightning: lightningPool ? lightningPool.getStatus() : null,
    whirlwind: whirlwindPool ? whirlwindPool.getStatus() : null,
  };
}
