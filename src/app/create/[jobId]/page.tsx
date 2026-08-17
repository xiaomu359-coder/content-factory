import { CreateClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CreateJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ output?: string; cards?: string }>;
}) {
  const { jobId } = await params;
  const sp = await searchParams;
  const output =
    sp.output === "video" || sp.output === "both" ? sp.output : "graphic";
  const cardsNum = parseInt(sp.cards ?? "6", 10);
  const cardCount =
    Number.isFinite(cardsNum) && cardsNum >= 6 && cardsNum <= 9
      ? cardsNum
      : 6;
  return (
    <CreateClient jobId={jobId} outputType={output} cardCount={cardCount} />
  );
}
