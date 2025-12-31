# Automation ROI Calculator

An open source tool that helps organizations calculate the financial return on investment (ROI) for automating manual processes.

## Features

- Calculate annual cost savings from automation
- Determine payback period for automation investments
- Generate priority recommendations based on ROI metrics
- Download PDF reports for sharing
- Optional JWT authentication

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Goku007007/automation-roi-calculator.git
cd automation-roi-calculator

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
cd backend
python main.py
```

Open `frontend/index.html` in your browser.

## API

- Server runs at `http://localhost:8007`
- Interactive docs at `http://localhost:8007/docs`
- Health check: `GET /health`
- Calculate ROI: `POST /calculate`
- Generate PDF: `POST /generate-pdf`

## Optional: Enable Authentication

```bash
REQUIRE_AUTH=true python main.py
```

When enabled, get a token from `GET /token` and include it in requests.

## Tech Stack

- **Backend**: Python, FastAPI, Pydantic
- **Frontend**: HTML, CSS, JavaScript
- **PDF**: ReportLab

## Documentation

See [DOCS.md](DOCS.md) for detailed technical documentation.

## License

MIT License