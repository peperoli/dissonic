import { Button } from '../Button'
import { useProfile } from '@/hooks/profiles/useProfile'
import { useSession } from '@/hooks/auth/useSession'
import { useQueryState } from 'nuqs'
import { useDeleteFriend } from '@/hooks/profiles/useDeleteFriend'
import { useParams } from 'next/navigation'

type RemoveFriendFormProps = {
  close: () => void
}

export const RemoveFriendForm = ({ close }: RemoveFriendFormProps) => {
  const [friendId] = useQueryState('friendId')
  const { username } = useParams<{ username?: string }>()
  const { data: profile } = useProfile(friendId, username)
  const { data: session } = useSession()
  const { mutate, isPending } = useDeleteFriend()

  async function onSubmit() {
    if (profile && session?.user) {
      mutate({ friendId: profile.id, userId: session.user.id })
    }
  }

  return (
    <div>
      <p>
        Willst du <strong>{profile?.username}</strong> wirklich als Freund*in
        entfernen?
      </p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Entfernen"
          onClick={onSubmit}
          appearance="primary"
          loading={isPending}
          danger
        />
      </div>
    </div>
  )
}
