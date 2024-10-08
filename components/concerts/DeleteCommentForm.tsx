import { Button } from '../Button'
import { useDeleteComment } from '../../hooks/concerts/useDeleteComment'
import { parseAsInteger, useQueryState } from 'nuqs'

interface DeleteCommentFormProps {
  close: () => void
}

export const DeleteCommentForm = ({ close }: DeleteCommentFormProps) => {
  const [commentId] = useQueryState('commentId', parseAsInteger)
  const { mutate, isPending } = useDeleteComment()

  async function onSubmit() {
    if (commentId) {
      mutate(commentId)
    }
  }

  return (
    <div>
      <p>Willst du diesen Kommentar wirklich löschen?</p>
      <div className="flex gap-4 mt-5 [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Löschen"
          onClick={onSubmit}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
