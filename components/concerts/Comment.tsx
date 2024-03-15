import { Button } from '../Button'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { Comment } from '../../types/types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAvatar } from '../../hooks/profiles/useAvatar'
import { useEditComment } from '../../hooks/concerts/useEditComment'
import { useQueryClient } from '@tanstack/react-query'
import { ReactionControl } from './ReactionControl'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextArea } from '../forms/TextArea'
import { useProfile } from '../../hooks/profiles/useProfile'
import { useSession } from '../../hooks/auth/useSession'
import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs'
import { modalPaths } from '../shared/ModalProvider'
dayjs.extend(relativeTime)

type EditCommentFormProps = {
  comment: Comment
  setEdit: (value: boolean) => void
}

const EditCommentForm = ({ comment, setEdit }: EditCommentFormProps) => {
  const { concert } = useConcertContext()
  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = useForm({ defaultValues: { new_content: JSON.stringify(comment.content) } })
  const { mutate, status } = useEditComment()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<{ new_content: string }> = async formData => {
    mutate({
      id: comment.id,
      content: formData.new_content,
      edited_at: new Date().toISOString(),
    })
  }

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(['comments', concert.id])
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
          loading={status === 'loading'}
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
  const [_, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const [__, setCommentId] = useQueryState(
    'commentId',
    parseAsInteger.withOptions({ history: 'push' })
  )
  const createdAt = comment.created_at && new Date(comment.created_at)
  const { data: avatar } = useAvatar(profile?.avatar_path)
  return (
    <div className="group flex gap-4">
      <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue text-slate-850">
        {avatar?.url ? (
          <Image
            src={avatar?.url}
            alt="Profile picture"
            fill={true}
            className="rounded-full object-cover"
          />
        ) : (
          <UserIcon className="h-icon" />
        )}
      </div>
      <div className={`mt-1.5${edit ? ' w-full' : ''}`}>
        <div className="mb-1 text-sm">
          {profile?.username}
          <span className="text-slate-300">
            {' • '}
            {dayjs(createdAt).fromNow()}
          </span>
        </div>
        <div className="relative flex gap-4 rounded-lg rounded-tl-none bg-slate-850 p-4 pb-6">
          {edit ? (
            <EditCommentForm comment={comment} setEdit={setEdit} />
          ) : (
            <p className="whitespace-pre-line text-sm">
              <>
                {comment.content}
                {comment.edited_at ? (
                  <span className="block text-slate-300">(bearbeitet)</span>
                ) : null}
              </>
            </p>
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
                  icon={<PencilIcon className="h-icon" />}
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
                  icon={<TrashIcon className="h-icon" />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
