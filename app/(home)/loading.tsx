import { ButtonSkeleton, ConcertCardSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <main className="container">
      <div className="mb-6 hidden items-center justify-between md:flex">
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-700" />
        <ButtonSkeleton />
      </div>
      <div className="mb-6 h-48 rounded-2xl bg-slate-800 md:h-72"></div>
      <div className="grid gap-4">
        {Array.from({ length: 25 }).map((_, index) => (
          <ConcertCardSkeleton key={index} />
        ))}
      </div>
    </main>
  )
}
