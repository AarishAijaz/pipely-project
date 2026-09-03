"use client";

import { Area, AreaChart, Bar, BarChart, RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

// Generates a believable-looking trend ending at the real current value
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

// 1. Sparkline — used for Total and Churned
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

// 2. Ring — used for Active (percentage of total)
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

// 3. Mini bars — used for Leads (simulated weekly breakdown)
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