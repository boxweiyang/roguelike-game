// ============================================
// 技能图鉴系统 - 解锁制配方查看
// ============================================

class SkillEncyclopedia {
  constructor() {
    this.discoveredSkills = {}; // 已发现的技能
    this.discoveredEvolutions = {}; // 已解锁的进化配方
    this.discoveredPassives = {}; // 已发现的被动道具
    this.initialized = false;
    // 不立即初始化，等待persistentData可用
  }

  // 延迟初始化，在persistentData可用后调用
  init() {
    if (this.initialized) return;

    // 检查persistentData是否可用
    if (typeof persistentData === "undefined") {
      console.warn("图鉴系统: persistentData 未定义，延迟初始化");
      return;
    }

    this.initialized = true;

    // 从持久化数据加载
    if (!persistentData.encyclopedia) {
      persistentData.encyclopedia = {
        skills: {},
        evolutions: {},
        passives: {},
      };
    }

    this.discoveredSkills = persistentData.encyclopedia.skills || {};
    this.discoveredEvolutions = persistentData.encyclopedia.evolutions || {};
    this.discoveredPassives = persistentData.encyclopedia.passives || {};

    // 创建图鉴UI
    this.createEncyclopediaUI();
    console.log("技能图鉴系统初始化完成");
  }

  // 创建图鉴界面
  createEncyclopediaUI() {
    // 创建图鉴按钮
    const encyclopediaBtn = document.createElement("button");
    encyclopediaBtn.id = "encyclopedia-btn";
    encyclopediaBtn.innerHTML = "📖 图鉴";
    encyclopediaBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
    encyclopediaBtn.onclick = () => this.showEncyclopedia();
    document.body.appendChild(encyclopediaBtn);

    // 创建图鉴面板
    const panel = document.createElement("div");
    panel.id = "encyclopedia-panel";
    panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            max-height: 80vh;
            background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,30,0.98));
            border: 2px solid #667eea;
            border-radius: 15px;
            padding: 30px;
            overflow-y: auto;
            z-index: 2000;
            display: none;
            box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 30px rgba(102,126,234,0.3);
        `;
    document.body.appendChild(panel);

    // 关闭按钮
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✖";
    closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #e74c3c;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
        `;
    closeBtn.onclick = () => this.hideEncyclopedia();
    panel.appendChild(closeBtn);
  }

  // 显示图鉴
  showEncyclopedia() {
    const panel = document.getElementById("encyclopedia-panel");
    if (!panel) return;

    this.renderEncyclopediaContent();
    panel.style.display = "block";
  }

  // 隐藏图鉴
  hideEncyclopedia() {
    const panel = document.getElementById("encyclopedia-panel");
    if (panel) {
      panel.style.display = "none";
    }
  }

  // 渲染图鉴内容
  renderEncyclopediaContent() {
    const panel = document.getElementById("encyclopedia-panel");
    if (!panel) return;

    let html = `
            <h2 style="color: #667eea; margin-bottom: 20px; text-align: center;">
                📖 技能图鉴
            </h2>
            
            <div style="margin-bottom: 20px; display: flex; gap: 10px; justify-content: center;">
                <button onclick="skillEncyclopedia.showTab('skills')" 
                    style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    技能列表
                </button>
                <button onclick="skillEncyclopedia.showTab('evolutions')" 
                    style="padding: 8px 16px; background: #764ba2; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    进化配方
                </button>
                <button onclick="skillEncyclopedia.showTab('passives')" 
                    style="padding: 8px 16px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    被动道具
                </button>
            </div>
        `;

    html += `<div id="encyclopedia-content"></div>`;
    panel.innerHTML = html;
    panel
      .querySelector("button:last-of-type")
      .after(document.createElement("div"));

    // 默认显示技能列表
    this.showTab("skills");
  }

  // 切换标签
  showTab(tabName) {
    const content = document.getElementById("encyclopedia-content");
    if (!content) return;

    switch (tabName) {
      case "skills":
        this.renderSkillsTab(content);
        break;
      case "evolutions":
        this.renderEvolutionsTab(content);
        break;
      case "passives":
        this.renderPassivesTab(content);
        break;
    }
  }

  // 渲染技能列表
  renderSkillsTab(container) {
    const skillIds = Object.keys(SKILLS_DATA);

    let html =
      '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">';

    skillIds.forEach((skillId) => {
      const skill = SKILLS_DATA[skillId];
      const discovered = this.discoveredSkills[skillId];

      if (discovered) {
        // 已发现的技能
        html += `
                    <div style="
                        background: rgba(102,126,234,0.1);
                        border: 1px solid #667eea;
                        border-radius: 10px;
                        padding: 15px;
                    ">
                        <div style="font-size: 32px; text-align: center; margin-bottom: 10px;">
                            ${skill.icon}
                        </div>
                        <div style="color: ${this.getRarityColor(skill.rarity)}; font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 5px;">
                            ${skill.name}
                        </div>
                        <div style="color: #aaa; font-size: 12px; text-align: center;">
                            ${this.getRarityName(skill.rarity)}
                        </div>
                        <div style="color: #fff; font-size: 13px; margin-top: 10px; line-height: 1.6;">
                            ${skill.description}
                        </div>
                        <div style="color: #2ecc71; font-size: 12px; margin-top: 8px; text-align: center;">
                            ✅ 已发现
                        </div>
                    </div>
                `;
      } else {
        // 未发现的技能
        html += `
                    <div style="
                        background: rgba(100,100,100,0.1);
                        border: 1px solid #555;
                        border-radius: 10px;
                        padding: 15px;
                        opacity: 0.5;
                    ">
                        <div style="font-size: 32px; text-align: center; margin-bottom: 10px;">
                            ❓
                        </div>
                        <div style="color: #666; font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 5px;">
                            ???
                        </div>
                        <div style="color: #555; font-size: 12px; text-align: center;">
                            未获得
                        </div>
                    </div>
                `;
      }
    });

    html += "</div>";
    container.innerHTML = html;
  }

  // 渲染进化配方
  renderEvolutionsTab(container) {
    const evolutionIds = Object.keys(this.discoveredEvolutions);

    if (evolutionIds.length === 0) {
      container.innerHTML = `
                <div style="text-align: center; color: #888; padding: 50px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                    <div style="font-size: 18px;">尚未解锁任何进化配方</div>
                    <div style="font-size: 14px; margin-top: 10px; color: #666;">
                        当你第一次进化技能后，配方将在这里显示
                    </div>
                </div>
            `;
      return;
    }

    let html =
      '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">';

    evolutionIds.forEach((evoId) => {
      const evolution = this.discoveredEvolutions[evoId];

      html += `
                <div style="
                    background: rgba(243,156,18,0.1);
                    border: 2px solid #f39c12;
                    border-radius: 10px;
                    padding: 20px;
                ">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 24px; color: #f39c12; font-weight: bold;">
                            进化配方
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">${evolution.skillIcon}</div>
                            <div style="color: #fff; font-size: 12px; margin-top: 5px;">
                                ${evolution.skillName} Lv.8
                            </div>
                        </div>
                        
                        <div style="color: #f39c12; font-size: 24px;">+</div>
                        
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">${evolution.passiveIcon}</div>
                            <div style="color: #fff; font-size: 12px; margin-top: 5px;">
                                ${evolution.passiveName}
                            </div>
                        </div>
                        
                        <div style="color: #f39c12; font-size: 24px;">=</div>
                        
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">${evolution.evolvedIcon}</div>
                            <div style="color: #f39c12; font-size: 12px; font-weight: bold; margin-top: 5px;">
                                ${evolution.evolvedName}
                            </div>
                        </div>
                    </div>
                    
                    <div style="color: #2ecc71; font-size: 12px; margin-top: 15px; text-align: center;">
                        ✅ 已解锁
                    </div>
                </div>
            `;
    });

    html += "</div>";
    container.innerHTML = html;
  }

  // 渲染被动道具
  renderPassivesTab(container) {
    const passiveIds = Object.keys(PASSIVE_ITEMS);

    let html =
      '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">';

    passiveIds.forEach((passiveId) => {
      const passive = PASSIVE_ITEMS[passiveId];
      const discovered = this.discoveredPassives[passiveId];

      if (discovered) {
        html += `
                    <div style="
                        background: rgba(243,156,18,0.1);
                        border: 1px solid #f39c12;
                        border-radius: 10px;
                        padding: 15px;
                    ">
                        <div style="font-size: 32px; text-align: center; margin-bottom: 10px;">
                            ${passive.icon}
                        </div>
                        <div style="color: ${this.getRarityColor(passive.rarity)}; font-size: 14px; font-weight: bold; text-align: center; margin-bottom: 5px;">
                            ${passive.name}
                        </div>
                        <div style="color: #aaa; font-size: 11px; text-align: center;">
                            ${this.getRarityName(passive.rarity)}
                        </div>
                        <div style="color: #fff; font-size: 12px; margin-top: 8px; line-height: 1.5;">
                            ${passive.description}
                        </div>
                    </div>
                `;
      } else {
        html += `
                    <div style="
                        background: rgba(100,100,100,0.1);
                        border: 1px solid #555;
                        border-radius: 10px;
                        padding: 15px;
                        opacity: 0.5;
                    ">
                        <div style="font-size: 32px; text-align: center; margin-bottom: 10px;">
                            ❓
                        </div>
                        <div style="color: #666; font-size: 14px; font-weight: bold; text-align: center;">
                            ???
                        </div>
                    </div>
                `;
      }
    });

    html += "</div>";
    container.innerHTML = html;
  }

  // 发现技能
  discoverSkill(skillId) {
    if (!this.discoveredSkills[skillId]) {
      this.discoveredSkills[skillId] = true;
      this.saveEncyclopedia();

      // 显示提示
      if (notificationSystem) {
        const skill = SKILLS_DATA[skillId];
        notificationSystem.showNotification(
          "📖 新技能发现！",
          `${skill.icon} ${skill.name}`,
          { color: "#667eea", duration: 3000 },
        );
      }
    }
  }

  // 解锁进化配方
  unlockEvolution(skillId, passiveId, evolutionId) {
    const evolutionKey = `${skillId}_${passiveId}`;

    if (!this.discoveredEvolutions[evolutionKey]) {
      const skill = SKILLS_DATA[skillId];
      const passive = PASSIVE_ITEMS[passiveId];
      const evolution = skill.evolution;

      this.discoveredEvolutions[evolutionKey] = {
        skillId: skillId,
        skillName: skill.name,
        skillIcon: skill.icon,
        passiveId: passiveId,
        passiveName: passive.name,
        passiveIcon: passive.icon,
        evolvedId: evolutionId,
        evolvedName: evolution.name,
        evolvedIcon: evolution.icon,
      };

      this.saveEncyclopedia();

      // 显示提示
      if (notificationSystem) {
        notificationSystem.showNotification(
          "🔓 进化配方解锁！",
          `${skill.icon} + ${passive.icon} = ${evolution.icon}`,
          { color: "#f39c12", duration: 5000 },
        );
      }
    }
  }

  // 发现被动道具
  discoverPassive(passiveId) {
    if (!this.discoveredPassives[passiveId]) {
      this.discoveredPassives[passiveId] = true;
      this.saveEncyclopedia();
    }
  }

  // 保存图鉴数据
  saveEncyclopedia() {
    persistentData.encyclopedia = {
      skills: this.discoveredSkills,
      evolutions: this.discoveredEvolutions,
      passives: this.discoveredPassives,
    };

    if (typeof saveGame === "function") {
      saveGame();
    }
  }

  // 获取稀有度颜色
  getRarityColor(rarity) {
    const colors = {
      common: "#95a5a6",
      uncommon: "#2ecc71",
      rare: "#3498db",
      epic: "#9b59b6",
      legendary: "#f39c12",
      mythic: "#e74c3c",
    };
    return colors[rarity] || "#ffffff";
  }

  // 获取稀有度名称
  getRarityName(rarity) {
    const names = {
      common: "普通",
      uncommon: "优秀",
      rare: "稀有",
      epic: "史诗",
      legendary: "传说",
      mythic: "神话",
    };
    return names[rarity] || "未知";
  }
}

// 创建全局实例（不立即初始化）
const skillEncyclopedia = new SkillEncyclopedia();
window.skillEncyclopedia = skillEncyclopedia;

console.log("技能图鉴系统加载完成（等待persistentData初始化）");
