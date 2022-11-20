import PageWrapper from "../../components/layout/PageWrapper";
import { useState, useEffect } from "react"
import supabase from "../../utils/supabase";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import EditPasswordForm from "../../components/profile/EditPasswordForm";
import EditProfileForm from "../../components/profile/EditProfileForm";
import GenreChart from "../../components/concerts/GenreChart";

export default function Profile({ initProfile, profiles }) {
  const [user, setUser] = useState(false)
  const [profile, setProfile] = useState(initProfile)
  const [username, setUsername] = useState(initProfile.username)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)
  const [bandsSeen, setBandsSeen] = useState([])

  const uniqueBandsSeen = new Set(bandsSeen.map(item => item.band))
  const concertsSeen = new Set(bandsSeen.map(item => item.concert_id))
  const festivalsSeen = new Set(bandsSeen.filter(item => item.concert.is_festival).map(item => item.concert_id))

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const { data: { user: initUser }, error } = await supabase.auth.getUser()
  
      if (error) throw error

      setUser(initUser)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    async function getStats() {
      try {
        const { data: initBandsSeen, error: bandsSeenError } = await supabase
          .from('j_bands_seen')
          .select('*, concert:concerts(is_festival), band:bands(*, genres(*))')
          .eq('user_id', user.id)

        if (bandsSeenError) {
          throw bandsSeenError
        }

        if (initBandsSeen) {
          setBandsSeen(initBandsSeen)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    if (user) {
      getStats()
    }
  }, [user])
  return (
    <PageWrapper>
      <>
        <main className="p-4 md:p-8 w-full max-w-2xl">
          {profile ? (
            <div>
              <h1>{username}</h1>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="h2 mb-0 text-venom">
                    {uniqueBandsSeen?.size}
                  </p>
                  <h2 className="text-base font-normal mb-0">Bands live erlebt</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="h2 mb-0 text-venom">
                    {concertsSeen?.size}
                  </p>
                  <h2 className="text-base font-normal mb-0">Konzerte besucht</h2>
                </div>
                <div className="p-6 rounded-lg bg-slate-800">
                  <p className="h2 mb-0 text-venom">
                    {festivalsSeen?.size}
                  </p>
                  <h2 className="text-base font-normal mb-0">Festivals besucht</h2>
                </div>
                <div className="col-span-full p-6 rounded-lg bg-slate-800">
                  {user && <GenreChart bands={uniqueBandsSeen} />}
                </div>
              </div>
              <div className="flex gap-3">
                <Button label="Benutzername ändern" onClick={() => setEditUsernameIsOpen(true)} />
                <Button label="Passwort ändern" onClick={() => setEditPassIsOpen(true)} />
              </div>
            </div>
          ) : (
            <div>Bitte melde dich an.</div>
          )}
        </main>
        <Modal isOpen={editUsernameIsOpen} setIsOpen={setEditUsernameIsOpen}>
          <EditProfileForm
            username={username}
            setUsername={setUsername}
            usernames={profiles.map(item => item.username)}
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

export async function getServerSideProps({ params }) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username')

  if (error) {
    console.error(error);
  }

  return {
    props: {
      initProfile: profile,
      profiles
    }
  }
}