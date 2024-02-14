import { Button } from '../Button'
import Modal from '../Modal'
import React, { useEffect } from 'react'
import { useDeleteComment } from '../../hooks/concerts/useDeleteComment'
import { useQueryClient } from '@tanstack/react-query'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'

interface DeleteCommentModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  commentId: number
}

export const DeleteCommentModal = ({ isOpen, setIsOpen, commentId }: DeleteCommentModalProps) => {
  const { concert } = useConcertContext()
  const deleteComment = useDeleteComment(commentId)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (deleteComment.status === 'success') {
      queryClient.invalidateQueries(['comments', concert.id])
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
          appearance="primary"
          danger
          loading={deleteComment.status === 'loading'}
        />
      </div>
    </Modal>
  )
}
