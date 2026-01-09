---
description: Master workflow - READ THIS FIRST before making any changes to the AutomateROI project
---

# AutomateROI Development Guidelines

> **IMPORTANT**: This is the master workflow file. AI agents MUST read the referenced guideline files before implementing any features.

---

## Quick Start Checklist

Before starting ANY work on this project:

1. **Read UI Guidelines** → `/ui-guidelines` (required for all frontend work)
2. **Read Code Standards** → `/code-standards` (required for all code changes)
3. **Follow Commit Workflow** → `/commit-changes` (required after completing work)

---

## Project Overview

**AutomateROI** is a production-ready web application for calculating automation ROI.

| Component | Technology | Directory |
|-----------|------------|-----------|
| Frontend | React 19, Vite 7, Chart.js | `/app/src/` |
| Backend | FastAPI, Python 3.11 | `/backend/` |
| Styling | CSS Modules, CSS Variables | `*.module.css` |
| State | React Context, localStorage | `/app/src/context/` |

---

## Mandatory Reading Order

### For Frontend Work
```
1. .agent/workflows/ui-guidelines.md (UI/UX standards)
2. .agent/workflows/code-standards.md (code patterns)
3. app/src/styles/variables.css (design tokens)
4. .agent/workflows/commit-changes.md (git workflow)
```

### For Backend Work
```
1. .agent/workflows/code-standards.md (code patterns)
2. backend/models.py (data models)
3. .agent/workflows/commit-changes.md (git workflow)
```

---

## Critical Rules (Never Break These)

### UI/UX
- ❌ **NO EMOJIS** in UI — use SVG icons from `Icons.jsx`
- ❌ **NO hardcoded colors** — use CSS variables
- ❌ **NO inline styles** — use CSS Modules
- ❌ **NO arbitrary spacing** — use spacing variables
- ✅ **Always support dark mode** via CSS variables
- ✅ **Always add focus states** for accessibility

### Code Quality
- ❌ **NO console.log** in production code
- ❌ **NO hardcoded API URLs** — use environment variables
- ✅ **Always handle loading states**
- ✅ **Always handle error states**
- ✅ **Always handle empty states**

### Git Workflow
- ✅ **Always commit after completing a feature**
- ✅ **Use conventional commit messages** (feat:, fix:, etc.)
- ✅ **Keep commits atomic** — one feature per commit

---

## File Structure Reference

```
automation-roi-calculator/
├── .agent/workflows/          # AI Guidelines (READ THESE FIRST)
│   ├── start-here.md          # This file - master workflow
│   ├── ui-guidelines.md       # UI/UX design standards
│   ├── code-standards.md      # Code patterns and conventions
│   └── commit-changes.md      # Git commit workflow
├── app/                       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── calculator/    # Calculator-specific components
│   │   │   ├── home/          # Homepage components
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── playground/    # Playground components
│   │   │   └── ui/            # Reusable UI primitives
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── styles/            # Global CSS and variables
│   │   └── utils/             # Utility functions
│   └── package.json
├── backend/                   # Python FastAPI Backend
│   ├── main.py                # API server and routes
│   ├── calculator.py          # ROI calculation logic
│   ├── models.py              # Pydantic data models
│   └── pdf_generator.py       # PDF report generation
└── docs/                      # Documentation
```

---

## Component Creation Checklist

When creating a new component, ensure:

- [ ] Component file: `ComponentName.jsx`
- [ ] Styles file: `ComponentName.module.css`
- [ ] Uses CSS variables (no hardcoded values)
- [ ] Works in light and dark mode
- [ ] Responsive (test at 480px, 768px, 1024px)
- [ ] Has focus states for interactive elements
- [ ] Uses icons from `Icons.jsx` (no emojis)
- [ ] Follows existing component patterns
- [ ] Proper ARIA attributes for accessibility

---

## Page Creation Checklist

When creating a new page:

- [ ] Add page file to `/app/src/pages/`
- [ ] Add CSS module file alongside
- [ ] Add route in `App.jsx`
- [ ] Add navigation link in `Header.jsx` (desktop + mobile)
- [ ] Include `padding-top: var(--header-height)` for fixed header
- [ ] Handle loading, empty, and error states
- [ ] Test dark mode and responsive design

---

## API Patterns

### Frontend API Calls
```javascript
// Use the API helper from utils/api.js
import { calculateROI, generatePDF } from '../utils/api';

// API URL is environment-aware
const API_URL = import.meta.env.PROD
    ? 'https://automation-roi-calculator-production.up.railway.app'
    : 'http://localhost:8007';
```

### Backend API Routes
```python
# Use FastAPI with Pydantic models
from models import ROIInput, ROIOutput

@app.post("/calculate")
def calculate(inputs: ROIInput) -> ROIOutput:
    # Implementation
```

---

## Quick Reference Links

| Workflow | Path | Description |
|----------|------|-------------|
| `/start-here` | This file | Master workflow, read first |
| `/ui-guidelines` | UI/UX standards | Colors, typography, spacing |
| `/code-standards` | Code patterns | Components, API, testing |
| `/commit-changes` | Git workflow | Commit messages, branching |

---

*Last updated: January 2026*
