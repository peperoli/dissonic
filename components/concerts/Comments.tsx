import { Button } from '../Button'
import { useEffect } from 'react'
import { Comment } from '../../types/types'
import { useComments } from '../../hooks/concerts/useComments'
import { useAddComment } from '../../hooks/concerts/useAddComment'
import { CommentItem } from './Comment'
import { useQueryClient } from '@tanstack/react-query'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextArea } from '../forms/TextArea'
import { useSession } from '../../hooks/auth/useSession'
import { usePathname, useRouter } from 'next/navigation'

export const Comments = () => {
  const { concert } = useConcertContext()
  const { data: session } = useSession()
  const { register, watch, handleSubmit, reset } = useForm<Comment>()
  const { data: comments } = useComments(concert.id)
  const { mutate, status } = useAddComment()
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const pathname = usePathname()

  const onSubmit: SubmitHandler<Comment> = async formData => {
    if (!session) return
    mutate({ concert_id: concert.id, user_id: session?.user.id, content: formData.content })
  }

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['comments', concert.id] })
      reset()
    }
  }, [status])
  return (
    <>
      <h2>Kommentare</h2>
      {session ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4 grid gap-4">
            <TextArea
              {...register('content')}
              label="Neuer Kommentar"
              placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                label="Kommentieren"
                appearance="primary"
                disabled={watch('content') === ''}
                loading={status === 'pending'}
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
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-300">
            Melde dich an, um Kommentare zu schreiben und lesen.
          </p>
          <Button
            label="Anmelden"
            onClick={() => push(`/login?redirect=${pathname}`)}
            appearance="primary"
          />
        </>
      )}
    </>
  )
}
