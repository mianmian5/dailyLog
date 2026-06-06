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
    <div className="bg-white rounded-xl p-3.5 md:p-4 border border-[var(--color-border)]">
      <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs md:text-sm mb-1.5">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
        {value}
      </div>
    </div>
  );
}
