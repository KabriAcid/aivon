import asyncio
import random
from fastapi import APIRouter
from app.schemas.process import ProcessRequest, ProcessResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
async def process(request: ProcessRequest) -> ProcessResponse:
    await asyncio.sleep(random.uniform(0.5, 1.5))
    response, source = ai_service.generate_response(request.text, request.language)
    return ProcessResponse(response=response, source=source)
