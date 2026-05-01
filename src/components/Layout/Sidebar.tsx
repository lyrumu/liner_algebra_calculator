import type React from 'react'
import { useI18n } from '@/i18n/I18nContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Grid3X3, Grid3X3Icon, ArrowLeftRight, Superscript, Share2, LineChart
} from 'lucide-react'
import type { TabId } from '@/types'

interface SidebarProps {
  currentTab: TabId
  onTabChange: (tab: TabId) => void
  isOpen: boolean
  onClose: () => void
}

const tabIcons: Record<string, React.ReactNode> = {
  determinant: <Grid3X3 className="w-4 h-4 mr-3" />,
  matrix: <Grid3X3Icon className="w-4 h-4 mr-3" />,
  vector: <ArrowLeftRight className="w-4 h-4 mr-3" />,
  'linear-system': <Superscript className="w-4 h-4 mr-3" />,
  'vector-group': <Share2 className="w-4 h-4 mr-3" />,
  'quadratic-form': <LineChart className="w-4 h-4 mr-3" />,
}

export function Sidebar({ currentTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const { t } = useI18n()
  const tabs: TabId[] = ['determinant', 'matrix', 'vector', 'linear-system', 'vector-group', 'quadratic-form']

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{t('operations')}</h3>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </Button>
        </div>
        <div className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => { onTabChange(tab); if (window.innerWidth < 1024) onClose() }}
              className={cn(
                'flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                currentTab === tab
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              )}
            >
              {tabIcons[tab]}
              <span>{t(tab)}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
