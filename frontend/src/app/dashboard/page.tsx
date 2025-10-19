"use client";

import { Grid, Typography } from "@mui/material";

import { Section } from "@/components/Section";
import { MetricsOverview } from "@/components/metrics";
import { InvoicesTable, PaymentsTable } from "@/components/tables";
import { MonthlyChart } from "@/components/charts";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {/* Summary Metrics */}
      <Grid size={12}>
        <Section title="Summary Metrics" subtitle="Overall financial overview">
          <MetricsOverview />
        </Section>
      </Grid>

      {/* Payments Table */}
      <Grid size={12}>
        <Section title="Recent Payments" subtitle="Latest payment transactions">
          <PaymentsTable />
        </Section>
      </Grid>

      {/* Invoices Table */}
      <Grid size={12}>
        <Section title="Recent Invoices" subtitle="Latest invoice records">
          <InvoicesTable />
        </Section>
      </Grid>

      {/* Monthly Chart */}
      <Grid size={12}>
        <Section title="Monthly Overview" subtitle="Revenue and payment trends">
          <MonthlyChart />
        </Section>
      </Grid>
    </Grid>
  );
}
