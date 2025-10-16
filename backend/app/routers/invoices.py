from datetime import datetime
from math import ceil
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.schemas.invoice import InvoiceListResponse, InvoiceResponse
from app.models.invoice import Invoice, InvoiceStatus
from app.core.database import get_db
from app.schemas.common import PaginationMetadata

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get(
    "",
    response_model=InvoiceListResponse,
    summary="Retrieve a list of invoices",
    description="Fetches a paginated list of invoices. Allows filtering by status, and date range (issue date). Returns invoice details along with pagination metadata.",
)
async def get_invoices(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    status: Annotated[Optional[InvoiceStatus], Query()] = None,
    start_date: Annotated[Optional[datetime], Query()] = None,
    end_date: Annotated[Optional[datetime], Query()] = None,
    db: Session = Depends(get_db),
) -> InvoiceListResponse:
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

    invoice_reponses = [InvoiceResponse.model_validate(invoice) for invoice in invoices]

    pagination = PaginationMetadata(
        page=page, page_size=page_size, total_items=total_items, total_pages=total_pages
    )

    return InvoiceListResponse(items=invoice_reponses, pagination=pagination)


__all__ = ("router",)
