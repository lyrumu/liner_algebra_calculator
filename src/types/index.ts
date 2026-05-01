export type TabId = 'determinant' | 'matrix' | 'vector' | 'linear-system' | 'vector-group' | 'quadratic-form' | 'history'

export type MatrixOp = 'add' | 'subtract' | 'multiply' | 'scalar-multiply' | 'transpose' | 'inverse' | 'adjugate' | 'rank' | 'trace' | 'eigen'
export type VectorOp = 'add' | 'subtract' | 'scalar-multiply' | 'dot-product' | 'cross-product' | 'length' | 'angle' | 'orthogonality'
export type SystemMethod = 'gauss' | 'lu' | 'basis-solution' | 'general-solution'
export type VGOp = 'linear-dependency' | 'max-independent' | 'rank' | 'schmidt'
export type QFOp = 'standard-form' | 'canonical-form' | 'positive-definite'

export interface CalcState {
  type: string
  [key: string]: unknown
}

export interface HistoryItem {
  id: number
  type: string
  input: Record<string, unknown>
  result: string
  timestamp: string
}

export type ComplexNumber = { real: number; imag: number }
