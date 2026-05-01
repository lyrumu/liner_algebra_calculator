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
import type { MatrixOp } from '@/types'
import { Fraction } from '@/lib/fraction'

const opsWithB = new Set(['add', 'subtract', 'multiply'])
const opsWithScalar = new Set(['scalar-multiply'])

interface MatrixOpsProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function MatrixOperations({ onAddHistory, loadKey, loadPayload }: MatrixOpsProps) {
  const { t, tf } = useI18n()
  const [operation, setOperation] = useState<MatrixOp>('add')
  const [rowsA, setRowsA] = useState(2); const [colsA, setColsA] = useState(2)
  const [matrixA, setMatrixA] = useState<string[][]>(() => Array.from({ length: 2 }, () => Array(2).fill('')))
  const [rowsB, setRowsB] = useState(2); const [colsB, setColsB] = useState(2)
  const [matrixB, setMatrixB] = useState<string[][]>(() => Array.from({ length: 2 }, () => Array(2).fill('')))
  const [scalar, setScalar] = useState('2')
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'matrix-operation') return
    const op = loadPayload.operation as MatrixOp
    if (!op) return; setOperation(op)
    const mA = loadPayload.matrixA as any[][]
    if (mA) {
      setRowsA(mA.length); setColsA(mA[0]?.length ?? 2)
      setMatrixA(mA.map(r => r.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))))
    }
    const mB = loadPayload.matrixB as any[][] | undefined
    if (mB && opsWithB.has(op)) {
      setRowsB(mB.length); setColsB(mB[0]?.length ?? 2)
      setMatrixB(mB.map(r => r.map(v => typeof v === 'object' ? String(v.numerator ?? '') : String(v ?? ''))))
    }
    if (loadPayload.scalar !== undefined) setScalar(String(loadPayload.scalar))
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  useEffect(() => {
    setResult(null); setSteps([])
  }, [operation])

  const handleCalculate = useCallback(() => {
    try {
      const mA = matrixToFractions(matrixA)
      const s: Step[] = []
      s.push({ content: '<p>' + tf('step-matrix-a', { rows: rowsA, cols: colsA }) + '</p>' })
      let calcResult: Fraction[][] | Fraction | (Fraction | { real: number; imag: number })[] | number
      switch (operation) {
        case 'add': {
          const mB = matrixToFractions(matrixB)
          s.push({ content: '<p>' + tf('step-matrix-b', { rows: rowsB, cols: colsB }) + '</p>' })
          calcResult = math.addMatrices(mA, mB); break
        }
        case 'subtract': {
          const mB = matrixToFractions(matrixB)
          s.push({ content: '<p>' + tf('step-matrix-b', { rows: rowsB, cols: colsB }) + '</p>' })
          calcResult = math.subtractMatrices(mA, mB); break
        }
        case 'multiply': {
          const mB = matrixToFractions(matrixB)
          s.push({ content: '<p>' + tf('step-matrix-b', { rows: rowsB, cols: colsB }) + '</p>' })
          calcResult = math.multiplyMatrices(mA, mB); break
        }
        case 'scalar-multiply': {
          const sc = parseFloat(scalar)
          if (isNaN(sc)) throw new Error(t('error-invalid-scalar'))
          s.push({ content: '<p>' + tf('step-scalar-k', { value: formatNumber(sc) }) + '</p>' })
          calcResult = math.scalarMultiplyMatrix(mA, sc); break
        }
        case 'transpose': calcResult = math.transposeMatrix(mA); break
        case 'inverse': calcResult = math.inverseMatrix(mA); break
        case 'adjugate': calcResult = math.adjugateMatrix(mA); break
        case 'rank': { calcResult = math.matrixRank(mA); s.push({ content: '<p>rank(A) = <strong>' + calcResult + '</strong></p>' }); break }
        case 'trace': { calcResult = math.matrixTrace(mA); s.push({ content: '<p>tr(A) = <strong>' + formatNumber(calcResult) + '</strong></p>' }); break }
        case 'eigen': {
          const evs = math.eigenValues(mA)
          let evHtml = '<ul class="list-disc list-inside space-y-1">'
          evs.forEach((ev, idx) => {
            if (typeof ev === 'object' && 'real' in ev) {
              const sign = ev.imag >= 0 ? '+' : ''
              evHtml += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev.real) + ' ' + sign + formatNumber(ev.imag) + 'i</li>'
            } else {
              evHtml += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev as Fraction) + '</li>'
            }
          })
          evHtml += '</ul>'
          s.push({ content: evHtml })
          calcResult = evs; break
        }
        default: throw new Error('Unknown operation')
      }
      setSteps(s)
      const opName = getOperationName(operation)
      if (Array.isArray(calcResult) && Array.isArray(calcResult[0])) {
        setResult({ type: 'matrix', titleKey: 'result-matrix-op', titleParams: { op: t(opName) }, matrix: calcResult as Fraction[][] })
      } else if (Array.isArray(calcResult)) {
        const evArr = calcResult as (Fraction | { real: number; imag: number })[]
        let list = '<ul class="list-disc list-inside space-y-1">'
        evArr.forEach((ev, idx) => {
          if (typeof ev === 'object' && 'real' in ev) {
            const sign = ev.imag >= 0 ? '+' : ''
            list += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev.real) + ' ' + sign + formatNumber(ev.imag) + 'i</li>'
          } else {
            list += '<li>λ<sub>' + (idx + 1) + '</sub> = ' + formatNumber(ev as Fraction) + '</li>'
          }
        })
        list += '</ul>'
        setResult({ type: 'html', titleKey: 'result-eigenvalues', html: list })
      } else {
        setResult({ type: 'scalar', titleKey: 'result-calculation', value: formatNumber(calcResult as number) })
      }
      const opLabel = t(opName)
      onAddHistory({
        type: 'matrix-operation',
        input: {
          operation, rowsA, colsA,
          matrixA: mA.map(r => r.map(v => v.valueOf())),
          rowsB: opsWithB.has(operation) ? rowsB : undefined,
          colsB: opsWithB.has(operation) ? colsB : undefined,
          matrixB: opsWithB.has(operation) ? matrixToFractions(matrixB).map(r => r.map(v => v.valueOf())) : undefined,
          scalar: opsWithScalar.has(operation) ? parseFloat(scalar) : undefined,
          typeLabel: tf('history-matrix-op', { op: opLabel })
        },
        result: t('matrix') + ' ' + opLabel
      })
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') })
      setSteps([])
    }
  }, [operation, rowsA, colsA, colsB, rowsB, matrixA, matrixB, scalar, t, tf, onAddHistory])

  const handleClear = useCallback(() => {
    setMatrixA(Array.from({ length: rowsA }, () => Array(colsA).fill('')))
    setMatrixB(Array.from({ length: rowsB }, () => Array(colsB).fill('')))
    setScalar('2')
    setResult(null); setSteps([])
  }, [rowsA, colsA, rowsB, colsB])

  const mAEnter = opsWithB.has(operation) ? '#mat-b-0-0' :
    opsWithScalar.has(operation) ? '#scalar-value' : undefined
  const mBEnter = opsWithB.has(operation) ? (opsWithScalar.has(operation) ? '#scalar-value' : undefined) : undefined

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>{t('matrix')}</span>
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">{t('matrix-operation')}</label>
              <Select value={operation} onValueChange={v => setOperation(v as MatrixOp)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">{t('add')}</SelectItem>
                  <SelectItem value="subtract">{t('subtract')}</SelectItem>
                  <SelectItem value="multiply">{t('multiply')}</SelectItem>
                  <SelectItem value="scalar-multiply">{t('scalar-multiply')}</SelectItem>
                  <SelectItem value="transpose">{t('transpose')}</SelectItem>
                  <SelectItem value="inverse">{t('inverse')}</SelectItem>
                  <SelectItem value="adjugate">{t('adjugate')}</SelectItem>
                  <SelectItem value="rank">{t('rank')}</SelectItem>
                  <SelectItem value="trace">{t('trace')}</SelectItem>
                  <SelectItem value="eigen">{t('eigen')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('matrix-a')}</label>
              <div className="flex items-center gap-3 mb-2">
                <div><label className="block text-xs text-muted-foreground mb-1">{t('rows')}</label><Input type="number" min={1} max={10} value={rowsA} onChange={e => setRowsA(parseInt(e.target.value) || 2)} className="w-16 text-center" /></div>
                <span className="text-lg text-muted-foreground mt-5">×</span>
                <div><label className="block text-xs text-muted-foreground mb-1">{t('cols')}</label><Input type="number" min={1} max={10} value={colsA} onChange={e => setColsA(parseInt(e.target.value) || 2)} className="w-16 text-center" /></div>
                <Button variant="default" size="sm" className="mt-5" onClick={() => setMatrixA(Array.from({ length: rowsA }, () => Array(colsA).fill('')))}>{t('generate')}</Button>
              </div>
              <div className="flex justify-center">
                <MatrixInput id="mat-a" rows={rowsA} cols={colsA} values={matrixA} onChange={setMatrixA}
                  nextFocusQuery={mAEnter} onEnterLast={mAEnter ? undefined : handleCalculate} />
              </div>
            </div>
            {opsWithB.has(operation) && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('matrix-b')}</label>
                <div className="flex items-center gap-3 mb-2">
                  <div><label className="block text-xs text-muted-foreground mb-1">{t('rows')}</label><Input type="number" min={1} max={10} value={rowsB} onChange={e => setRowsB(parseInt(e.target.value) || 2)} className="w-16 text-center" /></div>
                  <span className="text-lg text-muted-foreground mt-5">×</span>
                  <div><label className="block text-xs text-muted-foreground mb-1">{t('cols')}</label><Input type="number" min={1} max={10} value={colsB} onChange={e => setColsB(parseInt(e.target.value) || 2)} className="w-16 text-center" /></div>
                  <Button variant="default" size="sm" className="mt-5" onClick={() => setMatrixB(Array.from({ length: rowsB }, () => Array(colsB).fill('')))}>{t('generate')}</Button>
                </div>
                <div className="flex justify-center">
                  <MatrixInput id="mat-b" rows={rowsB} cols={colsB} values={matrixB} onChange={setMatrixB}
                    nextFocusQuery={mBEnter} onEnterLast={mBEnter ? undefined : handleCalculate} />
                </div>
              </div>
            )}
            {opsWithScalar.has(operation) && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('scalar-value')}</label>
                <Input id="scalar-value" type="number" step="any" value={scalar} onChange={e => setScalar(e.target.value)} className="w-32"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCalculate() } }} />
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />{t('calculate')}
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
