[![GitHub last commit](https://img.shields.io/github/last-commit/lyrumu/liner_algebra_calculator)](https://github.com/lyrumu/liner_algebra_calculator/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/lyrumu/liner_algebra_calculator)
[![GitHub language top](https://img.shields.io/github/languages/top/lyrumu/liner_algebra_calculator?color=blue)](https://github.com/lyrumu/liner_algebra_calculator)
![Website](https://img.shields.io/website?url=https%3A%2F%2Flyrumu.github.io%2Fliner_algebra_calculator%2F&label=online%20status)

# Linear Algebra Calculator

在线线性代数计算工具，基于 React + TypeScript 重构，所有计算在浏览器本地执行。

---

## 功能模块

| 模块 | 功能 |
|---|---|
| **行列式** | 任意方阵行列式计算（Laplace 展开） |
| **矩阵运算** | 加、减、乘、数乘、转置、求逆、伴随矩阵、秩、迹、特征值/特征向量 |
| **向量运算** | 加、减、数乘、点积、叉积、长度、夹角、正交性检验 |
| **线性方程组** | 高斯消元法、LU 分解法、基础解系、通解 |
| **向量组** | 线性相关性判断、极大无关组、向量组的秩、施密特正交化 |
| **二次型** | 标准形（正交变换法）、规范形、正定性判断 |

---

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | **Vite 6 + React 18 + TypeScript** |
| CSS | **Tailwind CSS 3**（PostCSS CLI 构建版） |
| 组件库 | **shadcn/ui**（Button, Card, Select, Input 等） |
| 图标 | **lucide-react** |
| 数学计算 | **Fraction 类**（精确有理数运算，无浮点误差） |
| 存储 | **localStorage**（历史记录、主题偏好、语言偏好） |
| 国际化 | 内置中/英文双语，运行时切换 |

---

## 项目结构

```
liner_algebra/
├── index.html                    # Vite 入口
├── src/
│   ├── main.tsx                  # React 挂载入口
│   ├── App.tsx                   # 主应用组件（路由 + 状态管理）
│   ├── index.css                 # Tailwind + shadcn CSS 变量
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── Layout/               # 布局组件
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── Footer.tsx
│   │   ├── modules/              # 6 大功能模块
│   │   │   ├── Determinant.tsx
│   │   │   ├── MatrixOperations.tsx
│   │   │   ├── VectorOperations.tsx
│   │   │   ├── LinearSystem.tsx
│   │   │   ├── VectorGroup.tsx
│   │   │   └── QuadraticForm.tsx
│   │   ├── MatrixInput.tsx       # 矩阵输入控件
│   │   ├── VectorInput.tsx       # 向量输入控件
│   │   ├── MatrixDisplay.tsx     # 矩阵结果展示
│   │   ├── VectorDisplay.tsx     # 向量结果展示
│   │   ├── ResultPanel.tsx       # 计算结果面板
│   │   ├── StepsTimeline.tsx     # 计算步骤时间线
│   │   └── HistoryPanel.tsx      # 历史记录面板
│   ├── hooks/
│   │   ├── useTheme.ts           # 深色/亮色模式
│   │   └── useHistory.ts         # 历史记录管理
│   ├── i18n/
│   │   ├── I18nContext.tsx        # 国际化 Context
│   │   └── translations.ts       # 中英文翻译字典
│   ├── lib/
│   │   ├── fraction.ts           # Fraction 精确分数类
│   │   ├── math-core.ts          # 核心线性代数算法
│   │   └── utils.ts              # 工具函数
│   └── types/
│       └── index.ts              # TypeScript 类型定义
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── components.json               # shadcn/ui 配置
└── assets/                       # 图标资源
```

---

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 部署

构建产物在 `dist/` 目录，可直接部署到 GitHub Pages、Vercel、Netlify 等静态托管平台。

---

## 在线地址

[lyrumu.github.io/liner_algebra_calculator](https://lyrumu.github.io/liner_algebra_calculator/)

---

## 许可

MIT License
