
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from openai import OpenAI

app = FastAPI(
    title="AARR Engineering AI API",
    version="1.0.0"
)

class AIRequest(BaseModel):
    question: str = Field(min_length=3, max_length=4000)

@app.get("/")
def home():
    return {
        "service": "AARR Engineering AI",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/assistant")
def assistant(request: AIRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured yet."
        )

    try:
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-6"),
            input=(
                "You are the AARR Engineering technical assistant. "
                "Give careful engineering guidance. Flag assumptions "
                "and require qualified professional verification for "
                "safety-critical designs and calculations.\n\n"
                + request.question
            )
        )
        return {"answer": response.output_text}
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="AI request failed. Please try again later."
        )
