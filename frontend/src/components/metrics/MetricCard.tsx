import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { JSX, ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  isLoading?: boolean;
}

function LoadingSkeleton(): JSX.Element {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box flex={1}>
            <Skeleton variant="text" width={"60%"} height={24} />
            <Skeleton variant="text" width={"80%"} height={32} />
            <Skeleton variant="text" width={"50%"} height={20} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  isLoading = false,
}: MetricCardProps): JSX.Element {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-1px)" },
      }}>
      <CardContent>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${color}.main`,
                color: `${color}.contrastText`,
                flexShrink: 0,
              }}>
              {icon}
            </Box>
          )}

          <Box flex={1} minWidth={0}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              component={"div"}
              fontWeight={"bold"}
              sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
