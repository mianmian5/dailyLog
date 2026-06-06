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
          api(`/api/github/commits?scope=stats&since=${since.toISOString()}&until=${now.toISOString()}`)
        ),
        fetch(api(`/api/github/commits?scope=repos`)),
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">仪表盘</h1>
          <p className="text-[#94a3b8] text-sm mt-1">
            GitHub 开发活动一览
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScope("day")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              scope === "day"
                ? "bg-indigo-600 text-white"
                : "bg-[#1a1a2e] text-[#94a3b8] hover:text-white"
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setScope("week")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              scope === "week"
                ? "bg-indigo-600 text-white"
                : "bg-[#1a1a2e] text-[#94a3b8] hover:text-white"
            }`}
          >
            本周
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-1.5 rounded-lg text-sm bg-[#1a1a2e] text-[#94a3b8] hover:text-white transition-colors"
          >
            🔄 刷新
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="提交次数"
          value={loading ? "..." : String(commits?.total ?? 0)}
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

      <div className="grid grid-cols-2 gap-6">
        {/* Commit Activity */}
        <CommitActivity
          data={commits?.dailyActivity || []}
          loading={loading}
        />

        {/* AI Report */}
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
