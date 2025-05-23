import { setViewPreference } from '@/actions/preferences'
import { NavItem } from '@/components/layout/NavItem'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export default async function ConcertsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('ConcertsLayout')
  const cookieStore = await cookies()
  const view = {
    concerts_view: cookieStore.get('view')?.value.split(',')[0],
    user_view: cookieStore.get('view')?.value.split(',')[1],
  }

  function handleClick(value: string) {
    setViewPreference({
      ...view,
      concerts_view: value,
    })
  }
  return (
    <main>
      <nav className="flex bg-slate-850 px-4">
        <NavItem link="/concerts/past" name={t('past')} onClick={() => handleClick('past')} />
        <NavItem link="/concerts/future" name={t('future')} onClick={() => handleClick('future')} />
      </nav>
      {children}
    </main>
  )
}
