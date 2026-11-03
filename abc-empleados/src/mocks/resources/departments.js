import { mockDb } from '@/mocks/db'
import { httpError } from '@/mocks/httpError'
import { includesText, paginate, sortBy } from '@/mocks/queryHelpers'

export function listDepartments(query = {}) {
  let items = mockDb.departments.map(withCounts)

  if (query.search) {
    items = items.filter((department) =>
      [department.name, department.code, department.description].some((value) =>
        includesText(value, query.search),
      ),
    )
  }

  if (query.isActive === 'true' || query.isActive === 'false') {
    const expected = query.isActive === 'true'
    items = items.filter((department) => department.isActive === expected)
  }

  return paginate(sortBy(items, query.sortBy || 'name', query.sortDir), query)
}

export function getDepartment(id) {
  const department = mockDb.departments.find((item) => item.id === Number(id))
  if (!department) throw httpError(404, 'El departamento no existe.')
  return withCounts(department)
}

export function createDepartment(payload) {
  assertUniqueCode(payload.code)
  const timestamp = mockDb.timestamp()
  const department = {
    id: mockDb.nextId('departments'),
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    description: payload.description?.trim() || '',
    isActive: payload.isActive !== false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  mockDb.departments.unshift(department)
  mockDb.logActivity({
    entityType: 'department',
    entityId: department.id,
    action: 'create',
    description: `Alta de departamento ${department.name}.`,
  })

  return withCounts(department)
}

export function updateDepartment(id, payload) {
  const department = mockDb.departments.find((item) => item.id === Number(id))
  if (!department) throw httpError(404, 'El departamento no existe.')

  assertUniqueCode(payload.code, department.id)
  Object.assign(department, {
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    description: payload.description?.trim() || '',
    isActive: Boolean(payload.isActive),
    updatedAt: mockDb.timestamp(),
  })

  mockDb.logActivity({
    entityType: 'department',
    entityId: department.id,
    action: 'update',
    description: `Actualización de departamento ${department.name}.`,
  })

  return withCounts(department)
}

export function deleteDepartment(id) {
  const index = mockDb.departments.findIndex((item) => item.id === Number(id))
  if (index === -1) throw httpError(404, 'El departamento no existe.')

  const inUse =
    mockDb.employees.some((employee) => employee.departmentId === Number(id)) ||
    mockDb.positions.some((position) => position.departmentId === Number(id))

  if (inUse) {
    throw httpError(409, 'No se puede eliminar un departamento con puestos o empleados asociados.')
  }

  const [department] = mockDb.departments.splice(index, 1)
  mockDb.logActivity({
    entityType: 'department',
    entityId: department.id,
    action: 'delete',
    description: `Baja de departamento ${department.name}.`,
  })

  return null
}

function withCounts(department) {
  return {
    ...department,
    employeeCount: mockDb.employees.filter((employee) => employee.departmentId === department.id)
      .length,
    positionCount: mockDb.positions.filter((position) => position.departmentId === department.id)
      .length,
  }
}

function assertUniqueCode(code, currentId) {
  const exists = mockDb.departments.some(
    (item) => item.code.toLowerCase() === code.trim().toLowerCase() && item.id !== currentId,
  )
  if (exists) {
    throw httpError(409, 'Ya existe un departamento con ese código.', {
      errors: { code: ['El código ya está registrado.'] },
    })
  }
}
