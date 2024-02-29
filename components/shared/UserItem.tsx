import React from 'react'
import { Profile } from '../../types/types'
import Image from 'next/image'
import { useAvatar } from '../../hooks/profiles/useAvatar'
import { User } from 'lucide-react'
import clsx from 'clsx'

type UserItemProps = {
  user: Profile
  description?: string | null
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
  const { data: avatarUrl } = useAvatar(user.avatar_path)
  const ConditionalTag = size === 'lg' ? 'h1' : 'div'
  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center rounded-full group-hover/user-item:bg-slate-600',
        size === 'md' && 'p-1',
        size === 'sm' && 'p-0.5',
        avatarRight && 'flex-row-reverse'
      )}
    >
      <div
        className={clsx(
          'bg-blue relative flex flex-none items-center justify-center rounded-full',
          size === 'lg' && 'size-20',
          size === 'md' && 'size-10',
          size === 'sm' && 'size-5'
        )}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar" fill={true} className="rounded-full object-cover" />
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
      <div
        className={clsx(
          usernameIsHidden && 'sr-only',
          size === 'lg' && 'mx-4',
          size === 'md' && 'mx-3',
          size === 'sm' && 'mx-2 text-sm'
        )}
      >
        <ConditionalTag className='mb-0'>{user.username}</ConditionalTag>
        {description && <div className="-mt-1 text-sm text-slate-300">{description}</div>}
      </div>
    </div>
  )
}
