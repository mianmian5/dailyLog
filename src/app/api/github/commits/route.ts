import { NextRequest, NextResponse } from "next/server";
import { getCommits, getUserRepos, getCommitStats, type RepoStats } from "@/lib/github";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since") || getDefaultSince("day");
  const until = searchParams.get("until") || getDefaultUntil();
  const scope = searchParams.get("scope") || "commits";

  try {
    if (scope === "repos") {
      const repos = await getUserRepos();
      return NextResponse.json({ repos });
    }

    if (scope === "stats") {
      const stats = await getCommitStats(since, until);
      return NextResponse.json(stats);
    }

    const commits = await getCommits(since, until);
    return NextResponse.json({ commits, total: commits.length });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

function getDefaultSince(unit: "day" | "week"): string {
  const d = new Date();
  d.setDate(d.getDate() - (unit === "week" ? 7 : 1));
  return d.toISOString();
}

function getDefaultUntil(): string {
  return new Date().toISOString();
}
