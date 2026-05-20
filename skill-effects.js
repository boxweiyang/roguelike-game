// ============================================
// 技能特效渲染系统 - 炫酷视觉效果
// 使用Canvas 2D API实现各种粒子、光效、动画
// ============================================

class SkillEffectRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.effects = [];
        this.particles = [];
        this.trails = [];
    }

    // ==================== 粒子系统 ====================
    
    // 创建粒子爆炸效果
    createExplosion(x, y, color, count = 20, size = 5, speed = 3) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = speed * (0.5 + Math.random() * 0.5);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                size: size * (0.5 + Math.random() * 0.5),
                color: color,
                type: 'explosion'
            });
        }
    }

    // 创建火焰效果
    createFireEffect(x, y, radius, duration = 1000) {
        this.effects.push({
            x: x,
            y: y,
            radius: radius,
            startTime: Date.now(),
            duration: duration,
            type: 'fire',
            particles: []
        });

        // 创建火焰粒子
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius;
            this.effects[this.effects.length - 1].particles.push({
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 2,
                vy: -2 - Math.random() * 3,
                size: 3 + Math.random() * 5,
                life: 20 + Math.random() * 20
            });
        }
    }

    // 创建闪电效果
    createLightning(x1, y1, x2, y2, color = '#00ffff', width = 3) {
        this.effects.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            color: color,
            width: width,
            life: 10,
            maxLife: 10,
            type: 'lightning',
            segments: this.generateLightningSegments(x1, y1, x2, y2)
        });
    }

    // 生成闪电路径（锯齿状）
    generateLightningSegments(x1, y1, x2, y2) {
        const segments = [];
        const steps = 10;
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;

        segments.push({ x: x1, y: y1 });

        for (let i = 1; i < steps; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            segments.push({
                x: x1 + dx * i + offsetX,
                y: y1 + dy * i + offsetY
            });
        }

        segments.push({ x: x2, y: y2 });
        return segments;
    }

    // 创建冰霜效果
    createFrostEffect(x, y, radius) {
        this.effects.push({
            x: x,
            y: y,
            radius: radius,
            startTime: Date.now(),
            duration: 2000,
            type: 'frost',
            crystals: []
        });

        // 生成冰晶
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            this.effects[this.effects.length - 1].crystals.push({
                angle: angle,
                length: radius * 0.8,
                width: 3 + Math.random() * 3
            });
        }
    }

    // 创建黑洞效果
    createBlackHole(x, y, radius, duration = 5000) {
        this.effects.push({
            x: x,
            y: y,
            radius: radius,
            startTime: Date.now(),
            duration: duration,
            type: 'black_hole',
            rotation: 0,
            particles: []
        });

        // 创建吸入粒子
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = radius * 2 + Math.random() * radius * 2;
            this.effects[this.effects.length - 1].particles.push({
                angle: angle,
                dist: dist,
                speed: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 3
            });
        }
    }

    // 创建旋风效果
    createWhirlwind(x, y, radius, bladeCount, duration = 2000) {
        this.effects.push({
            x: x,
            y: y,
            radius: radius,
            bladeCount: bladeCount,
            startTime: Date.now(),
            duration: duration,
            type: 'whirlwind',
            rotation: 0
        });
    }

    // 创建护盾效果
    createShield(x, y, radius, color = '#ffd700') {
        this.effects.push({
            x: x,
            y: y,
            radius: radius,
            color: color,
            startTime: Date.now(),
            duration: 3000,
            type: 'shield',
            alpha: 0.6
        });
    }

    // 创建拖尾效果
    createTrail(x1, y1, x2, y2, color, width = 2) {
        this.trails.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            color: color,
            width: width,
            life: 15,
            maxLife: 15
        });
    }

    // 创建文字飘字
    createFloatingText(x, y, text, color, size = 20) {
        this.effects.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: size,
            startTime: Date.now(),
            duration: 1000,
            type: 'floating_text',
            vy: -2
        });
    }

    // ==================== 渲染函数 ====================

    // 更新所有效果
    update() {
        const now = Date.now();

        // 更新粒子
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // 重力
            p.life--;
            p.size *= 0.98;
            return p.life > 0;
        });

        // 更新拖尾
        this.trails = this.trails.filter(t => {
            t.life--;
            return t.life > 0;
        });

        // 更新效果
        this.effects = this.effects.filter(e => {
            const elapsed = now - e.startTime;
            
            if (e.type === 'whirlwind') {
                e.rotation += 0.1;
            } else if (e.type === 'black_hole') {
                e.rotation += 0.05;
                // 更新吸入粒子
                e.particles.forEach(p => {
                    p.angle += p.speed;
                    p.dist *= 0.98;
                });
            } else if (e.type === 'fire') {
                e.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life--;
                });
            }

            return elapsed < e.duration;
        });
    }

    // 渲染所有效果
    render() {
        const ctx = this.ctx;

        // 渲染拖尾
        this.trails.forEach(t => {
            const alpha = t.life / t.maxLife;
            ctx.strokeStyle = t.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = t.width;
            ctx.beginPath();
            ctx.moveTo(t.x1, t.y1);
            ctx.lineTo(t.x2, t.y2);
            ctx.stroke();
        });

        // 渲染粒子
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 渲染效果
        this.effects.forEach(e => {
            const progress = (Date.now() - e.startTime) / e.duration;
            ctx.globalAlpha = 1;

            switch (e.type) {
                case 'lightning':
                    this.renderLightning(ctx, e);
                    break;
                case 'fire':
                    this.renderFire(ctx, e);
                    break;
                case 'frost':
                    this.renderFrost(ctx, e);
                    break;
                case 'black_hole':
                    this.renderBlackHole(ctx, e);
                    break;
                case 'whirlwind':
                    this.renderWhirlwind(ctx, e);
                    break;
                case 'shield':
                    this.renderShield(ctx, e);
                    break;
                case 'floating_text':
                    this.renderFloatingText(ctx, e);
                    break;
            }
        });

        ctx.globalAlpha = 1;
    }

    // 渲染闪电
    renderLightning(ctx, e) {
        const alpha = e.life / e.maxLife;
        ctx.strokeStyle = e.color;
        ctx.lineWidth = e.width;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(e.segments[0].x, e.segments[0].y);
        for (let i = 1; i < e.segments.length; i++) {
            ctx.lineTo(e.segments[i].x, e.segments[i].y);
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
        e.life--;
    }

    // 渲染火焰
    renderFire(ctx, e) {
        const flicker = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        
        // 火焰底色
        ctx.fillStyle = `rgba(255, 100, 0, ${0.3 * flicker})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();

        // 火焰粒子
        e.particles.forEach(p => {
            const alpha = p.life / 40;
            ctx.fillStyle = `rgba(255, ${150 + Math.random() * 105}, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 渲染冰霜
    renderFrost(ctx, e) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 5;

        // 冰晶
        e.crystals.forEach(c => {
            const x2 = e.x + Math.cos(c.angle) * c.length;
            const y2 = e.y + Math.sin(c.angle) * c.length;
            
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });

        // 冰霜区域
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    // 渲染黑洞
    renderBlackHole(ctx, e) {
        const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1;

        // 外层光环
        ctx.strokeStyle = `rgba(128, 0, 128, 0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // 旋转粒子
        e.particles.forEach(p => {
            const px = e.x + Math.cos(p.angle) * p.dist;
            const py = e.y + Math.sin(p.angle) * p.dist;
            
            ctx.fillStyle = `rgba(128, 0, 128, 0.8)`;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 中心黑洞
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 渲染旋风
    renderWhirlwind(ctx, e) {
        const elapsed = Date.now() - e.startTime;
        const progress = elapsed / e.duration;
        
        // 刀刃应该在半径内旋转，而不是在半径边缘
        const orbitRadius = e.radius * 0.6; // 使用60%的半径作为旋转轨道
        const bladeAngle = (Math.PI * 2) / e.bladeCount;

        // 绘制外圈光环
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 绘制旋转的刀刃
        for (let i = 0; i < e.bladeCount; i++) {
            const angle = e.rotation + bladeAngle * i;
            const x = e.x + Math.cos(angle) * orbitRadius;
            const y = e.y + Math.sin(angle) * orbitRadius;

            // 刀刃
            ctx.fillStyle = '#00ff66';
            ctx.shadowColor = '#00ff66';
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // 轨迹
            ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(e.x, e.y, orbitRadius, angle - 0.6, angle);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
    }

    // 渲染护盾
    renderShield(ctx, e) {
        const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.9;
        
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = e.alpha * pulse;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 护盾内部
        ctx.fillStyle = `rgba(255, 215, 0, 0.1)`;
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    // 渲染飘字
    renderFloatingText(ctx, e) {
        const elapsed = Date.now() - e.startTime;
        const progress = elapsed / e.duration;
        
        e.y += e.vy;
        
        ctx.fillStyle = e.color;
        ctx.font = `bold ${e.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1 - progress;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 5;
        
        ctx.fillText(e.text, e.x, e.y);
        
        ctx.shadowBlur = 0;
    }

    // 清屏
    clear() {
        this.effects = [];
        this.particles = [];
        this.trails = [];
    }
}

console.log('技能特效渲染系统加载完成');
