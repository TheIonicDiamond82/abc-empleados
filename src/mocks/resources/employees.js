import { mockDb } from '@/mocks/db'
import { httpError } from '@/mocks/httpError'
import { includesText, paginate, sortBy } from '@/mocks/queryHelpers'

export function listEmployees(query = {}) {
  let items = mockDb.employees.map(withRelations)

  if (query.search) {
    items = items.filter((employee) =>
      [employee.firstName, employee.lastName, employee.email, employee.employeeNumber].some(
        (value) => includesText(value, query.search),
      ),
    )
  }

  if (query.status) {
    items = items.filter((employee) => employee.status === query.status)
  }

  if (query.departmentId) {
    items = items.filter((employee) => String(employee.departmentId) === String(query.departmentId))
  }

  if (query.positionId) {
    items = items.filter((employee) => String(employee.positionId) === String(query.positionId))
  }

  return paginate(sortBy(items, query.sortBy || 'lastName', query.sortDir), query)
}

export function getEmployee(id) {
  const employee = mockDb.employees.find((item) => item.id === Number(id))
  if (!employee) throw httpError(404, 'El empleado no existe.')
  return withRelations(employee)
}

export function createEmployee(payload) {
  assertUniqueEmail(payload.email)
  const position = requirePosition(payload.positionId)
  requireDepartment(payload.departmentId)
  assertPositionDepartment(position, payload.departmentId)

  const timestamp = mockDb.timestamp()
  const employee = {
    id: mockDb.nextId('employees'),
    employeeNumber: nextEmployeeNumber(),
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || '',
    departmentId: Number(payload.departmentId),
    positionId: Number(payload.positionId),
    hireDate: payload.hireDate,
    status: payload.status || 'active',
    salary: Number(payload.salary),
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  mockDb.employees.unshift(employee)
  mockDb.logActivity({
    entityType: 'employee',
    entityId: employee.id,
    action: 'create',
    description: `Alta de ${employee.firstName} ${employee.lastName} (${employee.employeeNumber}).`,
  })

  return withRelations(employee)
}

export function updateEmployee(id, payload) {
  const employee = mockDb.employees.find((item) => item.id === Number(id))
  if (!employee) throw httpError(404, 'El empleado no existe.')

  assertUniqueEmail(payload.email, employee.id)
  const position = requirePosition(payload.positionId)
  requireDepartment(payload.departmentId)
  assertPositionDepartment(position, payload.departmentId)

  const previousStatus = employee.status
  Object.assign(employee, {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || '',
    departmentId: Number(payload.departmentId),
    positionId: Number(payload.positionId),
    hireDate: payload.hireDate,
    status: payload.status,
    salary: Number(payload.salary),
    updatedAt: mockDb.timestamp(),
  })

  const description =
    previousStatus !== employee.status
      ? `Cambio de estatus de ${employee.firstName} ${employee.lastName} a ${statusLabel(employee.status)}.`
      : `Actualización de ${employee.firstName} ${employee.lastName} (${employee.employeeNumber}).`

  mockDb.logActivity({
    entityType: 'employee',
    entityId: employee.id,
    action: employee.status === 'terminated' && previousStatus !== 'terminated' ? 'delete' : 'update',
    description,
  })

  return withRelations(employee)
}

export function deleteEmployee(id) {
  const index = mockDb.employees.findIndex((item) => item.id === Number(id))
  if (index === -1) throw httpError(404, 'El empleado no existe.')

  const [employee] = mockDb.employees.splice(index, 1)
  mockDb.logActivity({
    entityType: 'employee',
    entityId: employee.id,
    action: 'delete',
    description: `Baja de ${employee.firstName} ${employee.lastName} (${employee.employeeNumber}).`,
  })

  return null
}

function withRelations(employee) {
  const department = mockDb.departments.find((item) => item.id === employee.departmentId)
  const position = mockDb.positions.find((item) => item.id === employee.positionId)
  return {
    ...employee,
    name: `${employee.lastName} ${employee.firstName}`.trim(),
    departmentName: department?.name ?? '—',
    positionName: position?.name ?? '—',
  }
}

function nextEmployeeNumber() {
  const max = mockDb.employees.reduce((current, employee) => {
    const numeric = Number.parseInt(String(employee.employeeNumber).replace(/\D/g, ''), 10)
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 0)
  return `EMP-${String(max + 1).padStart(3, '0')}`
}

function assertUniqueEmail(email, currentId) {
  const exists = mockDb.employees.some(
    (item) => item.email === email.trim().toLowerCase() && item.id !== currentId,
  )
  if (exists) {
    throw httpError(409, 'Ya existe un empleado con ese correo.', {
      errors: { email: ['El correo ya está registrado.'] },
    })
  }
}

function requireDepartment(id) {
  const department = mockDb.departments.find((item) => item.id === Number(id))
  if (!department) throw httpError(400, 'El departamento no existe.')
  return department
}

function requirePosition(id) {
  const position = mockDb.positions.find((item) => item.id === Number(id))
  if (!position) throw httpError(400, 'El puesto no existe.')
  return position
}

function assertPositionDepartment(position, departmentId) {
  if (position.departmentId !== Number(departmentId)) {
    throw httpError(400, 'El puesto no pertenece al departamento seleccionado.')
  }
}

function statusLabel(status) {
  if (status === 'inactive') return 'inactivo'
  if (status === 'terminated') return 'baja'
  return 'activo'
}
