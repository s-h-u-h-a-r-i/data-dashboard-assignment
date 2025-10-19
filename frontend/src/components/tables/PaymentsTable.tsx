"use client";

import { JSX, useState } from "react";

import {
  Box,
  Chip,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridPaginationModel } from "@mui/x-data-grid";

import { Payment, PaymentStatus } from "@/types/model";
import { formatCurrency, formatDateTime } from "@/utils";
import { usePayments } from "@/lib/hooks";
import { PaymentFilterParams } from "@/types/api";

/**
 * Renders a Material UI Chip displaying the status of a payment
 * with an appropriate color based on the status.
 *
 * @returns MUI Chip element with status label and color
 */
function PaymentStatusChip({
  status,
}: {
  /** Status of the payment ("PAID" or "PENDING") */
  status: PaymentStatus;
}): JSX.Element {
  return (
    <Chip
      label={status.toUpperCase()}
      color={status === PaymentStatus.PAID ? "success" : "warning"}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}

/**
 * ### A set of filter controls for payments.
 *
 * Renders status, start date, and end date filters for payments,
 * and a button for clearing all filters.
 * Calls the provided callback handlers when filters are changed or cleared.
 *
 * @returns The filter controls UI.
 */
function PaymentFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: {
  /** The current filter values */
  filters: PaymentFilterParams;
  /** Callback invoked when a filter value changes. */
  onFilterChange: (newFilters: Partial<PaymentFilterParams>) => void;
  /** Callback invoked to clear all filters. */
  onClearFilters: () => void;
}): JSX.Element {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filter Payments
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                status: (e.target.value as PaymentStatus) || undefined,
              })
            }
            label="Status">
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value={PaymentStatus.PAID}>Paid</MenuItem>
            <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="Start Date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={filters.start_date || ""}
          onChange={(e) =>
            onFilterChange({
              start_date: e.target.value || undefined,
            })
          }
          sx={{ minWidth: 150 }}
        />

        <TextField
          size="small"
          type="date"
          label="End Date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={filters.end_date || ""}
          onChange={(e) =>
            onFilterChange({
              end_date: e.target.value || undefined,
            })
          }
          sx={{ minWidth: 150 }}
        />

        <Button
          variant="outlined"
          onClick={onClearFilters}
          sx={{ minWidth: 120 }}>
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
}

/**
 * ### Renders the data grid for payment records.
 *
 * Displays a paginated, sortable table of payments with columns such as transaction ID,
 * customer, amount, status, description, and created date. Uses MUI DataGrid and supports
 * server-side pagination via provided props.
 *
 * @returns The rendered payment data grid.
 */
function PaymentDataGrid({
  data,
  isLoading,
  paginationModel,
  onPaginationChange,
}: {
  /**
   * The payment list data and pagination information. Can be undefined while loading.
   */
  data: { items: Payment[]; pagination: { total_items: number } } | undefined;
  /**
   * If true, the grid displays a loading state.
   */
  isLoading: boolean;
  /**
   * The current pagination model ({ page, pageSize }).
   */
  paginationModel: GridPaginationModel;
  /**
   * Callback when pagination changes (e.g., user navigates page or changes size).
   */
  onPaginationChange: (model: GridPaginationModel) => void;
}): JSX.Element {
  const columns: GridColDef<Payment>[] = [
    {
      field: "transaction_id",
      headerName: "Transaction ID",
      width: 180,
      sortable: true,
    },
    {
      field: "customer_name",
      headerName: "Customer",
      width: 200,
      sortable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      sortable: true,
      valueFormatter: (value, row) =>
        formatCurrency(value as number, row.currency),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: true,
      renderCell: (params) => {
        const status = params.value as PaymentStatus;
        return <PaymentStatusChip status={status} />;
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      sortable: false,
    },
    {
      field: "created_at",
      headerName: "Date",
      width: 180,
      sortable: true,
      valueGetter: (value) => new Date(value as string),
      valueFormatter: (value) => formatDateTime(value),
    },
  ];

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={data?.items || []}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={data?.pagination.total_items || 0}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          "& .MuiDataGrid-cell": {
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "background.default",
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}

/**
 * ### PaymentsTable displays a table of payments with filter and pagination controls.
 *
 * This component manages pagination and filter state, fetches payment data using the `usePayments` hook,
 * and delegates rendering of filter controls and data grid to child components.
 *
 * @returns {JSX.Element} The payments table UI with filters and paginated/sortable rows.
 */
export function PaymentsTable(): JSX.Element {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<PaymentFilterParams>({
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
  });
  const { data, isLoading } = usePayments(filters);

  /**
   * ### Handles pagination changes from the DataGrid.
   *
   * Updates both the local pagination model and the filter state to reflect new
   * page and page size values (note conversion to 1-based page for the API).
   *
   * @param model The new pagination model from DataGrid.
   */
  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setFilters((prev) => ({
      ...prev,
      page: model.page + 1,
      page_size: model.pageSize,
    }));
  };

  /**
   * ### Handles filter changes from the filter controls.
   *
   * Applies new filter values and resets pagination to the first page.
   *
   * @param newFilters The updated filter fields.
   */
  const handleFilterChange = (newFilters: Partial<PaymentFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  /**
   * Resets all filters to their default values and goes to the first page.
   */
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      page_size: paginationModel.pageSize,
    });
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PaymentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      <PaymentDataGrid
        data={data}
        isLoading={isLoading}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
      />
    </Box>
  );
}
