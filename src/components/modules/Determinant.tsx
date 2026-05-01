import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MatrixInput } from '@/components/MatrixInput'
import { ResultPanel } from '@/components/ResultPanel'
import type { StructuredResult } from '@/components/ResultPanel'
import { matrixToFractions, formatNumber } from '@/lib/utils'
import { determinant } from '@/lib/math-core'
import type { Step } from '@/components/StepsTimeline'
import { Calculator, RefreshCw } from 'lucide-react'

interface DeterminantProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function Determinant({ onAddHistory, loadKey, loadPayload }: DeterminantProps) {
  const { t, tf } = useI18n()
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [matrix, setMatrix] = useState<string[][]>(() =>
    Array.from({ length: 3 }, () => Array(3).fill(''))
  )
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'determinant') return
    const r = loadPayload.rows as number
    const c = loadPayload.cols as number
    const m = loadPayload.matrix as (number | string | Record<string, number>)[][]
    if (!r || !c || !m) return
    setRows(r); setCols(c)
    setMatrix(Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => {
        const v = m[i]?.[j]
        if (v == null) return ''
        if (typeof v === 'object') return String(v.numerator ?? '')
        return String(v)
      })
    ))
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  const handleResize = useCallback(() => {
    const r = Math.min(10, Math.max(1, rows))
    const c = Math.min(10, Math.max(1, cols))
    setRows(r); setCols(c)
    setMatrix(prev => Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => prev[i]?.[j] ?? '')
    ))
  }, [rows, cols])

  const handleCalculate = useCallback(() => {
    try {
      if (rows !== cols) throw new Error(t('error-square-matrix'))
      if (rows < 1 || rows > 10) throw new Error(t('error-dim-range'))
      const fracMatrix = matrixToFractions(matrix)
      const s: Step[] = []
      s.push({ content: '<p>' + tf('step-input-matrix', { rows, cols }) + '</p>' })
      const det = determinant(fracMatrix)
      s.push({ content: '<p>det(A) = <strong>' + formatNumber(det) + '</strong></p>' })
      setSteps(s)
      setResult({ type: 'det', titleKey: 'result-determinant', value: formatNumber(det) })
      onAddHistory({
        type: 'determinant',
        input: { rows, cols, matrix: fracMatrix.map(r => r.map(v => v.valueOf())), typeLabel: tf('history-determinant', { rows, cols }) },
        result: t('calculate-determinant') + ' = ' + formatNumber(det)
      })
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') })
      setSteps([])
    }
  }, [rows, cols, matrix, t, tf, onAddHistory])

  const handleClear = useCallback(() => {
    setMatrix(Array.from({ length: rows }, () => Array(cols).fill('')))
    setResult(null); setSteps([])
  }, [rows, cols])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>{t('calculate-determinant')}</span>
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">{t('matrix-dimensions')}</label>
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">{t('rows')}</label>
                  <Input type="number" min={1} max={10} value={rows} onChange={e => setRows(parseInt(e.target.value) || 3)} className="w-20 text-center" />
                </div>
                <span className="text-lg text-muted-foreground mt-5">×</span>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">{t('cols')}</label>
                  <Input type="number" min={1} max={10} value={cols} onChange={e => setCols(parseInt(e.target.value) || 3)} className="w-20 text-center" />
                </div>
                <Button onClick={handleResize} className="mt-5">{t('generate')}</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('matrix-elements')}</label>
              <div className="flex justify-center">
                <MatrixInput id="det-matrix" rows={rows} cols={cols} values={matrix} onChange={setMatrix} onEnterLast={handleCalculate} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />{t('calculate-determinant')}
              </Button>
              <Button variant="outline" onClick={handleClear}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-1/2">
        <ResultPanel result={result} steps={steps} />
      </div>
    </div>
  )
}
