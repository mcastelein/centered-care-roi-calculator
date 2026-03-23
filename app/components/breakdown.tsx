import { format } from "@/app/lib/format";

export function Breakdown({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const isNegative = value < 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span
        className={`text-sm font-semibold ${
          isNegative ? "text-red-500" : "text-[#5287C2]"
        }`}
      >
        {format(value)}
      </span>
    </div>
  );
}
