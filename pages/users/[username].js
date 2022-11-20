import PageWrapper from "../../components/layout/PageWrapper";
import { useState } from "react"
import supabase from "../../utils/supabase";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import EditPasswordForm from "../../components/profile/EditPasswordForm";
import EditProfileForm from "../../components/profile/EditProfileForm";
import GenreChart from "../../components/concerts/GenreChart";

export default function Profile({ profile, profiles, bandsSeen }) {
  const [username, setUsername] = useState(profile.username)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)

  const uniqueBandsSeen = new Set(bandsSeen.map(item => item.band))
  const concertsSeen = new Set(bandsSeen.map(item => item.concert_id))
  const festivalsSeen = new Set(bandsSeen.filter(item => item.concert.is_festival).map(item => item.concert_id))
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
                  <GenreChart bands={uniqueBandsSeen} />
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

  const { data: profiles } = await supabase
    .from('profiles')
    .select('username')

  const { data: bandsSeen } = await supabase
    .from('j_bands_seen')
    .select('*, concert:concerts(is_festival), band:bands(*, genres(*))')
    .eq('user_id', profile.id)

  return {
    props: {
      profile,
      bandsSeen,
      profiles
    }
  }
}