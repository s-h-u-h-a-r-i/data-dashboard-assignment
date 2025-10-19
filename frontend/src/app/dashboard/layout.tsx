import { ReactNode } from "react";

import { Box, Typography } from "@mui/material";

import { Section } from "@/components/Section";
import { AgentLogs } from "@/components/logs";

function DashboardHeader() {
  return (
    <Box
      sx={{
        flexShrink: 0,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        py: 1,
        px: 3,
        boxShadow: "0px 4px 8px -2px rgba(0,0,0,0.08)",
      }}>
      <Typography variant="h4" component={"h1"}>
        Financial Dashbaord
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Overview of payments, invoices, and financial metrics
      </Typography>
    </Box>
  );
}

function MainContent({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        px: 3,
        py: 3,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}>
      {children}
    </Box>
  );
}

function DashboardSidebar() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: 400,
        flexShrink: 0,
        borderLeft: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}>
      <Section
        title="AI Assistant"
        subtitle="Ask questions about your data"
        minHeight={"calc(100vh - 280px)"}
        elevation={0}
        stickyHeader>
        <Typography>Chat interface will go here</Typography>
      </Section>
    </Box>
  );
}

function LogsPanel() {
  return (
    <Box
      sx={{
        flexShrink: 0,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "Background.default",
        maxHeight: "300px",
        overflow: "auto",
        px: 3,
        py: 2,
      }}>
      <AgentLogs />
    </Box>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
      }}>
      <DashboardHeader />

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}>
          <MainContent>{children}</MainContent>
          <DashboardSidebar />
        </Box>

        <LogsPanel />
      </Box>
    </Box>
  );
}
