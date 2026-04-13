"use client";

import { useCalculator } from "@/app/context/calculator-context";
import { Input } from "@/app/components/input";
import { KpiCard } from "@/app/components/kpi-card";
import { Breakdown } from "@/app/components/breakdown";
import { format } from "@/app/lib/format";


export default function CalculatorPage() {
  const {
    beds,
    setBeds,
    payroll,
    setPayroll,
    capRate,
    setCapRate,
    avgMonthlyRent,
    setAvgMonthlyRent,
    losMonths,
    setLosMonths,
    includeLosRevenue,
    setIncludeLosRevenue,
    includeSafelyYou,
    setIncludeSafelyYou,
    y1EligiblePct,
    setY1EligiblePct,
    y2EligiblePct,
    setY2EligiblePct,
    y3EligiblePct,
    setY3EligiblePct,
    q1Ramp,
    setQ1Ramp,
    q2Ramp,
    setQ2Ramp,
    q3Ramp,
    setQ3Ramp,
    q4Ramp,
    setQ4Ramp,
    saasFeePerMonth,
    savingsPerEnrolled,
    yearSummaries,
  } = useCalculator();

  const y1 = yearSummaries[0];
  const y3 = yearSummaries[2];

  // Steady-state monthly values (Year 3)
  const steadyEnrolled = beds * y3EligiblePct;
  const steadyFteCoverage = Math.min(steadyEnrolled / 120, 1);
  const steadyPayrollSavings = steadyFteCoverage * payroll / 12;
  const steadyLosRevenue = includeLosRevenue ? steadyEnrolled * avgMonthlyRent * (losMonths / 12) : 0;
  const steadySafelyYouSavings = includeSafelyYou ? beds * 17.5 : 0;
  const steadyNet = steadyPayrollSavings + steadyLosRevenue + steadySafelyYouSavings - saasFeePerMonth;

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-3 h-full">
      {/* LEFT PANEL — INPUTS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1C2C6B]">Inputs</h2>
          <span className="rounded-full bg-[#EAF2FB] px-2 py-0.5 text-xs font-semibold text-[#5287C2]">
            Live
          </span>
        </div>

        <div className="space-y-1.5">
          <Input label="Beds" value={beds} setValue={setBeds} />
          <Input
            label="Annual Payroll Cost ($)"
            value={payroll}
            setValue={setPayroll}
            step={5000}
          />
          <div className={`flex items-center justify-between rounded-xl border p-2 transition ${includeSafelyYou ? "border-[#CFE0F4] bg-[#F7FBFF]" : "border-slate-100 bg-slate-50 opacity-60"}`}>
            <div>
              <span className="text-xs font-semibold text-slate-600">SafelyYou Discount</span>
              <span className="ml-1.5 text-xs text-slate-400">$17.50/resident/mo</span>
            </div>
            <button
              onClick={() => setIncludeSafelyYou(!includeSafelyYou)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${includeSafelyYou ? "bg-[#5287C2]" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform self-center rounded-full bg-white shadow transition-transform ${includeSafelyYou ? "translate-x-4" : "translate-x-1"}`} />
            </button>
          </div>

          <div className={`space-y-1.5 rounded-xl border p-2 transition ${includeLosRevenue ? "border-[#CFE0F4] bg-[#F7FBFF]" : "border-slate-100 bg-slate-50 opacity-60"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">LOS Retention Revenue</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">soft savings</span>
                <button
                  onClick={() => setIncludeLosRevenue(!includeLosRevenue)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${includeLosRevenue ? "bg-[#5287C2]" : "bg-slate-300"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform self-center rounded-full bg-white shadow transition-transform ${includeLosRevenue ? "translate-x-4" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
            <Input
              label="Avg Monthly Rent ($/resident)"
              value={avgMonthlyRent}
              setValue={setAvgMonthlyRent}
              step={100}
            />
            <Input
              label="LOS Increase (months)"
              value={losMonths}
              setValue={setLosMonths}
              step={0.1}
            />
          </div>
          <Input
            label="Cap Rate (e.g. 0.07)"
            value={capRate}
            setValue={setCapRate}
            step={0.01}
          />

          <div className="border-t border-slate-100 pt-1.5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Enrollment by Year
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { label: "Year 1", value: y1EligiblePct, set: setY1EligiblePct },
                  { label: "Year 2", value: y2EligiblePct, set: setY2EligiblePct },
                  { label: "Year 3", value: y3EligiblePct, set: setY3EligiblePct },
                ] as const
              ).map(({ label, value, set }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-[#1C2C6B]">{Math.round(value * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={Math.round(value * 100)}
                    onChange={(e) => set(Number(e.target.value) / 100)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#5287C2]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1.5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Year 1 Enrollment Ramp
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { label: "Q1", value: q1Ramp, set: setQ1Ramp },
                  { label: "Q2", value: q2Ramp, set: setQ2Ramp },
                  { label: "Q3", value: q3Ramp, set: setQ3Ramp },
                  { label: "Q4", value: q4Ramp, set: setQ4Ramp },
                ] as const
              ).map(({ label, value, set }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-[#1C2C6B]">{Math.round(value * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={Math.round(value * 100)}
                    onChange={(e) => set(Number(e.target.value) / 100)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#5287C2]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="xl:col-span-2 flex flex-col gap-2 min-h-0">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <KpiCard
            title="Year 1 Net Savings"
            value={format(y1.totalNet)}
            tone="primary"
          />
          <KpiCard
            title="Year 3 Net Savings"
            value={format(y3.totalNet)}
            tone="primary"
          />
          <KpiCard
            title="Year 3 Asset Value"
            value={format(y3.assetValue)}
          />
        </div>

        {/* BREAKDOWN — Steady state (Year 3 monthly) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1C2C6B]">
              Monthly Breakdown (Steady State)
            </h2>
            <span className="text-xs text-slate-500">Year 3 monthly</span>
          </div>

          <div className="space-y-1">
            <Breakdown label="Payroll Savings" value={steadyPayrollSavings} />
            {includeSafelyYou && (
              <Breakdown label="SafelyYou Discount ($17.50/resident)" value={steadySafelyYouSavings} />
            )}
            {includeLosRevenue && (
              <Breakdown label={`LOS Revenue (+${losMonths} mo × ${format(avgMonthlyRent)}/resident)`} value={steadyLosRevenue} />
            )}
            <Breakdown label="SaaS Fee" value={-saasFeePerMonth} />
            <Breakdown label="Net Monthly Savings" value={steadyNet} />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="flex-1 min-h-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm overflow-y-auto">
          <h2 className="mb-1 text-sm font-semibold text-[#1C2C6B]">
            Summary
          </h2>
          <p className="text-sm leading-6 text-slate-700">
            For a{" "}
            <span className="font-semibold text-[#1C2C6B]">
              {beds}-bed community
            </span>
            , Centered Care generates{" "}
            <span className="font-semibold text-[#1C2C6B]">
              {format(y1.totalNet)}
            </span>{" "}
            in Year 1 net savings, growing to{" "}
            <span className="font-semibold text-[#1C2C6B]">
              {format(y3.totalNet)}
            </span>{" "}
            by Year 3 — including{" "}
            <span className="font-semibold text-[#5287C2]">
              {format(y3.totalLosRevenue)}
            </span>{" "}
            in Year 3 retention revenue from an estimated {losMonths}-month
            increase in length of stay. At a {(capRate * 100).toFixed(1)}% cap
            rate, the steady-state savings translate to approximately{" "}
            <span className="font-semibold text-[#5287C2]">
              {format(y3.assetValue)}
            </span>{" "}
            in asset value creation.
          </p>
        </div>
      </div>
    </div>
  );
}
