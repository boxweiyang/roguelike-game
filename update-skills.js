// 更新skill-manager.js和skill-effects.js以支持技能颜色

const fs = require('fs');

// 读取skill-manager.js
let skillManager = fs.readFileSync('skill-manager.js', 'utf8');

// 更新executeMeleeAOE - 添加skillId参数
skillManager = skillManager.replace(
  /(this\.skillEffects\.createWhirlwind\(\s*pixelX,\s*pixelY,\s*range,\s*bladeCount,\s*2000,\s*player,\s*\/\/\s*传入player引用\s*\))/,
  `this.skillEffects.createWhirlwind(
        pixelX,
        pixelY,
        range,
        bladeCount,
        2000,
        player, // 传入player引用
        'death_whirlwind' // 传入skillId用于颜色
      )`
);

// 更新executeAutoAOE - 雷暴领域
skillManager = skillManager.replace(
  /(this\.skillEffects\.createLightning\([^)]+\))/g,
  (match) => {
    if (!match.includes('thunderstorm')) {
      return match.replace(/\)$/, ', "thunderstorm")');
    }
    return match;
  }
);

console.log('skill-manager.js updated');
fs.writeFileSync('skill-manager.js', skillManager, 'utf8');

// 读取skill-effects.js
let skillEffects = fs.readFileSync('skill-effects.js', 'utf8');

// 更新createWhirlwind函数签名
skillEffects = skillEffects.replace(
  /createWhirlwind\(x, y, radius, bladeCount, duration = 2000, player = null\)/,
  `createWhirlwind(x, y, radius, bladeCount, duration = 2000, player = null, skillId = 'death_whirlwind')`
);

// 在createWhirlwind的effects.push中添加skillId
skillEffects = skillEffects.replace(
  /(createWhirlwind[\s\S]*?this\.effects\.push\(\{[\s\S]*?player: player, \/\/ 保存player引用以便跟随)/,
  `$1,
      skillId: skillId, // 保存skillId用于颜色`
);

console.log('skill-effects.js updated');
fs.writeFileSync('skill-effects.js', skillEffects, 'utf8');

console.log('Done!');
