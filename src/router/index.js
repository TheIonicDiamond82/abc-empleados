import { createRouter, createWebHistory } from 'vue-router'
import AppShell from '@/layouts/AppShell.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: {
            title: 'Dashboard',
            description: 'Indicadores de plantilla y movimientos ABC',
          },
        },
        {
          path: 'empleados',
          name: 'employees',
          component: () => import('@/views/employees/EmployeeListView.vue'),
          meta: {
            title: 'Empleados',
            description: 'Altas, bajas y cambios de personal',
          },
        },
        {
          path: 'departamentos',
          name: 'departments',
          component: () => import('@/views/departments/DepartmentListView.vue'),
          meta: {
            title: 'Departamentos',
            description: 'Estructura organizacional',
          },
        },
        {
          path: 'puestos',
          name: 'positions',
          component: () => import('@/views/positions/PositionListView.vue'),
          meta: {
            title: 'Puestos',
            description: 'Catálogo de cargos y rangos salariales',
          },
        },
        {
          path: 'reportes',
          name: 'reports',
          component: () => import('@/views/reports/ReportsView.vue'),
          meta: {
            title: 'Reportes',
            description: 'Actividad histórica y exportación',
          },
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
