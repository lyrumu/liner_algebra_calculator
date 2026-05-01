import { useState, useCallback, useEffect } from 'react'
import type { HistoryItem } from '@/types'

const STORAGE_KEY = 'linearAlgebraHistory'
const MAX_ITEMS = 200

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)) } catch { }
  }, [history])

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const inputStr = JSON.stringify(item.input)
    setHistory(prev => {
      const existingIdx = prev.findIndex(h => h.type === item.type && JSON.stringify(h.input) === inputStr)
      if (existingIdx >= 0) {
        const updated = [...prev]
        const entry = updated.splice(existingIdx, 1)[0]
        entry.result = item.result
        entry.timestamp = new Date().toLocaleString(navigator.language)
        return [entry, ...updated]
      }
      const newItem: HistoryItem = {
        ...item,
        id: Date.now(),
        timestamp: new Date().toLocaleString(navigator.language)
      }
      return [newItem, ...prev].slice(0, MAX_ITEMS)
    })
  }, [])

  const removeHistory = useCallback((id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addToHistory, removeHistory, clearHistory }
}
