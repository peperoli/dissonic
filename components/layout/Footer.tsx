import { Github, MessageSquareQuoteIcon } from 'lucide-react'
import { LanguageSelect } from './LanguageSelect'
import { useTranslations } from 'next-intl'

export const Footer = () => {
  const t = useTranslations('Footer')

  return (
    <footer className="container-fluid mt-auto flex flex-wrap items-center justify-center gap-2 pb-20">
      <LanguageSelect />
      <a
        href="https://github.com/peperoli/dissonic"
        target="_blank"
        aria-label={t('githubRepository')}
        className="btn btn-icon btn-small btn-tertiary"
      >
        <Github className="size-icon" />
      </a>
      <a
        href="mailto:hello@dissonic.ch?subject=Feedback%20Dissonic"
        className="btn btn-small btn-tertiary"
      >
        <MessageSquareQuoteIcon className="size-icon" />
        {t('feedback')}
      </a>
      <div className="text-sm text-slate-300 md:ml-auto">
        made with {'<3 />'} by{' '}
        <a href="https://github.com/peperoli" target="_blank" className="font-bold text-white">
          peperoli
        </a>
      </div>
    </footer>
  )
}
