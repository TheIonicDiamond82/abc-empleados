import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDateTime } from '@/utils/date'
import { downloadBlob, toCsv } from '@/utils/format'

const ACTION_LABELS = {
  create: 'Alta',
  update: 'Cambio',
  delete: 'Baja',
}

const ENTITY_LABELS = {
  employee: 'Empleado',
  department: 'Departamento',
  position: 'Puesto',
}

export function activityColumns() {
  return [
    { label: 'Fecha', accessor: (row) => formatDateTime(row.occurredAt) },
    { label: 'Tipo', accessor: (row) => ACTION_LABELS[row.action] || row.action },
    { label: 'Entidad', accessor: (row) => ENTITY_LABELS[row.entityType] || row.entityType },
    { label: 'Descripción', accessor: (row) => row.description },
    { label: 'Actor', accessor: (row) => row.actor },
  ]
}

export function exportActivityCsv(rows) {
  const csv = toCsv(rows, activityColumns())
  downloadBlob(`\uFEFF${csv}`, 'reporte-actividad.csv', 'text/csv;charset=utf-8;')
}

export function exportActivityPdf(rows, summary) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  doc.setFontSize(16)
  doc.text('ABC Empleados — Reporte de actividad', 40, 40)
  doc.setFontSize(10)
  doc.setTextColor(80)
  doc.text(
    `Altas ${summary.hires}  ·  Cambios ${summary.changes}  ·  Bajas ${summary.terminations}  ·  Total ${summary.total}`,
    40,
    60,
  )

  autoTable(doc, {
    startY: 78,
    head: [activityColumns().map((column) => column.label)],
    body: rows.map((row) => activityColumns().map((column) => column.accessor(row))),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
  })

  doc.save('reporte-actividad.pdf')
}

export { ACTION_LABELS, ENTITY_LABELS }
