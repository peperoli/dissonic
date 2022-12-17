import '../styles/globals.scss'
import { Albert_Sans } from '@next/font/google'
const albertSans = Albert_Sans({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="de" className={`${albertSans.className}`}>
        <body className="text-slate-50 bg-slate-850">{children}</body>
      </html>
    </>
  )
}
