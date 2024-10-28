import { Button } from '../Button'
import { useState, useEffect } from 'react'
import { EditIcon, TrashIcon } from 'lucide-react'
import { Comment } from '../../types/types'
import { useEditComment } from '../../hooks/concerts/useEditComment'
import { ReactionControl } from './ReactionControl'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextArea } from '../forms/TextArea'
import { useProfile } from '../../hooks/profiles/useProfile'
import { useSession } from '../../hooks/auth/useSession'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useModal } from '../shared/ModalProvider'
import { getRelativeTime } from '@/lib/relativeTime'
import clsx from 'clsx'
import { UserItem } from '../shared/UserItem'
import Link from 'next/link'

type EditCommentFormProps = {
  comment: Comment
  setEdit: (value: boolean) => void
}

const EditCommentForm = ({ comment, setEdit }: EditCommentFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = useForm({ defaultValues: { new_content: comment.content } })
  const { mutate, status } = useEditComment()

  const onSubmit: SubmitHandler<{ new_content: string | null }> = async formData => {
    mutate({
      id: comment.id,
      content: formData.new_content,
      edited_at: new Date().toISOString(),
    })
  }

  useEffect(() => {
    if (status === 'success') {
      setEdit(false)
      reset()
    }
  }, [status])

  function cancelEdit() {
    setEdit(false)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
      <TextArea
        {...register('new_content')}
        label="Neuer Kommentar"
        placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
      />
      <div className="flex justify-end gap-4">
        <Button label="Abbrechen" size="small" onClick={cancelEdit} />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'pending'}
          disabled={!dirtyFields.new_content || watch('new_content') === ''}
          size="small"
        />
      </div>
    </form>
  )
}

interface CommentItemProps {
  comment: Comment
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { data: session } = useSession()
  const { data: profile } = useProfile(comment.user_id)
  const [edit, setEdit] = useState(false)
  const [_, setModal] = useModal()
  const [__, setCommentId] = useQueryState(
    'commentId',
    parseAsInteger.withOptions({ history: 'push' })
  )
  const createdAt = new Date(comment.created_at)
  return (
    <div className="group flex gap-2">
      <div>{profile && <UserItem user={profile} usernameIsHidden size="sm" />}</div>
      <div className={clsx('mt-1', edit && 'w-full')}>
        <div className="mb-1 text-sm">
          <Link href={`/users/${profile?.username}`} className="hover:underline">
            {profile?.username}
          </Link>
          <span className="text-slate-300">
            {' • '}
            {getRelativeTime(comment.edited_at || createdAt, 'de-CH')}
            {comment.edited_at && ' bearbeitet'}
          </span>
        </div>
        <div className="relative flex gap-4 rounded-lg rounded-tl-none bg-slate-850 p-4 pb-6">
          {edit ? (
            <EditCommentForm comment={comment} setEdit={setEdit} />
          ) : (
            <p className="whitespace-pre-line break-words text-sm">{comment.content}</p>
          )}
          <div className="absolute -bottom-4 flex rounded-lg bg-slate-700">
            {comment.reactions && session && (
              <ReactionControl
                comment={comment}
                reactions={comment.reactions}
                user={session.user}
              />
            )}
            {comment.user_id === session?.user.id && !edit && (
              <div className="hidden group-hover:flex">
                <Button
                  onClick={() => setEdit(true)}
                  contentType="icon"
                  label="Kommentar bearbeiten"
                  size="small"
                  icon={<EditIcon className="size-icon" />}
                />
                <Button
                  onClick={() => {
                    setModal('delete-comment')
                    setCommentId(comment.id)
                  }}
                  contentType="icon"
                  label="Kommentar löschen"
                  size="small"
                  danger
                  icon={<TrashIcon className="size-icon" />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
