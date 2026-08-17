import type {
  AccountProfile,
  ArticleWithEvaluation,
  BrandSettings,
  ConnectivityStatus,
  CreationJob,
  CreationRecord,
  DiscoverySession,
  RecentSearch,
  SearchRun,
} from "./mock-types";

/**
 * 原型 Mock 夹具。
 * 字段命名严格对齐 SPEC v0.7 第 0.2/0.3/3 节。
 * 所有数据均为演示用虚构内容，页面顶部会显示 MOCK 标记。
 */

// ---- 账号池（用于构造文章 + 账号补全数据） -----------------------------

interface AccountSeed {
  ghid: string;
  wx_id: string;
  name: string;
  fans: number;
  avg_top_read: number;
  avg_top_zan: number;
  week_articles: number;
  ip: string;
  profile_status: "ok" | "missing" | "failed" | "zero_avg_read";
}

const ACCOUNTS: AccountSeed[] = [
  {
    ghid: "gh_a1f3c9d2e7b1",
    wx_id: "workbuddy_lab",
    name: "WorkBuddy 工作室",
    fans: 823,
    avg_top_read: 2400,
    avg_top_zan: 38,
    week_articles: 6,
    ip: "广东",
    profile_status: "ok",
  },
  {
    ghid: "gh_b4d7e2a8f109",
    wx_id: "xiao_zuo_fang",
    name: "小作坊进化论",
    fans: 640,
    avg_top_read: 1800,
    avg_top_zan: 24,
    week_articles: 4,
    ip: "浙江",
    profile_status: "ok",
  },
  {
    ghid: "gh_c2f9a8d3b4e5",
    wx_id: "du li_ying_yun",
    name: "独立运营笔记",
    fans: 1200,
    avg_top_read: 5200,
    avg_top_zan: 65,
    week_articles: 3,
    ip: "上海",
    profile_status: "ok",
  },
  {
    ghid: "gh_d6e2b8c4a1f3",
    wx_id: "rengong_zhineng_riji",
    name: "人工智能日记",
    fans: 2480,
    avg_top_read: 12000,
    avg_top_zan: 180,
    week_articles: 12,
    ip: "北京",
    profile_status: "ok",
  },
  {
    ghid: "gh_e8a1c4d7b2f9",
    wx_id: "xinchuang_shouce",
    name: "新创手册",
    fans: 460,
    avg_top_read: 900,
    avg_top_zan: 12,
    week_articles: 5,
    ip: "江苏",
    profile_status: "ok",
  },
  {
    ghid: "gh_f3b9e2d6a8c4",
    wx_id: "",
    name: "深夜编辑部",
    fans: 0,
    avg_top_read: 0,
    avg_top_zan: 0,
    week_articles: 0,
    ip: "四川",
    profile_status: "zero_avg_read",
  },
  {
    ghid: "gh_a7c2f9d4b6e1",
    wx_id: "chanpin_zhaji",
    name: "产品札记",
    fans: 980,
    avg_top_read: 3100,
    avg_top_zan: 42,
    week_articles: 7,
    ip: "福建",
    profile_status: "ok",
  },
  {
    ghid: "gh_b1e8d3a6c9f2",
    wx_id: "weilai_zuofang",
    name: "未来作坊",
    fans: 0,
    avg_top_read: 0,
    avg_top_zan: 0,
    week_articles: 0,
    ip: "未知",
    profile_status: "missing",
  },
  {
    ghid: "gh_c9a4f1b7e2d8",
    wx_id: "xianyu_lianmeng",
    name: "咸鱼联盟",
    fans: 720,
    avg_top_read: 1500,
    avg_top_zan: 19,
    week_articles: 3,
    ip: "湖北",
    profile_status: "ok",
  },
  {
    ghid: "gh_d2b6e9a3f8c1",
    wx_id: "xiaohao_shidai",
    name: "小号时代",
    fans: 530,
    avg_top_read: 800,
    avg_top_zan: 10,
    week_articles: 4,
    ip: "陕西",
    profile_status: "ok",
  },
  {
    ghid: "gh_e5c1b8d2f6a4",
    wx_id: "gongzuo_liu",
    name: "工作流观察",
    fans: 0,
    avg_top_read: 0,
    avg_top_zan: 0,
    week_articles: 0,
    ip: "未知",
    profile_status: "failed",
  },
  {
    ghid: "gh_f8a3c6e1b9d4",
    wx_id: "rouruan_zazhi",
    name: "柔软杂志",
    fans: 1500,
    avg_top_read: 6800,
    avg_top_zan: 90,
    week_articles: 2,
    ip: "广东",
    profile_status: "ok",
  },
];

// ---- 内容片段（拼出真实感文章） ----------------------------------------

const TITLES = [
  "我用 WorkBuddy 把每周 8 小时找选题压到 30 分钟，这 5 步可复用",
  "一个人做三个公众号，我靠的不是自律是系统",
  "为什么你看了 100 篇文章，还是写不出自己的选题？",
  "低粉爆款不是玄学：用 3 个指标从 1000 篇里挑出 5 篇对标",
  "独立创作者的 AI 工作流：从对标到二创，全流程拆解",
  "做号半年踩过的 7 个坑，希望你别再踩",
  "我把飞书、Notion、微信串成了一个编辑部",
  "副业公众号月更 12 篇，我如何管理素材库",
  "AI 二创的边界：什么该抄，什么不能动",
  "那些 1000 粉就 10w+ 的号，到底做对了什么？",
  "内容工厂 v0.7：从关键词到图文卡片的自动化尝试",
  "一个人的选题会：我用这张表跑完整个月",
  "别再追热点了：低粉账号更适合打“长尾关键词”",
  "我分析了 59 页数据后，发现爆款的共同点只有一个",
  "公众号矩阵怎么管？我的仪表盘长这样",
  "AI 写的卡片，怎么才能不像 AI 写的？",
  "把每篇对标文章拆成 7 个块，二创不再从零开始",
  "我用一段话做视频脚本：60 秒讲清楚一个复杂观点",
  "内容创业者的“账户系统”：别把鸡蛋放在一个号里",
  "标题写不好？看看低粉爆款都在用的 3 个钩子",
  "为什么我建议所有独立创作者都建一个素材银行",
  "二创不是洗稿：我是如何用 5 篇来源文产出新观点的",
  "工作流复盘：上周 10 篇内容，哪 3 个环节最耗时",
  "公众号正文排版只剩一个原则：让用户读下去",
  "AI 出图 + 固定模板：一个人也能做杂志感卡片",
];

const CONTENT_PARAGRAPHS = [
  "我最近在做一件事：把每周找对标的时间，从 8 小时压缩到 30 分钟。这不是什么时间管理魔法，而是把“找文章”这件事，从手工浏览变成结构化筛选。",
  "之前我和很多独立创作者一样，打开微信、搜关键词、按阅读排序，一篇一篇往下翻。翻 100 篇能挑出 3-5 篇可用，就已经算运气好。剩下的时间全花在了标题像、内容空、或者数据好看但不适合自己账号定位的文章上。",
  "后来我意识到一个问题：我找的不是“阅读数最高的文章”，而是“小账号里阅读显著超出常态的文章”。后者才是真正可对标的——它说明这个话题在一个粉丝量不大的账号上也能跑出来，对同样是小账号的我更有参考价值。",
  "于是我开始按两条线筛：一是账号粉丝必须在我设定的阈值以下（默认 1000，但每次搜索可以改）；二是文章阅读必须超过这个号头条平均阅读的 3 倍。这两条同时成立，我才标记为“低粉爆款”。",
  "为什么是 3 倍？因为它足够显著，可以排除偶发的流量波动；又不会太严格，漏掉那些刚起来的号。这个数字不是真理，但作为单人运营的默认值足够稳。",
  "我把这个规则固化到了工作流里：关键词一搜，系统自动拉当前页的账号头像、名称、ghid，然后调账号活跃数据接口补全粉丝和头条均阅，再按规则打标签。账号数据 7 天内复用，不会反复花钱。",
  "找到 3-5 篇低粉爆款后，下一步不是直接仿写，而是让 AI 先做单篇摘要，再做多篇共性提炼。我必须看到：这些文章的目标读者是谁、共同的痛点是什么、用了什么钩子开头、结构怎么排、情绪是什么——然后再基于这些共性，生成 5 个二创角度。",
  "我默认采纳 AI 推荐的第一个角度，但会保留其余 4 个作为备选。如果生成的图文卡片不满意，切换角度会创建一个完整的新版本，老版本不会被覆盖。这样我可以随时回到之前的角度做对比。",
  "图文卡片每张图都是 AI 生成无字底图，再由固定模板叠加中文标题、正文和品牌元素。不让图片模型生成中文，是因为 90% 的中文渲染都是错字，与其修，不如直接在模板层叠。",
  "视频脚本我只要求 60-90 秒，8-12 个分镜。AI 给我解说词、屏幕字幕和画面建议，导出 Markdown 就够了。MVP 阶段不做配音、不做 MP4 渲染——这些等流程跑顺了再说。",
  "我对这套流程的最低要求是：每 10 份产物里，至少 6 份不需要我重写核心结构和观点，单份修改不超过 5 分钟。这是一个很苛刻的数字，但它是衡量系统是否真的替我干活的唯一标准。",
  "很多人以为内容工厂的核心是 AI，其实不是。核心是你对自己账号定位的理解，以及你愿意花多少时间把这套理解沉淀成可复用的规则。AI 只是把规则执行得更快。",
  "上周我用这套工作流产出了 10 篇内容。其中 7 篇直接用了 AI 生成的初稿，3 篇做了大幅重写。看起来成功率不算高，但比之前从零开始写，已经是天壤之别。",
  "我现在最看重的不是某一篇会不会爆，而是整个系统是否可重复、可追溯。每一次二创，我都能回到当时的对标文章、标签依据、账号数据、共性分析——出问题时能复盘，做对了能沉淀。",
  "如果你也是一个人做号，我的建议是：先别急着追新模型，先把找对标、提炼共性、二创这三步的规则写下来。规则越具体，AI 越能替你干活。",
  "最后多说一句：低粉爆款不等于你写就一定爆。它只是一个比“按阅读排序”更有效的信号。真正决定成败的，还是你对选题的判断和持续输出。",
];

const CLASSIFICATIONS = ["科技“, ”职场“, ”财经“, ”生活“, ”教育“, ”互联网"];
const IPS = ["广东“, ”浙江“, ”上海“, ”北京“, ”江苏“, ”四川“, ”福建“, ”湖北“, ”陕西"];

// ---- 工具：可重复的伪随机 ------------------------------------------------

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

function buildContent(rand: () => number, paragraphCount: number): string {
  const out: string[] = [];
  const used = new Set<number>();
  while (out.length < paragraphCount && used.size < CONTENT_PARAGRAPHS.length) {
    const idx = Math.floor(rand() * CONTENT_PARAGRAPHS.length);
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(CONTENT_PARAGRAPHS[idx] as string);
  }
  return out.join("\n\n");
}

// ---- 主夹具：构造 1 个 run + 20 篇文章 ---------------------------------

// 使用固定时间戳，避免 SSR/CSR  hydration mismatch 与测试不稳定
// 真实联调时由后端返回时间
const NOW_SEC = 1755400000; // 2025-08-17 固定基准时间
const RUN_ID = "run_20260816_001";
const SESSION_ID = "session_20260816_001";

function makeArticle(index: number, seed: number): ArticleWithEvaluation {
  const rand = mulberry32(seed);
  const account = pick(ACCOUNTS, rand);
  const title = pick(TITLES, rand);
  const isLongTitle = index === 6; // 第 7 行：超长标题夹具
  const finalTitle = isLongTitle
    ? `${title}：${buildContent(rand, 3).slice(0, 800)}\n（含真实换行的疑似正文误入标题，原值保留）`
    : title;

  const classify = pick(CLASSIFICATIONS, rand);
  const ip = account.ip || pick(IPS, rand);
  const publishTime = NOW_SEC - Math.floor(rand() * 30 * 86400) - index * 3600;
  const updateTime = publishTime + Math.floor(rand() * 3600);

  // 决定 read：约 1/8 概率 capped 10万+；其余在账号均阅 0.5x-8x 之间
  let read: number;
  const readRoll = rand();
  if (readRoll < 0.08) {
    read = 100001;
  } else if (account.profile_status === "ok") {
    const mult = 0.6 + rand() * 6;
    read = Math.max(50, Math.round(account.avg_top_read * mult));
  } else {
    read = 200 + Math.floor(rand() * 9000);
  }
  const praise = Math.max(0, Math.round(read === 100001 ? 200 + rand() * 800 : read * (0.005 + rand() * 0.03)));
  const looking = Math.max(0, Math.round(praise * (0.2 + rand() * 0.8)));

  // 内容：第 14 篇空 content
  const contentEmpty = index === 13;
  const content = contentEmpty ? "" : buildContent(rand, 5 + Math.floor(rand() * 6));

  const isOriginal = ([0, 1, 2] as const)[Math.floor(rand() * 3)];
  const itemShowType = ([0, 8, 10] as const)[Math.floor(rand() * 3)];
  const hasNotifier = rand() > 0.4 ? 1 : 0;

  // 标签判定（与 SPEC FR-02 规则一致）
  let profile: AccountProfile | undefined;
  let label: ArticleWithEvaluation["label"] = "not_matched";
  let labelReason: string | undefined;

  if (account.profile_status === "ok" && content) {
    const fetchedAt = NOW_SEC - Math.floor(rand() * 3 * 86400);
    profile = {
      account_id: `acc_${account.ghid}`,
      name: account.name,
      ghid: account.ghid,
      wx_id: account.wx_id,
      fans: account.fans,
      avg_top_read: account.avg_top_read,
      avg_top_zan: account.avg_top_zan,
      week_articles: account.week_articles,
      latest_publish_time: "2026-08-12 09:30:00",
      jzl_index: 200 + Math.round(rand() * 3000) / 10,
      avatar: `https://wx.qlogo.cn/mmhead/${account.ghid}_${index}/0`,
      qrcode: `https://open.weixin.qq.com/qr/code?username=${account.wx_id}`,
      fetched_at: fetchedAt,
      fresh_until: fetchedAt + 7 * 86400,
    };

    // 低粉爆款判定
    const threshold = 1000;
    const isLowFan = account.fans <= threshold;
    let viral = false;
    if (read === 100001) {
      // 只有当 100000 > avg*3 才能保守确认
      viral = isLowFan && 100000 > account.avg_top_read * 3;
      if (!viral) labelReason = "indeterminate_capped_read";
    } else {
      viral = isLowFan && read > account.avg_top_read * 3;
    }
    if (viral) {
      label = "low_fan_viral";
    } else {
      label = "not_matched";
    }
  } else if (account.profile_status === "zero_avg_read") {
    label = "data_missing";
    labelReason = "avg_top_read=0";
  } else if (account.profile_status === "missing") {
    label = "data_missing";
    labelReason = "ACCOUNT_PROFILE_LOOKUP_NAME_MISSING";
  } else if (account.profile_status === "failed") {
    label = "data_missing";
    labelReason = "ACCOUNT_PROFILE_AUTH_FAILED";
  }

  // 互动率
  let interactionRate: ArticleWithEvaluation["interaction_rate"] = null;
  if (read > 0) {
    if (read === 100001) {
      interactionRate = {
        value: `≤ ${(((praise + looking) / 100000) * 100).toFixed(2)}%`,
        capped: true,
      };
    } else {
      interactionRate = {
        value: `${(((praise + looking) / read) * 100).toFixed(2)}%`,
        capped: false,
      };
    }
  }

  const id = `art_${String(index + 1).padStart(4, "0")}`;
  const wxIdToUse =
    account.wx_id === "" && (index === 3 || index === 11) ? "" : account.wx_id;
  const avatarToUse =
    index === 9 || account.wx_id === "" ? "" : `https://wx.qlogo.cn/mmhead/${account.ghid}_${index}/0`;

  return {
    id,
    canonical_key: `wx://mp.weixin.qq.com?__biz=${account.ghid}&mid=${8000000 + index}&idx=1`,
    avatar: avatarToUse,
    title: finalTitle,
    url: `https://mp.weixin.qq.com/s?__biz=${account.ghid}&mid=${8000000 + index}&idx=1&sn=${seed.toString(16)}`,
    short_link: `https://mp.weixin.qq.com/s/abcd${index}xyz`,
    content,
    publish_time: publishTime,
    publish_time_str: formatEpoch(publishTime),
    update_time: updateTime,
    update_time_str: formatEpoch(updateTime),
    wx_name: account.name,
    wx_id: wxIdToUse || undefined,
    ghid: account.ghid,
    read,
    praise,
    looking,
    ip_wording: ip,
    classify,
    is_original: isOriginal,
    item_show_type: itemShowType,
    has_notifier: hasNotifier,
    content_status: contentEmpty ? "empty" : "ok",
    title_quality: isLongTitle ? "suspect_abnormal" : undefined,
    label,
    label_reason: labelReason,
    profile,
    interaction_rate: interactionRate,
    fans: profile?.fans ?? null,
    avg_top_read: profile?.avg_top_read ?? null,
    avg_top_zan: profile?.avg_top_zan ?? null,
    week_articles: profile?.week_articles ?? null,
    latest_publish_time: profile?.latest_publish_time ?? null,
    jzl_index: profile?.jzl_index ?? null,
    fetched_at: profile?.fetched_at ?? null,
    fresh_until: profile?.fresh_until ?? null,
  };
}

function formatEpoch(sec: number): string {
  const d = new Date(sec * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

const ARTICLES: ArticleWithEvaluation[] = Array.from({ length: 20 }, (_, i) =>
  makeArticle(i, 0x9e3779b9 + i * 2654435761),
);

export function getMockArticles(page: number = 1): ArticleWithEvaluation[] {
  if (page === 1) return ARTICLES;
  // 后续页：基于 seed 生成不同数据，演示分页
  const seedBase = 0x9e3779b9 + page * 100000;
  return Array.from({ length: 20 }, (_, i) => {
    const art = makeArticle(i, seedBase + i * 2654435761);
    return { ...art, id: `art_p${page}_${String(i + 1).padStart(4, "0")}` };
  });
}

export const MOCK_TOTAL = 1165;
export const MOCK_TOTAL_PAGE = 59;
export const DEFAULT_LOW_FANS_THRESHOLD = 1000;
export const MOCK_PAGE1_REQUEST_ID = "req_mock_7a3f9c2e1b8d";

export const MOCK_SESSION: DiscoverySession = {
  id: SESSION_ID,
  status: "active",
  started_at: NOW_SEC - 9 * 60, // 9 分钟前开始
  deadline_at: NOW_SEC + 21 * 60,
  commonality_ready_at: null,
  commonality_visible_at: null,
  elapsed_sec: 9 * 60,
};

export const MOCK_RUN: SearchRun = {
  id: RUN_ID,
  discovery_session_id: SESSION_ID,
  kw: "WorkBuddy",
  any_kw: "",
  ex_kw: "",
  sort_type: 1,
  mode: 3,
  period: 30,
  low_fans_threshold: 1000,
  benchmark_rule_version: "2026-08-01",
  viral_read_multiplier: 3,
  status: "completed",
  coverage_status: "partial",
  observed_total_pages: MOCK_TOTAL_PAGE,
  target_total_pages: null,
  completed_page_count: 1,
  article_search_points: 20,
  account_profile_points: 180,
  unknown_charge_count: 1,
  failed_pages: 0,
  result_unknown_pages: 1,
  created_at: NOW_SEC - 9 * 60,
  completed_at: NOW_SEC - 9 * 60 + 12,
  summary: {
    requestId: MOCK_PAGE1_REQUEST_ID,
    consumedPoints: 20,
    total: MOCK_TOTAL,
    total_page: MOCK_TOTAL_PAGE,
    page: 1,
    data_number: 20,
    array_length: 20,
  },
  idempotency_key: "idem_mock_run_001",
};

// ---- 最近 20 次搜索 ---------------------------------------------------

export function getRecentSearches(): RecentSearch[] {
  const out: RecentSearch[] = [];
  for (let i = 0; i < 12; i++) {
    const rand = mulberry32(i + 1);
    const totalPages = 1 + Math.floor(rand() * 80);
    out.push({
      id: `run_recent_${i}`,
      kw: pick(TITLES, rand).slice(0, 12),
      low_fans_threshold: [500, 800, 1000, 1500, 2000][i % 5] as number,
      total: totalPages * 20 - Math.floor(rand() * 15),
      total_page: totalPages,
      completed_pages: 1 + Math.floor(rand() * Math.min(5, totalPages)),
      created_at: NOW_SEC - (i + 1) * 3600 * (1 + (i % 3)),
      low_fan_viral_count: Math.floor(rand() * 8),
    });
  }
  return out;
}

// ---- 创作记录（Mock） -------------------------------------------------

export function getCreationRecords(): CreationRecord[] {
  return [
    {
      job_id: "job_001",
      keyword: "WorkBuddy",
      output_type: "both",
      card_count: 6,
      source_count: 4,
      status: "completed",
      graphic_status: "published",
      video_status: "draft",
      created_at: NOW_SEC - 86400,
      completed_at: NOW_SEC - 86400 + 180,
      angle_title: "把找对标从 8 小时压到 30 分钟",
    },
    {
      job_id: "job_002",
      keyword: "AI 工作流",
      output_type: "graphic",
      card_count: 8,
      source_count: 5,
      status: "completed",
      graphic_status: "draft",
      video_status: "draft",
      created_at: NOW_SEC - 3 * 86400,
      completed_at: NOW_SEC - 3 * 86400 + 240,
      angle_title: "独立创作者的 AI 编辑部",
    },
    {
      job_id: "job_003",
      keyword: "低粉爆款",
      output_type: "video",
      card_count: 0,
      source_count: 3,
      status: "partial",
      graphic_status: "draft",
      video_status: "draft",
      created_at: NOW_SEC - 5 * 86400,
      completed_at: null,
      angle_title: "3 个指标筛出对标文章",
    },
    {
      job_id: "job_004",
      keyword: "内容矩阵",
      output_type: "graphic",
      card_count: 9,
      source_count: 6,
      status: "failed",
      graphic_status: "draft",
      video_status: "draft",
      created_at: NOW_SEC - 7 * 86400,
      completed_at: null,
      angle_title: "一个人的内容矩阵",
    },
    {
      job_id: "job_005",
      keyword: "公众号二创",
      output_type: "both",
      card_count: 7,
      source_count: 4,
      status: "completed",
      graphic_status: "archived",
      video_status: "published",
      created_at: NOW_SEC - 10 * 86400,
      completed_at: NOW_SEC - 10 * 86400 + 200,
      angle_title: "二创不是洗稿",
    },
  ];
}

export function getCreationJob(id: string): CreationJob | null {
  if (id !== "job_mock_001") return null;
  const sourceIds = ARTICLES.filter((a) => a.label === "low_fan_viral")
    .slice(0, 4)
    .map((a) => a.id);
  return {
    id,
    discovery_session_id: SESSION_ID,
    search_run_id: RUN_ID,
    source_article_ids: sourceIds,
    output_type: "both",
    card_count: 6,
    palette: "warm-white-orange",
    visual_style: "illustration",
    status: "completed",
    current_stage: "completed",
    analysis_type: "multi_source_commonality",
    angle_rank: 1,
    created_at: NOW_SEC - 600,
    completed_at: NOW_SEC - 120,
    graphic_status: "draft",
    video_status: "draft",
    summaries: sourceIds.map((aid, i) => ({
      article_id: aid,
      core_view:
        i === 0
          ? "把找对标的手工流程结构化、规则化，是独立创作者提效的核心杠杆。"
          : "低粉爆款的判定标准必须同时考虑账号体量和单篇数据，单看阅读数会误导。",
      target_audience: "一个人运营公众号矩阵、每周产出 10 篇左右的独立创作者",
      user_pain:
        "每周花 8 小时浏览 100+ 篇文章，只能挑出 3-5 篇可用对标，且共性提炼靠感觉。",
      structure: [
        "用具体数字（8 小时/100 篇/3-5 篇）建立痛点共鸣",
        "给出两条筛选规则并解释为什么是 3 倍",
        "展示从搜关键词到二创产物的完整链路",
        "结尾强调人的判断仍然不可替代",
      ],
      expression_style: "第一人称复盘，口语化但克制，短句为主，避免感叹号",
      traceable_facts: [
        "默认低粉阈值 1000 可按次修改",
        "账号数据 7 天缓存",
        "每 10 份产物至少 6 份不重写核心结构",
      ],
      do_not_copy: [
        "原文中的具体账号名",
        "原文中带个人色彩的口头禅",
        "原文段落的起承转合顺序",
      ],
      status: "completed",
    })),
    commonality: {
      output_type: "both",
      analysis_type: "multi_source_commonality",
      target_audience:
        "一个人运营多个公众号、追求稳定产出而非单篇爆款的独立内容创作者",
      core_message: {
        text: "把“找对标—提炼共性—二创”三步从手工感觉变成可复用规则，AI 才能真正替你干活。",
        evidence_article_ids: sourceIds,
        claim_type: "sourced",
      },
      findings: [
        {
          id: "pattern-1",
          dimension: "audience_or_pain",
          finding:
            "目标读者都是“一人多号”的独立创作者，共同痛点是找对标和提炼共性的时间黑洞，而非写作本身。",
          evidence_article_ids: sourceIds.slice(0, 3),
        },
        {
          id: "pattern-2",
          dimension: "headline_or_hook",
          finding:
            "标题都用具体数字（8 小时、30 分钟、3-5 篇、100 篇）+ 反常识对比作为钩子，避免“如何”“怎么”这类弱钩子。",
          evidence_article_ids: [sourceIds[0] as string, sourceIds[1] as string, sourceIds[3] as string],
        },
        {
          id: "pattern-3",
          dimension: "structure",
          finding:
            "正文普遍按“痛点共鸣 → 给出规则/方法 → 解释规则来源 → 展示落地链路 → 人的判断不可替代”五段推进。",
          evidence_article_ids: sourceIds,
        },
        {
          id: "pattern-4",
          dimension: "style_or_emotion",
          finding:
            "语气克制、第一人称复盘、短句为主，几乎不用感叹号和夸张修辞；通过具体细节建立可信度。",
          evidence_article_ids: [sourceIds[0] as string, sourceIds[2] as string, sourceIds[3] as string],
        },
        {
          id: "pattern-5",
          dimension: "reusable_pattern",
          finding:
            "都强调“把规则写下来 AI 才能替你执行”，把工具选择（AI、工作流）放在规则之后，避免本末倒置。",
          evidence_article_ids: sourceIds.slice(1, 4),
        },
      ],
      recommended_angle_rank: 1,
      creative_angles: [
        {
          rank: 1,
          title: "把找对标的时间砍掉 90%：一个独立创作者的规则手册",
          angle:
            "从“每周 8 小时”这个具体痛点切入，复盘两条筛选规则、3 个可量化指标和完整 AI 工作流。",
          rationale:
            "所有来源文都强调规则化和具体数字，这个角度最贴合共性，也最容易形成强封面钩子。",
          basis_pattern_ids: ["pattern-1", "pattern-2", "pattern-3"],
          evidence_article_ids: sourceIds,
        },
        {
          rank: 2,
          title: "别再按阅读排序找对标了——低粉爆款的两个硬条件",
          angle:
            "做一篇方法卡片文，重点讲清楚“粉丝阈值”和“3 倍均阅”为什么同时成立，以及如何避开误判。",
          rationale: "规则解释型内容，卡片化价值高，适合在社群传播。",
          basis_pattern_ids: ["pattern-1", "pattern-5"],
          evidence_article_ids: [sourceIds[0] as string, sourceIds[2] as string],
        },
        {
          rank: 3,
          title: "AI 不是你的主笔，是你的编辑部助理",
          angle:
            "强调人和 AI 的分工：人定规则，AI 执行；不要让模型替你判断选题。",
          rationale: "呼应所有来源文结尾“人的判断不可替代”的共识。",
          basis_pattern_ids: ["pattern-4", "pattern-5"],
          evidence_article_ids: [sourceIds[1] as string, sourceIds[3] as string],
        },
        {
          rank: 4,
          title: "我用 5 篇对标文产出 1 个新观点：二创的正确打开方式",
          angle:
            "以单篇摘要 + 共性提炼为骨架，展示二创不是拼接，而是跨来源重组观点。",
          rationale: "适合有一定经验的创作者，强调方法论深度。",
          basis_pattern_ids: ["pattern-3", "pattern-5"],
          evidence_article_ids: sourceIds,
        },
        {
          rank: 5,
          title: "独立创作者的仪表盘：我每天看哪几个数字",
          angle:
            "从量化视角展开，把找对标、共性提炼、二创质量都变成可追踪指标。",
          rationale: "偏工具向，适合做图文卡片和视频分镜的双重表达。",
          basis_pattern_ids: ["pattern-2", "pattern-3"],
          evidence_article_ids: [sourceIds[0] as string, sourceIds[3] as string],
        },
      ],
      title_options: [
        {
          text: "把找对标的时间砍掉 90%",
          evidence_article_ids: [sourceIds[0] as string],
          claim_type: "sourced",
        },
        {
          text: "一个人的内容工厂是怎么运转的",
          evidence_article_ids: [],
          claim_type: "creative",
        },
        {
          text: "低粉爆款筛选手册 v0.7",
          evidence_article_ids: [sourceIds[2] as string],
          claim_type: "sourced",
        },
      ],
      graphic: {
        cover: {
          headline: "把找对标的时间\n砍掉 90%",
          subheadline: "一个独立创作者的规则手册",
          image_prompt:
            "编辑部门面，清晨柔光，米白桌面摊开多份打印的稿件，一支橙色标记笔横放在标题上，留白干净，杂志摄影风格，浅景深",
          evidence_article_ids: [sourceIds[0] as string],
          claim_type: "sourced",
        },
        cards: [
          {
            index: 1,
            title: "每周 8 小时去哪了",
            body: "打开微信、搜关键词、按阅读排序，一篇一篇翻。翻 100 篇挑出 3-5 篇，是绝大多数独立创作者的真实日常。",
            image_prompt:
              "俯视特写，桌面摆满被橙色记号笔标注的打印稿，咖啡杯一角，纸感强烈，自然光",
            evidence_article_ids: [sourceIds[0] as string],
            claim_type: "sourced",
          },
          {
            index: 2,
            title: "你该找的不是最高阅读",
            body: "而是小账号里阅读显著超出常态的文章。这才是真正可对标的信号。",
            image_prompt:
              "极简插画，一张折线图，一个橙色高点突出在大量低点之间，米白背景",
            evidence_article_ids: [sourceIds[1] as string],
            claim_type: "sourced",
          },
          {
            index: 3,
            title: "两个硬条件",
            body: "① 账号粉丝 ≤ 当次阈值（默认 1000）；② 单篇阅读 > 该号头条均阅 × 3。两个条件必须同时成立。",
            image_prompt:
              "扁平编辑插画，两个橙色圆形像印章一样叠在一张卡片上，写着实心数字 1 和 2 的意象，米白底色",
            evidence_article_ids: [sourceIds[0] as string, sourceIds[2] as string],
            claim_type: "sourced",
          },
          {
            index: 4,
            title: "为什么是 3 倍",
            body: "足够显著以排除偶发波动，又不会太严格而漏掉刚起来的号。它不是真理，但作为单人运营的默认值足够稳。",
            image_prompt:
              "米白纸面，手绘的三倍记号，橙色水彩笔刷，极简",
            evidence_article_ids: [sourceIds[0] as string],
            claim_type: "sourced",
          },
          {
            index: 5,
            title: "账号数据 7 天复用",
            body: "同一个 ghid/wx_id 命中 7 天内缓存就不再请求；过期才刷新，不重复花钱。",
            image_prompt:
              "编辑插画，一个日历图标与刷新箭头组合，橙色点缀，纸面质感",
            evidence_article_ids: [sourceIds[2] as string],
            claim_type: "sourced",
          },
          {
            index: 6,
            title: "最后还是人",
            body: "规则越具体，AI 越能替你干活；但对选题的判断和持续输出，始终在你自己。",
            image_prompt:
              "温暖的编辑部场景，一只手握笔在纸上写，另一杯茶，黄昏光线",
            evidence_article_ids: sourceIds,
            claim_type: "sourced",
          },
        ],
      },
      video: {
        title: "把找对标的时间砍掉 90%",
        duration_seconds: 78,
        hook: "你每周花多少时间找对标？8 小时？我把它压到了 30 分钟。",
        full_narration:
          "你每周花多少时间找对标？打开微信、搜关键词、按阅读排序，翻 100 篇挑出 3-5 篇——这是 8 小时。但其实你要找的不是阅读最高的文章，而是小账号里数据显著超出常态的那几篇。我用两个条件：粉丝不超过 1000，单篇阅读超过这个号头条均阅的 3 倍。两个同时成立，才标记为低粉爆款。找到 3-5 篇之后，让 AI 先做单篇摘要，再做多篇共性提炼——目标读者、痛点、钩子、结构、情绪，五个维度必须都有来源。然后基于这些共性生成 5 个二创角度，我默认选第一个，其余四个留作备选。图文卡片用 AI 生成无字底图，再由固定模板叠中文，不依赖图片模型渲染汉字。视频脚本只要求 60 到 90 秒、8 到 12 个分镜，不做配音、不渲染 MP4。我对这套流程的最低标准是：每 10 份产物里，至少 6 份不需要我重写核心结构，单份修改不超过 5 分钟。规则越具体，AI 越能替你干活；但选题的判断和持续输出，始终在你自己。",
        evidence_article_ids: sourceIds,
        claim_type: "sourced",
        storyboards: [
          {
            index: 1,
            duration_seconds: 6,
            voiceover: "你每周花多少时间找对标？8 小时？我把它压到了 30 分钟。",
            onscreen_text: "8 小时 → 30 分钟",
            visual_description: "桌面俯拍，打印稿件被快速翻动，橙色记号笔划过标题",
            visual_prompt: "俯视，编辑部桌面，快速翻页的稿件，橙色记号笔特写，电影感",
            evidence_article_ids: [sourceIds[0] as string],
            claim_type: "sourced",
          },
          {
            index: 2,
            duration_seconds: 8,
            voiceover: "打开微信、搜关键词、按阅读排序，一篇一篇翻，100 篇挑出 3-5 篇。",
            onscreen_text: "100 篇 → 3-5 篇",
            visual_description: "屏幕录制感：微信搜索结果滚动，数字 100 倒数到 5",
            visual_prompt: "模拟手机屏幕，微信搜索结果滚动，米白背景，数字动画",
            evidence_article_ids: [sourceIds[0] as string],
            claim_type: "sourced",
          },
          {
            index: 3,
            duration_seconds: 8,
            voiceover: "但你要找的不是阅读最高的文章，而是小账号里超常态的那几篇。",
            onscreen_text: "不是最高，是超常",
            visual_description: "折线图动画，大量低柱中一个橙色柱突然跃起",
            visual_prompt: "扁平数据可视化，米白背景，橙色峰值柱",
            evidence_article_ids: [sourceIds[1] as string],
            claim_type: "sourced",
          },
          {
            index: 4,
            duration_seconds: 10,
            voiceover: "条件一：账号粉丝不超过当次阈值，默认 1000。",
            onscreen_text: "① 粉丝 ≤ 1000",
            visual_description: "数字章盖下，橙色印在白卡上",
            visual_prompt: "橡皮章特写，橙色印泥，米白卡纸",
            evidence_article_ids: [sourceIds[0] as string],
            claim_type: "sourced",
          },
          {
            index: 5,
            duration_seconds: 10,
            voiceover: "条件二：单篇阅读超过这个号头条均阅的 3 倍。",
            onscreen_text: "② 阅读 > 均阅 × 3",
            visual_description: "乘号动画，数字 3 放大，柱状图越线",
            visual_prompt: "扁平动效，橙色乘号和数字 3，越过横线",
            evidence_article_ids: [sourceIds[0] as string, sourceIds[2] as string],
            claim_type: "sourced",
          },
          {
            index: 6,
            duration_seconds: 8,
            voiceover: "两个条件同时成立，才标记为低粉爆款。",
            onscreen_text: "同时成立",
            visual_description: "两个橙色圆形合并成一个标签",
            visual_prompt: "两个橙色圆形融合动画，形成“低粉爆款”印章感标签",
            evidence_article_ids: sourceIds,
            claim_type: "sourced",
          },
          {
            index: 7,
            duration_seconds: 10,
            voiceover: "找到 3-5 篇之后，AI 先做单篇摘要，再做共性提炼。",
            onscreen_text: "摘要 → 共性",
            visual_description: "文件堆叠动画，卡片从分散到合并",
            visual_prompt: "纸张文件自动归拢的动效，橙色标签高亮",
            evidence_article_ids: sourceIds,
            claim_type: "sourced",
          },
          {
            index: 8,
            duration_seconds: 8,
            voiceover: "五个维度必须都有来源：读者、痛点、钩子、结构、情绪。",
            onscreen_text: "5 个维度 × 可追溯",
            visual_description: "5 个橙色圆点依次亮起",
            visual_prompt: "极简图形，5 个圆点依次点亮，米白背景",
            evidence_article_ids: sourceIds,
            claim_type: "sourced",
          },
          {
            index: 9,
            duration_seconds: 10,
            voiceover: "我默认采纳第一个角度，剩下四个留作备选，切换不覆盖旧版本。",
            onscreen_text: "角度 1 / 5",
            visual_description: "5 张卡片翻转，第一张停在中央",
            visual_prompt: "卡片翻转动效，中央卡片高亮橙色边框",
            evidence_article_ids: sourceIds,
            claim_type: "creative",
          },
          {
            index: 10,
            duration_seconds: 8,
            voiceover:
              "把规则交给系统，把判断留给自己。这才是单人矩阵的杠杆。",
            onscreen_text: "规则交给系统，判断留给自己",
            visual_description: "屏幕暗下，只剩一行字幕和品牌字标",
            visual_prompt: "米白背景，中央一行黑色字幕，橙色品牌字标，极简",
            evidence_article_ids: sourceIds,
            claim_type: "creative",
          },
        ],
      },
      source_article_ids: sourceIds,
      prompt_version: "v1",
    },
  };
}

export const MOCK_BRAND_SETTINGS: BrandSettings = {
  brand_name: "",
  has_logo: false,
  has_font: false,
  font_license_confirmed_at: null,
  updated_at: NOW_SEC,
};

export const MOCK_CONNECTIVITY: ConnectivityStatus = {
  wechat_search: "configured",
  wechat_account: "pending_verify",
  ark_text: "configured",
  ark_image: "configured",
  blob: "configured",
  neon: "configured",
};
// ---- 别名导出（兼容页面中的命名 import） ----
export { MOCK_TOTAL as MOCK_PAGES_TOTAL };
export const MOCK_ARTICLES = ARTICLES;
export const MOCK_RUN_META = {
  total: MOCK_TOTAL,
  total_pages: MOCK_TOTAL_PAGE,
  page: MOCK_RUN.summary.page,
  data_number: MOCK_RUN.summary.data_number,
  array_length: MOCK_RUN.summary.array_length,
  requestId: MOCK_RUN.summary.requestId,
  consumedPoints: MOCK_RUN.summary.consumedPoints,
  low_fans_threshold: MOCK_RUN.low_fans_threshold,
};
export const MOCK_WORDS: Array<{ text: string; weight: number }> = [
  "AI", "职场", "效率", "工具", "自动化", "团队", "协作", "知识", "管理", "复盘",
  "输出", "习惯", "精力", "专注", "决策", "沟通", "信息", "系统", "周报", "目标",
  "工作流", "模板", "提示词", "增长", "数据", "任务", "项目", "执行", "反馈", "迭代",
  "时间", "经验", "方法论", "会议", "笔记", "日历", "优先级", "瓶颈", "复盘法", "深度工作",
].map((text, i) => ({ text, weight: 40 - i + ((i * 7) % 5) }));
export const MOCK_TOP5 = {
  by_praise: ARTICLES.slice()
    .sort((a, b) => (b.praise ?? 0) - (a.praise ?? 0))
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title, value: a.praise ?? 0, wx_name: a.wx_name })),
  by_interaction: ARTICLES.slice()
    .map((a) => {
      const rate = a.read && a.read > 0 && a.read !== 100001
        ? ((a.praise + a.looking) / a.read) * 100
        : 0;
      return { id: a.id, title: a.title, value: rate, wx_name: a.wx_name, read: a.read };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5),
};
export const MOCK_RECENT_RUNS = getRecentSearches();
export const MOCK_CREATIONS = getCreationRecords();
export const MOCK_COMMONALITY = (() => {
  const job = getCreationJob("job_001");
  return job?.commonality ?? null;
})();
export const MOCK_GRAPHIC_RESULT = (() => {
  const job = getCreationJob("job_mock_001");
  return job?.commonality?.graphic ?? null;
})();
export const MOCK_VIDEO_RESULT = (() => {
  const job = getCreationJob("job_mock_001");
  return job?.commonality?.video ?? null;
})();
export type { ArticleWithEvaluation as ArticleItem } from "./mock-types";
export type { LabelStatus as Label, OutputType } from "./mock-types";
