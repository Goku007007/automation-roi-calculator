"""
main.py - FastAPI Application
Web server that exposes the ROI calculator as an API.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from models import ROIInput, ROIOutput
from calculator import calculate_roi
from pdf_generator import generate_pdf_report
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
# PUBLIC ENDPOINTS (No authentication required)
# =============================================================================

@app.get("/health")
def health_check():
    """Check if the server is running."""
    return {"status": "healthy"}


@app.get("/token")
def get_token():
    """
    Get an access token for API access.
    
    This token is required for /calculate and /generate-pdf endpoints.
    Token expires in 60 minutes.
    """
    token = create_access_token()
    return {"access_token": token, "token_type": "bearer"}


# =============================================================================
# PROTECTED ENDPOINTS (Authentication required)
# =============================================================================

@app.post("/calculate")
def calculate(inputs: ROIInput, authenticated: bool = Depends(verify_token)):
    """
    Calculate automation ROI based on provided inputs.
    
    Requires: Bearer token in Authorization header
    """
    try:
        result = calculate_roi(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-pdf")
def generate_pdf(inputs: ROIInput, authenticated: bool = Depends(verify_token)):
    """
    Generate PDF report from ROI calculation results.
    
    Requires: Bearer token in Authorization header
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