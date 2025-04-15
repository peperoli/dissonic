import { Home } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <div className="container">
      <blockquote className="mb-4 border-l-4 pl-4 text-slate-300">
        «The answer is just no»
        <br />~ <cite>Fleshgod Apocalypse</cite>
      </blockquote>
      <h1 className="text-yellow">{t('headline')}</h1>
      <p>{t('description')}</p>
      <br />
      <Link href="/" className="btn btn-tertiary">
        <Home className="size-icon" />
        {t('backToHome')}
      </Link>
    </div>
  )
}
