from datetime import datetime
from enum import StrEnum, auto

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum

from app.core.database import Base


class PaymentStatus(StrEnum):
    PAID = auto()
    PENDING = auto()


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="ZAR", nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False)
    payment_date = Column(DateTime, nullable=False)
    customer_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now, nullable=False)


__all__ = ("PaymentStatus", "Payment")
