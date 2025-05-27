import { useQuery } from '@tanstack/react-query'
import { Comment, Concert } from '@/types/types'
import supabase from '@/utils/supabase/client'

// Recursive function to fetch replies for a comment
async function fetchReplies(
  concertId: Concert['id'],
  parentId: NonNullable<Comment['parent_id']>
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, reactions(*, user:profiles(*))')
    .eq('concert_id', concertId)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  // Recursively fetch replies for each reply
  return Promise.all(
    data.map(async reply => ({
      ...reply,
      replies: await fetchReplies(concertId, reply.id),
    }))
  )
}

async function fetchComments(concertId: Concert['id']): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, reactions(*, user:profiles(*))')
    .eq('concert_id', concertId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  // Fetch replies recursively for each top-level comment
  return Promise.all(
    data.map(async comment => ({
      ...comment,
      replies: await fetchReplies(concertId, comment.id),
    }))
  )
}

export const useComments = (concertId: Concert['id']) => {
  return useQuery({
    queryKey: ['comments', concertId],
    queryFn: () => fetchComments(concertId),
    enabled: !!concertId,
  })
}
