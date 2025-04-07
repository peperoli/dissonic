export function ButtonSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-venom px-4 py-3">
      <div className="h-4 w-24 animate-pulse rounded-md bg-slate-700" />
    </div>
  )
}

export function ConcertCardSkeleton() {
  return (
    <div className="group flex gap-4 rounded-2xl bg-slate-800 p-4">
      <div className="grid size-22 flex-none animate-pulse place-content-center rounded-lg bg-slate-700" />
      <div className="grid content-start gap-1">
        <div className="h-5 w-48 animate-pulse rounded-md bg-slate-700" />
        <div className="h-4 w-32 animate-pulse rounded-md bg-slate-700" />
      </div>
    </div>
  )
}