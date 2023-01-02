import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'
import React, { FC } from 'react'
import { Comment } from '../../models/types'

interface IDeleteCommentModal {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  comment: Comment
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
}

export const DeleteCommentModal: FC<IDeleteCommentModal> = ({
  isOpen,
  setIsOpen,
  comment,
  comments,
  setComments,
}) => {
  async function deleteComment() {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', comment.id)

      if (error) {
        throw error
      }

      setComments(comments.filter(item => item.id !== comment.id))
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Oops')
        console.error(error)
      }
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Kommentar löschen</h2>
      <p>Willst du diesen Kommentar wirklich unwiderruflich löschen?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Löschen" onClick={deleteComment} style="primary" danger />
      </div>
    </Modal>
  )
}