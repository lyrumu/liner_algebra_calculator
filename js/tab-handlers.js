/**
 * 标签页切换与状态管理模块
 */

// 全局变量
let currentTab = 'determinant';
// 记录历史记录之前的标签页，用于实现toggle
let tabBeforeHistory = null;
// 各标签页的输入数据状态（防止切换时丢失）
const tabInputStates = {};

/**
 * 保存当前标签页的输入数据
 */
function saveTabState(tabId) {
    const state = {};
    try {
        switch (tabId) {
            case 'determinant': {
                const rowsEl = document.getElementById('det-rows');
                const colsEl = document.getElementById('det-cols');
                if (!rowsEl || !colsEl) return;
                state.rows = parseInt(rowsEl.value) || 3;
                state.cols = parseInt(colsEl.value) || 3;
                state.matrix = getMatrixInputValues('det-matrix-container', state.rows, state.cols);
                break;
            }
            case 'matrix': {
                const opEl = document.getElementById('matrix-operation');
                const rAEl = document.getElementById('mat-a-rows');
                const cAEl = document.getElementById('mat-a-cols');
                if (!opEl || !rAEl || !cAEl) return;
                state.operation = opEl.value;
                state.rowsA = parseInt(rAEl.value) || 2;
                state.colsA = parseInt(cAEl.value) || 2;
                state.matrixA = getMatrixInputValues('mat-a-container', state.rowsA, state.colsA);
                // 矩阵B（如果可见）
                const bSection = document.getElementById('matrix-b-section');
                if (bSection && !bSection.classList.contains('hidden')) {
                    const rBEl = document.getElementById('mat-b-rows');
                    const cBEl = document.getElementById('mat-b-cols');
                    state.rowsB = parseInt(rBEl?.value) || 2;
                    state.colsB = parseInt(cBEl?.value) || 2;
                    state.matrixB = getMatrixInputValues('mat-b-container', state.rowsB, state.colsB);
                }
                // 标量值
                const scalarSection = document.getElementById('scalar-section');
                if (scalarSection && !scalarSection.classList.contains('hidden')) {
                    const svEl = document.getElementById('scalar-value');
                    state.scalar = svEl ? svEl.value : '2';
                }
                break;
            }
            case 'vector': {
                const opEl = document.getElementById('vector-operation');
                const lenUEl = document.getElementById('vec-u-length');
                if (!opEl || !lenUEl) return;
                state.operation = opEl.value;
                state.lengthU = parseInt(lenUEl.value) || 3;
                state.vectorU = getVectorInputValues('vec-u-container', state.lengthU);
                // 向量v
                const vSection = document.getElementById('vector-v-section');
                if (vSection && !vSection.classList.contains('hidden')) {
                    const lenVEl = document.getElementById('vec-v-length');
                    state.lengthV = parseInt(lenVEl?.value) || 3;
                    state.vectorV = getVectorInputValues('vec-v-container', state.lengthV);
                }
                // 标量值
                const vecScalarSection = document.getElementById('vec-scalar-section');
                if (vecScalarSection && !vecScalarSection.classList.contains('hidden')) {
                    const vsvEl = document.getElementById('vec-scalar-value');
                    state.scalar = vsvEl ? vsvEl.value : '2';
                }
                break;
            }
            case 'linear-system': {
                const methodEl = document.getElementById('system-method');
                const eqEl = document.getElementById('sys-equations');
                const varEl = document.getElementById('sys-variables');
                if (!methodEl || !eqEl || !varEl) return;
                state.method = methodEl.value;
                state.equations = parseInt(eqEl.value) || 3;
                state.variables = parseInt(varEl.value) || 3;
                state.coefficients = getMatrixInputValues('sys-coefficients-container', state.equations, state.variables);
                state.constants = getVectorInputValues('sys-constants-container', state.equations);
                break;
            }
            case 'vector-group': {
                const opEl = document.getElementById('vector-group-operation');
                const vcEl = document.getElementById('vg-vectors');
                const vdEl = document.getElementById('vg-dimension');
                if (!opEl || !vcEl || !vdEl) return;
                state.operation = opEl.value;
                state.vectorCount = parseInt(vcEl.value) || 3;
                state.vectorDimension = parseInt(vdEl.value) || 3;
                state.vectors = [];
                for (let i = 0; i < state.vectorCount; i++) {
                    state.vectors.push(getVectorInputValues(`vg-vector-${i}-container`, state.vectorDimension));
                }
                break;
            }
            case 'quadratic-form': {
                const opEl = document.getElementById('quadratic-operation');
                const dimEl = document.getElementById('qf-dimension');
                if (!opEl || !dimEl) return;
                state.operation = opEl.value;
                state.dimension = parseInt(dimEl.value) || 3;
                state.matrix = getMatrixInputValues('qf-matrix-container', state.dimension, state.dimension);
                break;
            }
        }
        tabInputStates[tabId] = state;
    } catch(e) {
        console.warn('保存标签页状态失败:', e);
    }
}

/**
 * 获取矩阵输入框的所有值
 */
function getMatrixInputValues(containerId, rows, cols) {
    const values = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${containerId}-${i}-${j}`);
            row.push(input ? input.value : '');
        }
        values.push(row);
    }
    return values;
}

/**
 * 获取向量输入框的所有值
 */
function getVectorInputValues(containerId, length) {
    const values = [];
    for (let i = 0; i < length; i++) {
        const input = document.getElementById(`${containerId}-${i}`);
        values.push(input ? input.value : '');
    }
    return values;
}

/**
 * 恢复指定标签页的输入数据
 */
function restoreTabState(tabId) {
    const state = tabInputStates[tabId];
    if (!state) return false;

    try {
        switch (tabId) {
            case 'determinant': {
                document.getElementById('det-rows').value = state.rows;
                document.getElementById('det-cols').value = state.cols;
                createMatrixInput('det-matrix-container', state.rows, state.cols);
                // 恢复矩阵值
                for (let i = 0; i < state.rows; i++) {
                    for (let j = 0; j < state.cols; j++) {
                        const input = document.getElementById(`det-matrix-container-${i}-${j}`);
                        if (input && state.matrix[i] && state.matrix[i][j] !== undefined) input.value = state.matrix[i][j];
                    }
                }
                return true;
            }
            case 'matrix': {
                document.getElementById('matrix-operation').value = state.operation;
                handleMatrixOperationChange();
                document.getElementById('mat-a-rows').value = state.rowsA;
                document.getElementById('mat-a-cols').value = state.colsA;
                createMatrixInput('mat-a-container', state.rowsA, state.colsA);
                for (let i = 0; i < state.rowsA; i++) {
                    for (let j = 0; j < state.colsA; j++) {
                        const input = document.getElementById(`mat-a-container-${i}-${j}`);
                        if (input && state.matrixA[i] && state.matrixA[i][j] !== undefined) input.value = state.matrixA[i][j];
                    }
                }
                // 矩阵B
                if (state.matrixB) {
                    document.getElementById('mat-b-rows').value = state.rowsB;
                    document.getElementById('mat-b-cols').value = state.colsB;
                    createMatrixInput('mat-b-container', state.rowsB, state.colsB);
                    for (let i = 0; i < state.rowsB; i++) {
                        for (let j = 0; j < state.colsB; j++) {
                            const input = document.getElementById(`mat-b-container-${i}-${j}`);
                            if (input && state.matrixB[i] && state.matrixB[i][j] !== undefined) input.value = state.matrixB[i][j];
                        }
                    }
                }
                // 标量值
                if (state.scalar !== undefined) {
                    document.getElementById('scalar-value').value = state.scalar;
                }
                return true;
            }
            case 'vector': {
                document.getElementById('vector-operation').value = state.operation;
                handleVectorOperationChange();
                document.getElementById('vec-u-length').value = state.lengthU;
                createVectorInput('vec-u-container', state.lengthU);
                for (let i = 0; i < state.lengthU; i++) {
                    const input = document.getElementById(`vec-u-container-${i}`);
                    if (input && state.vectorU[i] !== undefined) input.value = state.vectorU[i];
                }
                // 向量v
                if (state.vectorV) {
                    document.getElementById('vec-v-length').value = state.lengthV;
                    createVectorInput('vec-v-container', state.lengthV);
                    for (let i = 0; i < state.lengthV; i++) {
                        const input = document.getElementById(`vec-v-container-${i}`);
                        if (input && state.vectorV[i] !== undefined) input.value = state.vectorV[i];
                    }
                }
                // 标量值
                if (state.scalar !== undefined) {
                    document.getElementById('vec-scalar-value').value = state.scalar;
                }
                return true;
            }
            case 'linear-system': {
                document.getElementById('system-method').value = state.method;
                document.getElementById('sys-equations').value = state.equations;
                document.getElementById('sys-variables').value = state.variables;
                createMatrixInput('sys-coefficients-container', state.equations, state.variables);
                for (let i = 0; i < state.equations; i++) {
                    for (let j = 0; j < state.variables; j++) {
                        const input = document.getElementById(`sys-coefficients-container-${i}-${j}`);
                        if (input && state.coefficients[i] && state.coefficients[i][j] !== undefined) input.value = state.coefficients[i][j];
                    }
                }
                createVectorInput('sys-constants-container', state.equations);
                for (let i = 0; i < state.equations; i++) {
                    const input = document.getElementById(`sys-constants-container-${i}`);
                    if (input && state.constants[i] !== undefined) input.value = state.constants[i];
                }
                return true;
            }
            case 'vector-group': {
                document.getElementById('vector-group-operation').value = state.operation;
                document.getElementById('vg-vectors').value = state.vectorCount;
                document.getElementById('vg-dimension').value = state.vectorDimension;
                initVectorGroupInputs();
                for (let vi = 0; vi < state.vectorCount; vi++) {
                    for (let i = 0; i < state.vectorDimension; i++) {
                        const input = document.getElementById(`vg-vector-${vi}-container-${i}`);
                        if (input && state.vectors[vi] && state.vectors[vi][i] !== undefined) input.value = state.vectors[vi][i];
                    }
                }
                return true;
            }
            case 'quadratic-form': {
                document.getElementById('quadratic-operation').value = state.operation;
                document.getElementById('qf-dimension').value = state.dimension;
                createMatrixInput('qf-matrix-container', state.dimension, state.dimension);
                for (let i = 0; i < state.dimension; i++) {
                    for (let j = 0; j < state.dimension; j++) {
                        const input = document.getElementById(`qf-matrix-container-${i}-${j}`);
                        if (input && state.matrix[i] && state.matrix[i][j] !== undefined) input.value = state.matrix[i][j];
                    }
                }
                return true;
            }
        }
    } catch(e) {
        console.warn('恢复标签页状态失败:', e);
    }
    return false;
}
function switchTab(tabId) {
    // 保存当前标签页的输入数据（不保存history页）
    if (currentTab && currentTab !== tabId && currentTab !== 'history') {
        saveTabState(currentTab);
    }
    
    currentTab = tabId;
    
    // 更新侧边栏按钮状态
    document.querySelectorAll('.sidebar-item').forEach(button => {
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
    
    // 切换到对应tab时：先尝试恢复已保存的状态，如果没有则初始化默认输入控件
    if (!restoreTabState(tabId)) {
        initializeTabInputs(tabId);
    } else {
        // 恢复成功后，确保事件处理和UI状态正确
        if (tabId === 'matrix') handleMatrixOperationChange();
        if (tabId === 'vector') handleVectorOperationChange();
    }
    
    // 重新初始化标量输入的回车键导航（因为切换操作类型时可能显示/隐藏标量框）
    initScalarKeyNav();
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
    // 侧边栏按钮事件
    document.querySelectorAll('.sidebar-item').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
    
    // 历史记录按钮事件（支持toggle切换）
    document.getElementById('history-button')?.addEventListener('click', () => {
        if (currentTab === 'history') {
            // 当前已在历史记录页，切换回之前的页面
            if (tabBeforeHistory && tabBeforeHistory !== 'history') {
                switchTab(tabBeforeHistory);
                tabBeforeHistory = null;
            } else {
                // 没有历史记录或之前就是历史记录，回到默认页面
                switchTab('determinant');
                tabBeforeHistory = null;
            }
        } else {
            // 记录当前标签页并进入历史记录
            tabBeforeHistory = currentTab;
            switchTab('history');
        }
    });
}

/**
 * 初始化标量输入框的回车键支持（跳转到下一个容器或触发计算）
 */
function initScalarKeyNav() {
    const scalarInputs = [
        { id: 'scalar-value', nextCalcBtn: 'matrix-calculate' },
        { id: 'vec-scalar-value', nextCalcBtn: 'vector-calculate' }
    ];
    
    scalarInputs.forEach(({ id, nextCalcBtn }) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        // 避免重复绑定
        if (el.dataset.scalarKeyNavBound) return;
        el.dataset.scalarKeyNavBound = 'true';
        
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // 获取当前容器的后续容器列表，判断是否是最后一个
                const allContainers = getInputContainersForCurrentTab();
                // 标量输入通常不是第一个也不是最后一个（前面有矩阵/向量）
                const containerIdx = allContainers.findIndex(c => c.containerId === id);
                
                if (containerIdx >= 0 && containerIdx < allContainers.length - 1) {
                    // 还有下一个容器，跳过去
                    const nextContainer = allContainers[containerIdx + 1];
                    let nextInput = null;
                    
                    if (nextContainer.type === 'matrix') {
                        const tbl = document.querySelector(`#${nextContainer.containerId} .matrix-input-table`);
                        nextInput = tbl?.querySelector('.matrix-cell-input');
                    } else if (nextContainer.type === 'vector') {
                        const vc = document.getElementById(nextContainer.containerId);
                        nextInput = vc?.querySelector('.vector-cell-input');
                    } else if (nextContainer.type === 'scalar') {
                        nextInput = document.getElementById(nextContainer.containerId);
                    }
                    
                    if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                        return;
                    }
                }
                
                // 已是最后一个或没有下一个 → 触发计算
                const calcBtn = document.getElementById(nextCalcBtn);
                if (calcBtn) {
                    calcBtn.click();
                }
            }
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
