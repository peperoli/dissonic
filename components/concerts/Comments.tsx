import { Button } from '../Button'
import { useState, FC, useEffect } from 'react'
import dayjs from 'dayjs'
import { Concert, Profile } from '../../types/types'
import { User } from '@supabase/supabase-js'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useComments } from '../../hooks/useComments'
import { useAddComment } from '../../hooks/useAddComment'
import { CommentItem as Comment } from './Comment'
dayjs.extend(relativeTime)
import { useQueryClient } from 'react-query'

interface CommentsProps {
  concert: Concert
  user: User
  profiles: Profile[]
}

export const Comments: FC<CommentsProps> = ({ concert, user, profiles }) => {
  const [value, setValue] = useState('')
  const { data: comments } = useComments(concert.id)
  const addComment = useAddComment({ concert_id: concert.id, user_id: user.id, content: value })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (addComment.status === 'success') {
      queryClient.invalidateQueries(['comments', concert.id])
      setValue('')
    }
  }, [addComment.status])
  return (
    <>
      <h2>Kommentare</h2>
      <form className="grid gap-4 mb-4">
        <div className="form-control">
          <textarea
            id="comment"
            placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
          <label htmlFor="comment">Neuer Kommentar</label>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => addComment.mutate()}
            label="Kommentieren"
            style="primary"
            disabled={value === ''}
          />
        </div>
      </form>
      <div className="grid gap-4">
        {comments && comments.length > 0 ? (
          comments.map(item => (
            <Comment
              key={item.id}
              comment={item}
              profiles={profiles}
              user={user}
              concertId={concert.id}
            />
          ))
        ) : (
          <p className="text-sm text-slate-300">
            Noch keine Kommentare vorhanden. Du kannst den ersten Schritt machen.
          </p>
        )}
      </div>
    </>
  )
}
