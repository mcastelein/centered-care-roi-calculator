"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useCalculator } from "@/app/context/calculator-context";
import { Input } from "@/app/components/input";
import { KpiCard } from "@/app/components/kpi-card";
import { format } from "@/app/lib/format";

export default function RealEstateValuationPage() {
  const {
    yearSummaries,
    capRate,
    beds,
    basePropertyValue,
    setBasePropertyValue,
  } = useCalculator();

  const y3 = yearSummaries[2];

  const valuationData = useMemo(
    () =>
      yearSummaries.map((ys) => ({
        name: `Year ${ys.year}`,
        "Asset Value Increase": Math.round(ys.assetValue),
      })),
    [yearSummaries]
  );

  const beforeAfterData = useMemo(
    () => [
      { name: "Before", value: basePropertyValue },
      { name: "After", value: basePropertyValue + y3.assetValue },
    ],
    [basePropertyValue, y3.assetValue]
  );

  const BEFORE_AFTER_COLORS = ["#94A3B8", "#5287C2"];

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1C2C6B]">
            Real Estate Valuation
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Projected impact on property value using a{" "}
            {(capRate * 100).toFixed(1)}% cap rate.
          </p>
        </div>
        <div className="w-56">
          <Input
            label="Base Property Value ($)"
            value={basePropertyValue}
            setValue={setBasePropertyValue}
            step={100000}
          />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiCard
          title="Before (Current Value)"
          value={format(basePropertyValue)}
        />
        <KpiCard
          title="After (with Centered Care)"
          value={format(basePropertyValue + y3.assetValue)}
          tone="primary"
        />
        <KpiCard
          title="Value Increase (Year 3)"
          value={format(y3.assetValue)}
          tone="primary"
        />
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {/* Before / After bar chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#1C2C6B]">
            Property Value: Before vs. After
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={beforeAfterData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `$${(v / 1_000_000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
                tick={{ fill: "#64748B", fontSize: 10 }}
                width={50}
              />
              <Tooltip
                formatter={(value) => format(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" name="Property Value" radius={[6, 6, 0, 0]}>
                {beforeAfterData.map((_, i) => (
                  <Cell key={i} fill={BEFORE_AFTER_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset value increase by year */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#1C2C6B]">
            Asset Value Increase by Year
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={valuationData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `$${(v / 1_000_000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
                tick={{ fill: "#64748B", fontSize: 10 }}
                width={50}
              />
              <Tooltip
                formatter={(value) => format(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="Asset Value Increase"
                fill="#1C2C6B"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Valuation summary */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-base font-semibold text-[#1C2C6B]">
          Valuation Summary
        </h3>
        <p className="text-sm leading-6 text-slate-700">
          At a{" "}
          <span className="font-semibold text-[#1C2C6B]">
            {(capRate * 100).toFixed(1)}% cap rate
          </span>
          , the Year 3 net savings of{" "}
          <span className="font-semibold text-[#1C2C6B]">
            {format(y3.totalNet)}
          </span>{" "}
          for a {beds}-bed community translate to an estimated{" "}
          <span className="font-semibold text-[#5287C2]">
            {format(y3.assetValue)}
          </span>{" "}
          increase in property value, bringing the total from{" "}
          <span className="font-semibold text-[#1C2C6B]">
            {format(basePropertyValue)}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#5287C2]">
            {format(basePropertyValue + y3.assetValue)}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
