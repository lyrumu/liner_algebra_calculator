import { Fraction } from '@/lib/fraction'
import { formatNumber } from '@/lib/utils'

interface MatrixDisplayProps {
  matrix: (Fraction | number)[][]
  className?: string
}

export function MatrixDisplay({ matrix, className }: MatrixDisplayProps) {
  if (!matrix.length) return null
  const cols = matrix[0].length
  return (
    <div className={`inline-block ${className ?? ''}`}>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="min-w-[3rem] h-8 flex items-center justify-center px-2 text-sm font-mono rounded bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
            >
              {formatNumber(cell)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
