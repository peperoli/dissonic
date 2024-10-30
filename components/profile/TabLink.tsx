'use client'

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  return (
    <Link href={href} className="relative rounded p-3" key={href}>
      {label}
      <span
        className={clsx(
          'absolute bottom-0 left-0 h-1 w-full rounded-t',
          pathname === href ? 'bg-venom' : 'bg-transparent'
        )}
      />
    </Link>
  )
}
