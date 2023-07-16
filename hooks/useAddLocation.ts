import { useMutation } from '@tanstack/react-query'
import { AddLocation } from '../types/types'
import supabase from '../utils/supabase'

const addLocation = async (location: AddLocation) => {
  const { error } = await supabase.from('locations').insert(location)

  if (error) {
    throw error
  }
}

export const useAddLocation = (location: AddLocation) => {
  return useMutation(() => addLocation(location))
}
