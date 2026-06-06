"use client";

import { useEffect, useState } from "react";

interface Report {
  id: string;
  type: "daily" | "weekly";
  date: string;
  content: string;
  stats: { total: number; repoBreakdown: { repo: string; count: number }[] };
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">报告列表</h1>
        <p className="text-[#94a3b8] text-sm mt-1">
          所有已生成的日报和周报
        </p>
      </div>

      {loading ? (
        <div className="text-[#94a3b8] text-sm">加载中...</div>
      ) : reports.length === 0 ? (
        <div className="bg-[#1a1a2e] rounded-xl p-8 text-center border border-[#2d2d4a]">
          <div className="text-[#475569] text-sm">
            还没有生成过报告，去仪表盘生成第一份吧 🚀
          </div>
          <a
            href="/"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
          >
            → 去仪表盘
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(selected?.id === r.id ? null : r)}
              className={`text-left bg-[#1a1a2e] rounded-xl p-4 border transition-colors ${
                selected?.id === r.id
                  ? "border-indigo-500"
                  : "border-[#2d2d4a] hover:border-[#3d3d5a]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {r.type === "daily" ? "📅" : "📆"}
                </span>
                <span className="text-sm font-medium text-white">
                  {r.type === "daily"
                    ? r.date
                    : r.date.replace("_", " ~ ")}
                </span>
                <span className="text-xs bg-indigo-600/20 text-indigo-300 px-1.5 py-0.5 rounded">
                  {r.type === "daily" ? "日报" : "周报"}
                </span>
              </div>
              <div className="text-xs text-[#64748b]">
                {r.stats.total} 次提交 ·{" "}
                {r.stats.repoBreakdown
                  .map((b) => `${b.repo}(${b.count})`)
                  .join(" ")}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Report Detail */}
      {selected && (
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2d2d4a]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {selected.type === "daily" ? "日报" : "周报"} —{" "}
              {selected.type === "daily"
                ? selected.date
                : selected.date.replace("_", " ~ ")}
            </h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selected.content);
              }}
              className="px-3 py-1.5 rounded-lg text-xs bg-[#2d2d4a] text-[#94a3b8] hover:text-white transition-colors"
            >
              📋 复制
            </button>
          </div>
          <div className="report-content text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {selected.content.split("\n").map((line, i) => {
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
