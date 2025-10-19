"use client";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { JSX, ReactNode } from "react";

/**
 * Props for the Section component.
 *
 * @interface SectionProps
 */
export interface SectionProps {
  /**
   * Optional title displayed in the card header
   */
  title?: string;
  /**
   * Optional subtitle displayed below the title
   */
  subtitle?: string;
  /**
   * Optional action element (e.g., button) displayed in the header
   */
  action?: ReactNode;
  /**
   * Minimum height for the content area (CSS value)
   */
  minHeight?: string | number;
  /**
   * Material-UI elevation level for the card shadow (0-24)
   * @default 1
   */
  elevation?: number;
  /**
   * Content to be displayed in the section body
   */
  children: ReactNode;
  /**
   * Whether the section is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Error object to display if data loading failed
   * @default null
   */
  error?: Error | null;
  /**
   * Whether to show skeleton loading (true) or spinner (false) when loading
   * @default true
   */
  showSkeleton?: boolean;
  /**
   * Number of skeleton lines to display when showSkeleton is true
   * @default 3
   */
  skeletonLines?: number;
  /**
   * Whether the card header should be sticky (remains visible at the top while scrolling)
   * @default false
   */
  stickyHeader?: boolean;
}

/**
 * Props for the SectionContent component.
 * Extracted subset of SectionProps for internal content rendering logic.
 */
type SectionContentProps = Pick<
  SectionProps,
  | "isLoading"
  | "showSkeleton"
  | "skeletonLines"
  | "error"
  | "minHeight"
  | "children"
>;

/**
 * Props for the SectionHeader component.
 * Extracted subset of SectionProps for header rendering.
 */
type SectionHeaderProps = Pick<
  SectionProps,
  "title" | "subtitle" | "action" | "stickyHeader"
>;

/**
 * Props for the ErrorAlert component.
 *
 */
interface ErrorAlertProps {
  /** Error object containing message to display */
  error: Error;
}

/**
 * Props for the LoadingSkeleton component.
 */
interface LoadingSkeletonProps {
  /** Number of skeleton placeholder lines to render */
  lines: number;
}

/**
 * Props for the LoadingSpinner component.
 * Extracted subset of SectionProps for spinner rendering.
 */
type LoadingSpinnerProps = Pick<SectionProps, "minHeight">;

/**
 * ### Renders the header section of a card with optional title, subtitle, and action.
 *
 * Returns null if neither title nor action is provided.
 *
 * @param param0 The header properties
 * @returns The rendered header or null if no content
 */
function SectionHeader({
  title,
  subtitle,
  action,
  stickyHeader,
}: SectionHeaderProps): JSX.Element | null {
  if (!title && !action) return null;

  return (
    <Box
      sx={
        stickyHeader
          ? {
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
            }
          : undefined
      }>
      <CardHeader
        title={title ? <Typography variant="h6">{title}</Typography> : null}
        subheader={subtitle}
        action={action}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pb: 1.5,
        }}
      />
    </Box>
  );
}

/**
 * ### Renders an error alert with the error message.
 *
 * Displays a generic "Failed to load data" message with the specific error details.
 *
 * @param param0 Props continaing the error object
 * @returns The rendered error alert
 */
function ErrorAlert({ error }: ErrorAlertProps): JSX.Element {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <Typography variant="body2" fontWeight={"medium"}>
        Failed to load data
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {error.message || "An unexpected error occurred"}
      </Typography>
    </Alert>
  );
}

/**
 * ### Renders animated skeleton loading placeholders.
 *
 * Used to show content placeholder while data is being fetched.
 *
 * @param param0 Props containing number of lines to render
 * @returns The rendered skeleton placeholders
 */
function LoadingSkeleton({ lines }: LoadingSkeletonProps): JSX.Element {
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={40}
          sx={{ mb: 1, borderRadius: 1 }}
          animation="wave"
        />
      ))}
    </Box>
  );
}

/**
 * ### Renders a centered circular loading spinner.
 *
 * Used as an alternative to skeleton loading for simple loading states.
 *
 * @param param0 Props containing the minimum height configuration
 * @returns The rendered loading spinner
 */
function LoadingSpinner({ minHeight }: LoadingSpinnerProps): JSX.Element {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={minHeight || 200}>
      <CircularProgress />
    </Box>
  );
}

/**
 * ### Manages content rendering based on loading and error states.
 *
 * Determines whether to show loading indicators, error messages, or actual content.
 *
 * **State priority**:
 * 1. Loading state (shows skeleton or spinner)
 * 2. Error state (shows error alert followed by children)
 * 3. Normal state (shows children)
 *
 * @param param0 Props containing state and content
 * @returns The rendered content based on current state
 */
function SectionContent({
  isLoading,
  showSkeleton,
  skeletonLines,
  error,
  minHeight,
  children,
}: SectionContentProps): JSX.Element {
  if (isLoading) {
    if (showSkeleton) {
      return <LoadingSkeleton lines={skeletonLines || 3} />;
    }
    return <LoadingSpinner minHeight={minHeight} />;
  }

  if (error) {
    return (
      <>
        <ErrorAlert error={error} />
        {children}
      </>
    );
  }

  return <>{children}</>;
}

/**
 * ### Section Component - A reusable card container with built-in state management.
 *
 * **This component provides a consistent pattern for displaying dashboard sections with**:
 * - Optional ehader with title, subtitle, and action buttons
 * - Automatic laoding state handling (skeleton or spinner)
 * - Built-in error display
 * - Consistent card styling with configurable elevation
 *
 * @param param0 The section component properties
 * @returns The rendered section card
 *
 * @example
 * ```tsx
 * <Section
 *   title="Sales Data"
 *   subtitle="Last 30 days"
 *   isLoading={isLoading}
 *   error={error}
 *   action={<Button>Refresh</Button>}>
 *   <YourContent />
 * </Section>
 * ```
 */
export function Section({
  title,
  subtitle,
  action,
  minHeight,
  elevation = 1,
  children,
  isLoading = false,
  error = null,
  showSkeleton = true,
  skeletonLines = 3,
  stickyHeader = false,
}: SectionProps): JSX.Element {
  return (
    <Card
      elevation={elevation}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={action}
        stickyHeader={stickyHeader}
      />

      <CardContent
        sx={{
          flex: 1,
          minHeight: minHeight,
          position: "relative",
          overflow: stickyHeader ? "auto" : "visible",
          "&:last-child": {
            pb: 2,
          },
        }}>
        <SectionContent
          isLoading={isLoading}
          showSkeleton={showSkeleton}
          skeletonLines={skeletonLines}
          error={error}
          minHeight={minHeight}>
          {children}
        </SectionContent>
      </CardContent>
    </Card>
  );
}
