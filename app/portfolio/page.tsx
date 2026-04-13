"use client";

import { useState, useMemo } from "react";
import { KpiCard } from "@/app/components/kpi-card";
import { Breakdown } from "@/app/components/breakdown";
import { Input } from "@/app/components/input";
import { format } from "@/app/lib/format";

const FTE_THRESHOLD = 120;

export default function PortfolioPage() {
  const [numBuildings, setNumBuildings] = useState(67);
  const [avgBedsPerBuilding, setAvgBedsPerBuilding] = useState(100);
  const [enrollmentPct, setEnrollmentPct] = useState(0.6);
  const [salaryPerFte, setSalaryPerFte] = useState(90000);
  const [avgMonthlyRent, setAvgMonthlyRent] = useState(4000);
  const [losMonths, setLosMonths] = useState(0.5);
  const [includeLosRevenue, setIncludeLosRevenue] = useState(true);
  const [capRate, setCapRate] = useState(0.07);

  const results = useMemo(() => {
    const totalBeds = numBuildings * avgBedsPerBuilding;
    const enrolledPerBuilding = avgBedsPerBuilding * enrollmentPct;
    const totalEnrolled = totalBeds * enrollmentPct;

    // --- Per-Building (Conservative) ---
    // Each building needs a dedicated FTE, but CC only covers the fraction
    // justified by enrollment (enrolled / 120). Operator keeps paying the rest.
    const ftesPerBuilding = enrolledPerBuilding > 0
      ? Math.max(Math.ceil(enrolledPerBuilding / FTE_THRESHOLD), 1)
      : 0;
    const perBuildingTotalFtes = ftesPerBuilding * numBuildings;
    const ccCoveragePct = Math.min(enrolledPerBuilding / FTE_THRESHOLD, 1);
    const ccCoveragePerBuilding = ccCoveragePct * salaryPerFte;
    const perBuildingPayrollSavings = ccCoveragePerBuilding * numBuildings;
    const operatorRetainedPerBuilding = (ftesPerBuilding * salaryPerFte) - ccCoveragePerBuilding;
    const operatorRetainedTotal = operatorRetainedPerBuilding * numBuildings;

    // --- Fully Pooled (Optimistic) ---
    // CC covers full salary — no cost splitting with operator
    const pooledFtes = totalEnrolled / FTE_THRESHOLD;
    const pooledPayrollSavings = pooledFtes * salaryPerFte;

    // --- SaaS cost ---
    const saasFeePerMonth = totalBeds * 15;
    const annualSaasFee = saasFeePerMonth * 12;

    // --- LOS Revenue ---
    const annualLosRevenue = includeLosRevenue
      ? totalEnrolled * avgMonthlyRent * losMonths
      : 0;

    // --- Net savings ---
    const perBuildingNetAnnual = perBuildingPayrollSavings + annualLosRevenue - annualSaasFee;
    const pooledNetAnnual = pooledPayrollSavings + annualLosRevenue - annualSaasFee;

    // --- Asset value ---
    const perBuildingAssetValue = Math.max(perBuildingNetAnnual, 0) / capRate;
    const pooledAssetValue = Math.max(pooledNetAnnual, 0) / capRate;

    return {
      totalBeds,
      totalEnrolled,
      enrolledPerBuilding,
      ftesPerBuilding,
      perBuildingTotalFtes,
      ccCoveragePct,
      perBuildingPayrollSavings,
      operatorRetainedTotal,
      pooledFtes,
      pooledPayrollSavings,
      annualSaasFee,
      annualLosRevenue,
      perBuildingNetAnnual,
      pooledNetAnnual,
      perBuildingAssetValue,
      pooledAssetValue,
    };
  }, [numBuildings, avgBedsPerBuilding, enrollmentPct, salaryPerFte, avgMonthlyRent, losMonths, includeLosRevenue, capRate]);

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-3 h-full">
      {/* LEFT PANEL — INPUTS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1C2C6B]">Portfolio Inputs</h2>
          <span className="rounded-full bg-[#EAF2FB] px-2 py-0.5 text-xs font-semibold text-[#5287C2]">
            Live
          </span>
        </div>

        <div className="space-y-1.5">
          <Input label="Number of Buildings" value={numBuildings} setValue={setNumBuildings} />
          <Input label="Avg Beds per Building" value={avgBedsPerBuilding} setValue={setAvgBedsPerBuilding} />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Enrollment Rate</span>
              <span className="font-semibold text-[#1C2C6B]">{Math.round(enrollmentPct * 100)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={Math.round(enrollmentPct * 100)}
              onChange={(e) => setEnrollmentPct(Number(e.target.value) / 100)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#5287C2]"
            />
          </div>

          <Input label="Salary per FTE ($)" value={salaryPerFte} setValue={setSalaryPerFte} step={5000} />

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
            <Input label="Avg Monthly Rent ($/resident)" value={avgMonthlyRent} setValue={setAvgMonthlyRent} step={100} />
            <Input label="LOS Increase (months)" value={losMonths} setValue={setLosMonths} step={0.1} />
          </div>

          <Input label="Cap Rate (e.g. 0.07)" value={capRate} setValue={setCapRate} step={0.01} />
        </div>

        {/* Computed inputs summary */}
        <div className="mt-3 space-y-1 border-t border-slate-100 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Computed</p>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Total Beds</span>
            <span className="font-semibold text-[#1C2C6B]">{results.totalBeds.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Total Enrolled</span>
            <span className="font-semibold text-[#1C2C6B]">{Math.round(results.totalEnrolled).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Enrolled / Building</span>
            <span className="font-semibold text-[#1C2C6B]">{Math.round(results.enrolledPerBuilding)}</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="xl:col-span-2 flex flex-col gap-2 min-h-0">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <KpiCard
            title="Annual Net Savings (Per-Building)"
            value={format(results.perBuildingNetAnnual)}
            tone="primary"
          />
          <KpiCard
            title="Annual Net Savings (Fully Pooled)"
            value={format(results.pooledNetAnnual)}
            tone="primary"
          />
        </div>

        {/* SIDE-BY-SIDE SCENARIOS */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {/* Per-Building Scenario */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2">
              <h2 className="text-sm font-semibold text-[#1C2C6B]">Per-Building (Conservative)</h2>
              <p className="text-xs text-slate-400">Each building gets a dedicated FTE (not shared)</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">FTEs per Building</span>
                <span className="text-sm font-semibold text-[#5287C2]">
                  {results.ftesPerBuilding}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">Total FTEs</span>
                <span className="text-sm font-semibold text-[#5287C2]">
                  {results.perBuildingTotalFtes}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">CC Coverage</span>
                <span className="text-sm font-semibold text-[#5287C2]">
                  {Math.round(results.ccCoveragePct * 100)}% of salary
                </span>
              </div>
              <Breakdown label="Payroll Savings (CC covers)" value={results.perBuildingPayrollSavings} />
              <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">Operator Retains</span>
                <span className="text-sm font-semibold text-amber-600">
                  {format(results.operatorRetainedTotal)}
                </span>
              </div>
              {includeLosRevenue && (
                <Breakdown label="LOS Revenue" value={results.annualLosRevenue} />
              )}
              <Breakdown label="SaaS Fee" value={-results.annualSaasFee} />
              <div className="border-t border-slate-100 pt-1">
                <Breakdown label="Net Annual Savings" value={results.perBuildingNetAnnual} />
              </div>
              <Breakdown label="Asset Value Increase" value={results.perBuildingAssetValue} />
            </div>
          </div>

          {/* Fully Pooled Scenario */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2">
              <h2 className="text-sm font-semibold text-[#1C2C6B]">Fully Pooled (Optimistic)</h2>
              <p className="text-xs text-slate-400">FTEs shared nationally across all buildings</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">FTEs (pooled)</span>
                <span className="text-sm font-semibold text-[#5287C2]">
                  {results.pooledFtes.toFixed(1)}
                </span>
              </div>
              <Breakdown label="Payroll Savings (CC covers 100%)" value={results.pooledPayrollSavings} />
              {includeLosRevenue && (
                <Breakdown label="LOS Revenue" value={results.annualLosRevenue} />
              )}
              <Breakdown label="SaaS Fee" value={-results.annualSaasFee} />
              <div className="border-t border-slate-100 pt-1">
                <Breakdown label="Net Annual Savings" value={results.pooledNetAnnual} />
              </div>
              <Breakdown label="Asset Value Increase" value={results.pooledAssetValue} />
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="flex-1 min-h-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm overflow-y-auto">
          <h2 className="mb-1 text-sm font-semibold text-[#1C2C6B]">Portfolio Summary</h2>
          <p className="text-sm leading-6 text-slate-700">
            For a portfolio of{" "}
            <span className="font-semibold text-[#1C2C6B]">{numBuildings} buildings</span>{" "}
            ({results.totalBeds.toLocaleString()} total beds, {Math.round(results.totalEnrolled).toLocaleString()} enrolled at {Math.round(enrollmentPct * 100)}%), Centered Care
            requires between{" "}
            <span className="font-semibold text-[#1C2C6B]">{results.pooledFtes.toFixed(1)}</span>{" "}
            (pooled) and{" "}
            <span className="font-semibold text-[#1C2C6B]">{results.perBuildingTotalFtes}</span>{" "}
            (dedicated per-building)
            FTEs at {format(salaryPerFte)} each. Annual net savings range from{" "}
            <span className="font-semibold text-[#5287C2]">{format(Math.min(results.pooledNetAnnual, results.perBuildingNetAnnual))}</span>{" "}
            (pooled) to{" "}
            <span className="font-semibold text-[#5287C2]">{format(Math.max(results.pooledNetAnnual, results.perBuildingNetAnnual))}</span>{" "}
            (dedicated per-building).
            {includeLosRevenue && (
              <> This includes {format(results.annualLosRevenue)} in retention revenue from an estimated {losMonths}-month LOS increase.</>
            )}
            {" "}At a {(capRate * 100).toFixed(1)}% cap rate, the asset value increase ranges from{" "}
            <span className="font-semibold text-[#5287C2]">{format(Math.min(results.pooledAssetValue, results.perBuildingAssetValue))}</span>{" "}
            to{" "}
            <span className="font-semibold text-[#5287C2]">{format(Math.max(results.pooledAssetValue, results.perBuildingAssetValue))}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
