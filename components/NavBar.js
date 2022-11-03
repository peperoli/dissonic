import Link from "next/link";
import Logo from "./Logo";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center px-12 py-8">
      <Link href="/">
        <a><Logo /></a>
      </Link>
      <Link href="/login">
        <a className="btn btn-secondary">
          Anmelden
        </a>
      </Link>
    </nav>
  )
}