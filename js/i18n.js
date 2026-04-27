/**
 * 国际化 (i18n) 支持
 * 提供中英文双语切换
 */

const i18n = {
    currentLang: 'zh',

    translations: {
        zh: {
            // 导航标签
            'determinant': '行列式',
            'matrix': '矩阵运算',
            'vector': '向量运算',
            'linear-system': '线性方程组',
            'vector-group': '向量组',
            'quadratic-form': '二次型',
            'history': '历史记录',
            'operations': '运算',

            // 标题
            'title': '线性代数计算器',

            // 行列式计算
            'matrix-dimensions': '矩阵维度',
            'rows': '行数',
            'cols': '列数',
            'generate': '生成',
            'matrix-elements': '矩阵元素',
            'calculate-determinant': '计算行列式',
            'clear': '清空',

            // 矩阵运算
            'matrix-operation': '运算类型',
            'add': '矩阵加法 (A + B)',
            'subtract': '矩阵减法 (A − B)',
            'multiply': '矩阵乘法 (A × B)',
            'scalar-multiply': '数乘矩阵 (k × A)',
            'transpose': '矩阵转置 (Aᵀ)',
            'inverse': '矩阵求逆 (A⁻¹)',
            'adjugate': '伴随矩阵 (adj(A))',
            'rank': '矩阵的秩 (rank(A))',
            'trace': '矩阵的迹 (tr(A))',
            'eigen': '特征值和特征向量',
            'matrix-a': '矩阵 A',
            'matrix-b': '矩阵 B',
            'scalar-value': '标量值 k',
            'calculate': '计算',

            // 向量运算
            'vector-operation': '运算类型',
            'vector-add': '向量加法 (u + v)',
            'vector-subtract': '向量减法 (u − v)',
            'vector-scalar-multiply': '数乘向量 (k × u)',
            'dot-product': '点积 (u · v)',
            'cross-product': '叉积 (u × v)',
            'length': '向量长度 (‖u‖)',
            'angle': '向量夹角 (θ)',
            'orthogonality': '正交性检验',
            'vector-u': '向量 u',
            'vector-v': '向量 v',
            'dimension': '维度',

            // 线性方程组
            'linear-system-solving': '线性方程组求解',
            'solution-method': '求解方法',
            'gauss': '高斯消元法',
            'lu': 'LU分解法',
            'basis-solution': '基础解系',
            'general-solution': '通解',
            'system-dimensions': '方程组维度',
            'equations': '方程数',
            'variables': '变量数',
            'coefficient-matrix': '系数矩阵',
            'constant-vector': '常数项向量 b',
            'solve': '求解',

            // 向量组分析
            'vector-group-analysis': '向量组分析',
            'analysis-type': '分析类型',
            'linear-dependency': '线性相关性判断',
            'max-independent': '极大无关组',
            'group-rank': '向量组的秩',
            'schmidt': '施密特正交化',
            'vector-group-settings': '向量组设置',
            'vector-count': '向量个数',
            'vector-dimension': '向量维度',
            'vector-group': '向量组',
            'analyze': '分析',

            // 二次型分析
            'quadratic-form-analysis': '二次型分析',
            'quadratic-operation': '分析类型',
            'standard-form': '标准形（正交变换法）',
            'canonical-form': '规范形',
            'positive-definite': '正定性判断',
            'quadratic-matrix': '二次型矩阵',
            'symmetric-note': '请输入对称矩阵，非对角线元素会自动对称化',

            // 历史记录
            'history-records': '历史记录',
            'click-to-load': '点击记录可快速加载',
            'clear-history': '清空历史',

            // 结果面板
            'calculation-result': '计算结果',
            'calculation-process': '计算过程',
            'show-steps': '显示步骤',
            'hide-steps': '隐藏步骤',
            'no-data': '请在左侧输入数据并点击计算按钮',
            'fraction-hint': '支持分数输入，如 1/2, 3_1/2（带分数）',

            // 页脚
            'footer-title': '线性代数计算器',
            'total-visits': '本站总访问量',
            'visitors': '访客数',
            'times': '次',
            'people': '人',

            // 按钮标签
            'theme-toggle': '切换主题',
            'language-toggle': '切换语言',
            'github': '访问我的 GitHub 主页',

            // ========= JS 动态生成文本 =========

            // 错误消息 (ui-handlers.js)
            'error-square-matrix': '行列式计算要求矩阵必须是方阵',
            'error-dim-range': '矩阵维度必须在1-10之间',
            'error-invalid-scalar': '请输入有效的标量值',
            'error-vector-dim-range': '向量维度必须在1-10之间',
            'error-vector-same-dim': '两个向量维度必须相同',
            'error-cross-3d': '叉积运算仅适用于3维向量',
            'error-eq-var-range': '方程数和变量数必须在1-10之间',
            'error-lu-square': 'LU分解仅适用于方阵系数矩阵',
            'error-vg-range': '向量个数和维度必须在1-10之间',
            'error-dimension-range': '维度必须在1-10之间',
            'error-calculation': '计算错误',

            // 操作名称简写 (utils.js getOperationName)
            'op-add': '加法',
            'op-subtract': '减法',
            'op-multiply': '乘法',
            'op-scalar-multiply': '数乘',
            'op-transpose': '转置',
            'op-inverse': '求逆',
            'op-adjugate': '伴随矩阵',
            'op-rank': '秩',
            'op-trace': '迹',
            'op-eigen': '特征值和特征向量',
            'op-dot-product': '点积',
            'op-cross-product': '叉积',
            'op-length': '长度',
            'op-angle': '夹角',
            'op-orthogonality': '正交性检验',
            'op-linear-dependency': '线性相关性',
            'op-max-independent': '极大无关组',
            'op-schmidt': '施密特正交化',
            'op-standard-form': '标准形',
            'op-canonical-form': '规范形',
            'op-positive-definite': '正定性',
            'op-gauss': '高斯消元法',
            'op-lu': 'LU分解',
            'op-basis-solution': '基础解系',
            'op-general-solution': '通解',

            // 结果标题 (ui-handlers.js)
            'result-determinant': '行列式计算结果',
            'result-matrix-op': '矩阵 {op} 结果',
            'result-eigenvalues': '特征值结果',
            'result-calculation': '计算结果',
            'result-vector-op': '向量 {op} 结果',
            'result-orthogonality': '正交性检验结果',
            'result-orthogonal': '正交',
            'result-not-orthogonal': '不正交',

            // 步骤文本 (ui-handlers.js)
            'step-input-matrix': '输入矩阵 A（{rows}×{cols}）：',
            'step-matrix-a': '矩阵 A（{rows}×{cols}）：',
            'step-matrix-b': '矩阵 B（{rows}×{cols}）：',
            'step-scalar-k': '标量 k = {value}',
            'step-eigenvalues': '特征值：',
            'step-vector-u': '向量 u（{dim}维）：',
            'step-vector-v': '向量 v（{dim}维）：',
            'step-orthogonal-check': '向量 u 和 v {result}',
            'step-linear-system': '线性方程组：',
            'step-unique-solution': '方程组有唯一解：',
            'step-no-solution': '方程组无解（矛盾方程）',
            'step-infinite-solutions': '方程组有无穷多解，系数矩阵的秩 = {rank}，自由变量数 = {free}',
            'step-lu-solution': '方程组的解：',
            'step-general-solution': '通解 = 特解 + 齐次方程组基础解系的线性组合',
            'step-vector-group': '向量组（共{count}个{dim}维向量）：',
            'step-linear-dependent': '线性相关',
            'step-linear-independent': '线性无关',
            'step-group-rank': '向量组的秩 = {rank}',
            'step-max-independent-set': '极大无关组（包含 {count} 个向量）：',
            'step-orthogonalized': '正交化后的向量组：',
            'step-normalized': '单位化后的向量组：',
            'step-quadratic-matrix': '二次型矩阵 A（{dim}×{dim}）：',
            'step-non-symmetric': '输入矩阵非对称，已自动对称化',
            'step-eigenvalues-label': '特征值：',
            'step-std-matrix': '标准形矩阵（对角矩阵）：',
            'step-canon-matrix': '规范形矩阵（正负惯性指数）：',
            'step-principal-minors': '顺序主子式：',
            'step-positive-definite-result': '二次型正定',
            'step-not-positive-definite': '二次型不正定',

            // 显示结果 (ui-handlers.js)
            'result-unique-solution': '唯一解',
            'result-no-solution': '无解',
            'result-no-solution-desc': '方程组存在矛盾，无解',
            'result-infinite-solutions': '无穷多解',
            'result-rank': '系数矩阵的秩 = {rank}',
            'result-free-vars': '自由变量数 = {free}',
            'result-linear-dep-analysis': '线性相关性分析',
            'result-linear-dep': '线性相关',
            'result-linear-indep': '线性无关',
            'result-group-rank': '向量组的秩',
            'result-max-independent': '极大无关组',
            'result-max-independent-desc': '包含以下 {count} 个向量：',
            'result-schmidt': '施密特正交化',
            'result-orthogonalized': '正交化：{count} 个向量',
            'result-normalized': '单位正交化：{count} 个向量',
            'result-positive-def-analysis': '正定性分析结果',
            'result-positive-def': '正定',
            'result-not-positive-def': '不正定',
            'result-standard-form': '标准形结果',
            'result-canonical-form': '规范形结果',
            'result-total-vectors': '共 {count} 个向量',

            // 历史记录类型 (utils.js)
            'history-determinant': '行列式 ({rows}×{cols})',
            'history-matrix-op': '矩阵 {op}',
            'history-vector-op': '向量 {op}',
            'history-linear-system': '线性方程组 ({method})',
            'history-vector-group': '向量组 {op}',
            'history-quadratic-form': '二次型 {op}',
            'history-no-history': '暂无历史记录',

            // 确认对话框 (tab-handlers.js)
            'confirm-clear-history': '确定要清空所有历史记录吗？',

            // 向量组标签 (tab-handlers.js)
            'vector-alpha': '向量 α{index}',

            // 初始化日志 (main.js)
            'init-complete': '线性代数计算器初始化完成',
        },

        en: {
            // 导航标签
            'determinant': 'Determinant',
            'matrix': 'Matrix Operations',
            'vector': 'Vector Operations',
            'linear-system': 'Linear Systems',
            'vector-group': 'Vector Groups',
            'quadratic-form': 'Quadratic Forms',
            'history': 'History',
            'operations': 'Operations',

            // 标题
            'title': 'Linear Algebra Calculator',

            // 行列式计算
            'matrix-dimensions': 'Matrix Dimensions',
            'rows': 'Rows',
            'cols': 'Columns',
            'generate': 'Generate',
            'matrix-elements': 'Matrix Elements',
            'calculate-determinant': 'Calculate Determinant',
            'clear': 'Clear',

            // 矩阵运算
            'matrix-operation': 'Operation Type',
            'add': 'Matrix Addition (A + B)',
            'subtract': 'Matrix Subtraction (A − B)',
            'multiply': 'Matrix Multiplication (A × B)',
            'scalar-multiply': 'Scalar Multiplication (k × A)',
            'transpose': 'Matrix Transpose (Aᵀ)',
            'inverse': 'Matrix Inverse (A⁻¹)',
            'adjugate': 'Adjugate Matrix (adj(A))',
            'rank': 'Matrix Rank (rank(A))',
            'trace': 'Matrix Trace (tr(A))',
            'eigen': 'Eigenvalues & Eigenvectors',
            'matrix-a': 'Matrix A',
            'matrix-b': 'Matrix B',
            'scalar-value': 'Scalar Value k',
            'calculate': 'Calculate',

            // 向量运算
            'vector-operation': 'Operation Type',
            'vector-add': 'Vector Addition (u + v)',
            'vector-subtract': 'Vector Subtraction (u − v)',
            'vector-scalar-multiply': 'Scalar Multiplication (k × u)',
            'dot-product': 'Dot Product (u · v)',
            'cross-product': 'Cross Product (u × v)',
            'length': 'Vector Length (‖u‖)',
            'angle': 'Vector Angle (θ)',
            'orthogonality': 'Orthogonality Test',
            'vector-u': 'Vector u',
            'vector-v': 'Vector v',
            'dimension': 'Dimension',

            // 线性方程组
            'linear-system-solving': 'Linear System Solving',
            'solution-method': 'Solution Method',
            'gauss': 'Gaussian Elimination',
            'lu': 'LU Decomposition',
            'basis-solution': 'Basis Solution',
            'general-solution': 'General Solution',
            'system-dimensions': 'System Dimensions',
            'equations': 'Equations',
            'variables': 'Variables',
            'coefficient-matrix': 'Coefficient Matrix',
            'constant-vector': 'Constant Vector b',
            'solve': 'Solve',

            // 向量组分析
            'vector-group-analysis': 'Vector Group Analysis',
            'analysis-type': 'Analysis Type',
            'linear-dependency': 'Linear Dependency',
            'max-independent': 'Max Independent Set',
            'group-rank': 'Vector Group Rank',
            'schmidt': 'Schmidt Orthogonalization',
            'vector-group-settings': 'Vector Group Settings',
            'vector-count': 'Vector Count',
            'vector-dimension': 'Vector Dimension',
            'vector-group': 'Vector Group',
            'analyze': 'Analyze',

            // 二次型分析
            'quadratic-form-analysis': 'Quadratic Form Analysis',
            'quadratic-operation': 'Analysis Type',
            'standard-form': 'Standard Form',
            'canonical-form': 'Canonical Form',
            'positive-definite': 'Positive Definiteness',
            'quadratic-matrix': 'Quadratic Matrix',
            'symmetric-note': 'Please enter a symmetric matrix; off-diagonal elements will be symmetrized',

            // 历史记录
            'history-records': 'History Records',
            'click-to-load': 'Click to load',
            'clear-history': 'Clear History',

            // 结果面板
            'calculation-result': 'Calculation Result',
            'calculation-process': 'Calculation Process',
            'show-steps': 'Show Steps',
            'hide-steps': 'Hide Steps',
            'no-data': 'Please enter data on the left and click Calculate',
            'fraction-hint': 'Supports fraction input, e.g., 1/2, 3_1/2 (mixed numbers)',

            // 页脚
            'footer-title': 'Linear Algebra Calculator',
            'total-visits': 'Total Visits',
            'visitors': 'Visitors',
            'times': 'times',
            'people': 'people',

            // 按钮标签
            'theme-toggle': 'Toggle Theme',
            'language-toggle': 'Toggle Language',
            'github': 'Visit my GitHub',

            // ========= JS 动态生成文本 =========

            // 错误消息 (ui-handlers.js)
            'error-square-matrix': 'Determinant requires a square matrix',
            'error-dim-range': 'Matrix dimensions must be between 1 and 10',
            'error-invalid-scalar': 'Please enter a valid scalar value',
            'error-vector-dim-range': 'Vector dimension must be between 1 and 10',
            'error-vector-same-dim': 'Both vectors must have the same dimension',
            'error-cross-3d': 'Cross product only works with 3D vectors',
            'error-eq-var-range': 'Equations and variables must be between 1 and 10',
            'error-lu-square': 'LU decomposition only applies to square coefficient matrices',
            'error-vg-range': 'Vector count and dimension must be between 1 and 10',
            'error-dimension-range': 'Dimension must be between 1 and 10',
            'error-calculation': 'Calculation Error',

            // 操作名称简写 (utils.js getOperationName)
            'op-add': 'Addition',
            'op-subtract': 'Subtraction',
            'op-multiply': 'Multiplication',
            'op-scalar-multiply': 'Scalar Mult.',
            'op-transpose': 'Transpose',
            'op-inverse': 'Inverse',
            'op-adjugate': 'Adjugate',
            'op-rank': 'Rank',
            'op-trace': 'Trace',
            'op-eigen': 'Eigenvalues & Eigenvectors',
            'op-dot-product': 'Dot Product',
            'op-cross-product': 'Cross Product',
            'op-length': 'Length',
            'op-angle': 'Angle',
            'op-orthogonality': 'Orthogonality',
            'op-linear-dependency': 'Linear Dependency',
            'op-max-independent': 'Max Independent Set',
            'op-schmidt': 'Schmidt Orthogonalization',
            'op-standard-form': 'Standard Form',
            'op-canonical-form': 'Canonical Form',
            'op-positive-definite': 'Positive Definiteness',
            'op-gauss': 'Gaussian Elimination',
            'op-lu': 'LU Decomposition',
            'op-basis-solution': 'Basis Solution',
            'op-general-solution': 'General Solution',

            // 结果标题 (ui-handlers.js)
            'result-determinant': 'Determinant Result',
            'result-matrix-op': 'Matrix {op} Result',
            'result-eigenvalues': 'Eigenvalue Result',
            'result-calculation': 'Calculation Result',
            'result-vector-op': 'Vector {op} Result',
            'result-orthogonality': 'Orthogonality Test Result',
            'result-orthogonal': 'Orthogonal',
            'result-not-orthogonal': 'Not Orthogonal',

            // 步骤文本 (ui-handlers.js)
            'step-input-matrix': 'Input matrix A ({rows}×{cols}):',
            'step-matrix-a': 'Matrix A ({rows}×{cols}):',
            'step-matrix-b': 'Matrix B ({rows}×{cols}):',
            'step-scalar-k': 'Scalar k = {value}',
            'step-eigenvalues': 'Eigenvalues:',
            'step-vector-u': 'Vector u ({dim}D):',
            'step-vector-v': 'Vector v ({dim}D):',
            'step-orthogonal-check': 'Vectors u and v are {result}',
            'step-linear-system': 'Linear System:',
            'step-unique-solution': 'Unique solution:',
            'step-no-solution': 'No solution (inconsistent system)',
            'step-infinite-solutions': 'Infinitely many solutions, rank = {rank}, free variables = {free}',
            'step-lu-solution': 'Solution:',
            'step-general-solution': 'General solution = particular solution + linear combination of basis solutions',
            'step-vector-group': 'Vector group ({count} vectors, {dim}D):',
            'step-linear-dependent': 'Linearly Dependent',
            'step-linear-independent': 'Linearly Independent',
            'step-group-rank': 'Vector group rank = {rank}',
            'step-max-independent-set': 'Max independent set ({count} vectors):',
            'step-orthogonalized': 'Orthogonalized vector group:',
            'step-normalized': 'Normalized vector group:',
            'step-quadratic-matrix': 'Quadratic matrix A ({dim}×{dim}):',
            'step-non-symmetric': 'Input matrix is non-symmetric, automatically symmetrized',
            'step-eigenvalues-label': 'Eigenvalues:',
            'step-std-matrix': 'Standard form matrix (diagonal matrix):',
            'step-canon-matrix': 'Canonical form matrix (inertia indices):',
            'step-principal-minors': 'Principal minors:',
            'step-positive-definite-result': 'Positive definite',
            'step-not-positive-definite': 'Not positive definite',

            // 显示结果 (ui-handlers.js)
            'result-unique-solution': 'Unique Solution',
            'result-no-solution': 'No Solution',
            'result-no-solution-desc': 'The system is inconsistent, no solution exists',
            'result-infinite-solutions': 'Infinitely Many Solutions',
            'result-rank': 'Rank = {rank}',
            'result-free-vars': 'Free variables = {free}',
            'result-linear-dep-analysis': 'Linear Dependency Analysis',
            'result-linear-dep': 'Linearly Dependent',
            'result-linear-indep': 'Linearly Independent',
            'result-group-rank': 'Vector Group Rank',
            'result-max-independent': 'Max Independent Set',
            'result-max-independent-desc': 'Contains {count} vectors:',
            'result-schmidt': 'Schmidt Orthogonalization',
            'result-orthogonalized': 'Orthogonalized: {count} vectors',
            'result-normalized': 'Normalized: {count} vectors',
            'result-positive-def-analysis': 'Positive Definiteness Analysis',
            'result-positive-def': 'Positive Definite',
            'result-not-positive-def': 'Not Positive Definite',
            'result-standard-form': 'Standard Form Result',
            'result-canonical-form': 'Canonical Form Result',
            'result-total-vectors': '{count} vectors total',

            // 历史记录类型 (utils.js)
            'history-determinant': 'Determinant ({rows}×{cols})',
            'history-matrix-op': 'Matrix {op}',
            'history-vector-op': 'Vector {op}',
            'history-linear-system': 'Linear System ({method})',
            'history-vector-group': 'Vector Group {op}',
            'history-quadratic-form': 'Quadratic Form {op}',
            'history-no-history': 'No history records',

            // 确认对话框 (tab-handlers.js)
            'confirm-clear-history': 'Are you sure you want to clear all history?',

            // 向量组标签 (tab-handlers.js)
            'vector-alpha': 'Vector \u03B1{index}',

            // 初始化日志 (main.js)
            'init-complete': 'Linear Algebra Calculator initialized',
        }
    },

    /**
     * 带模板参数的翻译
     * @param {string} key - 翻译键
     * @param {Object} params - 模板参数，如 {rows: 3, cols: 3}
     * @returns {string} 替换参数后的翻译文本
     */
    tf(key, params) {
        let text = this.t(key);
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                text = text.replace(`{${k}}`, v);
            }
        }
        return text;
    },

    /**
     * 初始化语言设置
     */
    init() {
        // 从 localStorage 读取语言偏好
        const savedLang = localStorage.getItem('language');
        const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
        this.currentLang = savedLang || browserLang;

        // 设置 html lang 属性
        document.documentElement.lang = this.currentLang;

        // 应用翻译
        this.applyTranslations();
    },

    /**
     * 切换语言
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('language', this.currentLang);
        document.documentElement.lang = this.currentLang;
        this.applyTranslations();
        // 切换语言后更新页面标题
        document.title = this.t('title');
    },

    /**
     * 应用翻译到所有带有 data-i18n-key 属性的元素
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const translation = this.translations[this.currentLang][key];
            if (translation !== undefined) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // 更新页面标题
        document.title = this.t('title');

        // 更新按钮标题
        const langButton = document.getElementById('language-toggle');
        if (langButton) {
            langButton.setAttribute('title', this.translations[this.currentLang]['language-toggle']);
            langButton.setAttribute('aria-label', this.translations[this.currentLang]['language-toggle']);
        }

        // 更新主题按钮标题
        const themeButton = document.getElementById('theme-toggle');
        if (themeButton) {
            themeButton.setAttribute('title', this.translations[this.currentLang]['theme-toggle']);
            themeButton.setAttribute('aria-label', this.translations[this.currentLang]['theme-toggle']);
        }

        // 更新 GitHub 链接标题
        const githubLink = document.querySelector('a[href*="github.com"]');
        if (githubLink) {
            githubLink.setAttribute('title', this.translations[this.currentLang]['github']);
            githubLink.setAttribute('aria-label', this.translations[this.currentLang]['github']);
        }

        // 更新页脚统计文本
        const totalVisitsSpan = document.getElementById('busuanzi_container_site_pv');
        if (totalVisitsSpan) {
            const pvSpan = document.getElementById('busuanzi_value_site_pv');
            const timesText = this.t('times');
            // 保留 busuanzi 的 span 结构
            totalVisitsSpan.innerHTML = `${this.t('total-visits')} <span id="busuanzi_value_site_pv">${pvSpan ? pvSpan.textContent : ''}</span> ${timesText}`;
        }
        const visitorsSpan = document.getElementById('busuanzi_container_site_uv');
        if (visitorsSpan) {
            const uvSpan = document.getElementById('busuanzi_value_site_uv');
            const peopleText = this.t('people');
            visitorsSpan.innerHTML = `${this.t('visitors')} <span id="busuanzi_value_site_uv">${uvSpan ? uvSpan.textContent : ''}</span> ${peopleText}`;
        }

        // 重新渲染动态内容（运算结果和步骤）
        if (typeof lastCalculationState !== 'undefined' && lastCalculationState) {
            this.reRenderDynamicContent();
        }

        // 重新渲染历史记录（支持语言切换时更新历史记录文字）
        if (typeof updateHistoryDisplay === 'function') {
            updateHistoryDisplay();
        }
    },

    /**
     * 重新渲染动态内容（语言切换后更新运算结果和步骤）
     */
    reRenderDynamicContent() {
        if (!lastCalculationState) return;

        // 更新结果显示区域的静态文本
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            // 更新结果卡片中的标题文本
            resultContainer.querySelectorAll('h3').forEach(h3 => {
                const text = h3.textContent.trim();
                // 匹配并替换常见的国际化文本
                Object.keys(this.translations[this.currentLang]).forEach(key => {
                    const zhText = this.translations['zh'][key];
                    const enText = this.translations['en'][key];
                    if (zhText && enText && zhText !== enText) {
                        if (this.currentLang === 'en' && text === zhText) {
                            h3.textContent = enText;
                        } else if (this.currentLang === 'zh' && text === enText) {
                            h3.textContent = zhText;
                        }
                    }
                });
            });
        }

        // 更新步骤容器中的静态文本
        const stepsContainer = document.getElementById('steps-container');
        if (stepsContainer && !stepsContainer.classList.contains('hidden')) {
            stepsContainer.querySelectorAll('.step-content, p').forEach(p => {
                const html = p.innerHTML;
                // 更新步骤中的常见文本模式
                let updated = html;
                
                // 更新唯一解/无解等状态文本
                const textMap = [
                    [this.translations.zh['result-unique-solution'] || '', this.translations.en['result-unique-solution'] || ''],
                    [this.translations.zh['result-no-solution'] || '', this.translations.en['result-no-solution'] || ''],
                    [this.translations.zh['result-infinite-solutions'] || '', this.translations.en['result-infinite-solutions'] || ''],
                    [this.translations.zh['step-unique-solution'] || '', this.translations.en['step-unique-solution'] || ''],
                    [this.translations.zh['step-no-solution'] || '', this.translations.en['step-no-solution'] || ''],
                    [this.translations.zh['step-linear-dependent'] || '', this.translations.en['step-linear-dependent'] || ''],
                    [this.translations.zh['step-linear-independent'] || '', this.translations.en['step-linear-independent'] || ''],
                    [this.translations.zh['step-positive-definite-result'] || '', this.translations.en['step-positive-definite-result'] || ''],
                    [this.translations.zh['step-not-positive-definite'] || '', this.translations.en['step-not-positive-definite'] || ''],
                    [this.translations.zh['step-orthogonalized'] || '', this.translations.en['step-orthogonalized'] || ''],
                    [this.translations.zh['step-normalized'] || '', this.translations.en['step-normalized'] || ''],
                    [this.translations.zh['step-general-solution'] || '', this.translations.en['step-general-solution'] || ''],
                    [this.translations.zh['step-lu-solution'] || '', this.translations.en['step-lu-solution'] || ''],
                    [this.translations.zh['step-eigenvalues'] || '', this.translations.en['step-eigenvalues'] || ''],
                    [this.translations.zh['step-linear-system'] || '', this.translations.en['step-linear-system'] || ''],
                    [this.translations.zh['step-input-matrix'] || '', this.translations.en['step-input-matrix'] || ''],
                    [this.translations.zh['result-orthogonal'] || '', this.translations.en['result-orthogonal'] || ''],
                    [this.translations.zh['result-not-orthogonal'] || '', this.translations.en['result-not-orthogonal'] || ''],
                    [this.translations.zh['result-linear-dep'] || '', this.translations.en['result-linear-indep'] || ''],
                    [this.translations.zh['result-positive-def'] || '', this.translations.en['result-positive-def'] || ''],
                    [this.translations.zh['result-not-positive-def'] || '', this.translations.en['result-not-positive-def'] || ''],
                ];
                
                textMap.forEach(([zh, en]) => {
                    if (zh && en && zh !== en) {
                        if (this.currentLang === 'en') {
                            updated = updated.replace(new RegExp(zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), en);
                        } else {
                            updated = updated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), zh);
                        }
                    }
                });
                
                if (updated !== html) {
                    p.innerHTML = updated;
                }
            });
        }

        // 更新显示/隐藏步骤按钮文字
        const toggleStepsBtn = document.getElementById('toggle-steps');
        if (toggleStepsBtn) {
            const showText = this.t('show-steps');
            const hideText = this.t('hide-steps');
            const isHidden = stepsContainer ? stepsContainer.classList.contains('hidden') : true;
            toggleStepsBtn.innerHTML = `<span>${isHidden ? showText : hideText}</span><i class="fa fa-chevron-${isHidden ? 'down' : 'up'} ml-1"></i>`;
        }

        // 如果存在缓存的状态，尝试重新触发计算来完整刷新
        if (lastCalculationState && typeof this.recalcAndRender === 'function') {
            try {
                this.recalcAndRender(lastCalculationState);
            } catch(e) {
                console.warn('重新渲染动态内容时出错:', e);
            }
        }
    },

    /**
     * 根据缓存状态重新渲染运算结果
     */
    recalcAndRender(state) {
        if (!state) return;
        
        try {
            switch (state.type) {
                case 'determinant':
                    this.recalcDeterminant(state);
                    break;
                case 'matrix':
                    this.recalcMatrix(state);
                    break;
                case 'vector':
                    this.recalcVector(state);
                    break;
                case 'linear-system':
                    this.recalcLinearSystem(state);
                    break;
                case 'vector-group':
                    this.recalcVectorGroup(state);
                    break;
                case 'quadratic-form':
                    this.recalcQuadraticForm(state);
                    break;
            }
        } catch(e) {
            console.warn('重新计算出错:', e);
        }
    },

    // 以下是根据缓存状态重新渲染各模块的方法
    recalcDeterminant(state) {
        const matrix = state.matrix.map(row => row.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
        
        clearSteps('steps-container');
        addStep(`<p>${this.tf('step-input-matrix', { rows: state.rows, cols: state.cols })}</p><div id="step-matrix"></div>`, 'steps-container');
        displayMatrix(matrix, 'step-matrix');
        
        const result = determinant(matrix);
        addStep(`<p>det(A) = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
        
        showResult(`
            <div class="result-card">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-determinant')}</h3>
                <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
            </div>
        `);
    },

    recalcMatrix(state) {
        const operation = state.operation;
        const matrixA = state.matrixA.map(row => row.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
        
        clearSteps('steps-container');
        addStep(`<p>${this.tf('step-matrix-a', { rows: state.rowsA, cols: state.colsA })}</p><div id="step-matrix-a"></div>`, 'steps-container');
        displayMatrix(matrixA, 'step-matrix-a');
        
        let result;
        
        switch (operation) {
            case 'add': {
                const matrixB = state.matrixB.map(r => r.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
                addStep(`<p>${this.tf('step-matrix-b', { rows: state.rowsB, cols: state.colsB })}</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                result = addMatrices(matrixA, matrixB);
                addStep(`<p>A + B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'subtract': {
                const matrixB = state.matrixB.map(r => r.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
                addStep(`<p>${this.tf('step-matrix-b', { rows: state.rowsB, cols: state.colsB })}</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                result = subtractMatrices(matrixA, matrixB);
                addStep(`<p>A - B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'multiply': {
                const matrixB = state.matrixB.map(r => r.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
                addStep(`<p>${this.tf('step-matrix-b', { rows: state.rowsB, cols: state.colsB })}</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                result = multiplyMatrices(matrixA, matrixB);
                addStep(`<p>A × B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'scalar-multiply': {
                addStep(`<p>${this.tf('step-scalar-k', { value: formatNumber(state.scalar) })}</p>`, 'steps-container');
                result = scalarMultiplyMatrix(matrixA, state.scalar);
                addStep(`<p>k × A = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'transpose': {
                result = transposeMatrix(matrixA);
                addStep(`<p>A^T = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'inverse': {
                result = inverseMatrix(matrixA);
                addStep(`<p>A^(-1) = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'adjugate': {
                result = adjugateMatrix(matrixA);
                addStep(`<p>adj(A) = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            case 'rank': {
                result = matrixRank(matrixA);
                addStep(`<p>rank(A) = <strong>${result}</strong></p>`, 'steps-container');
                break;
            }
            case 'trace': {
                result = matrixTrace(matrixA);
                addStep(`<p>tr(A) = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
                break;
            }
            case 'eigen': {
                const eigenvalues = eigenValues(matrixA);
                let eigenDisplay = `<p>${this.t('step-eigenvalues')}</p><ul class="list-disc list-inside space-y-1">`;
                eigenvalues.forEach((ev, index) => {
                    if (typeof ev === 'object' && 'real' in ev) {
                        const sign = ev.imag >= 0 ? '+' : '';
                        eigenDisplay += `<li>λ<sub>${index + 1}</sub> = ${formatNumber(ev.real)} ${sign}${formatNumber(ev.imag)}i</li>`;
                    } else {
                        eigenDisplay += `<li>λ<sub>${index + 1}</sub> = ${formatNumber(ev)}</li>`;
                    }
                });
                eigenDisplay += '</ul>';
                addStep(eigenDisplay, 'steps-container');
                result = eigenvalues;
                break;
            }
        }
        
        // 显示结果
        if (Array.isArray(result) && Array.isArray(result[0])) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.tf('result-matrix-op', { op: getOperationName(operation) })}</h3>
                    <div id="result-matrix"></div>
                </div>
            `);
            displayMatrix(result, 'result-matrix');
        } else if (Array.isArray(result)) {
            let resultDisplay = '<ul class="list-disc list-inside space-y-1">';
            result.forEach((ev, index) => {
                if (typeof ev === 'object' && 'real' in ev) {
                    const sign = ev.imag >= 0 ? '+' : '';
                    resultDisplay += `<li>λ<sub>${index + 1}</sub> = ${formatNumber(ev.real)} ${sign}${formatNumber(ev.imag)}i</li>`;
                } else {
                    resultDisplay += `<li>λ<sub>${index + 1}</sub> = ${formatNumber(ev)}</li>`;
                }
            });
            resultDisplay += '</ul>';
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-eigenvalues')}</h3>
                    ${resultDisplay}
                </div>
            `);
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-calculation')}</h3>
                    <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
                </div>
            `);
        }
    },

    recalcVector(state) {
        const operation = state.operation;
        const vectorU = state.vectorU.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
        
        clearSteps('steps-container');
        addStep(`<p>${this.tf('step-vector-u', { dim: state.lengthU })}</p><div id="step-vector-u"></div>`, 'steps-container');
        displayVector(vectorU, 'step-vector-u');
        
        let result;
        
        switch (operation) {
            case 'add': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: state.lengthU })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                result = addVectors(vectorU, vectorV);
                addStep(`<p>u + v = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            case 'subtract': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: state.lengthU })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                result = subtractVectors(vectorU, vectorV);
                addStep(`<p>u - v = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            case 'scalar-multiply': {
                addStep(`<p>${this.tf('step-scalar-k', { value: formatNumber(state.scalar) })}</p>`, 'steps-container');
                result = scalarMultiplyVector(vectorU, state.scalar);
                addStep(`<p>k × u = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            case 'dot-product': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: state.lengthU })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                result = dotProduct(vectorU, vectorV);
                addStep(`<p>u · v = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
                break;
            }
            case 'cross-product': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: 3 })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                result = crossProduct(vectorU, vectorV);
                addStep(`<p>u × v = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            case 'length': {
                result = vectorLength(vectorU);
                addStep(`<p>||u|| = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
                break;
            }
            case 'angle': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: state.lengthU })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                const angleRad = vectorAngle(vectorU, vectorV);
                const angleDeg = angleRad * 180 / Math.PI;
                addStep(`<p>cos θ = (u·v) / (||u|| ||v||)</p>`, 'steps-container');
                addStep(`<p>θ = <strong>${formatNumber(angleRad)}</strong> rad = <strong>${formatNumber(angleDeg)}</strong>°</p>`, 'steps-container');
                result = angleDeg;
                break;
            }
            case 'orthogonality': {
                const vectorV = state.vectorV.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
                addStep(`<p>${this.tf('step-vector-v', { dim: state.lengthU })}</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                const dot = dotProduct(vectorU, vectorV);
                const isOrtho = areOrthogonal(vectorU, vectorV);
                addStep(`<p>u · v = ${formatNumber(dot)}</p>`, 'steps-container');
                addStep(`<p>${dot === 0 ? '✓' : '✗'} ${this.tf('step-orthogonal-check', { result: isOrtho ? this.t('result-orthogonal') : this.t('result-not-orthogonal') })}</p>`, 'steps-container');
                result = isOrtho;
                break;
            }
        }
        
        // 显示结果
        if (Array.isArray(result)) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.tf('result-vector-op', { op: getOperationName(operation) })}</h3>
                    <div id="result-vector"></div>
                </div>
            `);
            displayVector(result, 'result-vector');
        } else if (typeof result === 'boolean') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-orthogonality')}</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-green-600' : 'text-red-500'}">${result ? '✓ ' + this.t('result-orthogonal') : '✗ ' + this.t('result-not-orthogonal')}</p>
                </div>
            `);
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-calculation')}</h3>
                    <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
                </div>
            `);
        }
    },

    recalcLinearSystem(state) {
        const coefficients = state.coefficients.map(r => r.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
        const constants = state.constants.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v);
        
        clearSteps('steps-container');
        
        // 显示方程组
        addStep(`<p>${this.t('step-linear-system')}</p><div class="mt-2 space-y-1">`, 'steps-container');
        for (let i = 0; i < state.equations; i++) {
            let terms = '';
            for (let j = 0; j < state.variables; j++) {
                const coeff = coefficients[i][j];
                if (Math.abs(coeff) > 1e-10) {
                    if (j > 0 && coeff > 0) terms += ' + ';
                    else if (j > 0 && coeff < 0) terms += ' - ';
                    
                    const absCoeff = Math.abs(coeff);
                    if (Math.abs(absCoeff - 1) > 1e-10) {
                        terms += formatNumber(absCoeff);
                    }
                    terms += `x<sub>${j + 1}</sub>`;
                }
            }
            addStep(`<p>${terms || '0'} = ${formatNumber(constants[i])}</p>`, 'steps-container');
        }
        addStep(`</div>`, 'steps-container');
        
        let result;
        
        switch (state.method) {
            case 'gauss': {
                result = gaussElimination(coefficients, constants);
                
                if (result.type === 'unique-solution') {
                    let solStr = `<p>${this.t('step-unique-solution')}</p><ul class="list-disc list-inside space-y-1">`;
                    result.solution.forEach((val, idx) => {
                        solStr += `<li>x<sub>${idx + 1}</sub> = <strong>${formatNumber(val)}</strong></li>`;
                    });
                    solStr += '</ul>';
                    addStep(solStr, 'steps-container');
                } else if (result.type === 'no-solution') {
                    addStep(`<p class="text-red-600 font-semibold">✗ ${this.t('step-no-solution')}</p>`, 'steps-container');
                } else {
                    addStep(`<p>${this.tf('step-infinite-solutions', { rank: result.rank, free: result.freeVariables })}</p>`, 'steps-container');
                }
                break;
            }
            
            case 'lu': {
                const { L, U } = luDecomposition(coefficients);
                
                addStep(`<p>L = </p><div id="step-l"></div>`, 'steps-container');
                displayMatrix(L, 'step-l');
                
                addStep(`<p>U = </p><div id="step-u"></div>`, 'steps-container');
                displayMatrix(U, 'step-u');
                
                const solution = solveWithLU(L, U, constants);
                
                let solStr = `<p>${this.t('step-lu-solution')}</p><ul class="list-disc list-inside space-y-1">`;
                solution.forEach((val, idx) => {
                    solStr += `<li>x<sub>${idx + 1}</sub> = <strong>${formatNumber(val)}</strong></li>`;
                });
                solStr += '</ul>';
                addStep(solStr, 'steps-container');
                
                result = { type: 'unique-solution', solution };
                break;
            }
            
            case 'basis-solution':
            case 'general-solution': {
                result = gaussElimination(coefficients, constants);
                
                if (result.type === 'trivial-solution' || result.type === 'unique-solution') {
                    let solStr = `<p>${this.t('step-unique-solution')}</p><ul class="list-disc list-inside space-y-1">`;
                    result.solution.forEach((val, idx) => {
                        solStr += `<li>x<sub>${idx + 1}</sub> = <strong>${formatNumber(val)}</strong></li>`;
                    });
                    solStr += '</ul>';
                    addStep(solStr, 'steps-container');
                } else if (result.type === 'no-solution') {
                    addStep(`<p class="text-red-600 font-semibold">✗ ${this.t('result-no-solution')}</p>`, 'steps-container');
                } else {
                    addStep(`<p>${this.tf('step-infinite-solutions', { rank: result.rank, free: result.freeVariables })}</p>`, 'steps-container');
                    addStep(`<p>${this.t('step-general-solution')}</p>`, 'steps-container');
                }
                break;
            }
        }
        
        // 显示结果
        if (result.type === 'unique-solution') {
            let solDisplay = '<ul class="list-disc list-inside space-y-2">';
            result.solution.forEach((val, idx) => {
                solDisplay += `<li class="text-lg">x<sub>${idx + 1}</sub> = <span class="font-mono font-semibold">${formatNumber(val)}</span></li>`;
            });
            solDisplay += '</ul>';
            
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">✓ ${this.t('result-unique-solution')}</h3>
                    ${solDisplay}
                </div>
            `);
        } else if (result.type === 'no-solution') {
            showResult(`
                <div class="result-card border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">✗ ${this.t('result-no-solution')}</h3>
                    <p class="text-red-600 dark:text-red-300">${this.t('result-no-solution-desc')}</p>
                </div>
            `);
        } else {
            showResult(`
                <div class="result-card border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <h3 class="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-3">∞ ${this.t('result-infinite-solutions')}</h3>
                    <p class="text-gray-700 dark:text-gray-300">${this.tf('result-rank', { rank: result.rank })}</p>
                    <p class="text-gray-700 dark:text-gray-300">${this.tf('result-free-vars', { free: result.freeVariables })}</p>
                </div>
            `);
        }
    },

    recalcVectorGroup(state) {
        const vectors = state.vectors.map(v => v.map(x => typeof x === 'object' && x.valueOf ? x.valueOf() : x));
        
        clearSteps('steps-container');
        
        addStep(`<p>${this.tf('step-vector-group', { count: state.vectorCount, dim: state.vectorDimension })}</p><div class="space-y-2 mt-2">`, 'steps-container');
        vectors.forEach((vec, idx) => {
            addStep(`<p>α<sub>${idx + 1}</sub> = </p><div id="step-vg-${idx}"></div>`, 'steps-container');
            displayVector(vec, `step-vg-${idx}`);
        });
        addStep(`</div>`, 'steps-container');
        
        let result;
        
        switch (state.operation) {
            case 'linear-dependency': {
                const isDep = isLinearlyDependent(vectors);
                const rank = vectorGroupRank(vectors);
                
                addStep(`<p>${this.tf('step-group-rank', { rank })}</p>`, 'steps-container');
                addStep(`<p class="font-semibold">${rank < state.vectorCount ? '✓ ' + this.t('step-linear-dependent') : '✗ ' + this.t('step-linear-independent')}</p>`, 'steps-container');
                
                result = isDep;
                break;
            }
            
            case 'max-independent': {
                const { vectors: maxIndVectors, indices } = maxIndependentSet(vectors);
                
                addStep(`<p>${this.tf('step-max-independent-set', { count: maxIndVectors.length })}</p><div class="space-y-2 mt-2">`, 'steps-container');
                maxIndVectors.forEach((vec, idx) => {
                    const origIdx = indices[idx] + 1;
                    addStep(`<p>α<sub>${origIdx}</sub> = </p><div id="step-mi-${idx}"></div>`, 'steps-container');
                    displayVector(vec, `step-mi-${idx}`);
                });
                addStep(`</div>`, 'steps-container');
                
                result = { vectors: maxIndVectors, indices };
                break;
            }
            
            case 'rank': {
                const rank = vectorGroupRank(vectors);
                addStep(`<p>${this.tf('step-group-rank', { rank })}</p>`, 'steps-container');
                result = rank;
                break;
            }
            
            case 'schmidt': {
                const { orthogonal, orthonormal } = schmidtOrthogonalization(vectors);
                
                addStep(`<p>${this.t('step-orthogonalized')}</p><div class="space-y-2 mt-2">`, 'steps-container');
                orthogonal.forEach((vec, idx) => {
                    addStep(`<p>β<sub>${idx + 1}</sub> = </p><div id="step-ortho-${idx}"></div>`, 'steps-container');
                    displayVector(vec, `step-ortho-${idx}`);
                });
                addStep(`</div>`, 'steps-container');
                
                addStep(`<p>${this.t('step-normalized')}</p><div class="space-y-2 mt-2">`, 'steps-container');
                orthonormal.forEach((vec, idx) => {
                    addStep(`<p>γ<sub>${idx + 1}</sub> = </p><div id="step-on-${idx}"></div>`, 'steps-container');
                    displayVector(vec, `step-on-${idx}`);
                });
                addStep(`</div>`, 'steps-container');
                
                result = { orthogonal, orthonormal };
                break;
            }
        }
        
        // 显示结果
        if (typeof result === 'boolean') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-linear-dep-analysis')}</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-orange-500' : 'text-green-600'}">${result ? this.t('result-linear-dep') : this.t('result-linear-indep')}</p>
                </div>
            `);
        } else if (typeof result === 'number') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-group-rank')}</h3>
                    <p class="text-3xl font-bold text-primary text-center">${result}</p>
                </div>
            `);
        } else if (result.vectors && result.indices) {
            let vecDisplay = '<ul class="list-disc list-inside space-y-1">';
            result.indices.forEach(idx => {
                vecDisplay += `<li>α<sub>${idx + 1}</sub></li>`;
            });
            vecDisplay += '</ul>';
            
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-max-independent')}</h3>
                    <p class="mb-2 text-gray-600 dark:text-gray-400">${this.tf('result-max-independent-desc', { count: result.vectors.length })}</p>
                    ${vecDisplay}
                </div>
            `);
        } else if (result.orthogonal && result.orthonormal) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-schmidt')}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-2">${this.tf('result-orthogonalized', { count: result.orthogonal.length })}</p>
                    <div id="schmidt-ortho" class="mb-4"></div>
                    <p class="text-gray-600 mb-2">${this.tf('result-normalized', { count: result.orthonormal.length })}</p>
                    <div id="schmidt-on"></div>
                </div>
            `);
            
            const showVec = (vecs, containerId) => {
                const container = document.getElementById(containerId);
                if (!container) return;
                container.innerHTML = '<div class="result-vector-container space-y-2">';
                vecs.slice(0, 3).forEach(v => {
                    const row = document.createElement('div');
                    row.className = 'flex gap-2';
                    v.forEach(el => {
                        const span = document.createElement('span');
                        span.className = 'result-vector-cell';
                        span.textContent = formatNumber(el);
                        row.appendChild(span);
                    });
                    container.appendChild(row);
                });
                if (vecs.length > 3) {
                    container.innerHTML += `<p class="text-gray-400 text-sm">...${this.tf('result-total-vectors', { count: vecs.length })}</p>`;
                }
            };
            showVec(result.orthogonal, 'schmidt-ortho');
            showVec(result.orthonormal, 'schmidt-on');
        }
    },

    recalcQuadraticForm(state) {
        let matrix = state.matrix.map(r => r.map(v => typeof v === 'object' && v.valueOf ? v.valueOf() : v));
        
        clearSteps('steps-container');
        
        addStep(`<p>${this.tf('step-quadratic-matrix', { dim: state.dimension })}</p><div id="step-qf"></div>`, 'steps-container');
        displayMatrix(matrix, 'step-qf');
        
        let result;
        
        switch (state.operation) {
            case 'standard-form': {
                const { matrix: stdMatrix, eigenvalues } = standardForm(matrix);
                
                let evDisplay = `<p>${this.t('step-eigenvalues-label')}</p><ul class="list-disc list-inside space-y-1">`;
                eigenvalues.forEach((ev, idx) => {
                    if (typeof ev === 'object' && 'real' in ev) {
                        const sign = ev.imag >= 0 ? '+' : '';
                        evDisplay += `<li>λ<sub>${idx + 1}</sub> = ${formatNumber(ev.real)} ${sign}${formatNumber(ev.imag)}i</li>`;
                    } else {
                        evDisplay += `<li>λ<sub>${idx + 1}</sub> = ${formatNumber(ev)}</li>`;
                    }
                });
                evDisplay += '</ul>';
                addStep(evDisplay, 'steps-container');
                
                addStep(`<p>${this.t('step-std-matrix')}</p><div id="step-std"></div>`, 'steps-container');
                displayMatrix(stdMatrix, 'step-std');
                
                result = { matrix: stdMatrix, eigenvalues };
                break;
            }
            
            case 'canonical-form': {
                const canonMatrix = canonicalForm(matrix);
                addStep(`<p>${this.t('step-canon-matrix')}</p><div id="step-canon"></div>`, 'steps-container');
                displayMatrix(canonMatrix, 'step-canon');
                
                let p = 0, q = 0;
                for (let i = 0; i < state.dimension; i++) {
                    const ev = typeof matrix[i] !== 'undefined' ? (typeof matrix[i][i] === 'number' ? matrix[i][i] : 0) : 0;
                    if (ev > 0) p++;
                    else if (ev < 0) q++;
                }
                
                result = canonMatrix;
                break;
            }
            
            case 'positive-definite': {
                const isPD = isPositiveDefinite(matrix);
                
                let minorStr = `<p>${this.t('step-principal-minors')}</p><ul class="list-disc list-inside space-y-1">`;
                for (let i = 1; i <= state.dimension; i++) {
                    const minor = getPrincipalMinor(matrix, i);
                    const det = determinant(minor);
                    minorStr += `<li>Δ<sub>${i}</sub> = ${formatNumber(det)} ${det > 0 ? '> 0 ✓' : '≤ 0 ✗'}</li>`;
                }
                minorStr += '</ul>';
                addStep(minorStr, 'steps-container');
                
                addStep(`<p class="font-semibold">${isPD ? '✓ ' + this.t('step-positive-definite-result') : '✗ ' + this.t('step-not-positive-definite')}</p>`, 'steps-container');
                
                result = isPD;
                break;
            }
        }
        
        // 显示结果
        if (typeof result === 'boolean') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-positive-def-analysis')}</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-green-600' : 'text-red-500'}">${result ? '✓ ' + this.t('result-positive-def') : '✗ ' + this.t('result-not-positive-def')}</p>
                </div>
            `);
        } else if (result.matrix && result.eigenvalues) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-standard-form')}</h3>
                    <div id="result-std"></div>
                </div>
            `);
            displayMatrix(result.matrix, 'result-std');
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">${this.t('result-canonical-form')}</h3>
                    <div id="result-canon"></div>
                </div>
            `);
            displayMatrix(result, 'result-canon');
        }
    },

    /**
     * 获取当前语言的翻译
     * @param {string} key - 翻译键
     * @returns {string} 翻译文本
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
};

// 自动初始化
if (typeof window !== 'undefined') {
    window.i18n = i18n;
    document.addEventListener('DOMContentLoaded', () => i18n.init());
}
