from datetime import datetime
from math import ceil
from typing import Optional

from sqlalchemy.orm import Session

from app.schemas.payment import PaymentListResponse, PaymentResponse
from app.models.payment import Payment, PaymentStatus
from app.schemas.common import PaginationMetadata


def get_payments(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    status: Optional[PaymentStatus] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> PaymentListResponse:
    """
    ### Retrieve a paginated list of payments with optional filtering.

    Fetches payments from the database with support for pagination and filtering
    by payment status and date range. Results are ordered by payment date in
    descending order (most recent first).

    Args:
        db: SQLAlchemy database session for querying payments
        page: Page number for pagination (1-indexed, minimum 1)
        page_size: Number of payments per page (minimum 1, maximum 100)
        status: Optional payment status filter (pending, completed, failed, etc.)
        start_date: Optional start date filter (inclusive) for payment date range
        end_date: Optional end date filter (inclusive) for payment date range

    Returns:
        - List of PaymentResponse objects with payment details
        - PaginationMetadata with pagination information (page, page_size,
            total_items, total_pages)

    Raises:
        SQLAlchemyError: If database query fails
        ValidationError: If payment data validation fails during response creation

    Example:
        >>> payments = get_payments(db, page=1, page_size=20, status=PaymentStatus.COMPLETED)
        >>> print(f"Found {payments.pagination.total_items} completed payments")
    """
    query = db.query(Payment)

    if status is not None:
        query = query.filter(Payment.status == status)

    if start_date is not None:
        query = query.filter(Payment.payment_date >= start_date)

    if end_date is not None:
        query = query.filter(Payment.payment_date <= end_date)

    total_items = query.count()
    total_pages = ceil(total_items / page_size) if total_items > 0 else 0

    offset = (page - 1) * page_size
    payments = (
        query.order_by(Payment.payment_date.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    payment_responses = [
        PaymentResponse.model_validate(payment) for payment in payments
    ]

    pagination = PaginationMetadata(
        page=page, page_size=page_size, total_items=total_items, total_pages=total_pages
    )

    return PaymentListResponse(items=payment_responses, pagination=pagination)


__all__ = ("get_payments",)
