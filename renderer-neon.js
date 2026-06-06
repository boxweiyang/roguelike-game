// ============================================
// 霓虹赛博朋克渲染系统
// 发光效果、渐变、粒子拖尾
// ============================================

class NeonRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  // ==================== 发光效果 ====================

  // 绘制发光圆形
  drawGlowCircle(x, y, radius, color, glowSize = 20) {
    const ctx = this.ctx;

    // 外发光
    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;

    // 主体
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 内发光渐变
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  // 绘制发光多边形（六边形）
  drawGlowHexagon(x, y, radius, color, glowSize = 15) {
    const ctx = this.ctx;

    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;

    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // 内部高光
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.6);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + Math.cos(angle) * radius * 0.6;
      const py = y + Math.sin(angle) * radius * 0.6;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  // 绘制菱形
  drawGlowDiamond(x, y, radius, color, glowSize = 12) {
    const ctx = this.ctx;

    ctx.shadowColor = color;
    ctx.shadowBlur = glowSize;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius * 0.7, y);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius * 0.7, y);
    ctx.closePath();
    ctx.fill();

    // 内部高光
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.moveTo(x, y - radius * 0.5);
    ctx.lineTo(x + radius * 0.35, y);
    ctx.lineTo(x, y + radius * 0.5);
    ctx.lineTo(x - radius * 0.35, y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  // ==================== 能量环效果 ====================

  // 绘制旋转能量环
  drawEnergyRing(x, y, radius, color, rotation, lineWidth = 2) {
    const ctx = this.ctx;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.arc(x, y, radius, rotation, rotation + Math.PI * 1.5);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  // ==================== 拖尾粒子 ====================

  // 创建拖尾粒子
  createTrailParticle(x, y, color, size, life = 20) {
    return {
      x: x,
      y: y,
      color: color,
      size: size,
      life: life,
      maxLife: life,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    };
  }

  // 更新并渲染拖尾粒子
  updateAndRenderTrail(particles) {
    const ctx = this.ctx;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.size *= 0.95;

      if (p.life <= 0 || p.size < 0.5) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ==================== 闪电效果 ====================

  // 绘制闪电链
  drawLightningChain(x1, y1, x2, y2, color = "#00ffff", branches = 3) {
    const ctx = this.ctx;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    // 主闪电
    this.drawJaggedLine(x1, y1, x2, y2, 0.3);

    // 分支闪电
    for (let i = 0; i < branches; i++) {
      const t = (i + 1) / (branches + 1);
      const midX = x1 + (x2 - x1) * t;
      const midY = y1 + (y2 - y1) * t;
      const offset = (Math.random() - 0.5) * 40;

      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      this.drawJaggedLine(midX, midY, midX + offset, midY + offset, 0.2);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  // 绘制锯齿线（闪电）
  drawJaggedLine(x1, y1, x2, y2, jaggedness = 0.3) {
    const ctx = this.ctx;
    const segments = 8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const x =
        x1 + (x2 - x1) * t + (Math.random() - 0.5) * (x2 - x1) * jaggedness;
      const y =
        y1 + (y2 - y1) * t + (Math.random() - 0.5) * (y2 - y1) * jaggedness;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // ==================== 爆炸波纹 ====================

  // 绘制爆炸波纹
  drawExplosionWave(x, y, radius, color, alpha = 0.6) {
    const ctx = this.ctx;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 内圈
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  // ==================== 霓虹文字 ====================

  // 绘制霓虹文字（伤害数字）
  drawNeonText(text, x, y, color, size = 16) {
    const ctx = this.ctx;

    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 发光效果
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    // 白色核心
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, x, y);
  }
}
