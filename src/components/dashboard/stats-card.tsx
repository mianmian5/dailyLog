export default function StatsCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2d2d4a]">
      <div className="flex items-center gap-2 text-[#94a3b8] text-sm mb-2">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
