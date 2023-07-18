import { Button } from '../Button'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { Comment } from '../../types/types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useComments } from '../../hooks/useComments'
import { useAddComment } from '../../hooks/useAddComment'
import { CommentItem } from './Comment'
import { useQueryClient } from '@tanstack/react-query'
import { useConcertContext } from '../../hooks/useConcertContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextArea } from '../forms/TextArea'
import { useUser } from '../../hooks/useUser'
dayjs.extend(relativeTime)

export const Comments = () => {
  const { concert } = useConcertContext()
  const { data: user } = useUser()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Comment>()
  const { data: comments } = useComments(concert.id)
  const { mutate, status } = useAddComment()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<Comment> = async formData => {
    if (!user) return
    mutate({ concert_id: concert.id, user_id: user?.id, content: formData.content })
  }

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(['comments', concert.id])
      reset()
    }
  }, [status])
  return (
    <>
      <h2>Kommentare</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mb-4">
        <TextArea
          {...register('content')}
          label="Neuer Kommentar"
          placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            label="Kommentieren"
            style="primary"
            disabled={watch('content') === ''}
            loading={status === 'loading'}
          />
        </div>
      </form>
      <div className="grid gap-4">
        {comments && comments.length > 0 ? (
          comments.map(item => <CommentItem key={item.id} comment={item} />)
        ) : (
          <p className="text-sm text-slate-300">
            Noch keine Kommentare vorhanden. Du kannst den ersten Schritt machen.
          </p>
        )}
      </div>
    </>
  )
}
