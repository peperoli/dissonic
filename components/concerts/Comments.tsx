import { Button } from '../Button'
import { useEffect } from 'react'
import { Comment } from '../../types/types'
import { useComments } from '../../hooks/concerts/useComments'
import { useAddComment } from '../../hooks/concerts/useAddComment'
import { CommentItem } from './Comment'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextArea } from '../forms/TextArea'
import { useSession } from '../../hooks/auth/useSession'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export const Comments = () => {
  const { concert } = useConcertContext()
  const { data: session } = useSession()
  const { register, watch, handleSubmit, reset } = useForm<Comment>()
  const { data: comments } = useComments({ concertId: concert.id })
  const { mutate, status } = useAddComment()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Comments')

  const onSubmit: SubmitHandler<Comment> = async formData => {
    if (!session) return
    mutate({ concert_id: concert.id, user_id: session?.user.id, content: formData.content })
  }

  useEffect(() => {
    if (status === 'success') {
      reset()
    }
  }, [status])
  return (
    <>
      <h2>{t('comments')}</h2>
      {session ? (
        <>
          {!concert.is_archived && (
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4 grid gap-4">
              <TextArea
                {...register('content')}
                label={t('addComment')}
                placeholder={t('whatDoYouThinkAboutThisConcert')}
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
          )}
          <div className="grid gap-5">
            {comments && comments.length > 0 ? (
              comments.map(item => <CommentItem key={item.id} comment={item} />)
            ) : (
              <p className="text-sm text-slate-300">{t('noCommentsYet')}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-300">{t('loginToSeeAndAddComments')}</p>
          <Button
            label={t('login')}
            onClick={() => push(`/login?redirect=${pathname}`)}
            appearance="primary"
          />
        </>
      )}
    </>
  )
}
