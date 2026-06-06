# Git 版本管理指南

## 📋 分支策略

### 主要分支
- **`master`** - 主分支，稳定版本，每次提交都是一个可发布的版本
- **`develop`** - 开发分支，日常开发在此进行
- **`feature/*`** - 功能分支，开发新功能时使用
- **`hotfix/*`** - 热修复分支，紧急修复bug时使用

### 分支命名规范
```
feature/技能系统优化
feature/性能优化-对象池
feature/成就通知系统
hotfix/修复装备掉落bug
hotfix/修复内存泄漏
```

## 🏷️ 版本标签

### 语义化版本 (SemVer)
格式：`v主版本号.次版本号.修订号`

- **主版本号**：不兼容的API修改或重大功能更新
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 示例
```
v6.0.0 - 重大更新（当前版本）
v6.1.0 - 添加新功能
v6.1.1 - 修复bug
v7.0.0 - 架构重构
```

## 📝 提交信息规范

### 格式
```
<type>: <subject>

<body>

<footer>
```

### Type 类型
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响代码运行）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 示例
```bash
# 新功能
git commit -m "feat: 添加成就解锁通知系统

- 实现成就解锁弹窗动画
- 添加音效反馈
- 支持通知队列管理"

# Bug修复
git commit -m "fix: 修复装备掉落率计算错误

修复CONFIG.EQUIPMENT.DROP_CHANCE未正确应用的问题"

# 性能优化
git commit -m "perf: 使用对象池优化敌人和投射物生成

- 实现EnemyPool对象池
- 实现ProjectilePool对象池
- 减少GC压力，提升性能30%"

# 文档更新
git commit -m "docs: 更新README添加性能优化说明"
```

## 🚀 常用命令

### 查看状态
```bash
git status                    # 查看当前状态
git log --oneline --graph    # 查看提交历史
git diff                     # 查看修改内容
```

### 分支管理
```bash
git branch                   # 查看分支
git branch <name>            # 创建分支
git checkout <name>          # 切换分支
git checkout -b <name>       # 创建并切换分支
git merge <name>             # 合并分支
git branch -d <name>         # 删除分支
```

### 标签管理
```bash
git tag                      # 查看标签
git tag -a v1.0.0 -m "说明"  # 创建标签
git push origin --tags       # 推送标签
```

### 回退版本
```bash
git reset --soft HEAD~1      # 撤销最近一次提交，保留修改
git reset --hard HEAD~1      # 撤销最近一次提交，删除修改（危险）
git revert <commit>          # 创建新提交来撤销指定提交
```

## 📊 工作流程示例

### 开发新功能
```bash
# 1. 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/性能优化-对象池

# 2. 开发并提交
git add .
git commit -m "feat: 实现敌人对象池"

git add .
git commit -m "feat: 实现投射物对象池"

# 3. 合并回develop
git checkout develop
git merge feature/性能优化-对象池

# 4. 删除功能分支
git branch -d feature/性能优化-对象池
```

### 发布新版本
```bash
# 1. 从develop合并到master
git checkout master
git merge develop

# 2. 创建版本标签
git tag -a v6.1.0 -m "添加性能优化和成就通知"

# 3. 推送到远程仓库
git push origin master
git push origin --tags
```

### 紧急修复
```bash
# 1. 从master创建热修复分支
git checkout master
git checkout -b hotfix/修复装备掉落bug

# 2. 修复并提交
git add .
git commit -m "fix: 修复装备掉落率计算错误"

# 3. 合并到master和develop
git checkout master
git merge hotfix/修复装备掉落bug
git tag -a v6.0.1 -m "修复装备掉落bug"

git checkout develop
git merge hotfix/修复装备掉落bug

# 4. 删除热修复分支
git branch -d hotfix/修复装备掉落bug
```

## 💾 备份和远程仓库

### 推送到GitHub/Gitee
```bash
# 添加远程仓库
git remote add origin <远程仓库URL>

# 推送到远程
git push -u origin master
git push -u origin develop

# 后续推送
git push
```

### 从远程更新
```bash
git pull origin master       # 拉取并合并
git fetch origin             # 仅下载不合并
```

## ⚠️ 注意事项

1. **提交前检查**：使用 `git status` 和 `git diff` 确认修改
2. **频繁提交**：小步提交，每次提交一个独立的改动
3. **清晰的提交信息**：使用中文，说明做了什么和为什么
4. **定期推送**：及时推送到远程仓库备份
5. **避免直接修改master**：所有功能开发都在分支上进行

## 📈 版本历史

- **v6.0.0** (2026-05-20) - 初始版本，完整功能
  - 9种技能系统
  - 技能进化系统
  - 装备系统
  - 天赋树系统
  - 成就和任务系统
  - 皮肤系统
  - 商人系统
