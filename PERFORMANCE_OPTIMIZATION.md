# 性能优化指南 - 对象池系统

## ✅ 已完成的优化

### 1. 对象池系统创建

- ✅ 创建了 `object-pool.js` 文件
- ✅ 实现了通用 ObjectPool 类
- ✅ 创建了6个专业对象池：
  - 敌人对象池 (300个对象)
  - 投射物对象池 (200个对象)
  - 粒子对象池 (500个对象)
  - 浮动文字对象池 (100个对象)
  - 闪电效果对象池 (50个对象)
  - 旋风效果对象池 (20个对象)

### 2. 已集成的部分

- ✅ 在 `index.html` 中引入 `object-pool.js`
- ✅ 在 `startGame()` 中初始化对象池
- ✅ `spawnEnemies()` 使用对象池创建敌人
- ✅ `spawnBoss()` 使用对象池创建Boss
- ✅ `killEnemy()` 释放敌人回对象池

## 📝 待完成的优化

### 投射物对象池集成

需要修改 `useSkill()` 函数中的投射物创建：

**位置1** - 霰弹枪散射 (约1033-1049行)

```javascript
// 修改前
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

// 修改后
const proj = getProjectileFromPool();
proj.x = p.x;
proj.y = p.y;
proj.vx = Math.cos(angle) * skill.speed;
proj.vy = Math.sin(angle) * skill.speed;
proj.damage = result.damage;
proj.pierce = pierce;
proj.range = skill.range;
proj.startX = p.x;
proj.startY = p.y;
proj.color = "#ff6600";
proj.size = 0.3;
proj.explosive = false;
proj.explosionRadius = 0;
proj.isCritical = result.isCritical;
gameState.projectiles.push(proj);
```

**位置2** - 其他远程技能 (约1063-1075行)
同样修改为使用 `getProjectileFromPool()`

**位置3** - 在 `updateEntities()` 中释放投射物

```javascript
// 当投射物消失时
releaseProjectileToPool(proj);
```

### 粒子对象池集成

修改 `spawnParticles()` 函数：

```javascript
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
```

修改 `updateEffects()` 释放粒子：

```javascript
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
  return true;
});
```

### 浮动文字对象池

修改 `addFloatingText()` 函数：

```javascript
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
```

### 闪电效果对象池

修改 `useSkill()` 中的闪电链部分：

```javascript
gameState.lightnings.push({
  x1: lx,
  y1: ly,
  x2: t.x,
  y2: t.y,
  life: 12,
});
// 改为
const lightning = getLightningFromPool();
lightning.x1 = lx;
lightning.y1 = ly;
lightning.x2 = t.x;
lightning.y2 = t.y;
lightning.life = 12;
gameState.lightnings.push(lightning);
```

### 旋风效果对象池

修改 `useSkill()` 中的旋风斩部分：

```javascript
const whirlwindData = {
  x: p.x,
  y: p.y,
  radius: skill.range,
  life: 500,
  maxLife: 500,
  angle: 0,
};
// 改为
const whirlwind = getWhirlwindFromPool();
whirlwind.x = p.x;
whirlwind.y = p.y;
whirlwind.radius = skill.range;
whirlwind.life = 500;
whirlwind.maxLife = 500;
whirlwind.angle = 0;
gameState.whirlwinds.push(whirlwind);
```

## 🎯 性能提升预期

完成所有优化后，预期性能提升：

1. **减少GC压力** - 90%以上的对象创建/销毁将被对象池接管
2. **帧率提升** - 在敌人数量多时（200+），帧率提升30-50%
3. **内存稳定** - 内存使用更加平稳，不会出现尖峰
4. **流畅度提升** - 减少卡顿现象，游戏更流畅

## 📊 对象池监控

可以通过以下代码查看对象池状态：

```javascript
console.log(getAllPoolsStatus());
```

输出示例：

```javascript
{
  enemy: { poolSize: 150, activeSize: 120, totalSize: 270 },
  projectile: { poolSize: 80, activeSize: 45, totalSize: 125 },
  particle: { poolSize: 300, activeSize: 150, totalSize: 450 },
  // ...
}
```

## ⚠️ 注意事项

1. **对象池大小** - 根据实际需要调整初始大小
2. **重置函数** - 确保reset函数完全重置所有属性
3. **内存管理** - 游戏结束时调用 `clearAllPools()` 释放内存
4. **调试模式** - 可以添加统计信息监控对象池命中率

## 🚀 后续优化建议

1. **渲染优化**
   - 使用离屏Canvas渲染静态元素
   - 实现视锥裁剪（只渲染屏幕内的对象）
   - 批量渲染相同类型的对象

2. **空间分区**
   - 实现四叉树或网格分区
   - 优化敌人搜索和碰撞检测
   - 减少O(n²)的遍历操作

3. **事件优化**
   - UI更新降频（从每帧改为每100ms）
   - 使用防抖和节流
   - 减少DOM操作

4. **资源预加载**
   - 预加载常用资源
   - 使用Web Workers处理复杂计算
   - 实现资源懒加载
