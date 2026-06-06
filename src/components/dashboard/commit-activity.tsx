"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
    <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2d2d4a]">
      <h2 className="text-sm font-semibold text-white mb-4">
        📈 提交活动
      </h2>
      {loading ? (
        <div className="h-48 flex items-center justify-center text-[#94a3b8] text-sm">
          加载中...
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-[#94a3b8] text-sm">
          暂无提交记录
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="label"
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1f3a",
                border: "1px solid #2d2d4a",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />
            <Bar
              dataKey="commits"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
