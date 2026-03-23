"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface MonthData {
  month: number; // 1–36
  label: string; // "M1", "M2", …
  year: number; // 1, 2, or 3
  enrolled: number;
  payrollSavings: number;
  losRevenue: number;
  safelyYouSavings: number;
  saasFee: number;
  netSavings: number;
}

export interface YearSummary {
  year: number;
  totalPayrollSavings: number;
  totalLosRevenue: number;
  totalSafelyYouSavings: number;
  totalSaasFee: number;
  totalNet: number;
  assetValue: number;
}

interface CalculatorState {
  beds: number;
  setBeds: (v: number) => void;
  payroll: number;
  setPayroll: (v: number) => void;
  capRate: number;
  setCapRate: (v: number) => void;
  avgMonthlyRent: number;
  setAvgMonthlyRent: (v: number) => void;
  losMonths: number;
  setLosMonths: (v: number) => void;
  includeLosRevenue: boolean;
  setIncludeLosRevenue: (v: boolean) => void;
  includeSafelyYou: boolean;
  setIncludeSafelyYou: (v: boolean) => void;
  y1EligiblePct: number;
  setY1EligiblePct: (v: number) => void;
  y2EligiblePct: number;
  setY2EligiblePct: (v: number) => void;
  y3EligiblePct: number;
  setY3EligiblePct: (v: number) => void;
  q1Ramp: number;
  setQ1Ramp: (v: number) => void;
  q2Ramp: number;
  setQ2Ramp: (v: number) => void;
  q3Ramp: number;
  setQ3Ramp: (v: number) => void;
  q4Ramp: number;
  setQ4Ramp: (v: number) => void;
  basePropertyValue: number;
  setBasePropertyValue: (v: number) => void;
  // derived
  saasFeePerMonth: number;
  savingsPerEnrolled: number;
  monthlyData: MonthData[];
  yearSummaries: YearSummary[];
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [beds, setBeds] = useState(100);
  const [payroll, setPayroll] = useState(90000);
  const [capRate, setCapRate] = useState(0.07);
  const [avgMonthlyRent, setAvgMonthlyRent] = useState(4000);
  const [losMonths, setLosMonths] = useState(0.5);
  const [includeLosRevenue, setIncludeLosRevenue] = useState(true);
  const [includeSafelyYou, setIncludeSafelyYou] = useState(false);
  const [y1EligiblePct, setY1EligiblePct] = useState(0.7);
  const [y2EligiblePct, setY2EligiblePct] = useState(0.8);
  const [y3EligiblePct, setY3EligiblePct] = useState(0.9);
  const [q1Ramp, setQ1Ramp] = useState(0.7);
  const [q2Ramp, setQ2Ramp] = useState(0.9);
  const [q3Ramp, setQ3Ramp] = useState(1.0);
  const [q4Ramp, setQ4Ramp] = useState(1.0);
  const [basePropertyValue, setBasePropertyValue] = useState(5000000);

  const saasFeePerMonth = beds * 15;
  const savingsPerEnrolled = payroll / 12 / beds;

  const monthlyData = useMemo(() => {
    const data: MonthData[] = [];
    const y1QuarterlyRamp = [q1Ramp, q2Ramp, q3Ramp, q4Ramp];

    for (let m = 1; m <= 36; m++) {
      const year = m <= 12 ? 1 : m <= 24 ? 2 : 3;
      let enrolled: number;

      if (year === 1) {
        const quarter = Math.ceil(m / 3); // 1-4
        enrolled = beds * y1EligiblePct * y1QuarterlyRamp[quarter - 1];
      } else if (year === 2) {
        enrolled = beds * y2EligiblePct;
      } else {
        enrolled = beds * y3EligiblePct;
      }

      const payrollSavings = enrolled * savingsPerEnrolled;
      // LOS revenue: each enrolled resident contributes losMonths extra months of
      // rent per year, spread evenly across months → losMonths/12 per month
      const losRevenue = includeLosRevenue ? enrolled * avgMonthlyRent * (losMonths / 12) : 0;
      // SafelyYou: $17.50/resident/month discount applied to all beds
      const safelyYouSavings = includeSafelyYou ? beds * 17.5 : 0;
      const saasFee = saasFeePerMonth;
      const netSavings = payrollSavings + losRevenue + safelyYouSavings - saasFee;

      data.push({
        month: m,
        label: `M${m}`,
        year,
        enrolled,
        payrollSavings,
        losRevenue,
        safelyYouSavings,
        saasFee,
        netSavings,
      });
    }

    return data;
  }, [beds, payroll, avgMonthlyRent, losMonths, includeLosRevenue, includeSafelyYou, y1EligiblePct, y2EligiblePct, y3EligiblePct, q1Ramp, q2Ramp, q3Ramp, q4Ramp, savingsPerEnrolled, saasFeePerMonth]);

  const yearSummaries = useMemo(() => {
    const summaries: YearSummary[] = [];

    for (let y = 1; y <= 3; y++) {
      const yearMonths = monthlyData.filter((d) => d.year === y);
      const totalPayrollSavings = yearMonths.reduce(
        (s, d) => s + d.payrollSavings,
        0
      );
      const totalLosRevenue = yearMonths.reduce((s, d) => s + d.losRevenue, 0);
      const totalSafelyYouSavings = yearMonths.reduce((s, d) => s + d.safelyYouSavings, 0);
      const totalSaasFee = yearMonths.reduce((s, d) => s + d.saasFee, 0);
      const totalNet = yearMonths.reduce((s, d) => s + d.netSavings, 0);
      const assetValue = totalNet / capRate;

      summaries.push({ year: y, totalPayrollSavings, totalLosRevenue, totalSafelyYouSavings, totalSaasFee, totalNet, assetValue });
    }

    return summaries;
  }, [monthlyData, capRate]);

  return (
    <CalculatorContext.Provider
      value={{
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
        basePropertyValue,
        setBasePropertyValue,
        saasFeePerMonth,
        savingsPerEnrolled,
        monthlyData,
        yearSummaries,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx)
    throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
}
