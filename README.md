# Flipbook - AI 可视化探索

类似 flipbook.page 的 AI 可视化探索站点。输入任何主题，AI 将为你生成可视化图像，点击图像中的任意区域，深入探索更多内容。

## 核心概念

**"The AI doesn't generate code. The AI IS the render."**

- 用户输入提示词 → AI 生成整张可视化信息图
- 点击图中任意区域 → AI "展开"该区域生成新视图
- 无限钻取，探索无限层级的可视化内容

## 技术栈

- **Next.js 14+** (App Router)
- **React 18+** + TypeScript
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画效果
- **Zustand** - 状态管理
- **OpenAI API** - DALL-E 3 (图像生成) + GPT-4 Vision (区域识别)

## 项目结构

```
flipbook-wiki/
├── app/
│   ├── page.tsx                 # 主页面
│   ├── layout.tsx               # 根布局
│   └── api/
│       ├── generate/route.ts    # 图像生成 API
│       ├── analyze/route.ts     # 区域分析 API
│       └── expand/route.ts      # 展开生成 API
├── components/
│   ├── FlipbookViewer.tsx       # 主视图组件
│   ├── CanvasViewer.tsx         # Canvas 画布组件
│   └── PromptInput.tsx          # 提示词输入组件
├── lib/
│   ├── store.ts                 # Zustand 状态管理
│   └── ai/
│       └── openai.ts            # OpenAI 集成
├── types/
│   └── index.ts                 # 类型定义
└── .env.local.example           # 环境变量示例
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入你的 OpenAI API Key：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 功能说明

### 输入主题生成图像

在首页输入任何你想探索的主题，选择风格，点击"生成"按钮。AI 将为你生成一张包含多个相关元素的可视化信息图。

### 点击探索

生成图像后，点击图像中的任意区域，AI 将：
1. 识别该区域的元素名称和描述
2. 判断该区域是否可以进一步展开
3. 如果可展开，询问是否生成展开视图

### 无限展开

对感兴趣的区域继续展开，AI 将生成新的可视化图像，展示更多细节。支持前进/后退导航，随时返回之前的视图。

## API 说明

### POST /api/generate

生成可视化图像。

请求体：
```json
{
  "prompt": "巴黎旅游攻略",
  "style": "infographic"
}
```

### POST /api/analyze

分析点击区域。

请求体：
```json
{
  "imageId": "xxx",
  "imageUrl": "https://...",
  "position": { "x": 320, "y": 480, "imageWidth": 1024, "imageHeight": 1024 },
  "context": "巴黎旅游攻略"
}
```

### POST /api/expand

展开区域生成新图像。

请求体：
```json
{
  "imageId": "xxx",
  "regionName": "卢浮宫",
  "regionDescription": "世界著名艺术博物馆",
  "expandType": "detail",
  "parentContext": "巴黎旅游攻略"
}
```

## 部署

推荐使用 Vercel 部署：

1. 将代码推送到 GitHub
2. 在 Vercel 创建新项目
3. 设置环境变量 `OPENAI_API_KEY`
4. 部署完成

## 注意事项

- OpenAI API 调用需要费用，建议设置使用限制
- 图像生成约需 10-20 秒，请耐心等待
- 首次使用需要配置有效的 OpenAI API Key

## License

MIT
