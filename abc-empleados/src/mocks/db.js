import { seedActivityLogs, seedDepartments, seedEmployees, seedPositions } from '@/mocks/seed'

function clone(value) {
  return structuredClone(value)
}

const state = {
  departments: clone(seedDepartments),
  positions: clone(seedPositions),
  employees: clone(seedEmployees),
  activityLogs: clone(seedActivityLogs),
}

export const mockDb = {
  get departments() {
    return state.departments
  },
  get positions() {
    return state.positions
  },
  get employees() {
    return state.employees
  },
  get activityLogs() {
    return state.activityLogs
  },
  nextId(collection) {
    const items = state[collection]
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0)
    return maxId + 1
  },
  timestamp() {
    return new Date().toISOString()
  },
  logActivity({ entityType, entityId, action, description }) {
    state.activityLogs.unshift({
      id: this.nextId('activityLogs'),
      entityType,
      entityId,
      action,
      description,
      occurredAt: this.timestamp(),
      actor: 'Administrador',
    })
  },
}
