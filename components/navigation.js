import Link from "next/link"

function NavLink({ link, name }) {
    return (
        <Link href={link}>
            <a className="btn btn-link justify-start">{name}</a>
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