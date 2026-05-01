import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Fraction } from './fraction'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function simplifyFraction(val: number, maxDenominator = 100): Fraction {
  if (val === 0) return new Fraction(0)
  if (!isFinite(val)) return new Fraction(val > 0 ? 1 : -1)
  const absVal = Math.abs(val)
  const commonFractions: [number, number][] = [
    [0,1],[1,12],[1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[2,5],
    [3,8],[2,7],[3,7],[4,9],[1,2],[5,9],[4,7],[3,5],[5,8],[2,3],[5,7],[3,4],[4,5],[5,6]
  ]
  let bestNum = Math.round(val), bestDen = 1
  let bestError = absVal - Math.abs(bestNum / bestDen)
  for (const [n, d] of commonFractions) {
    const approx = n / d
    const error = Math.abs(absVal - approx)
    if (error < bestError || (error < 0.01 && d < bestDen)) {
      bestError = error; bestNum = n * (val >= 0 ? 1 : -1); bestDen = d
      if (error < 1e-8) break
    }
  }
  if (bestError > 1e-6 && maxDenominator > 20) {
    try {
      const cfResult = continuedFractionApprox(val, maxDenominator)
      if (Math.abs(absVal - Math.abs(cfResult.valueOf())) <= bestError + 1e-8) return cfResult
    } catch { }
  }
  return new Fraction(bestNum, bestDen)
}

function continuedFractionApprox(val: number, maxDenom: number): Fraction {
  if (Math.abs(val) < 1e-15) return new Fraction(0)
  let x = Math.abs(val)
  const sign = val >= 0 ? 1 : -1
  let hPrev = 0, kPrev = 1, hCurr = 1, kCurr = 0
  for (let iter = 0; iter < 50; iter++) {
    const a = Math.floor(x)
    const hNext = a * hCurr + hPrev, kNext = a * kCurr + kPrev
    hPrev = hCurr; kPrev = kCurr; hCurr = hNext; kCurr = kNext
    if (kCurr > maxDenom) return sign > 0 ? new Fraction(hPrev, kPrev) : new Fraction(-hPrev, kPrev)
    const remainder = x - a
    if (remainder < 1e-15) break
    x = 1 / remainder
  }
  return sign > 0 ? new Fraction(hCurr, kCurr) : new Fraction(-hCurr, kCurr)
}

export function toFraction(value: Fraction | number | string): Fraction {
  if (value instanceof Fraction) return value
  if (typeof value === 'string') {
    try { return Fraction.fromString(value) }
    catch { return new Fraction(parseFloat(value) || 0) }
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-10) return new Fraction(Math.round(value))
    return simplifyFraction(value, 100)
  }
  return new Fraction(value)
}

export function toFractionOptimized(value: Fraction | number | string, maxDenom = 100): Fraction {
  if (value instanceof Fraction) return value
  if (typeof value === 'string') {
    try { return Fraction.fromString(value) }
    catch { return simplifyFraction(parseFloat(value) || 0, maxDenom) }
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-10) return new Fraction(Math.round(value))
    return simplifyFraction(value, maxDenom)
  }
  return new Fraction(value)
}

export function formatNumber(num: Fraction | number): string {
  if (num instanceof Fraction) {
    if (num.denominator > 100 || Math.abs(num.numerator) > 100) {
      const val = num.valueOf()
      if (Math.abs(val) < 1e-10) return '0'
      if (Math.abs(val) >= 1e6 || (Math.abs(val) < 1e-3 && val !== 0)) return val.toExponential(4)
      return parseFloat(val.toPrecision(8)).toString()
    }
    return num.toString()
  }
  if (typeof num !== 'number' || isNaN(num)) return 'N/A'
  if (Math.abs(num) < 1e-10) return '0'
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 1e-3 && num !== 0)) return num.toExponential(6)
  return (Math.round(num * 1e6) / 1e6).toString()
}

export function getOperationName(operation: string): string {
  const names: Record<string, string> = {
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
  }
  return names[operation] || operation
}

export function matrixToFractions(matrix: (Fraction | number | string)[][]): Fraction[][] {
  return matrix.map(row => row.map(cell => toFraction(cell)))
}

export function vectorToFractions(vector: (Fraction | number | string)[]): Fraction[] {
  return vector.map(cell => toFraction(cell))
}
