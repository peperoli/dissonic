'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLinkProps {
	link: string
	name: string
}

const NavLink = ({ link, name }: NavLinkProps) => {
	const pathname = usePathname()
	const isCurrent = pathname === link
	return (
		<Link href={link} className={`relative p-4 md:py-2 rounded-lg font-bold${isCurrent ? ' text-venom' : ' text-white md:text-slate-300 hover:text-white hover:bg-slate-800'}`}>
			{name}
			{isCurrent && <span className="absolute block md:hidden bottom-0 left-4 right-4 h-0.5 bg-venom" />}
		</Link>
	)
}

export function Navigation() {
	return (
		<nav className="sticky flex md:flex-col top-0 md:top-auto md:w-48 flex-none -ml-4 px-4 md:p-8 bg-slate-850 z-20 md:z-0 overflow-auto">
			<NavLink link="/" name="Konzerte" />
			<NavLink link="/bands" name="Bands" />
			<NavLink link="/locations" name="Locations" />
			<NavLink link="/activity" name="Aktivität" />
			<NavLink link="/users" name="Fans" />
		</nav>
	)
}