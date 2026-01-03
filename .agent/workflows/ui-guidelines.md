---
description: UI/UX design guidelines and knowledge base for AutomateROI application
---

# AutomateROI UI/UX Design Guidelines

This document serves as the definitive design system reference for the AutomateROI application. **All frontend modifications must adhere to these guidelines.**

---

## 1. Design Philosophy

### Brand Identity
- **Professional yet approachable**: B2B SaaS for finance/operations teams
- **Data-driven credibility**: Numbers, metrics, and ROI are central
- **Clean and focused**: Reduce cognitive load, guide users to action
- **Trust-building**: Enterprise-ready aesthetics that CFOs would approve

### Core Principles
1. **Clarity over cleverness** — Users should understand immediately
2. **Consistency builds trust** — Same patterns everywhere
3. **Progressive disclosure** — Show essentials first, details on demand
4. **Accessibility first** — WCAG 2.1 AA compliance minimum
5. **No emojis in UI** — Use SVG icons for professional appearance

### Brand Assets

#### Logo
- **Primary logo**: `/public/logo.svg` (SVG for scalability)
- **Logo placement**: Top-left in header, links to home
- **Minimum size**: 120px width
- **Clear space**: Maintain padding equal to logo height around it
- **Do NOT**: Distort, recolor, or add effects to the logo

#### Favicon
- **Location**: `/public/favicon.png`
- **Sizes**: 32x32 (primary), 16x16, 180x180 (Apple touch icon)
- **Format**: PNG with transparency
- **Design**: Simplified version of brand mark, works at small sizes

#### Asset Guidelines
```
public/
├── logo.svg          # Main logo (header, PDF reports)
├── favicon.png       # Browser tab icon
└── vite.svg          # Development only, not for production
```

### Content Guidelines

#### Text Tone
- **Professional**: B2B audience, finance/operations decision-makers
- **Concise**: Short sentences, clear labels
- **Action-oriented**: "Calculate ROI" not "Click here to calculate"

#### Prohibited Elements
| Element | Alternative |
|---------|-------------|
| ❌ Emojis (📊, ✅, 🚀) | ✓ SVG icons from `Icons.jsx` |
| ❌ Casual slang | ✓ Professional language |
| ❌ Exclamation marks (!!!) | ✓ Single or none |
| ❌ ALL CAPS for emphasis | ✓ Bold text |

#### Why No Emojis?
- **Inconsistent rendering** across browsers/OS
- **Unprofessional** for enterprise B2B audience
- **Accessibility issues** — screen readers handle them poorly
- **Brand consistency** — SVG icons match our design system

#### Icon Alternatives
Instead of emojis, use icons from `components/ui/Icons.jsx`:
```jsx
// ❌ Bad: Using emoji
<span>📊 Monthly Reporting</span>

// ✅ Good: Using SVG icon
<span><ChartIcon size={16} /> Monthly Reporting</span>

// ✅ Good: Category badge (no icon needed)
<span className={styles.category}>Operations</span>
```

---

## 2. Color System

### Primary Palette
Always use CSS variables, never hardcoded colors.

```css
/* Brand */
--accent: #3b82f6;        /* Primary blue - CTAs, links, focus */
--accent-hover: #2563eb;  /* Darker blue - hover states */

/* Semantic */
--success: #10b981;       /* Green - positive metrics, savings */
--warning: #f59e0b;       /* Amber - caution, medium priority */
--danger: #ef4444;        /* Red - errors, negative values */
```

### Background Hierarchy
```css
--bg-primary: #ffffff;    /* Main content area */
--bg-secondary: #f8fafc;  /* Cards, form sections */
--bg-tertiary: #f1f5f9;   /* Nested elements, badges */
```

### Text Colors
```css
--text-primary: #1e293b;   /* Headings, primary content */
--text-secondary: #64748b; /* Body text, descriptions */
--text-muted: #94a3b8;     /* Helper text, placeholders */
```

### Dark Mode
Dark mode is automatic based on system preference with manual override.
All components must support both themes via CSS variables.

```css
/* Dark mode overrides */
[data-theme="dark"] {
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --text-primary: #fafafa;
    --accent: #60a5fa;  /* Lighter blue for dark backgrounds */
}
```

### Color Usage Rules
| Context | Color Variable | Example |
|---------|---------------|---------|
| Primary buttons | `--accent` | Calculate, Submit |
| Positive numbers | `--success` | Savings, ROI% |
| Warnings, medium priority | `--warning` | "Medium Priority" badge |
| Errors, negative values | `--danger` | Error messages, costs |
| Links | `--accent` | Navigation, inline links |

---

## 3. Typography

### Font Families
```css
/* Body text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Headings */
font-family: 'IBM Plex Serif', Georgia, serif;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| h1 | 2.25rem (36px) | 600 | 1.3 |
| h2 | 1.75rem (28px) | 600 | 1.3 |
| h3 | 1.25rem (20px) | 600 | 1.3 |
| h4 | 1.125rem (18px) | 600 | 1.3 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |
| Caption | 0.75rem (12px) | 400 | 1.4 |

### Typography Rules
- Headings use **IBM Plex Serif** (serif) for distinction
- Body text uses **Inter** (sans-serif) for readability
- Maximum line length: ~70 characters for body text
- Use `--text-secondary` for descriptions, not black

---

## 4. Spacing System

Use spacing variables consistently. Never use arbitrary pixel values.

```css
--spacing-xs: 0.25rem;  /* 4px  - Tight gaps */
--spacing-sm: 0.5rem;   /* 8px  - Related elements */
--spacing-md: 1rem;     /* 16px - Section padding */
--spacing-lg: 1.5rem;   /* 24px - Card padding */
--spacing-xl: 2rem;     /* 32px - Major sections */
--spacing-2xl: 3rem;    /* 48px - Page sections */
```

### Spacing Guidelines
| Context | Spacing |
|---------|---------|
| Within form groups | `--spacing-xs` to `--spacing-sm` |
| Between form fields | `--spacing-md` |
| Card padding | `--spacing-lg` |
| Section gaps | `--spacing-xl` to `--spacing-2xl` |
| Button gap (icon + text) | `--spacing-sm` |

---

## 5. Border Radius

```css
--radius-sm: 4px;   /* Small elements: badges, tags */
--radius-md: 8px;   /* Default: buttons, inputs, cards */
--radius-lg: 12px;  /* Large cards, modals */
--radius-xl: 16px;  /* Hero sections, feature cards */
```

### Radius Rules
- Buttons: `--radius-md`
- Inputs/Selects: `--radius-md`
- Cards: `--radius-lg`
- Small badges: `--radius-sm`
- Full round elements: `border-radius: 50%`

---

## 6. Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);   /* Subtle lift */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);  /* Cards */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);  /* Modals, dropdowns */
```

### Shadow Rules
- Cards at rest: `--shadow-sm` or none
- Cards on hover: `--shadow-md`
- Modals/Dropdowns: `--shadow-lg`
- Avoid shadows in dark mode (use borders instead)

---

## 7. Component Patterns

### Buttons

**Variants:**
| Variant | Use Case |
|---------|----------|
| `primary` | Main action (Calculate, Submit, Save) |
| `secondary` | Secondary action (Cancel, Back) |
| `ghost` | Tertiary action (Close, Clear) |
| `destructive` | Delete, Remove |

**Sizes:**
| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 32px | Inline actions, table rows |
| `md` | 40px | Default |
| `lg` | 48px | Primary CTA, form submit |

**States:**
- `:hover` — Slight background change
- `:focus-visible` — 3px focus ring using `--focus-ring-accent`
- `:disabled` — `opacity: 0.6`, `cursor: not-allowed`
- `loading` — Show spinner, disable pointer events

### Inputs

**Structure:**
```jsx
<div className="formGroup">
  <label htmlFor="field">Label *</label>
  <input id="field" ... />
  <span className="helper">Helper text</span>
  {error && <span className="error">{error}</span>}
</div>
```

**States:**
- Default: `border: 1px solid var(--border)`
- Focus: `border-color: var(--accent)` + focus ring
- Error: `border-color: var(--danger)` + error message
- Disabled: `opacity: 0.6`, gray background

### Cards

**Standard card pattern:**
```css
.card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
}

.card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
```

### Tables

- Header: `background: var(--bg-tertiary)`, bold text
- Rows: Alternate subtle backgrounds for readability
- Numbers: Right-aligned, use tabular figures
- Positive values: `color: var(--success)`
- Negative values: `color: var(--danger)`

---

## 8. Layout Patterns

### Page Structure
```
┌─────────────────────────────────────┐
│  Header (64px)                      │
├─────────────────────────────────────┤
│                                     │
│  Main Content                       │
│  max-width: 1200px                  │
│  padding: 0 var(--spacing-lg)       │
│                                     │
└─────────────────────────────────────┘
```

### Layout Variables
```css
--header-height: 64px;
--sidebar-width: 260px;
--content-max-width: 1200px;
```

### Grid Guidelines
- Use CSS Grid or Flexbox, not floats
- 2-column forms on desktop, stack on mobile
- Responsive breakpoints: 480px, 768px, 1024px, 1200px

### Responsive Breakpoints
```css
@media (max-width: 480px)  { /* Mobile */ }
@media (max-width: 768px)  { /* Tablet portrait */ }
@media (max-width: 1024px) { /* Tablet landscape */ }
@media (max-width: 1200px) { /* Small desktop */ }
```

---

## 9. Animation & Transitions

### Transition Speeds
```css
--transition-fast: 150ms ease;    /* Hover states, toggles */
--transition-normal: 200ms ease;  /* Theme changes, expanding */
```

### Animation Guidelines
- Use `transform` and `opacity` for performance
- Hover transitions: `150ms`
- Theme transitions: `200ms`
- Entry animations: `300ms`
- Avoid animations for reduced-motion users:
  ```css
  @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; }
  }
  ```

### Common Transitions
```css
/* Hover lift */
transform: translateY(-2px);

/* Fade in */
opacity: 0 → 1;

/* Scale */
transform: scale(0.95) → scale(1);
```

---

## 10. Icons

### Icon System
- Use SVG icons from `components/ui/Icons.jsx`
- Standard sizes: 16px, 18px, 20px, 24px
- Use `currentColor` for fill/stroke to inherit text color
- Icon-only buttons must have `aria-label`

### Icon Guidelines
```jsx
// Good
<Button icon={<SaveIcon size={16} />}>Save</Button>

// Icon-only (must have aria-label)
<Button variant="ghost" aria-label="Close">
    <XIcon size={18} />
</Button>
```

---

## 11. Accessibility Requirements

### WCAG 2.1 AA Compliance
1. **Color contrast**: Minimum 4.5:1 for text, 3:1 for large text
2. **Focus states**: Visible 3px focus rings on all interactive elements
3. **Labels**: All inputs must have associated labels
4. **Keyboard navigation**: Tab order, Enter to submit, Escape to close
5. **Screen readers**: Proper ARIA attributes, semantic HTML

### Required Patterns
```jsx
// Skip to content link (already implemented)
<a href="#main-content" className="skip-to-content">
    Skip to main content
</a>

// Form accessibility
<label htmlFor="email">Email *</label>
<input 
    id="email" 
    aria-invalid={!!error}
    aria-describedby={error ? "email_error" : undefined}
/>
{error && <span id="email_error" role="alert">{error}</span>}

// Button accessibility
<button aria-label="Close modal" aria-expanded={isOpen}>
```

---

## 12. Form Patterns

### Form Layout
- Single column for simple forms
- Two columns for related fields (e.g., First Name / Last Name)
- Group related fields with section headers
- Required fields marked with `*`

### Validation
- Validate on blur for individual fields
- Validate all on submit
- Show errors inline below the field
- Focus first error field on submit

### Form States
1. **Empty**: Placeholder text in `--text-muted`
2. **Typing**: Default border
3. **Valid**: Optional green checkmark
4. **Error**: Red border + error message
5. **Disabled**: Grayed out, no pointer

---

## 13. Data Display

### Numbers & Metrics
- Use `Intl.NumberFormat` for currency: `$47,520`
- Percentages: One decimal place: `78.5%`
- Large numbers: Abbreviate: `$1.2M`
- Positive/negative colors: green/red

### Charts (Chart.js)
- Use brand colors: `--accent`, `--success`, `--warning`
- Include legends for clarity
- Responsive sizing
- Accessible: Provide data tables as alternative

### KPI Cards
```
┌──────────────────┐
│ Label            │  ← --text-muted, small
│ $47,520          │  ← Large, bold, colored
│ Description      │  ← --text-secondary, caption
└──────────────────┘
```

---

## 14. Feedback Patterns

### Loading States
- Buttons: Show spinner, disable
- Full page: Skeleton loaders
- Sections: Inline spinner

### Success States
- Toast notification (bottom-right)
- Green background, white text
- Auto-dismiss after 4 seconds

### Error States
- Inline: Below the input field
- Toast: For API/network errors
- Modal: For critical errors requiring action

### Empty States
- Centered illustration/icon
- Helpful message
- Action button to get started

---

## 15. File & Folder Conventions

### Component Structure
```
components/
├── ui/                 # Reusable UI primitives
│   ├── Button.jsx
│   ├── Button.module.css
│   ├── Input.jsx
│   └── ...
├── calculator/         # Feature-specific components
│   ├── CalculatorForm.jsx
│   └── ...
├── home/               # Page-specific components
└── layout/             # Header, Footer, etc.
```

### Naming Conventions
- Components: `PascalCase.jsx`
- Styles: `ComponentName.module.css`
- CSS variables: `--category-name` (e.g., `--text-primary`)
- CSS classes: `camelCase` in modules

### CSS Module Pattern
```jsx
import styles from './Component.module.css';

<div className={styles.container}>
    <button className={`${styles.button} ${styles.primary}`}>
```

---

## 16. Checklist for New Components

Before submitting any frontend changes, verify:

- [ ] Uses CSS variables (no hardcoded colors/spacing)
- [ ] Works in both light and dark mode
- [ ] Responsive (test at 480px, 768px, 1024px)
- [ ] Has focus states for interactive elements
- [ ] Proper ARIA attributes for accessibility
- [ ] Follows existing component patterns
- [ ] CSS is in a `.module.css` file
- [ ] No inline styles (except dynamic values)
- [ ] Consistent with spacing scale
- [ ] Typography matches the type scale
- [ ] **No emojis** — use SVG icons from `Icons.jsx`
- [ ] Uses official logos/favicons from `/public`

---

## 17. Quick Reference Card

### Essential Variables
```css
/* Colors */
--accent: #3b82f6
--success: #10b981
--danger: #ef4444

/* Backgrounds */
--bg-primary, --bg-secondary, --bg-tertiary

/* Text */
--text-primary, --text-secondary, --text-muted

/* Spacing */
--spacing-xs (4px), --spacing-sm (8px), --spacing-md (16px)
--spacing-lg (24px), --spacing-xl (32px)

/* Radius */
--radius-sm (4px), --radius-md (8px), --radius-lg (12px)

/* Transitions */
--transition-fast (150ms), --transition-normal (200ms)
```

### Component Import Paths
```jsx
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IconName } from '../components/ui/Icons';
import styles from './YourComponent.module.css';
```

---

*Last updated: January 2026*
*Maintained by: AutomateROI Design System*
