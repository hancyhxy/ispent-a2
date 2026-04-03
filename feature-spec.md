# Money Tracker — Feature Specification

> 三个页面的完整功能定义，包含所有 CRUD 状态、交互流程和边界情况。

---

## 1. Bills（账单）

### 1.1 顶部汇总区

- 当月支出总额（display 字号，decline 色 `#EF4444`）
- 当月收入总额（display 字号，growth 色 `#10B981`）
- 数据随全局月份选择器联动

### 1.2 记录列表

#### 分组规则

- 按日期分组，倒序排列（最新在上）
- 每组标题：日期 + 当日支出小计 + 当日收入小计

#### 单条记录展示

- 左侧：分类图标（emoji）
- 中间：分类名 + 备注（备注用 `text_muted`）
- 右侧：金额（支出 decline 色带 `-` 号，收入 growth 色带 `+` 号）

#### 空状态

- 无记录时显示引导文案："No records yet. Tap + to add your first one."

#### 记录交互

- 点击某条 → 弹出编辑 Modal（见 1.4）
- 无左滑删除，删除统一在编辑 Modal 内

### 1.3 新建记录（Create）

**入口**：页面右上角「+ Add Record」按钮

弹出 Modal，包含以下模块：

#### 1.3.1 类型选择

- Expense / Income 两个 Tab
- 默认选中 Expense
- 切换时下方分类图标跟着变

#### 1.3.2 分类选择

- 图标网格布局（3-4 列）
- 点选后高亮（primary 色背景 10% + primary 色图标边框）
- 必选，未选时不可保存

**支出分类（9 个）**：

| 图标 | Key | 名称 |
|------|-----|------|
| 🍕 | food | Food |
| 🛒 | shopping | Shopping |
| 🚗 | transport | Transport |
| 🎮 | entertainment | Entertainment |
| 🏠 | housing | Housing |
| 📚 | education | Education |
| 💊 | health | Health |
| 🧴 | daily | Daily |
| 💡 | other | Other |

**收入分类（5 个）**：

| 图标 | Key | 名称 |
|------|-----|------|
| 💰 | salary | Salary |
| 💼 | freelance | Freelance |
| 🧧 | transfer | Transfer |
| 🔙 | refund | Refund |
| 💡 | other | Other |

#### 1.3.3 金额输入

- Modal 打开后自动聚焦（useRef）
- 数字输入，支持小数点（最多 2 位）
- 必填，为 0 或空时不可保存
- 前缀显示 `$` 符号

#### 1.3.4 备注输入

- 单行文本框，placeholder: "Add a note..."
- 可选，可留空
- 快捷备注标签：
  - 预设标签：lunch / dinner / grocery / daily / transport
  - 点击标签 → 自动填入备注框
  - 手动输入会覆盖标签内容

#### 1.3.5 日期选择

- 默认今天
- 点击弹出日期选择器（日历组件）
- 可选过去日期，不可选未来日期

#### 1.3.6 保存操作

**「Save」按钮**：
- 校验通过 → `POST /api/records`
- 成功 → Toast "Record added" + 关闭 Modal + 列表刷新
- 失败 → Toast "Failed to save"（error 色）

**「Save & Add Another」按钮**：
- 保存成功后不关闭 Modal
- 清空金额和备注，保留类型和分类选择
- Toast "Record added" + 光标回到金额输入框

**关闭/取消**：
- 点击遮罩关闭
- 有未保存内容 → 无需确认，直接关闭（降低摩擦）
- Modal 关闭动画：淡出

#### 1.3.7 表单校验规则

| 字段 | 规则 | 错误提示 |
|------|------|---------|
| 分类 | 必选 | "Please select a category" |
| 金额 | 必填 & > 0 | "Please enter a valid amount" |
| 备注 | 可选 | — |
| 日期 | 必填，默认今天，不可选未来 | — |

### 1.4 编辑记录（Update）

**入口**：点击列表中任一记录

弹出编辑 Modal（复用新建 Modal 结构）：
- 所有字段预填充当前记录数据
- 类型（Expense/Income）可切换
- 分类可重新选择
- 金额可修改
- 备注可修改
- 日期可修改

**保存**：
- 「Save」→ `PUT /api/records/:id`
- 成功 → Toast "Record updated" + 关闭 + 列表刷新
- 失败 → Toast "Failed to update"

**注意**：编辑 Modal 没有「Save & Add Another」按钮

**删除入口**：在编辑 Modal 内（见 1.5）

### 1.5 删除记录（Delete）

**入口**：编辑 Modal 底部的「Delete」按钮（error 色文字）

**二次确认弹窗**：
- 标题："Delete this record?"
- 内容：显示将要删除的记录摘要（分类 + 金额 + 日期）
- 「Cancel」→ 关闭确认弹窗，回到编辑 Modal
- 「Delete」→ `DELETE /api/records/:id`

**结果**：
- 成功 → Toast "Record deleted" + 关闭编辑 Modal + 列表刷新
- 失败 → Toast "Failed to delete"

### 1.6 数据查询（Read）

**页面加载时**：
- `GET /api/records?month=当前月份`

**月份切换时**：
- `GET /api/records?month=选中月份` → 列表和汇总同时刷新

**前端数据处理**：
- 按日期分组
- 计算顶部汇总（支出总额、收入总额）
- 按日期倒序排列

### 1.7 API 接口

| 操作 | 方法 | 端点 |
|------|------|------|
| 创建记录 | POST | `/api/records` |
| 查询列表 | GET | `/api/records?month=2026-04` |
| 修改记录 | PUT | `/api/records/:id` |
| 删除记录 | DELETE | `/api/records/:id` |

### 1.8 数据模型

```json
{
  "_id": "ObjectId",
  "type": "expense | income",
  "category": "food",
  "amount": 15.00,
  "note": "学校食堂",
  "date": "2026-04-03",
  "createdAt": "2026-04-03T17:44:00Z"
}
```

---

## 2. Analysis（分析）

> 纯展示页面，无 CRUD 操作入口。

### 2.1 月度概览卡片区

4 个卡片横向排列：

#### 2.1.1 支出总额

- 标题："Total Expense"（caption, `text_muted`）
- 金额：display 字号，decline 色
- 数据：当月所有 type=expense 记录 `sum(amount)`

#### 2.1.2 收入总额

- 标题："Total Income"
- 金额：display 字号，growth 色
- 数据：当月所有 type=income 记录 `sum(amount)`

#### 2.1.3 结余

- 标题："Balance"
- 金额：display 字号
- 正数 → growth 色，负数 → decline 色
- 计算：收入总额 - 支出总额

#### 2.1.4 记账笔数

- 标题："Records"
- 数值：display 字号，`text_primary` 色
- 数据：当月所有记录 count

### 2.2 分类占比（Category Breakdown）

#### 2.2.1 切换 Tab

- Expense / Income 切换
- 默认展示 Expense
- 切换后环形图和排行列表同时更新

#### 2.2.2 环形图（Donut Chart）

- 宽描边（32px+），保持透气感
- 中间显示总金额（如 "$2,408"）
- 每个分类一个色段（从预定义色板中分配）
- hover 时高亮该色段 + 显示 tooltip（分类名 + 金额 + 百分比）
- 右侧图例：色块 + 分类名，纵向排列
- 无数据时：灰色空环 + "No expense data"

#### 2.2.3 分类排行列表

- 紧跟在环形图下方
- 按金额降序排列
- 每行：分类图标 + 分类名 + 百分比 + 金额
- 百分比用 `text_muted`，金额用 `text_primary`
- 金额为 0 的分类不显示

### 2.3 支出趋势（Expense Trend）

#### 2.3.1 图表类型

- 柱状图（Bar Chart），圆角端点

#### 2.3.2 数据维度

- X 轴：当月每一天（1, 2, 3 ... 30）
- Y 轴：金额
- 每根柱子 = 当天支出总额
- 无支出的天数柱子高度为 0（不隐藏）

#### 2.3.3 平均线

- 水平虚线，标注 "Avg: $XX"
- 计算：当月支出总额 / 当月已过天数

#### 2.3.4 交互

- hover 柱子 → tooltip 显示日期 + 当日金额
- 无数据月份 → 空图表 + "No data for this month"

#### 2.3.5 图表样式

- 柱子颜色：primary 色
- 平均线：warning 色虚线
- 轴标签：caption 字号，`text_muted` 色

### 2.4 收支对比（Income vs Expense）— 可选

> 时间允许时做，非核心功能。

- 图表类型：分组柱状图
- X 轴：近 6 个月月份名
- 每月两根柱子：Expense（decline 色）+ Income（growth 色）
- hover → tooltip 显示月份 + 两个金额
- 图例：Expense / Income

### 2.5 数据查询

**页面加载时**：
- `GET /api/stats/monthly?month=当前月份` → 概览卡片
- `GET /api/stats/categories?month=当前月份&type=expense` → 分类占比
- `GET /api/stats/daily?month=当前月份` → 支出趋势

**月份切换时**：
- 以上接口全部重新请求

**Expense/Income Tab 切换时**：
- `GET /api/stats/categories?month=当前月份&type=切换后的类型`

**收支对比（如果做）**：
- `GET /api/stats/trend?months=6`

### 2.6 API 接口

| 用途 | 方法 | 端点 |
|------|------|------|
| 月度汇总 | GET | `/api/stats/monthly?month=2026-04` |
| 分类统计 | GET | `/api/stats/categories?month=2026-04&type=expense` |
| 每日趋势 | GET | `/api/stats/daily?month=2026-04` |
| 跨月对比 | GET | `/api/stats/trend?months=6` |

---

## 3. Goals（预算目标）

### 3.1 预算列表

#### 3.1.1 卡片展示

每个分类预算一张卡片：
- 左侧：分类图标（emoji）+ 分类名
- 右侧：已花金额 / 预算金额（如 "$320 / $500"）+ 百分比
- 下方：进度条

#### 3.1.2 进度条颜色逻辑

| 百分比 | 颜色 | 状态 |
|--------|------|------|
| < 70% | success `#22C55E` | 安全 |
| 70% - 100% | warning `#F97316` | 警告 |
| > 100% | error `#DC2626` | 超支，进度条溢出部分用更深 error 色 |

#### 3.1.3 已花金额计算

- 从 records 表聚合：当月 + 该分类 + type=expense 的 `sum(amount)`
- 不存储，实时计算

#### 3.1.4 排序规则

- 按百分比降序（最接近或已超支的排最前）

#### 3.1.5 空状态

- "No budgets set. Tap + to create your first budget goal."

### 3.2 新建预算（Create）

**入口**：页面右上角「+ Add Budget」按钮

弹出 Modal：

#### 3.2.1 选择分类

- 图标网格，仅显示支出分类（9 个）
- 已有预算的分类置灰不可选（每个分类每月只能设一个预算）
- 必选

#### 3.2.2 输入预算金额

- 数字输入，支持小数（最多 2 位）
- 必填 & > 0
- 前缀 `$` 符号

#### 3.2.3 月份

- 自动使用全局月份选择器的当前月份，不可单独修改

#### 3.2.4 保存

- 「Save」→ `POST /api/budgets`
- 成功 → Toast "Budget created" + 关闭 Modal + 列表刷新
- 失败 → Toast "Failed to create budget"

#### 3.2.5 校验规则

| 字段 | 规则 | 错误提示 |
|------|------|---------|
| 分类 | 必选 | "Please select a category" |
| 金额 | 必填 & > 0 | "Please enter a valid budget amount" |
| 重复检查 | 该月该分类已有预算 | 前端置灰不可选 + 后端返回 409 |

### 3.3 编辑预算（Update）

**入口**：点击预算卡片

弹出编辑 Modal：
- 分类显示但不可修改（只读，带图标）
- 预算金额可修改
- 月份不可修改

**保存**：
- 「Save」→ `PUT /api/budgets/:id`
- 成功 → Toast "Budget updated" + 关闭 + 列表刷新
- 失败 → Toast "Failed to update"

**删除入口**：在编辑 Modal 内（见 3.4）

### 3.4 删除预算（Delete）

**入口**：编辑 Modal 底部「Delete」按钮（error 色文字）

**二次确认弹窗**：
- 标题："Delete this budget?"
- 内容："Remove the $500 budget for Food?"
- 「Cancel」→ 回到编辑 Modal
- 「Delete」→ `DELETE /api/budgets/:id`

**结果**：
- 成功 → Toast "Budget deleted" + 关闭 Modal + 列表刷新
- 失败 → Toast "Failed to delete"

### 3.5 数据查询（Read）

**页面加载时**：
- `GET /api/budgets?month=当前月份` → 预算列表
- 每条预算的已花金额通过后端聚合返回

**月份切换时**：
- 重新请求 → 预算列表和进度全部更新

### 3.6 API 接口

| 操作 | 方法 | 端点 |
|------|------|------|
| 创建预算 | POST | `/api/budgets` |
| 查询预算列表 | GET | `/api/budgets?month=2026-04` |
| 修改预算 | PUT | `/api/budgets/:id` |
| 删除预算 | DELETE | `/api/budgets/:id` |

### 3.7 数据模型

```json
{
  "_id": "ObjectId",
  "category": "food",
  "budgetAmount": 500.00,
  "month": "2026-04"
}
```

---

## 4. CRUD 覆盖总览

| 操作 | Bills | Analysis | Goals |
|------|-------|----------|-------|
| Create | 记一笔（Modal） | — | 创建预算（Modal） |
| Read | 明细列表 + 汇总 | 全部图表和卡片 | 预算进度列表 |
| Update | 编辑记录（Modal） | — | 修改预算金额（Modal） |
| Delete | 删除记录（二次确认） | — | 删除预算（二次确认） |

---

## 5. 全局行为

### 5.1 月份选择器

- 位于顶部栏右侧，全局唯一筛选控件
- 切换后当前页面所有数据自动刷新
- 默认当前月份

### 5.2 Modal 通用规则

- 居中弹出，背景遮罩（毛玻璃）
- 点击遮罩可关闭
- 关闭时无需确认未保存内容

### 5.3 Toast 通用规则

- 操作成功/失败后右上角弹出
- 自动消失（2-3 秒）
- 成功：默认样式；失败：error 色

### 5.4 二次确认通用规则

- 仅删除操作触发
- 确认弹窗需明确说明删除内容
- 「Cancel」+ 「Delete」两个按钮
