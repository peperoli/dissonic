import Link from "next/link"
import { usePathname } from "next/navigation"

function NavLink({ link, name }) {
	const pathname = usePathname()
	const isCurrent = pathname === link
	return (
		<Link href={link} className={`relative p-4 md:py-2 rounded-lg font-bold${isCurrent ? ' text-venom' : ' text-slate-300 hover:text-slate-50 hover:bg-slate-800'}`}>
			{name}
			{isCurrent && <span className="absolute block md:hidden bottom-0 left-4 right-4 h-0.5 bg-venom" />}
		</Link>
	)
}

export default function Navigation() {
	return (
		<nav className="sticky flex md:flex-col top-0 md:top-auto md:w-48 flex-none px-4 md:p-8 bg-slate-850 z-20 md:z-0">
			<NavLink link="/" name="Konzerte" />
			<NavLink link="/bands" name="Bands" />
			<NavLink link="/locations" name="Locations" />
		</nav>
	)
}