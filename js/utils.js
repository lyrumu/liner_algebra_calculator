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
 * 矩阵输入框键盘导航
 */
function handleMatrixKeyNav(e) {
    const input = e.target;
    const container = input.closest('table');
    if (!container) return;

    const inputs = Array.from(container.querySelectorAll('.matrix-cell-input'));
    const currentIndex = inputs.indexOf(input);
    const cols = parseInt(input.dataset.cols) || 3;
    let nextIndex = -1;

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= inputs.length) nextIndex = 0;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex + cols;
        if (nextIndex >= inputs.length) nextIndex = currentIndex % cols;
    } else if (e.key === 'ArrowUp') {
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

    const div = document.createElement('div');
    div.className = 'vector-input-container';
    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'vector-cell-input';
        input.id = `${containerId}-${i}`;
        input.value = defaultValue;
        input.dataset.index = i;
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
        'add': '加法', 'subtract': '减法', 'multiply': '乘法',
        'scalar-multiply': '数乘', 'transpose': '转置', 'inverse': '求逆',
        'adjugate': '伴随矩阵', 'rank': '秩', 'trace': '迹',
        'eigen': '特征值和特征向量', 'dot-product': '点积',
        'cross-product': '叉积', 'length': '长度', 'angle': '夹角',
        'orthogonality': '正交性检验', 'linear-dependency': '线性相关性',
        'max-independent': '极大无关组', 'schmidt': '施密特正交化',
        'standard-form': '标准形', 'canonical-form': '规范形',
        'positive-definite': '正定性', 'gauss': '高斯消元法',
        'lu': 'LU分解', 'basis-solution': '基础解系', 'general-solution': '通解'
    };
    return names[operation] || operation;
}

/**
 * 添加到历史记录
 */
function addToHistory(type, input, result) {
    const historyItem = {
        id: Date.now(),
        type,
        input,
        result,
        timestamp: new Date().toLocaleString('zh-CN')
    };
    calculationHistory.unshift(historyItem);
    if (calculationHistory.length > 50) calculationHistory.pop();
    try {
        localStorage.setItem('linearAlgebraHistory', JSON.stringify(calculationHistory));
    } catch (e) {}
    updateHistoryDisplay();
}

/**
 * 更新历史记录显示
 */
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    historyList.innerHTML = '';

    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="text-gray-400 text-center py-8">暂无历史记录</p>';
        return;
    }

    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        let inputDisplay = '';
        switch (item.type) {
            case 'determinant':
                inputDisplay = `行列式 (${item.input.rows}×${item.input.cols})`; break;
            case 'matrix-operation':
                inputDisplay = `矩阵 ${getOperationName(item.input.operation)}`; break;
            case 'vector-operation':
                inputDisplay = `向量 ${getOperationName(item.input.operation)}`; break;
            case 'linear-system':
                inputDisplay = `线性方程组 (${getOperationName(item.input.method)})`; break;
            case 'vector-group':
                inputDisplay = `向量组 ${getOperationName(item.input.operation)}`; break;
            case 'quadratic-form':
                inputDisplay = `二次型 ${getOperationName(item.input.operation)}`; break;
            default:
                inputDisplay = item.type;
        }

        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-type">${inputDisplay}</span>
                <span class="history-item-time">${item.timestamp}</span>
            </div>
            <div class="history-item-result">${item.result}</div>
        `;
        historyItem.addEventListener('click', () => {
            if (typeof loadFromHistory === 'function') loadFromHistory(item);
        });
        historyList.appendChild(historyItem);
    });
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
