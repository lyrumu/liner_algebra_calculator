import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface VectorInputProps {
  id: string
  length: number
  values: string[]
  onChange: (values: string[]) => void
  onEnterLast?: () => void
  nextFocusQuery?: string
}

export function VectorInput({ id, length, values, onChange, onEnterLast, nextFocusQuery }: VectorInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const tryFocusNext = useCallback(() => {
    if (nextFocusQuery) {
      const el = document.querySelector(nextFocusQuery) as HTMLElement | null
      if (el) { el.focus(); return true }
    }
    onEnterLast?.()
    return false
  }, [nextFocusQuery, onEnterLast])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (idx + 1 < length) inputRefs.current[idx + 1]?.focus()
      else tryFocusNext()
    }
  }, [length, tryFocusNext])

  const updateValue = useCallback((idx: number, val: string) => {
    const newVals = [...values]
    newVals[idx] = val
    onChange(newVals)
  }, [values, onChange])

  const clearAll = useCallback(() => {
    onChange(Array(length).fill(''))
  }, [length, onChange])

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button type="button" onClick={clearAll}
        className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors px-1" title="清空">
        <X className="w-3 h-3" />
      </button>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length }, (_, i) => (
          <Input
            key={`${id}-${i}`}
            ref={el => { inputRefs.current[i] = el }}
            id={`${id}-${i}`}
            value={values[i] ?? ''}
            onChange={e => updateValue(i, e.target.value)}
            onKeyDown={e => handleKeyDown(e, i)}
            className="w-16 h-9 text-center font-mono text-sm"
          />
        ))}
      </div>
    </div>
  )
}
