<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { BarChart3, Building2, Briefcase, LayoutDashboard, Users } from 'lucide-vue-next'
import { env } from '@/config/env'

const route = useRoute()

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/empleados', label: 'Empleados', icon: Users },
  { to: '/departamentos', label: 'Departamentos', icon: Building2 },
  { to: '/puestos', label: 'Puestos', icon: Briefcase },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="flex h-full flex-col bg-ink-950 text-slate-200">
    <div class="border-b border-white/10 px-5 py-5">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">ABC</p>
      <p class="mt-1 text-lg font-semibold text-white">Empleados</p>
    </div>
    <nav class="flex-1 space-y-1 px-3 py-4">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition"
        :class="isActive(item.to) ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'"
      >
        <component :is="item.icon" class="size-4" />
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="border-t border-white/10 px-5 py-4 text-xs text-slate-400">
      Fuente de datos: {{ env.useMocks ? 'Mocks locales' : 'API REST' }}
    </div>
  </aside>
</template>
