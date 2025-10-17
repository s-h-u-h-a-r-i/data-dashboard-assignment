from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.payment import PaymentStatus
from app.schemas.payment import PaymentListResponse
from app.core.database import get_db
from app.services.payment_service import get_payments as get_payments_service


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
    return get_payments_service(
        db=db,
        page=page,
        page_size=page_size,
        status=status,
        start_date=start_date,
        end_date=end_date,
    )


__all__ = ("router",)
