from typing import Annotated, Optional
from fastapi import APIRouter, Query

from app.schemas.logs import LogsResponse
from app.core.logger import LogEntryType, LoggerStats, memory_logger
from app.services.logs_service import get_formatted_logs

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
    return get_formatted_logs(limit=limit, log_type=log_type)


@router.get(
    "/stats",
    summary="Retrieve logger statistics",
    description="Fetches aggregate statistics about the in-memory logger, including total log entries and counts by type (requests, AI interactions, errors).",
)
async def get_log_stats() -> LoggerStats:
    return memory_logger.get_stats()


__all__ = ("router",)
