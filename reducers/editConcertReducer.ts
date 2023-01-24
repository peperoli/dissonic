import { EditConcert } from "../types/types"

export enum ActionType {
  CHANGE_INPUT = 'CHANGE_INPUT',
  TOGGLE_FESTIVAL = 'TOGGLE_FESTIVAL',
}

interface Action {
  type: ActionType
  payload?: any
}

export const editConcertReducer = (state: EditConcert, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case ActionType.CHANGE_INPUT:
      return {
        ...state,
        [payload.name]: payload.value,
      }
    case ActionType.TOGGLE_FESTIVAL:
      return{
        ...state,
        is_festival: !state.is_festival
      }
    default:
      return state
  }
}
