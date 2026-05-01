import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface MatrixInputProps {
  id: string
  rows: number
  cols: number
  values: string[][]
  onChange: (values: string[][]) => void
  onEnterLast?: () => void
  nextFocusQuery?: string
}

export function MatrixInput({ id, rows, cols, values, onChange, onEnterLast, nextFocusQuery }: MatrixInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([])

  const tryFocusNext = useCallback(() => {
    if (nextFocusQuery) {
      const el = document.querySelector(nextFocusQuery) as HTMLElement | null
      if (el) { el.focus(); return true }
    }
    onEnterLast?.()
    return false
  }, [nextFocusQuery, onEnterLast])

  const focusNext = useCallback((r: number, c: number) => {
    if (c + 1 < cols) inputRefs.current[r]?.[c + 1]?.focus()
    else if (r + 1 < rows) inputRefs.current[r + 1]?.[0]?.focus()
    else tryFocusNext()
  }, [cols, rows, tryFocusNext])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (c + 1 < cols) focusNext(r, c)
      else if (r + 1 < rows) inputRefs.current[r + 1]?.[0]?.focus()
      else tryFocusNext()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); focusNext(r, c)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (r + 1 < rows) inputRefs.current[r + 1]?.[c]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (r > 0) inputRefs.current[r - 1]?.[c]?.focus()
    }
  }, [cols, rows, focusNext, tryFocusNext])

  const updateValue = useCallback((r: number, c: number, val: string) => {
    const newVals = values.map(row => [...row])
    newVals[r][c] = val
    onChange(newVals)
  }, [values, onChange])

  const clearAll = useCallback(() => {
    onChange(Array.from({ length: rows }, () => Array(cols).fill('')))
  }, [rows, cols, onChange])

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button type="button" onClick={clearAll}
        className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors px-1" title="清空">
        <X className="w-3 h-3" />
      </button>
      <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: cols }, (_, j) => (
            <Input
              key={`${id}-${i}-${j}`}
              ref={el => { inputRefs.current[i] ??= []; inputRefs.current[i][j] = el }}
              id={`${id}-${i}-${j}`}
              value={values[i]?.[j] ?? ''}
              onChange={e => updateValue(i, j, e.target.value)}
              onKeyDown={e => handleKeyDown(e, i, j)}
              className="w-16 h-9 text-center font-mono text-sm"
            />
          ))
        )}
      </div>
    </div>
  )
}
