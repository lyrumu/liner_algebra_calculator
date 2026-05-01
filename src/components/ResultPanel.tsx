import { useState } from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StepsTimeline } from '@/components/StepsTimeline'
import type { Step } from '@/components/StepsTimeline'
import { MatrixDisplay } from '@/components/MatrixDisplay'
import { VectorDisplay } from '@/components/VectorDisplay'
import type { Fraction } from '@/lib/fraction'
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react'

export type StructuredResult = {
  type: string
  titleKey?: string
  titleParams?: Record<string, string | number>
  value?: string
  valueKey?: string
  valueColor?: string
  html?: string
  matrix?: Fraction[][]
  vector?: Fraction[]
  icon?: 'check' | 'cross' | 'infinity'
  subItems?: { key: string; params?: Record<string, string | number> }[]
}

function renderSubItems(data: StructuredResult, t: (key: string) => string, tf: (key: string, params?: Record<string, string | number>) => string) {
  return data.subItems?.map((item, i) => (
    <p key={i} className="text-muted-foreground mb-1">{item.params ? tf(item.key, item.params) : t(item.key)}</p>
  ))
}

function ResultContent({ data }: { data: StructuredResult | null }) {
  const { t, tf } = useI18n()
  if (!data) return null

  if (data.type === 'error') {
    return <p className="text-destructive font-semibold">{data.value || t('error-calculation')}</p>
  }

  if (data.type === 'empty') return null

  const title = data.titleKey ? (data.titleParams ? tf(data.titleKey, data.titleParams) : t(data.titleKey)) : ''

  if (data.type === 'matrix') {
    return (
      <div>
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
        {data.matrix && <MatrixDisplay matrix={data.matrix} />}
        {renderSubItems(data, t, tf)}
      </div>
    )
  }

  if (data.type === 'vector') {
    return (
      <div>
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
        {data.vector && <VectorDisplay vector={data.vector} />}
        {renderSubItems(data, t, tf)}
      </div>
    )
  }

  if (data.type === 'html') {
    return (
      <div>
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
        {data.html && <div dangerouslySetInnerHTML={{ __html: data.html }} />}
        {renderSubItems(data, t, tf)}
      </div>
    )
  }

  if (data.type === 'icon-title') {
    const iconMap: Record<string, string> = { check: '✓', cross: '✗', infinity: '∞' }
    const iconChar = data.icon ? iconMap[data.icon] || '' : ''
    const colorMap: Record<string, string> = { check: 'text-green-600', cross: 'text-destructive', infinity: 'text-yellow-600' }
    const color = data.icon ? colorMap[data.icon] || 'text-foreground' : 'text-foreground'
    return (
      <div className="text-center">
        {title && <h3 className={'text-lg font-semibold mb-3 ' + color}>{iconChar} {title}</h3>}
        {renderSubItems(data, t, tf)}
      </div>
    )
  }

  return (
    <div className="text-center">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      {(data.value || data.valueKey) && <p className={'text-3xl font-bold ' + (data.valueColor || 'text-primary')}>{data.valueKey ? t(data.valueKey) : data.value}</p>}
      {renderSubItems(data, t, tf)}
    </div>
  )
}

interface ResultPanelProps {
  result: StructuredResult | null
  steps: Step[]
}

export function ResultPanel({ result, steps }: ResultPanelProps) {
  const { t } = useI18n()
  const [showSteps, setShowSteps] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          {t('calculation-result')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResultContent data={result} />
        {!result && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calculator className="w-12 h-12 mb-4 opacity-30" />
            <p>{t('no-data')}</p>
            <p className="text-sm mt-1 opacity-60">{t('fraction-hint')}</p>
          </div>
        )}
        {steps.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {t('calculation-process')}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSteps(!showSteps)}>
                <span className="mr-1">{showSteps ? t('hide-steps') : t('show-steps')}</span>
                {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            {showSteps && <StepsTimeline steps={steps} />}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
