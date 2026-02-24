from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import AIService
from services.retriever import Retriever

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    candidate_id: Optional[str] = ""

class ChatResponse(BaseModel):
    reply: str
    sources: List[str]

ai_service = AIService()
retriever = Retriever()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Get relevant context based on the message and candidate
        context = retriever.get_relevant_context(request.message, request.candidate_id)
        
        # Generate AI response
        reply = await ai_service.generate(
            question=request.message,
            context=context,
            history=request.history or []
        )
        
        return ChatResponse(
            reply=reply,
            sources=context["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
