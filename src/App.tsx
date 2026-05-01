import { useState, useCallback } from 'react'
import { I18nProvider, useI18n } from '@/i18n/I18nContext'
import { useTheme } from '@/hooks/useTheme'
import { useHistory } from '@/hooks/useHistory'
import { Sidebar } from '@/components/Layout/Sidebar'
import { TopBar } from '@/components/Layout/TopBar'
import { Footer } from '@/components/Layout/Footer'
import { Determinant } from '@/components/modules/Determinant'
import { MatrixOperations } from '@/components/modules/MatrixOperations'
import { VectorOperations } from '@/components/modules/VectorOperations'
import { LinearSystem } from '@/components/modules/LinearSystem'
import { VectorGroup } from '@/components/modules/VectorGroup'
import { QuadraticForm } from '@/components/modules/QuadraticForm'
import { HistoryPanel } from '@/components/HistoryPanel'
import type { TabId, HistoryItem } from '@/types'

function AppContent() {
  const { t, toggleLang } = useI18n()
  const { isDark, toggleTheme } = useTheme()
  const { history, addToHistory, removeHistory, clearHistory } = useHistory()
  const [currentTab, setCurrentTab] = useState<TabId>('determinant')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadKey, setLoadKey] = useState(0)
  const [loadPayload, setLoadPayload] = useState<Record<string, unknown> | null>(null)

  const handleTabChange = useCallback((tab: TabId) => {
    setCurrentTab(tab)
    setSidebarOpen(false)
  }, [])

  const handleToggleHistory = useCallback(() => {
    setCurrentTab(prev => prev === 'history' ? 'determinant' : 'history')
  }, [])

  const handleHistoryLoad = useCallback((item: HistoryItem) => {
    const tabMap: Record<string, TabId> = {
      determinant: 'determinant',
      'matrix-operation': 'matrix',
      'vector-operation': 'vector',
      'linear-system': 'linear-system',
      'vector-group': 'vector-group',
      'quadratic-form': 'quadratic-form',
    }
    const targetTab = tabMap[item.type] || 'determinant'
    setLoadPayload({ ...item.input, _historyType: item.type })
    setLoadKey(k => k + 1)
    setCurrentTab(targetTab)
  }, [])

  const sharedProps = {
    onAddHistory: addToHistory as (data: { type: string; input: Record<string, unknown>; result: string }) => void,
    loadKey,
    loadPayload: currentTab !== 'history' ? loadPayload : null,
  }

  const tabClass = (tab: TabId) =>
    currentTab === tab ? '' : 'hidden'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64 transition-all duration-300">
        <TopBar
          title={t('title')}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onToggleLang={toggleLang}
          onToggleHistory={handleToggleHistory}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="container mx-auto px-4 py-6">
          <div className={tabClass('determinant')}><Determinant {...sharedProps} /></div>
          <div className={tabClass('matrix')}><MatrixOperations {...sharedProps} /></div>
          <div className={tabClass('vector')}><VectorOperations {...sharedProps} /></div>
          <div className={tabClass('linear-system')}><LinearSystem {...sharedProps} /></div>
          <div className={tabClass('vector-group')}><VectorGroup {...sharedProps} /></div>
          <div className={tabClass('quadratic-form')}><QuadraticForm {...sharedProps} /></div>
          {currentTab === 'history' && (
            <div className="max-w-lg mx-auto">
              <HistoryPanel history={history} onClear={clearHistory} onRemove={removeHistory} onLoad={handleHistoryLoad} />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}
