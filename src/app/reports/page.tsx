"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
    fetch(api("/api/reports"))
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          报告列表
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
          所有已生成的日报和周报
        </p>
      </div>

      {loading ? (
        <div className="text-[var(--color-text-secondary)] text-sm">
          加载中…
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[var(--color-border)]">
          <div className="text-[var(--color-text-secondary)] text-sm">
            还没有生成过报告，去仪表盘生成第一份吧 🚀
          </div>
          <a
            href="/dailylog/"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
          >
            → 去仪表盘
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() =>
                setSelected(selected?.id === r.id ? null : r)
              }
              className={`text-left bg-white rounded-xl p-4 border transition-colors ${
                selected?.id === r.id
                  ? "border-indigo-400 ring-1 ring-indigo-100"
                  : "border-[var(--color-border)] hover:border-indigo-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">
                  {r.type === "daily" ? "📅" : "📆"}
                </span>
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {r.type === "daily"
                    ? r.date
                    : r.date.replace("_", " ~ ")}
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                  {r.type === "daily" ? "日报" : "周报"}
                </span>
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {r.stats.total} 次提交 ·{" "}
                {r.stats.repoBreakdown
                  .map((b) => `${b.repo}(${b.count})`)
                  .join(" ")}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="bg-white rounded-xl p-5 md:p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold text-[var(--color-text)]">
              {selected.type === "daily" ? "日报" : "周报"} —{" "}
              {selected.type === "daily"
                ? selected.date
                : selected.date.replace("_", " ~ ")}
            </h2>
            <button
              onClick={() => navigator.clipboard.writeText(selected.content)}
              className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-gray-200 transition-colors"
            >
              📋 复制
            </button>
          </div>
          <div className="report-content text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {selected.content.split("\n").map((line, i) => {
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
