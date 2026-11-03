export const EMPLOYEE_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'terminated', label: 'Baja' },
]

export const ACTIVITY_ACTION_OPTIONS = [
  { value: 'create', label: 'Altas' },
  { value: 'update', label: 'Cambios' },
  { value: 'delete', label: 'Bajas' },
]

export const ENTITY_TYPE_OPTIONS = [
  { value: 'employee', label: 'Empleados' },
  { value: 'department', label: 'Departamentos' },
  { value: 'position', label: 'Puestos' },
]

export const POSITION_LEVEL_OPTIONS = [
  'Dirección',
  'Gerencia',
  'Liderazgo',
  'Coordinación',
  'Senior',
  'Profesional',
  'Analista',
  'Especialista',
]

export function statusLabel(status) {
  return EMPLOYEE_STATUS_OPTIONS.find((option) => option.value === status)?.label || status
}
