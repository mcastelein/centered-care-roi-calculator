export function KpiCard({
  title,
  value,
  tone = "default",
}: {
  title: string;
  value: string;
  tone?: "default" | "primary";
}) {
  const primary = tone === "primary";

  return (
    <div
      className={`rounded-2xl border p-3 shadow-sm ${
        primary
          ? "border-[#CFE0F4] bg-gradient-to-br from-[#F7FBFF] to-[#EAF2FB]"
          : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          primary ? "text-[#5287C2]" : "text-slate-500"
        }`}
      >
        {title}
      </p>
      <p className="mt-1 text-xl font-bold tracking-tight text-[#1C2C6B]">
        {value}
      </p>
    </div>
  );
}
