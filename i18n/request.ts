import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const headersList = await headers()
  const cookieStore = await cookies()
  const languages = ['en', 'de']
  const defaultLocale = 'de-CH'
  const languageHeader = headersList.get('Accept-Language')
  const matchingLanguage = languageHeader
    ?.split(',')
    .find(language => languages.includes(language.slice(0, 2)))
  const localeCookie = cookieStore.get('locale')
  const locale =
    localeCookie?.value || (matchingLanguage && `${matchingLanguage}-CH`) || defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
