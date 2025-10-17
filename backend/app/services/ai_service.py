from dataclasses import dataclass
from datetime import datetime, timezone
import json
import time
from typing import List, Optional

from fastapi import status
from openai import OpenAI
from openai.types.chat import (
    ChatCompletionUserMessageParam,
    ChatCompletionSystemMessageParam,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.exceptions.base import ApplicationException
from app.core.config import settings
from app.models.payment import Payment, PaymentStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.assistant import AssistantResponse
from app.core.logger import memory_logger

client = OpenAI(api_key=settings.OPENAI_API_KEY)

DEFAULT_MODEL = "gpt-5-nano-2025-08-07"


class AIServiceException(ApplicationException):
    """Exception raised for AI service errors."""

    def __init__(
        self,
        message: str = "AI service error occurred",
        status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE,
    ) -> None:
        super().__init__(message, status_code)


@dataclass(frozen=True)
class BaseSummary:
    total_count: int
    total_amount: float
    paid_count: int


@dataclass(frozen=True)
class RecentPaymentItem:
    transaction_id: str
    amount: float
    status: str
    payment_date: str
    customer: str


@dataclass(frozen=True)
class RecentInvoiceItem:
    invoice_number: str
    amount: float
    status: str
    due_date: str
    customer: str


@dataclass(frozen=True)
class PaymentSummary(BaseSummary):
    pending_count: int
    recent: List[RecentPaymentItem]


@dataclass(frozen=True)
class InvoiceSummary(BaseSummary):
    unpaid_count: int
    overdue_count: int
    recent: List[RecentInvoiceItem]


@dataclass(frozen=True)
class DataContext:
    payments: PaymentSummary
    invoices: InvoiceSummary


def _fetch_data_context(db: Session) -> DataContext:
    # * Payment statistics
    total_payments = db.query(func.count(Payment.id)).scalar() or 0
    total_payment_amount = db.query(func.sum(Payment.amount)).scalar() or 0
    paid_payments = (
        db.query(func.count(Payment.id))
        .filter(Payment.status == PaymentStatus.PAID)
        .scalar()
        or 0
    )
    pending_payments = (
        db.query(func.count(Payment.id))
        .filter(Payment.status == PaymentStatus.PENDING)
        .scalar()
        or 0
    )

    # * Invoice statistics
    total_invoices = db.query(func.count(Invoice.id)).scalar() or 0
    total_invoice_amount = db.query(func.sum(Invoice.amount)).scalar() or 0
    paid_invoices = (
        db.query(func.count(Invoice.id))
        .filter(Invoice.status == InvoiceStatus.PAID)
        .scalar()
        or 0
    )
    unpaid_invoices = (
        db.query(func.count(Invoice.id))
        .filter(Invoice.status == InvoiceStatus.UNPAID)
        .scalar()
        or 0
    )
    overdue_invoices = (
        db.query(func.count(Invoice.id))
        .filter(Invoice.status == InvoiceStatus.OVERDUE)
        .scalar()
        or 0
    )

    recent_payments = (
        db.query(Payment).order_by(Payment.payment_date.desc()).limit(5).all()
    )

    recent_invoices = (
        db.query(Invoice).order_by(Invoice.issue_date.desc()).limit(5).all()
    )

    return DataContext(
        payments=PaymentSummary(
            total_count=total_payments,
            total_amount=float(total_payment_amount),
            paid_count=paid_payments,
            pending_count=pending_payments,
            recent=[
                RecentPaymentItem(
                    transaction_id=str(p.transaction_id),
                    amount=float(p.amount),
                    status=p.status.value,
                    payment_date=p.payment_date.isoformat(),
                    customer=str(p.customer_name),
                )
                for p in recent_payments
            ],
        ),
        invoices=InvoiceSummary(
            total_count=total_invoices,
            total_amount=float(total_invoice_amount),
            paid_count=paid_invoices,
            unpaid_count=unpaid_invoices,
            overdue_count=overdue_invoices,
            recent=[
                RecentInvoiceItem(
                    invoice_number=str(inv.invoice_number),
                    amount=float(inv.amount),
                    status=inv.status.value,
                    due_date=inv.due_date.isoformat(),
                    customer=str(inv.customer_name),
                )
                for inv in recent_invoices
            ],
        ),
    )


def _build_system_prompt(context: DataContext) -> str:
    return f"""You are a financial assistant for a business dashboard. You can ONLY answer questions using the summary data provided below. You CANNOT access additional data, pull detailed records, or perform actions.

PAYMENTS: {context.payments.total_count} total (R{context.payments.total_amount:.2f}), {context.payments.paid_count} paid, {context.payments.pending_count} pending

INVOICES: {context.invoices.total_count} total (R{context.invoices.total_amount:.2f}), {context.invoices.paid_count} paid, {context.invoices.unpaid_count} unpaid, {context.invoices.overdue_count} overdue

Recent Payments: {', '.join([f"{p.transaction_id} (R{p.amount:.2f}, {p.customer})" for p in context.payments.recent[:3]])}

Recent Invoices: {', '.join([f"{inv.invoice_number} (R{inv.amount:.2f}, {inv.customer})" for inv in context.invoices.recent[:3]])}

Rules:
- Answer ONLY using the data above
- If specific details aren't provided, say so clearly
- Do NOT suggest pulling additional data or performing actions you cannot do
- Be concise and factual"""


def query_ai_assistant(
    query: str, db: Session, model: str = DEFAULT_MODEL
) -> AssistantResponse:
    start_time = time.time()
    error_message: Optional[str] = None

    try:
        context = _fetch_data_context(db)
        system_prompt = _build_system_prompt(context)

        response = client.chat.completions.create(
            model=model,
            messages=[
                ChatCompletionSystemMessageParam(content=system_prompt, role="system"),
                ChatCompletionUserMessageParam(content=query, role="user"),
            ],
            max_completion_tokens=2000,
        )

        ai_response = (
            response.choices[0].message.content or "I couldn't generate a response."
        )
        duration_ms = (time.time() - start_time) * 1000

        token_usage = {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": (
                response.usage.completion_tokens if response.usage else 0
            ),
            "total_tokens": response.usage.total_tokens if response.usage else 0,
        }

        memory_logger.log_ai_interaction(
            query=query,
            response=ai_response,
            model=model,
            token_usage=token_usage,
            duration_ms=duration_ms,
        )

        return AssistantResponse(
            response=ai_response,
            query=query,
            timestamp=datetime.now(timezone.utc),
            model=model,
            token_usage=token_usage,
        )
    except Exception as e:
        error_message = str(e)
        duration_ms = (time.time() - start_time) * 1000

        memory_logger.log_ai_interaction(
            query=query,
            response="",
            model=model,
            duration_ms=duration_ms,
            error=error_message,
        )

        raise AIServiceException(message=f"Failed to get AI response: {error_message}")


__all__ = ("query_ai_assistant", "AIServiceException")
