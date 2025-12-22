"""
main.py - FastAPI Application
Web server that exposes the ROI calculator as an API.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import ROIInput, ROIOutput
from calculator import calculate_roi

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)