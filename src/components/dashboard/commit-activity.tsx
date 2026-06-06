"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; count: number }[];
  loading: boolean;
}

export default function CommitActivity({ data, loading }: Props) {
  const chartData = data.map((d) => ({
    label: d.date.slice(5),
    commits: d.count,
  }));

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 border border-[var(--color-border)]">
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
        📈 提交活动
      </h2>
      {loading ? (
        <div className="h-44 flex items-center justify-center text-[var(--color-text-secondary)] text-sm">
          加载中…
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-[var(--color-text-secondary)] text-sm">
          暂无提交记录
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ left: -16, bottom: 0 }}>
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
                fontSize: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
            />
            <Bar
              dataKey="commits"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
