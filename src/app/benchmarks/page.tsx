"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  Clock,
  Plus,
  Timer,
  History,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DEFAULT_LOW_FANS_THRESHOLD,
  MOCK_RECENT_RUNS,
  MOCK_RUN,
  MOCK_SESSION,
} from "@/lib/mock-data";
import { cn, formatDateTime, formatDuration } from "@/lib/utils";

const schema = z
  .object({
    kw: z
      .string()
      .trim()
      .min(2, "关键词至少 2 个字符")
      .max(100, "关键词不超过 100 字符"),
    any_kw: z
      .string()
      .trim()
      .max(100, "不超过 100 字符")
      .optional()
      .transform((v) => v ?? ""),
    ex_kw: z
      .string()
      .trim()
      .max(100, "不超过 100 字符")
      .optional()
      .transform((v) => v ?? ""),
    sort_type: z.enum(["1", "2"]),
    mode: z.enum(["1", "2", "3"]),
    period: z.string().min(1),
    low_fans_threshold: z.string().min(1),
  })
  .superRefine((val, ctx) => {
    const mode = Number(val.mode);
    const period = Number(val.period);
    const max = mode === 1 ? 720 : 30;
    if (!Number.isFinite(period) || period < 1 || period > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["period"],
        message:
          mode === 1
            ? "标题搜索范围 1–720 天"
            : "正文/标题+正文搜索范围 1–30 天",
      });
    }
    const threshold = Number(val.low_fans_threshold);
    if (!Number.isFinite(threshold) || threshold < 0 || !Number.isInteger(threshold)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["low_fans_threshold"],
        message: "必须是 ≥ 0 的整数",
      });
    }
  });

type FormValues = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export default function BenchmarksPage() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const form = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      kw: "",
      any_kw: "",
      ex_kw: "",
      sort_type: "1",
      mode: "3",
      period: "30",
      low_fans_threshold: String(DEFAULT_LOW_FANS_THRESHOLD),
    },
    mode: "onChange",
  });

  const mode = Number(form.watch("mode") ?? "3");
  const periodMax = mode === 1 ? 720 : 30;

  function onSubmit(_values: FormOutput) {
    // Mock: 跳转到一个固定的 runId（由 mock-data 提供默认 run）
    if (mounted) void router.push(`/benchmarks/${MOCK_RUN.id}`);
  }

  function startNewSession() {
    setElapsed(0);
    form.reset({
      kw: "",
      any_kw: "",
      ex_kw: "",
      sort_type: "1",
      mode: "3",
      period: "30",
      low_fans_threshold: String(DEFAULT_LOW_FANS_THRESHOLD),
    });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-6 space-y-6">
      <MockBanner />

      {/* 会话状态条 */}
      <Card>
        <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-md bg-brand-soft flex items-center justify-center shrink-0">
              <Timer className="w-5 h-5 text-brand-ink" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] text-ink-3">
                当前发现会话 · 开始于{" "}
                {formatDateTime(MOCK_SESSION.started_at * 1000)}
              </div>
              <div className="text-[14px] font-medium text-ink">
                已用 {formatDuration(elapsed || 1247)} · 目标 30 分钟以内
              </div>
              <div className="text-[12px] text-ink-3 mt-0.5">
                调整关键词或阈值不会重置计时；只有点击“开始新一轮内容任务”才会重置
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewSession}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            开始新一轮内容任务
          </Button>
        </CardContent>
      </Card>

      {/* 搜索表单 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[15px] flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-ink" strokeWidth={2.2} />
            开始新一轮搜索
          </CardTitle>
          <CardDescription>
            关键词 2–100 字符，空格分隔多个词组。低粉阈值用于【低粉爆款】标签计算，不会发送给文章搜索供应商。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="kw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">关键词 kw</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例如：WorkBuddy AI 效率 工具"
                        {...field}
                        className="h-12 text-[15px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="sort_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>排序</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">按阅读数</SelectItem>
                          <SelectItem value="2">按时间</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>搜索范围 mode</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">搜索标题</SelectItem>
                          <SelectItem value="2">搜索正文</SelectItem>
                          <SelectItem value="3">标题和正文</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>时间范围（天）</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={periodMax}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-[11px] text-ink-3">
                        当前模式允许 1–{periodMax} 天
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="low_fans_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>低粉阈值（粉丝 ≤）</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100000000}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-[11px] text-ink-3">
                        服务端默认 1000；本 run 快照保存
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="any_kw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>任一关键词 any_kw（可选）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="留空则不限制；空格分隔"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ex_kw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>排除关键词 ex_kw（可选）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="留空则不排除；空格分隔"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="gap-2 md:w-auto w-full"
                >
                  <Search className="w-4 h-4" />
                  搜索并创建任务
                </Button>
                <div className="text-[12px] text-ink-3">
                  首次搜索仅请求第 1 页（每页最多 20
                  条），成功后可逐页翻页或一次性确认全量抓取。
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 最近搜索 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[15px] flex items-center gap-2">
            <History className="w-4 h-4" strokeWidth={2.2} />
            最近 20 次搜索
          </CardTitle>
          <CardDescription>
            同一发现会话内连续调整条件不会重置计时；点击任意一行查看结果。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-line">
            {MOCK_RECENT_RUNS.map((run) => (
              <Link
                key={run.id}
                href={`/benchmarks/${run.id}`}
                className={cn(
                  "flex flex-col md:flex-row md:items-center gap-3 px-5 py-3 hover:bg-surface-sunken transition-colors",
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[12px] text-ink-3">
                      {run.id}
                    </span>
                    <StatusPill status={run.status} />
                    <CoveragePill coverage={run.coverage_status} />
                  </div>
                  <div className="text-[14px] font-medium text-ink mt-1 truncate">
                    {run.kw}
                  </div>
                  <div className="text-[12px] text-ink-3 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      排序 {run.sort_type === 1 ? "阅读数" : "时间"} · mode=
                      {run.mode} · {run.period} 天
                    </span>
                    <span>低粉 ≤ {run.low_fans_threshold}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(run.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex md:flex-col items-end gap-1 text-[12px] text-ink-2 shrink-0">
                  <span>
                    {run.persisted_pages}/{run.observed_total_pages} 页
                  </span>
                  <span>
                    {run.raw_article_count} 原始 / {run.distinct_article_count}{" "}
                    去重
                  </span>
                  <span className="text-ink-3">{run.article_search_points} 积分</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string | undefined }) {
  if (!status) return null;
  const map: Record<string, { label: string; tone: string }> = {
    completed: { label: "已完成", tone: "success" },
    running: { label: "进行中", tone: "info" },
    partial: { label: "部分", tone: "warning" },
    failed: { label: "失败", tone: "danger" },
  };
  const m = map[status] ?? { label: status, tone: "neutral" };
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium",
        m.tone === "success" && "bg-success-bg text-success",
        m.tone === "info" && "bg-info-bg text-info",
        m.tone === "warning" && "bg-warning-bg text-warning",
        m.tone === "danger" && "bg-danger-bg text-danger",
        m.tone === "neutral" && "bg-surface-sunken text-ink-2",
      )}
    >
      {m.label}
    </span>
  );
}

function CoveragePill({ coverage }: { coverage: string | undefined }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono bg-surface-sunken text-ink-2 border border-line">
      coverage={coverage}
    </span>
  );
}

function MockBanner() {
  return (
    <Alert variant="warning">
      <AlertCircle className="w-4 h-4" />
      <AlertDescription className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
        <span className="font-medium">MOCK 原型模式</span>
        <span className="text-ink-2">
          当前未连接 Neon / 微信供应商 / Ark
          模型，所有数据均为按 SPEC v0.7 字段构造的夹具，页面仅用于评审
          UI/交互。
        </span>
        <Link
          href="/settings"
          className="md:ml-auto underline underline-offset-2 text-ink-2 hover:text-ink"
        >
          查看连通性配置 →
        </Link>
      </AlertDescription>
    </Alert>
  );
}
