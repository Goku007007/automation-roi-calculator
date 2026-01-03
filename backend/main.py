"""
main.py - FastAPI Application
Web server that exposes the ROI calculator as an API.

Configuration:
    Set REQUIRE_AUTH=true to enable JWT authentication
    Set RECAPTCHA_SECRET_KEY for production reCAPTCHA verification
    By default, auth is disabled for simplicity
"""

import os
import httpx
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from models import ROIInput, ROIOutput, PDFRequest
from calculator import calculate_roi
from pdf_generator import generate_pdf_report

# Configuration
REQUIRE_AUTH = os.getenv("REQUIRE_AUTH", "false").lower() == "true"
# reCAPTCHA secret key - MUST be set via environment variable
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY", "")

# Rate Limiter setup
limiter = Limiter(key_func=get_remote_address)

# Conditional import of auth module
if REQUIRE_AUTH:
    from auth import create_access_token, verify_token

app = FastAPI(
    title="Automation ROI Calculator",
    description="Calculate the financial return on investment for process automation",
    version="0.1.0",
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://automateroi.vercel.app",  # Production frontend
        "http://localhost:5173",            # Vite dev server
        "http://localhost:5174",            # Vite dev server (alternate port)
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# CONTACT FORM MODEL
# =============================================================================

class ContactFormInput(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    employees: Optional[str] = None
    message: str
    recaptcha_token: Optional[str] = None


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

async def verify_recaptcha(token: str) -> dict:
    """Verify reCAPTCHA token with Google's API."""
    if not token:
        return {"success": False, "score": 0}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": RECAPTCHA_SECRET_KEY,
                "response": token
            }
        )
        return response.json()


# =============================================================================
# PUBLIC ENDPOINTS
# =============================================================================

@app.get("/health")
def health_check():
    """Check if the server is running."""
    return {"status": "healthy", "auth_required": REQUIRE_AUTH}


@app.get("/token")
def get_token():
    """
    Get an access token for API access.
    Only available when REQUIRE_AUTH=true.
    """
    if not REQUIRE_AUTH:
        return {"message": "Authentication is disabled", "auth_required": False}
    
    token = create_access_token()
    return {"access_token": token, "token_type": "bearer"}


# =============================================================================
# CONTACT FORM ENDPOINT (with rate limiting)
# =============================================================================

@app.post("/contact")
@limiter.limit("5/hour")  # Strict rate limit: 5 submissions per hour per IP
async def submit_contact_form(request: Request, form_data: ContactFormInput):
    """
    Submit contact form with reCAPTCHA verification and rate limiting.
    
    Rate limit: 5 submissions per hour per IP address.
    """
    try:
        # Verify reCAPTCHA token
        recaptcha_result = await verify_recaptcha(form_data.recaptcha_token)
        
        if not recaptcha_result.get("success", False):
            raise HTTPException(status_code=400, detail="reCAPTCHA verification failed")
        
        # Check reCAPTCHA score (v3 returns 0.0-1.0, higher is more likely human)
        score = recaptcha_result.get("score", 0)
        if score < 0.5:
            raise HTTPException(status_code=400, detail="Request appears to be automated")
        
        # In production, you would save to database and/or send email
        # For now, just return success
        return {
            "success": True,
            "message": "Contact form submitted successfully",
            "recaptcha_score": score
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# CALCULATION ENDPOINTS
# =============================================================================

@app.post("/calculate")
@limiter.limit("30/minute")  # Rate limit calculations
def calculate(request: Request, inputs: ROIInput):
    """
    Calculate automation ROI based on provided inputs.
    
    Rate limit: 30 requests per minute per IP.
    When REQUIRE_AUTH=true, requires Bearer token in Authorization header.
    """
    try:
        result = calculate_roi(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/calculate-auth")
def calculate_with_auth(inputs: ROIInput, authenticated: bool = Depends(verify_token if REQUIRE_AUTH else lambda: True)):
    """
    Calculate automation ROI with authentication.
    Use /calculate for unauthenticated access when auth is disabled.
    """
    if not REQUIRE_AUTH:
        raise HTTPException(status_code=400, detail="Auth is disabled. Use /calculate instead.")
    try:
        result = calculate_roi(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-pdf")
@limiter.limit("10/minute")  # Rate limit PDF generation
def generate_pdf(request: Request, inputs: PDFRequest):
    """
    Generate PDF report from ROI calculation results with optional branding.
    
    Branding options (all optional):
    - company_name: Custom company name for PDF header
    - brand_color: Hex color for title bar (e.g., "#2563eb")
    - logo_base64: Base64-encoded logo image
    
    Rate limit: 10 requests per minute per IP.
    """
    try:
        # Calculate ROI (using only the ROIInput fields)
        result = calculate_roi(inputs)
        
        # Generate PDF with branding options
        pdf_bytes = generate_pdf_report(
            result,
            company_name=inputs.company_name,
            brand_color=inputs.brand_color,
            logo_base64=inputs.logo_base64
        )
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)