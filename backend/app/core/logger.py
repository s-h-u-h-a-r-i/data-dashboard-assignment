import threading
from dataclasses import dataclass, field
from enum import StrEnum, auto
from collections import deque
from datetime import datetime, timezone
from typing import (
    Any,
    ClassVar,
    Dict,
    List,
    Literal,
    Optional,
    Self,
    Type,
    Union,
    assert_never,
)

from fastapi import status


class LogEntryType(StrEnum):
    """Enumeration of log entry types supported by the logger"""

    REQUEST = auto()
    """HTTP request/response log entries"""
    AI_INTERACTION = auto()
    """AI model interaction log entries"""
    ERROR = auto()
    """Error and exception log entries"""


@dataclass(frozen=True)
class BaseLogEntry:
    """
    ### Base class for all log entries with automatic timestamp generation.

    This is an immutable dataclass that automatically captures the UTC timestamp
    when a log entry is created.
    """

    timestamp: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc), init=False
    )
    """UTC datetime when the log entry was created"""


@dataclass(frozen=True)
class RequestLogEntry(BaseLogEntry):
    """
    ### Log entry for HTTP request/response information

    Captures details about API requests including endpoint, method, parameters,
    response status, duration, and any errors that occurred.
    """

    endpoint: str
    """The API endpoint path that was called"""
    method: str
    """HTTP method (GET, POST, PUT, DELETE, etc.)"""
    parameters: Dict[str, Any]
    """Dictionary of query parameters or request body data"""
    status_code: int
    """HTTP response status code"""
    duration_ms: Optional[float]
    """Request processing time in milliseconds (if available)"""
    error: Optional[str]
    """Error message if the request failed (if applicable)"""
    type: Literal[LogEntryType.REQUEST] = field(
        default=LogEntryType.REQUEST, init=False
    )
    """Log entry type, automatically set to REQUEST"""


@dataclass(frozen=True)
class AIInteractionLogEntry(BaseLogEntry):
    """
    ### Log entry for AI model interactions.

    Captures details abotu queries sent to AI models and their repsonses.,
    including token usage and performance metrics.
    """

    query: str
    """The input query or prompt sent to the AI model"""
    response: str
    """The AI model's reponse"""
    model: str
    """Name or identifier of the AI model used"""
    token_usage: Dict[str, int]
    """Dictionary containing token usage statistics (e.g., prompt_tokens, completion_tokens)"""
    duration_ms: Optional[float]
    """AI interaction duration in milliseconds (if available)"""
    error: Optional[str]
    """Error message if the interaction failed (if applicable)"""
    type: Literal[LogEntryType.AI_INTERACTION] = field(
        default=LogEntryType.AI_INTERACTION, init=False
    )
    """Log entry type, automatically set to AI_INTERACTION"""


@dataclass(frozen=True)
class ErrorLogEntry(BaseLogEntry):
    """
    ### Log entry for errors and exceptions.

    Catptures detailed information about errors that occur during API operations.
    including the error type, message, and full traceback for debugging.
    """

    endpoint: str
    """The API endpoint where the error occurred"""
    error_message: str
    """Human-readable error message"""
    error_type: str
    """The type or class name of the error"""
    traceback: Optional[str]
    """Full stack trace of the error (if available)"""
    type: Literal[LogEntryType.ERROR] = field(default=LogEntryType.ERROR, init=False)
    """Log entry type, automatically seto set to ERROR"""


@dataclass(frozen=True)
class LoggerStats:
    """
    ### Statistics about the current state of the logger.

    Provides aggregate information aobut the number and types of logs
    currently stored in the logger.
    """

    total_logs: int
    """Total number of log entries"""
    request_logs: int
    """Number of REQUEST type log enties"""
    ai_interaction_logs: int
    """Number of AI_INTERACTION type log enties"""
    error_logs: int
    """Number of ERROR type log enties"""


LogEntry = Union[RequestLogEntry, AIInteractionLogEntry, ErrorLogEntry]
"""Type alias for any valid log entry type."""


class InMemoryLogger:
    """
    ### Thread-safe singleton logger that stores log entries in memory.

    This logger maintains a circular buffer of log entries with a configurable
    maximum size. When the buffer is full, the oldest entries are automatically
    discarded. All operations are thread-safe using a lock.

    The logger uses a static class pattern where all methods are class methods
    that operate on shared class-level storage. The class cannot be instantiated
    directly - all methods should be called on the class itself.

    Attributes:
        _logs: Thread-safe deque storeing log entries (max 1000 entries)
        _lock: Thread lock for synchronization

    Example:
        >>> InMemoryLogger.log_request(
        ...     "/api/invoices",
        ...     method="GET",
        ...     parameters={"limit": 10},
        ...     status_code=200,
        ...     duration_ms=45.3
        ... )
        >>> logs = InMemoryLogger.get_logs(limit=20)
        >>> stats = InMemoryLogger.get_stats()
    """

    _logs: ClassVar[deque[LogEntry]] = deque(maxlen=1000)
    _lock: ClassVar[threading.Lock] = threading.Lock()

    def __new__(cls) -> Self:
        raise TypeError("This class should not be instantiated directly.")

    @classmethod
    def log_request(
        cls,
        endpoint: str,
        *,
        method: str,
        parameters: Optional[Dict[str, Any]] = None,
        status_code: int = status.HTTP_200_OK,
        duration_ms: Optional[float] = None,
        error: Optional[str] = None,
    ) -> None:
        """
        ### Log an HTTP request/response.

        Creates and stores a RequestLogEntry with the provided information.
        This method is thread-safe.

        Args:
            endpoint: The API endpoint path (e.g., "/api/invoices")
            method: HTTP method (e.g., "GET", "POST")
            parameters: Optional dictionary of request paramters or body data
            status_code: HTTP response status code (default: status.HTTP_200_OK)
            duration_ms: Optional request processing time in milliseconds
            error: Optional error message if the requets failed
        """
        log_entry = RequestLogEntry(
            endpoint=endpoint,
            method=method,
            parameters=parameters or {},
            status_code=status_code,
            duration_ms=duration_ms,
            error=error,
        )

        with cls._lock:
            cls._logs.append(log_entry)

    @classmethod
    def log_ai_interaction(
        cls,
        *,
        query: str,
        response: str,
        model: str,
        token_usage: Optional[Dict[str, int]] = None,
        duration_ms: Optional[float] = None,
        error: Optional[str] = None,
    ) -> None:
        """
        ### Log an AI model interaction.

        Creates and stores an AIInteractionLogEntry with the provided information.
        This method is thread-safe.

        Args:
            query: The input query or prompt sent to the AI
            response: The AI model's reponse text
            model: Name or identifier of the AI model (e.g., "gpt-5", "claude-4-sonnet")
            token_usage: Optional dictionary with token usage stats
                (e.g., {"prompt_tokens"}: 100, "completion_tokens": 50)
            duration_ms: Optional interaction duration in milliseconds
            error: Optional error message if the interaction failed
        """
        log_entry = AIInteractionLogEntry(
            query=query,
            response=response,
            model=model,
            token_usage=token_usage or {},
            duration_ms=duration_ms,
            error=error,
        )

        with cls._lock:
            cls._logs.append(log_entry)

    @classmethod
    def log_error(
        cls,
        endpoint: str,
        *,
        error_message: str,
        error_type: str,
        traceback: Optional[str] = None,
    ) -> None:
        """
        ### Log an error or exception

        Creates and stores an ErrorLogEntry with the provided information.
        This method is thread-safe.

        Args:
            endpoint: The API endpoint where the error occurred
            error_message: Human-readable error message
            error_type: The error class or type name (e.g., "ValueError", "HTTPException")
            traceback: Optional full stack trace for debugging
        """
        log_entry = ErrorLogEntry(
            endpoint=endpoint,
            error_message=error_message,
            error_type=error_type,
            traceback=traceback,
        )

        with cls._lock:
            cls._logs.append(log_entry)

    @classmethod
    def get_logs(
        cls, limit: int = 50, log_type: Optional[LogEntryType] = None
    ) -> List[LogEntry]:
        """
        ### Retrieve log entries with optional filtering.

        Returns the most recent log entries, optionally filtered by type.
        Logs are returned in reverse chronological order (newest first).
        This method is thread-safe.

        Args:
            limit: Maximum number of log entries to return (default: 50)
            log_type: Optional filter to only include logs of a specific type

        Returns:
            List of log entries, sorted by timestamp (newest first), limited to the
            specified count
        """
        with cls._lock:
            logs = list(cls._logs)

        if log_type:
            logs = [log for log in logs if log.type == log_type]

        logs.sort(key=lambda x: x.timestamp, reverse=True)
        return logs[:limit]

    @classmethod
    def get_stats(cls) -> LoggerStats:
        """
        ### Calculate and return statistics about stored logs.

        Analyzes all stored log entries and returns aggregate statistics
        about the total number of logs and breakdown by type.
        This method is thread-safe

        Returns:
            LoggerStats object containing counts of total logs and logs by type
        """
        with cls._lock:
            logs = list(cls._logs)

        total_logs = len(logs)
        request_logs = 0
        ai_logs = 0
        error_logs = 0
        for log in logs:
            match log.type:
                case LogEntryType.REQUEST:
                    request_logs += 1
                case LogEntryType.AI_INTERACTION:
                    ai_logs += 1
                case LogEntryType.ERROR:
                    error_logs += 1
                case _:
                    assert_never(log.type)

        return LoggerStats(
            total_logs=total_logs,
            request_logs=request_logs,
            ai_interaction_logs=ai_logs,
            error_logs=error_logs,
        )

    @classmethod
    def clear(cls) -> None:
        """
        ### Clear all stored log entries.

        Removes all log entries from the buffer. This operation is thread-safe.
        Useful for testing or when starting fresh log collection.
        """
        with cls._lock:
            cls._logs.clear()


memory_logger: Type[InMemoryLogger] = InMemoryLogger


__all__ = (
    "InMemoryLogger",
    "memory_logger",
    "LogEntryType",
    "LoggerStats",
    "LogEntry",
    "RequestLogEntry",
    "AIInteractionLogEntry",
    "ErrorLogEntry",
)
