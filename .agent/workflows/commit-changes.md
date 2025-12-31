---
description: Commit changes to git after completing work
---

# Git Commit Workflow

After completing any code changes, files created, or modifications:

1. Stage all changed files:
```bash
git add -A
```

// turbo
2. Commit with a descriptive message summarizing the changes:
```bash
git commit -m "<type>: <brief description>"
```

**Commit message types:**
- `feat:` - New feature or enhancement
- `fix:` - Bug fix
- `refactor:` - Code refactoring without functional changes
- `style:` - UI/UX or CSS changes
- `docs:` - Documentation updates
- `chore:` - Build, config, or tooling changes

**Examples:**
- `feat: add shared Button component with variants`
- `fix: replace emoji icons with SVG in Toast component`
- `style: update design tokens in variables.css`
- `refactor: migrate ToolCard to button element for accessibility`
