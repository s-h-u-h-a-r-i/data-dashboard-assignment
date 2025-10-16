from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models.payment import PaymentStatus

from .common import PaginatedResponse


class PaymentBase(BaseModel):
    """Base schema for payment data.

    This schema defines the common attributes for creating or updating payment records.
    """

    transaction_id: str = Field(
        ..., description="Unique transaction identifier for the payment."
    )
    amount: float = Field(..., gt=0, description="The monetary amount of the payment.")
    currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
        description="The three-letter currency code (e.g., 'USD', 'ZAR').",
    )
    status: PaymentStatus = Field(
        ...,
        description="The current status of the payment (e.g., 'PENDING', 'COMPLETED').",
    )
    customer_name: str = Field(
        ...,
        min_length=1,
        description="The name of the customer associated with the payment.",
    )
    description: Optional[str] = Field(
        None, description="An optional detailed description of the payment."
    )


class PaymentResponse(PaymentBase):
    """Schema for a complete payment response.

    Extends `PaymentBase` with read-only fields like ID and creation timestamp.
    """

    id: int = Field(
        ..., description="The unique identifier for the payment record in the database."
    )
    created_at: datetime = Field(
        ..., description="The timestamp when the payment record was created."
    )

    model_config = ConfigDict(from_attributes=True)


class PaymentListResponse(PaginatedResponse[PaymentResponse]):
    """Schema for a paginated list of payment responses.

    Wraps a list of `PaymentResponse` objects with pagination metadata.
    """

    pass


class PaymentFilterParams(BaseModel):
    """Schema for filtering and paginating payment records."""

    page: int = Field(
        default=1, ge=1, description="The page number for pagination (1-indexed)."
    )
    page_size: int = Field(
        default=10, ge=1, le=100, description="The number of items to return per page."
    )
    status: Optional[PaymentStatus] = Field(
        default=None,
        description="Filter payments by their status (e.g., 'PENDING', 'COMPLETED').",
    )
    start_date: Optional[datetime] = Field(
        default=None, description="Filter payments created on or after this date."
    )
    end_date: Optional[datetime] = Field(
        default=None, description="Filter payments created on or before this date."
    )


__all__ = (
    "PaymentBase",
    "PaymentResponse",
    "PaymentListResponse",
    "PaymentFilterParams",
)
