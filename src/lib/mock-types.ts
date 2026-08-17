// 原型专用：领域类型定义。与 SPEC 第 0.2/0.3 节字段对齐。

export type LabelStatus =
  | "pending"
  | "low_fan_viral"
  | "data_missing"
  | "not_matched";

export interface WechatArticleItem {
  // 20 个已验证 item 字段（均为 optional，单条可能缺失）
  avatar?: string;
  title: string;
  url: string;
  short_link?: string;
  content: string;
  publish_time: number; // 秒
  publish_time_str: string;
  update_time: number;
  update_time_str: string;
  wx_name: string;
  wx_id?: string;
  ghid: string;
  read: number;
  praise: number;
  looking: number;
  ip_wording: string;
  classify: string;
  is_original: number;
  item_show_type: number;
  has_notifier: number;
  // 额外运行时字段
  id: string;
  canonical_key: string;
  content_status: "ok" | "empty" | "truncated";
  title_quality?: "suspect_abnormal"; // 超长/含真实换行
  provider_extra?: Record<string, unknown>;
}

export interface AccountProfile {
  account_id: string;
  name: string;
  ghid: string;
  wx_id: string;
  avatar?: string;
  qrcode?: string;
  fans: number;
  avg_top_read: number;
  avg_top_zan: number;
  week_articles: number;
  latest_publish_time: string;
  jzl_index: number;
  fetched_at: number; // 秒
  fresh_until: number;
}

export interface ArticleWithEvaluation extends WechatArticleItem {
  label: LabelStatus;
  label_reason?: string;
  profile?: AccountProfile;
  interaction_rate: { value: string; capped: boolean } | null;
  // 账号补全后的扁平字段（取自 profile，方便表格直接访问）
  fans?: number | null;
  avg_top_read?: number | null;
  avg_top_zan?: number | null;
  week_articles?: number | null;
  latest_publish_time?: string | null;
  jzl_index?: number | null;
  fetched_at?: number | null;
  fresh_until?: number | null;
}

export interface SearchRunSummary {
  requestId: string;
  consumedPoints: number;
  total: number;
  total_page: number;
  page: number;
  data_number: number;
  array_length: number;
}

export interface SearchRun {
  id: string;
  discovery_session_id: string;
  kw: string;
  any_kw: string;
  ex_kw: string;
  sort_type: 1 | 2;
  mode: 1 | 2 | 3;
  period: number;
  low_fans_threshold: number;
  benchmark_rule_version: string;
  viral_read_multiplier: 3;
  status: "queued" | "running" | "completed" | "partial" | "failed";
  coverage_status: "partial" | "full" | "provider_changed";
  observed_total_pages: number;
  target_total_pages: number | null;
  completed_page_count: number;
  article_search_points: number;
  account_profile_points: number;
  unknown_charge_count: number;
  failed_pages: number;
  result_unknown_pages: number;
  created_at: number;
  completed_at: number | null;
  summary: SearchRunSummary;
  idempotency_key: string;
}

export interface RecentSearch {
  id: string;
  kw: string;
  low_fans_threshold: number;
  total: number;
  total_page: number;
  completed_pages: number;
  created_at: number;
  low_fan_viral_count: number;
  status?: "queued" | "running" | "completed" | "partial" | "failed" | "cancelled";
  coverage_status?: "partial" | "full" | "provider_changed";
  sort_type?: 1 | 2;
  mode?: 1 | 2 | 3;
  period?: number;
  persisted_pages?: number;
  observed_total_pages?: number;
  raw_article_count?: number;
  distinct_article_count?: number;
  article_search_points?: number;
  any_kw?: string;
  ex_kw?: string;
}

export interface DiscoverySession {
  id: string;
  status: "active" | "completed" | "abandoned" | "timed_out";
  started_at: number;
  deadline_at: number;
  commonality_ready_at: number | null;
  commonality_visible_at: number | null;
  elapsed_sec: number;
}

export interface ArticleSummary {
  article_id: string;
  core_view: string;
  target_audience: string;
  user_pain: string;
  structure: string[];
  expression_style: string;
  traceable_facts: string[];
  do_not_copy: string[];
  status: "completed" | "failed" | "skipped";
}

export type FindingDimension =
  | "audience_or_pain"
  | "headline_or_hook"
  | "structure"
  | "style_or_emotion"
  | "reusable_pattern"
  | "cta"
  | "topic";

export interface CommonalityFinding {
  id: string;
  dimension: FindingDimension;
  finding: string;
  evidence_article_ids: string[];
}

export interface CreativeAngle {
  rank: 1 | 2 | 3 | 4 | 5;
  title: string;
  angle: string;
  rationale: string;
  basis_pattern_ids: string[];
  evidence_article_ids: string[];
}

export interface SourcedText {
  text: string;
  evidence_article_ids: string[];
  claim_type: "sourced" | "creative";
}

export interface GraphicCard {
  index: number;
  title: string;
  body: string;
  image_prompt: string;
  evidence_article_ids: string[];
  claim_type: "sourced" | "creative";
}

export interface GraphicArtifact {
  cover: {
    headline: string;
    subheadline: string;
    image_prompt: string;
    evidence_article_ids: string[];
    claim_type: "sourced" | "creative";
  };
  cards: GraphicCard[];
}

export interface Storyboard {
  index: number;
  duration_seconds: number;
  voiceover: string;
  onscreen_text: string;
  visual_description: string;
  visual_prompt: string;
  evidence_article_ids: string[];
  claim_type: "sourced" | "creative";
}

export interface VideoArtifact {
  title: string;
  duration_seconds: number;
  hook: string;
  full_narration: string;
  evidence_article_ids: string[];
  claim_type: "sourced" | "creative";
  storyboards: Storyboard[];
}

export type OutputType = "graphic" | "video" | "both";

export interface CommonalityResult {
  output_type: OutputType;
  analysis_type: "multi_source_commonality" | "single_source_structure";
  target_audience: string;
  core_message: SourcedText;
  findings: CommonalityFinding[];
  recommended_angle_rank: 1 | 2 | 3 | 4 | 5;
  creative_angles: CreativeAngle[];
  title_options: SourcedText[];
  graphic?: GraphicArtifact;
  video?: VideoArtifact;
  source_article_ids: string[];
  prompt_version: "v1";
}

export type JobStage =
  | "queued"
  | "summarizing_articles"
  | "analyzing_commonality"
  | "synthesizing_brief"
  | "generating_images"
  | "rendering_cards"
  | "generating_video_script"
  | "completed"
  | "failed"
  | "partial";

export interface CreationJob {
  id: string;
  discovery_session_id: string;
  search_run_id: string;
  source_article_ids: string[];
  output_type: OutputType;
  card_count: number;
  palette: "warm-white-orange" | "ink-paper" | "cool-gray";
  visual_style: "realistic" | "illustration" | "3d";
  status: "queued" | "running" | "completed" | "partial" | "failed";
  current_stage: JobStage;
  analysis_type: "multi_source_commonality" | "single_source_structure";
  summaries: ArticleSummary[];
  commonality: CommonalityResult | null;
  angle_rank: 1 | 2 | 3 | 4 | 5;
  created_at: number;
  completed_at: number | null;
  failure_reason?: string;
  // 产物版本状态（图文 / 视频分别独立）
  graphic_status: ArtifactVersionStatus;
  video_status: ArtifactVersionStatus;
}

export type ArtifactVersionStatus = "draft" | "published" | "archived";

export interface CreationRecord {
  job_id: string;
  keyword: string;
  output_type: OutputType;
  card_count: number;
  source_count: number;
  status: CreationJob["status"];
  graphic_status: ArtifactVersionStatus;
  video_status: ArtifactVersionStatus;
  created_at: number;
  completed_at: number | null;
  angle_title: string;
}

export interface BrandSettings {
  brand_name: string;
  has_logo: boolean;
  has_font: boolean;
  font_license_confirmed_at: number | null;
  updated_at: number;
}

export interface ConnectivityStatus {
  wechat_search: "configured" | "missing" | "failed";
  wechat_account: "pending_verify" | "configured" | "missing" | "failed";
  ark_text: "configured" | "missing" | "failed";
  ark_image: "configured" | "missing" | "failed";
  blob: "configured" | "missing";
  neon: "configured" | "missing";
}
