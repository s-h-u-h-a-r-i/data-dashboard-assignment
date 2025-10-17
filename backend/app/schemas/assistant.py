from datetime import datetime, timezone
from typing import Optional, Dict, Any, Annotated

from pydantic import BaseModel, Field


class AssistantRequest(BaseModel):
    """
    ### Represents a request to the AI assistant.

    This model defines the structure for incoming requests, typically containing
    the user's query and optional additional context.
    """

    query: Annotated[
        str,
        Field(
            ..., min_length=1, max_length=1000, description="User's question or request"
        ),
    ]
    context: Annotated[
        Optional[Dict[str, Any]],
        Field(None, description="Additional context for the query"),
    ]


class AssistantResponse(BaseModel):
    """
    ### Represents a response from the AI assistant.

    This model defines the structure for outgoing responses, including the AI-generated
    text, the original query, metadata like timestamp and model used, and token usage.
    """

    response: Annotated[str, Field(..., description="AI-generated response")]
    query: Annotated[str, Field(..., description="Original user query")]
    timestamp: Annotated[
        datetime,
        Field(
            default_factory=lambda: datetime.now(timezone.utc),
            description="Response timestamp",
        ),
    ]
    model: Annotated[str, Field(..., description="AI model used")]
    token_usage: Annotated[
        Optional[Dict[str, int]],
        Field(default=None, description="Token usage statistics"),
    ]


__all__ = ("AssistantRequest", "AssistantResponse")
