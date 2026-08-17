"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ConnRow {
  name: string;
  status: "ok" | "warn" | "fail" | "unconfigured";
  detail: string;
}

export default function SettingsPage() {
  const [brandName, setBrandName] = useState("");
  const [defaultCards, setDefaultCards] = useState("6");
  const [defaultPalette, setDefaultPalette] = useState("warm-white-orange");
  const [defaultStyle, setDefaultStyle] = useState("illustration");
  const [fontConfirmed, setFontConfirmed] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const connections: ConnRow[] = [
    {
      name: "微信文章搜索 API",
      status: "unconfigured",
      detail: "WECHAT_SEARCH_API_URL / KEY 未配置",
    },
    {
      name: "公众号活跃数据 API",
      status: "warn",
      detail: "待联调契约；上线前需完成带鉴权 HTTPS 验证",
    },
    {
      name: "火山方舟文本模型",
      status: "unconfigured",
      detail: "ARK_API_KEY / ARK_TEXT_MODEL 未配置",
    },
    {
      name: "火山方舟图片模型",
      status: "unconfigured",
      detail: "ARK_IMAGE_MODEL 未配置",
    },
    {
      name: "Neon PostgreSQL",
      status: "unconfigured",
      detail: "DATABASE_URL 未配置（原型使用 Mock 数据）",
    },
    {
      name: "Vercel Blob",
      status: "unconfigured",
      detail: "BLOB_READ_WRITE_TOKEN 未配置",
    },
  ];

  const statusMap = {
    ok: {
      label: "已连通",
      cls: "text-success border-success/30 bg-success/10",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    warn: {
      label: "待联调",
      cls: "text-warning border-warning/30 bg-warning/10",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    fail: {
      label: "失败",
      cls: "text-danger border-danger/30 bg-danger/10",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    unconfigured: {
      label: "未配置",
      cls: "text-ink-3 border-line bg-surface-sunken",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  };

  return (
    <div className="mx-auto max-w-[960px] px-4 md:px-6 py-5 space-y-5">
      <header>
        <h1 className="text-[20px] font-semibold text-ink">设置</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">
          密钥类变量通过部署环境注入，界面不回显完整值；原型阶段所有数据为 Mock
        </p>
      </header>

      {/* 连通性 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">连通性状态</CardTitle>
          <CardDescription>
            生产环境使用 HTTPS 与主机 allowlist；启动检查会阻断 HTTP 配置
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-line">
            {connections.map((c) => {
              const s = statusMap[c.status];
              return (
                <li
                  key={c.name}
                  className="py-3 flex items-center gap-3 flex-wrap"
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-[13px] text-ink font-medium">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-ink-3 mt-0.5">
                      {c.detail}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`gap-1 ${s.cls}`}
                  >
                    {s.icon}
                    {s.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* 密钥 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">密钥与环境变量</CardTitle>
          <CardDescription>
            以下密钥仅用于展示配置项；真实值请在 Vercel / 部署平台配置。本界面不会回显完整密钥
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeys((v) => !v)}
              className="gap-1.5 text-[12px]"
            >
              {showKeys ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {showKeys ? "全部隐藏" : "显示形式（仍然脱敏）"}
            </Button>
          </div>
          {[
            "WECHAT_SEARCH_API_KEY",
            "WECHAT_ACCOUNT_PROFILE_API_KEY",
            "ARK_API_KEY",
            "APP_SESSION_SECRET",
            "APP_ADMIN_PASSWORD_HASH",
            "BLOB_READ_WRITE_TOKEN",
            "DATABASE_URL",
          ].map((k) => (
            <div key={k} className="grid grid-cols-[260px_1fr] gap-3 items-center">
              <Label className="text-[12px] font-mono text-ink-2">{k}</Label>
              <Input
                readOnly
                value={
                  showKeys
                    ? "••••••••••••（已脱敏，不回显）"
                    : "********************************"
                }
                className="h-9 font-mono text-[12px] bg-surface-sunken"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 默认生成参数 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] flex items-center gap-2">
            <Palette className="w-4 h-4" />
            默认生成参数
          </CardTitle>
          <CardDescription>
            这些默认值不修改历史产物；新任务首次打开抽屉时使用
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="cards" className="text-[12px]">
              默认正文卡片数
            </Label>
            <Select value={defaultCards} onValueChange={setDefaultCards}>
              <SelectTrigger id="cards" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 张（共 7）</SelectItem>
                <SelectItem value="7">7 张（共 8）</SelectItem>
                <SelectItem value="8">8 张（共 9）</SelectItem>
                <SelectItem value="9">9 张（共 10）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="palette" className="text-[12px]">
              默认配色
            </Label>
            <Select value={defaultPalette} onValueChange={setDefaultPalette}>
              <SelectTrigger id="palette" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warm-white-orange">
                  暖白 + 橙（默认）
                </SelectItem>
                <SelectItem value="ink-paper">墨黑 + 米白</SelectItem>
                <SelectItem value="moss-cream">苔绿 + 奶米</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="style" className="text-[12px]">
              视觉风格
            </Label>
            <Select value={defaultStyle} onValueChange={setDefaultStyle}>
              <SelectTrigger id="style" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="illustration">插画</SelectItem>
                <SelectItem value="realistic">写实</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="threshold" className="text-[12px]">
              默认低粉阈值
            </Label>
            <Input
              id="threshold"
              value="1000"
              readOnly
              className="h-9"
            />
            <p className="text-[10px] text-ink-3">
              来自 <code className="font-mono">DEFAULT_LOW_FANS_THRESHOLD</code>
              ；MVP 不提供修改全局默认值的界面
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 品牌配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">品牌配置（选填）</CardTitle>
          <CardDescription>
            品牌名、Logo、字体均为选填；未配置时使用应用内置许可中文字体。配置只影响新建版本，不修改历史产物
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="brand" className="text-[12px]">
              品牌名（最多 30 个字符）
            </Label>
            <Input
              id="brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value.slice(0, 30))}
              placeholder="例如：内容工厂"
              className="h-9"
            />
            <div className="text-[10px] text-ink-3 text-right tabular-nums">
              {brandName.length}/30
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-5">
            <BrandUploader
              icon={<ImageIcon className="w-4 h-4" />}
              title="Logo"
              hint="PNG / WebP，最大 5 MiB；不接收 SVG"
              accept="image/png,image/webp"
            />
            <BrandUploader
              icon={<Type className="w-4 h-4" />}
              title="自定义字体"
              hint="TTF / OTF / WOFF2，最大 10 MiB；须确认拥有使用许可"
              accept=".ttf,.otf,.woff2"
            />
          </div>

          <div className="flex items-start gap-2 rounded border border-line p-3 bg-surface-sunken">
            <input
              id="font-license"
              type="checkbox"
              checked={fontConfirmed}
              onChange={(e) => setFontConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="font-license"
              className="text-[12px] text-ink-2 leading-snug cursor-pointer"
            >
              我确认拥有所上传字体的使用许可；系统将保存确认时间与字体文件
              checksum（FR-05-14）
            </label>
          </div>

          {/* 实时预览 */}
          <div className="border border-line rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-surface-sunken border-b border-line text-[12px] text-ink-2">
              实时卡片预览
            </div>
            <div className="flex items-center justify-center p-6 bg-[#F7F5F2]">
              <div
                className="w-[240px] aspect-[3/4] rounded-md shadow-sm relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF3E8 0%, #FFD9BF 60%, #F0642B 130%)",
                }}
              >
                <div className="absolute inset-0 p-4 flex flex-col text-white">
                  <div className="text-[9px] uppercase tracking-[0.2em] opacity-80">
                    {brandName || "内容工厂"} · 预览
                  </div>
                  <div className="mt-auto">
                    <div className="text-[15px] font-bold leading-tight">
                      让好选题，可被复用
                    </div>
                    <div className="text-[10px] mt-1.5 opacity-90">
                      基于你设置的品牌、配色与字体生成的示意
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2 sticky bottom-4">
        <Button variant="outline">取消</Button>
        <Button className="gap-1.5">
          <Save className="w-4 h-4" />
          保存设置
        </Button>
      </div>
    </div>
  );
}

function BrandUploader({
  icon,
  title,
  hint,
  accept,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  accept: string;
}) {
  const [file, setFile] = useState<string | null>(null);
  return (
    <div>
      <div className="text-[12px] font-medium text-ink-2 mb-1.5 flex items-center gap-1.5">
        {icon}
        {title}
      </div>
      <label className="block border border-dashed border-line rounded p-4 text-center cursor-pointer hover:border-brand/50 transition-colors bg-surface-sunken/40">
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
        />
        <Upload className="w-5 h-5 mx-auto text-ink-3 mb-1.5" />
        <div className="text-[12px] text-ink-2">
          {file ? file : "点击上传"}
        </div>
        <div className="text-[10px] text-ink-3 mt-0.5">{hint}</div>
      </label>
    </div>
  );
}
