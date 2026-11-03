const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  if (value == null || value === '') return '—'
  return currencyFormatter.format(Number(value))
}

export function fullName(entity) {
  if (!entity) return '—'
  return `${entity.firstName ?? ''} ${entity.lastName ?? ''}`.trim() || '—'
}

export function downloadBlob(content, filename, mimeType) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => escapeCsv(column.label)).join(',')
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsv(column.accessor(row))).join(','),
  )
  return [header, ...lines].join('\n')
}

function escapeCsv(value) {
  const text = value == null ? '' : String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`
  }
  return text
}
