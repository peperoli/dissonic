import { ButtonSkeleton } from "@/components/shared/skeleton"

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-4">
      <div className="grid size-12 flex-none animate-pulse place-content-center rounded-lg bg-slate-700" />
      <div className="h-5 w-48 flex-1 animate-pulse rounded-md bg-slate-700" />
      <div className="h-5 w-32 flex-1 animate-pulse rounded-md bg-slate-700" />
      <div className="h-4 w-32 flex-1 animate-pulse rounded-md bg-slate-700" />
    </div>
  )
}

export default function Loading() {
  return (
    <main className="container-fluid">
      <div className="mb-6 hidden items-center justify-between md:flex">
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-700" />
        <ButtonSkeleton />
      </div>
      <div className="grid rounded-2xl bg-slate-800 p-4">
        {Array.from({ length: 25 }).map((_, index) => (
          <RowSkeleton key={index} />
        ))}
      </div>
    </main>
  )
}
