---
description: Code standards and patterns for AutomateROI - READ BEFORE WRITING CODE
---

# AutomateROI Code Standards

This document defines the coding conventions, patterns, and best practices for the AutomateROI project.

---

## 1. File Naming Conventions

### Frontend (React)
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CalculatorForm.jsx` |
| CSS Modules | PascalCase.module.css | `CalculatorForm.module.css` |
| Hooks | camelCase, use prefix | `useProjects.js` |
| Utils | camelCase | `api.js`, `scenarios.js` |
| Pages | PascalCase | `Portfolio.jsx` |
| Context | PascalCase | `ThemeContext.jsx` |

### Backend (Python)
| Type | Convention | Example |
|------|------------|---------|
| Modules | snake_case | `pdf_generator.py` |
| Classes | PascalCase | `ROIInput`, `ROIOutput` |
| Functions | snake_case | `calculate_roi()` |
| Constants | UPPER_SNAKE | `DEFAULT_TOOL_SAVINGS_RATE` |

---

## 2. React Component Patterns

### Standard Component Structure
```jsx
// 1. Imports (external, then internal, then styles)
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRightIcon } from '../components/ui/Icons';
import styles from './ComponentName.module.css';

// 2. Helper functions (outside component)
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(value);
}

// 3. Component definition
export default function ComponentName({ prop1, prop2 }) {
    // State
    const [isLoading, setIsLoading] = useState(false);
    
    // Memoized values
    const computedValue = useMemo(() => {
        // Expensive computation
    }, [dependencies]);
    
    // Event handlers
    const handleClick = () => {
        // Handler logic
    };
    
    // Loading state
    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }
    
    // Empty state
    if (data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No data available</p>
            </div>
        );
    }
    
    // Main render
    return (
        <div className={styles.container}>
            {/* Component content */}
        </div>
    );
}
```

### JSX Best Practices
```jsx
// ✅ Good: Conditional rendering
{items.length > 0 && <ItemList items={items} />}

// ✅ Good: Ternary for two states
{isLoading ? <Spinner /> : <Content />}

// ✅ Good: Fragment for siblings
<>
    <Header />
    <Main />
</>

// ❌ Bad: Nested ternaries
{a ? b ? c : d : e}  // Never do this
```

---

## 3. CSS Module Patterns

### Standard Structure
```css
/* 1. Page/Container styles */
.page {
    padding-top: var(--header-height);
    min-height: 100vh;
}

.container {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg);
}

/* 2. Layout sections */
.header {
    margin-bottom: var(--spacing-xl);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

/* 3. Component-specific styles */
.card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
}

/* 4. State variations */
.card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}

/* 5. Responsive adjustments */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

/* 6. Dark mode adjustments (if needed) */
[data-theme="dark"] .card {
    box-shadow: none;
}
```

### CSS Variables Reference
```css
/* Colors */
--accent, --accent-hover
--success, --warning, --danger
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary, --text-muted
--border, --border-light

/* Spacing */
--spacing-xs (4px), --spacing-sm (8px)
--spacing-md (16px), --spacing-lg (24px)
--spacing-xl (32px), --spacing-2xl (48px)

/* Border Radius */
--radius-sm (4px), --radius-md (8px)
--radius-lg (12px), --radius-xl (16px)

/* Transitions */
--transition-fast (150ms), --transition-normal (200ms)

/* Layout */
--header-height (64px)
--sidebar-width (260px)
--content-max-width (1200px)
```

---

## 4. State Management

### Local State (useState)
```jsx
// Use for component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Custom Hooks
```jsx
// Extract reusable logic into hooks
import { useProjects } from '../hooks/useProjects';

const { projects, saveProject, deleteProject } = useProjects();
```

### Context (Global State)
```jsx
// Use for app-wide state (theme, auth, toast)
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
```

---

## 5. API Call Patterns

### Frontend API Calls
```jsx
// Always use try-catch with loading states
const handleSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
        const result = await calculateROI(data);
        setResults(result);
    } catch (err) {
        setError(err.message);
        showToast('Calculation failed', 'error');
    } finally {
        setIsLoading(false);
    }
};
```

### Backend API Endpoints
```python
from fastapi import FastAPI, HTTPException
from models import ROIInput, ROIOutput

@app.post("/calculate", response_model=ROIOutput)
async def calculate(inputs: ROIInput):
    """
    Calculate automation ROI.
    
    Rate limit: 30 requests per minute.
    """
    try:
        return calculate_roi(inputs)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## 6. Error Handling

### Frontend
```jsx
// Use Error Boundaries for React components
// Use try-catch for async operations
// Always show user-friendly error messages
// Log errors for debugging

try {
    await apiCall();
} catch (error) {
    console.error('API call failed:', error);
    showToast('Something went wrong. Please try again.', 'error');
}
```

### Backend
```python
from fastapi import HTTPException

# Use appropriate HTTP status codes
raise HTTPException(status_code=400, detail="Invalid input")
raise HTTPException(status_code=404, detail="Resource not found")
raise HTTPException(status_code=500, detail="Internal server error")
```

---

## 7. Form Handling

### Form Pattern
```jsx
const [formData, setFormData] = useState(initialData);
const [errors, setErrors] = useState({});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
};

const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        // Submit form
    }
};
```

---

## 8. Testing Checklist

Before considering any feature complete:

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test dark mode
- [ ] Test with no data (empty state)
- [ ] Test with lots of data (performance)
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver/NVDA)

---

## 9. Performance Best Practices

```jsx
// Use useMemo for expensive computations
const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
}, [data]);

// Use useCallback for event handlers passed to children
const handleClick = useCallback(() => {
    // Handler logic
}, [dependencies]);

// Lazy load pages
const Portfolio = lazy(() => import('./pages/Portfolio'));
```

---

## 10. Security Checklist

- [ ] No secrets in code (use environment variables)
- [ ] Validate all user inputs
- [ ] Sanitize data before rendering (XSS prevention)
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API endpoints
- [ ] Use reCAPTCHA for public forms

---

*Last updated: January 2026*
