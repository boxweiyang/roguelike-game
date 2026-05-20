// ============================================
// 渲染系统 - 模块化重构
// 负责所有Canvas渲染相关功能
// ============================================

// 全局Canvas上下文
let gameCanvas = null;
let gameCtx = null;
let minimapCanvas = null;
let minimapCtx = null;

// 初始化Canvas
function initRender() {
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    minimapCanvas = document.getElementById('minimapCanvas');
    minimapCtx = minimapCanvas.getContext('2d');
    console.log('渲染系统初始化完成');
}

// 主渲染函数
function render(gameState) {
    if (!gameCtx) return;
    
    const ctx = gameCtx;
    const p = gameState.player;
    if (!p) return;
    
    // 清屏
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    // 计算摄像机偏移
    const camX = p.x * CONFIG.TILE_SIZE - CONFIG.CANVAS_WIDTH / 2;
    const camY = p.y * CONFIG.TILE_SIZE - CONFIG.CANVAS_HEIGHT / 2;
    
    ctx.save();
    ctx.translate(-camX, -camY);
    
    // 渲染各层
    renderGrid(ctx);
    renderSearchPoints(ctx, gameState.searchPoints);
    renderChests(ctx, gameState.chests);
    renderGroundItems(ctx, gameState.groundItems);
    renderMines(ctx, gameState.mines);
    renderEnemies(ctx, gameState.enemies);
    renderPlayer(ctx, p);
    renderProjectiles(ctx, gameState.projectiles);
    renderOrbitals(ctx, gameState.orbitals, p);
    renderWhirlwinds(ctx, gameState.whirlwinds);
    renderLightnings(ctx, gameState.lightnings);
    renderParticles(ctx, gameState.particles);
    renderFloatingTexts(ctx, gameState.floatingTexts);
    
    // 渲染技能特效（在摄像机坐标系内）
    if (skillManager && skillManager.skillEffects) {
        skillManager.skillEffects.render(ctx);
    }
    
    ctx.restore();
    
    // 渲染小地图
    renderMinimap(gameState);
}

// 渲染网格
function renderGrid(ctx) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    const startX = Math.floor(gameState.player.x - CONFIG.CANVAS_WIDTH / CONFIG.TILE_SIZE / 2) - 1;
    const startY = Math.floor(gameState.player.y - CONFIG.CANVAS_HEIGHT / CONFIG.TILE_SIZE / 2) - 1;
    const endX = startX + Math.ceil(CONFIG.CANVAS_WIDTH / CONFIG.TILE_SIZE) + 3;
    const endY = startY + Math.ceil(CONFIG.CANVAS_HEIGHT / CONFIG.TILE_SIZE) + 3;
    
    for (let x = startX; x <= endX; x++) {
        if (x < 0 || x > CONFIG.ARENA_SIZE) continue;
        ctx.beginPath();
        ctx.moveTo(x * CONFIG.TILE_SIZE, 0);
        ctx.lineTo(x * CONFIG.TILE_SIZE, CONFIG.ARENA_SIZE * CONFIG.TILE_SIZE);
        ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y++) {
        if (y < 0 || y > CONFIG.ARENA_SIZE) continue;
        ctx.beginPath();
        ctx.moveTo(0, y * CONFIG.TILE_SIZE);
        ctx.lineTo(CONFIG.ARENA_SIZE * CONFIG.TILE_SIZE, y * CONFIG.TILE_SIZE);
        ctx.stroke();
    }
    
    // 场地边界
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, CONFIG.ARENA_SIZE * CONFIG.TILE_SIZE, CONFIG.ARENA_SIZE * CONFIG.TILE_SIZE);
}

// 渲染玩家
function renderPlayer(ctx, p) {
    const x = p.x * CONFIG.TILE_SIZE;
    const y = p.y * CONFIG.TILE_SIZE;
    const size = CONFIG.TILE_SIZE * 0.4;
    
    // 玩家身体
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // 玩家边框
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 玩家图标
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧙', x, y);
}

// 渲染敌人
function renderEnemies(ctx, enemies) {
    for (const enemy of enemies) {
        const x = enemy.x * CONFIG.TILE_SIZE;
        const y = enemy.y * CONFIG.TILE_SIZE;
        const size = CONFIG.TILE_SIZE * enemy.size * 0.5;
        
        // 受击闪烁
        if (enemy.hitFlash > 0) {
            ctx.fillStyle = '#ffffff';
            enemy.hitFlash--;
        } else {
            ctx.fillStyle = enemy.color;
        }
        
        // 敌人身体
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 敌人图标
        ctx.fillStyle = '#ffffff';
        ctx.font = `${size * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(enemy.icon, x, y);
        
        // Boss标记
        if (enemy.isBoss) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // 生命条
        if (enemy.hp < enemy.maxHp) {
            const barWidth = size * 2;
            const barHeight = 4;
            const barX = x - barWidth / 2;
            const barY = y - size - 8;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(barX, barY, barWidth * (enemy.hp / enemy.maxHp), barHeight);
        }
    }
}

// 渲染投射物
function renderProjectiles(ctx, projectiles) {
    for (const proj of projectiles) {
        const x = proj.x * CONFIG.TILE_SIZE;
        const y = proj.y * CONFIG.TILE_SIZE;
        const size = CONFIG.TILE_SIZE * proj.size;
        
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = proj.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// 渲染环绕物
function renderOrbitals(ctx, orbitals, player) {
    for (const orb of orbitals) {
        const ox = (player.x + Math.cos(orb.angle) * orb.radius) * CONFIG.TILE_SIZE;
        const oy = (player.y + Math.sin(orb.angle) * orb.radius) * CONFIG.TILE_SIZE;
        const size = CONFIG.TILE_SIZE * orb.size;
        
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(ox, oy, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#9b59b6';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// 渲染粒子
function renderParticles(ctx, particles) {
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// 渲染浮动文字
function renderFloatingTexts(ctx, floatingTexts) {
    for (const ft of floatingTexts) {
        const alpha = ft.life / ft.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
}

// 渲染闪电
function renderLightnings(ctx, lightnings) {
    for (const l of lightnings) {
        const alpha = l.life / 12;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        
        ctx.beginPath();
        ctx.moveTo(l.x1 * CONFIG.TILE_SIZE, l.y1 * CONFIG.TILE_SIZE);
        ctx.lineTo(l.x2 * CONFIG.TILE_SIZE, l.y2 * CONFIG.TILE_SIZE);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
}

// 渲染旋风
function renderWhirlwinds(ctx, whirlwinds) {
    for (const w of whirlwinds) {
        const alpha = w.life / w.maxLife;
        ctx.globalAlpha = alpha * 0.5;
        
        const x = w.x * CONFIG.TILE_SIZE;
        const y = w.y * CONFIG.TILE_SIZE;
        const radius = w.radius * CONFIG.TILE_SIZE;
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, radius, w.angle, w.angle + Math.PI * 1.5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, w.angle + Math.PI, w.angle + Math.PI * 2.5);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// 渲染地雷
function renderMines(ctx, mines) {
    for (const mine of mines) {
        const x = mine.x * CONFIG.TILE_SIZE;
        const y = mine.y * CONFIG.TILE_SIZE;
        
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(x, y, CONFIG.TILE_SIZE * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#e74c3c';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', x, y);
    }
}

// 渲染宝箱
function renderChests(ctx, chests) {
    for (const chest of chests) {
        const x = chest.x * CONFIG.TILE_SIZE;
        const y = chest.y * CONFIG.TILE_SIZE;
        
        ctx.fillStyle = '#f39c12';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(chest.icon, x, y);
    }
}

// 渲染地面物品
function renderGroundItems(ctx, groundItems) {
    for (const item of groundItems) {
        const x = item.x * CONFIG.TILE_SIZE;
        const y = item.y * CONFIG.TILE_SIZE;
        
        let icon = '📦';
        if (item.type === 'gold') icon = '💰';
        else if (item.type === 'heal') icon = '❤️';
        else if (item.type === 'equipment') icon = item.icon || '🎒';
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, x, y);
    }
}

// 渲染搜索点
function renderSearchPoints(ctx, searchPoints) {
    for (const sp of searchPoints) {
        const x = sp.x * CONFIG.TILE_SIZE;
        const y = sp.y * CONFIG.TILE_SIZE;
        const radius = sp.radius * CONFIG.TILE_SIZE;
        
        // 搜索范围
        ctx.strokeStyle = sp.searching ? '#2ecc71' : '#3498db';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 搜索图标
        ctx.fillStyle = '#f1c40f';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔍', x, y);
        
        // 进度条
        if (sp.searching) {
            const progress = sp.searchProgress / CONFIG.SEARCH_POINT.SEARCH_TIME;
            const barWidth = 40;
            const barHeight = 4;
            const barX = x - barWidth / 2;
            const barY = y - radius - 10;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        }
    }
}

// 渲染小地图
function renderMinimap(gameState) {
    if (!minimapCtx || !gameState.player) return;
    
    const ctx = minimapCtx;
    const p = gameState.player;
    const scale = 150 / CONFIG.ARENA_SIZE;
    
    // 清空
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, 150, 150);
    
    // 边界
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 150, 150);
    
    // 敌人
    ctx.fillStyle = '#e74c3c';
    for (const enemy of gameState.enemies) {
        const x = enemy.x * scale;
        const y = enemy.y * scale;
        ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    
    // 玩家
    ctx.fillStyle = '#3498db';
    const px = p.x * scale;
    const py = p.y * scale;
    ctx.fillRect(px - 2, py - 2, 4, 4);
    
    // 宝箱
    ctx.fillStyle = '#f39c12';
    for (const chest of gameState.chests) {
        const x = chest.x * scale;
        const y = chest.y * scale;
        ctx.fillRect(x - 1, y - 1, 3, 3);
    }
}

// 导出渲染函数
window.initRender = initRender;
window.render = render;
