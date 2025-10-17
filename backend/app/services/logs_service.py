from typing import Optional, assert_never

from fastapi import status
from app.core.logger import (
    AIInteractionLogEntry,
    ErrorLogEntry,
    LogEntryType,
    RequestLogEntry,
    LogEntry as CoreLogEntry,
    memory_logger,
)
from app.schemas.logs import LogEntry, LogsResponse


def format_log_entry(log: CoreLogEntry) -> LogEntry:
    """
    ### Convert a core log entry to a standardized log entry format.

    This function transforms log entries from the core logger format into a
    standardized schema format suitable for API responses. It handles different
    log entry types (request, AI interaction, and error) by mapping their
    specific fields to the common LogEntry schema.

    The function uses pattern matching to handle each log entry type appropriately:
    - RequestLogEntry: Maps directly to LogEntry with all original fields
    - AIInteractionLogEntry: Maps to LogEntry with standardized endpoint and method
    - ErrorLogEntry: Maps to LogEntry with error-specific formatting

    Args:
        log: The core log entry to convert, which can be any of the supported
            log entry types

    Returns:
        A standardized log entry object with consistent field structure
        suitable for API responses

    Raises:
        AssertionError: If an unexpected log entry type is encountered (should never happen
            due to type checking, but included for safety)

    Example:
        >>> request_log = RequestLogEntry(
        ...     endpoint="/api/invoices",
        ...     method="GET",
        ...     parameters={"limit": 10},
        ...     status_code=200,
        ...     duration_ms=45.3
        ... )
        >>> formatted = format_log_entry(request_log)
        >>> print(formatted.endpoint)  # "/api/invoices"
    """
    match log:
        case RequestLogEntry():
            return LogEntry(
                timestamp=log.timestamp,
                endpoint=log.endpoint,
                method=log.method,
                parameters=log.parameters if log.parameters else None,
                status_code=log.status_code,
                error=log.error,
                duration_ms=log.duration_ms,
            )
        case AIInteractionLogEntry():
            return LogEntry(
                timestamp=log.timestamp,
                endpoint="/api/ai-assistant",
                method="POST",
                parameters={"query": log.query},
                status_code=(
                    status.HTTP_200_OK
                    if not log.error
                    else status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                error=log.error,
                duration_ms=log.duration_ms,
            )
        case ErrorLogEntry():
            return LogEntry(
                timestamp=log.timestamp,
                endpoint=log.endpoint,
                method="UNKNOWN",
                parameters=None,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                error=f"{log.error_type}: {log.error_message}",
                duration_ms=None,
            )
        case _:
            assert_never(log)


def get_formatted_logs(
    limit: int = 50, log_type: Optional[LogEntryType] = None
) -> LogsResponse:
    """
    ### Retrieve and format application logs for API consumption.

    Args:
        limit: Maximum number of log entries to retrieve (default: 50)
        log_type: Optional filter by log entry type

    Returns:
        LogsResponse: Formatted logs with total count
    """
    logs = memory_logger.get_logs(limit=limit, log_type=log_type)

    formatted_logs = [format_log_entry(log) for log in logs]

    return LogsResponse(logs=formatted_logs, total_count=len(formatted_logs))


__all__ = ("format_log_entry", "get_formatted_logs")
