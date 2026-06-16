from datetime import datetime

from pydantic import BaseModel


class BonusTransactionOut(BaseModel):
    id: int
    amount: int
    type: str
    description: str
    appointment_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class BonusHistoryResponse(BaseModel):
    balance: int
    transactions: list[BonusTransactionOut]
