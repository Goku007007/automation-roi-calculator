---
description: Backend API and Python code guidelines for AutomateROI
---

# AutomateROI Backend Guidelines

**Read `/project-guidelines` first, then this file for all backend work.**

This document covers FastAPI routes, Pydantic models, business logic, and Python coding conventions.

---

## 1. Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | FastAPI 0.100+ | High-performance async API |
| **Validation** | Pydantic 2 | Type-safe request/response models |
| **Server** | Uvicorn | ASGI server |
| **Database** | SQLAlchemy 2 | ORM for SQLite |
| **PDF** | ReportLab | PDF report generation |
| **Rate Limiting** | SlowAPI | Request throttling |
| **HTTP Client** | HTTPX | External API calls |

---

## 2. Project Structure

```
backend/
├── main.py              # FastAPI app, routes, middleware
├── calculator.py        # ROI calculation business logic
├── pdf_generator.py     # PDF report generation
├── models.py            # Pydantic input/output models
├── project_models.py    # SQLAlchemy database models
├── database.py          # Database connection setup
├── auth.py              # JWT authentication (optional)
├── requirements.txt     # Python dependencies
├── runtime.txt          # Python version for deployment
├── Procfile             # Railway deployment config
└── railway.json         # Railway settings
```

---

## 3. Naming Conventions

### Files
- Use `snake_case.py` for all Python files
- Example: `pdf_generator.py`, `roi_calculator.py`

### Classes
- Use `PascalCase` for classes
- Pydantic models end with descriptive suffix: `ROIInput`, `ROIOutput`, `PDFRequest`

### Functions
- Use `snake_case` for functions
- Prefix private functions with `_`: `_calculate_labor_cost()`
- Use verbs: `calculate_roi()`, `generate_pdf()`, `get_projects()`

### Variables
- Use `snake_case` for variables
- Constants use `UPPER_SNAKE_CASE`

```python
# Good
class ROIInput(BaseModel):
    process_name: str
    hourly_rate: float

def calculate_roi(inputs: ROIInput) -> ROIOutput:
    annual_cost = _calculate_labor_cost(inputs)
    return ROIOutput(...)

# Configuration constants
HIGH_PRIORITY_THRESHOLD = 12
DEFAULT_WORKING_DAYS = 250
```

---

## 4. Pydantic Models

### Location
All Pydantic models go in `models.py`.

### Input Models
Use `Field()` for validation and documentation:

```python
from pydantic import BaseModel, Field

class ROIInput(BaseModel):
    """All inputs needed to calculate ROI."""
    
    process_name: str = Field(
        ...,  # Required
        description="Name of the process being analyzed"
    )
    hourly_rate: float = Field(
        ...,
        ge=0,  # Greater than or equal to 0
        description="Hourly cost per employee"
    )
    error_rate: float = Field(
        default=0,  # Optional with default
        ge=0,
        le=100,
        description="Error rate percentage (0-100)"
    )
```

### Output Models
Document all fields:

```python
class ROIOutput(BaseModel):
    """Results of ROI calculation."""
    
    process_name: str
    annual_labor_cost: float
    annual_savings: float
    payback_months: float
    roi_percentage: float
    priority_score: str  # "High", "Medium", "Low"
    recommendation: str
```

### Extending Models (e.g., PDF with branding)
```python
class PDFRequest(ROIInput):
    """PDF request extends ROIInput with branding options."""
    
    company_name: str = Field(default=None)
    brand_color: str = Field(default=None)
    logo_base64: str = Field(default=None)
```

---

## 5. API Routes

### Location
All routes go in `main.py`.

### Route Pattern
```python
from fastapi import FastAPI, Request, HTTPException, Depends
from models import ROIInput, ROIOutput

app = FastAPI(
    title="Automation ROI Calculator",
    description="Calculate ROI for process automation",
    version="0.1.0"
)

@app.get("/health")
def health_check():
    """Check if server is running."""
    return {"status": "healthy"}

@app.post("/calculate", response_model=ROIOutput)
@limiter.limit("30/minute")
def calculate(request: Request, inputs: ROIInput):
    """
    Calculate automation ROI based on provided inputs.
    
    Rate limit: 30 requests per minute per IP.
    """
    try:
        result = calculate_roi(inputs)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Rate Limiting
Apply rate limits to all public endpoints:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/calculate")
@limiter.limit("30/minute")  # Calculation endpoint
def calculate(...): ...

@app.post("/generate-pdf")
@limiter.limit("10/minute")  # PDF generation is expensive
def generate_pdf(...): ...

@app.post("/contact")
@limiter.limit("5/hour")  # Prevent spam
def contact(...): ...
```

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://automateroi.vercel.app",  # Production
        "http://localhost:5173",            # Dev
        "http://localhost:5174",            # Dev alternate
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 6. Business Logic

### Location
Complex business logic belongs in separate modules:
- `calculator.py` - ROI calculation
- `pdf_generator.py` - PDF generation

### Pattern
```python
# calculator.py
"""
calculator.py - ROI Calculation Engine

Production-grade calculation module for automation ROI analysis.
"""

from models import ROIInput, ROIOutput

class CalculatorConfig:
    """Configuration thresholds."""
    HIGH_PRIORITY_THRESHOLD = 12
    MEDIUM_PRIORITY_THRESHOLD = 24

def calculate_roi(inputs: ROIInput) -> ROIOutput:
    """
    Calculate automation ROI based on inputs.
    
    Args:
        inputs: Validated user inputs
        
    Returns:
        ROIOutput with all calculated metrics
    """
    config = CalculatorConfig()
    
    # Step 1: Calculate base costs
    labor_cost = _calculate_labor_cost(inputs)
    
    # Step 2: Calculate savings
    savings = _calculate_savings(labor_cost, inputs)
    
    # Step 3: Generate recommendation
    priority, recommendation = _generate_recommendation(...)
    
    return ROIOutput(
        process_name=inputs.process_name,
        annual_labor_cost=labor_cost,
        annual_savings=savings,
        priority_score=priority,
        recommendation=recommendation,
    )

def _calculate_labor_cost(inputs: ROIInput) -> float:
    """Private helper for labor cost calculation."""
    return inputs.hours_per_run * inputs.staff_count * inputs.hourly_rate
```

---

## 7. Database Operations

### SQLAlchemy Models
Located in `project_models.py`:

```python
from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    inputs = Column(JSON, default={})
    results = Column(JSON, default={})
    scenarios = Column(JSON, default={})
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Database Session
```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./projects.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Using in Routes
```python
from database import get_db_session
from fastapi import Depends

@app.get("/projects")
def list_projects(db=Depends(get_db_session)):
    projects = db.query(Project).all()
    return [{"id": p.id, "name": p.name, ...} for p in projects]
```

---

## 8. Error Handling

### HTTP Exceptions
```python
from fastapi import HTTPException

# 400 Bad Request - Invalid input
raise HTTPException(status_code=400, detail="Invalid process name")

# 404 Not Found - Resource doesn't exist
raise HTTPException(status_code=404, detail="Project not found")

# 422 Validation Error - Pydantic auto-handles this

# 500 Internal Error - Unexpected errors
try:
    result = risky_operation()
except Exception as e:
    raise HTTPException(status_code=500, detail="Internal server error")
```

### Custom Exception Handler
```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"}
    )
```

---

## 9. PDF Generation

### Pattern in `pdf_generator.py`
```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from io import BytesIO

def generate_pdf_report(
    data: ROIOutput,
    company_name: str = None,
    brand_color: str = None,
    logo_base64: str = None
) -> bytes:
    """
    Generate enterprise-grade PDF report.
    
    Args:
        data: ROI calculation results
        company_name: Custom company name for header
        brand_color: Hex color for branding
        logo_base64: Base64-encoded logo image
        
    Returns:
        PDF file as bytes
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    
    # Build PDF content
    elements = []
    elements.append(Paragraph(f"ROI Report: {data.process_name}"))
    # ... more content
    
    doc.build(elements)
    return buffer.getvalue()
```

---

## 10. Testing

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8007/health

# Calculate ROI
curl -X POST http://localhost:8007/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "process_name": "Invoice Processing",
    "frequency": "daily",
    "runs_per_period": 20,
    "hours_per_run": 0.5,
    "staff_count": 2,
    "hourly_rate": 45,
    "implementation_cost": 5000
  }'

# Generate PDF (returns binary)
curl -X POST http://localhost:8007/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{...}' --output report.pdf
```

### OpenAPI Docs
FastAPI auto-generates API docs at:
- Swagger UI: `http://localhost:8007/docs`
- ReDoc: `http://localhost:8007/redoc`

---

## 11. Deployment

### Railway Configuration
`railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

`Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8007}
```

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Server port | 8007 |
| `REQUIRE_AUTH` | Enable JWT auth | false |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA verification | None |

---

## 12. Adding a New Endpoint

### Checklist
1. [ ] Add Pydantic model(s) in `models.py`
2. [ ] Add route in `main.py`
3. [ ] Add business logic in appropriate module
4. [ ] Add rate limiting if public
5. [ ] Add proper error handling
6. [ ] Test with curl
7. [ ] Update OpenAPI description
8. [ ] Commit changes

### Example: Adding a New Calculation Endpoint

```python
# 1. models.py - Add input/output models
class ScenarioInput(BaseModel):
    base: ROIInput
    best_case_multiplier: float = 1.2
    worst_case_multiplier: float = 0.8

class ScenarioOutput(BaseModel):
    base: ROIOutput
    best: ROIOutput
    worst: ROIOutput

# 2. main.py - Add route
@app.post("/calculate-scenarios", response_model=ScenarioOutput)
@limiter.limit("20/minute")
def calculate_scenarios(request: Request, inputs: ScenarioInput):
    """Calculate base, best, and worst case scenarios."""
    base = calculate_roi(inputs.base)
    # ... calculate variations
    return ScenarioOutput(base=base, best=best, worst=worst)
```

---

## 13. Common Patterns

### Dependency Injection
```python
# For database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

# For authentication
def verify_token(token: str = Depends(oauth2_scheme)):
    # Verify JWT
    return decoded_payload

@app.get("/protected")
def protected_route(user = Depends(verify_token)):
    return {"user": user}
```

### Response Streaming (for large files)
```python
from fastapi.responses import StreamingResponse

@app.get("/download-report/{id}")
def download_report(id: str):
    pdf_bytes = generate_pdf(id)
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={id}.pdf"}
    )
```

---

*Last updated: January 2026*
*For frontend work, see `/ui-guidelines`*
