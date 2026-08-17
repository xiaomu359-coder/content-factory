import { BenchmarksResultClient } from "./client";

export const dynamic = "force-dynamic";

export default async function BenchmarksRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <BenchmarksResultClient runId={runId} />;
}
