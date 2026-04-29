# 部署指南

## Vercel 部署（推荐）

本项目使用 Next.js API Routes，推荐部署到 Vercel，原生支持服务端功能。

### 步骤 1：推送代码到 GitHub

确保 `.env.local` 文件已在 `.gitignore` 中（已配置），不要将 API Keys 提交到仓库。

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 步骤 2：在 Vercel 导入项目

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库
4. 点击 "Import"

### 步骤 3：配置环境变量

在 Vercel 项目设置中添加环境变量：

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加以下变量：

| 变量名               | 值                                                                   | 环境                             |
| -------------------- | -------------------------------------------------------------------- | -------------------------------- |
| `OPENAI_API_KEY`     | `sk-hy1RRAbEQrACoQBjutfLkHsKOwpQPjkYnPmNvyzaDLzCSTgo`                | Production, Preview, Development |
| `OPENAI_BASE_URL`    | `https://yunwu.ai/v1`                                                | Production, Preview, Development |
| `DASHSCOPE_BASE_URL` | `https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1` | Production, Preview, Development |
| `DASHSCOPE_API_KEY`  | `sk-sp-djI...` (你的完整 key)                                        | Production, Preview, Development |

### 步骤 4：部署

点击 "Deploy" 按钮，Vercel 会自动构建和部署。

## 安全说明

- ✅ 环境变量在 Vercel Dashboard 中加密存储
- ✅ 不会暴露在客户端代码中
- ✅ API Routes 在服务端执行，API Keys 不会泄露
- ⚠️ 永远不要将 `.env.local` 提交到 Git 仓库

## 本地开发

复制 `.env.local.example` 为 `.env.local` 并填入你的 API Keys：

```bash
cp .env.local.example .env.local
```

然后运行：

```bash
npm install
npm run dev