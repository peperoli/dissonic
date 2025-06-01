import { getMemories, uploadMemories } from '@/actions/files'
import { TablesInsert } from '@/types/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import supabase from '@/utils/supabase/client'

async function fetchMemories({ concertId }: { concertId: number }) {
  const { data, error } = await supabase.from('memories').select('*').eq('concert_id', concertId)

  if (error) {
    throw error
  }

  const files = await getMemories(data.map(memory => memory.file_name))

  console.log('files', files)
  return files
}

export function useMemories({ concertId }: { concertId: number }) {
  // const t = useTranslations('Concerts')
  // const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['memories', concertId],
    queryFn: () => fetchMemories({ concertId }),
  })
}
