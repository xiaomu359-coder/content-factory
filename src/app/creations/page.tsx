"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Film,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Archive,
  Send,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_CREATIONS } from "@/lib/mock-data";

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "running", label: "生成中" },
  { key: "draft", label: "draft" },
  { key: "published", label: "published" },
  { key: "failed", label: "失败" },
  { key: "archived", label: "archived" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function statusLabel(s: string) {
  const m: Record<string, { label: string; tone: string }> = {
    completed: { label: "已完成", tone: "success" },
    running: { label: "生成中", tone: "info" },
    partial: { label: "部分完成", tone: "warning" },
    failed: { label: "失败", tone: "danger" },
    draft: { label: "draft", tone: "neutral" },
    published: { label: "published", tone: "success" },
    archived: { label: "archived", tone: "neutral" },
  };
  return m[s] ?? { label: s, tone: "neutral" };
}

function VersionBadge({ kind, version }: { kind: string; version: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-line bg-surface-sunken text-[11px]">
      {kind === "graphic" ? (
        <ImageIcon className="w-3 h-3 text-ink-2" />
      ) : (
        <Film className="w-3 h-3 text-ink-2" />
      )}
      <span>{kind === "graphic" ? "图文" : "视频"}</span>
      <span className="text-ink-3">·</span>
      <span
        className={cn(
          version === "published"
            ? "text-success font-medium"
            : version === "archived"
              ? "text-ink-3"
              : version === "失败"
                ? "text-danger"
                : "text-ink-2",
        )}
      >
        {version}
      </span>
    </div>
  );
}

export default function CreationsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const rows = useMemo(() => {
    return MOCK_CREATIONS.filter((c) => {
      if (q && !c.angle_title.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "all") return true;
      if (filter === "draft")
        return c.graphic_status === "draft" || c.video_status === "draft";
      if (filter === "published")
        return (
          c.graphic_status === "published" || c.video_status === "published"
        );
      if (filter === "archived")
        return (
          c.graphic_status === "archived" || c.video_status === "archived"
        );
      if (filter === "running") return c.status === "running";
      if (filter === "failed") return c.status === "failed";
      return true;
    });
  }, [q, filter]);

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5 space-y-4">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-[20px] font-semibold text-ink">创作记录</h1>
          <span className="text-[12px] text-ink-3">
            每条记录代表一个二创任务；图文与视频版本状态独立，人工状态作用于具体版本而非整个任务
          </span>
          <div className="flex-1" />
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索任务标题"
              className="pl-8 h-9"
            />
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1 rounded-full text-[12px] border transition-colors",
                filter === f.key
                  ? "bg-ink text-surface border-ink"
                  : "bg-surface border-line text-ink-2",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-surface rounded-lg border border-line overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-sunken/60">
                <TableHead className="w-[280px]">任务</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>版本状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => {
                const sl = statusLabel(c.status);
                return (
                  <TableRow
                    key={c.job_id}
                    className="cursor-pointer hover:bg-surface-sunken/40"
                  >
                    <TableCell>
                      <div className="font-medium text-ink text-[13px]">
                        <Link href={`/create/${c.job_id}`} className="hover:text-brand-ink">
                          {c.angle_title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={sl.tone === "success" ? "success" : sl.tone === "danger" ? "danger" : sl.tone === "warning" ? "warning" : "neutral"}
                          className="text-[10px]"
                        >
                          {sl.label}
                        </Badge>
                        <span className="text-[10px] text-ink-3 font-mono">
                          {c.job_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[12px] text-ink-2">
                        {c.keyword}
                      </div>
                      <div className="text-[10px] text-ink-3">
                        {c.source_count} 篇来源 · 阈值{" "}
                        {1000}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {c.output_type !== 'video' && (
                          <VersionBadge kind="graphic" version={c.graphic_status} />
                        )}
                        {c.output_type !== 'graphic' && (
                          <VersionBadge kind="video" version={c.video_status} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] text-ink-3 tabular-nums">
                      {new Date(c.created_at).toLocaleString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>下载</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>整体重新生成</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Send className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>标记已发布（不调用任何发布渠道）</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Archive className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>归档</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-3 text-[12px] text-ink-3 tabular-nums">
                1 / 1
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </TooltipProvider>
  );
}
