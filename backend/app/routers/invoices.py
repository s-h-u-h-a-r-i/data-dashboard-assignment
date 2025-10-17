from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.schemas.invoice import InvoiceListResponse
from app.models.invoice import InvoiceStatus
from app.core.database import get_db
from app.services.invoice_service import get_invoices as get_invoices_service

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
    return get_invoices_service(
        db=db,
        page=page,
        page_size=page_size,
        status=status,
        start_date=start_date,
        end_date=end_date,
    )


__all__ = ("router",)
