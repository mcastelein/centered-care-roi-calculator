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
              Payroll Savings (Single Building)
            </h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                min(enrolled / 120, 1) &times; salary / 12
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Centered Care covers the cost of one FTE for every 120 clinical
              enrollments. With fewer than 120 enrolled, a proportional fraction
              of the {format(payroll)} salary is covered. At {beds} beds &times;{" "}
              {Math.round(y3EligiblePct * 100)}% enrollment ={" "}
              {Math.round(beds * y3EligiblePct)} enrolled &rarr;{" "}
              {((Math.min(beds * y3EligiblePct / 120, 1)) * 100).toFixed(0)}% FTE
              coverage &rarr;{" "}
              <strong>
                {format(Math.min(beds * y3EligiblePct / 120, 1) * payroll / 12)}/month
              </strong>{" "}
              (Year 3 steady state).
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

      {/* Portfolio Methodology */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-[#1C2C6B]">Portfolio Analysis</h3>
        <p className="mb-3 text-sm text-slate-500">
          For multi-building operators, the portfolio page presents two scenarios
          that bound the realistic range of payroll savings. Both use the same
          120-enrollment FTE threshold.
        </p>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm leading-relaxed text-slate-700 md:grid-cols-2">

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">Per-Building (Dedicated Staffing)</h4>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                FTEs per building = ceil(enrolled / 120), min 1
              </code>
            </p>
            <p className="mt-1">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                portfolio total = FTEs per building &times; # buildings &times; salary
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Each building requires at least one dedicated FTE that is not
              shared with other locations. You cannot place half a person at a
              site. A building with 60 enrolled residents still needs 1 full
              FTE at the full salary cost, even though enrollment is below the
              120 threshold.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">Fully Pooled (Optimistic)</h4>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                total FTEs = total enrolled / 120
              </code>
            </p>
            <p className="mt-1">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                portfolio total = total FTEs &times; salary
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              All enrollments are pooled nationally before dividing by the
              120-enrollment threshold. This assumes FTEs can be shared
              perfectly across all locations, which is optimistic for
              geographically dispersed portfolios.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">When the Scenarios Diverge</h4>
            <p className="text-xs text-slate-500">
              The scenarios diverge whenever enrolled residents per building is
              not exactly a multiple of 120. The per-building model rounds up to
              whole FTEs at each site (you need a real person there), while pooled
              uses fractional FTEs across the whole portfolio. For example, 67
              buildings with 60 enrolled each: per-building needs 67 FTEs (1 per
              site), while pooled needs only 33.5 (4,020 &divide; 120). The
              realistic answer depends on how centralized the staffing model is.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">Portfolio LOS Revenue</h4>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                total enrolled &times; avg rent &times; LOS months
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              LOS retention revenue is calculated identically in both scenarios
              since it scales linearly with enrollment and is not affected by
              FTE sharing assumptions. Annualized across all enrolled residents
              in the portfolio.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">Portfolio SaaS Fee</h4>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                total beds &times; $15/month &times; 12
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              The SaaS fee applies to all beds across the portfolio, regardless
              of enrollment level. This is the same in both scenarios.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-[#1C2C6B]">Portfolio Asset Value</h4>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                max(net annual savings, 0) / cap rate
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Calculated separately for each scenario. The asset value is floored
              at zero (negative NOI does not reduce property value in this model).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
