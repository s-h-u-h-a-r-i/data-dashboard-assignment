from datetime import datetime
from typing import Annotated, Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LogEntry(BaseModel):
    timestamp: Annotated[datetime, Field(..., description="Log entry timestamp")]
    endpoint: Annotated[str, Field(..., description="API endpoint path")]
    method: Annotated[str, Field(..., description="HTTP method")]
    parameters: Annotated[
        Optional[Dict[str, Any]], Field(description="Request paramters")
    ]
    status_code: Annotated[
        int, Field(..., ge=100, le=599, description="HTTP status code")
    ]
    error: Annotated[
        Optional[str],
        Field(default=None, description="Error message if request failed"),
    ]
    duration_ms: Annotated[
        Optional[float],
        Field(default=None, ge=0, description="Request duration in milliseconds"),
    ]


class LogsResponse(BaseModel):
    logs: Annotated[List[LogEntry], Field(..., description="List of log entries")]
    total_count: Annotated[int, Field(..., ge=0, description="Total number of logs")]


__all__ = ("LogEntry", "LogsResponse")
