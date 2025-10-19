"use client";

import { JSX, useState } from "react";

import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridPaginationModel } from "@mui/x-data-grid";

import { Payment, PaymentStatus } from "@/types/model";
import { formatCurrency, formatDateTime } from "@/utils";
import { usePayments } from "@/lib/hooks";

export function PaymentsTable(): JSX.Element {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = usePayments({
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
  });

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
        return (
          <Chip
            label={status.toUpperCase()}
            color={status === PaymentStatus.PAID ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
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

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

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
