"use client"

import PageWrapper from "../layout/PageWrapper";
import { useState, useEffect } from "react"
import supabase from "../../utils/supabase"
import { Button } from "../Button";
import Modal from "../Modal";
import EditPasswordForm from "./EditPasswordForm";
import EditProfileForm from "./EditProfileForm";
import GenreChart from "../concerts/GenreChart";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/20/solid";
import { TopBands } from './TopBands'

export default function ProfilePage({ profile, bandsSeen }) {
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const uniqueBandsSeen = new Set(bandsSeen.map(item => item.band))
  const concertsSeen = new Set(bandsSeen.map(item => item.concert_id))
  const festivalsSeen = new Set(bandsSeen.filter(item => item.concert.is_festival).map(item => item.concert_id))
  
  useEffect(() => {
    async function getUser() {
      const { data: { user: initUser } } = await supabase.auth.getUser()
      setUser(initUser)
    }

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

    getUser()

    if (profile.avatar_path) {
      downloadAvatar()
    }
  }, [profile])
  return (
    <PageWrapper>
      <>
        <main className="p-4 md:p-8 w-full max-w-2xl">
          {profile ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex justify-center items-center w-16 h-16 rounded-full text-lg text-slate-850 bg-blue-300">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile picture"
                      fill={true}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-icon" />
                  )}
                </div>
                <h1 className="mb-0">{profile.username}</h1>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">
                    {uniqueBandsSeen?.size}
                  </p>
                  <h2 className="text-sm font-normal mb-0">Bands live erlebt</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">
                    {concertsSeen?.size}
                  </p>
                  <h2 className="text-sm font-normal mb-0">Konzerte besucht</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="mb-0 text-2xl text-venom">
                    {festivalsSeen?.size}
                  </p>
                  <h2 className="text-sm font-normal mb-0">Festivals besucht</h2>
                </div>
                <div className="col-span-full p-6 rounded-lg bg-slate-800">
                  <TopBands bands={bandsSeen.map(item => item.band)} />
                </div>
                <div className="col-span-full p-6 rounded-lg bg-slate-800">
                  <GenreChart bands={uniqueBandsSeen} />
                </div>
              </div>
              {user && user?.id === profile.id && (
                <div className="flex gap-3">
                  <Button label="Profil bearbeiten" onClick={() => setEditUsernameIsOpen(true)} />
                  <Button label="Passwort ändern" onClick={() => setEditPassIsOpen(true)} />
                </div>
              )}
            </div>
          ) : (
            <div>Bitte melde dich an.</div>
          )}
        </main>
        <Modal isOpen={editUsernameIsOpen} setIsOpen={setEditUsernameIsOpen}>
          <EditProfileForm
            username={profile.username}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            setIsOpen={setEditUsernameIsOpen}
          />
        </Modal>
        <Modal isOpen={editPassIsOpen} setIsOpen={setEditPassIsOpen}>
          <EditPasswordForm
            setIsOpen={setEditPassIsOpen}
          />
        </Modal>
      </>
    </PageWrapper>
  )
}