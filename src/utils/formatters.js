export const slugify = (text) => {
  if (!text) return ''
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const mapOrderedArr = (originArr, orderArr, key) => {
  if (!Array.isArray(originArr)) originArr = []

  const clonedArr = [...originArr]
  return clonedArr.sort(
    (a, b) => orderArr.indexOf(a[key]) - orderArr.indexOf(b[key])
  )
}
