[![GitHub last commit](https://img.shields.io/github/last-commit/lyrumu/liner_algebra_calculator)](https://github.com/lyrumu/liner_algebra_calculator/commits/main)![GitHub repo size](https://img.shields.io/github/repo-size/lyrumu/liner_algebra_calculator)

[![GitHub language top](https://img.shields.io/github/languages/top/lyrumu/liner_algebra_calculator?color=blue)](https://github.com/lyrumu/liner_algebra_calculator)![Website](https://img.shields.io/website?url=https%3A%2F%2Flyrumu.github.io%2Fliner_algebra_calculator%2F&label=online%20status)

# Linear Algebra Calculator

> A simple online linear algebra calculation tool, fully based on JavaScript + browser for local computation.
> 
> As my first vibe coding project, it will be continuously updated. Feel free to report any issues~

---

## Features

| Module                | Functions                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Determinant**       | Calculate determinant of any square matrix (Laplace expansion)                                                              |
| **Matrix Operations** | Addition, subtraction, multiplication, scalar multiplication, transpose, inverse, adjugate matrix, rank, trace, eigenvalues |
| **Vector Operations** | Addition, subtraction, scalar multiplication, dot product, cross product, magnitude, angle, orthogonality check             |
| **Linear Equations**  | Gaussian elimination, LU decomposition, fundamental solution set, general solution                                          |
| **Vector Sets**       | Linear dependence check, maximal linearly independent subset, rank of vector set, Gram–Schmidt orthogonalization            |
| **Quadratic Forms**   | Standard form, canonical form, definiteness check                                                                           |

---

## Project Structure

```
linear_algebra_calculator/
├── index.html # Main entry page
├── css/
│ └── styles.css # Stylesheet
├── js/
│ ├── fraction.js # Exact rational number class
│ ├── i18n.js # Bilingual hardcoded strings
│ ├── utils.js # UI utility functions
│ ├── math-core.js # Core linear algebra algorithms
│ ├── ui-handlers.js # Module UI interactions
│ ├── tab-handlers.js # Tab switching logic
│ └── main.js # Application entry point
└── assets/
└── *.ico # Favicon
```

---

## Usage

Visit: [Linear Algebra Calculator](https://lyrumu.github.io/liner_algebra_calculator/)
Alternatively, clone the repository and open `index.html` directly in your browser – no dependencies to install.
To run a local server:

```bash
cd linear_algebra_calculator
python -m http.server 8080
# Visit http://localhost:8080
```

---

Tech Stack
----------

- **UI Framework**：Tailwind CSS
- **Icons**：Font Awesome
- **Core Computation**：Vanilla JavaScript + Fraction class
- **Storage**：localStorage


