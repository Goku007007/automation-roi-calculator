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
from database import init_db, get_db_session
from project_models import Project

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

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()


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


class ProjectInput(BaseModel):
    """Input for creating/updating a project."""
    name: str
    inputs: dict = {}
    results: dict = {}
    scenarios: dict = {}


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
            input_data=inputs,
            company_name=inputs.company_name,
            brand_color=inputs.brand_color,
            logo_base64=inputs.logo_base64
        )
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# PROJECT CRUD ENDPOINTS
# =============================================================================

@app.get("/projects")
def list_projects(db=Depends(get_db_session)):
    """List all saved projects."""
    try:
        projects = db.query(Project).order_by(Project.updated.desc()).all()
        return [p.to_dict() for p in projects]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/projects")
def create_project(project: ProjectInput, db=Depends(get_db_session)):
    """Create a new project."""
    try:
        db_project = Project(
            name=project.name,
            inputs=project.inputs,
            results=project.results,
            scenarios=project.scenarios or {"base": {"inputs": project.inputs, "results": project.results}}
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project.to_dict()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/projects/{project_id}")
def get_project(project_id: str, db=Depends(get_db_session)):
    """Get a single project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.to_dict()


@app.put("/projects/{project_id}")
def update_project(project_id: str, updates: ProjectInput, db=Depends(get_db_session)):
    """Update an existing project."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project.name = updates.name
        project.inputs = updates.inputs
        project.results = updates.results
        project.scenarios = updates.scenarios
        
        db.commit()
        db.refresh(project)
        return project.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/projects/{project_id}")
def delete_project(project_id: str, db=Depends(get_db_session)):
    """Delete a project."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        db.delete(project)
        db.commit()
        return {"success": True, "message": "Project deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)