import { Button } from '../Button'
import Modal from '../Modal'
import React, { FC, useEffect } from 'react'
import { useDeleteComment } from '../../hooks/useDeleteComment'
import { useQueryClient } from 'react-query'

interface IDeleteCommentModal {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  commentId: number
  concertId: string
}

export const DeleteCommentModal: FC<IDeleteCommentModal> = ({
  isOpen,
  setIsOpen,
  commentId,
  concertId,
}) => {
  const deleteComment = useDeleteComment(commentId)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (deleteComment.status === 'success') {
      queryClient.invalidateQueries(['comments', concertId])
      setIsOpen(false)
    }
  }, [deleteComment.status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Kommentar löschen</h2>
      <p>Willst du diesen Kommentar wirklich löschen?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button
          label="Löschen"
          onClick={() => deleteComment.mutate()}
          style="primary"
          danger
          loading={deleteComment.status === 'loading'}
        />
      </div>
    </Modal>
  )
}
