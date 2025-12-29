"""
main.py - FastAPI Application
Web server that exposes the ROI calculator as an API.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from models import ROIInput, ROIOutput
from calculator import calculate_roi
from pdf_generator import generate_pdf_report

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

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/calculate")
def calculate(inputs: ROIInput):
    """Calculate automation ROI based on provided inputs"""
    try:
        result = calculate_roi(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-pdf")
def generate_pdf(inputs: ROIInput):
    """Generate PDF report from ROI calculation results"""
    try:
        result = calculate_roi(inputs)
        pdf_bytes = generate_pdf_report(result)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)