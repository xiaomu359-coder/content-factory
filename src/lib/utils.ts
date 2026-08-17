import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** 把秒级 epoch 转成 YYYY-MM-DD HH:mm */
export function formatEpochSec(sec: number | null | undefined): string {
  if (!sec || !Number.isFinite(sec)) return "—";
  const d = new Date(sec * 1000);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** 相对时间（用于账号快照新鲜度） */
export function timeAgo(input: Date | number | null | undefined): string {
  if (input == null) return "—";
  const ts = typeof input === "number" ? input : input.getTime();
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec} 秒前`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.round(hr / 24);
  return `${day} 天前`;
}

/** 数字千分位 */
export function formatInt(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US");
}

/** 100001 显示成 10万+ */
export function formatRead(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n === 100001) return "10万+";
  return n.toLocaleString("en-US");
}

/** 互动率 = (praise + looking) / read * 100%；read=100001 只给上界 */
export function interactionRate(
  read: number | null | undefined,
  praise: number | null | undefined,
  looking: number | null | undefined,
): { value: string; capped: boolean } | null {
  if (
    read == null ||
    praise == null ||
    looking == null ||
    !Number.isFinite(read) ||
    read <= 0
  )
    return null;
  const numerator = praise + looking;
  if (read === 100001) {
    return {
      value: `≤ ${((numerator / 100000) * 100).toFixed(2)}%`,
      capped: true,
    };
  }
  return { value: `${((numerator / read) * 100).toFixed(2)}%`, capped: false };
}

/** 把秒或毫秒数转成 mm:ss 或 hh:mm:ss */
export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`;
}

/** 安全打开微信原文：非 mp.weixin.qq.com 不直接跳转 */
export function isWeChatArticleUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "mp.weixin.qq.com";
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ---- 别名（兼容客户端代码命名） ----
export const formatNumber = formatInt;
export function formatDateTime(
  input: Date | number | string | null | undefined,
): string {
  if (input == null) return "—";
  let d: Date;
  if (input instanceof Date) d = input;
  else if (typeof input === "number") {
    // 10 位按秒级 epoch 处理；13 位按毫秒处理
    d = new Date(input < 1e12 ? input * 1000 : input);
  } else {
    d = new Date(input);
  }
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 把 CRLF/CR 归一为 LF；识别字面 \n 渲染为换行（保留原值副本在外层） */
export function normalizeText(s: string | null | undefined): string {
  if (s == null) return "";
  return s
    .replace(/\r\n?/g, "\n")
    .replace(/\\n/g, "\n");
}

/** 生成稳定 id（仅前端 mock/key 用途，不用于持久化） */
export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** 把任意值格式化成可显示字符串（用于原始字段表） */
export function stringifyValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}
