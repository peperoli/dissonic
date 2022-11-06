import Navigation from "./navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./NavBar";
import { useState, useEffect } from 'react'
import supabase from "../utils/supabase";
import { createContext } from "react";

export const ProfileContext = createContext()

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const session = supabase.auth.session()

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      const user = supabase.auth.user()

      if (user) {
        const { data: profile, error: profileError, status } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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
    </>
  )
}