"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Timer, RefreshCw, Menu, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatDuration } from "@/lib/utils";
import { MOCK_SESSION } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Topbar({ title, showBack, right, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [now, setNow] = useState<number>(() => MOCK_SESSION.started_at * 1000);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = Math.max(
    0,
    Math.round((now - MOCK_SESSION.started_at * 1000) / 1000),
  );
  const remaining = Math.max(
    0,
    Math.round((MOCK_SESSION.deadline_at * 1000 - now) / 1000),
  );

  // 登录页不显示 topbar
  if (pathname === "/login") return null;

  const pageTitle =
    title ??
    (pathname.startsWith("/benchmarks")
      ? "找对标"
      : pathname.startsWith("/create")
        ? "AI 二创"
        : pathname.startsWith("/creations")
          ? "创作记录"
          : pathname.startsWith("/settings")
            ? "设置"
            : "内容工厂");

  return (
    <>
      <header className="h-16 bg-surface border-b border-line sticky top-0 z-30 flex items-center px-4 md:px-6 gap-3">
        <button
          className="md:hidden w-9 h-9 -ml-2 flex items-center justify-center rounded-md hover:bg-surface-sunken"
          onClick={() => onMenuClick?.()}
          aria-label="打开导航"
        >
          <Menu className="w-5 h-5" />
        </button>
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 md:-ml-3 gap-1.5 text-ink-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
        )}
        <h1 className="text-[16px] font-semibold text-ink">{pageTitle}</h1>

        <div className="flex-1" />

        {pathname.startsWith("/benchmarks") && (
          <div
            className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] tabular-nums",
              remaining < 5 * 60
                ? "border-danger/30 bg-danger-bg text-danger"
                : "border-line bg-surface-sunken text-ink-2",
            )}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>本轮已用 {formatDuration(elapsed)}</span>
            <span className="text-ink-3">·</span>
            <span>剩余 {formatDuration(remaining)}</span>
          </div>
        )}

        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-ink-3 hover:bg-surface-sunken hover:text-ink"
          title="刷新"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {right}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-ink-3 hover:text-ink"
        >
          <a href="/login" className="gap-1.5">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">退出</span>
          </a>
        </Button>
      </header>
    </>
  );
}
