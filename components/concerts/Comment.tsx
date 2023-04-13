import { Button } from '../Button'
import { useState, FC, useEffect } from 'react'
import dayjs from 'dayjs'
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/20/solid'
import { DeleteCommentModal } from './DeleteCommentModal'
import Image from 'next/image'
import { Comment, Profile } from '../../types/types'
import { User } from '@supabase/supabase-js'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAvatar } from '../../hooks/useAvatar'
import { useEditComment } from '../../hooks/useEditComment'
import { useQueryClient } from 'react-query'
dayjs.extend(relativeTime)

interface CommentProps {
  comment: Comment
  profiles: Profile[]
  user: User
  concertId: string
}

export const CommentItem: FC<CommentProps> = ({ comment, profiles, user, concertId }) => {
  const [edit, setEdit] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [isOpen, setIsOpen] = useState(false)
  const editComment = useEditComment({
    id: comment.id,
    content: content,
    edited_at: new Date().toISOString(),
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (editComment.status === 'success') {
      queryClient.invalidateQueries(['comments', concertId])
      setEdit(false)
    }
  }, [editComment.status])

  const createdAt = comment.created_at && new Date(comment.created_at)
  const profile = profiles?.find(profile => profile.id === comment.user_id)

  const { data: avatarUrl } = useAvatar(profile?.avatar_path)

  function cancelEdit() {
    setEdit(false)
    setContent(comment.content)
  }
  return (
    <>
      <div className="flex gap-4">
        <div className="relative flex-shrink-0 flex justify-center items-center w-8 h-8 rounded-full text-slate-850 bg-blue-300">
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
        <div className={`mt-1.5${edit ? ' w-full' : ''}`}>
          <div className="mb-1 text-sm">
            {profiles?.length > 0 &&
              profiles.find(profile => profile.id === comment.user_id)?.username}
            <span className="text-slate-300">
              {' • '}
              {dayjs(createdAt).fromNow()}
            </span>
          </div>
          <div className="flex gap-4 p-4 rounded-lg rounded-tl-none bg-slate-850">
            {edit ? (
              <form className="grid gap-4 w-full">
                <div className="form-control">
                  <textarea
                    id="comment"
                    placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
                    value={String(content)}
                    onChange={event => setContent(event.target.value)}
                    className="text-sm"
                  />
                  <label htmlFor="comment">Neuer Kommentar</label>
                </div>
                <div className="flex justify-end gap-4">
                  <Button label="Abbrechen" size="small" onClick={cancelEdit} />
                  <Button
                    onClick={() => editComment.mutate()}
                    label="Speichern"
                    style="primary"
                    loading={editComment.status === 'loading'}
                    disabled={content === comment.content}
                    size="small"
                  />
                </div>
              </form>
            ) : (
              <p className="text-sm whitespace-pre-line">
                <>
                  {content}
                  {comment.edited_at ? (
                    <span className="block text-slate-300">(bearbeitet)</span>
                  ) : null}
                </>
              </p>
            )}
            {comment.user_id === user?.id && !edit && (
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() => setEdit(true)}
                  contentType="icon"
                  label="Kommentar bearbeiten"
                  size="small"
                  icon={<PencilIcon className="h-icon" />}
                />
                <Button
                  onClick={() => setIsOpen(true)}
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
      <DeleteCommentModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        commentId={comment.id}
        concertId={concertId}
      />
    </>
  )
}
