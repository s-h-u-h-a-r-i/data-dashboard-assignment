import random
from datetime import datetime, timedelta, timezone
from typing import List

from sqlalchemy.orm import Session
from faker import Faker

from app.models.payment import Payment, PaymentStatus
from app.models.invoice import Invoice, InvoiceStatus

fake = Faker()

SIX_MONTHS_IN_DAYS = 180


def generate_payments() -> List[Payment]:
    """
    ### Generates a list of synthetic payment records for seeding the database.

    #### This function performs the following steps to create payment entries:
    -   Creates a random number of payment entries (between 25 and 30).
    -   Assigns varied attributes including transaction ID, amount, status, payment date,
        customer name, and description.
    -   Distributes payment dates within the last six months from the current UTC time.
    -   Randomly selects amounts from predefined ranges.
    -   Assigns statuses, predominantly 'PAID' with some 'PENDING' entries.

    Returns:
        A list of `Payment` model instances, ready to be persisted.
    """
    payments: List[Payment] = []
    num_payments = random.randint(25, 30)

    amount_ranges = [(50, 500), (500, 2000), (2000, 10000)]

    statuses = [PaymentStatus.PAID] * 8 + [PaymentStatus.PENDING] * 2

    now = datetime.now(timezone.utc)
    six_months_ago = now - timedelta(days=SIX_MONTHS_IN_DAYS)

    for i in range(num_payments):
        days_offset = random.randint(0, SIX_MONTHS_IN_DAYS)
        payment_date = six_months_ago + timedelta(days=days_offset)

        min_amount, max_amount = random.choice(amount_ranges)
        amount = round(random.uniform(min_amount, max_amount), 2)

        transaction_id = f"TXN-{fake.uuid4()[:8].upper()}-{i+1:04d}"

        status = random.choice(statuses)

        payment = Payment(
            transaction_id=transaction_id,
            amount=amount,
            currency="ZAR",
            status=status,
            payment_date=payment_date,
            customer_name=fake.company(),
            description=fake.catch_phrase(),
            created_at=payment_date - timedelta(hours=random.randint(1, 48)),
        )
        payments.append(payment)

    return payments


def generate_invoices() -> List[Invoice]:
    """
    ### Generates a list of synthetic invoice records for seeding the database.

    #### This function performs the following steps to create invoice entries:
    -   Generates a random number of invoices (between 25 and 30).
    -   Assigns varied attributes including invoice number, amount, status, issue date,
        due date, customer name, and description.
    -   Distributes issue and due dates within the last six months from the current UTC time.
    -   Adjusts dates for 'OVERDUE' invoices to ensure their due dates are in the past.
    -   Selects amounts randomly from predefined ranges.
    -   Assigns statuses ('PAID', 'UNPAID', 'OVERDUE') based on a specified distribution.

    Returns:
        A list of `Invoice` model instances, ready to be persisted.
    """
    invoices: List[Invoice] = []
    num_invoices = random.randint(25, 30)

    amount_ranges = [(100, 1000), (1000, 5000), (5000, 20000)]

    statuses = (
        [InvoiceStatus.PAID] * 6
        + [InvoiceStatus.UNPAID] * 3
        + [InvoiceStatus.OVERDUE] * 2
    )

    now = datetime.now(timezone.utc)
    six_months_ago = now - timedelta(days=SIX_MONTHS_IN_DAYS)

    for i in range(num_invoices):
        days_offset = random.randint(0, SIX_MONTHS_IN_DAYS)
        issue_date = six_months_ago + timedelta(days=days_offset)
        due_date = issue_date + timedelta(days=random.randint(30, 90))

        min_amount, max_amount = random.choice(amount_ranges)
        amount = round(random.uniform(min_amount, max_amount), 2)

        invoice_number = f"INV-{fake.year()}-{i+1:05d}"

        status = random.choice(statuses)

        if status == InvoiceStatus.OVERDUE:
            due_date = now - timedelta(days=random.randint(1, 60))
            issue_date = due_date - timedelta(days=random.randint(30, 90))

        invoice = Invoice(
            invoice_number=invoice_number,
            amount=amount,
            currency="ZAR",
            status=status,
            due_date=due_date,
            issue_date=issue_date,
            customer_name=fake.company(),
            description=fake.bs(),
            created_at=issue_date,
        )
        invoices.append(invoice)

    return invoices


def seed_database(db: Session) -> None:
    """
    ### Seeds the database with initial payment and invoice data if the tables are empty.

    This function checks for the existence of any records in the `Payment` and `Invoice`
    tables. If either table contains data, the seeding process is skipped to prevent
    duplicate entries. Otherwise, it generates new payment and invoice records,
    adds them to the provided database session, and commits the changes.

    Args:
        db: The SQLAlchemy database session to use for querying and adding data.
    """
    existing_payments = db.query(Payment).first()
    existing_invoices = db.query(Invoice).first()

    if existing_payments or existing_invoices:
        print("Database already contains data. Skipping seeding.")
        return

    payments = generate_payments()
    if payments:
        db.add_all(payments)

    invoices = generate_invoices()
    if invoices:
        db.add_all(invoices)

    db.commit()
    print("Database seeded successfully.")


__all__ = ("generate_payments", "generate_invoices", "seed_database")


if __name__ == "__main__":
    payment = generate_payments()[0]
    invoice = generate_invoices()[0]
    print(f"Payment: {payment.__dict__}", end="\n\n")
    print(f"Invoice: {invoice.__dict__}")
