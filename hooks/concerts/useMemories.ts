import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchMemories({
  concertId,
  userId,
  size,
}: {
  concertId?: number
  userId?: string
  size?: number
}) {
  let query = supabase
    .from('memories')
    .select(
      '*, band:bands(id, name), profile:profiles(id, username, role, avatar_path, updated_at)'
    )
    .order('created_at', { ascending: false })

  if (concertId) {
    query = query.eq('concert_id', concertId)
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (size) {
    query = query.limit(size)
  }

  const { data: memories, error } = await query

  if (error) {
    throw error
  }

  const memoriesWithStatus = memories.map(memory => ({ ...memory, status: null }))
  const videoIds = memories.filter(m => m.file_type.startsWith('video/')).map(m => m.file_id)
  
  if (videoIds.length > 0) {
    const { data: videoUploads, error } = await supabase
      .from('video_uploads')
      .select('video_id, status')
      .in('video_id', videoIds)

    if (error) {
      console.error('Failed to fetch video upload statuses:', error)
      return memoriesWithStatus
    }

    return memoriesWithStatus.map(memory => ({
      ...memory,
      status: videoUploads.find(v => v.video_id === memory.file_id)?.status ?? null,
    }))
  }

  return memoriesWithStatus
}

export function useMemories(fetchOptions: { concertId?: number; userId?: string; size?: number }) {
  const { concertId, userId, size } = fetchOptions
  return useQuery({
    queryKey: ['memories', concertId, userId, size],
    queryFn: () => fetchMemories(fetchOptions),
  })
}
