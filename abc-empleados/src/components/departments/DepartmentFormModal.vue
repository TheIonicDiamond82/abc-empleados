<script setup>
import { computed, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { hasErrors, validateDepartment } from '@/utils/validators'

const props = defineProps({
  open: { type: Boolean, default: false },
  department: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])
const errors = ref({})
const form = reactive(emptyForm())
const title = computed(() => (props.department ? 'Editar departamento' : 'Nuevo departamento'))

watch(
  () => [props.open, props.department],
  () => {
    Object.assign(form, props.department ? mapDepartment(props.department) : emptyForm())
    errors.value = {}
  },
)

function emptyForm() {
  return { name: '', code: '', description: '', isActive: true }
}

function mapDepartment(department) {
  return {
    name: department.name,
    code: department.code,
    description: department.description,
    isActive: department.isActive,
  }
}

function submit() {
  errors.value = validateDepartment(form)
  if (hasErrors(errors.value)) return
  emit('submit', { ...form })
}
</script>

<template>
  <AppModal :open="open" :title="title" @close="emit('close')">
    <form class="grid gap-4" @submit.prevent="submit">
      <AppInput id="department-name" v-model="form.name" label="Nombre" :error="errors.name" />
      <AppInput id="department-code" v-model="form.code" label="Código" :error="errors.code" />
      <label class="block space-y-1.5">
        <span class="text-sm font-medium text-ink-700">Descripción</span>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>
      <label class="flex items-center gap-2 text-sm text-ink-700">
        <input v-model="form.isActive" type="checkbox" class="size-4 accent-accent" />
        Departamento activo
      </label>
      <div class="flex justify-end gap-2">
        <AppButton variant="secondary" @click="emit('close')">Cancelar</AppButton>
        <AppButton type="submit" :disabled="saving">Guardar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
