/**
 * 工具函数库
 * 包含UI辅助函数、格式化函数、历史记录管理等
 */

/**
 * 格式化数字或分数显示
 * @param {Fraction|number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    if (num instanceof Fraction) {
        // 对大分子/大分母的分数，转为小数显示以避免不美观的超长分数
        if (num.denominator > 100 || Math.abs(num.numerator) > 100) {
            const val = num.valueOf();
            // 保留合适精度的小数（最多6位有效数字）
            if (Math.abs(val) < 1e-10) return '0';
            if (Math.abs(val) >= 1e6 || (Math.abs(val) < 1e-3 && val !== 0)) {
                return val.toExponential(4);
            }
            // 四舍六入五成双，保留6位小数
            return parseFloat(val.toPrecision(8)).toString();
        }
        return num.toString();
    }
    
    if (typeof num !== 'number' || isNaN(num)) {
        return 'N/A';
    }
    
    if (Math.abs(num) < 1e-10) return '0';
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 1e-3 && num !== 0)) {
        return num.toExponential(6);
    }
    
    const rounded = Math.round(num * 1e6) / 1e6;
    return rounded.toString();
}

/**
 * 将数字或分数转换为分数对象
 * @param {Fraction|number|string} value - 输入值
 * @returns {Fraction} 分数对象
 */
function toFraction(value) {
    if (value instanceof Fraction) return value;
    if (typeof value === 'string') {
        try { return Fraction.fromString(value); } 
        catch (e) { return new Fraction(parseFloat(value) || 0); }
    }
    return new Fraction(value);
}

/**
 * 将矩阵中的所有元素转换为分数
 * @param {Array<Array>} matrix - 输入矩阵
 * @returns {Array<Array<Fraction>>} 分数矩阵
 */
function matrixToFractions(matrix) {
    return matrix.map(row => row.map(cell => toFraction(cell)));
}

/**
 * 将向量中的所有元素转换为分数
 * @param {Array} vector - 输入向量
 * @returns {Array<Fraction>} 分数向量
 */
function vectorToFractions(vector) {
    return vector.map(cell => toFraction(cell));
}

/**
 * 创建矩阵输入控件
 * @param {string} containerId - 容器ID
 * @param {number} rows - 行数
 * @param {number} cols - 列数
 * @param {string} defaultValue - 默认值（可选）
 */
function createMatrixInput(containerId, rows, cols, defaultValue = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // 清空按钮区域
    const toolbar = document.createElement('div');
    toolbar.className = 'flex justify-end mb-1';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700';
    clearBtn.title = window.i18n ? window.i18n.t('clear') : '清空';
    clearBtn.innerHTML = '<i class="fa fa-times"></i>';
    clearBtn.addEventListener('click', () => {
        const table = container.querySelector('.matrix-input-table');
        if (table) {
            table.querySelectorAll('.matrix-cell-input').forEach(input => {
                input.value = '';
                input.focus();
            });
        }
        // 保存清空后的状态到标签页状态中
        saveTabState(currentTab);
    });
    toolbar.appendChild(clearBtn);
    container.appendChild(toolbar);

    const table = document.createElement('table');
    table.className = 'matrix-input-table';
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'matrix-cell-input';
            input.id = `${containerId}-${i}-${j}`;
            input.value = defaultValue;
            input.dataset.row = i;
            input.dataset.col = j;
            input.dataset.cols = cols;
            input.addEventListener('keydown', handleMatrixKeyNav);
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

/**
 * 获取当前标签页的所有输入容器的有序列表（按输入顺序）
 * @returns {Array<{containerId: string, type: string}>} 容器列表，type为'matrix'|'vector'|'scalar'
 */
function getInputContainersForCurrentTab() {
    const tab = typeof currentTab !== 'undefined' ? currentTab : 'determinant';
    const containers = [];
    
    switch (tab) {
        case 'determinant':
            containers.push({ containerId: 'det-matrix-container', type: 'matrix' });
            break;
            
        case 'matrix': {
            const operation = document.getElementById('matrix-operation')?.value || 'add';
            containers.push({ containerId: 'mat-a-container', type: 'matrix' });
            if (['add', 'subtract', 'multiply'].includes(operation)) {
                containers.push({ containerId: 'mat-b-container', type: 'matrix' });
            } else if (operation === 'scalar-multiply') {
                // 标量值用特殊处理
                containers.push({ containerId: 'scalar-value', type: 'scalar' });
            }
            break;
        }
        
        case 'vector': {
            const operation = document.getElementById('vector-operation')?.value || 'add';
            containers.push({ containerId: 'vec-u-container', type: 'vector' });
            if (['add', 'subtract', 'dot-product', 'cross-product', 'angle', 'orthogonality'].includes(operation)) {
                containers.push({ containerId: 'vec-v-container', type: 'vector' });
            } else if (operation === 'scalar-multiply') {
                containers.push({ containerId: 'vec-scalar-value', type: 'scalar' });
            }
            break;
        }
        
        case 'linear-system':
            containers.push({ containerId: 'sys-coefficients-container', type: 'matrix' });
            containers.push({ containerId: 'sys-constants-container', type: 'vector' });
            break;
            
        case 'vector-group': {
            // 动态获取向量组容器数量
            const vgContainer = document.getElementById('vector-group-container');
            if (vgContainer) {
                const vectorContainers = vgContainer.querySelectorAll('[id^="vg-vector-"][id$="-container"]');
                vectorContainers.forEach((vc) => {
                    containers.push({ containerId: vc.id, type: 'vector' });
                });
            }
            break;
        }
        
        case 'quadratic-form':
            containers.push({ containerId: 'qf-matrix-container', type: 'matrix' });
            break;
    }
    
    return containers;
}

/**
 * 获取当前标签页的计算按钮ID
 * @returns {string|null}
 */
function getCalculateButtonForCurrentTab() {
    const tab = typeof currentTab !== 'undefined' ? currentTab : 'determinant';
    switch (tab) {
        case 'determinant': return 'det-calculate';
        case 'matrix': return 'matrix-calculate';
        case 'vector': return 'vector-calculate';
        case 'linear-system': return 'system-calculate';
        case 'vector-group': return 'vector-group-calculate';
        case 'quadratic-form': return 'quadratic-calculate';
        default: return null;
    }
}

/**
 * 矩阵/向量输入框键盘导航（方向键 + 回车）
 * 增强功能：
 * 1. 在同一矩阵/向量内按行优先顺序跳转
 * 2. 最后一个输入框回车时跳转到下一个容器
 * 3. 所有输入完成后回车直接触发计算
 */
function handleMatrixKeyNav(e) {
    const input = e.target;
    const isVectorInput = input.dataset.containerType === 'vector';

    // 向量输入：获取同容器内的所有输入框
    let inputs;
    if (isVectorInput) {
        const vc = document.getElementById(input.dataset.containerId);
        inputs = vc ? Array.from(vc.querySelectorAll('.vector-cell-input')) : [input];
    } else if (input.type === 'text' && input.classList.contains('matrix-cell-input')) {
        // 矩阵输入：从table中获取
        const container = input.closest('table');
        if (!container) return;
        inputs = Array.from(container.querySelectorAll('.matrix-cell-input'));
    } else {
        return; // 非矩阵/向量输入框不处理
    }

    const currentIndex = inputs.indexOf(input);
    if (currentIndex === -1) return;
    
    const cols = parseInt(input.dataset.cols) || inputs.length; // 矩阵列数，向量时为总长度
    let nextIndex = -1;

    if (e.key === 'Enter') {
        e.preventDefault();
        nextIndex = currentIndex + 1;
        
        // 如果已到当前容器的最后一个输入框
        if (nextIndex >= inputs.length) {
            // 尝试跳转到下一个容器
            const allContainers = getInputContainersForCurrentTab();
            
            // 找到当前容器在列表中的位置
            let currentContainerId;
            if (isVectorInput) {
                currentContainerId = input.dataset.containerId;
            } else {
                const table = input.closest('table');
                currentContainerId = table?.parentElement?.id || '';
            }
            
            const containerIdx = allContainers.findIndex(c => c.containerId === currentContainerId);
            
            // 如果还有下一个容器
            if (containerIdx >= 0 && containerIdx < allContainers.length - 1) {
                // 找下一个容器的第一个可聚焦输入框
                const nextContainer = allContainers[containerIdx + 1];
                let nextInput = null;
                
                if (nextContainer.type === 'scalar') {
                    // 标量输入
                    nextInput = document.getElementById(nextContainer.containerId);
                } else if (nextContainer.type === 'matrix') {
                    const tbl = document.querySelector(`#${nextContainer.containerId} .matrix-input-table`);
                    nextInput = tbl?.querySelector('.matrix-cell-input');
                } else if (nextContainer.type === 'vector') {
                    const vc = document.getElementById(nextContainer.containerId);
                    nextInput = vc?.querySelector('.vector-cell-input');
                }
                
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                    return;
                }
            } else {
                // 已是最后一个容器的最后一个输入框 → 触发计算
                const calcBtnId = getCalculateButtonForCurrentTab();
                const calcBtn = calcBtnId ? document.getElementById(calcBtnId) : null;
                if (calcBtn) {
                    calcBtn.click();
                    return;
                }
                // 没有计算按钮则循环回第一个
                nextIndex = 0;
            }
        }
    } else if (!isVectorInput && e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= inputs.length) nextIndex = 0;
    } else if (!isVectorInput && e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex + cols;
        if (nextIndex >= inputs.length) nextIndex = currentIndex % cols;
    } else if (!isVectorInput && e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex - cols;
        if (nextIndex < 0) nextIndex = inputs.length - cols + (currentIndex % cols);
    }

    if (nextIndex >= 0 && nextIndex < inputs.length) {
        inputs[nextIndex].focus();
        inputs[nextIndex].select();
    }
}

/**
 * 创建向量输入控件
 * @param {string} containerId - 容器ID
 * @param {number} length - 向量维度
 * @param {string} defaultValue - 默认值（可选）
 */
function createVectorInput(containerId, length, defaultValue = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // 清空按钮区域
    const toolbar = document.createElement('div');
    toolbar.className = 'flex justify-end mb-1';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700';
    clearBtn.title = window.i18n ? window.i18n.t('clear') : '清空';
    clearBtn.innerHTML = '<i class="fa fa-times"></i>';
    clearBtn.addEventListener('click', () => {
        const vc = container.querySelector('.vector-input-container');
        if (vc) {
            vc.querySelectorAll('.vector-cell-input').forEach(input => {
                input.value = '';
                input.focus();
            });
        }
        saveTabState(currentTab);
    });
    toolbar.appendChild(clearBtn);
    container.appendChild(toolbar);

    const div = document.createElement('div');
    div.className = 'vector-input-container';
    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'vector-cell-input';
        input.id = `${containerId}-${i}`;
        input.value = defaultValue;
        input.dataset.index = i;
        // 为向量输入框也添加回车跳转和方向键导航
        input.dataset.containerType = 'vector';
        input.dataset.containerId = containerId;
        input.addEventListener('keydown', handleMatrixKeyNav);
        div.appendChild(input);
    }
    container.appendChild(div);
}

/**
 * 从输入控件获取矩阵数据
 */
function getMatrixFromInput(containerId, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${containerId}-${i}-${j}`);
            const value = input ? input.value.trim() : '';
            try {
                row.push(value === '' ? new Fraction(0) : toFraction(value));
            } catch (error) {
                row.push(new Fraction(0));
            }
        }
        matrix.push(row);
    }
    return matrix;
}

/**
 * 从输入控件获取向量数据
 */
function getVectorFromInput(containerId, length) {
    const vector = [];
    for (let i = 0; i < length; i++) {
        const input = document.getElementById(`${containerId}-${i}`);
        const value = input ? input.value.trim() : '';
        try {
            vector.push(value === '' ? new Fraction(0) : toFraction(value));
        } catch (error) {
            vector.push(new Fraction(0));
        }
    }
    return vector;
}

/**
 * 显示矩阵结果
 */
function displayMatrix(matrix, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-display';

    const table = document.createElement('table');
    table.className = 'result-matrix-table';
    matrix.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = formatNumber(cell);
            td.className = 'result-matrix-cell';
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    matrixDiv.appendChild(table);
    container.appendChild(matrixDiv);
}

/**
 * 显示向量结果
 */
function displayVector(vector, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vectorDiv = document.createElement('div');
    vectorDiv.className = 'vector-display';

    const div = document.createElement('div');
    div.className = 'result-vector-container';
    vector.forEach(element => {
        const span = document.createElement('span');
        span.className = 'result-vector-cell';
        span.textContent = formatNumber(element);
        div.appendChild(span);
    });

    vectorDiv.appendChild(div);
    container.appendChild(vectorDiv);
}

/**
 * 添加计算步骤
 */
function addStep(description, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-item';

    const stepNumber = document.createElement('div');
    stepNumber.className = 'step-number';
    stepNumber.textContent = container.children.length + 1;

    const stepContent = document.createElement('div');
    stepContent.className = 'step-content';
    stepContent.innerHTML = description;

    stepDiv.appendChild(stepNumber);
    stepDiv.appendChild(stepContent);
    container.appendChild(stepDiv);
}

/**
 * 清空步骤容器
 */
function clearSteps(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
}

/**
 * 显示计算结果
 */
function showResult(content) {
    const container = document.getElementById('result-container');
    if (container) container.innerHTML = content;
}

/**
 * 获取操作名称（中文）
 */
function getOperationName(operation) {
    const names = {
        'add': 'op-add', 'subtract': 'op-subtract', 'multiply': 'op-multiply',
        'scalar-multiply': 'op-scalar-multiply', 'transpose': 'op-transpose', 'inverse': 'op-inverse',
        'adjugate': 'op-adjugate', 'rank': 'op-rank', 'trace': 'op-trace',
        'eigen': 'op-eigen', 'dot-product': 'op-dot-product',
        'cross-product': 'op-cross-product', 'length': 'op-length', 'angle': 'op-angle',
        'orthogonality': 'op-orthogonality', 'linear-dependency': 'op-linear-dependency',
        'max-independent': 'op-max-independent', 'schmidt': 'op-schmidt',
        'standard-form': 'op-standard-form', 'canonical-form': 'op-canonical-form',
        'positive-definite': 'op-positive-definite', 'gauss': 'op-gauss',
        'lu': 'op-lu', 'basis-solution': 'op-basis-solution', 'general-solution': 'op-general-solution'
    };
    const key = names[operation] || operation;
    return (typeof window !== 'undefined' && window.i18n) ? window.i18n.t(key) : key;
}

/**
 * 添加到历史记录
 */
function addToHistory(type, input, result) {
    const historyItem = {
        id: Date.now(),
        type,
        input,
        result, // 保留原始结果用于兼容性
        timestamp: new Date().toLocaleString(navigator.language)
    };
    calculationHistory.unshift(historyItem);
    if (calculationHistory.length > 50) calculationHistory.pop();
    try {
        localStorage.setItem('linearAlgebraHistory', JSON.stringify(calculationHistory));
    } catch (e) {}
    updateHistoryDisplay();
}

/**
 * 更新历史记录显示（支持语言切换时动态翻译）
 */
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    historyList.innerHTML = '';

    if (calculationHistory.length === 0) {
        historyList.innerHTML = `<p class="text-gray-400 text-center py-8">${window.i18n ? window.i18n.t('history-no-history') : '暂无历史记录'}</p>`;
        return;
    }

    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        // 使用当前语言生成类型标签
        let inputDisplay = '';
        switch (item.type) {
            case 'determinant':
                inputDisplay = window.i18n ? window.i18n.tf('history-determinant', { rows: item.input.rows, cols: item.input.cols }) : `行列式 (${item.input.rows}×${item.input.cols})`; break;
            case 'matrix-operation':
                inputDisplay = window.i18n ? window.i18n.tf('history-matrix-op', { op: getOperationName(item.input.operation) }) : `矩阵 ${getOperationName(item.input.operation)}`; break;
            case 'vector-operation':
                inputDisplay = window.i18n ? window.i18n.tf('history-vector-op', { op: getOperationName(item.input.operation) }) : `向量 ${getOperationName(item.input.operation)}`; break;
            case 'linear-system':
                inputDisplay = window.i18n ? window.i18n.tf('history-linear-system', { method: getOperationName(item.input.method) }) : `线性方程组 (${getOperationName(item.input.method)})`; break;
            case 'vector-group':
                inputDisplay = window.i18n ? window.i18n.tf('history-vector-group', { op: getOperationName(item.input.operation) }) : `向量组 ${getOperationName(item.input.operation)}`; break;
            case 'quadratic-form':
                inputDisplay = window.i18n ? window.i18n.tf('history-quadratic-form', { op: getOperationName(item.input.operation) }) : `二次型 ${getOperationName(item.input.operation)}`; break;
            default:
                inputDisplay = item.type;
        }

        // 使用当前语言生成结果文字
        let resultDisplay = translateHistoryResult(item);

        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-type">${inputDisplay}</span>
                <span class="history-item-time">${item.timestamp}</span>
            </div>
            <div class="history-item-result">${resultDisplay}</div>
        `;
        historyItem.addEventListener('click', () => {
            if (typeof loadFromHistory === 'function') loadFromHistory(item);
        });
        historyList.appendChild(historyItem);
    });
}

/**
 * 根据历史记录条目，使用当前语言翻译结果文字
 */
function translateHistoryResult(item) {
    if (!window.i18n) return item.result || '';
    
    const i18n = window.i18n;
    const r = item.result || '';
    
    // 根据类型和结果内容模式，用当前语言重新生成结果文字
    try {
        switch (item.type) {
            case 'determinant': {
                // 格式: "计算行列式 = X" 或 "Determinant Result = X"
                const match = r.match(/[=＝]\s*(.+)$/);
                const val = match ? match[1].trim() : '';
                return `${i18n.t('calculate-determinant')} = ${val}`;
            }
            case 'matrix-operation': {
                const op = item.input?.operation;
                // 矩阵运算结果显示
                if (op === 'eigen' || r.includes(i18n.translations.zh['result-eigenvalues']) || r.includes(i18n.translations.en['result-eigenvalues']) || r.includes('特征值')) {
                    return i18n.t('op-eigen');
                }
                if (r.includes('=') && !r.includes(i18n.translations[i18n.currentLang]['matrix'])) {
                    // 标量结果格式: "秩 = 2" 等
                    const match = r.match(/^(.+?)\s*[=＝]\s*(.+)$/);
                    if (match) {
                        const opName = getOperationName(op);
                        return `${opName} = ${match[2]}`;
                    }
                }
                // 矩阵结果（只有操作名）
                return i18n.tf('history-matrix-op', { op: getOperationName(op) });
            }
            case 'vector-operation': {
                const op = item.input?.operation;
                if (r.includes('✓') || r.includes('✗')) {
                    // 正交性检验结果
                    if (r.includes(i18n.translations.zh['result-orthogonal']) || r.includes(i18n.translations.en['result-orthogonal']) ||
                        r.includes('正交') || r.includes('Orthogonal')) {
                        return `${i18n.t('orthogonality')}：${i18n.t(r.includes('✓') ? 'result-orthogonal' : 'result-not-orthogonal')}`;
                    }
                }
                if (r.includes('=') && !r.includes(i18n.translations[i18n.currentLang]['vector'])) {
                    const match = r.match(/^(.+?)\s*[=＝]\s*(.+)$/);
                    if (match) return `${getOperationName(op)} = ${match[2]}`;
                }
                return i18n.tf('history-vector-op', { op: getOperationName(op) });
            }
            case 'linear-system': {
                // 唯一解 / 无解 / 无穷多解
                if (r.includes('✓') || r === i18n.translations.zh['result-unique-solution'] || r === i18n.translations.en['result-unique-solution'] || r.includes('唯一解') || r.includes('Unique')) {
                    return `✓ ${i18n.t('result-unique-solution')}`;
                }
                if (r.includes('✗') || r === i18n.translations.zh['result-no-solution'] || r === i18n.translations.en['result-no-solution'] || r.includes('无解') || r.includes('No Solution')) {
                    return `✗ ${i18n.t('result-no-solution')}`;
                }
                if (r.includes('∞') || r.includes('无穷多') || r.includes('Infinite')) {
                    const rankMatch = r.match(/rank[=＝](\d+)/i) || r.match(/秩[=＝](\d+)/);
                    const rank = rankMatch ? rankMatch[1] : '?';
                    return `∞ ${i18n.t('result-infinite-solutions')}（${i18n.t('op-rank')}=${rank}）`;
                }
                return r;
            }
            case 'vector-group': {
                const op = item.input?.operation;
                if (r.includes('线性相关') || r.includes('Linearly Dependent') || r.includes(i18n.translations.zh['result-linear-dep']) || r.includes(i18n.translations.en['result-linear-dep'])) {
                    return `${i18n.t('op-linear-dependency')}：${i18n.t('result-linear-dep')}`;
                }
                if (r.includes('线性无关') || r.includes('Linearly Independent') || r.includes(i18n.translations.zh['result-linear-indep']) || r.includes(i18n.translations.en['result-linear-indep'])) {
                    return `${i18n.t('op-linear-dependency')}：${i18n.t('result-linear-indep')}`;
                }
                if (r.includes('=') && !isNaN(parseInt(r.split('=')[1]))) {
                    const match = r.match(/^(.+?)[=＝](\d+)$/);
                    if (match) return `${i18n.t('op-rank')} = ${match[2]}`;
                }
                if (op === 'schmidt' || r.includes('施密特') || r.includes('Schmidt')) {
                    return i18n.t('op-schmidt');
                }
                if (op === 'max-independent' || r.includes('极大') || r.includes('Max')) {
                    return i18n.t('op-max-independent');
                }
                return i18n.tf('history-vector-group', { op: getOperationName(op) });
            }
            case 'quadratic-form': {
                const op = item.input?.operation;
                if (r.includes('正定') || r.includes('Positive') || r.includes(i18n.translations.zh['result-positive-def']) || r.includes(i18n.translations.en['result-positive-def'])) {
                    return `${i18n.t('op-positive-definite')}：${i18n.t('result-positive-def')}`;
                }
                if (r.includes('不正定') || r.includes('Not Positive')) {
                    return `${i18n.t('op-positive-definite')}：${i18n.t('result-not-positive-def')}`;
                }
                return i18n.tf('history-quadratic-form', { op: getOperationName(op) });
            }
            default:
                return r;
        }
    } catch(e) {
        return r;
    }
}

/**
 * 从历史记录加载
 */
function loadFromHistory(item) {
    switch (item.type) {
        case 'determinant':
            if (typeof switchTab === 'function') switchTab('determinant');
            if (item.input.rows) {
                document.getElementById('det-rows').value = item.input.rows;
                document.getElementById('det-cols').value = item.input.cols;
                document.getElementById('det-resize')?.click();
                setTimeout(() => {
                    const matrix = item.input.matrix;
                    if (Array.isArray(matrix)) {
                        for (let i = 0; i < matrix.length; i++) {
                            for (let j = 0; j < matrix[i].length; j++) {
                                const input = document.getElementById(`det-matrix-container-${i}-${j}`);
                                if (input) input.value = formatNumber(matrix[i][j]);
                            }
                        }
                    }
                }, 100);
            }
            break;
        case 'matrix-operation':
            if (typeof switchTab === 'function') switchTab('matrix');
            if (item.input.operation) {
                document.getElementById('matrix-operation').value = item.input.operation;
                if (typeof handleMatrixOperationChange === 'function') handleMatrixOperationChange();
            }
            break;
        case 'vector-operation':
            if (typeof switchTab === 'function') switchTab('vector');
            if (item.input.operation) {
                document.getElementById('vector-operation').value = item.input.operation;
                if (typeof handleVectorOperationChange === 'function') handleVectorOperationChange();
            }
            break;
        default:
            if (item.type && typeof switchTab === 'function') {
                const tabMap = { 'linear-system': 'linear-system', 'vector-group': 'vector-group', 'quadratic-form': 'quadratic-form' };
                if (tabMap[item.type]) switchTab(tabMap[item.type]);
            }
    }
}
