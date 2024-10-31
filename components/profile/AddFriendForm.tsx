import { useSession } from '@/hooks/auth/useSession'
import { useProfile } from '@/hooks/profiles/useProfile'
import { useParams } from 'next/navigation'
import { useAddFriend } from '../../hooks/profiles/useAddFriend'
import { Button } from '../Button'

type AddFriendFormProps = {
  close: () => void
}

export const AddFriendForm = ({ close }: AddFriendFormProps) => {
  const { username } = useParams<{ username?: string }>()
  const { data: profile } = useProfile(null, username)
  const { mutate, status } = useAddFriend()
  const { data: session } = useSession()

  async function addFriend() {
    if (session && profile) {
      mutate({ sender_id: session.user.id, receiver_id: profile?.id })
    }
  }

  return (
    <div>
      <p>
        Willst du <strong>{profile?.username || 'diesem Fan'}</strong> eine
        Freundschaftsanfrage schicken?
      </p>
      <div className="flex gap-4 pt-5 [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Hinzufügen"
          onClick={addFriend}
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
    </div>
  )
}
