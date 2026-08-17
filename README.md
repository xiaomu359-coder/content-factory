# 内容工厂 MVP · 高保真原型

依据 SPEC v0.7 实现的 **找低粉爆款对标 → 共性提炼 → AI 二创 → 创作记录** 前端原型。

当前阶段为 **纯前端 Mock 原型**：所有数据来自 `src/lib/mock-data.ts`，页面顶部和页面内显式标注 `MOCK 数据` 徽标，不发起任何外部付费请求。

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- @tanstack/react-table v8
- react-hook-form + zod + @hookform/resolvers
- lucide-react

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:5000
pnpm build        # 生产构建
pnpm start        # 启动生产服务
pnpm lint         # ESLint
pnpm ts-check     # TypeScript 类型检查
```

> 端口由环境变量 `DEPLOY_RUN_PORT` 控制，默认 5000。

## 路由

| 路由 | 说明 |
| --- | --- |
| `/login` | 单管理员登录 UI（原型未接鉴权） |
| `/benchmarks` | 找对标：搜索表单 + 30 分钟任务计时 + 最近 20 次搜索 |
| `/benchmarks/[runId]` | 搜索结果：表格 / Top5 / 词云 / 勾选 / 二创抽屉 |
| `/create/[jobId]` | AI 二创：步骤 + 共性 + 图文卡片 + 视频分镜 |
| `/creations` | 创作记录：筛选与状态 |
| `/settings` | 连通性 / 模板 / 品牌配置 |

## 部署到 Vercel（推荐，免费）

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "feat: content factory mock prototype"
git branch -M main
git remote add origin https://github.com/<your-name>/<repo>.git
git push -u origin main
```

`.gitignore` 已忽略 `node_modules`、`.next`、`.env*`，**不要**把未来的供应商密钥提交进仓库。

### 2. 在 Vercel 导入

1. 登录 <https://vercel.com>（用 GitHub 账号登录即可）。
2. **Add New… → Project**，选中刚推送的仓库并 **Import**。
3. Framework Preset 会自动识别为 **Next.js**。默认配置即可：
   - Install Command：`pnpm install`
   - Build Command：`pnpm run build`
   - Output Directory：`.next`（默认）
4. **Environment Variables**：本原型不依赖任何密钥，留空即可。
5. 点 **Deploy**，1–2 分钟后得到一个免费域名：
   - `https://<project>-<user>.vercel.app`
   - 自动 HTTPS、自动 CDN、每次 `git push` 自动部署。

### 3. Node 版本

`package.json` 已声明 `engines.node >= 18.18.0`。如果想锁版本，可在 Vercel 项目 **Settings → General → Node.js Version** 选 `22.x`，或在仓库根加一个 `.nvmrc`：

```
22
```

### 4.（可选）绑定自定义域名

Vercel 项目 **Settings → Domains** 添加域名后，在域名注册商添加：

- 根域名：`A` 记录 → `76.76.21.21`
- 子域名：`CNAME` → `cname.vercel-dns.com`

证书会自动签发。

## B 阶段接入真实数据时需要的环境变量

仅在你决定进入真数据联调阶段时，才在 Vercel **Settings → Environment Variables** 配置以下变量。**不要**写入仓库。

```bash
# 会话与鉴权
APP_SESSION_SECRET=...
APP_ADMIN_PASSWORD_HASH=...   # Argon2id 哈希

# Neon Postgres
DATABASE_URL=...
DATABASE_URL_UNPOOLED=...

# 微信文章搜索 / 公众号活跃数据
WECHAT_SEARCH_API_URL=https://api.cn8n.com/p4/fbmain/monitor/v3/kw_search
WECHAT_SEARCH_API_KEY=...
WECHAT_ACCOUNT_PROFILE_API_URL=...
WECHAT_ACCOUNT_PROFILE_API_KEY=...

# 火山方舟 Ark
ARK_API_KEY=...
ARK_TEXT_MODEL=...
ARK_IMAGE_MODEL=...
ARK_TEXT_PROMPT_VERSION=v1

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# 业务配置
DEFAULT_LOW_FANS_THRESHOLD=1000
SEARCH_PAGE_CONCURRENCY=1
SEARCH_PAGE_MIN_INTERVAL_MS=2000
ACCOUNT_PROFILE_CACHE_TTL_HOURS=168
ACCOUNT_PROFILE_CONCURRENCY=1
ACCOUNT_PROFILE_MIN_INTERVAL_MS=2000
MAX_SEARCH_POINTS_PER_BATCH=2000
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # / → /benchmarks
│   ├── globals.css             # Tailwind v4 + Design Tokens
│   ├── login/page.tsx
│   ├── benchmarks/
│   │   ├── page.tsx
│   │   └── [runId]/{page,client}.tsx
│   ├── create/[jobId]/{page,client}.tsx
│   ├── creations/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/{app-chrome,sidebar,topbar,mobile-nav}.tsx
│   └── ui/                     # shadcn/ui
└── lib/
    ├── utils.ts                # cn / formatNumber / formatRead / interactionRate ...
    ├── mock-types.ts
    └── mock-data.ts
```

## 关键产品规则

- 低粉阈值默认 1000，规则：`fans <= threshold && read > avg_top_read * 3`。
- 标签三态：`low_fan_viral | data_missing | pending | not_matched`，颜色 + 图标 + 文字。
- 互动率：`(praise + looking) / read * 100%`；`read=100001` 表示 "10万+"，只显示上界、不进精确 Top5。
- 字段可见性：全列 missing/null/空字符串/空数组/空对象才隐藏；数字 `0` 与布尔 `false` 是有效值。
- 枚举码 `is_original/has_notifier/item_show_type` 只显示官方字段名 + 原始码，不翻译为 "是/否"。
- `content` 以纯文本 `white-space: pre-wrap` 展示，不 `dangerouslySetInnerHTML`。
- 原文外链仅允许 `https://mp.weixin.qq.com/`，`rel="noopener noreferrer"`。

更详细的设计语言见 [`DESIGN.md`](./DESIGN.md)，工程规范见 [`AGENTS.md`](./AGENTS.md)。

## 已知边界（原型阶段未实现）

微信真实搜索、公众号活跃 API、火山方舟文本/图片模型、Neon + Drizzle 40+ 表、Vercel Workflow/outbox/Cron、Argon2 登录、图片真实生成与 ZIP 导出、6-of-10 质量 sampling、30 分钟 discovery session 闭环、Playwright E2E。

这些进入 B 阶段后再补，本原型只负责 UI / 交互 / 信息架构评审。
