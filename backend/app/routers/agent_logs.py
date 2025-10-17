from typing import Annotated, Any, Dict, Optional
from fastapi import APIRouter, Query, status

from app.schemas.logs import LogsResponse, LogEntry
from app.core.logger import LogEntryType, LoggerStats, memory_logger

router = APIRouter(prefix="/agent-logs", tags=["logs"])


@router.get(
    "",
    response_model=LogsResponse,
    summary="Retrieve recent activity logs",
    description="Fetches a paginated list of recent activity logs, including agent requests, AI assistant queries, and errors. Allows filtering by log type.",
)
async def get_agent_logs(
    limit: Annotated[int, Query(ge=1, le=500)] = 50,
    log_type: Annotated[Optional[LogEntryType], Query()] = None,
) -> LogsResponse:
    logs = memory_logger.get_logs(limit=limit, log_type=log_type)

    log_entries = []
    for log in logs:
        parameters: Optional[Dict[str, Any]] = None
        if log.type == LogEntryType.AI_INTERACTION:
            parameters = {"query": log.query}
        elif log.type == LogEntryType.REQUEST:
            parameters = log.parameters

        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        if log.type == LogEntryType.REQUEST:
            status_code = log.status_code
        elif log.type == LogEntryType.AI_INTERACTION and not log.error:
            status_code = status.HTTP_200_OK

        log_entries.append(
            LogEntry(
                timestamp=log.timestamp,
                endpoint=(
                    "" if log.type == LogEntryType.AI_INTERACTION else log.endpoint
                ),
                method=log.method if log.type == LogEntryType.REQUEST else "",
                parameters=parameters,
                status_code=status_code,
                error=log.error_type if log.type == LogEntryType.ERROR else log.error,
                duration_ms=None if log.type == LogEntryType.ERROR else log.duration_ms,
            )
        )

    return LogsResponse(logs=log_entries, total_count=len(log_entries))


@router.get(
    "/stats",
    summary="Retrieve logger statistics",
    description="Fetches aggregate statistics about the in-memory logger, including total log entries and counts by type (requests, AI interactions, errors).",
)
async def get_log_stats() -> LoggerStats:
    return memory_logger.get_stats()


__all__ = ("router",)
