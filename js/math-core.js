/**
 * 线性代数核心计算模块
 * 包含所有矩阵、向量、方程组的计算算法
 * 所有计算使用分数类进行精确运算
 */

// ==================== 分数优化工具 ====================

/**
 * 将浮点数转换为简洁的有理分数（使用连分数逼近）
 * 避免浮点误差导致的超大分子分母
 * @param {number} val - 浮点数值
 * @param {number} maxDenominator - 最大分母限制（默认10000）
 * @returns {Fraction} 简洁的分数表示
 */
function simplifyFraction(val, maxDenominator = 100) {
    if (val === 0) return new Fraction(0);
    if (!isFinite(val)) return new Fraction(val > 0 ? 1 : -1);
    
    // 先尝试简单比例
    const absVal = Math.abs(val);
    // 检查常见简单分数（快速路径）
    const commonFractions = [
        [0, 1], [1, 12], [1, 10], [1, 9], [1, 8], [1, 7], [1, 6],
        [1, 5], [1, 4], [1, 3], [2, 5], [3, 8], [2, 7],
        [3, 7], [4, 9], [1, 2], [5, 9], [4, 7], [3, 5],
        [5, 8], [2, 3], [5, 7], [3, 4], [4, 5], [5, 6]
    ];
    
    let bestNum = Math.round(val);
    let bestDen = 1;
    let bestError = absVal - Math.abs(bestNum / bestDen);
    
    for (const [n, d] of commonFractions) {
        const approx = n / d;
        const error = Math.abs(absVal - approx);
        if (error < bestError || (error < 0.01 && d < bestDen)) {
            bestError = error;
            bestNum = n * (val >= 0 ? 1 : -1);
            bestDen = d;
            // 如果误差足够小，直接返回
            if (error < 1e-8) break;
        }
    }
    
    // 如果常见分数不够精确，使用连分数逼近
    if (bestError > 1e-6 && maxDenominator > 20) {
        try {
            const cfResult = continuedFractionApprox(val, maxDenominator);
            const cfError = Math.abs(absVal - Math.abs(cfResult.valueOf()));
            if (cfError <= bestError + 1e-8) {
                return cfResult;
            }
        } catch(e) {
            // 连分数失败时回退到最佳结果
        }
    }
    
    return new Fraction(bestNum, bestDen);
}

/**
 * 连分数逼近算法
 * 将浮点数转换为接近的最简分数
 */
function continuedFractionApprox(val, maxDenom) {
    if (Math.abs(val) < 1e-15) return new Fraction(0);
    
    let x = Math.abs(val);
    const sign = val >= 0 ? 1 : -1;
    
    let hPrev = 0, kPrev = 1;
    let hCurr = 1, kCurr = 0;
    
    for (let iter = 0; iter < 50; iter++) {
        const a = Math.floor(x);
        
        // 计算下一个收敛项
        const hNext = a * hCurr + hPrev;
        const kNext = a * kCurr + kPrev;
        
        hPrev = hCurr; kPrev = kCurr;
        hCurr = hNext; kCurr = kNext;
        
        // 检查是否超出分母限制
        if (kCurr > maxDenom) {
            // 回退到前一个收敛项
            return sign > 0 ? new Fraction(hPrev, kPrev) : new Fraction(-hPrev, kPrev);
        }
        
        const remainder = x - a;
        if (remainder < 1e-15) break;
        x = 1 / remainder;
    }
    
    return sign > 0 ? new Fraction(hCurr, kCurr) : new Fraction(-hCurr, kCurr);
}

/**
 * 优化的toFraction函数，优先产生简洁分数
 */
function toFractionOptimized(value, maxDenom = 10000) {
    if (value instanceof Fraction) return value;
    if (typeof value === 'string') {
        try { return Fraction.fromString(value); } 
        catch (e) { return simplifyFraction(parseFloat(value) || 0, maxDenom); }
    }
    if (typeof value === 'number') {
        // 整数或接近整数的情况
        if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-10) {
            return new Fraction(Math.round(value));
        }
        return simplifyFraction(value, maxDenom);
    }
    return new Fraction(value);
}

// ==================== 行列式计算 ====================

/**
 * 计算矩阵行列式（递归展开法）
 * @param {Array<Array<Fraction>>} matrix - 方阵
 * @returns {Fraction} 行列式值
 */
function determinant(matrix) {
    const n = matrix.length;
    
    // 检查是否为方阵
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能计算行列式');
        }
    }
    
    // 1x1矩阵
    if (n === 1) return matrix[0][0];
    
    // 2x2矩阵快速计算
    if (n === 2) {
        return matrix[0][0].multiply(matrix[1][1]).subtract(
               matrix[0][1].multiply(matrix[1][0]));
    }
    
    // 使用第一行展开（拉普拉斯展开）
    let det = new Fraction(0);
    for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, 0, j);
        const minorDet = determinant(minor);
        const sign = j % 2 === 0 ? 1 : -1;
        det = det.add(matrix[0][j].multiply(minorDet).multiply(new Fraction(sign)));
    }
    
    return det;
}

/**
 * 获取余子式（删除指定行和列）
 * @param {Array<Array>} matrix - 原矩阵
 * @param {number} row - 删除的行索引
 * @param {number} col - 删除的列索引
 * @returns {Array<Array>} 余子式矩阵
 */
function getMinor(matrix, row, col) {
    const n = matrix.length;
    const minor = [];
    
    for (let i = 0; i < n; i++) {
        if (i === row) continue;
        const newRow = [];
        for (let j = 0; j < n; j++) {
            if (j === col) continue;
            newRow.push(matrix[i][j]);
        }
        minor.push(newRow);
    }
    
    return minor;
}

// ==================== 矩阵运算 ====================

/**
 * 矩阵加法
 */
function addMatrices(matrixA, matrixB) {
    const rows = matrixA.length;
    const cols = matrixA[0].length;
    
    if (rows !== matrixB.length || cols !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配，无法进行加法运算');
    }
    
    const result = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(matrixA[i][j].add(matrixB[i][j]));
        }
        result.push(row);
    }
    return result;
}

/**
 * 矩阵减法
 */
function subtractMatrices(matrixA, matrixB) {
    const rows = matrixA.length;
    const cols = matrixA[0].length;
    
    if (rows !== matrixB.length || cols !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配，无法进行减法运算');
    }
    
    const result = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(matrixA[i][j].subtract(matrixB[i][j]));
        }
        result.push(row);
    }
    return result;
}

/**
 * 矩阵乘法
 */
function multiplyMatrices(matrixA, matrixB) {
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;
    
    if (colsA !== rowsB) {
        throw new Error('矩阵A的列数必须等于矩阵B的行数');
    }
    
    const result = [];
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsB; j++) {
            let sum = new Fraction(0);
            for (let k = 0; k < colsA; k++) {
                sum = sum.add(matrixA[i][k].multiply(matrixB[k][j]));
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

/**
 * 数乘矩阵
 */
function scalarMultiplyMatrix(matrix, scalar) {
    const scalarFraction = toFraction(scalar);
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const result = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(matrix[i][j].multiply(scalarFraction));
        }
        result.push(row);
    }
    return result;
}

/**
 * 矩阵转置
 */
function transposeMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const result = [];
    for (let j = 0; j < cols; j++) {
        const row = [];
        for (let i = 0; i < rows; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
}

/**
 * 矩阵求逆（使用高斯-若尔当消元法）
 */
function inverseMatrix(matrix) {
    const n = matrix.length;
    
    // 检查是否为方阵
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能求逆');
        }
    }
    
    // 计算行列式
    const det = determinant(matrix);
    if (det.numerator === 0) {
        throw new Error('矩阵不可逆（行列式为0）');
    }
    
    // 创建增广矩阵 [A|I]
    const augMatrix = [];
    for (let i = 0; i < n; i++) {
        const row = [...matrix[i]];
        for (let j = 0; j < n; j++) {
            row.push(i === j ? new Fraction(1) : new Fraction(0));
        }
        augMatrix.push(row);
    }
    
    // 高斯-若尔当消元
    for (let i = 0; i < n; i++) {
        // 寻找主元（使用部分主元消去法提高数值稳定性）
        let pivotRow = i;
        for (let k = i; k < n; k++) {
            if (augMatrix[k][i].abs().valueOf() > augMatrix[pivotRow][i].abs().valueOf()) {
                pivotRow = k;
            }
        }
        
        if (augMatrix[pivotRow][i].abs().valueOf() < 1e-10) {
            throw new Error('矩阵不可逆');
        }
        
        // 交换行
        if (pivotRow !== i) {
            [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];
        }
        
        // 归一化主元行
        const pivot = augMatrix[i][i];
        for (let j = 0; j < 2 * n; j++) {
            augMatrix[i][j] = augMatrix[i][j].divide(pivot);
        }
        
        // 消去其他行的第i列
        for (let k = 0; k < n; k++) {
            if (k !== i && augMatrix[k][i].abs().valueOf() > 1e-10) {
                const factor = augMatrix[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    augMatrix[k][j] = augMatrix[k][j].subtract(factor.multiply(augMatrix[i][j]));
                }
            }
        }
    }
    
    // 提取逆矩阵（对每个元素进行简化，避免超大分数）
    const invMatrix = [];
    for (let i = 0; i < n; i++) {
        invMatrix[i] = [];
        for (let j = n; j < 2 * n; j++) {
            const val = augMatrix[i][j];
            // 对大分母的分数进行简化逼近
            if (val.denominator > 100 || val.numerator > 100) {
                invMatrix[i].push(simplifyFraction(val.valueOf(), 50));
            } else {
                invMatrix[i].push(val);
            }
        }
    }
    
    return invMatrix;
}

/**
 * 伴随矩阵
 */
function adjugateMatrix(matrix) {
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能计算伴随矩阵');
        }
    }
    
    const cofactorMatrix = [];
    for (let i = 0; i < n; i++) {
        cofactorMatrix[i] = [];
        for (let j = 0; j < n; j++) {
            const minor = getMinor(matrix, i, j);
            const minorDet = determinant(minor);
            const sign = (i + j) % 2 === 0 ? 1 : -1;
            const val = minorDet.multiply(new Fraction(sign));
            // 简化大分数
            if (val.denominator > 100 || val.numerator > 100) {
                cofactorMatrix[i][j] = simplifyFraction(val.valueOf(), 50);
            } else {
                cofactorMatrix[i][j] = val;
            }
        }
    }
    
    return transposeMatrix(cofactorMatrix);
}

/**
 * 矩阵的秩（使用高斯消元）
 */
function matrixRank(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    // 创建矩阵副本
    const rref = matrix.map(row => [...row]);
    
    let rank = 0;
    let lead = 0;
    
    for (let r = 0; r < rows; r++) {
        if (lead >= cols) break;
        
        // 寻找主元
        let i = r;
        while (Math.abs(rref[i][lead].valueOf()) < 1e-10) {
            i++;
            if (i === rows) {
                i = r;
                lead++;
                if (lead === cols) break;
            }
        }
        if (lead === cols) break;
        
        // 交换行
        [rref[r], rref[i]] = [rref[i], rref[r]];
        
        // 归一化主元行
        const pivot = rref[r][lead];
        for (let j = lead; j < cols; j++) {
            rref[r][j] = rref[r][j].divide(pivot);
        }
        
        // 消去其他行
        for (let i = 0; i < rows; i++) {
            if (i !== r && Math.abs(rref[i][lead].valueOf()) > 1e-10) {
                const factor = rref[i][lead];
                for (let j = lead; j < cols; j++) {
                    rref[i][j] = rref[i][j].subtract(factor.multiply(rref[r][j]));
                }
            }
        }
        
        lead++;
    }
    
    // 计算非零行数
    for (let i = 0; i < rows; i++) {
        let hasNonZero = false;
        for (let j = 0; j < cols; j++) {
            if (Math.abs(rref[i][j].valueOf()) > 1e-10) {
                hasNonZero = true;
                break;
            }
        }
        if (hasNonZero) rank++;
    }
    
    return rank;
}

/**
 * 矩阵的迹（对角线元素之和）
 */
function matrixTrace(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能计算迹');
        }
    }
    
    let trace = new Fraction(0);
    for (let i = 0; i < n; i++) {
        trace = trace.add(matrix[i][i]);
    }
    return trace;
}

// ==================== 特征值计算 ====================

/**
 * 计算特征值（对于2x2和3x3矩阵使用解析解，较大矩阵使用幂法）
 * @param {Array<Array>} matrix - 方阵
 * @returns {Array} 特征值数组
 */
function eigenValues(matrix) {
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能计算特征值');
        }
    }
    
    if (n === 1) {
        return [matrix[0][0]];
    } else if (n === 2) {
        // 2x2: λ² - tr(A)λ + det(A) = 0
        const tr = matrix[0][0].add(matrix[1][1]);
        const det = determinant(matrix);
        const a = new Fraction(1), b = tr.negate(), c = det;
        
        // 求判别式
        const disc = b.multiply(b).subtract(a.multiply(c).multiply(new Fraction(4)));
        
        if (disc.valueOf() < 0) {
            const realPart = b.negate().divide(new Fraction(2));
            const imagPart = Math.sqrt(-disc.valueOf()) / 2;
            return [
                { real: realPart, imag: imagPart },
                { real: realPart, imag: -imagPart }
            ];
        } else {
            const sqrtDisc = new Fraction(Math.sqrt(disc.valueOf()));
            return [
                b.negate().add(sqrtDisc).divide(new Fraction(2)),
                b.negate().subtract(sqrtDisc).divide(new Fraction(2))
            ];
        }
    } else {
        // 对于更大的矩阵，使用幂法求最大特征值
        return [powerMethod(matrix)];
    }
}

/**
 * 幂法求最大特征值
 */
function powerMethod(matrix, maxIterations = 1000, tolerance = 1e-10) {
    const n = matrix.length;
    
    // 初始化向量（使用 [1, 1, ..., 1]）
    let v = [];
    for (let i = 0; i < n; i++) {
        v.push(1);
    }
    
    // 归一化
    let norm = 0;
    for (let i = 0; i < n; i++) norm += v[i] * v[i];
    norm = Math.sqrt(norm);
    for (let i = 0; i < n; i++) v[i] /= norm;
    
    let lambda = 0;
    for (let iter = 0; iter < maxIterations; iter++) {
        // 计算 Av
        const Av = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += matrix[i][j].valueOf() * v[j];
            }
            Av[i] = sum;
        }
        
        // 计算特征值近似
        const newLambda = Av[0] / v[0];
        
        // 归一化
        norm = 0;
        for (let i = 0; i < n; i++) norm += Av[i] * Av[i];
        norm = Math.sqrt(norm);
        if (norm < 1e-10) break;
        for (let i = 0; i < n; i++) v[i] = Av[i] / norm;
        
        if (Math.abs(newLambda - lambda) < tolerance) {
            return new Fraction(Math.round(newLambda * 1e6) / 1e6);
        }
        lambda = newLambda;
    }
    
    return new Fraction(Math.round(lambda * 1e6) / 1e6);
}

// ==================== 向量运算 ====================

/**
 * 向量加法
 */
function addVectors(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('向量维度不匹配，无法进行加法运算');
    }
    return vectorA.map((v, i) => v.add(vectorB[i]));
}

/**
 * 向量减法
 */
function subtractVectors(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('向量维度不匹配，无法进行减法运算');
    }
    return vectorA.map((v, i) => v.subtract(vectorB[i]));
}

/**
 * 数乘向量
 */
function scalarMultiplyVector(vector, scalar) {
    const scalarFraction = toFraction(scalar);
    return vector.map(v => v.multiply(scalarFraction));
}

/**
 * 点积
 */
function dotProduct(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('向量维度不匹配，无法进行点积运算');
    }
    
    let result = new Fraction(0);
    for (let i = 0; i < vectorA.length; i++) {
        result = result.add(vectorA[i].multiply(vectorB[i]));
    }
    return result;
}

/**
 * 叉积（仅适用于3维向量）
 */
function crossProduct(vectorA, vectorB) {
    if (vectorA.length !== 3 || vectorB.length !== 3) {
        throw new Error('叉积运算仅适用于3维向量');
    }
    
    return [
        vectorA[1].multiply(vectorB[2]).subtract(vectorA[2].multiply(vectorB[1])),
        vectorA[2].multiply(vectorB[0]).subtract(vectorA[0].multiply(vectorB[2])),
        vectorA[0].multiply(vectorB[1]).subtract(vectorA[1].multiply(vectorB[0]))
    ];
}

/**
 * 向量长度（模）
 */
function vectorLength(vector) {
    let sum = new Fraction(0);
    for (let i = 0; i < vector.length; i++) {
        sum = sum.add(vector[i].multiply(vector[i]));
    }
    return Math.sqrt(sum.valueOf());
}

/**
 * 向量夹角（弧度）
 */
function vectorAngle(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('向量维度不匹配，无法计算夹角');
    }
    
    const dot = dotProduct(vectorA, vectorB);
    const lenA = vectorLength(vectorA);
    const lenB = vectorLength(vectorB);
    
    if (lenA < 1e-10 || lenB < 1e-10) {
        throw new Error('零向量无法计算夹角');
    }
    
    let cosAngle = dot.valueOf() / (lenA * lenB);
    // 处理浮点误差
    cosAngle = Math.max(-1, Math.min(1, cosAngle));
    
    return Math.acos(cosAngle);
}

/**
 * 正交性检验
 */
function areOrthogonal(vectorA, vectorB) {
    return Math.abs(dotProduct(vectorA, vectorB).valueOf()) < 1e-10;
}

// ==================== 线性方程组求解 ====================

/**
 * 高斯消元法求解线性方程组
 */
function gaussElimination(coefficients, constants) {
    const n = coefficients.length;
    const m = coefficients[0].length;
    
    // 创建增广矩阵
    const augMatrix = coefficients.map((row, i) => [...row, constants[i]]);
    
    // 前向消元
    for (let i = 0; i < Math.min(n, m); i++) {
        // 寻找主元
        let pivotRow = i;
        for (let k = i; k < n; k++) {
            if (Math.abs(augMatrix[k][i].valueOf()) > Math.abs(augMatrix[pivotRow][i].valueOf())) {
                pivotRow = k;
            }
        }
        
        if (Math.abs(augMatrix[pivotRow][i].valueOf()) < 1e-10) continue;
        
        // 交换行
        [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];
        
        // 归一化主元行
        const pivot = augMatrix[i][i];
        for (let j = i; j <= m; j++) {
            augMatrix[i][j] = augMatrix[i][j].divide(pivot);
        }
        
        // 消去其他行
        for (let k = 0; k < n; k++) {
            if (k !== i && Math.abs(augMatrix[k][i].valueOf()) > 1e-10) {
                const factor = augMatrix[k][i];
                for (let j = i; j <= m; j++) {
                    augMatrix[k][j] = augMatrix[k][j].subtract(factor.multiply(augMatrix[i][j]));
                }
            }
        }
    }
    
    return analyzeSolution(augMatrix, n, m);
}

/**
 * 分析方程组解的情况
 */
function analyzeSolution(augMatrix, n, m) {
    // 检查无解（矛盾方程）
    for (let i = 0; i < n; i++) {
        let allZeros = true;
        for (let j = 0; j < m; j++) {
            if (Math.abs(augMatrix[i][j].valueOf()) > 1e-10) {
                allZeros = false;
                break;
            }
        }
        
        if (allZeros && Math.abs(augMatrix[i][m].valueOf()) > 1e-10) {
            return { type: 'no-solution', message: '方程组无解' };
        }
    }
    
    // 计算秩
    let rank = 0;
    for (let i = 0; i < n; i++) {
        let hasNonZero = false;
        for (let j = 0; j < m; j++) {
            if (Math.abs(augMatrix[i][j].valueOf()) > 1e-10) {
                hasNonZero = true;
                break;
            }
        }
        if (hasNonZero) rank++;
    }
    
    // 唯一解
    if (rank === m) {
        const solution = [];
        for (let i = 0; i < m; i++) {
            solution.push(augMatrix[i][m]);
        }
        return { type: 'unique-solution', solution };
    }
    
    // 无穷多解
    return {
        type: 'infinite-solutions',
        message: '方程组有无穷多解',
        rank,
        freeVariables: m - rank
    };
}

/**
 * LU分解
 */
function luDecomposition(matrix) {
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
            throw new Error('矩阵必须是方阵才能进行LU分解');
        }
    }
    
    const L = [], U = [];
    for (let i = 0; i < n; i++) {
        L[i] = []; U[i] = [];
        for (let j = 0; j < n; j++) {
            L[i][j] = new Fraction(0);
            U[i][j] = new Fraction(0);
        }
        L[i][i] = new Fraction(1);
    }
    
    for (let i = 0; i < n; i++) {
        // 计算U的第i行
        for (let j = i; j < n; j++) {
            let sum = new Fraction(0);
            for (let k = 0; k < i; k++) {
                sum = sum.add(L[i][k].multiply(U[k][j]));
            }
            U[i][j] = matrix[i][j].subtract(sum);
        }
        
        // 计算L的第i列
        for (let j = i + 1; j < n; j++) {
            let sum = new Fraction(0);
            for (let k = 0; k < i; k++) {
                sum = sum.add(L[j][k].multiply(U[k][i]));
            }
            
            if (Math.abs(U[i][i].valueOf()) < 1e-10) {
                throw new Error('矩阵无法进行LU分解（主元为零）');
            }
            
            L[j][i] = matrix[j][i].subtract(sum).divide(U[i][i]);
        }
    }
    
    return { L, U };
}

/**
 * 使用LU分解求解
 */
function solveWithLU(L, U, b) {
    const n = L.length;
    
    // 求解 Ly = b
    const y = [];
    for (let i = 0; i < n; i++) {
        let sum = new Fraction(0);
        for (let j = 0; j < i; j++) {
            sum = sum.add(L[i][j].multiply(y[j]));
        }
        y[i] = b[i].subtract(sum);
    }
    
    // 求解 Ux = y
    const x = [];
    for (let i = n - 1; i >= 0; i--) {
        let sum = new Fraction(0);
        for (let j = i + 1; j < n; j++) {
            sum = sum.add(U[i][j].multiply(x[j]));
        }
        if (Math.abs(U[i][i].valueOf()) < 1e-10) {
            throw new Error('矩阵奇异，无法求解');
        }
        x[i] = y[i].subtract(sum).divide(U[i][i]);
    }
    
    return x;
}

/**
 * 齐次方程组基础解系
 */
function basisSolution(coefficients, constants) {
    return gaussElimination(coefficients, constants);
}

// ==================== 向量组分析 ====================

/**
 * 线性相关性判断
 */
function isLinearlyDependent(vectors) {
    const matrix = transposeMatrix(vectors);
    const rank = matrixRank(matrix);
    return rank < vectors.length;
}

/**
 * 极大无关组
 */
function maxIndependentSet(vectors) {
    const matrix = transposeMatrix(vectors);
    const m = matrix[0].length;
    
    const rref = matrix.map(row => [...row]);
    let lead = 0;
    const pivotColumns = [];
    
    for (let r = 0; r < vectors.length; r++) {
        if (lead >= m) break;
        
        let i = r;
        while (Math.abs(rref[i][lead].valueOf()) < 1e-10) {
            i++;
            if (i === vectors.length) {
                i = r;
                lead++;
                if (lead === m) break;
            }
        }
        if (lead === m) break;
        
        [rref[r], rref[i]] = [rref[i], rref[r]];
        
        const pivot = rref[r][lead];
            for (let j = lead; j < m; j++) {
                rref[r][j] = simplifyFraction(rref[r][j].valueOf() / pivot.valueOf());
            }
            
            for (let i = 0; i < vectors.length; i++) {
                if (i !== r && Math.abs(rref[i][lead].valueOf()) > 1e-10) {
                    const factor = rref[i][lead].valueOf();
                    for (let j = lead; j < m; j++) {
                        rref[i][j] = simplifyFraction(rref[i][j].valueOf() - factor * rref[r][j].valueOf());
                    }
            }
        }
        
        pivotColumns.push(lead);
        lead++;
    }
    
    const maxIndependentVectors = pivotColumns.map(colIndex => vectors[colIndex]);
    return { vectors: maxIndependentVectors, indices: pivotColumns };
}

/**
 * 向量组的秩
 */
function vectorGroupRank(vectors) {
    const matrix = transposeMatrix(vectors);
    return matrixRank(matrix);
}

/**
 * 施密特正交化
 */
function schmidtOrthogonalization(vectors) {
    const n = vectors.length;
    const m = vectors[0].length;
    
    for (let i = 1; i < n; i++) {
        if (vectors[i].length !== m) {
            throw new Error('向量组中所有向量的维度必须一致');
        }
    }
    
    const orthogonalVectors = [];
    
    for (let i = 0; i < n; i++) {
        let v = vectors[i].map(x => x);
        
        for (let j = 0; j < i; j++) {
            const dotVV = dotProduct(orthogonalVectors[j], orthogonalVectors[j]);
            if (Math.abs(dotVV.valueOf()) < 1e-10) continue;
            
            const proj = dotProduct(v, orthogonalVectors[j]).divide(dotVV);
            v = subtractVectors(v, scalarMultiplyVector(orthogonalVectors[j], proj));
        }
        
        let isZero = true;
        for (let k = 0; k < m; k++) {
            if (Math.abs(v[k].valueOf()) > 1e-10) {
                isZero = false;
                break;
            }
        }
        
        if (!isZero) {
            orthogonalVectors.push(v);
        }
    }
    
    // 单位化（使用连分数逼近，避免大分子分母）
    const orthonormalVectors = orthogonalVectors.map(vector => {
        const len = vectorLength(vector);
        if (Math.abs(len) < 1e-10) return vector;
        return vector.map(v => {
            const val = v.valueOf() / len;
            // 使用更激进的小分母限制，产生简洁的分数或转为小数
            return simplifyFraction(val, 50);
        });
    });
    
    return { orthogonal: orthogonalVectors, orthonormal: orthonormalVectors };
}

// ==================== 二次型分析 ====================

/**
 * 检查矩阵是否对称
 */
function isSymmetric(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) return false;
        for (let j = 0; j < i; j++) {
            if (Math.abs(matrix[i][j].valueOf() - matrix[j][i].valueOf()) > 1e-10) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 将矩阵对称化（非对称矩阵时取平均）
 */
function makeSymmetric(matrix) {
    const n = matrix.length;
    const symmetric = [];
    
    for (let i = 0; i < n; i++) {
        symmetric[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                symmetric[i][j] = matrix[i][j];
            } else {
                symmetric[i][j] = simplifyFraction((matrix[i][j].valueOf() + matrix[j][i].valueOf()) / 2);
            }
        }
    }
    
    return symmetric;
}

/**
 * 二次型标准形
 */
function standardForm(matrix) {
    if (!isSymmetric(matrix)) {
        matrix = makeSymmetric(matrix);
    }
    
    const eigenvalues = eigenValues(matrix);
    const n = matrix.length;
    
    // 构建对角矩阵
    const standardMatrix = [];
    for (let i = 0; i < n; i++) {
        standardMatrix[i] = [];
        for (let j = 0; j < n; j++) {
            standardMatrix[i][j] = new Fraction(0);
        }
    }
    
    for (let i = 0; i < Math.min(n, eigenvalues.length); i++) {
        if (typeof eigenvalues[i] === 'object' && 'real' in eigenvalues[i]) {
            const val = toFraction(eigenvalues[i].real);
            // 简化大分数 - 使用更小的分母限制
            if (val.denominator > 100 || val.numerator > 100) {
                standardMatrix[i][i] = simplifyFraction(val.valueOf(), 50);
            } else {
                standardMatrix[i][i] = val;
            }
        } else if (typeof eigenvalues[i] === 'number') {
            const evVal = toFraction(eigenvalues[i]);
            // 使用更小的分母限制
            if (evVal.denominator > 100 || evVal.numerator > 100) {
                standardMatrix[i][i] = simplifyFraction(evVal.valueOf(), 50);
            } else {
                standardMatrix[i][i] = evVal;
            }
        } else {
            standardMatrix[i][i] = eigenvalues[i];
        }
    }
    
    return { matrix: standardMatrix, eigenvalues };
}

/**
 * 二次型规范形
 */
function canonicalForm(matrix) {
    if (!isSymmetric(matrix)) {
        matrix = makeSymmetric(matrix);
    }
    
    const { eigenvalues } = standardForm(matrix);
    const n = matrix.length;
    
    const canonicalMatrix = [];
    for (let i = 0; i < n; i++) {
        canonicalMatrix[i] = [];
        for (let j = 0; j < n; j++) {
            canonicalMatrix[i][j] = new Fraction(0);
        }
    }
    
    let p = 0, q = 0;
    for (let i = 0; i < Math.min(n, eigenvalues.length); i++) {
        const ev = typeof eigenvalues[i] === 'object' ? eigenvalues[i].real : eigenvalues[i];
        if (Math.abs(ev) < 1e-10) {
            // 零特征值放中间
        } else if (ev > 0) {
            canonicalMatrix[p][p] = new Fraction(1);
            p++;
        } else {
            canonicalMatrix[n - 1 - q][n - 1 - q] = new Fraction(-1);
            q++;
        }
    }
    
    return canonicalMatrix;
}

/**
 * 正定性判断（顺序主子式法）
 */
function isPositiveDefinite(matrix) {
    if (!isSymmetric(matrix)) return false;
    
    const n = matrix.length;
    for (let i = 1; i <= n; i++) {
        const minor = getPrincipalMinor(matrix, i);
        const det = determinant(minor);
        if (det.valueOf() <= 0) return false;
    }
    
    return true;
}

/**
 * 获取顺序主子式矩阵
 */
function getPrincipalMinor(matrix, order) {
    const minor = [];
    for (let i = 0; i < order; i++) {
        minor[i] = [];
        for (let j = 0; j < order; j++) {
            minor[i][j] = matrix[i][j];
        }
    }
    return minor;
}
