export function compactQuery(query = {}) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== '' && value != null),
  )
}

export function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}
