'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Button } from '../Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkIdentity, unlinkIdentity } from '@/actions/auth'
import { SiGoogle } from '@icons-pack/react-simple-icons'
import { UserIdentity } from '@supabase/supabase-js'
import { MailIcon, UnlinkIcon } from 'lucide-react'
import { useUserIdentities } from '@/hooks/auth/useUserIdentities'
import toast from 'react-hot-toast'

function IdentityItem({
  identity,
  identitiesCount,
}: {
  identity: UserIdentity
  identitiesCount: number
}) {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () => unlinkIdentity(identity),
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-identities'] })
      toast.success(t('identityUnlinked'))
    },
  })
  const t = useTranslations('OAuthSettings')
  const locale = useLocale()

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {identity.provider === 'email' ? (
          <MailIcon className="size-icon" />
        ) : identity.provider === 'google' ? (
          <SiGoogle className="size-icon text-[#4285F4]" />
        ) : null}
        <div>
          <p className="font-bold capitalize">{identity.provider}</p>
          <p className="text-sm text-slate-300">
            {identity.identity_data?.email}
            {identity.identity_data?.full_name && (
              <>&nbsp;&bull; {identity.identity_data?.full_name}</>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {identity.created_at && (
          <p className="text-sm text-slate-300">
            {t('linkedAtDate', {
              date: new Date(identity.created_at).toLocaleDateString(locale),
            })}
          </p>
        )}
        {identitiesCount > 1 && identity.provider !== 'email' && (
          <Button
            label={t('unlink')}
            icon={<UnlinkIcon />}
            onClick={() => mutate()}
            contentType="icon"
            appearance="tertiary"
            danger
            loading={isPending}
          />
        )}
      </div>
    </li>
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

  return (
    <section className="rounded-lg bg-slate-800 p-6">
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
      {!userIdentities?.some(identity => identity.provider === 'google') && (
        <Button
          label={t('linkWithGoogle')}
          onClick={() => linkGoogle.mutate()}
          icon={<SiGoogle className="size-icon" />}
          loading={linkGoogle.isPending}
        />
      )}
    </section>
  )
}
