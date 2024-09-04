'use client'

import { Button } from '@/components/Button'
import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GlobalError() {
  const { refresh } = useRouter()
  return (
    <html>
      <body>
        <div className="container">
          <blockquote className="text-slate-300">
            «I tried so hard and got so far
            <br />
            But in the end, it doesn&apos;t even matter» ~ <cite>Linkin Park</cite>
          </blockquote>
          <h1>Fehler</h1>
          <p>
            Es ist ein Applikations-Fehler aufgetreten. Bitte versuche es später erneut oder suche
            professionelle Hilfe.
          </p>
          <br />
          <Button
            onClick={refresh}
            label="Seite neu laden"
            icon={<RotateCw className="size-icon" />}
            appearance="tertiary"
          />
        </div>
      </body>
    </html>
  )
}
