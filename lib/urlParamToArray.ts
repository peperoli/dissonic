export function urlParamToArray(value: string | null) {
  return value?.split('|').map(item => parseInt(item))
}