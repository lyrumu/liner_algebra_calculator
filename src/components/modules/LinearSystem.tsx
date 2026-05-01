import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MatrixInput } from '@/components/MatrixInput'
import { VectorInput } from '@/components/VectorInput'
import { ResultPanel } from '@/components/ResultPanel'
import type { StructuredResult } from '@/components/ResultPanel'
import { matrixToFractions, vectorToFractions, formatNumber, getOperationName } from '@/lib/utils'
import * as math from '@/lib/math-core'
import type { Step } from '@/components/StepsTimeline'
import { Calculator, RefreshCw } from 'lucide-react'
import type { SystemMethod } from '@/types'

interface LinearSystemProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function LinearSystem({ onAddHistory, loadKey, loadPayload }: LinearSystemProps) {
  const { t, tf } = useI18n()
  const [method, setMethod] = useState<SystemMethod>('gauss')
  const [equations, setEquations] = useState(3)
  const [variables, setVariables] = useState(3)
  const [coefficients, setCoefficients] = useState<string[][]>(() => Array.from({ length: 3 }, () => Array(3).fill('')))
  const [constants, setConstants] = useState<string[]>(() => Array(3).fill(''))
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'linear-system') return
    const coeff = loadPayload.coefficients as any[][] | undefined
    const consts = loadPayload.constants as any[] | undefined
    if (!coeff || !consts) return
    const eq = coeff.length; const vr = coeff[0]?.length ?? 3
    setEquations(eq); setVariables(vr)
    setCoefficients(coeff.map(r => r.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))))
    setConstants(consts.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? '')))
    if (loadPayload.method) setMethod(loadPayload.method as SystemMethod)
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  const handleResize = useCallback(() => {
    const eq = Math.min(10, Math.max(1, equations)); const vr = Math.min(10, Math.max(1, variables))
    setEquations(eq); setVariables(vr)
    setCoefficients(prev => Array.from({ length: eq }, (_, i) => Array.from({ length: vr }, (_, j) => prev[i]?.[j] ?? '')))
    setConstants(prev => Array.from({ length: eq }, (_, i) => prev[i] ?? ''))
    setResult(null); setSteps([])
  }, [equations, variables])

  const handleCalculate = useCallback(() => {
    try {
      if (equations < 1 || equations > 10 || variables < 1 || variables > 10) throw new Error(t('error-eq-var-range'))
      const coeff = matrixToFractions(coefficients); const consts = vectorToFractions(constants)
      const s: Step[] = []
      let eqHtml = '<div class="space-y-1 mt-2">'
      for (let i = 0; i < equations; i++) {
        let terms = ''
        for (let j = 0; j < variables; j++) {
          const cv = coeff[i][j].valueOf()
          if (Math.abs(cv) > 1e-10) {
            if (j > 0 && cv > 0) terms += ' + '; else if (j > 0 && cv < 0) terms += ' - '
            const absCv = Math.abs(cv)
            if (Math.abs(absCv - 1) > 1e-10) terms += formatNumber(absCv)
            terms += 'x<sub>' + (j + 1) + '</sub>'
          }
        }
        eqHtml += '<p>' + (terms || '0') + ' = ' + formatNumber(consts[i]) + '</p>'
      }
      eqHtml += '</div>'
      s.push({ content: '<p>' + t('step-linear-system') + '</p>' + eqHtml })
      let calcResult: ReturnType<typeof math.gaussElimination>
      switch (method) {
        case 'gauss': calcResult = math.gaussElimination(coeff, consts); break
        case 'lu': {
          if (equations !== variables) throw new Error(t('error-lu-square'))
          const { L, U } = math.luDecomposition(coeff); const sol = math.solveWithLU(L, U, consts)
          calcResult = { type: 'unique-solution' as const, solution: sol }; break
        }
        case 'basis-solution': case 'general-solution': calcResult = math.gaussElimination(coeff, consts); break
        default: throw new Error('Unknown method')
      }
      if (calcResult.type === 'unique-solution' && calcResult.solution) {
        let solStr = '<p>' + t('step-unique-solution') + '</p><ul class="list-disc list-inside space-y-1">'
        calcResult.solution.forEach((val, idx) => { solStr += '<li>x<sub>' + (idx + 1) + '</sub> = <strong>' + formatNumber(val) + '</strong></li>' })
        solStr += '</ul>'; s.push({ content: solStr })
        let solDisplay = '<ul class="list-disc list-inside space-y-2">'
        calcResult.solution.forEach((val, idx) => { solDisplay += '<li class="text-lg">x<sub>' + (idx + 1) + '</sub> = <span class="font-mono font-semibold">' + formatNumber(val) + '</span></li>' })
        solDisplay += '</ul>'
        setResult({ type: 'html', titleKey: 'result-unique-solution', html: solDisplay })
      } else if (calcResult.type === 'no-solution') {
        s.push({ content: '<p class="text-destructive font-semibold">✗ ' + t('step-no-solution') + '</p>' })
        setResult({ type: 'icon-title', titleKey: 'result-no-solution', icon: 'cross', subItems: [{ key: 'result-no-solution-desc' }] })
      } else {
        s.push({ content: '<p>' + tf('step-infinite-solutions', { rank: calcResult.rank ?? 0, free: calcResult.freeVariables ?? 0 }) + '</p>' })
        if (method === 'general-solution' || method === 'basis-solution') s.push({ content: '<p>' + t('step-general-solution') + '</p>' })
        setResult({ type: 'icon-title', titleKey: 'result-infinite-solutions', icon: 'infinity', subItems: [{ key: 'result-rank', params: { rank: calcResult.rank ?? 0 } }, { key: 'result-free-vars', params: { free: calcResult.freeVariables ?? 0 } }] })
      }
      setSteps(s)
      onAddHistory({
        type: 'linear-system',
        input: { method, equations, variables, coefficients: coeff.map(r => r.map(v => v.valueOf())), constants: consts.map(v => v.valueOf()), typeLabel: tf('history-linear-system', { method: t(getOperationName(method)) }) },
        result: calcResult.type === 'unique-solution' ? t('result-unique-solution') : calcResult.type === 'no-solution' ? t('result-no-solution') : t('result-infinite-solutions')
      })
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') })
      setSteps([])
    }
  }, [method, equations, variables, coefficients, constants, t, tf, onAddHistory])

  const handleClear = useCallback(() => {
    setCoefficients(Array.from({ length: equations }, () => Array(variables).fill('')))
    setConstants(Array(equations).fill(''))
    setResult(null); setSteps([])
  }, [equations, variables])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /><span>{t('linear-system-solving')}</span></h2>
            <div>
              <label className="block text-sm font-medium mb-2">{t('solution-method')}</label>
              <Select value={method} onValueChange={v => setMethod(v as SystemMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gauss">{t('gauss')}</SelectItem>
                  <SelectItem value="lu">{t('lu')}</SelectItem>
                  <SelectItem value="basis-solution">{t('basis-solution')}</SelectItem>
                  <SelectItem value="general-solution">{t('general-solution')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('system-dimensions')}</label>
              <div className="flex items-center gap-3">
                <div><label className="block text-xs text-muted-foreground mb-1">{t('equations')}</label><Input type="number" min={1} max={10} value={equations} onChange={e => setEquations(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <span className="text-lg text-muted-foreground mt-5">×</span>
                <div><label className="block text-xs text-muted-foreground mb-1">{t('variables')}</label><Input type="number" min={1} max={10} value={variables} onChange={e => setVariables(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <Button variant="default" size="sm" className="mt-5" onClick={handleResize}>{t('generate')}</Button>
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-2">{t('coefficient-matrix')}</label>
              <MatrixInput id="sys-coeff" rows={equations} cols={variables} values={coefficients} onChange={setCoefficients} nextFocusQuery={'#sys-const-0'} />
            </div>
            <div><label className="block text-sm font-medium mb-2">{t('constant-vector')}</label>
              <VectorInput id="sys-const" length={equations} values={constants} onChange={setConstants} onEnterLast={handleCalculate} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1"><Calculator className="w-4 h-4 mr-2" />{t('solve')}</Button>
              <Button variant="outline" onClick={handleClear}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-1/2"><ResultPanel result={result} steps={steps} /></div>
    </div>
  )
}
