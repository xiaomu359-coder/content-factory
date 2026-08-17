"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: Props) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-[260px]">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-line">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-semibold">内容工厂</div>
            <div className="text-[11px] text-ink-3">Content Factory · v0.7</div>
          </div>
        </div>
        <nav className="p-3">
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
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[14px]",
                      active
                        ? "bg-brand-soft text-brand-ink font-medium"
                        : "text-ink-2 hover:bg-surface-sunken",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
