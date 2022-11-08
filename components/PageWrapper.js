import Navigation from "./navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./NavBar";
import { useState, useEffect, useRef } from 'react'
import supabase from "../utils/supabase";
import { createContext } from "react";

export const ProfileContext = createContext()
export const UserContext = createContext()

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const user = useRef(null)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()

      user.current = session ? session.user : null

      if (user) {
        const { data: profile, error: profileError, status } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.current.id)
          .single()

        if (profileError) {
          throw profileError
        }

        if (profile && status !== 406) {
          setProfile(profile)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <NavBar profile={profile} setProfile={setProfile} />
      <UserContext.Provider value={user}>
        <ProfileContext.Provider value={profile}>
          <div className="flex">
            <Navigation />
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </ProfileContext.Provider>
      </UserContext.Provider>
    </>
  )
}