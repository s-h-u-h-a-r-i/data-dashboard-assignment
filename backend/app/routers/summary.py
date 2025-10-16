from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.summary import SummaryMetrics
from app.core.database import get_db
from app.services.summary_service import get_summary_metrics


router = APIRouter(prefix="/summary", tags=["summary"])


@router.get(
    "",
    response_model=SummaryMetrics,
    summary="Get overall financial summary metrics",
    description="Retrieves aggregated summary statistics for both payments and invoices, including monthly breakdowns.",
)
async def get_summary(db: Session = Depends(get_db)) -> SummaryMetrics:
    return get_summary_metrics(db)


__all__ = ("router",)
