<script setup>
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  sortBy: { type: String, default: '' },
  sortDir: { type: String, default: 'asc' },
  emptyTitle: { type: String, default: 'Sin resultados' },
  emptyDescription: { type: String, default: 'Ajuste los filtros o cree un nuevo registro.' },
})

const emit = defineEmits(['sort'])
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-ink-200 bg-white">
    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-ink-200 bg-ink-100/70 text-ink-700">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 font-medium"
              :class="column.width || 'whitespace-nowrap'"
            >
              <button
                v-if="column.sortable"
                class="inline-flex items-center gap-1 hover:text-ink-900"
                type="button"
                @click="emit('sort', column.key)"
              >
                {{ column.label }}
                <ArrowUp v-if="sortBy === column.key && sortDir === 'asc'" class="size-3.5" />
                <ArrowDown v-else-if="sortBy === column.key && sortDir === 'desc'" class="size-3.5" />
                <ArrowUpDown v-else class="size-3.5 opacity-40" />
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length">
              <AppSpinner />
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="columns.length">
              <AppEmptyState :title="emptyTitle" :description="emptyDescription" />
            </td>
          </tr>
          <tr
            v-for="(row, index) in rows"
            v-else
            :key="row.id ?? index"
            class="border-t border-ink-100 text-ink-900"
          >
            <td v-for="column in columns" :key="column.key" class="px-4 py-3 align-middle">
              <slot :name="column.key" :row="row">
                {{ row[column.key] ?? '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="border-t border-ink-200">
      <slot name="footer" />
    </div>
  </div>
</template>
