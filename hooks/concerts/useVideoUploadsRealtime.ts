import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

export function useVideoUploadsRealtime(concertId?: number) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!concertId) return

    const channel = supabase
      .channel(`video_uploads:${concertId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_uploads',
          filter: `concert_id=eq.${concertId}`,
        },
        () => {
          // Invalidate memories query to reflect updated upload status
          queryClient.invalidateQueries({
            queryKey: ['memories', concertId],
          })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [concertId, queryClient])
}
