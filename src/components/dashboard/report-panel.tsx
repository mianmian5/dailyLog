"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { getGitHubUsername, getTrackedRepos } from "@/lib/config";

interface CommitStats {
  total: number;
  repoBreakdown: { repo: string; count: number }[];
  dailyActivity: { date: string; count: number }[];
  commits: { message: string; repo: string; date: string }[];
}

interface Props {
  scope: "day" | "week";
  stats?: CommitStats;
}

export default function ReportPanel({ scope, stats }: Props) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function makeUrl(path: string, extra?: Record<string, string>): string {
    const params = new URLSearchParams();
    const username = getGitHubUsername();
    const repos = getTrackedRepos();
    if (username) params.set("username", username);
    if (repos.length > 0) params.set("repos", repos.join(","));
    if (extra) {
      for (const [k, v] of Object.entries(extra)) params.set(k, v);
    }
    const qs = params.toString();
    return api(`${path}${qs ? `?${qs}` : ""}`);
  }

  async function generate() {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const date = new Date().toISOString().slice(0, 10);
      const url =
        scope === "day"
          ? makeUrl("/api/report/daily", { date })
          : makeUrl("/api/report/weekly");

      const res = await fetch(url);
      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setReport(data.content);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 border border-[var(--color-border)] flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          🤖 AI {scope === "day" ? "日报" : "周报"}
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? "生成中…" : "🪄 生成"}
        </button>
      </div>

      {!stats ? (
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)] text-xs">
          暂无数据，请先刷新
        </div>
      ) : stats.total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)] text-xs">
          {scope === "day" ? "今天还没有提交记录" : "本周还没有提交记录"}
        </div>
      ) : !report ? (
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)] text-xs">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span>点击「生成」按钮生成 AI 报告</span>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[420px] pr-1">
          <div className="report-content text-sm whitespace-pre-wrap">
            {report.split("\n").map((line, i) => {
              if (line.startsWith("#")) return null;
              if (line.match(/^\d+\. \*\*/)) {
                return (
                  <div
                    key={i}
                    className="mt-2.5 mb-1 font-semibold text-[var(--color-text)]"
                  >
                    {line.replace(/\*\*/g, "")}
                  </div>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <div key={i} className="text-[#475569] ml-2">
                    {line}
                  </div>
                );
              }
              if (line.trim() === "") return <div key={i} className="h-1" />;
              return (
                <div key={i} className="text-[var(--color-text-muted)]">
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
