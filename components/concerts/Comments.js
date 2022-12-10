import Button from '../Button'
import { useState, useEffect } from 'react'
import supabase from '../../utils/supabase'
import dayjs from 'dayjs'
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/20/solid'
import DeleteCommentDialog from './DeleteCommentDialog'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Comment({ comment, comments, setComments, profiles, user }) {
  const [edit, setEdit] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [isOpen, setIsOpen] = useState(false)

  const createdAt = new Date(comment.created_at)

  async function updateComment(event) {
    event.preventDefault()
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: content, edited_at: new Date().toISOString() })
        .eq('id', comment.id)

      if (error) {
        throw error
      }
      setEdit(false)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <>
      <div className="flex gap-4">
        <div className="flex-shrink-0 flex justify-center items-center w-8 h-8 rounded-full text-slate-850 bg-blue-300">
          <UserIcon className="h-icon" />
        </div>
        <div className={`mt-1.5${edit ? ' w-full' : ''}`}>
          <div className="mb-1 text-sm">
            {profiles?.length > 0 &&
              profiles.find(profile => profile.id === comment.user_id).username}
            <span className="text-slate-300">
              {' • '}
              {dayjs(createdAt).fromNow()}
            </span>
          </div>
          <div className="flex gap-4 p-4 rounded-lg rounded-tl-none bg-slate-850">
            {edit ? (
              <form onSubmit={updateComment} className="grid gap-4 w-full">
                <div className="form-control">
                  <textarea
                    id="comment"
                    placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
                    value={content}
                    onChange={event => setContent(event.target.value)}
                    className="text-sm"
                  />
                  <label htmlFor="comment">Neuer Kommentar</label>
                </div>
                <div className="flex justify-end gap-4">
                  <Button label="Abbrechen" size="small" onClick={() => setEdit(false)} />
                  <Button
                    type="submit"
                    label="Speichern"
                    style="primary"
                    disabled={content === comment.content}
                    size="small"
                  />
                </div>
              </form>
            ) : (
              <p className="text-sm whitespace-pre-line">
                {content}
                {comment.edited_at ? (
                  <span className="block text-slate-300">(bearbeitet)</span>
                ) : null}
              </p>
            )}
            {comment.user_id === user?.id && !edit && (
              <div className="flex gap-2">
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
      <DeleteCommentDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        comment={comment}
        comments={comments}
        setComments={setComments}
      />
    </>
  )
}

export default function Comments({ concert, user, profiles }) {
  const [value, setValue] = useState('')
  const [comments, setComments] = useState([])

  function handleChange(event) {
    setValue(event.target.value)
  }

  useEffect(() => {
    async function fetchComments() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('concert_id', concert.id)

        if (error) {
          throw error
        }
        setComments(data)
      } catch (error) {
        alert(error.message)
      }
    }
    fetchComments()
  }, [])

  async function createComment(event) {
    event.preventDefault()

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          concert_id: concert.id,
          user_id: user.id,
          content: value,
        })
        .single()
        .select()

      if (error) {
        throw error
      }

      setComments([...comments, data])
      setValue('')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <>
      <h2>Kommentare</h2>
      <form onSubmit={createComment} className="grid gap-4 mb-4">
        <div className="form-control">
          <textarea
            id="comment"
            placeholder="Was ist dir von diesem Konzert in Erinnerung geblieben?"
            value={value}
            onChange={handleChange}
          />
          <label htmlFor="comment">Neuer Kommentar</label>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit" label="Kommentieren" style="primary" disabled={value === ''} />
        </div>
      </form>
      <div className="grid gap-4">
        {comments.length > 0 ? (
          comments.map(item => (
            <Comment
              key={item.id}
              comment={item}
              comments={comments}
              setComments={setComments}
              profiles={profiles}
              user={user}
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
