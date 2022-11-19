import Navigation from "./Navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./NavBar";
import { useState, useEffect, useRef } from 'react'
import supabase from "../../utils/supabase";
import { createContext } from "react";

export const ProfileContext = createContext()
export const UserContext = createContext()

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()

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
      <div className="md:flex">
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
    </>
  )
}