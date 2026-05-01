import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MatrixInput } from '@/components/MatrixInput'
import { ResultPanel } from '@/components/ResultPanel'
import type { StructuredResult } from '@/components/ResultPanel'
import { matrixToFractions, formatNumber, getOperationName } from '@/lib/utils'
import * as math from '@/lib/math-core'
import type { Step } from '@/components/StepsTimeline'
import { Calculator, RefreshCw } from 'lucide-react'
import type { QFOp } from '@/types'

interface QuadraticFormProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function QuadraticForm({ onAddHistory, loadKey, loadPayload }: QuadraticFormProps) {
  const { t, tf } = useI18n()
  const [operation, setOperation] = useState<QFOp>('standard-form')
  const [dimension, setDimension] = useState(3)
  const [matrix, setMatrix] = useState<string[][]>(() => Array.from({ length: 3 }, () => Array(3).fill('')))
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'quadratic-form') return
    const m = loadPayload.matrix as any[][] | undefined
    if (!m) return
    const d = m.length; setDimension(d)
    setMatrix(m.map(r => r.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))))
    if (loadPayload.operation) setOperation(loadPayload.operation as QFOp)
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  const handleResize = useCallback(() => {
    const d = Math.min(10, Math.max(1, dimension)); setDimension(d)
    setMatrix(prev => Array.from({ length: d }, (_, i) => Array.from({ length: d }, (_, j) => prev[i]?.[j] ?? '')))
    setResult(null); setSteps([])
  }, [dimension])

  const handleCalculate = useCallback(() => {
    try {
      if (dimension < 1 || dimension > 10) throw new Error(t('error-dimension-range'))
      let m = matrixToFractions(matrix)
      const wasSym = !math.isSymmetric(m)
      if (wasSym) m = math.makeSymmetric(m)
      const s: Step[] = []
      if (wasSym) s.push({ content: '<p class="text-amber-600">⚠ ' + t('step-non-symmetric') + '</p>' })
      s.push({ content: '<p>' + tf('step-quadratic-matrix', { dim: dimension }) + '</p>' })
      const opName = getOperationName(operation)
      switch (operation) {
        case 'standard-form': {
          const stdResult = math.standardForm(m)
          let evHtml = '<ul class="list-disc list-inside space-y-1">'
          stdResult.eigenvalues.forEach((ev, idx) => {
            if (typeof ev === 'object' && 'real' in ev) {
              const sign = ev.imag >= 0 ? '+' : ''
              evHtml += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev.real) + ' ' + sign + formatNumber(ev.imag) + 'i</li>'
            } else { evHtml += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev) + '</li>' }
          })
          evHtml += '</ul>'; s.push({ content: evHtml })
          setResult({ type: 'matrix', titleKey: 'result-standard-form', matrix: stdResult.matrix })
          onAddHistory({ type: 'quadratic-form', input: { operation, matrix: m.map(r => r.map(v => v.valueOf())), typeLabel: tf('history-quadratic-form', { op: t(opName) }) }, result: t('op-standard-form') }); break
        }
        case 'canonical-form': {
          const canonM = math.canonicalForm(m)
          setResult({ type: 'matrix', titleKey: 'result-canonical-form', matrix: canonM })
          onAddHistory({ type: 'quadratic-form', input: { operation, matrix: m.map(r => r.map(v => v.valueOf())), typeLabel: tf('history-quadratic-form', { op: t(opName) }) }, result: t('op-canonical-form') }); break
        }
        case 'positive-definite': {
          const isPD = math.isPositiveDefinite(m)
          let minorStr = '<p>' + t('step-principal-minors') + '</p><ul class="list-disc list-inside space-y-1">'
          for (let i = 1; i <= dimension; i++) {
            const minor = math.getPrincipalMinor(m, i); const det = math.determinant(minor)
            minorStr += '<li>Δ<sub>' + i + '</sub> = ' + formatNumber(det) + ' ' + (det.valueOf() > 0 ? '> 0 ✓' : '≤ 0 ✗') + '</li>'
          }
          minorStr += '</ul>'; s.push({ content: minorStr })
          s.push({ content: '<p>' + (isPD ? '✓ ' + t('step-positive-definite-result') : '✗ ' + t('step-not-positive-definite')) + '</p>' })
          setResult({ type: 'scalar', titleKey: 'result-positive-def-analysis', valueKey: isPD ? 'result-positive-def' : 'result-not-positive-def', valueColor: isPD ? 'text-green-600' : 'text-destructive' })
          onAddHistory({ type: 'quadratic-form', input: { operation, matrix: m.map(r => r.map(v => v.valueOf())), typeLabel: tf('history-quadratic-form', { op: t(opName) }) }, result: t('op-positive-definite') + '：' + (isPD ? t('result-positive-def') : t('result-not-positive-def')) }); break
        }
      }
      setSteps(s)
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') }); setSteps([])
    }
  }, [operation, dimension, matrix, t, tf, onAddHistory])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /><span>{t('quadratic-form-analysis')}</span></h2>
            <div><label className="block text-sm font-medium mb-2">{t('quadratic-operation')}</label>
              <Select value={operation} onValueChange={v => setOperation(v as QFOp)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard-form">{t('standard-form')}</SelectItem>
                  <SelectItem value="canonical-form">{t('canonical-form')}</SelectItem>
                  <SelectItem value="positive-definite">{t('positive-definite')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="block text-sm font-medium mb-2">{t('quadratic-matrix')}</label>
              <div className="flex items-center gap-3 mb-2">
                <div><label className="block text-xs text-muted-foreground mb-1">{t('dimension')}</label><Input type="number" min={1} max={10} value={dimension} onChange={e => setDimension(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <Button variant="default" size="sm" className="mt-5" onClick={handleResize}>{t('generate')}</Button>
              </div>
              <div className="flex justify-center"><MatrixInput id="qf-mat" rows={dimension} cols={dimension} values={matrix} onChange={setMatrix} onEnterLast={handleCalculate} /></div>
              <p className="text-xs text-muted-foreground mt-2">{t('symmetric-note')}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1"><Calculator className="w-4 h-4 mr-2" />{t('analyze')}</Button>
              <Button variant="outline" className="px-6" onClick={() => { setMatrix(Array.from({ length: dimension }, () => Array(dimension).fill(''))); setResult(null); setSteps([]) }}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-1/2"><ResultPanel result={result} steps={steps} /></div>
    </div>
  )
}
