"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCalculator } from "@/app/context/calculator-context";
import { KpiCard } from "@/app/components/kpi-card";
import { format } from "@/app/lib/format";

export default function ChartsPage() {
  const { monthlyData, yearSummaries, includeLosRevenue, includeSafelyYou } = useCalculator();

  const lineData = useMemo(
    () =>
      monthlyData.map((d) => ({
        name: d.label,
        "Payroll Savings": Math.round(d.payrollSavings),
        ...(includeSafelyYou ? { "SafelyYou Discount": Math.round(d.safelyYouSavings) } : {}),
        ...(includeLosRevenue ? { "LOS Revenue": Math.round(d.losRevenue) } : {}),
        "SaaS Fee": Math.round(d.saasFee),
        "Net Savings": Math.round(d.netSavings),
      })),
    [monthlyData, includeLosRevenue, includeSafelyYou]
  );

  const cumulativeData = useMemo(() => {
    let running = 0;
    return monthlyData.map((d) => {
      running += d.netSavings;
      return {
        name: d.label,
        "Cumulative Net Savings": Math.round(running),
      };
    });
  }, [monthlyData]);

  const y1 = yearSummaries[0];
  const y2 = yearSummaries[1];
  const y3 = yearSummaries[2];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-[#1C2C6B]">Charts</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          36-month ROI projection with enrollment ramp.
        </p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Year 1 Net Savings" value={format(y1.totalNet)} tone="primary" />
        <KpiCard title="Year 2 Net Savings" value={format(y2.totalNet)} />
        <KpiCard title="Year 3 Net Savings" value={format(y3.totalNet)} />
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Monthly Net Savings line chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#1C2C6B]">
            Monthly Savings
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748B", fontSize: 10 }}
                interval={5}
              />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "#64748B", fontSize: 10 }}
                width={45}
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
              <Line type="monotone" dataKey="Payroll Savings" stroke="#5287C2" strokeWidth={2} dot={false} />
              {includeSafelyYou && <Line type="monotone" dataKey="SafelyYou Discount" stroke="#8B5CF6" strokeWidth={2} dot={false} />}
              {includeLosRevenue && <Line type="monotone" dataKey="LOS Revenue" stroke="#10B981" strokeWidth={2} dot={false} />}
              <Line type="monotone" dataKey="SaaS Fee" stroke="#EF4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Net Savings" stroke="#1C2C6B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Savings area chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#1C2C6B]">
            Cumulative Net Savings
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={cumulativeData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748B", fontSize: 10 }}
                interval={5}
              />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "#64748B", fontSize: 10 }}
                width={45}
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
              <Area
                type="monotone"
                dataKey="Cumulative Net Savings"
                stroke="#1C2C6B"
                fill="#CFE0F4"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
