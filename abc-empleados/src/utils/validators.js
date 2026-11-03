const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function required(value, message) {
  if (value == null || String(value).trim() === '') return message
  return ''
}

export function validateEmployee(form) {
  const errors = {}
  const firstName = required(form.firstName, 'El nombre es obligatorio.')
  const lastName = required(form.lastName, 'El apellido es obligatorio.')
  const email = required(form.email, 'El correo es obligatorio.')
  const departmentId = required(form.departmentId, 'Seleccione un departamento.')
  const positionId = required(form.positionId, 'Seleccione un puesto.')
  const hireDate = required(form.hireDate, 'La fecha de ingreso es obligatoria.')
  const salary = required(form.salary, 'El salario es obligatorio.')
  const status = required(form.status, 'Seleccione un estatus.')

  if (firstName) errors.firstName = firstName
  if (lastName) errors.lastName = lastName
  if (email) errors.email = email
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Ingrese un correo válido.'
  if (departmentId) errors.departmentId = departmentId
  if (positionId) errors.positionId = positionId
  if (hireDate) errors.hireDate = hireDate
  if (status) errors.status = status
  if (salary) errors.salary = salary
  else if (Number(form.salary) <= 0) errors.salary = 'El salario debe ser mayor a cero.'

  return errors
}

export function validateDepartment(form) {
  const errors = {}
  const name = required(form.name, 'El nombre es obligatorio.')
  const code = required(form.code, 'El código es obligatorio.')
  if (name) errors.name = name
  if (code) errors.code = code
  return errors
}

export function validatePosition(form) {
  const errors = {}
  const name = required(form.name, 'El nombre es obligatorio.')
  const code = required(form.code, 'El código es obligatorio.')
  const departmentId = required(form.departmentId, 'Seleccione un departamento.')
  const level = required(form.level, 'El nivel es obligatorio.')
  const minSalary = required(form.minSalary, 'El salario mínimo es obligatorio.')
  const maxSalary = required(form.maxSalary, 'El salario máximo es obligatorio.')

  if (name) errors.name = name
  if (code) errors.code = code
  if (departmentId) errors.departmentId = departmentId
  if (level) errors.level = level
  if (minSalary) errors.minSalary = minSalary
  else if (Number(form.minSalary) <= 0) errors.minSalary = 'Debe ser mayor a cero.'
  if (maxSalary) errors.maxSalary = maxSalary
  else if (Number(form.maxSalary) < Number(form.minSalary || 0)) {
    errors.maxSalary = 'Debe ser mayor o igual al salario mínimo.'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
