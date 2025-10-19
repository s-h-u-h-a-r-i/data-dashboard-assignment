"use client";

import { JSX } from "react";

import { Grid } from "@mui/material";

import { useSummary } from "@/lib/hooks";
import {
  AccountBalanceWallet,
  Assignment,
  CheckCircle,
  ErrorOutline,
  HourglassEmpty,
  Receipt,
  TrendingUp,
} from "@/icons";
import { formatCurrency } from "@/utils";

import { MetricCard } from "./MetricCard";

export function MetricsOverview(): JSX.Element | null {
  const { data, isLoading, error } = useSummary();

  const formatCount = (count: number) => {
    return `${count} ${count === 1 ? "transaction" : "transactions"}`;
  };

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard title="" value="" isLoading={true} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || !data) {
    return null;
  }

  const { payments, invoices } = data;

  return (
    <Grid container spacing={2}>
      {/* Total Payments */}
      <Grid size="auto">
        <MetricCard
          title="Total Payments"
          value={formatCurrency(payments.total_amount)}
          subtitle={formatCount(payments.total_count)}
          icon={<AccountBalanceWallet />}
          color="primary"
        />
      </Grid>

      {/* Paid Payments */}
      <Grid size="auto">
        <MetricCard
          title="Paid"
          value={formatCurrency(payments.paid_amount)}
          subtitle={formatCount(payments.paid_count)}
          icon={<CheckCircle />}
          color="success"
        />
      </Grid>

      {/* Pending Payments */}
      <Grid size="auto">
        <MetricCard
          title="Pending"
          value={formatCurrency(payments.pending_amount)}
          subtitle={formatCount(payments.pending_count)}
          icon={<HourglassEmpty />}
          color="warning"
        />
      </Grid>

      {/* Total Invoices */}
      <Grid size="auto">
        <MetricCard
          title="Total Invoices"
          value={formatCurrency(invoices.total_amount)}
          subtitle={formatCount(invoices.total_count)}
          icon={<Receipt />}
          color="info"
        />
      </Grid>

      {/* Paid Invoices */}
      <Grid size="auto">
        <MetricCard
          title="Invoices Paid"
          value={formatCurrency(invoices.paid_amount)}
          subtitle={formatCount(invoices.paid_count)}
          icon={<Assignment />}
          color="success"
        />
      </Grid>

      {/* Unpaid Invoices */}
      <Grid size="auto">
        <MetricCard
          title="Unpaid"
          value={formatCurrency(invoices.unpaid_amount)}
          subtitle={formatCount(invoices.unpaid_count)}
          icon={<TrendingUp />}
          color="warning"
        />
      </Grid>

      {/* Overdue Invoices */}
      <Grid size="auto">
        <MetricCard
          title="Overdue"
          value={formatCurrency(invoices.overdue_amount)}
          subtitle={formatCount(invoices.overdue_count)}
          icon={<ErrorOutline />}
          color="error"
        />
      </Grid>
    </Grid>
  );
}
