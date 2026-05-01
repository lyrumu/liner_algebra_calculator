import { useEffect } from 'react'
import { useI18n } from '@/i18n/I18nContext'

export function Footer() {
  const { t } = useI18n()

  useEffect(() => {
    const existing = document.querySelector('script[src*="busuanzi"]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <footer className="bg-card border-t border-border py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">{t('footer-title')}</p>
        <div className="mt-3 text-xs text-muted-foreground/60">
          <span id="busuanzi_container_site_pv">
            {t('total-visits')} <span id="busuanzi_value_site_pv" /> {t('times')}
          </span>
          <span className="mx-2">·</span>
          <span id="busuanzi_container_site_uv">
            {t('visitors')} <span id="busuanzi_value_site_uv" /> {t('people')}
          </span>
        </div>
      </div>
    </footer>
  )
}
