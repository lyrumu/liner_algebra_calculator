import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VectorInput } from '@/components/VectorInput'
import { ResultPanel } from '@/components/ResultPanel'
import type { StructuredResult } from '@/components/ResultPanel'
import { vectorToFractions, formatNumber, getOperationName } from '@/lib/utils'
import * as math from '@/lib/math-core'
import type { Step } from '@/components/StepsTimeline'
import { Calculator, RefreshCw } from 'lucide-react'
import type { VectorOp } from '@/types'
import { Fraction } from '@/lib/fraction'

const opsWithV = new Set(['add', 'subtract', 'dot-product', 'cross-product', 'angle', 'orthogonality'])
const opsWithScalar = new Set(['scalar-multiply'])

interface VectorOpsProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function VectorOperations({ onAddHistory, loadKey, loadPayload }: VectorOpsProps) {
  const { t, tf } = useI18n()
  const [operation, setOperation] = useState<VectorOp>('add')
  const [lenU, setLenU] = useState(3)
  const [vectorU, setVectorU] = useState<string[]>(() => Array(3).fill(''))
  const [lenV, setLenV] = useState(3)
  const [vectorV, setVectorV] = useState<string[]>(() => Array(3).fill(''))
  const [scalar, setScalar] = useState('2')
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'vector-operation') return
    const op = loadPayload.operation as VectorOp
    if (!op) return; setOperation(op)
    const vU = loadPayload.vectorU as any[] | undefined
    if (vU) { setLenU(vU.length); setVectorU(vU.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))) }
    const vV = loadPayload.vectorV as any[] | undefined
    if (vV && opsWithV.has(op)) { setLenV(vV.length); setVectorV(vV.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))) }
    if (loadPayload.scalar !== undefined) setScalar(String(loadPayload.scalar))
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  useEffect(() => {
    setResult(null); setSteps([])
  }, [operation])

  const handleCalculate = useCallback(() => {
    try {
      if (lenU < 1 || lenU > 10) throw new Error(t('error-vector-dim-range'))
      const vU = vectorToFractions(vectorU)
      const s: Step[] = []
      s.push({ content: '<p>' + tf('step-vector-u', { dim: lenU }) + '</p>' })
      let calcResult: Fraction[] | Fraction | number | boolean
      const opName = getOperationName(operation)
      switch (operation) {
        case 'add': {
          if (lenU !== lenV) throw new Error(t('error-vector-same-dim'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: lenV }) + '</p>' })
          calcResult = math.addVectors(vU, vV); break
        }
        case 'subtract': {
          if (lenU !== lenV) throw new Error(t('error-vector-same-dim'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: lenV }) + '</p>' })
          calcResult = math.subtractVectors(vU, vV); break
        }
        case 'scalar-multiply': {
          const sc = parseFloat(scalar)
          if (isNaN(sc)) throw new Error(t('error-invalid-scalar'))
          s.push({ content: '<p>' + tf('step-scalar-k', { value: formatNumber(sc) }) + '</p>' })
          calcResult = math.scalarMultiplyVector(vU, sc); break
        }
        case 'dot-product': {
          if (lenU !== lenV) throw new Error(t('error-vector-same-dim'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: lenV }) + '</p>' })
          calcResult = math.dotProduct(vU, vV)
          s.push({ content: '<p>u·v = <strong>' + formatNumber(calcResult) + '</strong></p>' }); break
        }
        case 'cross-product': {
          if (lenU !== 3) throw new Error(t('error-cross-3d'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: 3 }) + '</p>' })
          calcResult = math.crossProduct(vU, vV); break
        }
        case 'length': {
          calcResult = math.vectorLength(vU)
          s.push({ content: '<p>||u|| = <strong>' + formatNumber(calcResult) + '</strong></p>' }); break
        }
        case 'angle': {
          if (lenU !== lenV) throw new Error(t('error-vector-same-dim'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: lenV }) + '</p>' })
          const angRad = math.vectorAngle(vU, vV)
          const angDeg = angRad * 180 / Math.PI
          s.push({ content: '<p>θ = <strong>' + formatNumber(angRad) + '</strong> rad = <strong>' + formatNumber(angDeg) + '</strong>°</p>' })
          calcResult = angDeg; break
        }
        case 'orthogonality': {
          if (lenU !== lenV) throw new Error(t('error-vector-same-dim'))
          const vV = vectorToFractions(vectorV)
          s.push({ content: '<p>' + tf('step-vector-v', { dim: lenV }) + '</p>' })
          const dot = math.dotProduct(vU, vV)
          const isOrtho = math.areOrthogonal(vU, vV)
          s.push({ content: '<p>u·v = ' + formatNumber(dot) + '</p>' })
          s.push({ content: '<p>' + (isOrtho ? '✓' : '✗') + ' ' + tf('step-orthogonal-check', { result: isOrtho ? t('result-orthogonal') : t('result-not-orthogonal') }) + '</p>' })
          calcResult = isOrtho; break
        }
      }
      setSteps(s)
      if (Array.isArray(calcResult)) {
        setResult({ type: 'vector', titleKey: 'result-vector-op', titleParams: { op: t(opName) }, vector: calcResult as Fraction[] })
      } else if (typeof calcResult === 'boolean') {
        setResult({ type: 'icon-title', titleKey: 'result-orthogonality', icon: calcResult ? 'check' : 'cross', subItems: [] })
      } else {
        setResult({ type: 'scalar', titleKey: 'result-calculation', value: formatNumber(calcResult) })
      }
      const opLabel = t(opName)
      onAddHistory({
        type: 'vector-operation',
        input: { operation, lengthU: lenU, vectorU: vU.map(v => v.valueOf()), lengthV: opsWithV.has(operation) ? lenV : undefined, vectorV: opsWithV.has(operation) ? vectorToFractions(vectorV).map(v => v.valueOf()) : undefined, scalar: opsWithScalar.has(operation) ? parseFloat(scalar) : undefined, typeLabel: tf('history-vector-op', { op: opLabel }) },
        result: t('vector') + ' ' + opLabel
      })
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') })
      setSteps([])
    }
  }, [operation, lenU, lenV, vectorU, vectorV, scalar, t, tf, onAddHistory])

  const handleClear = useCallback(() => {
    setVectorU(Array(lenU).fill(''))
    setVectorV(Array(lenV).fill(''))
    setScalar('2')
    setResult(null); setSteps([])
  }, [lenU, lenV])

  const isLastInputV = opsWithV.has(operation)
  const uEnter = opsWithV.has(operation) ? '#vec-v-0' : opsWithScalar.has(operation) ? '#vec-scalar-value' : undefined
  const vEnter = opsWithV.has(operation) ? (opsWithScalar.has(operation) ? '#vec-scalar-value' : undefined) : undefined

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /><span>{t('vector')}</span></h2>
            <div>
              <label className="block text-sm font-medium mb-2">{t('vector-operation')}</label>
              <Select value={operation} onValueChange={v => setOperation(v as VectorOp)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">{t('vector-add')}</SelectItem>
                  <SelectItem value="subtract">{t('vector-subtract')}</SelectItem>
                  <SelectItem value="scalar-multiply">{t('vector-scalar-multiply')}</SelectItem>
                  <SelectItem value="dot-product">{t('dot-product')}</SelectItem>
                  <SelectItem value="cross-product">{t('cross-product')}</SelectItem>
                  <SelectItem value="length">{t('length')}</SelectItem>
                  <SelectItem value="angle">{t('angle')}</SelectItem>
                  <SelectItem value="orthogonality">{t('orthogonality')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('vector-u')}</label>
              <div className="flex items-center gap-3 mb-2">
                <div><label className="block text-xs text-muted-foreground mb-1">{t('dimension')}</label><Input type="number" min={1} max={10} value={lenU} onChange={e => setLenU(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <Button variant="default" size="sm" className="mt-5" onClick={() => setVectorU(Array(lenU).fill(''))}>{t('generate')}</Button>
              </div>
              <VectorInput id="vec-u" length={lenU} values={vectorU} onChange={setVectorU} nextFocusQuery={uEnter} onEnterLast={uEnter ? undefined : handleCalculate} />
            </div>
            {isLastInputV && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('vector-v')}</label>
                <div className="flex items-center gap-3 mb-2">
                  <div><label className="block text-xs text-muted-foreground mb-1">{t('dimension')}</label><Input type="number" min={1} max={10} value={lenV} onChange={e => setLenV(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                  <Button variant="default" size="sm" className="mt-5" onClick={() => setVectorV(Array(lenV).fill(''))}>{t('generate')}</Button>
                </div>
                <VectorInput id="vec-v" length={lenV} values={vectorV} onChange={setVectorV} nextFocusQuery={vEnter} onEnterLast={vEnter ? undefined : handleCalculate} />
              </div>
            )}
            {opsWithScalar.has(operation) && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('scalar-value')}</label>
                <Input id="vec-scalar-value" type="number" step="any" value={scalar} onChange={e => setScalar(e.target.value)} className="w-32" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCalculate() } }} />
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1"><Calculator className="w-4 h-4 mr-2" />{t('calculate')}</Button>
              <Button variant="outline" onClick={handleClear}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-1/2"><ResultPanel result={result} steps={steps} /></div>
    </div>
  )
}
