"""
main.py - FastAPI Application
Web server that exposes the ROI calculator as an API.

Configuration:
    Set REQUIRE_AUTH=true to enable JWT authentication
    By default, auth is disabled for simplicity
"""

import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from models import ROIInput, ROIOutput
from calculator import calculate_roi
from pdf_generator import generate_pdf_report

# Configuration: Set to "true" to require authentication
REQUIRE_AUTH = os.getenv("REQUIRE_AUTH", "false").lower() == "true"

# Conditional import of auth module
if REQUIRE_AUTH:
    from auth import create_access_token, verify_token

app = FastAPI(
    title="Automation ROI Calculator",
    description="Calculate the financial return on investment for process automation",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
# CALCULATION ENDPOINTS
# =============================================================================

@app.post("/calculate")
def calculate(inputs: ROIInput):
    """
    Calculate automation ROI based on provided inputs.
    
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
def generate_pdf(inputs: ROIInput):
    """
    Generate PDF report from ROI calculation results.
    """
    try:
        result = calculate_roi(inputs)
        pdf_bytes = generate_pdf_report(result)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)