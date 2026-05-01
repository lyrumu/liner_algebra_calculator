import { useI18n } from '@/i18n/I18nContext'
import { Button } from '@/components/ui/button'
import { History, Trash2, X } from 'lucide-react'
import type { HistoryItem } from '@/types'

interface HistoryPanelProps {
  history: HistoryItem[]
  onClear: () => void
  onRemove: (id: number) => void
  onLoad: (item: HistoryItem) => void
}

function formatHistoryLabel(t: (key: string) => string, tf: (key: string, params?: Record<string, string | number>) => string, item: HistoryItem): string {
  const input = item.input || {}
  const type = item.type
  try {
    switch (type) {
      case 'determinant':
        return tf('history-determinant', { rows: (input.rows ?? 0) as number, cols: (input.cols ?? 0) as number })
      case 'matrix-operation':
        return tf('history-matrix-op', { op: t('op-' + (input.operation ?? '')) })
      case 'vector-operation':
        return tf('history-vector-op', { op: t('op-' + (input.operation ?? '')) })
      case 'linear-system':
        return tf('history-linear-system', { method: t('op-' + (input.method ?? '')) })
      case 'vector-group':
        return tf('history-vector-group', { op: t('op-' + (input.operation ?? '')) })
      case 'quadratic-form':
        return tf('history-quadratic-form', { op: t('op-' + (input.operation ?? '')) })
      default:
        return (input.typeLabel as string) ?? type
    }
  } catch {
    return (input.typeLabel as string) ?? type
  }
}

function formatHistoryResult(t: (key: string) => string, item: HistoryItem): string {
  const r = item.result ?? ''
  try {
    switch (item.type) {
      case 'determinant': {
        const match = r.match(/[=＝]\s*(.+)$/)
        return match ? t('calculate-determinant') + ' = ' + match[1] : r
      }
      case 'linear-system': {
        if (r.includes('✓') || r.includes(t('result-unique-solution')) || r.includes('唯一解'))
          return '✓ ' + t('result-unique-solution')
        if (r.includes('✗') || r.includes(t('result-no-solution')) || r.includes('无解'))
          return '✗ ' + t('result-no-solution')
        return '∞ ' + t('result-infinite-solutions')
      }
      case 'vector-group': {
        const vgOp = (item.input?.operation as string) ?? ''
        if (vgOp === 'linear-dependency') {
          if (r.includes(t('result-linear-dep')) || r.includes('线性相关'))
            return t('op-linear-dependency') + '：' + t('result-linear-dep')
          if (r.includes(t('result-linear-indep')) || r.includes('线性无关'))
            return t('op-linear-dependency') + '：' + t('result-linear-indep')
        }
        return vgOp ? t('op-' + vgOp) : r
      }
      case 'matrix-operation': {
        const matOp = (item.input?.operation as string) ?? ''
        return matOp ? t('matrix') + ' ' + t('op-' + matOp) : r
      }
      case 'vector-operation': {
        const vecOp = (item.input?.operation as string) ?? ''
        return vecOp ? t('vector') + ' ' + t('op-' + vecOp) : r
      }
      case 'quadratic-form': {
        const qfOp = (item.input?.operation as string) ?? ''
        if (qfOp === 'positive-definite') {
          if (r.includes(t('result-positive-def')) || r.includes('正定'))
            return t('op-positive-definite') + '：' + t('result-positive-def')
          if (r.includes(t('result-not-positive-def')) || r.includes('不正定'))
            return t('op-positive-definite') + '：' + t('result-not-positive-def')
        }
        return qfOp ? t('op-' + qfOp) : r
      }
      default:
        return r
    }
  } catch {
    return r
  }
}

export function HistoryPanel({ history, onClear, onRemove, onLoad }: HistoryPanelProps) {
  const { t, tf } = useI18n()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          {t('history-records')}
        </h2>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-1" />
            {t('clear')}
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">{t('history-no-history')}</p>
      ) : (
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1 space-y-2">
          {history.map(item => (
            <div key={item.id} className="group relative">
              <div
                onClick={() => onLoad(item)}
                className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center mb-1 pr-6">
                  <span className="text-sm font-semibold text-foreground">
                    {formatHistoryLabel(t, tf, item)}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate pr-6">
                  {formatHistoryResult(t, item)}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onRemove(item.id) }}
                className="absolute top-2 right-2 p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                title={t('delete')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
