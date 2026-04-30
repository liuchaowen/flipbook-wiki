# Design System - 线条艺术与粉彩风格

## 1. 视觉主题与氛围

本设计系统以**清晰的线条艺术**为核心视觉语言，配以**柔和的粉彩色调**（浅蓝、柔绿和米色），营造出轻盈、优雅、现代且温馨的用户体验。界面如同精心绘制的插画，每一处细节都强调线条的韵律感与色彩的和谐统一。

**核心设计理念：**
- **线条为王**：所有视觉元素以清晰的线条勾勒，线宽一致，圆角柔和
- **粉彩为韵**：色彩以柔和的粉彩色调为主，避免高饱和度的刺眼颜色
- **留白为境**：充足的留白空间让界面呼吸，突出线条艺术的精致感
- **插画风格**：图标和装饰元素采用手绘线条艺术风格，增添人文温度

**关键特征：**
- 主色调：天际蓝 (`#7EB8DA`)、薄荷绿 (`#A8D5BA`)、暖米色 (`#F5E6D3`)
- 线条风格：1.5-2px 描边，圆角端点，柔和转角
- 背景处理：大面积米色或白色留白，点缀粉彩渐变
- 图标系统：线性图标，统一 2px 描边，圆角连接
- 插画元素：手绘风格的装饰线条、波浪、圆点图案

## 2. 色彩调色板

### 主色调（Primary Colors）

| 名称       | 色值      | CSS变量                 | 用途                         |
| ---------- | --------- | ----------------------- | ---------------------------- |
| **天际蓝** | `#7EB8DA` | `--color-primary-blue`  | 主要交互元素、链接、选中状态 |
| **薄荷绿** | `#A8D5BA` | `--color-primary-green` | 成功状态、积极反馈、次要强调 |
| **暖米色** | `#F5E6D3` | `--color-primary-beige` | 背景色、卡片底色、温暖基调   |

### 粉彩扩展色（Pastel Extended）

| 名称         | 色值      | CSS变量                   | 用途               |
| ------------ | --------- | ------------------------- | ------------------ |
| **淡紫丁香** | `#D4C4E0` | `--color-pastel-lavender` | 特殊强调、装饰元素 |
| **柔粉**     | `#F2D7D9` | `--color-pastel-pink`     | 提示、爱心、收藏   |
| **浅杏**     | `#FFDAB9` | `--color-pastel-apricot`  | 警告提示、高亮区域 |
| **淡柠檬**   | `#FFF9C4` | `--color-pastel-lemon`    | 信息提示、标签背景 |
| **雾蓝**     | `#B8D4E3` | `--color-pastel-mist`     | 悬停状态、次要背景 |

### 线条与文字色

| 名称     | 色值      | CSS变量             | 用途               |
| -------- | --------- | ------------------- | ------------------ |
| **墨线** | `#2D3436` | `--color-ink`       | 主要线条、标题文字 |
| **灰线** | `#636E72` | `--color-ink-light` | 次要线条、正文文字 |
| **淡线** | `#B2BEC3` | `--color-ink-muted` | 分割线、禁用状态   |
| **纯白** | `#FFFFFF` | `--color-white`     | 卡片背景、按钮文字 |

### 语义色

| 名称       | 色值      | CSS变量           | 用途                   |
| ---------- | --------- | ----------------- | ---------------------- |
| **成功绿** | `#A8D5BA` | `--color-success` | 成功状态（使用薄荷绿） |
| **警告橙** | `#FFDAB9` | `--color-warning` | 警告状态（使用浅杏）   |
| **错误红** | `#E8A0A0` | `--color-error`   | 错误状态（柔和的粉红） |
| **信息蓝** | `#7EB8DA` | `--color-info`    | 信息提示（使用天际蓝） |

### 渐变系统

```
/* 主渐变 - 天际到薄荷 */
linear-gradient(135deg, #7EB8DA 0%, #A8D5BA 100%)

/* 温暖渐变 - 米色到柔粉 */
linear-gradient(135deg, #F5E6D3 0%, #F2D7D9 100%)

/* 清新渐变 - 雾蓝到薄荷 */
linear-gradient(180deg, #B8D4E3 0%, #A8D5BA 100%)

/* 装饰渐变 - 淡紫到天际 */
linear-gradient(90deg, #D4C4E0 0%, #7EB8DA 100%)
```

## 3. 排版规则

### 字体家族

**主字体**：`Nunito` - 圆润友好的无衬线字体，与线条艺术风格完美契合

```css
font-family: 'Nunito', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

**备选字体**：
- 圆体风格：`Quicksand`, `Comfortaa`
- 中文场景：`PingFang SC`, `Microsoft YaHei`

### 字重系统

| 字重     | 数值 | 用途               |
| -------- | ---- | ------------------ |
| Light    | 300  | 装饰性文字、大标题 |
| Regular  | 400  | 正文、描述文字     |
| Medium   | 500  | 次级标题、强调文字 |
| SemiBold | 600  | 按钮文字、导航     |
| Bold     | 700  | 主标题、重要信息   |

### 字号层级

| 角色     | 字号            | 字重 | 行高 | 字间距  | 用途         |
| -------- | --------------- | ---- | ---- | ------- | ------------ |
| 超大标题 | 48px / 3rem     | 700  | 1.2  | -0.02em | 页面主标题   |
| 大标题   | 32px / 2rem     | 700  | 1.3  | -0.01em | 区块标题     |
| 中标题   | 24px / 1.5rem   | 600  | 1.4  | 0       | 卡片标题     |
| 小标题   | 20px / 1.25rem  | 600  | 1.4  | 0       | 组件标题     |
| 正文大   | 18px / 1.125rem | 400  | 1.6  | 0       | 重要正文     |
| 正文     | 16px / 1rem     | 400  | 1.6  | 0       | 默认正文     |
| 正文小   | 14px / 0.875rem | 400  | 1.5  | 0       | 次要文字     |
| 辅助文字 | 12px / 0.75rem  | 500  | 1.4  | 0.02em  | 标签、时间戳 |
| 微型文字 | 10px / 0.625rem | 500  | 1.2  | 0.05em  | 角标、提示   |

### 排版原则

- **圆润友好**：选择带有圆角的字体，与线条艺术的柔和感呼应
- **适度字间距**：标题略微收紧，小字略微放宽，提升可读性
- **宽松行高**：正文行高 1.5-1.6，让文字呼吸
- **层次分明**：通过字重和颜色区分层级，而非仅靠字号

## 4. 组件样式

### 按钮

**主要按钮（Primary Button）**
```css
/* 基础样式 */
background: linear-gradient(135deg, #7EB8DA 0%, #A8D5BA 100%);
color: #2D3436;
border: 2px solid transparent;
border-radius: 24px; /* 胶囊形状 */
padding: 12px 28px;
font-weight: 600;
font-size: 16px;
box-shadow: 0 4px 12px rgba(126, 184, 218, 0.3);

/* 悬停状态 */
background: linear-gradient(135deg, #6BA8CA 0%, #98C5A8 100%);
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(126, 184, 218, 0.4);

/* 按下状态 */
transform: translateY(0);
box-shadow: 0 2px 8px rgba(126, 184, 218, 0.3);
```

**次要按钮（Secondary Button）**
```css
/* 基础样式 */
background: transparent;
color: #2D3436;
border: 2px solid #7EB8DA;
border-radius: 24px;
padding: 12px 28px;
font-weight: 500;

/* 悬停状态 */
background: rgba(126, 184, 218, 0.1);
border-color: #6BA8CA;
```

**线条按钮（Outline Button）**
```css
/* 基础样式 - 纯线条风格 */
background: transparent;
color: #2D3436;
border: 2px solid #2D3436;
border-radius: 12px;
padding: 10px 24px;

/* 悬停状态 */
background: #2D3436;
color: #FFFFFF;
```

**图标按钮（Icon Button）**
```css
/* 圆形线条风格 */
background: transparent;
border: 2px solid #B2BEC3;
border-radius: 50%;
width: 44px;
height: 44px;
display: flex;
align-items: center;
justify-content: center;

/* 悬停状态 */
border-color: #7EB8DA;
background: rgba(126, 184, 218, 0.1);
```

### 卡片

**基础卡片**
```css
background: #FFFFFF;
border: 2px solid #B2BEC3;
border-radius: 16px;
padding: 24px;
box-shadow: none; /* 线条艺术不使用阴影 */
transition: all 0.3s ease;

/* 悬停状态 */
border-color: #7EB8DA;
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(126, 184, 218, 0.15);
```

**粉彩卡片**
```css
background: linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 100%);
border: 2px solid #D4C4E0;
border-radius: 20px;
padding: 28px;
```

**线条装饰卡片**
```css
background: #FFFFFF;
border: 2px solid #2D3436;
border-radius: 16px;
position: relative;

/* 顶部装饰线 */
&::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 20px;
  right: 20px;
  height: 4px;
  background: linear-gradient(90deg, #7EB8DA, #A8D5BA);
  border-radius: 0 0 4px 4px;
}
```

### 输入框

**文本输入框**
```css
background: #FFFFFF;
border: 2px solid #B2BEC3;
border-radius: 12px;
padding: 14px 18px;
font-size: 16px;
color: #2D3436;
transition: all 0.3s ease;

/* 聚焦状态 */
border-color: #7EB8DA;
box-shadow: 0 0 0 4px rgba(126, 184, 218, 0.2);

/* 错误状态 */
border-color: #E8A0A0;
box-shadow: 0 0 0 4px rgba(232, 160, 160, 0.2);
```

**搜索框**
```css
background: #F5E6D3;
border: 2px solid transparent;
border-radius: 32px; /* 胶囊形状 */
padding: 16px 24px 16px 52px; /* 左侧留出图标空间 */
font-size: 16px;

/* 聚焦状态 */
background: #FFFFFF;
border-color: #7EB8DA;
```

### 导航

**顶部导航**
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border-bottom: 2px solid #B2BEC3;
height: 72px;
padding: 0 32px;

/* 导航项 */
.nav-item {
  color: #636E72;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #2D3436;
  background: rgba(126, 184, 218, 0.1);
}

.nav-item.active {
  color: #2D3436;
  background: linear-gradient(135deg, rgba(126, 184, 218, 0.2), rgba(168, 213, 186, 0.2));
  border-bottom: 3px solid #7EB8DA;
}
```

**底部导航（移动端）**
```css
background: #FFFFFF;
border-top: 2px solid #B2BEC3;
height: 64px;
padding: 0 16px;

/* 导航图标 */
.nav-icon {
  stroke: #636E72;
  stroke-width: 2;
  fill: none;
}

.nav-item.active .nav-icon {
  stroke: #7EB8DA;
  fill: rgba(126, 184, 218, 0.2);
}
```

### 标签与徽章

**粉彩标签**
```css
background: rgba(126, 184, 218, 0.2);
color: #2D3436;
border: 1.5px solid #7EB8DA;
border-radius: 20px;
padding: 6px 14px;
font-size: 12px;
font-weight: 500;
```

**状态徽章**
```css
/* 成功 */
background: rgba(168, 213, 186, 0.3);
color: #5A8A6A;
border: 1.5px solid #A8D5BA;

/* 警告 */
background: rgba(255, 218, 185, 0.3);
color: #B8865A;
border: 1.5px solid #FFDAB9;

/* 错误 */
background: rgba(232, 160, 160, 0.3);
color: #A86060;
border: 1.5px solid #E8A0A0;
```

### 图片处理

**图片容器**
```css
border: 2px solid #B2BEC3;
border-radius: 16px;
overflow: hidden;

/* 悬停效果 */
&:hover {
  border-color: #7EB8DA;
}
```

**图片比例**
- 主图：4:3 或 16:9
- 缩略图：1:1
- 卡片封面：3:2

**装饰性图片边框**
```css
/* 波浪装饰边框 */
border: 2px dashed #D4C4E0;
border-radius: 16px;
padding: 8px;
```

### 图标系统

**线条图标规范**
- 描边宽度：2px
- 端点样式：圆角 (`stroke-linecap: round`)
- 连接样式：圆角 (`stroke-linejoin: round`)
- 默认尺寸：24px × 24px
- 大图标：32px × 32px
- 小图标：16px × 16px

**图标颜色规则**
```css
/* 默认状态 */
stroke: #636E72;
fill: none;

/* 悬停状态 */
stroke: #7EB8DA;

/* 激活状态 */
stroke: #2D3436;
fill: rgba(126, 184, 218, 0.2);
```

## 5. 布局原则

### 间距系统

**基础单位**：8px

| 名称 | 数值 | 用途              |
| ---- | ---- | ----------------- |
| 极小 | 4px  | 图标与文字间距    |
| 小   | 8px  | 紧凑元素间距      |
| 中   | 16px | 组件内部间距      |
| 大   | 24px | 区块间距          |
| 超大 | 32px | 区块外边距        |
| 巨大 | 48px | 页面区块间距      |
| 特大 | 64px | 页面顶部/底部间距 |

### 网格系统

- **最大内容宽度**：1280px
- **列数**：12列
- **列间距**：24px（桌面端）、16px（移动端）
- **页面边距**：24px（移动端）、48px（平板）、64px（桌面端）

### 圆角系统

| 名称     | 数值 | 用途             |
| -------- | ---- | ---------------- |
| 小圆角   | 4px  | 标签、小徽章     |
| 中圆角   | 8px  | 输入框、小按钮   |
| 大圆角   | 12px | 卡片、下拉菜单   |
| 超大圆角 | 16px | 大卡片、图片容器 |
| 胶囊圆角 | 24px | 主按钮、搜索框   |
| 全圆     | 50%  | 图标按钮、头像   |

### 留白哲学

线条艺术风格强调**呼吸感**，留白是设计的重要组成部分：
- 内容区域与边界的距离至少 24px
- 卡片之间的间距至少 24px
- 文字段落之间至少 16px
- 标题与正文之间至少 12px

## 6. 深度与层次

### 层次系统

线条艺术风格不依赖阴影创造层次，而是通过**线条粗细**、**颜色深浅**和**留白**来区分：

| 层级    | 表现方式                 | 用途     |
| ------- | ------------------------ | -------- |
| 1级背景 | 米色/白色背景，无边框    | 页面底色 |
| 2级容器 | 2px 淡线边框 (`#B2BEC3`) | 次要容器 |
| 3级容器 | 2px 墨线边框 (`#2D3436`) | 主要容器 |
| 4级强调 | 粉彩背景 + 墨线边框      | 强调区域 |
| 5级交互 | 天际蓝边框 + 粉彩背景    | 交互元素 |

### 悬停与交互层次

```css
/* 默认状态 */
.card {
  border: 2px solid #B2BEC3;
  transform: none;
}

/* 悬停状态 */
.card:hover {
  border: 2px solid #7EB8DA;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(126, 184, 218, 0.15);
}

/* 激活状态 */
.card:active {
  border: 2px solid #2D3436;
  transform: translateY(-2px);
}
```

### 装饰性层次

**波浪线装饰**
```css
/* 底部波浪分隔线 */
.wave-divider {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%237EB8DA' opacity='0.3'/%3E%3C/svg%3E");
  height: 60px;
}
```

**圆点装饰**
```css
.dots-pattern {
  background-image: radial-gradient(#D4C4E0 2px, transparent 2px);
  background-size: 16px 16px;
}
```

**线条装饰**
```css
.lines-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(126, 184, 218, 0.1) 8px,
    rgba(126, 184, 218, 0.1) 16px
  );
}
```

## 7. 动效规范

### 过渡时间

| 类型 | 时长  | 用途               |
| ---- | ----- | ------------------ |
| 快速 | 150ms | 按钮状态、图标变化 |
| 标准 | 300ms | 卡片悬停、展开收起 |
| 慢速 | 500ms | 页面过渡、大型动画 |

### 缓动函数

```css
/* 标准缓动 */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性缓动 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 平滑缓动 */
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### 常用动画

**淡入淡出**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**线条绘制**
```css
@keyframes drawLine {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animated-line {
  stroke-dasharray: 1000;
  animation: drawLine 1.5s ease-out forwards;
}
```

**弹跳效果**
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

## 8. 响应式设计

### 断点系统

| 名称     | 宽度            | 描述               |
| -------- | --------------- | ------------------ |
| 移动端   | < 640px         | 小屏手机           |
| 平板竖屏 | 640px - 768px   | 大屏手机、小平板   |
| 平板横屏 | 768px - 1024px  | 平板设备           |
| 桌面端   | 1024px - 1280px | 笔记本、小屏显示器 |
| 大屏     | > 1280px        | 桌面显示器         |

### 响应式策略

**移动端优先**
- 基础样式针对移动端设计
- 使用 `min-width` 媒体查询逐步增强

**触控目标**
- 最小触控区域：44px × 44px
- 按钮间距至少 8px

**布局变化**
```css
/* 移动端：单列布局 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* 平板：两列布局 */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* 桌面：三列布局 */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

## 9. 图标与插画

### 图标设计原则

1. **线条统一**：所有图标使用 2px 描边
2. **圆角端点**：使用圆角端点和连接
3. **视觉平衡**：图标在 24px 画布中保持视觉重心居中
4. **简洁明了**：每个图标只表达一个含义

### 装饰插画风格

**线条艺术插画特点**：
- 单色线条勾勒，不填充或仅填充粉彩色
- 线条流畅、有机，带有手绘感
- 人物和物体采用简约几何造型
- 背景使用粉彩渐变或留白

**插画配色**：
- 线条颜色：`#2D3436`（墨线）
- 填充颜色：天际蓝、薄荷绿、暖米色的粉彩变体
- 装饰元素：淡紫丁香、柔粉点缀

## 10. Do's and Don'ts

### Do ✅

- 使用清晰的线条勾勒所有元素
- 保持粉彩色调的柔和与统一
- 为交互元素提供明确的视觉反馈
- 使用充足的留白让界面呼吸
- 保持线条粗细的一致性（2px 为主）
- 使用圆角让界面更加友好
- 在悬停时添加微妙的颜色变化
- 使用渐变时保持柔和过渡

### Don't ❌

- 不要使用高饱和度的颜色
- 不要使用粗重的阴影效果
- 不要让界面过于拥挤
- 不要混用多种线条粗细
- 不要使用尖锐的直角（使用圆角）
- 不要忽略触控目标的最小尺寸
- 不要在粉彩背景上使用浅色文字
- 不要过度使用装饰元素

## 11. AI Agent 提示指南

### 快速颜色参考

- 主色调：天际蓝 (`#7EB8DA`)、薄荷绿 (`#A8D5BA`)、暖米色 (`#F5E6D3`)
- 线条色：墨线 (`#2D3436`)、灰线 (`#636E72`)、淡线 (`#B2BEC3`)
- 强调色：淡紫丁香 (`#D4C4E0`)、柔粉 (`#F2D7D9`)
- 语义色：成功 (`#A8D5BA`)、警告 (`#FFDAB9`)、错误 (`#E8A0A0`)

### 组件创建示例提示

**创建主按钮**：
> "创建一个主要按钮：使用天际蓝到薄荷绿的渐变背景（`linear-gradient(135deg, #7EB8DA 0%, #A8D5BA 100%)`），墨线色文字（`#2D3436`），胶囊圆角（24px），内边距 12px 28px，字重 600，字号 16px，悬停时上移 2px 并加深渐变色。"

**创建卡片**：
> "创建一个线条艺术风格的卡片：白色背景，2px 淡线边框（`#B2BEC3`），16px 圆角，24px 内边距，无阴影，悬停时边框变为天际蓝（`#7EB8DA`）并上移 4px，添加柔和的粉彩阴影（`0 8px 24px rgba(126, 184, 218, 0.15)`）。"

**创建输入框**：
> "创建一个文本输入框：白色背景，2px 淡线边框（`#B2BEC3`），12px 圆角，14px 内边距，聚焦时边框变为天际蓝并添加 4px 的天际蓝 20% 透明度外发光。"

**创建导航项**：
> "创建一个导航项：灰线色文字（`#636E72`），字重 500，8px 内边距，8px 圆角，悬停时文字变为墨线色并添加天际蓝 10% 透明度背景，激活状态使用天际蓝到薄荷绿的渐变背景并添加 3px 天际蓝底边框。"

### 迭代指南

当使用此设计系统优化现有界面时：

1. **逐步迁移**：一次只修改一个组件
2. **引用颜色名称**：使用"天际蓝"而非"蓝色"，使用"墨线"而非"黑色"
3. **强调线条**：所有边框使用 2px 描边风格
4. **保持柔和**：颜色、圆角、过渡都应该是柔和的
5. **添加留白**：确保元素之间有足够的呼吸空间
6. **检查对比度**：粉彩背景上的文字需要足够的对比度

### 常见问题解决

**问题**：界面看起来太"平"
**解决**：添加微妙的粉彩渐变背景或装饰性线条图案

**问题**：颜色看起来太淡
**解决**：使用墨线色（`#2D3436`）作为文字和重要线条的颜色

**问题**：缺乏层次感
**解决**：通过线条粗细（淡线 vs 墨线）和背景色深浅来区分层次

**问题**：交互元素不明显
**解决**：为交互元素添加天际蓝边框和悬停状态变化

---

## 12. 设计令牌（Design Tokens）

### CSS 变量汇总

```css
:root {
  /* 主色调 */
  --color-primary-blue: #7EB8DA;
  --color-primary-green: #A8D5BA;
  --color-primary-beige: #F5E6D3;

  /* 粉彩扩展 */
  --color-pastel-lavender: #D4C4E0;
  --color-pastel-pink: #F2D7D9;
  --color-pastel-apricot: #FFDAB9;
  --color-pastel-lemon: #FFF9C4;
  --color-pastel-mist: #B8D4E3;

  /* 线条与文字 */
  --color-ink: #2D3436;
  --color-ink-light: #636E72;
  --color-ink-muted: #B2BEC3;
  --color-white: #FFFFFF;

  /* 语义色 */
  --color-success: #A8D5BA;
  --color-warning: #FFDAB9;
  --color-error: #E8A0A0;
  --color-info: #7EB8DA;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 24px;
  --radius-full: 50%;

  /* 线条宽度 */
  --stroke-thin: 1px;
  --stroke-default: 2px;
  --stroke-thick: 3px;

  /* 字重 */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-standard: 300ms ease;
  --transition-slow: 500ms ease;

  /* 阴影 */
  --shadow-soft: 0 8px 24px rgba(126, 184, 218, 0.15);
  --shadow-hover: 0 6px 16px rgba(126, 184, 218, 0.4);
}
```

---

*此设计系统文档旨在帮助快速迁移站点风格至"清晰的线条艺术，配以柔和的粉彩色调"风格。所有颜色、组件样式和布局原则都围绕这一核心美学进行设计。*
