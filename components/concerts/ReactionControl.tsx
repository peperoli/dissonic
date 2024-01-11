import { Button } from '../Button'
import { FaceSmileIcon } from '@heroicons/react/20/solid'
import { Comment, Profile, Reaction } from '../../types/types'
import { User } from '@supabase/supabase-js'
import { Popover } from '@headlessui/react'
import { useAddReaction } from '../../hooks/useAddReaction'
import { useEditReaction } from '../../hooks/useEditReaction'
import { useDeleteReaction } from '../../hooks/useDeleteReaction'
import clsx from 'clsx'
import { useConcertContext } from '../../hooks/useConcertContext'

type ReactionToggleProps = {
  type: string
  commentId: number
  user: User
  reactions: Reaction[]
  reactionIcons: { [key: string]: string }
  close?: () => void
  label: string
  contentType?: 'icon'
  users?: Profile[]
}

export const ReactionToggle = ({
  type,
  commentId,
  user,
  reactions,
  reactionIcons,
  close,
  users,
  ...props
}: ReactionToggleProps) => {
  const { concert } = useConcertContext()
  const addReaction = useAddReaction(
    { comment_id: commentId, user_id: user.id, type: type },
    concert.id
  )
  const editReaction = useEditReaction(
    { comment_id: commentId, user_id: user.id, type: type },
    concert.id
  )
  const deleteReaction = useDeleteReaction(commentId, user.id, concert.id)
  const hasReaction = reactions.find(reaction => reaction.user_id === user.id)
  const isSelected = hasReaction?.type === type

  function handleClick() {
    if (hasReaction) {
      if (isSelected) {
        deleteReaction.mutate()
      } else {
        editReaction.mutate()
      }
    } else {
      addReaction.mutate()
    }
    close && close()
  }
  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        icon={reactionIcons[type]}
        size="small"
        loading={
          addReaction.status === 'loading' ||
          editReaction.status === 'loading' ||
          deleteReaction.status === 'loading'
        }
        className={clsx('peer', isSelected && '!bg-slate-500')}
        key={type}
        {...props}
      />
      {users && users.length > 0 && (
        <div className="absolute hidden peer-hover:block -top-1 left-1/2 -translate-x-1/2 -translate-y-full px-1.5 py-0.5 rounded text-center text-xs bg-slate-900">
          {users.map(item => item.username).join(', ')}
        </div>
      )}
    </div>
  )
}

type ReactionControlProps = {
  comment: Comment
  reactions: Reaction[]
  user: User
}

export const ReactionControl = ({ comment, reactions, user }: ReactionControlProps) => {
  const reactionIcons: { [key: string]: string } = {
    up: '👍',
    down: '👎',
    funny: '😂',
    horns: '🤘',
    clap: '👏',
    gremlin: '👹',
  }
  const reactionCounts: { type: string; count: number; users: Profile[] }[] = []

  reactions.forEach(item => {
    const matchingReaction = reactionCounts.find(reaction => reaction.type.includes(item.type))
    if (matchingReaction) {
      matchingReaction.count += 1
      matchingReaction.users.push(item.user)
    } else {
      reactionCounts.push({ type: item.type, count: 1, users: [item.user] })
    }
  })
  return (
    <div className="flex">
      {reactionCounts.map(reaction => (
        <ReactionToggle
          label={String(reaction.count)}
          type={reaction.type}
          commentId={comment.id}
          user={user}
          reactions={reactions}
          reactionIcons={reactionIcons}
          users={reaction.users}
          key={reaction.type}
        />
      ))}
      {comment.user_id !== user.id && (
        <Popover>
          <Popover.Button aria-label='Reagieren' className="btn btn-icon btn-small">
            <FaceSmileIcon className="h-icon" />
          </Popover.Button>
          <Popover.Panel className="absolute flex left-1/2 mt-1 rounded-lg bg-slate-700 shadow-xl -translate-x-1/2 z-10">
            {({ close }) => (
              <>
                {Object.keys(reactionIcons).map(key => (
                  <ReactionToggle
                    type={key}
                    commentId={comment.id}
                    user={user}
                    reactions={reactions}
                    reactionIcons={reactionIcons}
                    close={close}
                    label={key}
                    contentType="icon"
                    key={key}
                  />
                ))}
              </>
            )}
          </Popover.Panel>
        </Popover>
      )}
    </div>
  )
}
