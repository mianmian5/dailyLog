import { NextRequest, NextResponse } from "next/server";
import { getCommitStats } from "@/lib/github";
import { generateWeeklyReport } from "@/lib/ai";
import { saveReport, getReport } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endDateStr = searchParams.get("end") || new Date().toISOString().slice(0, 10);
  const username = searchParams.get("username") || undefined;
  const reposRaw = searchParams.get("repos") || undefined;
  const trackedRepos = reposRaw
    ? reposRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  const endDate = new Date(endDateStr);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  const weekKey = `${startDate.toISOString().slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`;
  const cacheKey = `weekly-${weekKey}-${username || "default"}`;

  const cached = getReport("weekly", cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const since = startDate.toISOString();
  const until = endDate.toISOString();
  const weekRange = `${startDate.toISOString().slice(0, 10)} ~ ${endDate.toISOString().slice(0, 10)}`;

  try {
    const stats = await getCommitStats(since, until, username, trackedRepos);
    const content = await generateWeeklyReport(weekRange, stats);

    const report = {
      id: cacheKey,
      type: "weekly" as const,
      date: weekKey,
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
