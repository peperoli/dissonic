import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const cookieStore = await cookies()
  const viewString = cookieStore.get('view')?.value
  const concertsView = viewString?.split(',')[0]

  if (concertsView === 'future') {
    redirect('/concerts/future')
  }

  redirect('/concerts/past')
}
