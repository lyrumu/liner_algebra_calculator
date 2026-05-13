[![GitHub last commit](https://img.shields.io/github/last-commit/lyrumu/linear_algebra_calculator)](https://github.com/lyrumu/linear_algebra_calculator/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/lyrumu/linear_algebra_calculator)
[![GitHub language top](https://img.shields.io/github/languages/top/lyrumu/linear_algebra_calculator?color=blue)](https://github.com/lyrumu/linear_algebra_calculator)
![Website](https://img.shields.io/website?url=https%3A%2F%2Flyrumu.github.io%2Flinear_algebra_calculator%2F&label=online%20status)

# Linear Algebra Calculator

An online linear algebra computation tool, rebuilt with React + TypeScript. All calculations run locally in the browser.

---

## Features

| Module | Description |
|---|---|
| **Determinant** | Determinant of any square matrix (Laplace expansion) |
| **Matrix Operations** | Addition, subtraction, multiplication, scalar multiplication, transpose, inverse, adjugate, rank, trace, eigenvalues/eigenvectors |
| **Vector Operations** | Addition, subtraction, scalar multiplication, dot product, cross product, magnitude, angle, orthogonality check |
| **Linear Systems** | Gaussian elimination, LU decomposition, fundamental solution set, general solution |
| **Vector Groups** | Linear dependence check, maximal independent subset, rank of vector group, Gram-Schmidt orthogonalization |
| **Quadratic Forms** | Canonical form (orthogonal transformation), normal form, positive definiteness check |

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | **Vite 6 + React 18 + TypeScript** |
| CSS | **Tailwind CSS 3** (PostCSS CLI) |
| Component Library | **shadcn/ui** (Button, Card, Select, Input, etc.) |
| Icons | **lucide-react** |
| Math Engine | **Fraction class** (exact rational arithmetic, no floating-point errors) |
| Storage | **localStorage** (history, theme preference, language preference) |
| i18n | Built-in Chinese/English bilingual, runtime switching |

---

## Project Structure

```
linear_algebra/
├── index.html                    # Vite entry point
├── src/
│   ├── main.tsx                  # React mount entry
│   ├── App.tsx                   # Main app component (routing + state management)
│   ├── index.css                 # Tailwind + shadcn CSS variables
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── Layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── Footer.tsx
│   │   ├── modules/              # 6 core modules
│   │   │   ├── Determinant.tsx
│   │   │   ├── MatrixOperations.tsx
│   │   │   ├── VectorOperations.tsx
│   │   │   ├── LinearSystem.tsx
│   │   │   ├── VectorGroup.tsx
│   │   │   └── QuadraticForm.tsx
│   │   ├── MatrixInput.tsx       # Matrix input control
│   │   ├── VectorInput.tsx       # Vector input control
│   │   ├── MatrixDisplay.tsx     # Matrix result display
│   │   ├── VectorDisplay.tsx     # Vector result display
│   │   ├── ResultPanel.tsx       # Result panel
│   │   ├── StepsTimeline.tsx     # Step-by-step timeline
│   │   └── HistoryPanel.tsx      # History panel
│   ├── hooks/
│   │   ├── useTheme.ts           # Dark/Light mode
│   │   └── useHistory.ts         # History management
│   ├── i18n/
│   │   ├── I18nContext.tsx        # i18n Context
│   │   └── translations.ts       # Chinese/English translation dictionary
│   ├── lib/
│   │   ├── fraction.ts           # Fraction exact rational class
│   │   ├── math-core.ts          # Core linear algebra algorithms
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── components.json               # shadcn/ui config
└── assets/                       # Icon assets
```

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## Deployment

Build output is in the `dist/` directory. Deploy directly to GitHub Pages, Vercel, Netlify, or any static hosting platform.

---

## Online Demo

[lyrumu.github.io/linear_algebra_calculator](https://lyrumu.github.io/linear_algebra_calculator/)

---

## License

MIT License
