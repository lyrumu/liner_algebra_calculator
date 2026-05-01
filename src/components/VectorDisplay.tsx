import { Fraction } from '@/lib/fraction'
import { formatNumber } from '@/lib/utils'

interface VectorDisplayProps {
  vector: (Fraction | number)[]
  className?: string
}

export function VectorDisplay({ vector, className }: VectorDisplayProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ''}`}>
      {vector.map((v, i) => (
        <div
          key={i}
          className="min-w-[3rem] h-8 flex items-center justify-center px-2 text-sm font-mono rounded bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
        >
          {formatNumber(v)}
        </div>
      ))}
    </div>
  )
}
