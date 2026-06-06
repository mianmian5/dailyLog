import { NextRequest, NextResponse } from "next/server";
import { getCommitStats } from "@/lib/github";
import { generateDailyReport } from "@/lib/ai";
import { saveReport, getReport } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const username = searchParams.get("username") || undefined;
  const reposRaw = searchParams.get("repos") || undefined;
  const trackedRepos = reposRaw
    ? reposRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  const cacheKey = `daily-${date}-${username || "default"}`;
  const cached = getReport("daily", cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const since = `${date}T00:00:00Z`;
  const until = `${date}T23:59:59Z`;

  try {
    const stats = await getCommitStats(since, until, username, trackedRepos);
    const content = await generateDailyReport(date, stats);

    const report = {
      id: cacheKey,
      type: "daily" as const,
      date,
      content,
      stats: {
        total: stats.total,
        repoBreakdown: stats.repoBreakdown,
      },
      createdAt: new Date().toISOString(),
    };

    saveReport(report);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
