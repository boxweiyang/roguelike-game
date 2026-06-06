# 代码重构指南 - 模块化架构

## ✅ 已完成的重构

### 1. 渲染系统模块化
- ✅ 创建 `renderer.js` (410行)
- ✅ 实现独立的渲染逻辑
- ✅ 支持所有游戏对象的渲染
- ✅ 在gameLoop中集成新的渲染系统

## 📝 待完成的重构任务

### 2. 删除game.js中的旧渲染代码

**目标**: 从game.js中删除约800-1000行渲染代码

**需要删除的函数**（在game.js中查找并删除）:
```javascript
function render() { ... }                    // 主渲染函数
function renderGrid() { ... }                // 网格渲染
function renderPlayer() { ... }              // 玩家渲染  
function renderEnemies() { ... }             // 敌人渲染
function renderProjectiles() { ... }         // 投射物渲染
function renderOrbitals() { ... }            // 环绕物渲染
function renderParticles() { ... }           // 粒子渲染
function renderFloatingTexts() { ... }       // 浮动文字渲染
function renderLightnings() { ... }          // 闪电渲染
function renderWhirlwinds() { ... }          // 旋风渲染
function renderMines() { ... }               // 地雷渲染
function renderChests() { ... }              // 宝箱渲染
function renderGroundItems() { ... }         // 地面物品渲染
function renderSearchPoints() { ... }        // 搜索点渲染
function renderMinimap() { ... }             // 小地图渲染
```

**注意事项**:
- 保留Canvas上下文获取代码（已移到renderer.js）
- 确保所有渲染函数都被删除
- 测试游戏确保渲染正常

### 3. 创建输入处理模块

**创建文件**: `input-handler.js`

**功能**:
```javascript
// 键盘输入管理
class InputHandler {
    constructor() {
        this.keys = {};
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    
    onKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        // 阻止默认行为
        if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    }
    
    onKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }
    
    isPressed(key) {
        return !!this.keys[key.toLowerCase()];
    }
}
```

**从game.js迁移**:
- keydown事件监听器
- keyup事件监听器
- gameState.keys相关代码

### 4. 创建UI管理模块

**创建文件**: `ui-manager.js`

**功能**:
```javascript
// UI更新管理
class UIManager {
    updateHUD(gameState) { ... }           // 更新顶部HUD
    updateEquipmentPanel(gameState) { ... } // 更新装备面板
    updateStatsPanel(gameState) { ... }     // 更新属性面板
    updateSkillsList(gameState) { ... }     // 更新技能列表
    updateInventory(gameState) { ... }      // 更新背包
    showLevelUpModal(choices) { ... }       // 显示升级弹窗
    showTalentPanel() { ... }               // 显示天赋树
    showAchievementPanel() { ... }          // 显示成就面板
    showQuestPanel() { ... }                // 显示任务面板
}
```

**从game.js迁移**:
- updateUI() 函数
- 所有UI更新逻辑
- 弹窗显示/隐藏函数

### 5. 创建游戏逻辑模块

**拆分为多个小模块**:

#### 5.1 玩家管理 - `player-manager.js`
```javascript
- initPlayer()
- updatePlayer()
- autoPickup()
- checkLevelUp()
```

#### 5.2 技能系统 - `skill-system.js`
```javascript
- updateSkills()
- useSkill()
- checkSkillEvolution()
- 技能升级逻辑
```

#### 5.3 敌人生成 - `enemy-spawner.js`
```javascript
- spawnEnemies()
- spawnBoss()
- applyEndlessScaling()
```

#### 5.4 实体更新 - `entity-updater.js`
```javascript
- updateEntities()
- 投射物更新
- 地雷更新
- 敌人移动和攻击
```

#### 5.5 物品系统 - `item-system.js`
```javascript
- spawnChest()
- openChest()
- spawnSearchPoint()
- updateSearchPoints()
- searchPointSuccess()
```

### 6. 重构后的文件结构

```
roguelike-game/
├── index.html                  # 主界面
├── config.js                   # 游戏配置
├── object-pool.js              # 对象池系统 ✅
├── renderer.js                 # 渲染系统 ✅
├── input-handler.js            # 输入处理 ⬜
├── ui-manager.js               # UI管理 ⬜
├── player-manager.js           # 玩家管理 ⬜
├── skill-system.js             # 技能系统 ⬜
├── enemy-spawner.js            # 敌人生成 ⬜
├── entity-updater.js           # 实体更新 ⬜
├── item-system.js              # 物品系统 ⬜
├── stats.js                    # 属性系统
├── equipment.js                # 装备系统
├── achievements.js             # 成就系统
└── game.js                     # 主游戏循环（精简版）
```

### 7. game.js精简后的职责

重构后，game.js应该只包含：
```javascript
- 游戏状态定义 (gameState, persistentData)
- 游戏循环 (gameLoop)
- 游戏初始化 (startGame, gameOver)
- 工具函数 (rand, dist, formatTime等)
- 持久化 (loadGame, saveGame)
- 日志系统 (addLog)
```

**目标行数**: 从5000行减少到500-800行

## 🎯 重构收益

### 代码质量
- ✅ 每个模块职责单一，易于维护
- ✅ 代码可读性大幅提升
- ✅ 便于单元测试
- ✅ 减少代码冲突

### 开发效率
- ✅ 多人协作更容易
- ✅ 定位问题更快
- ✅ 添加新功能更安全
- ✅ 代码复用更方便

### 性能
- ✅ 按需加载模块
- ✅ 减少内存占用
- ✅ 更好的代码优化空间

## 📊 重构进度

| 模块 | 状态 | 行数 | 完成度 |
|------|------|------|--------|
| renderer.js | ✅ 完成 | 410 | 100% |
| input-handler.js | ⬜ 待开始 | 0 | 0% |
| ui-manager.js | ⬜ 待开始 | 0 | 0% |
| player-manager.js | ⬜ 待开始 | 0 | 0% |
| skill-system.js | ⬜ 待开始 | 0 | 0% |
| enemy-spawner.js | ⬜ 待开始 | 0 | 0% |
| entity-updater.js | ⬜ 待开始 | 0 | 0% |
| item-system.js | ⬜ 待开始 | 0 | 0% |
| game.js清理 | ⬜ 待开始 | ~5000 | 0% |

**总体进度**: 10% (1/9模块完成)

## ⚠️ 重构注意事项

1. **逐步重构** - 每次只重构一个模块，确保功能正常
2. **充分测试** - 每完成一个模块都要全面测试
3. **保持备份** - 使用Git分支，随时可以回退
4. **文档更新** - 更新相关文档和注释
5. **性能监控** - 确保重构不影响性能

## 🚀 重构步骤建议

### 第一阶段：核心模块 (1-2天)
1. 删除game.js中的旧渲染代码
2. 创建input-handler.js
3. 创建ui-manager.js

### 第二阶段：游戏逻辑 (2-3天)
4. 创建player-manager.js
5. 创建skill-system.js
6. 创建enemy-spawner.js

### 第三阶段：完善和测试 (1-2天)
7. 创建entity-updater.js
8. 创建item-system.js
9. 清理game.js
10. 全面测试和bug修复

## 💡 最佳实践

1. **使用ES6模块** - 如果项目支持，使用import/export
2. **命名空间** - 使用window对象挂载全局API
3. **依赖注入** - 模块间通过参数传递依赖
4. **事件系统** - 使用自定义事件解耦模块
5. **配置集中** - 所有配置保留在config.js
