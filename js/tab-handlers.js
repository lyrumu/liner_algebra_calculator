/**
 * 标签页切换与状态管理模块
 */

// 全局变量
let currentTab = 'determinant';

/**
 * 切换标签页
 * @param {string} tabId - 标签页ID（不含 '-tab' 后缀）
 */
function switchTab(tabId) {
    currentTab = tabId;
    
    // 更新导航栏状态
    document.querySelectorAll('#nav-tabs button').forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // 更新内容区域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const targetContent = document.getElementById(`${tabId}-tab`);
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
    
    // 清空结果和步骤
    const noDataText = (typeof window !== 'undefined' && window.i18n) ? window.i18n.t('no-data') : '请在左侧输入数据并点击计算按钮';
    showResult(`
        <div class="flex flex-col items-center justify-center h-40 text-gray-400">
            <i class="fa fa-calculator text-4xl mb-3"></i>
            <p>${noDataText}</p>
        </div>
    `);
    clearSteps('steps-container');
    document.getElementById('steps-container').classList.add('hidden');
    const showStepsText = (typeof window !== 'undefined' && window.i18n) ? window.i18n.t('show-steps') : '显示步骤';
    document.getElementById('toggle-steps').innerHTML = 
        `<span>${showStepsText}</span><i class="fa fa-chevron-down ml-1"></i>`;
    
    // 切换到对应tab时重新初始化输入控件
    initializeTabInputs(tabId);
}

/**
 * 初始化各标签页的输入控件
 * @param {string} tabId - 标签页ID
 */
function initializeTabInputs(tabId) {
    switch (tabId) {
        case 'determinant':
            createMatrixInput('det-matrix-container', 3, 3);
            break;
        case 'matrix':
            createMatrixInput('mat-a-container', 2, 2);
            createMatrixInput('mat-b-container', 2, 2);
            handleMatrixOperationChange();
            break;
        case 'vector':
            createVectorInput('vec-u-container', 3);
            createVectorInput('vec-v-container', 3);
            handleVectorOperationChange();
            break;
        case 'linear-system':
            createMatrixInput('sys-coefficients-container', 3, 3);
            createVectorInput('sys-constants-container', 3);
            break;
        case 'vector-group':
            initVectorGroupInputs();
            break;
        case 'quadratic-form':
            createMatrixInput('qf-matrix-container', 3, 3);
            break;
    }
}

/**
 * 初始化向量组输入
 */
function initVectorGroupInputs() {
    const vectorCount = parseInt(document.getElementById('vg-vectors')?.value) || 3;
    const vectorDimension = parseInt(document.getElementById('vg-dimension')?.value) || 3;
    
    const container = document.getElementById('vector-group-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < vectorCount; i++) {
        const vectorDiv = document.createElement('div');
        vectorDiv.className = 'mb-3';
        const alphaLabel = (typeof window !== 'undefined' && window.i18n) ? window.i18n.tf('vector-alpha', { index: i + 1 }) : `向量 α${i + 1}`;
        vectorDiv.innerHTML = `
            <label class="block text-sm text-gray-600 mb-1 font-medium">${alphaLabel}</label>
            <div id="vg-vector-${i}-container" class="flex flex-wrap gap-1"></div>
        `;
        container.appendChild(vectorDiv);
        createVectorInput(`vg-vector-${i}-container`, vectorDimension);
    }
}

/**
 * 初始化标签页切换事件
 */
function initTabHandlers() {
    document.querySelectorAll('#nav-tabs button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
}

/**
 * 步骤显示切换
 */
function initStepsToggle() {
    document.getElementById('toggle-steps')?.addEventListener('click', () => {
        const stepsContainer = document.getElementById('steps-container');
        const toggleButton = document.getElementById('toggle-steps');
        const showText = (typeof window !== 'undefined' && window.i18n) ? window.i18n.t('show-steps') : '显示步骤';
        const hideText = (typeof window !== 'undefined' && window.i18n) ? window.i18n.t('hide-steps') : '隐藏步骤';

        if (stepsContainer.classList.contains('hidden')) {
            stepsContainer.classList.remove('hidden');
            toggleButton.innerHTML = `<span>${hideText}</span><i class="fa fa-chevron-up ml-1"></i>`;
        } else {
            stepsContainer.classList.add('hidden');
            toggleButton.innerHTML = `<span>${showText}</span><i class="fa fa-chevron-down ml-1"></i>`;
        }
    });
}

/**
 * 初始化行列式输入事件
 */
function initDeterminantHandlers() {
    document.getElementById('det-resize')?.addEventListener('click', () => {
        const rows = parseInt(document.getElementById('det-rows')?.value) || 3;
        const cols = parseInt(document.getElementById('det-cols')?.value) || 3;
        createMatrixInput('det-matrix-container', rows, cols);
    });
    
    document.getElementById('det-calculate')?.addEventListener('click', handleDeterminantCalculate);
    
    document.getElementById('det-clear')?.addEventListener('click', () => {
        const rows = parseInt(document.getElementById('det-rows')?.value) || 3;
        const cols = parseInt(document.getElementById('det-cols')?.value) || 3;
        createMatrixInput('det-matrix-container', rows, cols, '');
    });
}

/**
 * 初始化矩阵运算事件
 */
function initMatrixHandlers() {
    document.getElementById('matrix-operation')?.addEventListener('change', handleMatrixOperationChange);
    
    document.getElementById('mat-a-resize')?.addEventListener('click', () => {
        const rows = parseInt(document.getElementById('mat-a-rows')?.value) || 2;
        const cols = parseInt(document.getElementById('mat-a-cols')?.value) || 2;
        createMatrixInput('mat-a-container', rows, cols);
    });
    
    document.getElementById('mat-b-resize')?.addEventListener('click', () => {
        const rows = parseInt(document.getElementById('mat-b-rows')?.value) || 2;
        const cols = parseInt(document.getElementById('mat-b-cols')?.value) || 2;
        createMatrixInput('mat-b-container', rows, cols);
    });
    
    document.getElementById('matrix-calculate')?.addEventListener('click', handleMatrixCalculate);
    
    document.getElementById('matrix-clear')?.addEventListener('click', () => {
        const rowsA = parseInt(document.getElementById('mat-a-rows')?.value) || 2;
        const colsA = parseInt(document.getElementById('mat-a-cols')?.value) || 2;
        const rowsB = parseInt(document.getElementById('mat-b-rows')?.value) || 2;
        const colsB = parseInt(document.getElementById('mat-b-cols')?.value) || 2;
        createMatrixInput('mat-a-container', rowsA, colsA, '');
        createMatrixInput('mat-b-container', rowsB, colsB, '');
    });
}

/**
 * 初始化向量运算事件
 */
function initVectorHandlers() {
    document.getElementById('vector-operation')?.addEventListener('change', handleVectorOperationChange);
    
    document.getElementById('vec-u-resize')?.addEventListener('click', () => {
        const length = parseInt(document.getElementById('vec-u-length')?.value) || 3;
        createVectorInput('vec-u-container', length);
    });
    
    document.getElementById('vec-v-resize')?.addEventListener('click', () => {
        const length = parseInt(document.getElementById('vec-v-length')?.value) || 3;
        createVectorInput('vec-v-container', length);
    });
    
    document.getElementById('vector-calculate')?.addEventListener('click', handleVectorCalculate);
    
    document.getElementById('vector-clear')?.addEventListener('click', () => {
        const lengthU = parseInt(document.getElementById('vec-u-length')?.value) || 3;
        const lengthV = parseInt(document.getElementById('vec-v-length')?.value) || 3;
        createVectorInput('vec-u-container', lengthU, '');
        createVectorInput('vec-v-container', lengthV, '');
    });
}

/**
 * 初始化线性方程组事件
 */
function initSystemHandlers() {
    document.getElementById('sys-resize')?.addEventListener('click', () => {
        const equations = parseInt(document.getElementById('sys-equations')?.value) || 3;
        const variables = parseInt(document.getElementById('sys-variables')?.value) || 3;
        createMatrixInput('sys-coefficients-container', equations, variables);
        createVectorInput('sys-constants-container', equations);
    });
    
    document.getElementById('system-calculate')?.addEventListener('click', handleSystemCalculate);
    
    document.getElementById('system-clear')?.addEventListener('click', () => {
        const equations = parseInt(document.getElementById('sys-equations')?.value) || 3;
        const variables = parseInt(document.getElementById('sys-variables')?.value) || 3;
        createMatrixInput('sys-coefficients-container', equations, variables, '');
        createVectorInput('sys-constants-container', equations, '');
    });
}

/**
 * 初始化向量组事件
 */
function initVectorGroupHandlers() {
    document.getElementById('vg-resize')?.addEventListener('click', () => {
        initVectorGroupInputs();
    });
    
    document.getElementById('vg-vectors')?.addEventListener('change', () => {
        initVectorGroupInputs();
    });
    
    document.getElementById('vg-dimension')?.addEventListener('change', () => {
        initVectorGroupInputs();
    });
    
    document.getElementById('vector-group-calculate')?.addEventListener('click', handleVectorGroupCalculate);
    
    document.getElementById('vector-group-clear')?.addEventListener('click', () => {
        initVectorGroupInputs();
    });
}

/**
 * 初始化二次型事件
 */
function initQuadraticHandlers() {
    document.getElementById('qf-resize')?.addEventListener('click', () => {
        const dimension = parseInt(document.getElementById('qf-dimension')?.value) || 3;
        createMatrixInput('qf-matrix-container', dimension, dimension);
    });
    
    document.getElementById('quadratic-calculate')?.addEventListener('click', handleQuadraticCalculate);
    
    document.getElementById('quadratic-clear')?.addEventListener('click', () => {
        const dimension = parseInt(document.getElementById('qf-dimension')?.value) || 3;
        createMatrixInput('qf-matrix-container', dimension, dimension, '');
    });
}

/**
 * 初始化历史记录事件
 */
function initHistoryHandlers() {
    document.getElementById('clear-history')?.addEventListener('click', () => {
        const confirmMsg = (typeof window !== 'undefined' && window.i18n) ? window.i18n.t('confirm-clear-history') : '确定要清空所有历史记录吗？';
        if (confirm(confirmMsg)) {
            calculationHistory = [];
            try {
                localStorage.removeItem('linearAlgebraHistory');
            } catch (e) {}
            updateHistoryDisplay();
        }
    });
}
