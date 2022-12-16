import '../styles/globals.scss'
import { Inter } from '@next/font/google'
const albertSans = Inter({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="de">
        <body className="text-slate-50 bg-slate-850">{children}</body>
      </html>
    </>
  )
}
