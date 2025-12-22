# Automation ROI Calculator - Technical Documentation

A comprehensive guide to the codebase, architecture, and formulas.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Dependencies](#dependencies)
4. [Data Models](#data-models)
5. [Calculation Formulas](#calculation-formulas)
6. [API Reference](#api-reference)
7. [Configuration](#configuration)

---

## Project Overview

The Automation ROI Calculator is a web-based tool that helps organizations quantify the financial return on investment for automating manual business processes.

### What It Does

1. Accepts structured inputs about a manual process (time, cost, errors, etc.)
2. Calculates current annual costs
3. Projects savings based on user-defined automation expectations
4. Generates ROI metrics (payback period, 5-year savings)
5. Provides actionable recommendations

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│                    (HTML/CSS/JavaScript)                        │
│                         (Week 2)                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP POST /calculate
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         main.py                                  │
│                    FastAPI Application                          │
│              - Receives HTTP requests                           │
│              - Validates input via Pydantic                     │
│              - Returns JSON responses                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       calculator.py                              │
│                   ROI Calculation Engine                        │
│              - All financial formulas                           │
│              - Recommendation logic                             │
│              - Confidence assessment                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        models.py                                 │
│                   Data Structures                               │
│              - ROIInput: What users send                        │
│              - ROIOutput: What we return                        │
│              - Input validation rules                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
automation-roi-calculator/
├── backend/
│   ├── main.py              # FastAPI application (API endpoints)
│   ├── calculator.py        # ROI calculation engine
│   ├── models.py            # Pydantic data models
│   └── requirements.txt     # Python dependencies
├── frontend/                # (Week 2)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── README.md                # Project overview
├── DOCS.md                  # This file
└── .gitignore               # Git ignore rules
```

### File Descriptions

| File | Purpose |
|------|---------|
| `models.py` | Defines input/output data structures with validation rules. Pydantic ensures users provide valid data before calculations run. |
| `calculator.py` | Contains all ROI calculation logic. Pure functions that take inputs and return outputs. No side effects. |
| `main.py` | FastAPI web server. Exposes HTTP endpoints that frontend can call. |
| `requirements.txt` | Lists Python packages needed to run the backend. |

---

## Dependencies

### Why Each Package Is Used

| Package | Version | Purpose |
|---------|---------|---------|
| **fastapi** | 0.109.0 | Modern web framework for building APIs. Chosen for automatic OpenAPI docs, async support, and excellent performance. |
| **uvicorn** | 0.27.0 | ASGI server that runs FastAPI. Lightweight and production-ready. |
| **pydantic** | 2.5.0 | Data validation library. Automatically validates user input based on type hints. Rejects invalid data with clear error messages. |

### Future Dependencies (Week 2)

| Package | Purpose |
|---------|---------|
| **reportlab** | PDF generation for downloadable reports |
| **aiosqlite** | Async SQLite database for storing sessions |
| **python-jose** | JWT token generation for authentication |

### Installing Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## Data Models

### ROIInput - User Inputs

All fields the user provides to calculate ROI.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `process_name` | string | Yes | - | Name of the process being analyzed |
| `frequency` | enum | Yes | - | How often (hourly, daily, weekly, etc.) |
| `runs_per_period` | int | Yes | - | Executions per period (1-1000) |
| `hours_per_run` | float | Yes | - | Hours per execution (0.1-40) |
| `working_days_per_year` | int | No | 250 | Working days (250=Mon-Fri, 365=24/7) |
| `hours_per_day` | int | No | 8 | Operating hours per day (8-24) |
| `staff_count` | int | Yes | - | Number of staff involved (1-100) |
| `hourly_rate` | float | Yes | - | Cost per person per hour ($15-$500) |
| `error_rate` | float | No | 0 | Percentage of runs with errors (0-50) |
| `error_fix_cost` | float | No | 0 | Dollar cost to fix each error |
| `error_fix_hours` | float | No | 0 | Hours to fix each error |
| `has_sla` | bool | No | false | Has SLA requirements? |
| `sla_penalty` | float | No | 0 | Penalty per SLA breach |
| `sla_breaches_year` | int | No | 0 | Expected breaches per year |
| `current_tool_cost` | float | No | 0 | Current annual tool costs |
| `implementation_cost` | float | Yes | - | One-time automation cost ($1k-$500k) |
| `volume_growth` | float | No | 0 | Expected annual volume growth % |
| `expected_labor_reduction` | float | No | 70 | Expected % labor savings (0-100) |
| `expected_error_reduction` | float | No | 80 | Expected % error reduction (0-100) |
| `expected_sla_improvement` | float | No | 75 | Expected % SLA improvement (0-100) |

### ROIOutput - Calculation Results

| Field | Type | Description |
|-------|------|-------------|
| `process_name` | string | Echo of input process name |
| `annual_labor_cost` | float | Calculated yearly labor cost |
| `annual_error_cost` | float | Calculated yearly error cost |
| `annual_sla_cost` | float | Calculated yearly SLA penalty cost |
| `annual_tool_cost` | float | Current annual tool costs |
| `total_current_cost` | float | Sum of all current costs |
| `automation_savings_percent` | float | Percentage of costs saved |
| `annual_savings` | float | Projected yearly savings in dollars |
| `payback_months` | float | Months until automation pays for itself |
| `roi_percentage` | float | First-year return on investment |
| `five_year_savings` | float | Cumulative 5-year net savings |
| `priority_score` | string | "High", "Medium", or "Low" |
| `recommendation` | string | Actionable advice text |
| `confidence_level` | string | "High", "Medium", or "Low" |
| `assumptions` | list | User inputs used in calculations |

---

## Calculation Formulas

### Step 1: Calculate Annual Run Frequency

```
periods_per_year = based on frequency selection and work schedule
runs_per_year = runs_per_period × periods_per_year
```

Period mapping:
- EVERY_MINUTE: working_days × hours_per_day × 60
- HOURLY: working_days × hours_per_day
- DAILY: working_days
- WEEKLY: 52
- BIWEEKLY: 26
- MONTHLY: 12
- QUARTERLY: 4

### Step 2: Calculate Current Costs

**Labor Cost:**
```
annual_labor_cost = hours_per_run × runs_per_year × staff_count × hourly_rate
```

**Error Cost:**
```
errors_per_year = runs_per_year × (error_rate / 100)
cost_per_error = error_fix_cost + (error_fix_hours × hourly_rate)
annual_error_cost = errors_per_year × cost_per_error
```

**SLA Cost:**
```
annual_sla_cost = sla_breaches_year × sla_penalty
```

**Total Current Cost:**
```
total_current_cost = labor + error + sla + tool_cost
```

### Step 3: Calculate Projected Savings

Using user-provided reduction percentages:

```
labor_savings = annual_labor_cost × (expected_labor_reduction / 100)
error_savings = annual_error_cost × (expected_error_reduction / 100)
sla_savings = annual_sla_cost × (expected_sla_improvement / 100)
tool_savings = annual_tool_cost × 0.30  # 30% estimated

annual_savings = labor_savings + error_savings + sla_savings + tool_savings
```

### Step 4: Calculate ROI Metrics

**Payback Period (months):**
```
payback_months = (implementation_cost / annual_savings) × 12
```

**ROI Percentage (Year 1):**
```
roi_percentage = ((annual_savings - implementation_cost) / implementation_cost) × 100
```

**5-Year Savings:**
```
cumulative = 0
current_savings = annual_savings

for each year (0 to 4):
    cumulative += current_savings
    current_savings *= (1 + volume_growth/100)

five_year_savings = cumulative - implementation_cost
```

### Step 5: Generate Recommendation

| Condition | Priority Score |
|-----------|----------------|
| Payback ≤ 12 months AND ROI > 50% | High |
| Payback ≤ 24 months AND ROI > 0% | Medium |
| Otherwise | Low |

---

## API Reference

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy"
}
```

### Calculate ROI

```
POST /calculate
Content-Type: application/json
```

Request Body: (ROIInput JSON)

Response: (ROIOutput JSON)

---

## Configuration

### CalculatorConfig

Located in `calculator.py`:

| Setting | Value | Description |
|---------|-------|-------------|
| `HIGH_PRIORITY_THRESHOLD` | 12 | Max payback months for "High" priority |
| `MEDIUM_PRIORITY_THRESHOLD` | 24 | Max payback months for "Medium" priority |
| `HIGH_PRIORITY_ROI` | 50 | Minimum ROI % for "High" priority |
| `DEFAULT_TOOL_SAVINGS_RATE` | 0.30 | Estimated tool cost savings (30%) |

---

## Running the Application

### Development

```bash
cd backend
source ../venv/bin/activate  # Activate virtual environment
uvicorn main:app --reload    # Start with auto-reload
```

### Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Testing

### Manual API Test

```bash
curl -X POST http://localhost:8000/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "process_name": "Invoice Processing",
    "frequency": "daily",
    "runs_per_period": 20,
    "hours_per_run": 0.5,
    "staff_count": 3,
    "hourly_rate": 35,
    "error_rate": 5,
    "error_fix_cost": 50,
    "implementation_cost": 25000
  }'
```

---

## Version History

- **v0.1.0** - Week 1: Core calculation engine and data models
- **v0.2.0** - Week 2: Frontend, PDF reports, deployment (planned)
- **v0.3.0** - Week 3: Authentication, monetization (planned)
