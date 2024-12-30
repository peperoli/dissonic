import { LanguageSelect } from './LanguageSelect'
import { useTranslations } from 'next-intl'

export const Footer = () => {
  const t = useTranslations('Footer')

  return (
    <footer className="container-fluid mt-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-20">
      <LanguageSelect />
      <div className="md:mx-auto flex justify-center flex-wrap gap-x-4 gap-y-2">
        <a
          href="https://github.com/peperoli/dissonic"
          target="_blank"
          className="text-sm hover:underline"
        >
          GitHub
        </a>
        <a
          href="mailto:hello@dissonic.ch?subject=Feedback%20Dissonic"
          className="text-sm hover:underline"
        >
          {t('feedback')}
        </a>
        <a href="/contributions" className="text-sm hover:underline">
          {t('contributions')}
        </a>
        <a href="/global-stats" className="text-sm hover:underline">
          {t('globalStats')}
        </a>
      </div>
      <div className="text-sm text-slate-300">
        made with {'<3 />'} by{' '}
        <a href="https://github.com/peperoli" target="_blank" className="font-bold text-white">
          peperoli
        </a>
      </div>
    </footer>
  )
}
