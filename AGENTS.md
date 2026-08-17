# AGENTS.md

## 项目概览

内容工厂 MVP —— 高保真前端原型（Mock 数据）。

依据 SPEC v0.7 实现 5 条核心路由的 UI 与交互：找低粉爆款对标 → 共性提炼 → AI 二创 → 创作记录。

**当前阶段**：纯前端原型，所有数据来自 `src/lib/mock-data.ts`，页面顶部和页面内显式标注 **MOCK 数据** 徽标，不发起任何外部付费请求。

## 版本技术栈

- Framework: Next.js 16 (App Router)
- Core: React 19
- Language: TypeScript 5
- UI 组件: shadcn/ui（位于 `src/components/ui/`）
- Styling: Tailwind CSS 4
- 表格: @tanstack/react-table ^8.21
- 表单: react-hook-form + @hookform/resolvers + zod
- 图标: lucide-react

## 目录结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局（字体、metadata、cn 注入）
│   ├── page.tsx                # 根路径 → /benchmarks
│   ├── globals.css             # Tailwind v4 + Design Tokens
│   ├── login/page.tsx          # 单用户登录
│   ├── benchmarks/
│   │   ├── page.tsx            # 找对标（搜索表单 + 最近 20 次）
│   │   └── [runId]/
│   │       ├── page.tsx        # 服务端壳
│   │       └── client.tsx      # 搜索结果：表格/Top5/词云/勾选/二创抽屉
│   ├── create/[jobId]/
│   │   ├── page.tsx
│   │   └── client.tsx          # AI 二创：步骤 + 图文卡片 + 视频分镜
│   ├── creations/page.tsx      # 创作记录
│   └── settings/page.tsx       # 连通性/模板/品牌设置
├── components/
│   ├── layout/
│   │   ├── app-chrome.tsx      # 左侧导航 + 顶部栏 + MobileNav 容器
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── mobile-nav.tsx
│   └── ui/                     # shadcn/ui
├── lib/
│   ├── utils.ts                # cn, formatNumber, formatRead, formatInteraction, formatDateTime, normalizeText, isWeChatUrl
│   ├── mock-types.ts           # 所有领域类型
│   └── mock-data.ts            # 20 条文章夹具 + run + 词云 + 创作记录
└── hooks/
```

## 运行与构建

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动开发服务（端口由 `${DEPLOY_RUN_PORT}` 决定，默认 5000） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务 |
| `pnpm lint` | ESLint |
| `pnpm ts-check` | TypeScript 类型检查 |

## 设计语言

详见 [`DESIGN.md`](./DESIGN.md)。要点：

- 暖纸背景 `#F7F5F2`，墨色文字 `#171717`，主行动色 `#F0642B`
- 左侧导航 220 px / 顶部 64 px；桌面 1440 基准；`< 768 px` 卡片化
- 高信息密度的编辑部工具风格，禁止使用通用 AI 后台紫蓝渐变

## 关键产品规则（与 SPEC 对齐）

- **低粉阈值**：搜索表单默认 `1000`，可修改；判定规则 `fans <= threshold && read > avg_top_read * 3`。
- **标签**：`low_fan_viral | data_missing | pending | not_matched`；三态同时使用颜色 + 图标 + 文字。
- **互动率**：`(praise + looking) / read * 100%`；`read=100001` 表示"10万+"，只显示上界、不进精确 Top5。
- **字段可见性**：全列 missing/null/空字符串/空数组/空对象才隐藏；数字 `0` 与布尔 `false` 是有效值。
- **枚举码**：`is_original/has_notifier/item_show_type` 只显示官方字段名 + 原始码，不自行翻译为"是/否"。
- **正文展示**：`content` 作为纯文本 `white-space: pre-wrap` 展示，不自动 linkify，不使用 `dangerouslySetInnerHTML`。
- **外链安全**：原文链接只允许 `https://mp.weixin.qq.com/`，`rel="noopener noreferrer"`，新窗口打开。
- **Mock 状态**：顶部栏和每个页面顶部都有 `Mock 数据` Badge，明确告知用户未连真实供应商。

## 已知边界（原型阶段）

以下在原型中**未实现**，需进入 B 阶段（真实数据接入）后补全：

1. 微信文章搜索 API、公众号活跃数据 API、火山方舟文本/图片模型的真实调用
2. Neon PostgreSQL + Drizzle schema（40+ 表）与迁移
3. Vercel Workflow 持久异步任务、outbox 补派发、lease/fencing
4. Argon2 单管理员登录、CSRF Token、IP 失败锁定（目前 `/login` 仅 UI）
5. 图片底图真实生成、私有 Blob 转存、1080×1440 模板渲染、ZIP 导出
6. 6-of-10 质量 sampling、validation plan、append-only edit interval heartbeat
7. 5 个 topic case 审计、30 分钟 discovery session 计时闭环
8. Playwright E2E 50+ 条

## 静态检查与测试

- `pnpm lint` 与 `pnpm ts-check` 必须通过。
- 通过 `test_run` 工具对 6 条路由做冒烟：`/login`、`/benchmarks`、`/benchmarks/[runId]`、`/create/[jobId]`、`/creations`、`/settings` 全部 200。

## 代码规范

- 禁止隐式 `any`；所有函数参数、解构项标注类型。
- 禁止使用 `as any`；类型收窄后再访问字段。
- 禁止 `typeof window / Date.now() / Math.random()` 在 SSR 渲染路径；需要时加 `'use client'` + `useEffect/useState`。
- 禁止在 `<head>` 中手写标签；用 `metadata` 或 `ReactDOM.preload/preconnect`。
- 外部资源（字体、图片）统一走 HTTPS；CN 环境优先 `.cn` 域。
