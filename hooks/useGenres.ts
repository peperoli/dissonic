import { useQuery } from "react-query"
import { Genre } from "../types/types"
import supabase from "../utils/supabase"

const fetchGenres = async (): Promise<Genre[]> => {
  const { data, error } = await supabase.from('genres').select('*').order('name')

  if (error) {
    throw error
  }

  return data
}

export const useGenres = () => {
  return useQuery('genres', fetchGenres)
}