from datetime import datetime
from math import ceil
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import PaymentListResponse, PaymentResponse
from app.core.database import get_db
from app.schemas.common import PaginationMetadata


router = APIRouter(prefix="/payments", tags=["payments"])


@router.get(
    "",
    response_model=PaymentListResponse,
    summary="Retrieve a list of payments",
    description="Fetches a paginated list of payments. Allows filtering by status, and date range (payment date). Returns payment details along with pagination metadata.",
)
async def get_payments(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    status: Annotated[Optional[PaymentStatus], Query()] = None,
    start_date: Annotated[Optional[datetime], Query()] = None,
    end_date: Annotated[Optional[datetime], Query()] = None,
    db: Session = Depends(get_db),
) -> PaymentListResponse:
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


__all__ = ("router",)
