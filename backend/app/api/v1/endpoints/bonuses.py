from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.bonus import BonusTransaction
from app.models.user import User
from app.schemas.bonus import BonusHistoryResponse, BonusTransactionOut

router = APIRouter(prefix="/bonuses", tags=["bonuses"])


@router.get("/my", response_model=BonusHistoryResponse)
async def get_my_bonuses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BonusHistoryResponse:
    result = await db.execute(
        select(BonusTransaction)
        .where(BonusTransaction.user_id == current_user.id)
        .order_by(BonusTransaction.created_at.desc())
        .limit(50)
    )
    transactions = result.scalars().all()
    return BonusHistoryResponse(
        balance=current_user.bonus_balance,
        transactions=[BonusTransactionOut.model_validate(t) for t in transactions],
    )
