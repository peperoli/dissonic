import { Button } from '../Button'
import { Fragment } from 'react'
import { FaceSmileIcon } from '@heroicons/react/20/solid'
import { Comment, Reaction } from '../../types/types'
import { User } from '@supabase/supabase-js'
import { Popover } from '@headlessui/react'
import { useAddReaction } from '../../hooks/useAddReaction'
import { useEditReaction } from '../../hooks/useEditReaction'
import { useDeleteReaction } from '../../hooks/useDeleteReaction'

type ReactionToggleProps = {
  type: string
  commentId: number
  concertId: string
  user: User
  reactions: Reaction[]
  reactionIcons: { [key: string]: string }
  close: () => void
}

export const ReactionToggle = ({
  type,
  commentId,
  concertId,
  user,
  reactions,
  reactionIcons,
  close,
}: ReactionToggleProps) => {
  const addReaction = useAddReaction(
    { comment_id: commentId, user_id: user.id, type: type },
    concertId
  )
  const editReaction = useEditReaction(
    { comment_id: commentId, user_id: user.id, type: type },
    concertId
  )
  const deleteReaction = useDeleteReaction(commentId, user.id, concertId)
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
    close()
  }
  return (
    <Button
      onClick={handleClick}
      label={type}
      icon={reactionIcons[type]}
      contentType="icon"
      size="small"
      loading={
        addReaction.status === 'loading' ||
        editReaction.status === 'loading' ||
        deleteReaction.status === 'loading'
      }
      className={isSelected ? '!bg-slate-500' : ''}
      key={type}
    />
  )
}

type ReactionControlProps = {
  comment: Comment
  concertId: string
  reactions: Reaction[]
  user: User
}

export const ReactionControl = ({ comment, concertId, reactions, user }: ReactionControlProps) => {
  const reactionIcons = {
    up: '👍',
    down: '👎',
    funny: '😂',
    horns: '🤘',
    clap: '👏',
    gremlin: '👹',
  } as { [key: string]: string }
  const reactionCounts: { type: string; count: number; userIds: string[] }[] = []

  reactions.forEach(item => {
    const matchingReaction = reactionCounts.find(reaction => reaction.type.includes(item.type))
    if (matchingReaction) {
      matchingReaction.count += 1
      matchingReaction.userIds.push(item.user_id)
    } else {
      reactionCounts.push({ type: item.type, count: 1, userIds: [item.user_id] })
    }
  })
  return (
    <div className="flex">
      {reactionCounts.map(reaction => (
        <Button
          label={String(reaction.count)}
          icon={reactionIcons[reaction.type]}
          size="small"
          key={reaction.type}
        />
      ))}
      {comment.user_id !== user.id && (
        <Popover>
          <Popover.Button as={Fragment}>
            <Button
              contentType="icon"
              label="Reagieren"
              size="small"
              icon={<FaceSmileIcon className="h-icon" />}
            />
          </Popover.Button>
          <Popover.Panel className="absolute flex left-1/2 mt-1 rounded-lg bg-slate-700 shadow-xl -translate-x-1/2 z-10">
            {({ close }) => (
              <>
                {Object.keys(reactionIcons).map(key => (
                  <ReactionToggle
                    type={key}
                    commentId={comment.id}
                    concertId={concertId}
                    user={user}
                    reactions={reactions}
                    reactionIcons={reactionIcons}
                    close={close}
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
