# Money Tracker — Design System

> 全局设计规范。所有页面、组件、样式均遵循此文件。

---

## 1. Design Principles

1. **Breathe** — Use whitespace to separate, not lines. Cards have 24px+ padding, sections are 32px apart.
2. **Layer, don't border** — Depth comes from background color shifts (`surface` → `card_surface`), not from borders or shadows.
3. **Round everything** — Minimum 16px radius for small components, 24px for cards. No sharp corners.
4. **Data first** — Every visual element serves a data purpose. No decorative illustrations or ornamental icons.

---

## 2. 色彩体系

### 2.1 核心色系

| Token | 色值 | 用途 |
|-------|------|------|
| `primary` | `#4B6EF5` (Modern Blue) | 品牌色、核心按钮、导航选中态 |
| `secondary` | `#FFD147` (Gold Yellow) | 强调、薪资/收入相关分类 |
| `tertiary` | `#9333EA` (Deep Purple) | 辅助、非核心支出或特殊类别 |

### 2.2 数据状态色

| Token | 色值 | 用途 |
|-------|------|------|
| `growth` | `#10B981` (Emerald Green) | 收入、增长趋势 |
| `decline` | `#EF4444` (Coral Red) | 支出、下跌趋势 |

### 2.3 语义化状态色

| Token | 色值 | 用途 |
|-------|------|------|
| `success` | `#22C55E` | 目标达成、保存成功 |
| `error` | `#DC2626` | 支付失败、表单报错 |
| `warning` | `#F97316` (Bright Orange) | 预算警告（70%-100%）、余额不足 |

### 2.4 中性色与文本

| Token | 色值 | 用途 |
|-------|------|------|
| `text_primary` | `#111827` (Slate Black) | 标题、正文 |
| `text_secondary` | `#4B5563` (Dark Gray) | 次要信息 |
| `text_muted` | `#9CA3AF` (Light Gray) | 辅助标注、图表轴标签 |
| `border` | `#E5E7EB` (Soft Gray) | 仅在无障碍需求时使用，15% 透明度 |
| `surface` | `#F8F9FA` | 全局背景画布 |
| `card_surface` | `#FFFFFF` | 卡片/容器背景 |

### 2.5 "No-Line" 规则

**禁止使用 1px solid 边框来划分区域。** 边界通过背景色差体现：白色卡片 (`#FFFFFF`) 放在灰色画布 (`#F8F9FA`) 上，自然产生层次。如需高对比度无障碍支持，使用 `border` 色值在 15% 透明度下。

### 2.6 渐变与毛玻璃

- **CTA 按钮**：从 `primary` (`#4B6EF5`) 到稍亮蓝色的微妙线性渐变
- **浮动元素**：`#FFFFFF` 80% 透明度 + `backdrop-blur: 20px` 毛玻璃效果（用于 Modal 遮罩、Tooltip）

---

## 3. 排版

全局字体：**Inter**

### 3.1 标题字体 (Headings) — 引导视觉焦点

| Token | 大小 | 字重 | 行高 | 用途 |
|-------|------|------|------|------|
| `display` | 36px | Bold | 1.2 | 大标题、问候语 "Good Morning"、核心金额数字 |
| `h1` | 24px | SemiBold | 1.4 | 模块标题 "Finance Overview"、页面标题 |
| `h2` | 20px | SemiBold | 1.5 | 卡片内次级标题 |

### 3.2 正文字体 (Body) — 核心内容

| Token | 大小 | 字重 | 行高 | 用途 |
|-------|------|------|------|------|
| `body-primary` | 16px | Medium | 1.6 | 主要数据数值、列表条目名称 |
| `body-secondary` | 14px | Regular | 1.6 | 描述性文本、次要信息 |
| `caption` | 12px | Medium | 1.4 | 时间戳、小标签、单位标注、图表轴标签 |

### 3.3 交互字体 (Interactive) — 功能操作

| Token | 大小 | 字重 | 用途 |
|-------|------|------|------|
| `button-text` | 14px | SemiBold | 按钮文字，强调动作 |
| `nav-label` | 14px | Medium | 导航菜单标签 |

### 3.4 文本颜色规则

- 禁止使用纯黑 `#000000`
- 标题/一级正文：`text_primary` (`#111827`)
- 次要信息：`text_secondary` (`#4B5563`)
- 辅助标注：`text_muted` (`#9CA3AF`)

---

## 4. 间距系统

基于 **8px 栅格**，加入 4px 和 12px 微调：

| Token | 值 | 用途 |
|-------|------|------|
| `xs` | 4px | 微间距 |
| `sm` | 8px | 紧凑间距 |
| `md` | 12px | 按钮内垂直间距 |
| `lg` | 16px | 列表项间距（替代分割线） |
| `xl` | 24px | 卡片内间距（标准） |
| `2xl` | 32px | 模块间距、Modal 内间距 |
| `3xl` | 48px | 大章节间距 |
| `4xl` | 64px | 页面顶部/底部留白 |

### 填充规范

| 组件 | Padding |
|------|---------|
| Card | 24px (`xl`) |
| Modal / Drawer | 32px (`2xl`) |
| Button | 12px 24px (`md` 垂直, `xl` 水平) |
| Section 间距 | 32px (`2xl`) |

---

## 5. 形状与阴影

### 圆角

| 组件 | Radius |
|------|--------|
| 主卡片 / 大容器 | 24px |
| 按钮、输入框、小组件 | 16px |
| 全圆（Pill） | 9999px（搜索框、标签） |

**最小圆角 8px，禁止直角。**

### 阴影

| 场景 | 值 |
|------|------|
| 静态卡片 | 不用阴影，靠 surface/card_surface 色差产生层次 |
| 浮动元素（Modal/Dropdown） | `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)` |

---

## 6. 布局框架

### 6.1 整体结构

```
┌────────┬─────────────────────────────────────┐
│  Logo  │  Good Morning          April 2026 ▼ │
│  (MT)  │  3rd April, 2026       (月份选择器)  │
├────────┼─────────────────────────────────────┤
│        │                                     │
│  📋    │                                     │
│ Bills  │          主内容区                     │
│        │                                     │
│  📊    │                                     │
│Analysis│                                     │
│        │                                     │
│  🎯    │                                     │
│ Goals  │                                     │
│        │                                     │
└────────┴─────────────────────────────────────┘
```

### 6.2 左侧导航栏

- 固定宽度，无分割线
- 顶部：Logo「MT」
- 3 个一级菜单：Bills / Analysis / Goals
- **选中态**：柔和圆角背景色块（`primary` 10% 透明度）+ `primary` 色图标
- 非选中态：`text_muted` 色图标

### 6.3 顶部栏

- 左侧：动态问候语 + 日期
  - 05:00-11:59 → Good Morning
  - 12:00-17:59 → Good Afternoon
  - 18:00-04:59 → Good Evening
  - 日期格式：`3rd April, 2026`
- 右侧：**月份选择器**（全局唯一筛选控件）
- **不做**：~~搜索~~、~~用户头像~~、~~通知~~、~~登录/注册~~

### 6.4 月份选择器

- 全局状态，切换后所有页面数据联动
- 默认当前月份
- 影响范围：Bills 明细、Analysis 图表、Goals 进度

---

## 7. 全局交互

### Modal

- 居中弹出，背景遮罩（毛玻璃效果）
- 32px 内间距，24px 圆角
- 点击遮罩可关闭

### Toast

- 操作成功后右上角弹出
- 自动消失（2-3 秒）

### 二次确认

- 删除操作必须弹出确认弹窗
- 明确说明将要删除的内容

### 空状态

- 无数据时显示引导文案
- 使用 `text_muted` 色

---

## 8. 页面总览

| 页面 | 路由 | CRUD |
|------|------|------|
| Bills | `/` (默认) | C / R / U / D 记录 |
| Analysis | `/analysis` | R 统计数据 |
| Goals | `/goals` | C / R / U / D 预算 |

SPA 单页应用，切换页面保持当前月份选择。

---

## 9. Do's & Don'ts

### Do

- 使用非对称布局（如宽窄卡片并列）
- 用语义色标注趋势涨跌
- 卡片内至少 24px padding
- 用留白替代分割线（列表项间 16px 间距）
- 图表柱状图使用圆角端点
- 环形图使用宽描边（32px+）

### Don't

- 禁止纯黑 `#000000` 文本
- 禁止 1px solid 分割线
- 禁止直角（最小 8px radius）
- 禁止为静态内容加阴影
