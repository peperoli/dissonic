import Link from "next/link"
import { useRouter } from "next/router"

function NavLink({ link, name }) {
	const router = useRouter()
	return (
		<Link href={link}>
			<a className={`px-4 py-2 rounded-lg font-bold${router.pathname === link ? ' text-venom' : ' text-slate-300 hover:text-slate-50 hover:bg-slate-800'}`}>{name}</a>
		</Link>
	)
}

export default function Navigation() {
	return (
		<nav className="flex flex-col w-48 flex-none p-8">
			<NavLink link="/" name="Konzerte" />
			<NavLink link="/bands" name="Bands" />
			<NavLink link="/locations" name="Locations" />
		</nav>
	)
}