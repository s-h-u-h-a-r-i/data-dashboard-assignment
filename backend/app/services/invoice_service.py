from datetime import datetime
from math import ceil
from typing import Optional

from sqlalchemy.orm import Session

from app.schemas.invoice import InvoiceListResponse, InvoiceResponse
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.common import PaginationMetadata


def get_invoices(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    status: Optional[InvoiceStatus] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> InvoiceListResponse:
    """
    ### Retrieve a paginated list of invoices with optional filtering.

    This function queries the database for invoices and applies optional filters
    based on status and date range. Results are paginated and ordered by issue
    date in descending order (most recent first).

    Args:
        db: SQLAlchemy database session for executing queries.
        page: Page number for pagination. Defaults to 1.
        page_size: Number of items per page. Defaults to 10.
        status: Filter by invoice status.
            If None, no status filtering is applied. Defaults to None.
        start_date: Filter invoices issued on or
            after this date. If None, no start date filtering is applied.
            Defaults to None.
        end_date: Filter invoices issued on or
            before this date. If None, no end date filtering is applied.
            Defaults to None.

    Returns:
        - items: List of InvoiceResponse objects for the current page
        - pagination: PaginationMetadata with pagination information

    Raises:
        SQLAlchemyError: If there's an error executing the database query.

    Example:
        >>> # Get first page of all invoices
        >>> invoices = get_invoices(db)
        >>>
        >>> # Get pending invoices from last month
        >>> from datetime import datetime, timedelta
        >>> last_month = datetime.now() - timedelta(days=30)
        >>> pending_invoices = get_invoices(
        ...     db,
        ...     status=InvoiceStatus.PENDING,
        ...     start_date=last_month
        ... )
    """
    query = db.query(Invoice)

    if status is not None:
        query = query.filter(Invoice.status == status)

    if start_date is not None:
        query = query.filter(Invoice.issue_date >= start_date)

    if end_date is not None:
        query = query.filter(Invoice.issue_date <= end_date)

    total_items = query.count()
    total_pages = ceil(total_items / page_size) if total_items > 0 else 0

    offset = (page - 1) * page_size
    invoices = (
        query.order_by(Invoice.issue_date.desc()).offset(offset).limit(page_size).all()
    )

    invoice_responses = [
        InvoiceResponse.model_validate(invoice) for invoice in invoices
    ]

    pagination = PaginationMetadata(
        page=page, page_size=page_size, total_items=total_items, total_pages=total_pages
    )

    return InvoiceListResponse(items=invoice_responses, pagination=pagination)


__all__ = ("get_invoices",)
