import { notFound } from "next/navigation"

export default function MaintenancePage() {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (!maintenanceMode) {
    notFound()
  }

  return (
    <main className="container">
      <blockquote className="text-slate-300">
        «Deep, deep in the mine» ~ <cite>Wind Rose</cite>
      </blockquote>
      <h1>Dissonic wird zurzeit gewartet</h1>
      <p>Das dauert nicht lange. Bitte versuche es später noch einmal.</p>
    </main>
  )
}
