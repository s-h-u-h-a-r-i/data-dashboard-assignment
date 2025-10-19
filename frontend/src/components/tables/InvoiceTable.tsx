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

import { useInvoices } from "@/lib/hooks";
import { Invoice, InvoiceStatus } from "@/types/model";
import { formatCurrency, formatDate } from "@/utils";
import { InvoiceFilterParams, InvoiceListResponse } from "@/types/api";

const statusColorMap = {
  [InvoiceStatus.PAID]: "success",
  [InvoiceStatus.UNPAID]: "warning",
  [InvoiceStatus.OVERDUE]: "error",
} as const;

/**
 * Renders a Material UI Chip displaying the status of an invoice
 * with appropriate color based on the status.
 *
 * @param props
 * @param props.status Status of the invoice ("PAID", "UNPAID", or "OVERDUE")
 * @returns MUI Chip element with status label and color
 */
function StatusChip({ status }: { status: InvoiceStatus }): JSX.Element {
  return (
    <Chip
      label={status.toUpperCase()}
      color={statusColorMap[status] || "default"}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}

/**
 * Renders filter controls for the invoice table, allowing users to filter invoices by status, start date, and end date.
 * @returns The rendered filter controls.
 */
function InvoiceFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: {
  /**
   * The current filter values for the invoice list.
   */
  filters: InvoiceFilterParams;
  /**
   * Handler called when any filter value changes.
   */
  onFilterChange: (newFilters: Partial<InvoiceFilterParams>) => void;
  /**
   * Handler called when the user clicks the "Clear Filters" button.
   */
  onClearFilters: () => void;
}): JSX.Element {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filter Invoices
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
                status: (e.target.value as InvoiceStatus) || undefined,
              })
            }
            label="Status">
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value={InvoiceStatus.PAID}>Paid</MenuItem>
            <MenuItem value={InvoiceStatus.UNPAID}>Unpaid</MenuItem>
            <MenuItem value={InvoiceStatus.OVERDUE}>Overdue</MenuItem>
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
 * Renders the data grid for the invoice table, displaying a paginated, sortable set of invoices.
 */
function InvoiceDataGrid({
  data,
  isLoading,
  paginationModel,
  onPaginationChange,
}: {
  /** The response object containing invoice items and pagination info. Can be undefined while loading. */
  data: InvoiceListResponse | undefined;
  /** Whether the grid should show a loading state. */
  isLoading: boolean;
  /** The current pagination state for the grid (page, pageSize). */
  paginationModel: GridPaginationModel;
  /** Callback when the pagination model changes (e.g., page or page size changes). */
  onPaginationChange: (model: GridPaginationModel) => void;
}) {
  const columns: GridColDef<Invoice>[] = [
    {
      field: "invoice_number",
      headerName: "Invoice #",
      width: 140,
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
      valueFormatter: (_, row) => formatCurrency(row.amount, row.currency),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: true,
      renderCell: (params) => {
        const status = params.value as InvoiceStatus;
        return <StatusChip status={status} />;
      },
    },
    {
      field: "issue_date",
      headerName: "Issue Date",
      width: 130,
      sortable: true,
      valueGetter: (value) => new Date(value as string),
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      sortable: false,
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
 * ### InvoicesTable displays a table of invoices with filter and pagination controls.
 *
 * It manages pagination and filter state, fetches invoice data using the `useInvoices` hook,
 * and passes appropriate props to the filter and data grid components.
 *
 * @returns A component rendering the invoice filter controls and the invoice data grid.
 */
export function InvoicesTable(): JSX.Element {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<InvoiceFilterParams>({
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
  });
  const { data, isLoading } = useInvoices(filters);

  /**
   * ### Handles pagination changes from the DataGrid.
   *
   * Updates both pagination model and API filters (converts page to 1-based for API).
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
   * ###Handles changes to filter controls.
   *
   * Resets pagination to the first page on filter changes.
   *
   * @param newFilters The changed filter fields.
   */
  const handleFilterChange = (newFilters: Partial<InvoiceFilterParams>) => {
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
   * Resets all filters to defaults and returns to the first page.
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
      <InvoiceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      <InvoiceDataGrid
        data={data}
        isLoading={isLoading}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
      />
    </Box>
  );
}
