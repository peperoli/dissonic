import { useMutation } from '@tanstack/react-query'
import { AddFriend } from '../types/types'
import supabase from '../utils/supabase'

const addFriend = async (friend: AddFriend) => {
  const { error } = await supabase.from('friends').insert(friend)

  if (error) {
    throw error
  }
}

export const useAddFriend = () => {
  return useMutation(addFriend, { onError: error => console.error(error) })
}
