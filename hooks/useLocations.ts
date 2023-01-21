import { useQuery } from "react-query"
import { Location } from "../types/types"
import supabase from "../utils/supabase"

const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase.from('locations').select('*').order('name')

  if (error) {
    throw error
  }

  return data
}

export const useLocations = () => {
  return useQuery('locations', fetchLocations)
}