export function normalizeString(string?: string) {
  const a = 'ààáâæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňöôòóœøōõőṕŕřßśšşșťțüûùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const pattern = new RegExp(a.split('').join('|'), 'g')
  
  if (!string) return ''

  return string
    ?.toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(pattern, char => b.charAt(a.indexOf(char))) // Replace special characters
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
}
