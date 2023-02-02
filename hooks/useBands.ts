import { useQuery } from "react-query"
import { Band } from "../types/types"
import supabase from "../utils/supabase"

const fetchBands = async (): Promise<Band[]> => {
  const { data, error } = await supabase.from('bands').select('*').order('name')

  if (error) {
    throw error
  }

  return data
}

export const useBands = () => {
  return useQuery('bands', fetchBands)
}