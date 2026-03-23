"use client";

import { useMemo, useEffect } from "react";
import { useCalculator } from "@/app/context/calculator-context";
import { format } from "@/app/lib/format";
import Image from "next/image";

export default function PrintPage() {
  const {
    beds,
    payroll,
    capRate,
    avgMonthlyRent,
    losMonths,
    y1EligiblePct,
    y2EligiblePct,
    y3EligiblePct,
    q1Ramp,
    q2Ramp,
    q3Ramp,
    saasFeePerMonth,
    savingsPerEnrolled,
    monthlyData,
    yearSummaries,
    basePropertyValue,
  } = useCalculator();

  const y1 = yearSummaries[0];
  const y2 = yearSummaries[1];
  const y3 = yearSummaries[2];

  const steadyEnrolled = beds * y3EligiblePct;
  const steadyPayrollSavings = steadyEnrolled * savingsPerEnrolled;
  const steadyLosRevenue = steadyEnrolled * avgMonthlyRent * (losMonths / 12);
  const steadyNet = steadyPayrollSavings + steadyLosRevenue - saasFeePerMonth;

  const cumulativeTotal = useMemo(
    () => monthlyData.reduce((s, d) => s + d.netSavings, 0),
    [monthlyData]
  );

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="print-page mx-auto max-w-4xl space-y-8 bg-white p-8 text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Image src="/cc_logo.png" alt="Centered Care" width={180} height={36} />
        <div>
          <h1 className="text-2xl font-bold text-[#1C2C6B]">
            ROI Analysis Report
          </h1>
          <p className="text-sm text-slate-500">
            Generated {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Inputs summary */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Assumptions
        </h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">Beds</p>
            <p className="text-lg font-bold text-[#1C2C6B]">{beds}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">Annual Payroll</p>
            <p className="text-lg font-bold text-[#1C2C6B]">{format(payroll)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">Avg Monthly Rent</p>
            <p className="text-lg font-bold text-[#1C2C6B]">{format(avgMonthlyRent)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">LOS Increase</p>
            <p className="text-lg font-bold text-[#1C2C6B]">{losMonths} months</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">Eligible %</p>
            <p className="text-lg font-bold text-[#1C2C6B]">
              Y1: {Math.round(y1EligiblePct * 100)}% / Y2: {Math.round(y2EligiblePct * 100)}% / Y3: {Math.round(y3EligiblePct * 100)}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-slate-500">Cap Rate</p>
            <p className="text-lg font-bold text-[#1C2C6B]">
              {(capRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 p-3 text-sm">
          <p className="text-slate-500">Year 1 Enrollment Ramp</p>
          <p className="font-bold text-[#1C2C6B]">
            Q1: {Math.round(q1Ramp * 100)}% &nbsp;&rarr;&nbsp; Q2: {Math.round(q2Ramp * 100)}% &nbsp;&rarr;&nbsp; Q3: {Math.round(q3Ramp * 100)}% &nbsp;&rarr;&nbsp; Q4: 100%
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Key Results
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Year 1 Net Savings", value: y1.totalNet },
            { label: "Year 2 Net Savings", value: y2.totalNet },
            { label: "Year 3 Net Savings", value: y3.totalNet },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#CFE0F4] bg-[#F7FBFF] p-4"
            >
              <p className="text-sm text-[#5287C2]">{kpi.label}</p>
              <p className="text-xl font-bold text-[#1C2C6B]">
                {format(kpi.value)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#CFE0F4] bg-[#F7FBFF] p-4">
            <p className="text-sm text-[#5287C2]">3-Year Cumulative Savings</p>
            <p className="text-xl font-bold text-[#1C2C6B]">
              {format(cumulativeTotal)}
            </p>
          </div>
          <div className="rounded-xl border border-[#CFE0F4] bg-[#F7FBFF] p-4">
            <p className="text-sm text-[#5287C2]">
              Year 3 Asset Value Increase
            </p>
            <p className="text-xl font-bold text-[#1C2C6B]">
              {format(y3.assetValue)}
            </p>
          </div>
        </div>
      </section>

      {/* Monthly breakdown (steady state) */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Monthly Breakdown (Steady State — Year 3)
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
            <span>Monthly Payroll Savings</span>
            <span className="font-semibold text-[#5287C2]">
              {format(steadyPayrollSavings)}
            </span>
          </div>
          <div className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
            <span>Monthly LOS Retention Revenue (+{losMonths} mo)</span>
            <span className="font-semibold text-[#5287C2]">
              {format(steadyLosRevenue)}
            </span>
          </div>
          <div className="flex justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
            <span>Monthly SaaS Fee</span>
            <span className="font-semibold text-red-500">
              -{format(saasFeePerMonth)}
            </span>
          </div>
          <div className="flex justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold">
            <span>Monthly Net Savings</span>
            <span className="text-[#1C2C6B]">{format(steadyNet)}</span>
          </div>
        </div>
      </section>

      {/* Year-by-year table */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Year-by-Year Summary
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2">Year</th>
              <th className="py-2 text-right">Payroll Savings</th>
              <th className="py-2 text-right">LOS Revenue</th>
              <th className="py-2 text-right">SaaS Fees</th>
              <th className="py-2 text-right">Net Savings</th>
              <th className="py-2 text-right">Asset Value</th>
            </tr>
          </thead>
          <tbody>
            {yearSummaries.map((ys) => (
              <tr
                key={ys.year}
                className="border-b border-slate-100"
              >
                <td className="py-2 font-medium">Year {ys.year}</td>
                <td className="py-2 text-right">
                  {format(ys.totalPayrollSavings)}
                </td>
                <td className="py-2 text-right text-emerald-600">
                  {format(ys.totalLosRevenue)}
                </td>
                <td className="py-2 text-right text-red-500">
                  -{format(ys.totalSaasFee)}
                </td>
                <td className="py-2 text-right font-semibold text-[#1C2C6B]">
                  {format(ys.totalNet)}
                </td>
                <td className="py-2 text-right font-semibold text-[#5287C2]">
                  {format(ys.assetValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Real estate comparison */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Real Estate Valuation Impact
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Before</p>
            <p className="text-xl font-bold text-[#1C2C6B]">
              {format(basePropertyValue)}
            </p>
          </div>
          <div className="rounded-xl border border-[#CFE0F4] bg-[#F7FBFF] p-4">
            <p className="text-sm text-[#5287C2]">After (Year 3)</p>
            <p className="text-xl font-bold text-[#1C2C6B]">
              {format(basePropertyValue + y3.assetValue)}
            </p>
          </div>
          <div className="rounded-xl border border-[#CFE0F4] bg-[#F7FBFF] p-4">
            <p className="text-sm text-[#5287C2]">Value Increase</p>
            <p className="text-xl font-bold text-[#1C2C6B]">
              {format(y3.assetValue)}
            </p>
          </div>
        </div>
      </section>

      {/* Math explanation */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#1C2C6B]">
          Methodology
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>SaaS Fee:</strong> beds &times; $15/month = {beds} &times;
            $15 = {format(saasFeePerMonth)}/month
          </p>
          <p>
            <strong>Savings per Enrolled Resident:</strong> payroll / 12 / (beds
            &times; 1.2) = {format(payroll)} / 12 / ({beds} &times; 1.2) = $
            {savingsPerEnrolled.toFixed(2)}/month
          </p>
          <p>
            <strong>LOS Retention Revenue:</strong> enrolled &times; avg monthly
            rent &times; LOS increase / 12 = enrolled &times;{" "}
            {format(avgMonthlyRent)} &times; {losMonths} / 12. Each enrolled
            resident contributes {format(avgMonthlyRent * (losMonths / 12))}/month
            in annualized retention revenue.
          </p>
          <p>
            <strong>Enrolled Residents:</strong> beds &times; eligible% &times;
            enrollment%. Year 1 ramps {Math.round(q1Ramp * 100)}% &rarr;{" "}
            {Math.round(q2Ramp * 100)}% &rarr; {Math.round(q3Ramp * 100)}%
            &rarr; 100% by quarter. Eligible: {Math.round(y1EligiblePct * 100)}%
            (Y1), {Math.round(y2EligiblePct * 100)}% (Y2),{" "}
            {Math.round(y3EligiblePct * 100)}% (Y3).
          </p>
          <p>
            <strong>Net Savings:</strong> monthly payroll savings + LOS revenue
            &minus; SaaS fee, summed annually.
          </p>
          <p>
            <strong>Asset Value:</strong> annual net savings / cap rate (
            {(capRate * 100).toFixed(1)}%).
          </p>
        </div>
      </section>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          nav,
          .print\\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            background: white !important;
          }
          .print-page {
            max-width: 100% !important;
            padding: 0 !important;
          }
          section {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
