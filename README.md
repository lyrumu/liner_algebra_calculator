[![GitHub last commit](https://img.shields.io/github/last-commit/lyrumu/liner_algebra_calculator)](https://github.com/lyrumu/liner_algebra_calculator/commits/main)![GitHub repo size](https://img.shields.io/github/repo-size/lyrumu/liner_algebra_calculator)

[![GitHub language top](https://img.shields.io/github/languages/top/lyrumu/liner_algebra_calculator?color=blue)](https://github.com/lyrumu/liner_algebra_calculator)![Website](https://img.shields.io/website?url=https%3A%2F%2Flyrumu.github.io%2Fliner_algebra_calculator%2F&label=online%20status)

# 线性代数计算器

> 一个功能还行的线性代数在线计算工具,完全基于JS+浏览器来本地计算;
> 
> 作为本人第一个vibe coding小项目 会持续更新 如果有问题欢迎反馈~;

---

## 功能

| 模块        | 功能                          |
| --------- | --------------------------- |
| **行列式**   | 计算任意阶方阵行列式（拉普拉斯展开法）         |
| **矩阵运算**  | 加、减、乘、数乘、转置、求逆、伴随矩阵、秩、迹、特征值 |
| **向量运算**  | 加、减、数乘、点积、叉积、长度、夹角、正交性检验    |
| **线性方程组** | 高斯消元法、LU分解法、基础解系、通解         |
| **向量组**   | 线性相关性判断、极大无关组、向量组秩、施密特正交化   |
| **二次型**   | 标准形、规范形、正定性判断               |

---

## 结构

```
线性代数运算器/
├── index.html#主入口页面
├── css/
│   └── styles.css#样式表
├── js/
│   ├── fraction.js#分数精确计算类
│   ├── i18n.js#双语硬编码
│   ├── utils.js#UI工具函数
│   ├── math-core.js#线性代数核心算法
│   ├── ui-handlers.js#各模块UI交互
│   ├── tab-handlers.js#标签页切换
│   └── main.js#应用入口
└── assets/
    └── *.ico#网站图标
```

---

## 使用方法

访问:[线性代数计算器](https://lyrumu.github.io/liner_algebra_calculator/)

或者下载仓库后,直接在浏览器中打开 `index.html` 即可,无需安装任何依赖;

如需本地服务器：

```bash
cd 线性代数运算器
python -m http.server 8080
# 访问 http://localhost:8080
```

---

## 技术栈

- **UI框架**：Tailwind CSS
- **图标**：Font Awesome
- **核心计算**：原生 JavaScript + 分数类
- **存储**：localStorage（历史记录持久化）
