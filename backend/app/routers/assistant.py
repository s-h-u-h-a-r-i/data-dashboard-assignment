from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.core.database import get_db
from app.services.ai_service import AIServiceException, query_ai_assistant


router = APIRouter(prefix="/ai-assistant", tags=["ai-assistant"])


@router.post("", response_model=AssistantResponse)
async def ask_assistant(
    request: AssistantRequest, db: Session = Depends(get_db)
) -> AssistantResponse:
    try:
        return query_ai_assistant(query=request.query, db=db)
    except AIServiceException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


__all__ = ("router",)
