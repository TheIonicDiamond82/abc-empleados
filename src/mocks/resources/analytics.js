import { mockDb } from '@/mocks/db'
import { includesText, paginate, sortBy } from '@/mocks/queryHelpers'
import { startOfMonthIso, toIsoDate } from '@/utils/date'

export function getDashboardSummary() {
  const employees = mockDb.employees
  const activeEmployees = employees.filter((employee) => employee.status === 'active')
  const monthStart = startOfMonthIso(0)

  const hiresThisMonth = mockDb.activityLogs.filter(
    (log) => log.entityType === 'employee' && log.action === 'create' && log.occurredAt >= monthStart,
  ).length

  const terminationsThisMonth = mockDb.activityLogs.filter(
    (log) => log.entityType === 'employee' && log.action === 'delete' && log.occurredAt >= monthStart,
  ).length

  const byDepartment = mockDb.departments
    .filter((department) => department.isActive)
    .map((department) => ({
      departmentId: department.id,
      name: department.name,
      total: employees.filter(
        (employee) => employee.departmentId === department.id && employee.status !== 'terminated',
      ).length,
    }))

  const months = Array.from({ length: 6 }, (_, index) => startOfMonthIso(index - 5).slice(0, 7))
  const activityByMonth = months.map((yearMonth) => {
    const logs = mockDb.activityLogs.filter((log) => log.occurredAt.slice(0, 7) === yearMonth)
    return {
      month: yearMonth,
      hires: logs.filter((log) => log.action === 'create').length,
      changes: logs.filter((log) => log.action === 'update').length,
      terminations: logs.filter((log) => log.action === 'delete').length,
    }
  })

  return {
    totals: {
      employees: employees.length,
      activeEmployees: activeEmployees.length,
      departments: mockDb.departments.filter((department) => department.isActive).length,
      positions: mockDb.positions.filter((position) => position.isActive).length,
      hiresThisMonth,
      terminationsThisMonth,
    },
    byDepartment,
    activityByMonth,
  }
}

export function listActivity(query = {}) {
  let items = [...mockDb.activityLogs]

  if (query.from) {
    items = items.filter((log) => toIsoDate(log.occurredAt) >= query.from)
  }

  if (query.to) {
    items = items.filter((log) => toIsoDate(log.occurredAt) <= query.to)
  }

  if (query.action) {
    items = items.filter((log) => log.action === query.action)
  }

  if (query.entityType) {
    items = items.filter((log) => log.entityType === query.entityType)
  }

  if (query.search) {
    items = items.filter((log) =>
      [log.description, log.actor, log.entityType].some((value) => includesText(value, query.search)),
    )
  }

  const sorted = sortBy(items, query.sortBy || 'occurredAt', query.sortDir || 'desc')
  const page = paginate(sorted, query)

  return {
    ...page,
    summary: {
      hires: items.filter((log) => log.action === 'create').length,
      changes: items.filter((log) => log.action === 'update').length,
      terminations: items.filter((log) => log.action === 'delete').length,
      total: items.length,
    },
  }
}
