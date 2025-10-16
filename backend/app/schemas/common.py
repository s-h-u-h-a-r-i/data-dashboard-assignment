from typing import List
from pydantic import BaseModel, Field


class PaginationMetadata(BaseModel):
    """Metadata for paginated responses."""

    page: int = Field(..., ge=1, description="Current page number")
    """Current page number (1-indexed)"""
    page_size: int = Field(..., ge=1, le=100, description="Items per page")
    """Number of items per page"""
    total_items: int = Field(..., ge=0, description="Total number of items")
    """Total number of items across all pages"""
    total_pages: int = Field(..., ge=0, description="Total number of pages")
    """Total number of pages"""


class PaginatedResponse[T](BaseModel):
    """Generic paginated reponse wrapper."""

    items: List[T] = Field(..., description="List of items")
    """List of items for the current page"""
    pagination: PaginationMetadata = Field(..., description="Pagination metadata")
    """Pagination metadata"""


__all__ = ("PaginationMetadata", "PaginatedResponse")
