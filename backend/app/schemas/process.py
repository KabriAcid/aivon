from pydantic import BaseModel, Field
from typing import Literal

SupportedLanguage = Literal["English", "Hausa", "Yoruba", "Igbo"]


class ProcessRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    language: SupportedLanguage


class ProcessResponse(BaseModel):
    response: str
    source: Literal["llm", "fallback"]
