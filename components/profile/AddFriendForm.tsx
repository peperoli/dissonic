import { Button } from '../Button'
import { useEffect } from 'react'
import { useAddFriend } from '../../hooks/profiles/useAddFriend'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/hooks/auth/useSession'
import { usePathname } from 'next/navigation'
import { useProfile } from '@/hooks/profiles/useProfile'

type AddFriendFormProps = {
  close: () => void
}

export const AddFriendForm = ({ close }: AddFriendFormProps) => {
  const pathname = usePathname()
  const username = pathname.split('/').pop()
  const { data: profile } = useProfile(null, username)
  const { mutate, status } = useAddFriend()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  async function addFriend() {
    if (session && profile) {
      mutate({ sender_id: session.user.id, receiver_id: profile?.id })
    }
  }

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(['friends', session?.user.id])
      queryClient.invalidateQueries(['friends', profile?.id])
      close()
    }
  }, [status])
  return (
    <>
      <h2>Freund hizufügen</h2>
      <p>
        Willst du <span className="italic">{profile?.username || 'diesem Fan'}</span> eine Freundschaftsanfrage
        schicken?
      </p>
      <div className="flex gap-4 pt-5 [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Hinzufügen"
          onClick={addFriend}
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
    </>
  )
}
