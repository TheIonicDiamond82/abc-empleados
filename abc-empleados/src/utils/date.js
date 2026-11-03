const dateTimeFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
})

const monthFormatter = new Intl.DateTimeFormat('es-MX', {
  month: 'short',
  year: 'numeric',
})

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTimeFormatter.format(date)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

export function formatMonthLabel(yearMonth) {
  const date = new Date(`${yearMonth}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) return yearMonth
  return monthFormatter.format(date)
}

export function toIsoDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export function startOfMonthIso(offsetMonths = 0) {
  const date = new Date()
  date.setDate(1)
  date.setMonth(date.getMonth() + offsetMonths)
  return toIsoDate(date)
}

export function todayIso() {
  return toIsoDate(new Date())
}
