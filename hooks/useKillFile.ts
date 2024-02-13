import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase/client'

const killFile = async (oldFile: { name: string; bucket: string }) => {
  const { error } = await supabase.storage.from(oldFile.bucket).remove([oldFile.name])

  if (error) {
    throw error
  }
}

export const useKillFile = () => {
  return useMutation(killFile, { onError: error => console.error(error) })
}
