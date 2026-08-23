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

  const { data, error } = await query

  if (error) {
    throw error
  }

  const memoriesWithStatus = await Promise.all(
    data.map(async memory => {
      if (!memory.file_type.startsWith('video/')) {
        return {  ...memory, status: null }
      }

      const { data: videoUpload, error } = await supabase
        .from('video_uploads')
        .select('status')
        .eq('video_id', memory.file_id)
        .maybeSingle()

      if (error) {
        console.error('Failed to fetch video upload status for memory:', error)
        return { ...memory, status: 'unknown' }
      }

      return { ...memory, status: videoUpload?.status ?? null }
    })
  )

  return memoriesWithStatus
}

export function useMemories(fetchOptions: { concertId?: number; userId?: string; size?: number }) {
  const { concertId, userId, size } = fetchOptions
  return useQuery({
    queryKey: ['memories', concertId, userId, size],
    queryFn: () => fetchMemories(fetchOptions),
  })
}
