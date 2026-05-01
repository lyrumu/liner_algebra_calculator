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
import type { VGOp } from '@/types'

interface VectorGroupProps {
  onAddHistory: (item: { type: string; input: Record<string, unknown>; result: string }) => void
  loadKey?: number
  loadPayload?: Record<string, unknown> | null
}

export function VectorGroup({ onAddHistory, loadKey, loadPayload }: VectorGroupProps) {
  const { t, tf } = useI18n()
  const [operation, setOperation] = useState<VGOp>('linear-dependency')
  const [vectorCount, setVectorCount] = useState(3); const [dimension, setDimension] = useState(3)
  const [vectors, setVectors] = useState<string[][]>(() => Array.from({ length: 3 }, () => Array(3).fill('')))
  const [result, setResult] = useState<StructuredResult | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!loadPayload || loadPayload._historyType !== 'vector-group') return
    const vArr = loadPayload.vectors as any[][] | undefined
    if (!vArr) return
    const vc = vArr.length; const dim = vArr[0]?.length ?? 3
    setVectorCount(vc); setDimension(dim)
    setVectors(vArr.map(v => v.map(x => typeof x === 'object' ? String(x.numerator ?? '') : String(x ?? ''))))
    if (loadPayload.operation) setOperation(loadPayload.operation as VGOp)
    setResult(null); setSteps([])
  }, [loadKey, loadPayload])

  const handleResize = useCallback(() => {
    const vc = Math.min(10, Math.max(1, vectorCount)); const dim = Math.min(10, Math.max(1, dimension))
    setVectorCount(vc); setDimension(dim)
    setVectors(prev => Array.from({ length: vc }, (_, i) => Array.from({ length: dim }, (_, j) => prev[i]?.[j] ?? '')))
    setResult(null); setSteps([])
  }, [vectorCount, dimension])

  const handleCalculate = useCallback(() => {
    try {
      if (vectorCount < 1 || vectorCount > 10 || dimension < 1 || dimension > 10) throw new Error(t('error-vg-range'))
      const vecs = vectors.map(v => vectorToFractions(v))
      const s: Step[] = []
      s.push({ content: '<p>' + tf('step-vector-group', { count: vectorCount, dim: dimension }) + '</p>' })
      const opName = getOperationName(operation)
      switch (operation) {
        case 'linear-dependency': {
          const isDep = math.isLinearlyDependent(vecs); const rank = math.vectorGroupRank(vecs)
          s.push({ content: '<p>' + tf('step-group-rank', { rank }) + '</p>' })
          s.push({ content: '<p>' + (rank < vectorCount ? '✓ ' + t('step-linear-dependent') : '✗ ' + t('step-linear-independent')) + '</p>' })
          setResult({ type: 'scalar', titleKey: 'result-linear-dep-analysis', valueKey: isDep ? 'result-linear-dep' : 'result-linear-indep', valueColor: isDep ? 'text-orange-500' : 'text-green-600' })
          onAddHistory({ type: 'vector-group', input: { operation, vectors: vecs.map(v => v.map(x => x.valueOf())), typeLabel: tf('history-vector-group', { op: t(opName) }) }, result: t('op-linear-dependency') + '：' + (isDep ? t('result-linear-dep') : t('result-linear-indep')) }); break
        }
        case 'max-independent': {
          const miResult = math.maxIndependentSet(vecs)
          s.push({ content: '<p>' + tf('step-max-independent-set', { count: miResult.vectors.length }) + '</p>' })
          let idxHtml = '<ul class="list-disc list-inside space-y-1">'
          miResult.indices.forEach(idx => { idxHtml += '<li>α<sub>' + (idx + 1) + '</sub></li>' })
          idxHtml += '</ul>'
          setResult({ type: 'html', titleKey: 'result-max-independent', html: idxHtml, subItems: [{ key: 'result-max-independent-desc', params: { count: miResult.vectors.length } }] })
          onAddHistory({ type: 'vector-group', input: { operation, vectors: vecs.map(v => v.map(x => x.valueOf())), typeLabel: tf('history-vector-group', { op: t(opName) }) }, result: t('op-max-independent') }); break
        }
        case 'rank': {
          const rank = math.vectorGroupRank(vecs)
          s.push({ content: '<p>' + tf('step-group-rank', { rank }) + '</p>' })
          setResult({ type: 'scalar', titleKey: 'result-group-rank', value: String(rank) })
          onAddHistory({ type: 'vector-group', input: { operation, vectors: vecs.map(v => v.map(x => x.valueOf())), typeLabel: tf('history-vector-group', { op: t(opName) }) }, result: t('op-rank') + ' = ' + rank }); break
        }
        case 'schmidt': {
          const { orthogonal, orthonormal } = math.schmidtOrthogonalization(vecs)
          s.push({ content: '<p>' + t('step-orthogonalized') + '</p>' }); s.push({ content: '<p>' + t('step-normalized') + '</p>' })
          setResult({ type: 'html', titleKey: 'result-schmidt', subItems: [{ key: 'result-orthogonalized', params: { count: orthogonal.length } }, { key: 'result-normalized', params: { count: orthonormal.length } }] })
          onAddHistory({ type: 'vector-group', input: { operation, vectors: vecs.map(v => v.map(x => x.valueOf())), typeLabel: tf('history-vector-group', { op: t(opName) }) }, result: t('op-schmidt') }); break
        }
      }
      setSteps(s)
    } catch (e) {
      setResult({ type: 'error', value: e instanceof Error ? e.message : t('error-calculation') }); setSteps([])
    }
  }, [operation, vectorCount, dimension, vectors, t, tf, onAddHistory])

  const handleClear = useCallback(() => {
    setVectors(Array.from({ length: vectorCount }, () => Array(dimension).fill(''))); setResult(null); setSteps([])
  }, [vectorCount, dimension])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /><span>{t('vector-group-analysis')}</span></h2>
            <div><label className="block text-sm font-medium mb-2">{t('analysis-type')}</label>
              <Select value={operation} onValueChange={v => setOperation(v as VGOp)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear-dependency">{t('linear-dependency')}</SelectItem>
                  <SelectItem value="max-independent">{t('max-independent')}</SelectItem>
                  <SelectItem value="rank">{t('group-rank')}</SelectItem>
                  <SelectItem value="schmidt">{t('schmidt')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="block text-sm font-medium mb-2">{t('vector-group-settings')}</label>
              <div className="flex items-center gap-3">
                <div><label className="block text-xs text-muted-foreground mb-1">{t('vector-count')}</label><Input type="number" min={1} max={10} value={vectorCount} onChange={e => setVectorCount(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <span className="text-lg text-muted-foreground mt-5">×</span>
                <div><label className="block text-xs text-muted-foreground mb-1">{t('vector-dimension')}</label><Input type="number" min={1} max={10} value={dimension} onChange={e => setDimension(parseInt(e.target.value) || 3)} className="w-16 text-center" /></div>
                <Button variant="default" size="sm" className="mt-5" onClick={handleResize}>{t('generate')}</Button>
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-2">{t('vg-group')}</label>
              <div className="space-y-3">
                {Array.from({ length: vectorCount }, (_, i) => (
                  <div key={i}>
                    <label className="block text-xs text-muted-foreground mb-1">{tf('vector-alpha', { index: i + 1 })}</label>
                    <VectorInput id={'vg-vec-' + i} length={dimension} values={vectors[i] ?? Array(dimension).fill('')}
                      onChange={vals => { const n = [...vectors]; n[i] = vals; setVectors(n) }}
                      nextFocusQuery={i < vectorCount - 1 ? '#vg-vec-' + (i + 1) + '-0' : undefined}
                      onEnterLast={i === vectorCount - 1 ? handleCalculate : undefined} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCalculate} className="flex-1"><Calculator className="w-4 h-4 mr-2" />{t('analyze')}</Button>
              <Button variant="outline" onClick={handleClear}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-1/2"><ResultPanel result={result} steps={steps} /></div>
    </div>
  )
}
