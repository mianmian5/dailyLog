"use client";

import { useState } from "react";

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

  async function generate() {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const date = new Date().toISOString().slice(0, 10);
      const url =
        scope === "day"
          ? `/api/report/daily?date=${date}`
          : `/api/report/weekly`;

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
    <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2d2d4a] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">
          🤖 AI {scope === "day" ? "日报" : "周报"}
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "生成中..." : "🪄 生成"}
        </button>
      </div>

      {!stats ? (
        <div className="flex-1 flex items-center justify-center text-[#475569] text-xs">
          暂无数据，请先刷新页面
        </div>
      ) : stats.total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#475569] text-xs">
          {scope === "day" ? "今天还没有提交记录" : "本周还没有提交记录"}
        </div>
      ) : !report ? (
        <div className="flex-1 flex items-center justify-center text-[#475569] text-xs">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <span>点击「生成」按钮，AI 会根据提交记录生成报告</span>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[400px] pr-1 space-y-1">
          <div className="report-content text-sm leading-relaxed whitespace-pre-wrap">
            {report.split("\n").map((line, i) => {
              if (line.startsWith("#")) return null;
              if (line.match(/^\d+\. \*\*/)) {
                return (
                  <div key={i} className="mt-3 mb-1 font-semibold text-white">
                    {line.replace(/\*\*/g, "")}
                  </div>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <div key={i} className="text-[#cbd5e1] ml-2">
                    {line}
                  </div>
                );
              }
              if (line.trim() === "") return <div key={i} className="h-1" />;
              return (
                <div key={i} className="text-[#94a3b8]">
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
