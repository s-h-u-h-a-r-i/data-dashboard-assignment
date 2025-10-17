from datetime import datetime, timezone
from enum import StrEnum, auto

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum

from app.core.database import Base


class PaymentStatus(StrEnum):
    PAID = auto()
    PENDING = auto()


class Payment(Base):
    __tablename__ = "payments"

    id: Column[int] = Column(Integer, primary_key=True, index=True)
    transaction_id: Column[str] = Column(
        String, unique=True, nullable=False, index=True
    )
    amount: Column[float] = Column(Float, nullable=False)
    currency: Column[str] = Column(String, default="ZAR", nullable=False)
    status: Column[str] = Column(Enum(PaymentStatus), nullable=False)
    payment_date: Column[datetime] = Column(DateTime, nullable=False)
    customer_name: Column[str] = Column(String, nullable=False)
    description: Column[str] = Column(String, nullable=True)
    created_at: Column[datetime] = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


__all__ = ("PaymentStatus", "Payment")
