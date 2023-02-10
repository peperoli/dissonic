import { EditBand } from "../types/types"

export enum ActionType {
  CHANGE_INPUT = 'CHANGE_INPUT',
}

interface Action {
  type: ActionType
  payload?: any
}

export const editBandReducer = (state: EditBand, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case ActionType.CHANGE_INPUT:
      return {
        ...state,
        [payload.name]: payload.value,
      }
    default:
      return state
  }
}