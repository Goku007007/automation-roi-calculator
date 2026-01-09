# AutomateROI - Automation ROI Calculator

**GitHub Repository:** [github.com/Goku007007/automation-roi-calculator](https://github.com/Goku007007/automation-roi-calculator)

---

## Project Overview

AutomateROI is a production-ready, full-stack web application that helps organizations make data-driven decisions about automation investments. The tool provides instant ROI calculations, visual analytics, scenario comparisons, and professional PDF report generation.

---

## The Problem I Solved

Organizations evaluating automation investments face critical challenges:

1. **No standardized ROI methodology** - Teams use inconsistent calculations across spreadsheets, leading to misallocated resources and rejected proposals
2. **Time-consuming analysis** - Building proper ROI models from scratch takes hours of manual spreadsheet work
3. **Communication gaps** - Technical teams struggle to present business value to finance departments and executives
4. **Expensive enterprise tools** - Most ROI calculators are locked behind enterprise software licenses

---

## The Solution

I built a free, open-source tool that:

- Calculates ROI instantly from 7 simple inputs
- Visualizes the business case with interactive charts
- Generates branded PDF reports for executive presentations
- Compares base, best, and worst case scenarios side-by-side
- Estimates costs for popular automation platforms (Zapier, Make, n8n)

---

## Key Features

### Core Functionality
- **ROI Calculator** - Calculate payback period, annual savings, ROI percentage, and 5-year projections
- **Scenario Comparison** - Compare base/best/worst case scenarios with visual charts
- **What-If Sliders** - Adjust key parameters and see real-time impact on ROI
- **Cost Playground** - Estimate costs for Zapier, Make, n8n, Power Automate
- **PDF Reports** - Generate professional, branded reports with charts and recommendations
- **Project Saving** - Save and load multiple projects using local storage

### Technical Features
- Modern React 18 frontend with Vite
- High-performance FastAPI backend
- Responsive design (desktop, tablet, mobile)
- Dark/Light mode with automatic detection
- RESTful API with automatic OpenAPI documentation

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite 5 | Modern component-based UI with fast HMR |
| **Routing** | React Router 6 | Client-side navigation |
| **Styling** | CSS Modules, CSS Variables | Scoped styles with design system tokens |
| **Charts** | Chart.js 4 | Interactive data visualizations |
| **Backend** | FastAPI, Python 3.11 | High-performance async API |
| **Validation** | Pydantic 2 | Type-safe request/response models |
| **PDF Generation** | FPDF2 | Professional PDF report creation |
| **Server** | Uvicorn | ASGI server for production |

---

## Architecture

```
FRONTEND (React + Vite)
+------------------------------------------------------------------+
|  Components          Pages              Hooks         Utils      |
|  - Calculator        - Home             - useTheme    - formatters|
|  - Results           - Playground       - useProjects - calculators|
|  - Charts            - ScenarioCompare                           |
|  - PDFOptions                                                    |
+------------------------------------------------------------------+
                              |
                              | HTTP/REST (JSON)
                              v
+------------------------------------------------------------------+
|                       BACKEND (FastAPI)                          |
|  +----------------+  +------------------+  +------------------+  |
|  | main.py        |  | roi_calculator.py|  | pdf_generator.py |  |
|  | API Routes     |  | Business Logic   |  | Report Generation|  |
|  +----------------+  +------------------+  +------------------+  |
|                                                                  |
|  +----------------+  +------------------+                        |
|  | models.py      |  | requirements.txt |                        |
|  | Pydantic Models|  | Dependencies     |                        |
|  +----------------+  +------------------+                        |
+------------------------------------------------------------------+
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `POST` | `/calculate` | Calculate ROI from input parameters |
| `POST` | `/generate-pdf` | Generate PDF report with branding options |

### Example API Request

```bash
curl -X POST https://api.example.com/calculate \
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
```

### Example Response

```json
{
  "process_name": "Invoice Processing",
  "annual_labor_cost": 225000,
  "annual_savings": 157500,
  "implementation_cost": 5000,
  "payback_months": 0.4,
  "roi_percentage": 3050,
  "five_year_savings": 782500,
  "priority_score": "High",
  "recommendation": "Strong automation candidate with immediate payback..."
}
```

---

## Project Structure

```
automation-roi-calculator/
|-- app/                        # React frontend (Vite)
|   |-- src/
|   |   |-- components/         # Reusable UI components
|   |   |   |-- calculator/     # Calculator-specific components
|   |   |   |-- ui/             # Generic UI components
|   |   |-- pages/              # Page components
|   |   |-- hooks/              # Custom React hooks
|   |   |-- utils/              # Utility functions
|   |   |-- styles/             # Global CSS and design tokens
|   |-- package.json
|-- backend/                    # Python FastAPI backend
|   |-- main.py                 # API server and routes
|   |-- roi_calculator.py       # Core calculation logic
|   |-- pdf_generator.py        # PDF report generation
|   |-- models.py               # Pydantic data models
|   |-- requirements.txt        # Python dependencies
|-- docs/                       # Documentation and screenshots
|-- README.md
```

---

## What I Learned

- Designing intuitive UIs for complex financial calculations
- Building RESTful APIs with FastAPI and Pydantic for type-safe data validation
- Generating professional PDF reports programmatically
- Implementing responsive design with CSS Modules and CSS Variables
- Creating interactive data visualizations with Chart.js
- Managing application state and local storage for project persistence

---

## Future Enhancements

- User authentication and cloud project storage
- Team collaboration features
- Export to Excel/CSV
- Integration with automation platforms via APIs
- Historical ROI tracking and dashboards

---

## Links

- **GitHub:** [github.com/Goku007007/automation-roi-calculator](https://github.com/Goku007007/automation-roi-calculator)
- **License:** MIT (free for personal and commercial use)
