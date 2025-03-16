'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Button } from '../Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkIdentity, unlinkIdentity } from '@/actions/auth'
import { UserIdentity } from '@supabase/supabase-js'
import { MailIcon, UnlinkIcon } from 'lucide-react'
import { useUserIdentities } from '@/hooks/auth/useUserIdentities'
import toast from 'react-hot-toast'
import { useQueryState } from 'nuqs'
import Modal from '../Modal'
import { DialogTitle } from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'

function IdentityItem({
  identity,
  identitiesCount,
}: {
  identity: UserIdentity
  identitiesCount: number
}) {
  const queryClient = useQueryClient()
  const [modal, setModal] = useQueryState('modal', { history: 'push' })
  const closeModal = () => setModal(null)
  const { mutate, isPending } = useMutation({
    mutationFn: () => unlinkIdentity(identity),
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-identities'] })
      closeModal()
      toast.success(t('providerUnlinked'))
    },
  })
  const t = useTranslations('OAuthSettings')
  const locale = useLocale()
  const linkedAt = identity.created_at ? (
    <p className="text-sm text-slate-300">
      {t('linkedAtDate', {
        date: new Date(identity.created_at).toLocaleDateString(locale),
      })}
    </p>
  ) : null

  return (
    <>
      <li className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {identity.provider === 'email' ? (
            <MailIcon className="size-icon flex-none" />
          ) : identity.provider === 'google' ? (
            <FontAwesomeIcon icon={faGoogle} className="size-icon flex-none" />
          ) : identity.provider === 'azure' ? (
            <FontAwesomeIcon icon={faMicrosoft} className="size-icon flex-none" />
          ) : null}
          <div>
            <p className="font-bold capitalize">
              {identity.provider === 'azure' ? 'Azure (Microsoft)' : identity.provider}
            </p>
            <p className="text-sm text-slate-300">
              {identity.identity_data?.email}
              {identity.identity_data?.full_name && (
                <>&nbsp;&bull; {identity.identity_data?.full_name}</>
              )}
            </p>
            <span className="md:hidden">{linkedAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block">{linkedAt}</span>
          {identitiesCount > 1 && identity.provider !== 'email' && (
            <Button
              label={t('unlinkProvider')}
              icon={<UnlinkIcon className="size-icon" />}
              onClick={() => setModal('unlink-identity')}
              contentType="icon"
              size="small"
              appearance="secondary"
              danger
            />
          )}
        </div>
      </li>
      <Modal open={modal !== null} onOpenChange={isOpen => !isOpen && closeModal()}>
        <DialogTitle>{t('unlinkProvider')}</DialogTitle>
        <p>
          {t.rich('doYouReallyWantToUnlinkThisProvider', {
            provider: () => <strong className="capitalize">{identity.provider}</strong>,
          })}
        </p>
        <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
          <Button label={t('cancel')} onClick={closeModal} />
          <Button
            label={t('unlinkProvider')}
            onClick={() => mutate()}
            appearance="primary"
            danger
            loading={isPending}
          />
        </div>
      </Modal>
    </>
  )
}

export function OAuthSettings({
  userIdentities: initialUserIdentities,
}: {
  userIdentities: UserIdentity[]
}) {
  const { data: userIdentities } = useUserIdentities(initialUserIdentities)
  const t = useTranslations('OAuthSettings')
  const linkGoogle = useMutation({
    mutationFn: () => linkIdentity('google'),
    onError: error => console.error(error),
  })
  const linkMicrosoft = useMutation({
    mutationFn: () => linkIdentity('azure'),
    onError: error => console.error(error),
  })

  return (
    <section id="oauth" className="rounded-lg bg-slate-800 p-6">
      <h2>{t('headline')}</h2>
      <p className="mb-5 text-slate-300">{t('description')}</p>
      <ul className="mb-5 grid gap-3">
        {userIdentities?.map(identity => (
          <IdentityItem
            key={identity.id}
            identity={identity}
            identitiesCount={userIdentities.length}
          />
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        {!userIdentities?.some(identity => identity.provider === 'google') && (
          <Button
            label={t('linkWithGoogle')}
            onClick={() => linkGoogle.mutate()}
            icon={<FontAwesomeIcon icon={faGoogle} className="size-icon" />}
            loading={linkGoogle.isPending}
          />
        )}
        {!userIdentities?.some(identity => identity.provider === 'azure') && (
          <Button
            label={t('linkWithMicrosoft')}
            onClick={() => linkMicrosoft.mutate()}
            icon={<FontAwesomeIcon icon={faMicrosoft} className="size-icon" />}
            loading={linkMicrosoft.isPending}
          />
        )}
      </div>
    </section>
  )
}
