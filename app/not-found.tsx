import { Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container">
      <blockquote className="text-slate-300">
        «The answer is just no» ~ <cite>Fleshgod Apocalypse</cite>
      </blockquote>
      <h1>Seite nicht gefunden</h1>
      <p>
        Die angeforderte Ressource konnte nicht gefunden werden. Möglicherweise wurde Sie gelöscht
        oder verschoben.
      </p>
      <br />
      <Link href="/" className="btn btn-tertiary">
        <Home className="size-icon" />
        Zurück zur Übersicht
      </Link>
    </div>
  )
}
