from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models.invoice import InvoiceStatus

from .common import PaginatedResponse


class InvoiceBase(BaseModel):
    """Base schema for invoice data.

    This schema defines the common attributes for creating or updating invoice records.
    """

    invoice_number: str = Field(
        ..., description="The unique identifier for the invoice."
    )
    amount: float = Field(..., gt=0, description="The monetary amount of the invoice.")
    currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
        description="The three-letter currency code (e.g., 'USD', 'ZAR').",
    )
    status: InvoiceStatus = Field(
        ...,
        description="The current status of the invoice (e.g., 'PAID', 'UNPAID', 'OVERDUE').",
    )
    due_date: datetime = Field(..., description="The date by which the invoice is due.")
    issue_date: datetime = Field(
        ..., description="The date when the invoice was issued."
    )
    customer_name: str = Field(
        ...,
        min_length=1,
        description="The name of the customer associated with the invoice.",
    )
    description: Optional[str] = Field(
        None, description="An optional detailed description of the invoice."
    )


class InvoiceResponse(InvoiceBase):
    """Schema for a complete invoice response.

    Extends `InvoiceBase` with read-only fields like ID and creation timestamp.
    """

    id: int = Field(
        ..., description="The unique identifier for the invoice record in the database."
    )
    created_at: datetime = Field(
        ..., description="The timestamp when the invoice record was created."
    )

    model_config = ConfigDict(from_attributes=True)


class InvoiceListResponse(PaginatedResponse[InvoiceResponse]):
    """Schema for a paginated list of invoice responses.

    Wraps a list of `InvoiceResponse` objects with pagination metadata.
    """

    pass


class InvoiceFilterParams(BaseModel):
    """Schema for filtering and paginating invoice records."""

    page: int = Field(
        default=1, ge=1, description="The page number for pagination (1-indexed)."
    )
    page_size: int = Field(
        default=10, ge=1, le=100, description="The number of items to return per page."
    )
    status: Optional[InvoiceStatus] = Field(
        default=None,
        description="Filter invoices by their status (e.g., 'PAID', 'UNPAID', 'OVERDUE').",
    )
    start_date: Optional[datetime] = Field(
        default=None, description="Filter invoices issued on or after this date."
    )
    end_date: Optional[datetime] = Field(
        default=None, description="Filter invoices issued on or before this date."
    )


__all__ = (
    "InvoiceBase",
    "InvoiceResponse",
    "InvoiceListResponse",
    "InvoiceFilterParams",
)
