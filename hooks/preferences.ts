import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const concertsRangeAtom = atomWithStorage('concertsRange', 'past')

export function useConcertsRange() {
  return useAtom(concertsRangeAtom)
}
