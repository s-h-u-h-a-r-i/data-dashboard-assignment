from datetime import datetime
from enum import StrEnum, auto

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum

from app.core.database import Base


class InvoiceStatus(StrEnum):
    PAID = auto()
    UNPAID = auto()
    OVERDUE = auto()


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="ZAR", nullable=False)
    status = Column(Enum(InvoiceStatus), nullable=False)
    due_date = Column(DateTime, nullable=False)
    issue_date = Column(DateTime, nullable=False)
    customer_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now, nullable=False)


__all__ = ("InvoiceStatus", "Invoice")
