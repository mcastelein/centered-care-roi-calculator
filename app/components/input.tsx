"use client";

export function Input({
  label,
  value,
  setValue,
  step,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-[#1C2C6B] shadow-sm outline-none transition focus:border-[#5287C2] focus:ring-2 focus:ring-[#EAF2FB]"
      />
    </div>
  );
}
