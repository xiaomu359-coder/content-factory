import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";

export const metadata: Metadata = {
  title: "内容工厂 · Content Factory",
  description:
    "关键词找低粉爆款 → 多文章共性提炼 → AI 二创的内容生产工作台",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="bg-canvas text-ink antialiased">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
