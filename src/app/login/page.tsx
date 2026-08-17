"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flame, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Mock 登录：任意 6 位以上密码即通过
    window.setTimeout(() => {
      if (password.length >= 6) {
        router.push("/benchmarks");
      } else {
        setError("密码长度至少 6 位（Mock 模式：任意密码均可）");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[22px] font-semibold text-ink">内容工厂</h1>
          <p className="text-[13px] text-ink-3 mt-1">
            关键词找低粉爆款 · 共性提炼 · AI 二创
          </p>
        </div>

        <div className="bg-surface border border-line rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[13px] text-ink-2">
            <Lock className="w-4 h-4" />
            单管理员登录
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-[12px] text-ink-2 mb-1.5">
                管理员密码
              </label>
              <div className="relative">
                <Input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoFocus
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-ink-3 hover:text-ink"
                  aria-label={showPwd ? "隐藏密码" : "显示密码"}
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="danger">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
          <div className="text-[11px] text-ink-3 mt-4 leading-relaxed border-t border-line pt-3">
            本系统不提供注册和找回密码；忘记密码请由管理员更新
            APP_ADMIN_PASSWORD_HASH。Cookie 有效期 12 小时，HttpOnly + Secure +
            SameSite=Lax。
          </div>
        </div>

        <div className="text-center text-[11px] text-ink-3 mt-6">
          MOCK 原型 · SPEC v0.7 · 未连接真实供应商与数据库
        </div>
      </div>
    </div>
  );
}
