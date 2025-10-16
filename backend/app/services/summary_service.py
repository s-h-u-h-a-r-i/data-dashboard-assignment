from sqlalchemy import func
from sqlalchemy.orm import Session

from app.schemas.summary import (
    InvoicesSummary,
    MonthlyBreakdown,
    PaymentsSummary,
    SummaryMetrics,
)
from app.models.payment import Payment, PaymentStatus
from app.models.invoice import Invoice, InvoiceStatus


def calculate_payments_summary(db: Session) -> PaymentsSummary:
    """
    ### Calculates a comprehensive summary of payment data.

    This includes total payments, paid payments, pending payments,
    and a monthly breakdown of payment activity.

    Args:
        db: The database session.

    Returns:
        An object containing aggregated payment statistics.
    """
    total_query = db.query(
        func.count(Payment.id).label("item_count"),
        func.coalesce(func.sum(Payment.amount), 0).label("total"),
    ).first()

    total_count = total_query.item_count if total_query else 0
    total_amount = float(total_query.total if total_query else 0)

    paid_query = (
        db.query(
            func.count(Payment.id).label("item_count"),
            func.coalesce(func.sum(Payment.amount), 0).label("total"),
        )
        .filter(Payment.status == PaymentStatus.PAID)
        .first()
    )

    paid_count = paid_query.item_count if paid_query else 0
    paid_amount = float(paid_query.total if paid_query else 0)

    pending_query = (
        db.query(
            func.count(Payment.id).label("item_count"),
            func.coalesce(func.sum(Payment.amount), 0).label("total"),
        )
        .filter(Payment.status == PaymentStatus.PENDING)
        .first()
    )

    pending_count = pending_query.item_count if pending_query else 0
    pending_amount = float(pending_query.total if pending_query else 0)

    monthly_data = (
        db.query(
            func.strftime("%Y-%m", Payment.payment_date).label("month"),
            func.count(Payment.id).label("item_count"),
            func.sum(Payment.amount).label("total"),
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    monthly_breakdown = [
        MonthlyBreakdown(
            month=row.month,
            total_amount=float(row.total or 0),
            count=row.item_count or 0,
        )
        for row in monthly_data
    ]

    return PaymentsSummary(
        total_amount=total_amount,
        total_count=total_count,
        paid_amount=paid_amount,
        paid_count=paid_count,
        pending_amount=pending_amount,
        pending_count=pending_count,
        monthly_breakdown=monthly_breakdown,
    )


def calculate_invoices_summary(db: Session) -> InvoicesSummary:
    """
    ### Calculates a comprehensive summary of invoice data.

    This includes total invoices, paid invoices, unpaid invoices,
    overdue invoices, and a monthly breakdown of invoice activity.

    Args:
        db: The database session.

    Returns:
        An object containing aggregated invoice statistics.
    """
    total_query = db.query(
        func.count(Invoice.id).label("item_count"),
        func.coalesce(func.sum(Invoice.amount), 0).label("total"),
    ).first()

    total_count = total_query.item_count or 0
    total_amount = float(total_query.total or 0)

    paid_query = (
        db.query(
            func.count(Invoice.id).label("item_count"),
            func.coalesce(func.sum(Invoice.amount), 0).label("total"),
        )
        .filter(Invoice.status == InvoiceStatus.PAID)
        .first()
    )

    paid_count = paid_query.item_count or 0
    paid_amount = float(paid_query.total or 0)

    unpaid_query = (
        db.query(
            func.count(Invoice.id).label("item_count"),
            func.coalesce(func.sum(Invoice.amount), 0).label("total"),
        )
        .filter(Invoice.status == InvoiceStatus.UNPAID)
        .first()
    )

    unpaid_count = unpaid_query.item_count or 0
    unpaid_amount = float(unpaid_query.total or 0)

    overdue_query = (
        db.query(
            func.count(Invoice.id).label("item_count"),
            func.coalesce(func.sum(Invoice.amount), 0).label("total"),
        )
        .filter(Invoice.status == InvoiceStatus.OVERDUE)
        .first()
    )

    overdue_count = overdue_query.item_count or 0
    overdue_amount = float(overdue_query.total or 0)

    monthly_data = (
        db.query(
            func.strftime("%Y-%m", Invoice.issue_date).label("month"),
            func.count(Invoice.id).label("item_count"),
            func.sum(Invoice.amount).label("total"),
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    monthly_breakdown = [
        MonthlyBreakdown(
            month=row.month,
            total_amount=float(row.total or 0),
            count=row.item_count or 0,
        )
        for row in monthly_data
    ]

    return InvoicesSummary(
        total_amount=total_amount,
        total_count=total_count,
        paid_amount=paid_amount,
        paid_count=paid_count,
        unpaid_amount=unpaid_amount,
        unpaid_count=unpaid_count,
        overdue_amount=overdue_amount,
        overdue_count=overdue_count,
        monthly_breakdown=monthly_breakdown,
    )


def get_summary_metrics(db: Session) -> SummaryMetrics:
    """
    ### Retrieves a comprehensive summary of both payments and invoices.

    Args:
        db: The database session.

    Returns:
        An object containing the combined payments and invoices summaries.
    """
    payments_summary = calculate_payments_summary(db)
    invoices_summary = calculate_invoices_summary(db)

    return SummaryMetrics(payments=payments_summary, invoices=invoices_summary)


__all__ = (
    "calculate_payments_summary",
    "calculate_invoices_summary",
    "get_summary_metrics",
)
