import { CheckIcon } from 'lucide-react'
import { Form } from './Form'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function SignupPage() {
  const t = await getTranslations('SignupPage')

  return (
    <main className="container-sm">
      <section className="rounded-2xl bg-radial-gradient from-venom/50 p-8">
        <h1>
          {t.rich('welcome', {
            span: chunk => <span className="text-[1.5em]">{chunk}</span>,
          })}
        </h1>
        <p className="mb-2">{t('aDissonicAccountGivesYouTheFollowingFeatures')}</p>
        <ul className="mb-6">
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('trackBandsAndConcertsYouHaveExperiencedLive')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('seeYourConcertHistoryAndStatistics')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('commentOnConcertsAndReactToComments')}
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon className="size-icon flex-shrink-0 text-slate-300" />
            {t('contributeConcertsBandsAndLocations')}
          </li>
        </ul>
      </section>
      <Form />
      <h2 className="mt-10">{t('doYouHavAnAccountAlready')}</h2>
      <Link href="/login" className="btn btn-secondary">
        {t('login')}
      </Link>
    </main>
  )
}
