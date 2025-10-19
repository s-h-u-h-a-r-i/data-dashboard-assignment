"use client";

import { JSX } from "react";
import { useAgentLogs } from "@/lib/hooks";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AgentLog } from "@/types/model";
import { formatDateTime } from "@/utils";

function getStatusColor(statusCode: number) {
  if (statusCode >= 200 && statusCode < 300) return "success";
  if (statusCode >= 400 && statusCode < 500) return "warning";
  if (statusCode >= 500) return "error";
  return "default";
}

function formatDuration(durationMs: number | null) {
  if (!durationMs) return "N/A";
  return `${durationMs.toFixed(0)}ms`;
}

export function AgentLogs(): JSX.Element {
  const { data, isLoading, error } = useAgentLogs({ limit: 50 });

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">Loading logs...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Error loading logs: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!data || data.logs.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">No logs available</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Endpoint</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Error</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.logs.map((log: AgentLog, index: number) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}>
              <TableCell>
                <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                  {formatDateTime(new Date(log.timestamp))}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={log.method} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {log.endpoint}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={log.status_code}
                  size="small"
                  color={getStatusColor(log.status_code)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="caption">
                  {formatDuration(log.duration_ms)}
                </Typography>
              </TableCell>
              <TableCell>
                {log.error ? (
                  <Typography variant="caption" color="error">
                    {log.error}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
