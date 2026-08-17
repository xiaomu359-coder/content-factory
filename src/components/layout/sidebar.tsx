"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/benchmarks", label: "找对标", icon: LayoutDashboard },
  { href: "/creations", label: "创作记录", icon: FolderKanban },
  { href: "/settings", label: "设置", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-line bg-surface h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-line">
        <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-ink">内容工厂</div>
          <div className="text-[11px] text-ink-3">Content Factory · v0.7</div>
        </div>
      </div>
      <nav className="flex-1 p-3">
        <div className="text-[11px] text-ink-3 px-3 py-2 uppercase tracking-wider">
          工作台
        </div>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors",
                    active
                      ? "bg-brand-soft text-brand-ink font-medium"
                      : "text-ink-2 hover:bg-surface-sunken",
                  )}
                >
                  <Icon
                    className="w-4 h-4"
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-line text-[11px] text-ink-3 leading-relaxed">
        <div className="px-3 pb-2">单管理员模式</div>
        <div className="px-3 pb-2">数据来自供应商快照，非全网实时</div>
      </div>
    </aside>
  );
}
