from datetime import datetime, timezone
from enum import StrEnum, auto

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum

from app.core.database import Base


class InvoiceStatus(StrEnum):
    PAID = auto()
    UNPAID = auto()
    OVERDUE = auto()


class Invoice(Base):
    __tablename__ = "invoices"

    id: Column[int] = Column(Integer, primary_key=True, index=True)
    invoice_number: Column[str] = Column(
        String, unique=True, nullable=False, index=True
    )
    amount: Column = Column(Float, nullable=False)
    currency: Column[str] = Column(String, default="ZAR", nullable=False)
    status: Column[str] = Column(Enum(InvoiceStatus), nullable=False)
    due_date: Column[datetime] = Column(DateTime, nullable=False)
    issue_date: Column[datetime] = Column(DateTime, nullable=False)
    customer_name: Column[str] = Column(String, nullable=False)
    description: Column[str] = Column(String, nullable=True)
    created_at: Column[datetime] = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


__all__ = ("InvoiceStatus", "Invoice")
