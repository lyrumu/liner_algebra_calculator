import { useI18n } from '@/i18n/I18nContext'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Globe, History, Menu } from 'lucide-react'

interface TopBarProps {
  title: string
  isDark: boolean
  onToggleTheme: () => void
  onToggleLang: () => void
  onToggleHistory: () => void
  onToggleSidebar: () => void
}

export function TopBar({ title, isDark, onToggleTheme, onToggleLang, onToggleHistory, onToggleSidebar }: TopBarProps) {
  const { t, lang } = useI18n()

  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onToggleHistory} title={t('history')}>
            <History className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleLang} title={t('language-toggle')}>
            <Globe className="w-5 h-5" />
            <span className="ml-1 text-xs font-bold">{lang === 'zh' ? 'EN' : '中'}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleTheme} title={t('theme-toggle')}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <a
            href="https://github.com/lyrumu/liner_algebra_calculator"
            target="_blank"
            rel="noopener noreferrer"
            title={t('github')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
