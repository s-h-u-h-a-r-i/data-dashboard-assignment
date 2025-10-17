from typing import List
from pydantic import BaseModel, Field


from typing import Annotated, List
from pydantic import BaseModel, Field


class MonthlyBreakdown(BaseModel):
    """
    Represents a breakdown of financial metrics for a specific month.
    """

    month: Annotated[
        str, Field(..., pattern=r"^\d{4}-\d{2}$", description="Month in YYYY-MM format")
    ]
    total_amount: Annotated[
        float, Field(..., ge=0, description="Total amount for the month")
    ]
    count: Annotated[int, Field(..., ge=0, description="Number of items")]


class PaymentsSummary(BaseModel):
    """
    Provides a summary of payment statistics, including total, paid, and pending amounts and counts.
    """

    total_amount: Annotated[float, Field(..., ge=0, description="Total payment amount")]
    total_count: Annotated[int, Field(..., ge=0, description="Total payment count")]
    paid_amount: Annotated[float, Field(..., ge=0, description="Total paid amount")]
    paid_count: Annotated[int, Field(..., ge=0, description="Number of paid payments")]
    pending_amount: Annotated[
        float, Field(..., ge=0, description="Total pending amount")
    ]
    pending_count: Annotated[
        int, Field(..., ge=0, description="Number of pending payments")
    ]
    monthly_breakdown: Annotated[
        List[MonthlyBreakdown],
        Field(default_factory=list, description="Monthly breakdown of payments"),
    ]


class InvoicesSummary(BaseModel):
    """
    Provides a summary of invoice statistics, including total, paid, unpaid, and overdue amounts and counts.
    """

    total_amount: Annotated[float, Field(..., ge=0, description="Total invoice amount")]
    total_count: Annotated[int, Field(..., ge=0, description="Total invoice count")]
    paid_amount: Annotated[float, Field(..., ge=0, description="Total paid amount")]
    paid_count: Annotated[int, Field(..., ge=0, description="Number of paid invoices")]
    unpaid_amount: Annotated[float, Field(..., ge=0, description="Total unpaid amount")]
    unpaid_count: Annotated[
        int, Field(..., ge=0, description="Number of unpaid invoices")
    ]
    overdue_amount: Annotated[
        float, Field(..., ge=0, description="Total overdue amount")
    ]
    overdue_count: Annotated[
        int, Field(..., ge=0, description="Number of overdue invoices")
    ]
    monthly_breakdown: Annotated[
        List[MonthlyBreakdown],
        Field(default_factory=list, description="Monthly breakdown of invoices"),
    ]


class SummaryMetrics(BaseModel):
    """
    Aggregates summary statistics for both payments and invoices.
    """

    payments: Annotated[PaymentsSummary, Field(..., description="Payment statistics")]
    invoices: Annotated[InvoicesSummary, Field(..., description="Invoice statistics")]


__all__ = ("MonthlyBreakdown", "PaymentsSummary", "InvoicesSummary", "SummaryMetrics")
