# Automation ROI Calculator

An open source tool that helps organizations calculate the financial return on investment (ROI) for automating manual processes.

## Features

- Calculate annual cost savings from automation
- Determine payback period for automation investments
- Generate priority recommendations based on ROI metrics
- Transparent calculations with user-provided projections
- Download PDF reports for sharing

## Tech Stack

- **Backend**: Python, FastAPI
- **Data Validation**: Pydantic
- **Frontend**: HTML, CSS, JavaScript

## Installation

```bash
# Clone the repository
git clone https://github.com/Goku007007/automation-roi-calculator.git
cd automation-roi-calculator

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

## Usage

**Start the backend:**
```bash
cd backend
python main.py
```

**Open the frontend:**
Open `frontend/index.html` in your browser.

API available at `http://localhost:8000`

Interactive API docs at `http://localhost:8000/docs`

## Documentation

See [DOCS.md](DOCS.md) for technical documentation.

## License

MIT License