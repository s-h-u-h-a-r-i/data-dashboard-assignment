"use client";

import { useSummary } from "@/lib/hooks";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { JSX } from "react";

export function MonthlyChart(): JSX.Element | null {
  const { data, isLoading, error } = useSummary();

  if (isLoading) {
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={400}>
        <Typography color="text.secondary">Loading chart...</Typography>
      </Box>
    );
  }

  if (error || !data) return null;

  const paymentsMonthly = data.payments.monthly_breakdown;
  const invoicesMonthly = data.invoices.monthly_breakdown;

  const allMonths = Array.from(
    new Set([
      ...paymentsMonthly.map((m) => m.month),
      ...invoicesMonthly.map((m) => m.month),
    ])
  ).sort();

  const paymentsData = allMonths.map((month) => {
    const found = paymentsMonthly.find((m) => m.month === month);
    return found ? found.total_amount : 0;
  });

  const invoicesData = allMonths.map((month) => {
    const found = invoicesMonthly.find((m) => m.month === month);
    return found ? found.total_amount : 0;
  });

  const monthLabels = allMonths.map((month) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString(navigator.language, {
      month: "short",
      year: "numeric",
    });
  });

  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `R${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R${(value / 1000).toFixed(1)}K`;
    }
    return `R${value}`;
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: monthLabels,
            label: "Month",
          },
        ]}
        yAxis={[
          {
            label: "Amount (ZAR)",
            valueFormatter: formatAmount,
          },
        ]}
        series={[
          {
            label: "Payments",
            data: paymentsData,
            color: "#1976d2",
          },
          {
            label: "Invoices",
            data: invoicesData,
            color: "#dc004e",
          },
        ]}
        height={400}
        margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: { vertical: "top", horizontal: "end" },
          },
        }}
      />
    </Box>
  );
}
