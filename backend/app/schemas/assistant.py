from datetime import datetime
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class AssistantRequest(BaseModel):
    """
    ### Represents a request to the AI assistant.

    This model defines the structure for incoming requests, typically containing
    the user's query and optional additional context.
    """

    query: str = Field(
        ..., min_length=1, max_length=1000, description="User's question or request"
    )
    context: Optional[Dict[str, Any]] = Field(
        None, description="Additional context for the query"
    )


class AssistantResponse(BaseModel):
    """
    ### Represents a response from the AI assistant.

    This model defines the structure for outgoing responses, including the AI-generated
    text, the original query, metadata like timestamp and model used, and token usage.
    """

    response: str = Field(..., description="AI-generated response")
    query: str = Field(..., description="Original user query")
    timestamp: datetime = Field(
        default_factory=datetime.now, description="Response timestamp"
    )
    model: str = Field(..., description="AI model used")
    token_usage: Optional[Dict[str, int]] = Field(
        default=None, description="Token usage statistics"
    )


__all__ = ("AssistantRequest", "AssistantResponse")
