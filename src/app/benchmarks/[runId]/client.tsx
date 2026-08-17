"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Sparkles,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Loader2,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  CloudDownload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MOCK_ARTICLES as ALL_ARTICLES,
  MOCK_RUN,
  MOCK_RUN_META,
  MOCK_WORDS,
  MOCK_TOP5,
  type ArticleItem,
  type Label,
} from "@/lib/mock-data";
import {
  cn,
  formatDateTime,
  formatNumber,
  interactionRate,
  normalizeText,
} from "@/lib/utils";

type FilterLabel = "all" | "low_fan_viral" | "data_missing";

export function BenchmarksResultClient({ runId }: { runId: string }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "read", desc: true },
  ]);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [labelFilter, setLabelFilter] = useState<FilterLabel>("all");
  const [wordFilter, setWordFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  // 模拟全量抓取进度
  useEffect(() => {
    if (!batchRunning) return;
    const t = setInterval(() => {
      setBatchProgress((p) => {
        if (p >= 59) {
          setBatchRunning(false);
          return 59;
        }
        return p + 1;
      });
    }, 180);
    return () => clearInterval(t);
  }, [batchRunning]);

  const totalPages = MOCK_RUN_META.total_pages;
  const pageSize = 20;
  const pageArticles = useMemo<ArticleItem[]>(() => {
    // Mock: 每页用 20 条基础数据 + 页码派生的标题/指标，演示分页
    return ALL_ARTICLES.slice(0, pageSize).map((a, idx) => {
      const seed = (page - 1) * pageSize + idx;
      const labelPool: Label[] = [
        "low_fan_viral",
        "low_fan_viral",
        "data_missing",
        "not_matched",
        "not_matched",
        "pending",
      ];
      return {
        ...a,
        id: `${a.id}-p${page}-i${idx}`,
        position: seed + 1,
        title:
          page === 1
            ? a.title
            : `${a.title.split("｜")[0]}｜第${page}页第${idx + 1}条`,
        read: Math.max(
          100,
          Math.round(a.read / Math.sqrt(page) * (0.8 + ((seed * 7) % 5) / 10)),
        ),
        praise: Math.max(
          0,
          Math.round(a.praise * (0.7 + ((seed * 3) % 6) / 10)),
        ),
        looking: Math.max(
          0,
          Math.round(a.looking * (0.6 + ((seed * 5) % 7) / 10)),
        ),
        label: labelPool[seed % labelPool.length],
        fans:
          labelPool[seed % labelPool.length] === "low_fan_viral"
            ? 300 + (seed % 700)
            : labelPool[seed % labelPool.length] === "not_matched"
              ? 5000 + (seed % 80000)
              : labelPool[seed % labelPool.length] === "data_missing"
                ? null
                : undefined,
        avg_top_read:
          labelPool[seed % labelPool.length] === "low_fan_viral"
            ? 200 + (seed % 400)
            : labelPool[seed % labelPool.length] === "not_matched"
              ? 3000 + (seed % 5000)
              : labelPool[seed % labelPool.length] === "data_missing"
                ? null
                : undefined,
        fetched_at:
          labelPool[seed % labelPool.length] === "pending"
            ? null
            : 1755200000 + seed * 1000,
      };
    });
  }, [page]);

  const filtered = useMemo(() => {
    let list = pageArticles;
    if (labelFilter !== "all") {
      list = list.filter((a) => a.label === labelFilter);
    }
    if (wordFilter) {
      const w = wordFilter.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(w) ||
          a.content.toLowerCase().includes(w),
      );
    }
    return list;
  }, [pageArticles, labelFilter, wordFilter]);

  const columnHelper = createColumnHelper<ArticleItem>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        size: 36,
        header: ({ table }) => (
          <Checkbox
            checked={
              filtered.length > 0 &&
              filtered.every((a) => selectedKeys.has(a.id))
                ? true
                : filtered.some((a) => selectedKeys.has(a.id))
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(v) => {
              setSelectedKeys((prev) => {
                const next = new Set(prev);
                if (v === true) {
                  filtered
                    .filter((a) => !!a.content)
                    .slice(0, 10 - next.size)
                    .forEach((a) => next.add(a.id));
                } else if (v === "indeterminate") {
                  filtered.forEach((a) => next.delete(a.id));
                } else {
                  filtered.forEach((a) => next.delete(a.id));
                }
                return next;
              });
            }}
            aria-label="全选当前页"
          />
        ),
        cell: ({ row }) => {
          const a = row.original;
          const disabled = !a.content;
          return (
            <Checkbox
              checked={selectedKeys.has(a.id)}
              disabled={disabled}
              onCheckedChange={(v) => {
                setSelectedKeys((prev) => {
                  const next = new Set(prev);
                  if (v) {
                    if (next.size >= 10) return next;
                    next.add(a.id);
                  } else {
                    next.delete(a.id);
                  }
                  return next;
                });
              }}
              aria-label={`选择 ${a.title}`}
            />
          );
        },
      }),
      columnHelper.display({
        id: "label",
        size: 120,
        header: "标签",
        cell: ({ row }) => <LabelPill label={row.original.label} />,
      }),
      columnHelper.accessor("avatar", {
        size: 64,
        header: "公众号头像",
        cell: (info) =>
          info.getValue() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.getValue()}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-md object-cover border border-line"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-surface-sunken border border-line flex items-center justify-center text-ink-3 text-[11px]">
              —
            </div>
          ),
      }),
      columnHelper.accessor("title", {
        size: 340,
        header: "标题",
        cell: (info) => {
          const a = info.row.original;
          const abnormal = a.title.length > 200;
          return (
            <div className="space-y-1">
              <div
                className={cn(
                  "text-[13px] text-ink leading-snug",
                  !expandedKeys.has(a.id) && "line-clamp-2",
                )}
              >
                {a.title}
              </div>
              {abnormal && (
                <div className="text-[11px] text-warning inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  标题疑似异常（{a.title.length} 字符）
                </div>
              )}
              <div className="text-[11px] text-ink-3 line-clamp-2">
                {a.content.slice(0, 80)}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("wx_name", {
        size: 160,
        header: "公众号",
        cell: (info) => (
          <div className="text-[12px]">
            <div className="text-ink">{info.getValue() || "—"}</div>
            <div className="text-ink-3 text-[11px] font-mono">
              {info.row.original.ghid || "—"}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("publish_time_str", {
        size: 140,
        header: "发布时间",
        cell: (info) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[12px] text-ink-2 tabular-nums cursor-help">
                {info.getValue()}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              原始 epoch: {info.row.original.publish_time}
            </TooltipContent>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("read", {
        size: 100,
        header: "阅读",
        cell: (info) => (
          <span className="text-[12px] tabular-nums font-medium text-ink">
            {info.getValue() === 100001
              ? "10万+"
              : formatNumber(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("praise", {
        size: 80,
        header: "点赞",
        cell: (info) => (
          <span className="text-[12px] tabular-nums text-ink-2">
            {formatNumber(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("looking", {
        size: 80,
        header: "在看",
        cell: (info) => (
          <span className="text-[12px] tabular-nums text-ink-2">
            {formatNumber(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "interaction_rate",
        size: 100,
        header: "互动率",
        cell: ({ row }) => {
          const a = row.original;
          const r = interactionRate(a.read, a.praise, a.looking);
          if (r === null) {
            return <span className="text-[12px] text-ink-3">—</span>;
          }
          if (r.capped) {
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[12px] tabular-nums text-ink-3">
                    ≤ {r.value}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  read=100001 为 10 万+ 编码，仅显示上界
                </TooltipContent>
              </Tooltip>
            );
          }
          return (
            <span className="text-[12px] tabular-nums text-ink-2">{r.value}</span>
          );
        },
      }),
      columnHelper.display({
        id: "fans",
        size: 130,
        header: "预估活跃粉丝",
        cell: ({ row }) => {
          const a = row.original;
          if (a.label === "pending" || a.fans === undefined) {
            return (
              <span className="text-[11px] text-info inline-flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                查询中
              </span>
            );
          }
          if (a.fans === null) return <span className="text-[12px] text-ink-3">—</span>;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[12px] tabular-nums text-ink-2 cursor-help">
                  {formatNumber(a.fans)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                头条平均阅读 {formatNumber(a.avg_top_read ?? 0)} · 抓取于{" "}
                {a.fetched_at ? formatDateTime(a.fetched_at * 1000) : "—"}
              </TooltipContent>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor("classify", {
        size: 110,
        header: "分类",
        cell: (info) => (
          <span className="text-[12px] text-ink-2">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("ip_wording", {
        size: 100,
        header: "IP 属地",
        cell: (info) => (
          <span className="text-[12px] text-ink-2">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        size: 110,
        header: "操作",
        cell: ({ row }) => {
          const a = row.original;
          return (
            <div className="flex items-center gap-1">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 inline-flex items-center justify-center rounded text-ink-3 hover:text-brand-ink hover:bg-brand-soft"
                title="打开原文长链"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={a.short_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 inline-flex items-center justify-center rounded text-ink-3 hover:text-brand-ink hover:bg-brand-soft"
                title="打开短链"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() =>
                  setExpandedKeys((prev) => {
                    const next = new Set(prev);
                    if (next.has(a.id)) next.delete(a.id);
                    else next.add(a.id);
                    return next;
                  })
                }
                className="w-7 h-7 inline-flex items-center justify-center rounded text-ink-3 hover:text-ink hover:bg-surface-sunken"
                title="展开全部字段"
              >
                {expandedKeys.has(a.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, expandedKeys, selectedKeys],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  });

  const persistedPageCount = batchRunning ? batchProgress : 1;

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5 space-y-5" ref={topRef}>
      {/* 任务摘要 */}
      <SummaryBar
        runId={runId}
        persistedPages={persistedPageCount}
        totalPages={totalPages}
        knownPoints={MOCK_RUN_META.consumedPoints}
        distinctCount={MOCK_RUN_META.total - ((page - 1) * 3)}
        rawCount={persistedPageCount * 20}
        batchRunning={batchRunning}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* 左：表格区 */}
        <div className="space-y-4 min-w-0">
          <Card>
            <CardContent className="p-3 md:p-4 space-y-3">
              {/* 分页 + 全量 */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      setPageInput(String(page - 1));
                    }}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一页
                  </Button>
                  <div className="flex items-center gap-1.5 text-[12px] text-ink-2">
                    <Input
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const n = parseInt(pageInput, 10);
                          if (!Number.isNaN(n) && n >= 1 && n <= totalPages) {
                            setPage(n);
                          }
                        }
                      }}
                      className="h-8 w-14 text-center"
                    />
                    <span>/ {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => p + 1);
                      setPageInput(String(page + 1));
                    }}
                    className="gap-1"
                  >
                    下一页
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <span className="text-[12px] text-ink-3">
                    已持久化 {persistedPageCount}/{totalPages} 页
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {batchRunning ? (
                    <>
                      <span className="text-[12px] text-info inline-flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        抓取中 {batchProgress}/{totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBatchRunning(false)}
                        className="gap-1"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        暂停
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBatchProgress(1);
                          setBatchRunning(true);
                        }}
                        className="gap-1"
                      >
                        <CloudDownload className="w-4 h-4" />
                        获取剩余全部
                      </Button>
                      {persistedPageCount < totalPages &&
                        persistedPageCount > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBatchRunning(true)}
                            className="gap-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            继续
                          </Button>
                        )}
                    </>
                  )}
                </div>
              </div>

              {/* 快速筛选 */}
              <div className="flex flex-wrap items-center gap-2">
                <FilterChip
                  active={labelFilter === "all"}
                  onClick={() => setLabelFilter("all")}
                >
                  全部
                </FilterChip>
                <FilterChip
                  active={labelFilter === "low_fan_viral"}
                  tone="brand"
                  onClick={() => setLabelFilter("low_fan_viral")}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  低粉爆款
                </FilterChip>
                <FilterChip
                  active={labelFilter === "data_missing"}
                  tone="warning"
                  onClick={() => setLabelFilter("data_missing")}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  数据缺失
                </FilterChip>
                {wordFilter && (
                  <button
                    type="button"
                    onClick={() => setWordFilter(null)}
                    className="inline-flex items-center gap-1 text-[12px] px-2 py-1 rounded bg-info-bg text-info"
                  >
                    词云过滤：{wordFilter}
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className="ml-auto text-[11px] text-ink-3">
                  基于已获取 {persistedPageCount}/{totalPages} 页 ·
                  数据抓取时间 {MOCK_RUN.completed_at ? formatDateTime(MOCK_RUN.completed_at * 1000) : "—"}
                </div>
              </div>

              {/* 表格 */}
              <div className="border border-line rounded-md overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead className="bg-surface-sunken">
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((h) => {
                          const canSort = h.column.getCanSort();
                          const sorted = h.column.getIsSorted();
                          return (
                            <th
                              key={h.id}
                              style={{ width: h.getSize() }}
                              className={cn(
                                "px-3 py-2 text-[11px] font-medium text-ink-3 uppercase tracking-wide border-b border-line whitespace-nowrap",
                                canSort &&
                                  "cursor-pointer select-none hover:text-ink-2",
                              )}
                              onClick={h.column.getToggleSortingHandler()}
                            >
                              <span className="inline-flex items-center gap-1">
                                {flexRender(
                                  h.column.columnDef.header,
                                  h.getContext(),
                                )}
                                {canSort && sorted === "asc" && (
                                  <ChevronUp className="w-3 h-3" />
                                )}
                                {canSort && sorted === "desc" && (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const a = row.original;
                      const expanded = expandedKeys.has(a.id);
                      return (
                        <>
                          <tr
                            key={row.id}
                            className={cn(
                              "border-b border-line hover:bg-surface-sunken/50 transition-colors",
                              selectedKeys.has(a.id) && "bg-brand-soft/40",
                            )}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="px-3 py-2.5 align-top"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </td>
                            ))}
                          </tr>
                          {expanded && (
                            <tr
                              key={`${row.id}-expand`}
                              className="bg-canvas border-b border-line"
                            >
                              <td colSpan={columns.length} className="p-4">
                                <ExpandedPanel article={a} />
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右：Top5 + 词云 */}
        <aside className="space-y-4 min-w-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px]">点赞 Top 5</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ol className="space-y-2">
                {MOCK_TOP5.by_praise.map((a, idx) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-2 text-[12px]"
                  >
                    <span className="w-5 h-5 rounded bg-surface-sunken text-ink-2 text-[11px] font-mono inline-flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <button
                        onClick={() => router.push(`/benchmarks/${runId}`)}
                        className="text-ink hover:text-brand-ink line-clamp-2 text-left"
                      >
                        {a.title}
                      </button>
                      <div className="text-ink-3 text-[11px] mt-0.5 tabular-nums">
                        {formatNumber(a.value)} 赞 · {a.wx_name}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px]">互动率 Top 5</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ol className="space-y-2">
                {MOCK_TOP5.by_interaction.map((a, idx) => {
                  return (
                    <li
                      key={a.id}
                      className="flex items-start gap-2 text-[12px]"
                    >
                      <span className="w-5 h-5 rounded bg-surface-sunken text-ink-2 text-[11px] font-mono inline-flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-ink line-clamp-2">{a.title}</div>
                        <div className="text-ink-3 text-[11px] mt-0.5 tabular-nums">
                          {a.value.toFixed(2)}%
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] flex items-center justify-between">
                词云
                <span className="text-[11px] text-ink-3 font-normal">
                  最多 40 个词
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {MOCK_WORDS.map((w) => (
                  <button
                    key={w.text}
                    onClick={() =>
                      setWordFilter((cur) =>
                        cur === w.text ? null : w.text,
                      )
                    }
                    className={cn(
                      "px-2 py-0.5 rounded border text-[12px] transition-colors",
                      wordFilter === w.text
                        ? "bg-brand text-white border-brand"
                        : "bg-surface-sunken border-line text-ink-2 hover:text-brand-ink hover:border-brand/40",
                    )}
                    style={{
                      fontSize: `${11 + Math.min(10, Math.round(w.weight / 3))}px`,
                    }}
                  >
                    {w.text}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* 底部操作条 */}
      <div className="sticky bottom-0 z-20 -mx-4 md:-mx-6 px-4 md:px-6 pb-4 pt-2 bg-gradient-to-t from-canvas via-canvas/95 to-canvas/0">
        <div className="bg-ink text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
          <Checkbox
            checked={selectedKeys.size > 0 ? true : false}
            aria-hidden
            className="data-[state=checked]:bg-brand data-[state=checked]:border-brand border-white/30"
            tabIndex={-1}
          />
          <div className="text-[13px]">
            已选 <span className="font-semibold">{selectedKeys.size}</span>/10
            篇
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedKeys(new Set())}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </Button>
          <div className="flex-1" />
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                disabled={selectedKeys.size === 0}
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                开始 AI 二创
              </Button>
            </DrawerTrigger>
            <DrawerContent
              {...({ direction: "right" } as Record<string, unknown>)}
              className="w-full sm:max-w-[420px] h-full"
            >
              <CreationDrawer
                selectedCount={selectedKeys.size}
                onClose={() => setDrawerOpen(false)}
                onConfirm={(opts) => {
                  setDrawerOpen(false);
                  const jobId = "mock-job-001";
                  router.push(
                    `/create/${jobId}?output=${opts.outputType}&cards=${opts.cardCount}`,
                  );
                }}
              />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

function SummaryBar({
  runId,
  persistedPages,
  totalPages,
  knownPoints,
  distinctCount,
  rawCount,
  batchRunning,
}: {
  runId: string;
  persistedPages: number;
  totalPages: number;
  knownPoints: number;
  distinctCount: number;
  rawCount: number;
  batchRunning: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] text-ink-3 font-mono mb-1">
              run_id: {runId}
            </div>
            <div className="text-[15px] font-semibold text-ink truncate">
              {MOCK_RUN.kw}
            </div>
            <div className="text-[12px] text-ink-3 mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>
                排序 {MOCK_RUN.sort_type === 1 ? "阅读数" : "时间"} · mode=
                {MOCK_RUN.mode}
              </span>
              <span>{MOCK_RUN.period} 天</span>
              <span>低粉 ≤ {MOCK_RUN.low_fans_threshold}</span>
              <span>规则 v1 · 阅读倍数 3×</span>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
            <Metric
              label="API 匹配总数"
              value={String(MOCK_RUN_META.total)}
            />
            <Metric
              label="已持久化页"
              value={`${persistedPages}/${totalPages}`}
              tone={persistedPages === totalPages ? "success" : "default"}
            />
            <Metric label="原始出现" value={String(rawCount)} />
            <Metric label="去重文章" value={String(distinctCount)} />
            <Metric label="失败/未知页" value="0" />
            <Metric
              label="实际积分"
              value={
                batchRunning
                  ? `≥ ${knownPoints * persistedPages}`
                  : `${knownPoints * persistedPages}`
              }
              tone="brand"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "brand";
}) {
  return (
    <div className="rounded-md border border-line bg-surface px-2.5 py-1.5">
      <div className="text-[10px] text-ink-3 uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "text-[14px] font-semibold tabular-nums",
          tone === "success" && "text-success",
          tone === "brand" && "text-brand-ink",
          tone === "default" && "text-ink",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function LabelPill({ label }: { label: Label }) {
  if (label === "low_fan_viral") {
    return (
      <Badge className="bg-brand text-white border-brand gap-1">
        <CheckCircle2 className="w-3 h-3" />
        低粉爆款
      </Badge>
    );
  }
  if (label === "data_missing") {
    return (
      <Badge variant="warning" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        数据缺失
      </Badge>
    );
  }
  if (label === "pending") {
    return (
      <Badge variant="outline" className="text-info gap-1 border-info/40">
        <Loader2 className="w-3 h-3 animate-spin" />
        查询中
      </Badge>
    );
  }
  return <span className="text-[11px] text-ink-3">—</span>;
}

function FilterChip({
  active,
  children,
  onClick,
  tone = "neutral",
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  tone?: "neutral" | "brand" | "warning";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] border transition-colors",
        active
          ? tone === "brand"
            ? "bg-brand text-white border-brand"
            : tone === "warning"
              ? "bg-warning-bg text-warning border-warning/30"
              : "bg-ink text-white border-ink"
          : "bg-surface text-ink-2 border-line hover:text-ink hover:border-ink-3",
      )}
    >
      {children}
    </button>
  );
}

function ExpandedPanel({ article }: { article: ArticleItem }) {
  const normalized = normalizeText(article.title + "\n" + article.content);
  const kv: [string, React.ReactNode][] = [
    ["title", article.title],
    ["url", <KvLink key="u" v={article.url ?? ""} />],
    ["short_link", <KvLink key="s" v={article.short_link ?? ""} />],
    ["wx_name", article.wx_name || "—"],
    ["wx_id", article.wx_id || "—"],
    ["ghid", article.ghid || "—"],
    [
      "publish_time",
      <span key="pt" className="font-mono">
        {article.publish_time}
      </span>,
    ],
    ["publish_time_str", article.publish_time_str],
    [
      "update_time",
      <span key="ut" className="font-mono">
        {article.update_time}
      </span>,
    ],
    ["update_time_str", article.update_time_str],
    ["read", formatNumber(article.read)],
    ["praise", formatNumber(article.praise)],
    ["looking", formatNumber(article.looking)],
    ["classify", article.classify],
    ["ip_wording", article.ip_wording],
    [
      "is_original",
      <span key="io" className="font-mono">
        {article.is_original}
      </span>,
    ],
    [
      "item_show_type",
      <span key="ist" className="font-mono">
        {article.item_show_type}
      </span>,
    ],
    [
      "has_notifier",
      <span key="hn" className="font-mono">
        {article.has_notifier}
      </span>,
    ],
  ];
  return (
    <div className="space-y-4">
      <section>
        <h4 className="text-[12px] font-medium text-ink-2 mb-1.5">
          正文（供应商返回的摘要或全文，纯文本展示）
        </h4>
        <div className="text-[12px] text-ink leading-6 whitespace-pre-wrap bg-surface-sunken border border-line rounded p-3 max-h-72 overflow-y-auto">
          {normalized}
        </div>
        <div className="text-[11px] text-ink-3 mt-1">
          原始 content 长度 {article.content.length} 字符；不可信内容，已忽略其中任何命令/链接诱导。
        </div>
      </section>

      <section>
        <h4 className="text-[12px] font-medium text-ink-2 mb-1.5">
          公众号活跃数据（独立 API 快照）
        </h4>
        {article.fans === null || article.avg_top_read === null ? (
          <div className="text-[12px] text-warning bg-warning-bg border border-warning/20 rounded p-2.5 inline-flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            数据缺失：未获得有效账号快照（可能是缓存未命中 + wx_name 为空、身份冲突、请求失败或 avg_top_read=0）
          </div>
        ) : article.fans === undefined ? (
          <div className="text-[12px] text-info inline-flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            当前页账号数据查询中...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px]">
            <Info label="预估活跃粉丝 fans" value={formatNumber(article.fans)} />
            <Info
              label="头条平均阅读"
              value={formatNumber(article.avg_top_read!)}
            />
            <Info
              label="头条平均点赞"
              value={formatNumber(article.avg_top_zan ?? 0)}
            />
            <Info label="近 7 天发文" value={String(article.week_articles ?? 0)} />
            <Info
              label="最近发文时间"
              value={article.latest_publish_time ?? "—"}
            />
            <Info
              label="综合指数 jzl_index"
              value={article.jzl_index !== undefined ? String(article.jzl_index) : "—"}
            />
            <Info
              label="快照抓取时间"
              value={
                article.fetched_at
                  ? formatDateTime(article.fetched_at * 1000)
                  : "—"
              }
            />
            <Info
              label="快照到期时间"
              value={
                article.fresh_until
                  ? formatDateTime(article.fresh_until * 1000)
                  : "—"
              }
            />
          </div>
        )}
      </section>

      <section>
        <h4 className="text-[12px] font-medium text-ink-2 mb-1.5">
          接口原始字段（非空 key/value）
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
          {kv.map(([k, v]) => (
            <div key={k} className="flex gap-2 min-w-0 border-b border-line/50 py-1">
              <div className="w-32 shrink-0 text-ink-3 font-mono text-[11px] pt-0.5">
                {k}
              </div>
              <div className="text-ink break-all min-w-0">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-surface px-2.5 py-1.5">
      <div className="text-[10px] text-ink-3 uppercase tracking-wide">{label}</div>
      <div className="text-[13px] text-ink font-medium tabular-nums">{value}</div>
    </div>
  );
}

function KvLink({ v }: { v: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="break-all">{v}</span>
      <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-ink hover:underline"
      >
        <ExternalLink className="w-3 h-3" />
      </a>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(v)}
        className="text-ink-3 hover:text-ink"
        title="复制"
      >
        <Copy className="w-3 h-3" />
      </button>
    </span>
  );
}

function CreationDrawer({
  selectedCount,
  onClose,
  onConfirm,
}: {
  selectedCount: number;
  onClose: () => void;
  onConfirm: (opts: {
    outputType: "graphic" | "video" | "both";
    cardCount: number;
    palette: string;
    visualStyle: "realistic" | "illustration" | "3d";
  }) => void;
}) {
  const [outputType, setOutputType] = useState<"graphic" | "video" | "both">(
    "graphic",
  );
  const [cardCount, setCardCount] = useState(6);
  const [palette, setPalette] = useState("warm-white-orange");
  const [visualStyle, setVisualStyle] = useState<
    "realistic" | "illustration" | "3d"
  >("illustration");

  const totalImages =
    outputType === "video" ? 0 : 1 + cardCount;

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader className="border-b border-line">
        <DrawerTitle className="text-[15px]">二创设置</DrawerTitle>
        <DrawerClose asChild>
          <button
            className="absolute right-4 top-4 text-ink-3 hover:text-ink"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </DrawerClose>
      </DrawerHeader>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <div className="text-[12px] text-ink-3 mb-2">产物类型</div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { v: "graphic", label: "图文" },
                { v: "video", label: "视频脚本" },
                { v: "both", label: "两者" },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setOutputType(o.v)}
                className={cn(
                  "px-3 py-2 rounded-md border text-[13px] transition-colors",
                  outputType === o.v
                    ? "border-brand bg-brand-soft text-brand-ink font-medium"
                    : "border-line bg-surface text-ink-2 hover:border-ink-3",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {outputType !== "video" && (
          <div>
            <div className="text-[12px] text-ink-3 mb-2">正文卡片数</div>
            <div className="grid grid-cols-4 gap-2">
              {[6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => setCardCount(n)}
                  className={cn(
                    "px-3 py-2 rounded-md border text-[13px] tabular-nums",
                    cardCount === n
                      ? "border-brand bg-brand-soft text-brand-ink font-medium"
                      : "border-line bg-surface text-ink-2 hover:border-ink-3",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-ink-3 mt-1.5">
              共 1 张封面 + {cardCount} 张正文卡片 = {1 + cardCount} 张
            </div>
          </div>
        )}

        <div>
          <div className="text-[12px] text-ink-3 mb-2">固定版式</div>
          <div className="text-[13px] text-ink-2 bg-surface-sunken border border-line rounded px-3 py-2">
            1 套（不可切换布局）
          </div>
        </div>

        <div>
          <div className="text-[12px] text-ink-3 mb-2">配色</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "warm-white-orange", label: "暖白 + 橙", c: "#F0642B" },
              { v: "ink-paper", label: "墨 + 纸", c: "#171717" },
              { v: "cream-teal", label: "米 + 青", c: "#0E7C7B" },
            ].map((p) => (
              <button
                key={p.v}
                onClick={() => setPalette(p.v)}
                className={cn(
                  "px-3 py-2 rounded-md border text-[12px] flex items-center gap-2",
                  palette === p.v
                    ? "border-brand bg-brand-soft text-brand-ink font-medium"
                    : "border-line bg-surface text-ink-2",
                )}
              >
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-line"
                  style={{ background: p.c }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[12px] text-ink-3 mb-2">视觉风格</div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { v: "realistic", label: "写实" },
                { v: "illustration", label: "插画" },
                { v: "3d", label: "3D" },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setVisualStyle(o.v)}
                className={cn(
                  "px-3 py-2 rounded-md border text-[13px]",
                  visualStyle === o.v
                    ? "border-brand bg-brand-soft text-brand-ink font-medium"
                    : "border-line bg-surface text-ink-2 hover:border-ink-3",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-surface-sunken border border-line p-3 text-[12px] text-ink-2 leading-relaxed">
          使用 <span className="font-semibold text-ink">{selectedCount}</span>{" "}
          篇文章，预计生成{" "}
          <span className="font-semibold text-ink">{totalImages}</span> 张图片
          {outputType === "video" && "（视频脚本与分镜不含图片）"}。
          确认后系统自动执行：单篇摘要 → 多源共性提炼 → Brief + 5 个角度 →
          封面 / 卡片 / 视频脚本。
        </div>
      </div>
      <div className="border-t border-line p-4 flex items-center gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          取消
        </Button>
        <Button
          className="flex-1 gap-1.5"
          onClick={() =>
            onConfirm({ outputType, cardCount, palette, visualStyle })
          }
        >
          <Sparkles className="w-4 h-4" />
          确认生成
        </Button>
      </div>
    </div>
  );
}
