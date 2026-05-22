// ============================================
// 技能颜色配置 - 赛博朋克风格
// 每个技能都有独特的颜色以便区分
// ============================================

const SKILL_COLORS = {
  // T0 神技
  death_whirlwind: {
    // 死亡旋风
    primary: "#00ffff", // 青色 - 光剑
    secondary: "#00cccc", // 深青色
    glow: "#00ffff", // 发光颜色
    trail: "rgba(0, 255, 255, 0.3)", // 拖尾
  },

  thunderstorm: {
    // 雷暴领域
    primary: "#ffff00", // 黄色 - 闪电
    secondary: "#ffcc00", // 深黄色
    glow: "#ffff00", // 发光颜色
    trail: "rgba(255, 255, 0, 0.3)", // 拖尾
  },

  hellfire_rain: {
    // 地狱火雨
    primary: "#ff4400", // 橙红色 - 火焰
    secondary: "#ff2200", // 深红色
    glow: "#ff6600", // 发光颜色
    trail: "rgba(255, 68, 0, 0.3)", // 拖尾
  },

  // T1 强力技能
  blade_storm: {
    // 剑刃风暴
    primary: "#ff00ff", // 品红色/紫色 - 剑刃
    secondary: "#cc00cc", // 深紫色
    glow: "#ff00ff", // 发光颜色
    trail: "rgba(255, 0, 255, 0.3)", // 拖尾
  },

  explosive_missiles: {
    // 爆裂飞弹
    primary: "#ff6600", // 橙色 - 飞弹
    secondary: "#ff4400", // 深橙色
    glow: "#ff8800", // 发光颜色
    trail: "rgba(255, 102, 0, 0.3)", // 拖尾
  },

  black_hole: {
    // 黑洞吞噬
    primary: "#aa00ff", // 紫色 - 黑洞
    secondary: "#7700cc", // 深紫色
    glow: "#cc00ff", // 发光颜色
    trail: "rgba(170, 0, 255, 0.3)", // 拖尾
  },

  // T2 特色技能
  sniper_shot: {
    // 狙击射击
    primary: "#ffffff", // 白色 - 激光
    secondary: "#cccccc", // 灰色
    glow: "#ffffff", // 发光颜色
    trail: "rgba(255, 255, 255, 0.5)", // 拖尾(更亮)
  },

  frost_nova: {
    // 冰霜新星
    primary: "#00ccff", // 天蓝色 - 冰霜
    secondary: "#0099cc", // 深蓝色
    glow: "#00ddff", // 发光颜色
    trail: "rgba(0, 204, 255, 0.3)", // 拖尾
  },

  // T3 辅助技能
  death_grasp: {
    // 死亡之握
    primary: "#8b00ff", // 深紫色 - 黑暗能量
    secondary: "#6600cc", // 更深的紫色
    glow: "#9900ff", // 发光颜色
    trail: "rgba(139, 0, 255, 0.3)", // 拖尾
  },

  holy_shield: {
    // 神圣护盾
    primary: "#ffd700", // 金色 - 神圣
    secondary: "#ffaa00", // 深金色
    glow: "#ffdd00", // 发光颜色
    trail: "rgba(255, 215, 0, 0.3)", // 拖尾
  },

  life_drain: {
    // 生命汲取
    primary: "#00ff66", // 翠绿色 - 生命
    secondary: "#00cc44", // 深绿色
    glow: "#00ff88", // 发光颜色
    trail: "rgba(0, 255, 102, 0.3)", // 拖尾
  },

  // 特色技能
  starfall: {
    // 星辰坠落
    primary: "#ffcc00", // 金黄色 - 星星
    secondary: "#ffaa00", // 深黄色
    glow: "#ffdd44", // 发光颜色
    trail: "rgba(255, 204, 0, 0.3)", // 拖尾
  },

  lucky_wheel: {
    // 幸运轮盘
    primary: "#ff69b4", // 粉色 - 幸运
    secondary: "#ff1493", // 深粉色
    glow: "#ff88cc", // 发光颜色
    trail: "rgba(255, 105, 180, 0.3)", // 拖尾
  },

  mirror_clone: {
    // 镜像分身
    primary: "#00ffff", // 青色 - 镜像(与旋风不同深浅)
    secondary: "#00dddd", // 深青色
    glow: "#66ffff", // 发光颜色
    trail: "rgba(0, 255, 255, 0.4)", // 拖尾(稍亮)
  },

  chain_explosion: {
    // 连锁爆炸
    primary: "#ff3333", // 鲜红色 - 爆炸
    secondary: "#cc0000", // 深红色
    glow: "#ff5555", // 发光颜色
    trail: "rgba(255, 51, 51, 0.3)", // 拖尾
  },
};

// 导出供其他模块使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = SKILL_COLORS;
}
