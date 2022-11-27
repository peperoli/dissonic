import Link from "next/link";
import Logo from "./Logo";
import supabase from "../../utils/supabase";
import { Menu } from '@headlessui/react'
import { useRouter } from "next/router";
import { ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/20/solid"

export default function NavBar({ profile, setProfile }) {
  const router = useRouter()

  async function signOut() {
    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      setProfile(null)
      router.push('/')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <nav className="flex justify-between items-center p-4 md:px-12 md:py-8">
      <Link href="/">
        <a><Logo /></a>
      </Link>
      {profile ? (
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-3">
            {profile.username}
            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-300">
              <UserIcon className="h-icon text-slate-850" />
            </div>
          </Menu.Button>
          <Menu.Items className="absolute w-40 right-0 mt-1 p-2 rounded-lg bg-slate-600 shadow-lg z-30">
            <Menu.Item>
              {({ active }) => (
                <button onClick={() => router.push(`/users/${profile.username}`)} className={`flex gap-2 w-full px-2 py-1 rounded${active ? ' bg-slate-500' : ''}`}>
                  <UserIcon className="h-icon text-slate-300" />
                  Profil
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex gap-2 w-full px-2 py-1 rounded text-left${active ? ' bg-slate-500' : ''}`}
                  onClick={signOut}
                >
                  <ArrowRightOnRectangleIcon className="h-icon text-slate-300" />
                  Abmelden
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Link href="/login">
          <a className="btn btn-secondary">
            Anmelden
          </a>
        </Link>
      )}
    </nav>
  )
}