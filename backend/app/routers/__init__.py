from fastapi import APIRouter

from .payments import router as payment_router
from .invoices import router as invoice_router
from .summary import router as summary_router

router = APIRouter(prefix="/api")

router.include_router(invoice_router)
router.include_router(payment_router)
router.include_router(summary_router)

__all__ = ("router",)
