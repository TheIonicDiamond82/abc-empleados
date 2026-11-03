<script setup>
import { computed, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { POSITION_LEVEL_OPTIONS } from '@/constants/catalogs'
import { hasErrors, validatePosition } from '@/utils/validators'

const props = defineProps({
  open: { type: Boolean, default: false },
  position: { type: Object, default: null },
  departments: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])
const errors = ref({})
const form = reactive(emptyForm())
const title = computed(() => (props.position ? 'Editar puesto' : 'Nuevo puesto'))
const levelOptions = POSITION_LEVEL_OPTIONS.map((level) => ({ value: level, label: level }))

watch(
  () => [props.open, props.position],
  () => {
    Object.assign(form, props.position ? mapPosition(props.position) : emptyForm())
    errors.value = {}
  },
)

function emptyForm() {
  return {
    name: '',
    code: '',
    departmentId: '',
    level: '',
    minSalary: '',
    maxSalary: '',
    isActive: true,
  }
}

function mapPosition(position) {
  return {
    name: position.name,
    code: position.code,
    departmentId: String(position.departmentId),
    level: position.level,
    minSalary: position.minSalary,
    maxSalary: position.maxSalary,
    isActive: position.isActive,
  }
}

function submit() {
  errors.value = validatePosition(form)
  if (hasErrors(errors.value)) return
  emit('submit', {
    ...form,
    departmentId: Number(form.departmentId),
    minSalary: Number(form.minSalary),
    maxSalary: Number(form.maxSalary),
  })
}
</script>

<template>
  <AppModal :open="open" :title="title" @close="emit('close')">
    <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <AppInput id="position-name" v-model="form.name" label="Nombre" :error="errors.name" />
      <AppInput id="position-code" v-model="form.code" label="Código" :error="errors.code" />
      <AppSelect id="position-department" v-model="form.departmentId" label="Departamento" :error="errors.departmentId">
        <option v-for="department in departments" :key="department.id" :value="String(department.id)">
          {{ department.name }}
        </option>
      </AppSelect>
      <AppSelect
        id="position-level"
        v-model="form.level"
        label="Nivel"
        :options="levelOptions"
        :error="errors.level"
      />
      <AppInput id="position-min-salary" v-model="form.minSalary" label="Salario mínimo" type="number" :error="errors.minSalary" />
      <AppInput id="position-max-salary" v-model="form.maxSalary" label="Salario máximo" type="number" :error="errors.maxSalary" />
      <label class="flex items-center gap-2 text-sm text-ink-700 sm:col-span-2">
        <input v-model="form.isActive" type="checkbox" class="size-4 accent-accent" />
        Puesto activo
      </label>
      <div class="flex justify-end gap-2 sm:col-span-2">
        <AppButton variant="secondary" @click="emit('close')">Cancelar</AppButton>
        <AppButton type="submit" :disabled="saving">Guardar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
