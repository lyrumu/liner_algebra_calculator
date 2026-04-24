/**
 * UI事件处理模块
 * 包含所有标签页的交互逻辑和计算触发器
 */

// ==================== 行列式计算 ====================

function handleDeterminantCalculate() {
    try {
        const rows = parseInt(document.getElementById('det-rows').value) || 3;
        const cols = parseInt(document.getElementById('det-cols').value) || 3;
        
        if (rows !== cols) {
            throw new Error('行列式计算要求矩阵必须是方阵');
        }
        
        if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
            throw new Error('矩阵维度必须在1-10之间');
        }
        
        const matrix = getMatrixFromInput('det-matrix-container', rows, cols);
        
        clearSteps('steps-container');
        
        addStep(`<p>输入矩阵 A（${rows}×${cols}）：</p><div id="step-matrix"></div>`, 'steps-container');
        displayMatrix(matrix, 'step-matrix');
        
        const result = determinant(matrix);
        
        addStep(`<p>det(A) = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
        
        showResult(`
            <div class="result-card">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">行列式计算结果</h3>
                <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
            </div>
        `);
        
        addToHistory('determinant', { rows, cols, matrix }, `行列式 = ${formatNumber(result)}`);
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 矩阵运算 ====================

function handleMatrixOperationChange() {
    const operation = document.getElementById('matrix-operation').value;
    const matrixBSection = document.getElementById('matrix-b-section');
    const scalarSection = document.getElementById('scalar-section');
    
    matrixBSection.classList.add('hidden');
    scalarSection.classList.add('hidden');
    
    switch (operation) {
        case 'add':
        case 'subtract':
        case 'multiply':
            matrixBSection.classList.remove('hidden');
            break;
        case 'scalar-multiply':
            scalarSection.classList.remove('hidden');
            break;
    }
}

function handleMatrixCalculate() {
    try {
        const operation = document.getElementById('matrix-operation').value;
        const rowsA = parseInt(document.getElementById('mat-a-rows').value) || 2;
        const colsA = parseInt(document.getElementById('mat-a-cols').value) || 2;
        const matrixA = getMatrixFromInput('mat-a-container', rowsA, colsA);
        
        if (rowsA < 1 || rowsA > 10 || colsA < 1 || colsA > 10) {
            throw new Error('矩阵维度必须在1-10之间');
        }
        
        clearSteps('steps-container');
        
        addStep(`<p>矩阵 A（${rowsA}×${colsA}）：</p><div id="step-matrix-a"></div>`, 'steps-container');
        displayMatrix(matrixA, 'step-matrix-a');
        
        let result, historyInput = { operation, matrixA };
        
        switch (operation) {
            case 'add': {
                const rowsB = parseInt(document.getElementById('mat-b-rows').value) || 2;
                const colsB = parseInt(document.getElementById('mat-b-cols').value) || 2;
                const matrixB = getMatrixFromInput('mat-b-container', rowsB, colsB);
                
                addStep(`<p>矩阵 B（${rowsB}×${colsB}）：</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                
                result = addMatrices(matrixA, matrixB);
                historyInput.matrixB = matrixB;
                
                addStep(`<p>A + B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            
            case 'subtract': {
                const rowsB = parseInt(document.getElementById('mat-b-rows').value) || 2;
                const colsB = parseInt(document.getElementById('mat-b-cols').value) || 2;
                const matrixB = getMatrixFromInput('mat-b-container', rowsB, colsB);
                
                addStep(`<p>矩阵 B（${rowsB}×${colsB}）：</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                
                result = subtractMatrices(matrixA, matrixB);
                historyInput.matrixB = matrixB;
                
                addStep(`<p>A - B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            
            case 'multiply': {
                const rowsB = parseInt(document.getElementById('mat-b-rows').value) || 2;
                const colsB = parseInt(document.getElementById('mat-b-cols').value) || 2;
                const matrixB = getMatrixFromInput('mat-b-container', rowsB, colsB);
                
                addStep(`<p>矩阵 B（${rowsB}×${colsB}）：</p><div id="step-matrix-b"></div>`, 'steps-container');
                displayMatrix(matrixB, 'step-matrix-b');
                
                result = multiplyMatrices(matrixA, matrixB);
                historyInput.matrixB = matrixB;
                
                addStep(`<p>A × B = </p><div id="step-result"></div>`, 'steps-container');
                displayMatrix(result, 'step-result');
                break;
            }
            
            case 'scalar-multiply': {
                const scalar = parseFloat(document.getElementById('scalar-value').value);
                if (isNaN(scalar)) throw new Error('请输入有效的标量值');
                
                addStep(`<p>标量 k = <strong>${formatNumber(scalar)}</strong></p>`, 'steps-container');
                
                result = scalarMultiplyMatrix(matrixA, scalar);
                historyInput.scalar = scalar;
                
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
                
                let eigenDisplay = '<p>特征值：</p><ul class="list-disc list-inside space-y-1">';
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
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">矩阵 ${getOperationName(operation)} 结果</h3>
                    <div id="result-matrix"></div>
                </div>
            `);
            displayMatrix(result, 'result-matrix');
            addToHistory('matrix-operation', historyInput, `矩阵 ${getOperationName(operation)}`);
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
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">特征值结果</h3>
                    ${resultDisplay}
                </div>
            `);
            addToHistory('matrix-operation', historyInput, `特征值`);
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">计算结果</h3>
                    <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
                </div>
            `);
            addToHistory('matrix-operation', historyInput, `${getOperationName(operation)} = ${formatNumber(result)}`);
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 向量运算 ====================

function handleVectorOperationChange() {
    const operation = document.getElementById('vector-operation').value;
    const vectorVSection = document.getElementById('vector-v-section');
    const scalarSection = document.getElementById('vec-scalar-section');
    
    vectorVSection.classList.add('hidden');
    scalarSection.classList.add('hidden');
    
    switch (operation) {
        case 'add':
        case 'subtract':
        case 'dot-product':
        case 'cross-product':
        case 'angle':
        case 'orthogonality':
            vectorVSection.classList.remove('hidden');
            break;
        case 'scalar-multiply':
            scalarSection.classList.remove('hidden');
            break;
    }
}

function handleVectorCalculate() {
    try {
        const operation = document.getElementById('vector-operation').value;
        const lengthU = parseInt(document.getElementById('vec-u-length').value) || 3;
        const vectorU = getVectorFromInput('vec-u-container', lengthU);
        
        if (lengthU < 1 || lengthU > 10) {
            throw new Error('向量维度必须在1-10之间');
        }
        
        clearSteps('steps-container');
        
        addStep(`<p>向量 u（${lengthU}维）：</p><div id="step-vector-u"></div>`, 'steps-container');
        displayVector(vectorU, 'step-vector-u');
        
        let result, historyInput = { operation, vectorU: vectorU.map(v => toFraction(v.valueOf())) };
        
        switch (operation) {
            case 'add': {
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthU !== lengthV) throw new Error('两个向量维度必须相同');
                
                addStep(`<p>向量 v（${lengthV}维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                result = addVectors(vectorU, vectorV);
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                
                addStep(`<p>u + v = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            
            case 'subtract': {
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthU !== lengthV) throw new Error('两个向量维度必须相同');
                
                addStep(`<p>向量 v（${lengthV}维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                result = subtractVectors(vectorU, vectorV);
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                
                addStep(`<p>u - v = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            
            case 'scalar-multiply': {
                const scalar = parseFloat(document.getElementById('vec-scalar-value').value);
                if (isNaN(scalar)) throw new Error('请输入有效的标量值');
                
                addStep(`<p>标量 k = <strong>${formatNumber(scalar)}</strong></p>`, 'steps-container');
                
                result = scalarMultiplyVector(vectorU, scalar);
                historyInput.scalar = scalar;
                
                addStep(`<p>k × u = </p><div id="step-result"></div>`, 'steps-container');
                displayVector(result, 'step-result');
                break;
            }
            
            case 'dot-product': {
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthU !== lengthV) throw new Error('两个向量维度必须相同');
                
                addStep(`<p>向量 v（${lengthV}维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                result = dotProduct(vectorU, vectorV);
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                
                addStep(`<p>u · v = <strong>${formatNumber(result)}</strong></p>`, 'steps-container');
                break;
            }
            
            case 'cross-product': {
                if (lengthU !== 3) throw new Error('叉积运算仅适用于3维向量');
                
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthV !== 3) throw new Error('叉积运算仅适用于3维向量');
                
                addStep(`<p>向量 v（3维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                result = crossProduct(vectorU, vectorV);
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                
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
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthU !== lengthV) throw new Error('两个向量维度必须相同');
                
                addStep(`<p>向量 v（${lengthV}维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                const angleRad = vectorAngle(vectorU, vectorV);
                const angleDeg = angleRad * 180 / Math.PI;
                
                addStep(`<p>cos θ = (u·v) / (||u|| ||v||)</p>`, 'steps-container');
                addStep(`<p>θ = <strong>${formatNumber(angleRad)}</strong> rad = <strong>${formatNumber(angleDeg)}</strong>°</p>`, 'steps-container');
                
                result = angleDeg;
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                break;
            }
            
            case 'orthogonality': {
                const lengthV = parseInt(document.getElementById('vec-v-length').value) || 3;
                const vectorV = getVectorFromInput('vec-v-container', lengthV);
                
                if (lengthU !== lengthV) throw new Error('两个向量维度必须相同');
                
                addStep(`<p>向量 v（${lengthV}维）：</p><div id="step-vector-v"></div>`, 'steps-container');
                displayVector(vectorV, 'step-vector-v');
                
                const dot = dotProduct(vectorU, vectorV);
                const isOrtho = areOrthogonal(vectorU, vectorV);
                
                addStep(`<p>u · v = ${formatNumber(dot)}</p>`, 'steps-container');
                addStep(`<p>${dot.valueOf() === 0 ? '✓' : '✗'} 向量 u 和 v ${isOrtho ? '正交' : '不正交'}</p>`, 'steps-container');
                
                result = isOrtho;
                historyInput.vectorV = vectorV.map(v => toFraction(v.valueOf()));
                break;
            }
        }
        
        // 显示结果
        if (Array.isArray(result)) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">向量 ${getOperationName(operation)} 结果</h3>
                    <div id="result-vector"></div>
                </div>
            `);
            displayVector(result, 'result-vector');
            addToHistory('vector-operation', historyInput, `向量 ${getOperationName(operation)}`);
        } else if (typeof result === 'boolean') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">正交性检验结果</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-green-600' : 'text-red-500'}">${result ? '✓ 正交' : '✗ 不正交'}</p>
                </div>
            `);
            addToHistory('vector-operation', historyInput, `正交性：${result ? '正交' : '不正交'}`);
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">计算结果</h3>
                    <p class="text-3xl font-bold text-primary text-center">${formatNumber(result)}</p>
                </div>
            `);
            addToHistory('vector-operation', historyInput, `${getOperationName(operation)} = ${formatNumber(result)}`);
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 线性方程组求解 ====================

function handleSystemCalculate() {
    try {
        const method = document.getElementById('system-method').value;
        const equations = parseInt(document.getElementById('sys-equations').value) || 3;
        const variables = parseInt(document.getElementById('sys-variables').value) || 3;
        const coefficients = getMatrixFromInput('sys-coefficients-container', equations, variables);
        const constants = getVectorFromInput('sys-constants-container', equations);
        
        if (equations < 1 || equations > 10 || variables < 1 || variables > 10) {
            throw new Error('方程数和变量数必须在1-10之间');
        }
        
        clearSteps('steps-container');
        
        // 显示方程组
        addStep(`<p>线性方程组：</p><div class="mt-2 space-y-1">`, 'steps-container');
        for (let i = 0; i < equations; i++) {
            let terms = '';
            for (let j = 0; j < variables; j++) {
                const coeff = coefficients[i][j].valueOf();
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
        
        switch (method) {
            case 'gauss': {
                result = gaussElimination(coefficients, constants);
                
                if (result.type === 'unique-solution') {
                    let solStr = '<p>方程组有唯一解：</p><ul class="list-disc list-inside space-y-1">';
                    result.solution.forEach((val, idx) => {
                        solStr += `<li>x<sub>${idx + 1}</sub> = <strong>${formatNumber(val)}</strong></li>`;
                    });
                    solStr += '</ul>';
                    addStep(solStr, 'steps-container');
                } else if (result.type === 'no-solution') {
                    addStep('<p class="text-red-600 font-semibold">✗ 方程组无解（矛盾方程）</p>', 'steps-container');
                } else {
                    addStep(`<p>方程组有无穷多解，系数矩阵的秩 = ${result.rank}，自由变量数 = ${result.freeVariables}</p>`, 'steps-container');
                }
                break;
            }
            
            case 'lu': {
                if (equations !== variables) throw new Error('LU分解仅适用于方阵系数矩阵');
                
                const { L, U } = luDecomposition(coefficients);
                
                addStep(`<p>L = </p><div id="step-l"></div>`, 'steps-container');
                displayMatrix(L, 'step-l');
                
                addStep(`<p>U = </p><div id="step-u"></div>`, 'steps-container');
                displayMatrix(U, 'step-u');
                
                const solution = solveWithLU(L, U, constants);
                
                let solStr = '<p>方程组的解：</p><ul class="list-disc list-inside space-y-1">';
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
                    let solStr = '<p>方程组有唯一解：</p><ul class="list-disc list-inside space-y-1">';
                    result.solution.forEach((val, idx) => {
                        solStr += `<li>x<sub>${idx + 1}</sub> = <strong>${formatNumber(val)}</strong></li>`;
                    });
                    solStr += '</ul>';
                    addStep(solStr, 'steps-container');
                } else if (result.type === 'no-solution') {
                    addStep('<p class="text-red-600 font-semibold">✗ 方程组无解</p>', 'steps-container');
                } else {
                    addStep(`<p>方程组有无穷多解，系数矩阵的秩 = ${result.rank}，自由变量数 = ${result.freeVariables}</p>`, 'steps-container');
                    addStep(`<p>通解 = 特解 + 齐次方程组基础解系的线性组合</p>`, 'steps-container');
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
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">✓ 唯一解</h3>
                    ${solDisplay}
                </div>
            `);
            addToHistory('linear-system', { method, coefficients, constants }, `唯一解`);
        } else if (result.type === 'no-solution') {
            showResult(`
                <div class="result-card border-red-200 bg-red-50">
                    <h3 class="text-lg font-semibold text-red-700 mb-2">✗ 无解</h3>
                    <p class="text-red-600">方程组存在矛盾，无解</p>
                </div>
            `);
            addToHistory('linear-system', { method, coefficients, constants }, '无解');
        } else {
            showResult(`
                <div class="result-card border-yellow-200 bg-yellow-50">
                    <h3 class="text-lg font-semibold text-yellow-700 mb-3">∞ 无穷多解</h3>
                    <p>系数矩阵的秩 = <strong>${result.rank}</strong></p>
                    <p>自由变量数 = <strong>${result.freeVariables}</strong></p>
                </div>
            `);
            addToHistory('linear-system', { method, coefficients, constants }, `无穷多解（秩=${result.rank}）`);
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 向量组分析 ====================

function handleVectorGroupCalculate() {
    try {
        const operation = document.getElementById('vector-group-operation').value;
        const vectorCount = parseInt(document.getElementById('vg-vectors').value) || 3;
        const vectorDimension = parseInt(document.getElementById('vg-dimension').value) || 3;
        
        if (vectorCount < 1 || vectorCount > 10 || vectorDimension < 1 || vectorDimension > 10) {
            throw new Error('向量个数和维度必须在1-10之间');
        }
        
        const vectors = [];
        for (let i = 0; i < vectorCount; i++) {
            vectors.push(getVectorFromInput(`vg-vector-${i}-container`, vectorDimension));
        }
        
        clearSteps('steps-container');
        
        addStep(`<p>向量组（共${vectorCount}个${vectorDimension}维向量）：</p><div class="space-y-2 mt-2">`, 'steps-container');
        vectors.forEach((vec, idx) => {
            addStep(`<p>α<sub>${idx + 1}</sub> = </p><div id="step-vg-${idx}"></div>`, 'steps-container');
            displayVector(vec, `step-vg-${idx}`);
        });
        addStep(`</div>`, 'steps-container');
        
        let result, historyInput = { operation, vectors: vectors.map(v => v.map(x => toFraction(x.valueOf()))) };
        
        switch (operation) {
            case 'linear-dependency': {
                const isDep = isLinearlyDependent(vectors);
                const rank = vectorGroupRank(vectors);
                
                addStep(`<p>向量组的秩 = <strong>${rank}</strong></p>`, 'steps-container');
                addStep(`<p class="font-semibold">${rank < vectorCount ? '✓ 线性相关' : '✗ 线性无关'}</p>`, 'steps-container');
                
                result = isDep;
                break;
            }
            
            case 'max-independent': {
                const { vectors: maxIndVectors, indices } = maxIndependentSet(vectors);
                
                addStep(`<p>极大无关组（包含 ${maxIndVectors.length} 个向量）：</p><div class="space-y-2 mt-2">`, 'steps-container');
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
                addStep(`<p>向量组的秩 = <strong>${rank}</strong></p>`, 'steps-container');
                result = rank;
                break;
            }
            
            case 'schmidt': {
                const { orthogonal, orthonormal } = schmidtOrthogonalization(vectors);
                
                addStep(`<p>正交化后的向量组：</p><div class="space-y-2 mt-2">`, 'steps-container');
                orthogonal.forEach((vec, idx) => {
                    addStep(`<p>β<sub>${idx + 1}</sub> = </p><div id="step-ortho-${idx}"></div>`, 'steps-container');
                    displayVector(vec, `step-ortho-${idx}`);
                });
                addStep(`</div>`, 'steps-container');
                
                addStep(`<p>单位化后的向量组：</p><div class="space-y-2 mt-2">`, 'steps-container');
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
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">线性相关性分析</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-orange-500' : 'text-green-600'}">${result ? '线性相关' : '线性无关'}</p>
                </div>
            `);
            addToHistory('vector-group', historyInput, `线性${result ? '相关' : '无关'}`);
        } else if (typeof result === 'number') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">向量组的秩</h3>
                    <p class="text-3xl font-bold text-primary text-center">${result}</p>
                </div>
            `);
            addToHistory('vector-group', historyInput, `秩 = ${result}`);
        } else if (result.vectors && result.indices) {
            let vecDisplay = '<ul class="list-disc list-inside space-y-1">';
            result.indices.forEach(idx => {
                vecDisplay += `<li>α<sub>${idx + 1}</sub></li>`;
            });
            vecDisplay += '</ul>';
            
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">极大无关组</h3>
                    <p class="mb-2 text-gray-600">包含以下 ${result.vectors.length} 个向量：</p>
                    ${vecDisplay}
                </div>
            `);
            addToHistory('vector-group', historyInput, '极大无关组');
        } else if (result.orthogonal && result.orthonormal) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">施密特正交化</h3>
                    <p class="text-gray-600 mb-2">正交化：${result.orthogonal.length} 个向量</p>
                    <div id="schmidt-ortho" class="mb-4"></div>
                    <p class="text-gray-600 mb-2">单位正交化：${result.orthonormal.length} 个向量</p>
                    <div id="schmidt-on"></div>
                </div>
            `);
            
            // 显示部分结果
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
                    container.innerHTML += `<p class="text-gray-400 text-sm">...共 ${vecs.length} 个向量</p>`;
                }
            };
            showVec(result.orthogonal, 'schmidt-ortho');
            showVec(result.orthonormal, 'schmidt-on');
            
            addToHistory('vector-group', historyInput, '施密特正交化');
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 二次型分析 ====================

function handleQuadraticCalculate() {
    try {
        const operation = document.getElementById('quadratic-operation').value;
        const dimension = parseInt(document.getElementById('qf-dimension').value) || 3;
        const matrix = getMatrixFromInput('qf-matrix-container', dimension, dimension);
        
        if (dimension < 1 || dimension > 10) {
            throw new Error('维度必须在1-10之间');
        }
        
        let symMatrix = matrix;
        let wasSymmetrized = false;
        if (!isSymmetric(matrix)) {
            symMatrix = makeSymmetric(matrix);
            wasSymmetrized = true;
        }
        
        clearSteps('steps-container');
        
        if (wasSymmetrized) {
            addStep(`<p class="text-amber-600">⚠ 输入矩阵非对称，已自动对称化</p>`, 'steps-container');
        }
        
        addStep(`<p>二次型矩阵 A（${dimension}×${dimension}）：</p><div id="step-qf"></div>`, 'steps-container');
        displayMatrix(symMatrix, 'step-qf');
        
        let result;
        
        switch (operation) {
            case 'standard-form': {
                const { matrix: stdMatrix, eigenvalues } = standardForm(symMatrix);
                
                let evDisplay = '<p>特征值：</p><ul class="list-disc list-inside space-y-1">';
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
                
                addStep(`<p>标准形矩阵（对角矩阵）：</p><div id="step-std"></div>`, 'steps-container');
                displayMatrix(stdMatrix, 'step-std');
                
                result = { matrix: stdMatrix, eigenvalues };
                break;
            }
            
            case 'canonical-form': {
                const canonMatrix = canonicalForm(symMatrix);
                addStep(`<p>规范形矩阵（正负惯性指数）：</p><div id="step-canon"></div>`, 'steps-container');
                displayMatrix(canonMatrix, 'step-canon');
                
                let p = 0, q = 0;
                for (let i = 0; i < Math.min(dimension, result?.eigenvalues?.length || 0); i++) {
                    const ev = typeof result.eigenvalues[i] === 'object' ? result.eigenvalues[i].real : result.eigenvalues[i];
                    if (ev > 0) p++;
                    else if (ev < 0) q++;
                }
                
                result = canonMatrix;
                break;
            }
            
            case 'positive-definite': {
                const isPD = isPositiveDefinite(symMatrix);
                
                let minorStr = '<p>顺序主子式：</p><ul class="list-disc list-inside space-y-1">';
                for (let i = 1; i <= dimension; i++) {
                    const minor = getPrincipalMinor(symMatrix, i);
                    const det = determinant(minor);
                    minorStr += `<li>Δ<sub>${i}</sub> = ${formatNumber(det)} ${det.valueOf() > 0 ? '> 0 ✓' : '≤ 0 ✗'}</li>`;
                }
                minorStr += '</ul>';
                addStep(minorStr, 'steps-container');
                
                addStep(`<p class="font-semibold">${isPD ? '✓ 二次型正定' : '✗ 二次型不正定'}</p>`, 'steps-container');
                
                result = isPD;
                break;
            }
        }
        
        // 显示结果
        if (typeof result === 'boolean') {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">正定性分析结果</h3>
                    <p class="text-3xl font-bold text-center ${result ? 'text-green-600' : 'text-red-500'}">${result ? '✓ 正定' : '✗ 不正定'}</p>
                </div>
            `);
            addToHistory('quadratic-form', { operation, matrix: symMatrix }, `正定性：${result ? '正定' : '不正定'}`);
        } else if (result.matrix && result.eigenvalues) {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">标准形结果</h3>
                    <div id="result-std"></div>
                </div>
            `);
            displayMatrix(result.matrix, 'result-std');
            addToHistory('quadratic-form', { operation, matrix: symMatrix }, '标准形');
        } else {
            showResult(`
                <div class="result-card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">规范形结果</h3>
                    <div id="result-canon"></div>
                </div>
            `);
            displayMatrix(result, 'result-canon');
            addToHistory('quadratic-form', { operation, matrix: symMatrix }, '规范形');
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// ==================== 错误处理 ====================

function showError(message) {
    showResult(`
        <div class="result-card border-red-200 bg-red-50">
            <h3 class="text-lg font-semibold text-red-700 mb-2">⚠ 计算错误</h3>
            <p class="text-red-600">${message}</p>
        </div>
    `);
    clearSteps('steps-container');
}
