import supabase from "../../utils/supabase"
import { Button } from "../Button"
import Modal from "../Modal"

export default function DeleteCommentDialog({isOpen, setIsOpen, comment, comments, setComments}) {
  async function deleteComment() {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', comment.id)

      if (error) {
        throw error
      }

      setComments(comments.filter(item => item.id !== comment.id))
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Kommentar löschen</h2>
      <p>Willst du diesen Kommentar wirklich unwiderruflich lösche?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Löschen" onClick={deleteComment} style="primary" danger />
      </div>
    </Modal>
  )
}