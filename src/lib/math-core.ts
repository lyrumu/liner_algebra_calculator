import { Fraction } from './fraction'
import { toFraction, toFractionOptimized, formatNumber } from './utils'
import type { ComplexNumber } from '@/types'

function getMinor(matrix: Fraction[][], row: number, col: number): Fraction[][] {
  const n = matrix.length
  const minor: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    if (i === row) continue
    const newRow: Fraction[] = []
    for (let j = 0; j < n; j++) {
      if (j === col) continue
      newRow.push(matrix[i][j])
    }
    minor.push(newRow)
  }
  return minor
}

export function determinant(matrix: Fraction[][]): Fraction {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能计算行列式')
  }
  if (n === 1) return matrix[0][0]
  if (n === 2) return matrix[0][0].multiply(matrix[1][1]).subtract(matrix[0][1].multiply(matrix[1][0]))
  let det = new Fraction(0)
  for (let j = 0; j < n; j++) {
    const minor = getMinor(matrix, 0, j)
    const minorDet = determinant(minor)
    const sign = j % 2 === 0 ? 1 : -1
    det = det.add(matrix[0][j].multiply(minorDet).multiply(new Fraction(sign)))
  }
  return det
}

export function addMatrices(matrixA: Fraction[][], matrixB: Fraction[][]): Fraction[][] {
  const rows = matrixA.length, cols = matrixA[0].length
  if (rows !== matrixB.length || cols !== matrixB[0].length) throw new Error('矩阵维度不匹配')
  return matrixA.map((row, i) => row.map((val, j) => val.add(matrixB[i][j])))
}

export function subtractMatrices(matrixA: Fraction[][], matrixB: Fraction[][]): Fraction[][] {
  const rows = matrixA.length, cols = matrixA[0].length
  if (rows !== matrixB.length || cols !== matrixB[0].length) throw new Error('矩阵维度不匹配')
  return matrixA.map((row, i) => row.map((val, j) => val.subtract(matrixB[i][j])))
}

export function multiplyMatrices(matrixA: Fraction[][], matrixB: Fraction[][]): Fraction[][] {
  const rowsA = matrixA.length, colsA = matrixA[0].length
  const rowsB = matrixB.length, colsB = matrixB[0].length
  if (colsA !== rowsB) throw new Error('矩阵A的列数必须等于矩阵B的行数')
  const result: Fraction[][] = []
  for (let i = 0; i < rowsA; i++) {
    const row: Fraction[] = []
    for (let j = 0; j < colsB; j++) {
      let sum = new Fraction(0)
      for (let k = 0; k < colsA; k++) sum = sum.add(matrixA[i][k].multiply(matrixB[k][j]))
      row.push(sum)
    }
    result.push(row)
  }
  return result
}

export function scalarMultiplyMatrix(matrix: Fraction[][], scalar: number): Fraction[][] {
  const sf = toFraction(scalar)
  return matrix.map(row => row.map(v => v.multiply(sf)))
}

export function transposeMatrix(matrix: Fraction[][]): Fraction[][] {
  const rows = matrix.length, cols = matrix[0].length
  const result: Fraction[][] = []
  for (let j = 0; j < cols; j++) {
    const row: Fraction[] = []
    for (let i = 0; i < rows; i++) row.push(matrix[i][j])
    result.push(row)
  }
  return result
}

export function inverseMatrix(matrix: Fraction[][]): Fraction[][] {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能求逆')
  }
  const det = determinant(matrix)
  if (det.numerator === 0) throw new Error('矩阵不可逆（行列式为0）')
  const augMatrix: Fraction[][] = matrix.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => i === j ? new Fraction(1) : new Fraction(0))])
  for (let i = 0; i < n; i++) {
    let pivotRow = i
    for (let k = i; k < n; k++) {
      if (augMatrix[k][i].abs().valueOf() > augMatrix[pivotRow][i].abs().valueOf()) pivotRow = k
    }
    if (augMatrix[pivotRow][i].abs().valueOf() < 1e-10) throw new Error('矩阵不可逆')
    if (pivotRow !== i) [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]]
    const pivot = augMatrix[i][i]
    for (let j = 0; j < 2 * n; j++) augMatrix[i][j] = augMatrix[i][j].divide(pivot)
    for (let k = 0; k < n; k++) {
      if (k !== i && augMatrix[k][i].abs().valueOf() > 1e-10) {
        const factor = augMatrix[k][i]
        for (let j = 0; j < 2 * n; j++) augMatrix[k][j] = augMatrix[k][j].subtract(factor.multiply(augMatrix[i][j]))
      }
    }
  }
  const invMatrix: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    invMatrix[i] = []
    for (let j = n; j < 2 * n; j++) {
      const val = augMatrix[i][j]
      if (val.denominator > 100 || val.numerator > 100) invMatrix[i].push(toFractionOptimized(val.valueOf(), 50))
      else invMatrix[i].push(val)
    }
  }
  return invMatrix
}

export function adjugateMatrix(matrix: Fraction[][]): Fraction[][] {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能计算伴随矩阵')
  }
  const cofactorMatrix: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    cofactorMatrix[i] = []
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matrix, i, j)
      const minorDet = determinant(minor)
      const sign = (i + j) % 2 === 0 ? 1 : -1
      const val = minorDet.multiply(new Fraction(sign))
      if (val.denominator > 100 || val.numerator > 100) cofactorMatrix[i][j] = toFractionOptimized(val.valueOf(), 50)
      else cofactorMatrix[i][j] = val
    }
  }
  return transposeMatrix(cofactorMatrix)
}

export function matrixRank(matrix: Fraction[][]): number {
  const rows = matrix.length, cols = matrix[0].length
  const rref = matrix.map(row => [...row])
  let rank = 0, lead = 0
  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break
    let i = r
    while (rref[i][lead].abs().valueOf() < 1e-10) {
      i++
      if (i === rows) { i = r; lead++; if (lead === cols) break }
    }
    if (lead >= cols) break
    if (i !== r) [rref[r], rref[i]] = [rref[i], rref[r]]
    const pivot = rref[r][lead]
    for (let j = lead; j < cols; j++) rref[r][j] = rref[r][j].divide(pivot)
    for (let k = 0; k < rows; k++) {
      if (k !== r && rref[k][lead].abs().valueOf() > 1e-10) {
        const factor = rref[k][lead]
        for (let j = lead; j < cols; j++) rref[k][j] = rref[k][j].subtract(factor.multiply(rref[r][j]))
      }
    }
    lead++
  }
  for (let i = 0; i < rows; i++) {
    let nonZero = false
    for (let j = 0; j < cols; j++) { if (rref[i][j].abs().valueOf() > 1e-10) { nonZero = true; break } }
    if (nonZero) rank++
  }
  return rank
}

export function matrixTrace(matrix: Fraction[][]): Fraction {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能计算迹')
  }
  let trace = new Fraction(0)
  for (let i = 0; i < n; i++) trace = trace.add(matrix[i][i])
  return trace
}

function powerMethod(matrix: Fraction[][], maxIterations = 1000, tolerance = 1e-10): Fraction {
  const n = matrix.length
  let v = new Array(n).fill(1)
  let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
  v = v.map(x => x / norm)
  let lambda = 0
  for (let iter = 0; iter < maxIterations; iter++) {
    const Av = new Array(n).fill(0)
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) Av[i] += matrix[i][j].valueOf() * v[j]
    const newLambda = Av[0] / v[0]
    norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0))
    if (norm < 1e-10) break
    v = Av.map(x => x / norm)
    if (Math.abs(newLambda - lambda) < tolerance) return new Fraction(Math.round(newLambda * 1e6) / 1e6)
    lambda = newLambda
  }
  return new Fraction(Math.round(lambda * 1e6) / 1e6)
}

export function eigenValues(matrix: Fraction[][]): (Fraction | ComplexNumber)[] {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能计算特征值')
  }
  if (n === 1) return [matrix[0][0]]
  if (n === 2) {
    const tr = matrix[0][0].add(matrix[1][1])
    const det = determinant(matrix)
    const a = new Fraction(1), b = tr.negate(), c = det
    const disc = b.multiply(b).subtract(a.multiply(c).multiply(new Fraction(4)))
    if (disc.valueOf() < 0) {
      const realPart = b.negate().divide(new Fraction(2))
      const imagPart = Math.sqrt(-disc.valueOf()) / 2
      return [{ real: realPart.valueOf(), imag: imagPart }, { real: realPart.valueOf(), imag: -imagPart }]
    } else {
      const sqrtDisc = new Fraction(Math.sqrt(disc.valueOf()))
      return [b.negate().add(sqrtDisc).divide(new Fraction(2)), b.negate().subtract(sqrtDisc).divide(new Fraction(2))]
    }
  }
  return [powerMethod(matrix)]
}

export function addVectors(vectorA: Fraction[], vectorB: Fraction[]): Fraction[] {
  if (vectorA.length !== vectorB.length) throw new Error('向量维度不匹配')
  return vectorA.map((v, i) => v.add(vectorB[i]))
}

export function subtractVectors(vectorA: Fraction[], vectorB: Fraction[]): Fraction[] {
  if (vectorA.length !== vectorB.length) throw new Error('向量维度不匹配')
  return vectorA.map((v, i) => v.subtract(vectorB[i]))
}

export function scalarMultiplyVector(vector: Fraction[], scalar: Fraction | number): Fraction[] {
  const sf = scalar instanceof Fraction ? scalar : toFraction(scalar)
  return vector.map(v => v.multiply(sf))
}

export function dotProduct(vectorA: Fraction[], vectorB: Fraction[]): Fraction {
  if (vectorA.length !== vectorB.length) throw new Error('向量维度不匹配')
  let result = new Fraction(0)
  for (let i = 0; i < vectorA.length; i++) result = result.add(vectorA[i].multiply(vectorB[i]))
  return result
}

export function crossProduct(vectorA: Fraction[], vectorB: Fraction[]): Fraction[] {
  if (vectorA.length !== 3 || vectorB.length !== 3) throw new Error('叉积仅适用于3维向量')
  return [
    vectorA[1].multiply(vectorB[2]).subtract(vectorA[2].multiply(vectorB[1])),
    vectorA[2].multiply(vectorB[0]).subtract(vectorA[0].multiply(vectorB[2])),
    vectorA[0].multiply(vectorB[1]).subtract(vectorA[1].multiply(vectorB[0]))
  ]
}

export function vectorLength(vector: Fraction[]): number {
  let sum = new Fraction(0)
  for (let i = 0; i < vector.length; i++) sum = sum.add(vector[i].multiply(vector[i]))
  return Math.sqrt(sum.valueOf())
}

export function vectorAngle(vectorA: Fraction[], vectorB: Fraction[]): number {
  if (vectorA.length !== vectorB.length) throw new Error('向量维度不匹配')
  const dot = dotProduct(vectorA, vectorB)
  const lenA = vectorLength(vectorA), lenB = vectorLength(vectorB)
  if (lenA < 1e-10 || lenB < 1e-10) throw new Error('零向量无法计算夹角')
  let cosAngle = dot.valueOf() / (lenA * lenB)
  cosAngle = Math.max(-1, Math.min(1, cosAngle))
  return Math.acos(cosAngle)
}

export function areOrthogonal(vectorA: Fraction[], vectorB: Fraction[]): boolean {
  return Math.abs(dotProduct(vectorA, vectorB).valueOf()) < 1e-10
}

function analyzeSolution(augMatrix: Fraction[][], n: number, m: number): { type: string; solution?: Fraction[]; rank?: number; freeVariables?: number; message?: string } {
  for (let i = 0; i < n; i++) {
    let allZeros = true
    for (let j = 0; j < m; j++) { if (augMatrix[i][j].abs().valueOf() > 1e-10) { allZeros = false; break } }
    if (allZeros && augMatrix[i][m].abs().valueOf() > 1e-10) return { type: 'no-solution' }
  }
  let rank = 0
  for (let i = 0; i < n; i++) {
    let hasNonZero = false
    for (let j = 0; j < m; j++) { if (augMatrix[i][j].abs().valueOf() > 1e-10) { hasNonZero = true; break } }
    if (hasNonZero) rank++
  }
  if (rank === m) {
    const solution: Fraction[] = []
    for (let i = 0; i < m; i++) solution.push(augMatrix[i][m])
    return { type: 'unique-solution', solution }
  }
  return { type: 'infinite-solutions', rank, freeVariables: m - rank }
}

export function gaussElimination(coefficients: Fraction[][], constants: Fraction[]): { type: string; solution?: Fraction[]; rank?: number; freeVariables?: number; message?: string } {
  const n = coefficients.length, m = coefficients[0].length
  const augMatrix = coefficients.map((row, i) => [...row, constants[i]])
  for (let i = 0; i < Math.min(n, m); i++) {
    let pivotRow = i
    for (let k = i; k < n; k++) { if (augMatrix[k][i].abs().valueOf() > augMatrix[pivotRow][i].abs().valueOf()) pivotRow = k }
    if (augMatrix[pivotRow][i].abs().valueOf() < 1e-10) continue
    if (pivotRow !== i) [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]]
    const pivot = augMatrix[i][i]
    for (let j = i; j <= m; j++) augMatrix[i][j] = augMatrix[i][j].divide(pivot)
    for (let k = 0; k < n; k++) {
      if (k !== i && augMatrix[k][i].abs().valueOf() > 1e-10) {
        const factor = augMatrix[k][i]
        for (let j = i; j <= m; j++) augMatrix[k][j] = augMatrix[k][j].subtract(factor.multiply(augMatrix[i][j]))
      }
    }
  }
  return analyzeSolution(augMatrix, n, m)
}

export function luDecomposition(matrix: Fraction[][]): { L: Fraction[][]; U: Fraction[][] } {
  const n = matrix.length
  for (let i = 0; i < n; i++) { if (matrix[i].length !== n) throw new Error('矩阵必须是方阵才能LU分解') }
  const L: Fraction[][] = [], U: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    L[i] = []; U[i] = []
    for (let j = 0; j < n; j++) { L[i][j] = new Fraction(0); U[i][j] = new Fraction(0) }
    L[i][i] = new Fraction(1)
  }
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let sum = new Fraction(0)
      for (let k = 0; k < i; k++) sum = sum.add(L[i][k].multiply(U[k][j]))
      U[i][j] = matrix[i][j].subtract(sum)
    }
    for (let j = i + 1; j < n; j++) {
      let sum = new Fraction(0)
      for (let k = 0; k < i; k++) sum = sum.add(L[j][k].multiply(U[k][i]))
      if (U[i][i].abs().valueOf() < 1e-10) throw new Error('矩阵无法LU分解')
      L[j][i] = matrix[j][i].subtract(sum).divide(U[i][i])
    }
  }
  return { L, U }
}

export function solveWithLU(L: Fraction[][], U: Fraction[][], b: Fraction[]): Fraction[] {
  const n = L.length
  const y: Fraction[] = []
  for (let i = 0; i < n; i++) {
    let sum = new Fraction(0)
    for (let j = 0; j < i; j++) sum = sum.add(L[i][j].multiply(y[j]))
    y[i] = b[i].subtract(sum)
  }
  const x: Fraction[] = []
  for (let i = n - 1; i >= 0; i--) {
    let sum = new Fraction(0)
    for (let j = i + 1; j < n; j++) sum = sum.add(U[i][j].multiply(x[j]))
    if (U[i][i].abs().valueOf() < 1e-10) throw new Error('矩阵奇异')
    x[i] = y[i].subtract(sum).divide(U[i][i])
  }
  return x
}

export function isLinearlyDependent(vectors: Fraction[][]): boolean {
  const matrix = transposeMatrix(vectors)
  return matrixRank(matrix) < vectors.length
}

export function maxIndependentSet(vectors: Fraction[][]): { vectors: Fraction[][]; indices: number[] } {
  const matrix = transposeMatrix(vectors)
  const m = matrix[0].length
  const rref = matrix.map(row => [...row])
  let lead = 0
  const pivotColumns: number[] = []
  for (let r = 0; r < vectors.length; r++) {
    if (lead >= m) break
    let i = r
    while (rref[i][lead].abs().valueOf() < 1e-10) {
      i++
      if (i === vectors.length) { i = r; lead++; if (lead === m) break }
    }
    if (lead >= m) break
    if (i !== r) [rref[r], rref[i]] = [rref[i], rref[r]]
    const pivot = rref[r][lead].valueOf()
    for (let j = lead; j < m; j++) rref[r][j] = toFractionOptimized(rref[r][j].valueOf() / pivot)
    for (let k = 0; k < vectors.length; k++) {
      if (k !== r && rref[k][lead].abs().valueOf() > 1e-10) {
        const factor = rref[k][lead].valueOf()
        for (let j = lead; j < m; j++) rref[k][j] = toFractionOptimized(rref[k][j].valueOf() - factor * rref[r][j].valueOf())
      }
    }
    pivotColumns.push(lead)
    lead++
  }
  return { vectors: pivotColumns.map(idx => vectors[idx]), indices: pivotColumns }
}

export function vectorGroupRank(vectors: Fraction[][]): number {
  return matrixRank(transposeMatrix(vectors))
}

export function schmidtOrthogonalization(vectors: Fraction[][]): { orthogonal: Fraction[][]; orthonormal: Fraction[][] } {
  const n = vectors.length, m = vectors[0].length
  for (let i = 1; i < n; i++) { if (vectors[i].length !== m) throw new Error('向量维度必须一致') }
  const orthogonalVectors: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    let v = vectors[i].map(x => x)
    for (let j = 0; j < i; j++) {
      const dotVV = dotProduct(orthogonalVectors[j], orthogonalVectors[j])
      if (dotVV.abs().valueOf() < 1e-10) continue
      const proj = dotProduct(v, orthogonalVectors[j]).divide(dotVV)
      v = subtractVectors(v, scalarMultiplyVector(orthogonalVectors[j], proj))
    }
    let isZero = true
    for (let k = 0; k < m; k++) { if (v[k].abs().valueOf() > 1e-10) { isZero = false; break } }
    if (!isZero) orthogonalVectors.push(v)
  }
  const orthonormalVectors = orthogonalVectors.map(vector => {
    const len = vectorLength(vector)
    if (Math.abs(len) < 1e-10) return vector
    return vector.map(v => toFractionOptimized(v.valueOf() / len, 50))
  })
  return { orthogonal: orthogonalVectors, orthonormal: orthonormalVectors }
}

export function isSymmetric(matrix: Fraction[][]): boolean {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) return false
    for (let j = 0; j < i; j++) { if (Math.abs(matrix[i][j].valueOf() - matrix[j][i].valueOf()) > 1e-10) return false }
  }
  return true
}

export function makeSymmetric(matrix: Fraction[][]): Fraction[][] {
  const n = matrix.length
  const symmetric: Fraction[][] = []
  for (let i = 0; i < n; i++) {
    symmetric[i] = []
    for (let j = 0; j < n; j++) {
      symmetric[i][j] = i === j ? matrix[i][j] : toFractionOptimized((matrix[i][j].valueOf() + matrix[j][i].valueOf()) / 2)
    }
  }
  return symmetric
}

export function standardForm(matrix: Fraction[][]): { matrix: Fraction[][]; eigenvalues: (Fraction | ComplexNumber)[] } {
  if (!isSymmetric(matrix)) matrix = makeSymmetric(matrix)
  const eigenvalues = eigenValues(matrix)
  const n = matrix.length
  const stdMatrix: Fraction[][] = Array.from({ length: n }, () => Array(n).fill(new Fraction(0)))
  for (let i = 0; i < Math.min(n, eigenvalues.length); i++) {
    const ev = eigenvalues[i]
    if (typeof ev === 'object' && 'real' in ev) {
      const val = toFraction(ev.real)
      stdMatrix[i][i] = (val.denominator > 100 || val.numerator > 100) ? toFractionOptimized(val.valueOf(), 50) : val
    } else if (ev instanceof Fraction) {
      stdMatrix[i][i] = (ev.denominator > 100 || ev.numerator > 100) ? toFractionOptimized(ev.valueOf(), 50) : ev
    }
  }
  return { matrix: stdMatrix, eigenvalues }
}

export function canonicalForm(matrix: Fraction[][]): Fraction[][] {
  if (!isSymmetric(matrix)) matrix = makeSymmetric(matrix)
  const { eigenvalues } = standardForm(matrix)
  const n = matrix.length
  const canonMatrix: Fraction[][] = Array.from({ length: n }, () => Array(n).fill(new Fraction(0)))
  let p = 0, q = 0
  for (let i = 0; i < Math.min(n, eigenvalues.length); i++) {
    const ev = typeof eigenvalues[i] === 'object' && 'real' in eigenvalues[i] ? (eigenvalues[i] as ComplexNumber).real : (eigenvalues[i] as Fraction).valueOf()
    if (Math.abs(ev) < 1e-10) continue
    else if (ev > 0) { canonMatrix[p][p] = new Fraction(1); p++ }
    else { canonMatrix[n - 1 - q][n - 1 - q] = new Fraction(-1); q++ }
  }
  return canonMatrix
}

export function getPrincipalMinor(matrix: Fraction[][], order: number): Fraction[][] {
  return Array.from({ length: order }, (_, i) => matrix[i].slice(0, order))
}

export function isPositiveDefinite(matrix: Fraction[][]): boolean {
  if (!isSymmetric(matrix)) return false
  const n = matrix.length
  for (let i = 1; i <= n; i++) {
    const minor = getPrincipalMinor(matrix, i)
    const det = determinant(minor)
    if (det.valueOf() <= 0) return false
  }
  return true
}

/** @internal */
function basisSolution(coefficients: Fraction[][], constants: Fraction[]): ReturnType<typeof gaussElimination> {
  return gaussElimination(coefficients, constants)
}
