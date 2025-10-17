from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LogEntry(BaseModel):
    timestamp: datetime = Field(..., description="Log entry timestamp")
    endpoint: str = Field(..., description="API endpoint path")
    method: str = Field(..., description="HTTP method")
    parameters: Optional[Dict[str, Any]] = Field(
        default=None, description="Request paramters"
    )
    status_code: int = Field(..., ge=100, le=599, description="HTTP status code")
    error: Optional[str] = Field(
        default=None, description="Error message if request failed"
    )
    duration_ms: Optional[float] = Field(
        default=None, ge=0, description="Request duration in milliseconds"
    )


class LogsResponse(BaseModel):
    logs: List[LogEntry] = Field(..., description="List of log entries")
    total_count: int = Field(..., ge=0, description="Total number of logs")


__all__ = ("LogEntry", "LogsResponse")
