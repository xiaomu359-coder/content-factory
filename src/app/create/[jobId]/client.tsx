"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Circle,
  Sparkles,
  Download,
  RefreshCw,
  FileText,
  Film,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MOCK_ARTICLES,
  MOCK_COMMONALITY,
  MOCK_GRAPHIC_RESULT,
  MOCK_VIDEO_RESULT,
  type OutputType,
} from "@/lib/mock-data";

interface Props {
  jobId: string;
  outputType: OutputType;
  cardCount: number;
}

const STEP_LABELS = [
  "单篇摘要",
  "共性提炼 + 聚合 Brief",
  "生成底图",
  "固定模板成图",
];

export function CreateClient({ jobId, outputType, cardCount }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const [tab, setTab] = useState<"graphic" | "video">(
    outputType === "video" ? "video" : "graphic",
  );
  const [imgIdx, setImgIdx] = useState(0);

  // 模拟阶段推进
  useEffect(() => {
    if (!running) return;
    if (step >= STEP_LABELS.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, running]);

  const cards = MOCK_GRAPHIC_RESULT!.cards.slice(0, cardCount);
  const slides =
    tab === "graphic"
      ? [MOCK_GRAPHIC_RESULT!.cover, ...cards]
      : MOCK_VIDEO_RESULT!.storyboards;

  const showGraphic = outputType !== "video";
  const showVideo = outputType !== "graphic";

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-5">
        {/* 左：任务步骤 */}
        <aside className="lg:sticky lg:top-[88px] self-start space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px]">任务步骤</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ol className="space-y-2.5">
                {STEP_LABELS.map((label, i) => {
                  const done = i < step || (!running && i === step);
                  const active = i === step && running;
                  return (
                    <li key={label} className="flex items-start gap-2.5">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-info mt-0.5 animate-spin shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-ink-3 mt-0.5 shrink-0" />
                      )}
                      <div
                        className={cn(
                          "text-[12px] leading-snug",
                          active
                            ? "text-ink font-medium"
                            : done
                              ? "text-ink-2"
                              : "text-ink-3",
                        )}
                      >
                        {label}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px]">来源文章</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-[12px]">
                {MOCK_ARTICLES.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-ink line-clamp-2">{a.title}</div>
                      <div className="text-ink-3 text-[11px] mt-0.5">
                        {a.wx_name}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* 中：产物预览 */}
        <section className="min-w-0 space-y-4">
          {running ? (
            <Card>
              <CardContent className="p-10 flex flex-col items-center text-center">
                <Loader2 className="w-8 h-8 text-brand-ink animate-spin mb-3" />
                <div className="text-[15px] font-medium text-ink">
                  正在{STEP_LABELS[step]}...
                </div>
                <div className="text-[12px] text-ink-3 mt-1">
                  本任务采用异步 Workflow 编排；关闭页面后可从创作记录恢复
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 产物 tab */}
              <div className="flex items-center gap-2">
                {showGraphic && (
                  <button
                    onClick={() => setTab("graphic")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] border transition-colors",
                      tab === "graphic"
                        ? "bg-brand text-white border-brand"
                        : "bg-surface border-line text-ink-2",
                    )}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    图文卡片{" "}
                    {showGraphic && (
                      <span className="opacity-80">
                        ({1 + cardCount})
                      </span>
                    )}
                  </button>
                )}
                {showVideo && (
                  <button
                    onClick={() => setTab("video")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] border transition-colors",
                      tab === "video"
                        ? "bg-brand text-white border-brand"
                        : "bg-surface border-line text-ink-2",
                    )}
                  >
                    <Film className="w-3.5 h-3.5" />
                    视频脚本与分镜
                  </button>
                )}
                <div className="flex-1" />
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  {tab === "graphic" ? "导出 ZIP" : "导出 Markdown"}
                </Button>
              </div>

              {tab === "graphic" ? (
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={imgIdx === 0}
                        onClick={() => setImgIdx((i) => i - 1)}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        上一张
                      </Button>
                      <div className="text-[12px] text-ink-3 tabular-nums">
                        {imgIdx + 1} / {slides.length}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={imgIdx >= slides.length - 1}
                        onClick={() => setImgIdx((i) => i + 1)}
                        className="gap-1"
                      >
                        下一张
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <GraphicCardPreview
                      slide={slides[imgIdx] as (typeof slides)[number]}
                      isCover={imgIdx === 0}
                    />
                    <div className="flex items-center gap-2 mt-4 justify-center">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        重新生成当前张
                      </Button>
                      <Button variant="outline" size="sm">
                        编辑文案
                      </Button>
                      <Button variant="outline" size="sm">
                        编辑图片提示词
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px]">
                      {MOCK_VIDEO_RESULT!.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-[12px] text-ink-3">
                      <Badge variant="outline">
                        {MOCK_VIDEO_RESULT!.duration_seconds}s
                      </Badge>
                      <span>8 个分镜</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <section className="mb-4">
                      <h4 className="text-[12px] font-medium text-ink-2 mb-1">
                        开场钩子（3–5 秒）
                      </h4>
                      <p className="text-[13px] text-ink leading-6 bg-surface-sunken rounded p-3">
                        {MOCK_VIDEO_RESULT!.hook}
                      </p>
                    </section>
                    <section className="mb-4">
                      <h4 className="text-[12px] font-medium text-ink-2 mb-1">
                        完整解说词（60–90 秒）
                      </h4>
                      <p className="text-[13px] text-ink leading-7 whitespace-pre-wrap bg-surface-sunken rounded p-3 max-h-64 overflow-y-auto">
                        {MOCK_VIDEO_RESULT!.full_narration}
                      </p>
                    </section>
                    <section>
                      <h4 className="text-[12px] font-medium text-ink-2 mb-2">
                        文字分镜（8–12 条）
                      </h4>
                      <ol className="space-y-2">
                        {MOCK_VIDEO_RESULT!.storyboards.map((s) => (
                          <li
                            key={s.index}
                            className="border border-line rounded p-3 flex flex-col md:flex-row gap-3"
                          >
                            <div className="w-16 shrink-0 text-[12px] text-ink-3 tabular-nums">
                              #{s.index}
                              <div className="text-[11px]">{s.duration_seconds}s</div>
                            </div>
                            <div className="flex-1 space-y-1 text-[12px]">
                              <div>
                                <span className="text-ink-3">画面：</span>
                                <span className="text-ink">{s.visual_description}</span>
                              </div>
                              <div>
                                <span className="text-ink-3">字幕：</span>
                                <span className="text-ink">{s.onscreen_text}</span>
                              </div>
                              <div>
                                <span className="text-ink-3">解说：</span>
                                <span className="text-ink">{s.voiceover}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </section>

        {/* 右：属性 / 共性 */}
        <aside className="lg:sticky lg:top-[88px] self-start space-y-3">
          {running ? (
            <Card>
              <CardContent className="p-5 text-[12px] text-ink-3">
                共性提炼与产物属性将在阶段完成后显示。
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    创作 Brief
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 text-[12px]">
                  <Field
                    label="目标读者"
                    value={MOCK_COMMONALITY!.target_audience}
                  />
                  <Field
                    label="核心信息"
                    value={MOCK_COMMONALITY!.core_message.text}
                  />
                  <Field
                    label="分析类型"
                    value={
                      MOCK_COMMONALITY!.analysis_type ===
                      "multi_source_commonality"
                        ? "多源共性提炼"
                        : "单篇结构分析"
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px]">共性维度</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-[12px]">
                    {MOCK_COMMONALITY!.findings.map((f) => (
                      <li
                        key={f.id}
                        className="border-l-2 border-brand/50 pl-2.5"
                      >
                        <div className="text-[11px] text-brand-ink font-mono uppercase">
                          {dimensionLabel(f.dimension)}
                        </div>
                        <div className="text-ink leading-snug">{f.finding}</div>
                        <div className="text-[10px] text-ink-3 mt-0.5 font-mono">
                          sources: {f.evidence_article_ids.join(", ")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px]">5 个二创角度</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ol className="space-y-1.5">
                    {MOCK_COMMONALITY!.creative_angles.map((ang, i) => (
                      <li key={ang.rank} className="text-[12px] flex gap-2">
                        <span
                          className={cn(
                            "w-5 h-5 rounded inline-flex items-center justify-center text-[10px] shrink-0 font-mono",
                            ang.rank ===
                              MOCK_COMMONALITY!.recommended_angle_rank
                              ? "bg-brand text-white"
                              : "bg-surface-sunken text-ink-2",
                          )}
                        >
                          {ang.rank}
                        </span>
                        <div>
                          <div className="text-ink font-medium">
                            {ang.title}
                            {ang.rank ===
                              MOCK_COMMONALITY!.recommended_angle_rank && (
                              <span className="ml-1.5 text-[10px] text-brand-ink">
                                推荐
                              </span>
                            )}
                          </div>
                          <div className="text-ink-3 text-[11px] leading-snug">
                            {ang.rationale}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => router.push("/creations")}
              >
                <Sparkles className="w-3.5 h-3.5" />
                在创作记录中查看
              </Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-ink-3 uppercase tracking-wide">{label}</div>
      <div className="text-ink leading-snug">{value}</div>
    </div>
  );
}

function dimensionLabel(d: string) {
  const map: Record<string, string> = {
    audience_or_pain: "读者与痛点",
    headline_or_hook: "标题与钩子",
    structure: "结构",
    style_or_emotion: "风格与情绪",
    reusable_pattern: "可复用模式",
    cta: "行动召唤",
    topic: "选题",
  };
  return map[d] ?? d;
}

function GraphicCardPreview({
  slide,
  isCover,
}: {
  slide: {
    headline?: string;
    subheadline?: string;
    title?: string;
    body?: string;
    image_prompt?: string;
    index?: number;
  };
  isCover: boolean;
}) {
  // 用 CSS 渲染一张 3:4 的"无字底图 + 模板叠加"示意
  const headline = slide.headline ?? slide.title ?? "";
  const sub = slide.subheadline;
  const body = slide.body;

  return (
    <div className="flex justify-center">
      <div
        className="relative w-full max-w-[360px] aspect-[3/4] rounded-lg overflow-hidden shadow-md border border-line"
        style={{
          background:
            "linear-gradient(135deg, #FFF3E8 0%, #FFD9BF 60%, #F0642B 130%)",
        }}
      >
        {/* 模拟底图纹理 */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply"
             style={{
               backgroundImage:
                 "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 80% 70%, rgba(240,100,43,0.3), transparent 50%)",
             }}
        />
        {/* 模板文字层 */}
        <div className="absolute inset-0 p-6 flex flex-col text-white">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">
            内容工厂 · {isCover ? "封面" : `卡片 ${("index" in slide ? slide.index : "")}`}
          </div>
          <div className="mt-auto">
            <h3 className="text-[20px] font-bold leading-tight drop-shadow-sm">
              {headline}
            </h3>
            {sub && (
              <p className="text-[12px] mt-1.5 opacity-95 leading-snug">
                {sub}
              </p>
            )}
            {body && (
              <p className="text-[11px] mt-2 opacity-90 leading-relaxed line-clamp-5">
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
