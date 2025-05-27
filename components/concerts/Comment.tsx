import { Button } from '../Button'
import { useState, useEffect } from 'react'
import { EditIcon, ReplyIcon, TrashIcon } from 'lucide-react'
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
import { useLocale, useTranslations } from 'next-intl'
import { useAddComment } from '@/hooks/concerts/useAddComment'

export function CommentItem({ comment }: { comment: Comment }) {
  const { data: session } = useSession()
  const { data: profile } = useProfile(comment.user_id)
  const [isEditing, setIsEditing] = useState(false)
  const [modal, setModal] = useModal()
  const [commentId, setCommentId] = useQueryState(
    'commentId',
    parseAsInteger.withOptions({ history: 'push' })
  )
  const [parentId, setParentId] = useState<number | null>(null)
  const t = useTranslations('Comment')
  const locale = useLocale()
  const createdAt = new Date(comment.created_at)
  const isOwnComment = session?.user.id === comment.user_id

  return (
    <>
      <div className={clsx('group relative mt-1', isEditing && 'w-full')}>
        {!!comment.replies?.length && (
          <div className="absolute -bottom-6 top-0 flex w-5 flex-col items-center">
            <div className="h-full w-px bg-slate-500" />
          </div>
        )}
        {!!comment.parent_id && (
          <>
            <div className="absolute -left-7 flex h-5 w-5 flex-col items-center">
              <div className="h-1/2 w-px bg-slate-500" />
            </div>
            <div className="absolute -left-[calc(1rem+2px)] flex size-5 items-center">
              <div className="h-px w-full bg-slate-500" />
            </div>
          </>
        )}
        <div className="mb-1 flex text-sm">
          {profile && <UserItem user={profile} size="sm" />}
          <span className="mr-2 text-slate-300">&bull;</span>
          <span className="text-slate-300">
            {getRelativeTime(comment.edited_at || createdAt, locale)}
            {comment.edited_at && ` ${t('edited')}`}
          </span>
        </div>
        <div className="relative ml-7 flex gap-4 rounded-lg rounded-tl-none bg-slate-850 p-4 pb-6">
          {isEditing ? (
            <EditCommentForm comment={comment} setEdit={setIsEditing} />
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
            {isOwnComment && !isEditing && (
              <div className="focus:not-sr-only group-hover:not-sr-only md:sr-only">
                <Button
                  onClick={() => setIsEditing(true)}
                  contentType="icon"
                  label={t('edit')}
                  size="small"
                  icon={<EditIcon className="size-icon" />}
                />
                <Button
                  onClick={() => {
                    setModal('delete-comment')
                    setCommentId(comment.id)
                  }}
                  contentType="icon"
                  label={t('delete')}
                  size="small"
                  danger
                  icon={<TrashIcon className="size-icon" />}
                />
              </div>
            )}
            {!isEditing && !parentId && (
              <Button
                onClick={() => setParentId(comment.id)}
                label={t('reply')}
                size="small"
                icon={<ReplyIcon className="size-icon" />}
              />
            )}
          </div>
        </div>
        {parentId === comment.id && session?.user.id && (
          <ReplyForm
            concertId={comment.concert_id}
            userId={session.user.id}
            parentId={parentId}
            setParentId={setParentId}
          />
        )}
      </div>
      {!!comment.replies?.length && (
        <div className="grid gap-5">
          {comment.replies.map((reply, index) => (
            <div className="relative" key={reply.id}>
              {index + 1 < comment.replies!.length && (
                <div className="absolute -bottom-7 top-0 flex w-5 flex-col items-center">
                  <div className="h-full w-px bg-slate-500" />
                </div>
              )}
              <div className="ml-7 grid gap-5">
                <CommentItem key={reply.id} comment={reply} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function EditCommentForm({
  comment,
  setEdit,
}: {
  comment: Comment
  setEdit: (value: boolean) => void
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = useForm({ defaultValues: { new_content: comment.content } })
  const { mutate, status } = useEditComment()
  const t = useTranslations('Comment')

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
        <Button label={t('cancel')} size="small" onClick={cancelEdit} />
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          loading={status === 'pending'}
          disabled={!dirtyFields.new_content || watch('new_content') === ''}
          size="small"
        />
      </div>
    </form>
  )
}

function ReplyForm({
  concertId,
  userId,
  parentId,
  setParentId,
}: {
  concertId: number
  userId: string
  parentId: number | null
  setParentId: (id: number | null) => void
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = useForm({ defaultValues: { replyContent: '' } })
  const { mutate, status } = useAddComment()
  const t = useTranslations('Comment')

  async function onSubmit(formData: { replyContent: string }) {
    mutate({
      concert_id: concertId,
      user_id: userId,
      content: formData.replyContent,
      parent_id: parentId,
    })
  }

  useEffect(() => {
    if (status === 'success') {
      setParentId(null)
      reset()
    }
  }, [status])

  function cancelEdit() {
    setParentId(null)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ml-7 mt-6 grid gap-5">
      <TextArea {...register('replyContent')} label={t('comment')} />
      <div className="flex justify-end gap-4">
        <Button label={t('cancel')} size="small" onClick={cancelEdit} />
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          loading={status === 'pending'}
          disabled={!dirtyFields.replyContent || watch('replyContent') === ''}
          size="small"
        />
      </div>
    </form>
  )
}
