import Link from "next/link"

function NavLink({ link, name }) {
    return (
        <Link href={link}>
            <a className="btn btn-link">{name}</a>
        </Link>
    )
}

export default function Navigation() {
    return (
        <nav className="flex flex-col p-8">
            <NavLink link="/" name="Konzerte" />
            <NavLink link="/bands" name="Bands" />
        </nav>
    )
}