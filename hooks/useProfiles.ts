import { useQuery } from "react-query"
import { Profile } from "../types/types"
import supabase from "../utils/supabase"

const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase.from('profiles').select('*')

  if (error) {
    throw error
  }

  return data
}

export const useProfiles = () => {
  return useQuery('profiles', fetchProfiles)
}