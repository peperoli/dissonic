import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Tables } from '@/types/supabase'

export function useMemoryRealtime(concertId?: number) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!concertId) return

    const channel = supabase
      .channel(`memories:${concertId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'memories',
          filter: `concert_id=eq.${concertId}`,
        },
        payload => {
          const memory = payload.new as Tables<'memories'>
          console.log('Memory updated:', memory)

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
