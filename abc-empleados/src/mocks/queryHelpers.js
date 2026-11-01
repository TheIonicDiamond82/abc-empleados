import { parsePositiveInt } from '@/utils/query'

export function paginate(items, query) {
  const page = parsePositiveInt(query.page, 1)
  const pageSize = parsePositiveInt(query.pageSize, 10)
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
  }
}

export function sortBy(items, sortKey, sortDir = 'asc') {
  if (!sortKey) return items

  const direction = sortDir === 'desc' ? -1 : 1
  return [...items].sort((left, right) => {
    const a = normalize(left[sortKey])
    const b = normalize(right[sortKey])
    if (a < b) return -1 * direction
    if (a > b) return 1 * direction
    return 0
  })
}

function normalize(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.toLocaleLowerCase('es-MX')
  return value
}

export function includesText(haystack, needle) {
  if (!needle) return true
  return String(haystack ?? '')
    .toLocaleLowerCase('es-MX')
    .includes(String(needle).toLocaleLowerCase('es-MX'))
}
