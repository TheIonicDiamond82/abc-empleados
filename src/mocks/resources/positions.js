import { mockDb } from '@/mocks/db'
import { httpError } from '@/mocks/httpError'
import { includesText, paginate, sortBy } from '@/mocks/queryHelpers'

export function listPositions(query = {}) {
  let items = mockDb.positions.map(withRelations)

  if (query.search) {
    items = items.filter((position) =>
      [position.name, position.code, position.level].some((value) => includesText(value, query.search)),
    )
  }

  if (query.departmentId) {
    items = items.filter((position) => String(position.departmentId) === String(query.departmentId))
  }

  if (query.isActive === 'true' || query.isActive === 'false') {
    const expected = query.isActive === 'true'
    items = items.filter((position) => position.isActive === expected)
  }

  return paginate(sortBy(items, query.sortBy || 'name', query.sortDir), query)
}

export function getPosition(id) {
  const position = mockDb.positions.find((item) => item.id === Number(id))
  if (!position) throw httpError(404, 'El puesto no existe.')
  return withRelations(position)
}

export function createPosition(payload) {
  assertUniqueCode(payload.code)
  requireDepartment(payload.departmentId)
  assertSalaryRange(payload)

  const timestamp = mockDb.timestamp()
  const position = {
    id: mockDb.nextId('positions'),
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    departmentId: Number(payload.departmentId),
    level: payload.level.trim(),
    minSalary: Number(payload.minSalary),
    maxSalary: Number(payload.maxSalary),
    isActive: payload.isActive !== false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  mockDb.positions.unshift(position)
  mockDb.logActivity({
    entityType: 'position',
    entityId: position.id,
    action: 'create',
    description: `Alta de puesto ${position.name}.`,
  })

  return withRelations(position)
}

export function updatePosition(id, payload) {
  const position = mockDb.positions.find((item) => item.id === Number(id))
  if (!position) throw httpError(404, 'El puesto no existe.')

  assertUniqueCode(payload.code, position.id)
  requireDepartment(payload.departmentId)
  assertSalaryRange(payload)

  Object.assign(position, {
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    departmentId: Number(payload.departmentId),
    level: payload.level.trim(),
    minSalary: Number(payload.minSalary),
    maxSalary: Number(payload.maxSalary),
    isActive: Boolean(payload.isActive),
    updatedAt: mockDb.timestamp(),
  })

  mockDb.logActivity({
    entityType: 'position',
    entityId: position.id,
    action: 'update',
    description: `Actualización de puesto ${position.name}.`,
  })

  return withRelations(position)
}

export function deletePosition(id) {
  const index = mockDb.positions.findIndex((item) => item.id === Number(id))
  if (index === -1) throw httpError(404, 'El puesto no existe.')

  const inUse = mockDb.employees.some((employee) => employee.positionId === Number(id))
  if (inUse) {
    throw httpError(409, 'No se puede eliminar un puesto con empleados asociados.')
  }

  const [position] = mockDb.positions.splice(index, 1)
  mockDb.logActivity({
    entityType: 'position',
    entityId: position.id,
    action: 'delete',
    description: `Baja de puesto ${position.name}.`,
  })

  return null
}

function withRelations(position) {
  const department = mockDb.departments.find((item) => item.id === position.departmentId)
  return {
    ...position,
    departmentName: department?.name ?? '—',
    employeeCount: mockDb.employees.filter((employee) => employee.positionId === position.id).length,
  }
}

function requireDepartment(id) {
  const department = mockDb.departments.find((item) => item.id === Number(id))
  if (!department) throw httpError(400, 'El departamento no existe.')
  return department
}

function assertUniqueCode(code, currentId) {
  const exists = mockDb.positions.some(
    (item) => item.code.toLowerCase() === code.trim().toLowerCase() && item.id !== currentId,
  )
  if (exists) {
    throw httpError(409, 'Ya existe un puesto con ese código.', {
      errors: { code: ['El código ya está registrado.'] },
    })
  }
}

function assertSalaryRange(payload) {
  if (Number(payload.minSalary) > Number(payload.maxSalary)) {
    throw httpError(400, 'El salario mínimo no puede ser mayor al máximo.', {
      errors: { maxSalary: ['Revise el rango salarial.'] },
    })
  }
}
