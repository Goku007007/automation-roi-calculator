---
description: Master project guidelines - READ THIS FIRST before making any changes to AutomateROI
---

# AutomateROI Project Guidelines

**IMPORTANT: Read these guidelines completely before making ANY changes to this codebase.**

This document serves as the master reference for all development work on the AutomateROI application. It ensures consistency across all contributions.

---

## Quick Reference: Which Guidelines to Read

| Task Type | Required Reading |
|-----------|-----------------|
| **Frontend/UI work** | This file + `/ui-guidelines` |
| **Backend/API work** | This file + `/backend-guidelines` |
| **Database changes** | This file + `/backend-guidelines` |
| **New feature** | This file + `/ui-guidelines` + `/backend-guidelines` |
| **Bug fix** | This file + relevant area guidelines |
| **Committing code** | `/commit-changes` |

---

## 1. Project Overview

### What is AutomateROI?
A production-ready web application that helps organizations calculate ROI for automation investments. It provides:
- ROI calculations from simple inputs
- Scenario comparisons (base/best/worst)
- Professional PDF report generation
- Cost estimation for automation platforms
- Portfolio dashboard for aggregate metrics

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 7, React Router 7, Chart.js 4 |
| **Backend** | FastAPI, Python 3.11, Pydantic 2 |
| **Styling** | CSS Modules, CSS Variables |
| **Database** | SQLAlchemy + SQLite |
| **PDF** | ReportLab |

---

## 2. Project Structure

```
automation-roi-calculator/
├── .agent/workflows/         # AI agent guidelines (YOU ARE HERE)
│   ├── project-guidelines.md # Master guidelines (this file)
│   ├── ui-guidelines.md      # Frontend/UI design system
│   ├── backend-guidelines.md # API/Backend conventions
│   └── commit-changes.md     # Git commit workflow
├── app/                      # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── calculator/   # Calculator-specific
│   │   │   ├── home/         # Home page components
│   │   │   ├── playground/   # Playground components
│   │   │   ├── layout/       # Header, Footer
│   │   │   └── ui/           # Generic UI (Button, Input, Icons)
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context providers
│   │   ├── utils/            # Utility functions
│   │   └── styles/           # Global CSS, design tokens
│   └── package.json
├── backend/
│   ├── main.py               # FastAPI routes
│   ├── calculator.py         # ROI calculation logic
│   ├── pdf_generator.py      # PDF report generation
│   ├── models.py             # Pydantic models
│   ├── database.py           # SQLAlchemy setup
│   └── requirements.txt
└── docs/                     # Documentation
```

---

## 3. Development Principles

### Core Values
1. **Consistency First** - Follow existing patterns exactly
2. **Read Before Write** - Understand existing code before adding new
3. **UI Guidelines Are Law** - See `/ui-guidelines` for all frontend work
4. **Test Your Changes** - Run the dev server and verify visually
5. **Commit Often** - Small, focused commits with descriptive messages

### Code Quality Standards
- **No hardcoded values** - Use CSS variables for colors, spacing
- **No inline styles** - Use CSS Modules
- **No emojis in UI** - Use SVG icons from `Icons.jsx`
- **Proper error handling** - Always handle API failures gracefully
- **Accessibility** - Follow WCAG 2.1 AA guidelines

---

## 4. Before Starting Any Work

### Step 1: Read Relevant Guidelines
```bash
# For frontend work
/ui-guidelines

# For backend work
/backend-guidelines

# For commits
/commit-changes
```

### Step 2: Understand Existing Patterns
Before creating a new component or page:
1. Look at similar existing components
2. Copy the file structure pattern
3. Match naming conventions exactly

### Step 3: Run Development Server
```bash
# Frontend (Terminal 1)
cd app && npm run dev

# Backend (Terminal 2)  
cd backend && python main.py
```

### Step 4: Verify in Browser
- Test in both light and dark mode
- Test responsive breakpoints (480px, 768px, 1024px)
- Check browser console for errors

---

## 5. File Naming Conventions

### Frontend
| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `ProjectList.jsx` |
| CSS Modules | ComponentName.module.css | `ProjectList.module.css` |
| Pages | PascalCase | `Portfolio.jsx` |
| Hooks | camelCase, prefix `use` | `useProjects.js` |
| Utils | camelCase | `api.js`, `scenarios.js` |

### Backend
| Type | Pattern | Example |
|------|---------|---------|
| Modules | snake_case | `pdf_generator.py` |
| Classes | PascalCase | `ROIInput` |
| Functions | snake_case | `calculate_roi()` |
| Constants | UPPER_SNAKE | `HIGH_PRIORITY_THRESHOLD` |

---

## 6. Adding New Features

### Frontend Feature Checklist
- [ ] Read `/ui-guidelines` completely
- [ ] Create component file: `FeatureName.jsx`
- [ ] Create styles file: `FeatureName.module.css`
- [ ] Use CSS variables only (no hardcoded colors)
- [ ] Support dark mode
- [ ] Make responsive (test at 480px, 768px, 1024px)
- [ ] Add to router in `App.jsx` if it's a page
- [ ] Add navigation link in `Header.jsx` if needed
- [ ] Test in browser
- [ ] Commit with descriptive message

### Backend Feature Checklist
- [ ] Read `/backend-guidelines` completely
- [ ] Add Pydantic models in `models.py`
- [ ] Add route in `main.py`
- [ ] Add business logic in appropriate module
- [ ] Include proper error handling
- [ ] Add rate limiting if needed
- [ ] Test with curl or browser
- [ ] Commit with descriptive message

---

## 7. Common Patterns

### Creating a New Page
```jsx
// 1. Create MyPage.jsx
import styles from './MyPage.module.css';

export default function MyPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Page Title</h1>
                {/* content */}
            </div>
        </div>
    );
}

// 2. Create MyPage.module.css
.page {
    padding-top: var(--header-height);
    min-height: 100vh;
}

.container {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg) var(--spacing-2xl);
}

// 3. Add route in App.jsx
<Route path="/my-page" element={<MyPage />} />

// 4. Add nav link in Header.jsx (if needed)
<NavLink to="/my-page">My Page</NavLink>
```

### Creating a New Component
```jsx
// 1. Create in appropriate folder (ui/, calculator/, etc.)
import styles from './MyComponent.module.css';

export default function MyComponent({ prop1, prop2 }) {
    return (
        <div className={styles.container}>
            {/* Use CSS variables, not hardcoded values */}
        </div>
    );
}

// 2. CSS uses only variables
.container {
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
}
```

---

## 8. Git Workflow

### Commit Message Format
```
<type>: <brief description>

Types:
- feat:     New feature
- fix:      Bug fix
- refactor: Code refactoring
- style:    UI/CSS changes
- docs:     Documentation
- chore:    Build/config changes
```

### Example Commits
```bash
git commit -m "feat: Add Portfolio Dashboard with aggregate metrics"
git commit -m "fix: Correct header padding in Portfolio page"
git commit -m "style: Update KPI card hover states"
```

---

## 9. API Conventions

### Endpoint Patterns
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| POST | `/calculate` | Calculate ROI |
| POST | `/generate-pdf` | Generate PDF |
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |

### Response Format
```json
{
  "field": "value",
  "nested": {
    "data": "here"
  }
}
```

Errors use HTTP status codes with JSON detail:
```json
{
  "detail": "Error message here"
}
```

---

## 10. Testing Checklist

Before committing any frontend changes:
- [ ] No console errors
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive at 480px (mobile)
- [ ] Responsive at 768px (tablet)
- [ ] Responsive at 1024px (desktop)
- [ ] Focus states visible for interactive elements
- [ ] Matches existing component patterns

---

## 11. Quick Commands

```bash
# Start frontend
cd app && npm run dev

# Start backend
cd backend && python main.py

# Install frontend deps
cd app && npm install

# Install backend deps
cd backend && pip install -r requirements.txt

# Build frontend for production
cd app && npm run build

# Stage and commit
git add -A && git commit -m "type: description"
```

---

## 12. Key Files Reference

| Purpose | File |
|---------|------|
| Design tokens | `app/src/styles/variables.css` |
| Global styles | `app/src/styles/global.css` |
| SVG Icons | `app/src/components/ui/Icons.jsx` |
| API utilities | `app/src/utils/api.js` |
| Projects hook | `app/src/hooks/useProjects.js` |
| Router | `app/src/App.jsx` |
| Navigation | `app/src/components/layout/Header.jsx` |
| Backend routes | `backend/main.py` |
| Calculation logic | `backend/calculator.py` |
| Data models | `backend/models.py` |

---

*Last updated: January 2026*
*Remember: Consistency is more important than perfection. When in doubt, copy an existing pattern.*
