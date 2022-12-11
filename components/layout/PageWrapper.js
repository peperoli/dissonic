import Navigation from "./Navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./NavBar";
import { useState, useEffect } from 'react'
import supabase from "../../utils/supabase";

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
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

    getProfile()
  }, [])

  useEffect(() => {
    async function downloadAvatar() {
      try {
        const {data, error} = await supabase.storage.from('avatars').download(profile.avatar_path)
    
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.error(error.message)
      }
    }

    if (profile?.avatar_path) {
      downloadAvatar()
    }
  }, [profile])
  return (
    <>
      <NavBar profile={profile} setProfile={setProfile} avatarUrl={avatarUrl} />
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