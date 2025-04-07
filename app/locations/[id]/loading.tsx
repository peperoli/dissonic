import { ConcertCardSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <main className="container">
      <div className="mb-6 flex items-center">
        <div className="h-5 w-24 animate-pulse rounded-md bg-slate-700" />
      </div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-slate-800 p-6 md:flex-row">
        <div className="aspect-square w-full rounded-xl bg-slate-700 md:size-40" />
        <div className="grid content-start gap-1">
          <div className="h-9 w-32 animate-pulse rounded-md bg-slate-700" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-slate-700" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-slate-700" />
        </div>
      </div>
      <div className="grid gap-4 rounded-2xl bg-slate-800 p-4">
        {Array.from({ length: 25 }).map((_, index) => (
          <ConcertCardSkeleton key={index} />
        ))}
      </div>
    </main>
  )
}
