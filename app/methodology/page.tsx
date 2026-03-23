"use client";

import { useCalculator } from "@/app/context/calculator-context";
import { format } from "@/app/lib/format";

export default function MethodologyPage() {
  const {
    beds,
    payroll,
    avgMonthlyRent,
    losMonths,
    y1EligiblePct,
    y2EligiblePct,
    y3EligiblePct,
    q1Ramp,
    q2Ramp,
    q3Ramp,
    q4Ramp,
    capRate,
    saasFeePerMonth,
    savingsPerEnrolled,
    includeLosRevenue,
    includeSafelyYou,
  } = useCalculator();

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-[#1C2C6B]">Methodology</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          How the ROI calculations work.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm leading-relaxed text-slate-700 md:grid-cols-2">

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">SaaS Fee</h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                beds &times; $15/month
              </code>{" "}
              = {beds} &times; $15 ={" "}
              <strong>{format(saasFeePerMonth)}/month</strong>
            </p>
            <p className="mt-1 text-xs text-slate-500">Flat fee charged regardless of enrollment.</p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">
              Payroll Savings
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                enrolled &times; (payroll / 12 / beds)
              </code>{" "}
              = enrolled &times; ${savingsPerEnrolled.toFixed(2)}/resident/month
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Monthly payroll savings scale with how many residents are enrolled.
              At full enrollment: {format(payroll / 12)}/month.
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">
              Enrolled Residents
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                beds &times; eligible% &times; ramp%
              </code>
            </p>
            <ul className="mt-1 ml-4 list-disc space-y-0.5 text-xs">
              <li>
                Year 1: {Math.round(y1EligiblePct * 100)}% eligible &mdash; ramp{" "}
                {Math.round(q1Ramp * 100)}% (Q1) &rarr;{" "}
                {Math.round(q2Ramp * 100)}% (Q2) &rarr;{" "}
                {Math.round(q3Ramp * 100)}% (Q3) &rarr;{" "}
                {Math.round(q4Ramp * 100)}% (Q4)
              </li>
              <li>Year 2: {Math.round(y2EligiblePct * 100)}% eligible, 100% enrollment</li>
              <li>Year 3: {Math.round(y3EligiblePct * 100)}% eligible, 100% enrollment</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">
              SafelyYou Discount{" "}
              {!includeSafelyYou && <span className="text-xs font-normal text-slate-400">(disabled)</span>}
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                beds &times; $17.50/month
              </code>{" "}
              = {beds} &times; $17.50 ={" "}
              <strong>{format(beds * 17.5)}/month</strong>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              SafelyYou normally costs $85/resident/month. Centered Care
              negotiates a $17.50/resident/month discount, applied to all residents.
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">
              LOS Retention Revenue{" "}
              {!includeLosRevenue && <span className="text-xs font-normal text-slate-400">(disabled)</span>}
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                enrolled &times; avg rent &times; LOS months / 12
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Estimated {losMonths}-month increase in length of stay. Each
              enrolled resident contributes{" "}
              <strong>{format(avgMonthlyRent * (losMonths / 12))}/month</strong>{" "}
              in annualized retention revenue (at {format(avgMonthlyRent)}/month
              rent).
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">Net Savings</h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                payroll savings
                {includeSafelyYou ? " + SafelyYou discount" : ""}
                {includeLosRevenue ? " + LOS revenue" : ""}
                {" "}&minus; SaaS fee
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">Summed over 12 months for the annual figure.</p>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#1C2C6B]">
              Asset Value Increase
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                annual net savings / cap rate
              </code>{" "}
              (cap rate = {(capRate * 100).toFixed(1)}%)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Standard cap rate valuation: NOI divided by cap rate equals implied
              property value increase.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
