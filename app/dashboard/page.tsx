"use client";
import { TrendSparkline, ActiveRing, LeadsMiniBar, ComparisonText } from "@/components/mini-charts";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { TrendSparkline, ActiveRing, LeadsMiniBar } from "@/components/mini-charts";
import { Customer } from "@/components/customer-form-dialog";

const STORAGE_KEY = "pipely_customers";

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCustomers(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const activeCount = customers.filter((c) => c.status === "Active").length;
  const leadCount = customers.filter((c) => c.status === "Lead").length;
  const churnedCount = customers.filter((c) => c.status === "Churned").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">An overview of your pipeline.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{customers.length}</div>
            <ComparisonText value={customers.length} />
            <TrendSparkline value={customers.length} color="var(--chart-1)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{activeCount}</div>
            <ActiveRing active={activeCount} total={customers.length} />
            <ComparisonText value={customers.length} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{leadCount}</div>
            <ComparisonText value={customers.length} />
            <LeadsMiniBar value={leadCount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{churnedCount}</div>
            <ComparisonText value={customers.length} />
            <TrendSparkline value={churnedCount} color="var(--chart-4)" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}