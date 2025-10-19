"use client";

import { Grid, Typography } from "@mui/material";

import { Section } from "@/components/Section";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {/* Summary Metrics */}
      <Grid size={12}>
        <Section title="Summary Metrics" subtitle="Overall financial overview">
          <Typography>Metrics will go here (Phase 5)</Typography>
        </Section>
      </Grid>

      {/* Payments Table */}
      <Grid size={12}>
        <Section title="Recent Payments" subtitle="Latest payment transactions">
          <Typography>Payments table will go here (Phase 5)</Typography>
        </Section>
      </Grid>

      {/* Invoices Table */}
      <Grid size={12}>
        <Section title="Recent Invoices" subtitle="Latest invoice records">
          <Typography>Invoices table will go here (Phase 5)</Typography>
        </Section>
      </Grid>

      {/* Monthly Chart */}
      <Grid size={12}>
        <Section title="Monthly Overview" subtitle="Revenue and payment trends">
          <Typography>Chart will go here (Phase 5)</Typography>
        </Section>
      </Grid>
    </Grid>
  );
}
