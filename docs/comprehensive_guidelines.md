# Comprehensive Development Guidelines for AutomateROI

**STATUS: ACTIVE**
**LAST UPDATED: January 2026**

This document serves as the **SINGLE SOURCE OF TRUTH** for all AI agents and developers working on the `automation-roi-calculator` project. Strict adherence to these patterns is required to maintain code quality, UI consistency, and system stability.

---

## 1. UI/UX & Design System

### 1.1 Core Philosophy
- **Professional B2B SaaS**: Clean, data-driven, trustworthy.
- **Data First**: Metrics (ROI, Savings) are the heroes.
- **Accessibility**: WCAG 2.1 AA compliant (contrasts, aria-labels, focus rings).
- **Zero Emojis**: Use SVG icons from `Icons.jsx` ONLY. Emojis are strictly forbidden in UI elements.

### 1.2 Design Tokens (CSS Variables)
**Files**: `app/src/styles/variables.css`, `app/src/styles/global.css`

#### Colors
| Token | Value | usage |
|-------|-------|-------|
| `--accent` | `#3b82f6` (Blue) | Primary actions, links, active states |
| `--success` | `#10b981` (Green) | Positive metrics, success states |
| `--warning` | `#f59e0b` (Amber) | Medium priority, cautions |
| `--danger` | `#ef4444` (Red) | Errors, negative values, removals |
| `--text-primary` | `#1e293b` (Dark Slate) | Headings, main content |
| `--text-secondary` | `#64748b` (Slate) | Descriptions, body text |
| `--text-muted` | `#94a3b8` (Light Slate) | Placeholders, helpers |
| `--bg-secondary` | `#f8fafc` | Cards, panels |

#### Spacing
- **NEVER** use pixel values for margin/padding.
- Use: `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px), `--spacing-2xl` (48px).

#### Typography
- **Headings**: `IBM Plex Serif` - e.g., `font-family: 'IBM Plex Serif', serif;`
- **Body**: `Inter` - e.g., `font-family: 'Inter', sans-serif;`
- **Metrics**: Use tabular nums for data tables: `font-variant-numeric: tabular-nums;`

### 1.3 Component Patterns

#### Cards
```css
.card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
}
```

#### Buttons
- **Primary**: Solid background `--accent`, white text.
- **Secondary**: Transparent background, border `--border`, `--text-primary`.
- **Ghost**: No border, hover effect only.

#### Icons
- Import from `@/components/ui/Icons`.
- Default size: `20px` or `24px`.
- Use `currentColor` stroke.
- **Example**: `<DollarIcon size={20} />`

---

## 2. Frontend Architecture (React + Vite)

### 2.1 File Structure
```
app/src/
├── components/
│   ├── ui/               # Generic atoms (Button, Input, Icons)
│   ├── calculator/       # Feature-specific (Results, ROIForm)
│   ├── layout/           # Header, Footer
├── pages/                # Route interactions (Portfolio, Calculator)
├── hooks/                # Custom hooks (useProjects, useToast)
├── context/              # React Context (Theme, Toast)
└── styles/               # Global CSS & Variables
```

### 2.2 CSS Modules
- use `ComponentName.module.css`.
- Classes should be `camelCase`.
- **Do not** use Tailwind (unless explicitly requested, but project defaults to CSS Modules).

### 2.3 State Management
- Use `useState` for local component state.
- Use `useContext` for global application state (Theme, Toasts).
- Use `useProjects` hook for data persistence (localStorage + API).

### 2.4 Hooks Pattern (`useProjects`)
- Encapsulate data fetching logic.
- Return `{ data, isLoading, error, actions }`.
- Handle loading/error states internally.

---

## 3. Backend Architecture (FastAPI + Python)

### 3.1 Standards
- **Framework**: FastAPI.
- **Typing**: Strict type hints with Pydantic models.
- **Docstrings**: Required for all functions/classes (Google style).

### 3.2 Models (`backend/models.py`)
- Use `pydantic.BaseModel` for all schemas.
- Field descriptions are mandatory (used for API docs).
- Use `Enum` for constrained choices (e.g., `Frequency`).

### 3.3 API Endpoints
- **RESTful**: `GET /projects`, `POST /projects`, `DELETE /projects/{id}`.
- **Dependency Injection**: Use `Depends` for DB sessions or shared logic.
- **Validation**: Rely on Pydantic validation; do not write custom validation unless complex.

---

## 4. Development Workflow & Rules

### 4.1 "Golden Rules" for AI Agents
1. **Read Before Write**: Always `view_file` relevant context before editing.
2. **Check Guidelines**: Verify UI changes against `ui-guidelines.md`.
3. **No Magic Numbers**: Use CSS variables for everything (colors, spacing, radius).
4. **Mobile First**: responsive breakpoints (`max-width: 480px`, `768px`) must be handled.
5. **Incremental Commits**: Commit logical chunks of work with descriptive messages.

### 4.2 Error Handling
- **Frontend**: Show user-friendly Toasts for success/error. Fallback UI for fatal errors.
- **Backend**: Return standard HTTP exceptions (400, 404, 500) with clear details.

### 4.3 Documentation
- Update `task.md` continuously.
- Update `implementation_plan.md` before starting big tasks.
- Keep `README.md` and `docs/` up to date with new features.

---

## 5. Verification Checklist

Before marking a task as "Done", verify:
- [ ] UI looks good in **Dark Mode** & **Light Mode**.
- [ ] No layout breakages on **Mobile** (375px width).
- [ ] All new text scales correctly with content.
- [ ] No console errors (React keys, invalid DOM nesting).
- [ ] Navigation flows work (links active, back buttons).
- [ ] **NO EMOJIS** in the UI.

---
**End of Guidelines**
