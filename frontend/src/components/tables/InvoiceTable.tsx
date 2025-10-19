"use client";

import { useInvoices } from "@/lib/hooks";
import { Invoice, InvoiceStatus } from "@/types/model";
import { formatCurrency, formatDate } from "@/utils";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";

const statusColorMap = {
  [InvoiceStatus.PAID]: "success",
  [InvoiceStatus.UNPAID]: "warning",
  [InvoiceStatus.OVERDUE]: "error",
} as const;

export function InvoicesTable() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useInvoices({
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
  });

  const getStatusColor = (status: InvoiceStatus) => {
    return statusColorMap[status] || "default";
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

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
      headerName: "status",
      width: 120,
      sortable: true,
      renderCell: (params) => {
        const status = params.value as InvoiceStatus;
        return (
          <Chip
            label={status.toUpperCase()}
            color={getStatusColor(status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
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
      headerName: "Descripton",
      width: 250,
      sortable: false,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={data?.items || []}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
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
