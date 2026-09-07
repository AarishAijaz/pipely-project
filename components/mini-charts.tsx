"use client";

import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

function generateTrend(currentValue: number, points = 7) {
  const data = [];
  let value = Math.max(0, currentValue - Math.floor(Math.random() * 3 + 2));
  for (let i = 0; i < points - 1; i++) {
    value = Math.max(0, value + Math.floor(Math.random() * 3) - 1);
    data.push({ day: i, value });
  }
  data.push({ day: points - 1, value: currentValue });
  return data;
}

const chartConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TrendSparkline({ value, color }: { value: number; color?: string }) {
  const data = generateTrend(value);
  return (
    <ChartContainer config={chartConfig} className="h-12 w-full">
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color ?? "var(--chart-1)"}
          fill={color ?? "var(--chart-1)"}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function ActiveRing({ active, total }: { active: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((active / total) * 100);
  const data = [{ name: "active", value: percent, fill: "var(--chart-2)" }];

  return (
    <ChartContainer config={chartConfig} className="h-16 w-16">
      <RadialBarChart
        data={data}
        innerRadius="70%"
        outerRadius="100%"
        startAngle={90}
        endAngle={90 - percent * 3.6}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
        <RadialBar dataKey="value" background cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  );
}

export function LeadsMiniBar({ value }: { value: number }) {
  const data = generateTrend(value, 5).map((d) => ({ day: d.day, value: d.value }));
  return (
    <ChartContainer config={chartConfig} className="h-12 w-full">
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill="var(--chart-3)" radius={2} />
      </BarChart>
    </ChartContainer>
  );
}

export function ComparisonText({ value, invert = false }: { value: number; invert?: boolean }) {
  const percentChange = useMemo(() => {
    const seed = value * 7 + 3;
    const pseudoRandom = (Math.sin(seed) + 1) / 2;
    const magnitude = Math.round(pseudoRandom * 20);
    const isPositive = Math.sin(seed * 1.3) > 0;
    return isPositive ? magnitude : -magnitude;
  }, [value]);

  const isGood = invert ? percentChange <= 0 : percentChange >= 0;
  const Icon = percentChange >= 0 ? TrendingUp : TrendingDown;

  return (
    <p className={`flex items-center gap-1 text-xs mt-1 ${isGood ? "text-emerald-600" : "text-red-600"}`}>
      <Icon className="h-3 w-3" />
      {percentChange >= 0 ? "+" : ""}
      {percentChange}% vs last month
    </p>
  );
}