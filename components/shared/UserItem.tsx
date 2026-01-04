import React, { ReactElement } from 'react'
import { Profile } from '../../types/types'
import Image from 'next/image'
import { User } from 'lucide-react'
import clsx from 'clsx'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { Tooltip } from './Tooltip'
import { useTranslations } from 'next-intl'

type UserItemProps = {
  user: Pick<Profile, 'id' | 'username' | 'avatar_path' | 'updated_at' | 'role'>
  description?: ReactElement | string | null
  size?: 'lg' | 'md' | 'sm'
  usernameIsHidden?: boolean
  avatarRight?: boolean
}

export const UserItem = ({
  user,
  description,
  size = 'md',
  usernameIsHidden,
  avatarRight = false,
}: UserItemProps) => {
  const t = useTranslations('UserItem')
  const avatarUrl = getAssetUrl('avatars', user.avatar_path, user.updated_at)
  const ConditionalTag = size === 'lg' ? 'h1' : 'div'

  const avatar = (
    <div
      className={clsx(
        'relative flex flex-none items-center justify-center rounded-full bg-blue',
        size === 'lg' && 'size-20',
        size === 'md' && 'size-10',
        size === 'sm' && 'size-5'
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={user.username}
          sizes="200px"
          fill
          unoptimized
          className="rounded-full object-cover"
        />
      ) : (
        <User
          className={clsx(
            'text-slate-850',
            size === 'lg' && 'size-10',
            size === 'md' && 'size-5',
            size === 'sm' && 'size-3'
          )}
        />
      )}
    </div>
  )

  return (
    <div
      className={clsx(
        'flex items-center rounded-full group-hover/user-item:cursor-pointer group-hover/user-item:bg-slate-700',
        (size === 'md' || size === 'sm') && '-m-1 p-1',
        avatarRight && 'flex-row-reverse'
      )}
    >
      {usernameIsHidden ? <Tooltip content={user.username}>{avatar}</Tooltip> : avatar}
      {!usernameIsHidden && (
        <div
          className={clsx(
            'grid w-full',
            size === 'lg' && 'mx-4',
            size === 'md' && 'mx-3',
            size === 'sm' && 'mx-2 text-sm'
          )}
        >
          <div
            className={clsx(
              'line-clamp-1 inline-flex items-center',
              size === 'lg' ? 'gap-x-2' : 'gap-x-1'
            )}
          >
            <ConditionalTag className="mb-0 truncate">{user.username}</ConditionalTag>
            {user.role && (
              <span
                className={clsx(
                  'rounded-md font-bold text-slate-850',
                  user.role === 'developer'
                    ? 'bg-gradient-to-r from-blue to-venom'
                    : 'bg-slate-300',
                  size === 'lg' ? 'px-2 text-base' : 'px-1 text-sm'
                )}
              >
                {t(user.role)}
              </span>
            )}
          </div>
          {description && <div className="-mt-1 text-sm text-slate-300">{description}</div>}
        </div>
      )}
    </div>
  )
}
