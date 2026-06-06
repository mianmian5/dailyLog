"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/stats-card";
import CommitActivity from "@/components/dashboard/commit-activity";
import RepoList from "@/components/dashboard/repo-list";
import ReportPanel from "@/components/dashboard/report-panel";
import { api } from "@/lib/api";

interface CommitData {
  total: number;
  commits: { message: string; repo: string; date: string }[];
  repoBreakdown: { repo: string; count: number }[];
  dailyActivity: { date: string; count: number }[];
}

interface Repo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  pushedAt: string;
}

export default function Dashboard() {
  const [scope, setScope] = useState<"day" | "week">("day");
  const [commits, setCommits] = useState<CommitData | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const now = new Date();
      const since = new Date(now);
      since.setDate(since.getDate() - (scope === "week" ? 7 : 1));

      const [commitsRes, reposRes] = await Promise.all([
        fetch(
          api(
            `/api/github/commits?scope=stats&since=${since.toISOString()}&until=${now.toISOString()}`
          )
        ),
        fetch(api("/api/github/commits?scope=repos")),
      ]);
      if (!commitsRes.ok || !reposRes.ok) throw new Error("请求失败");
      setCommits(await commitsRes.json());
      setRepos((await reposRes.json()).repos);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [scope]);

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
            仪表盘
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
            GitHub 开发活动一览
          </p>
        </div>
        <div className="flex gap-2">
          {(["day", "week"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                scope === s
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {s === "day" ? "今日" : "本周"}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="px-3.5 py-1.5 rounded-lg text-sm bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            🔄
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          label="提交次数"
          value={loading ? "…" : String(commits?.total ?? 0)}
          icon="📝"
        />
        <StatsCard
          label="仓库数"
          value={String(repos.length)}
          icon="📦"
        />
        <StatsCard
          label="总 Star"
          value={totalStars.toLocaleString()}
          icon="⭐"
        />
        <StatsCard
          label="总 Fork"
          value={totalForks.toLocaleString()}
          icon="🍴"
        />
      </div>

      {/* Activity + Report — stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CommitActivity
          data={commits?.dailyActivity || []}
          loading={loading}
        />
        <ReportPanel
          scope={scope}
          stats={
            commits
              ? {
                  total: commits.total,
                  repoBreakdown: commits.repoBreakdown,
                  dailyActivity: commits.dailyActivity,
                  commits: commits.commits,
                }
              : undefined
          }
        />
      </div>

      {/* Repo List */}
      <RepoList repos={repos} loading={loading} />
    </div>
  );
}
