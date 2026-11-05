<script setup>
import { computed, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { EMPLOYEE_STATUS_OPTIONS } from '@/constants/catalogs'
import { todayIso } from '@/utils/date'
import { hasErrors, validateEmployee } from '@/utils/validators'

const props = defineProps({
  open: { type: Boolean, default: false },
  employee: { type: Object, default: null },
  departments: { type: Array, default: () => [] },
  positions: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit', 'department-change'])

const errors = ref({})
const form = reactive(emptyForm())

const title = computed(() => (props.employee ? 'Editar empleado' : 'Nuevo empleado'))
const filteredPositions = computed(() =>
  props.positions.filter((position) => !form.departmentId || position.departmentId === Number(form.departmentId)),
)

watch(
  () => [props.open, props.employee],
  () => {
    Object.assign(form, props.employee ? mapEmployee(props.employee) : emptyForm())
    errors.value = {}
  },
)

function onDepartmentChange() {
  form.positionId = ''
  emit('department-change', form.departmentId)
}

function emptyForm() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    positionId: '',
    hireDate: todayIso(),
    status: 'active',
    salary: '',
  }
}

function mapEmployee(employee) {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    departmentId: String(employee.departmentId),
    positionId: String(employee.positionId),
    hireDate: employee.hireDate,
    status: employee.status,
    salary: employee.salary,
  }
}

function submit() {
  console.log("Props employee:", props.employee)
  errors.value = validateEmployee(form)
  if (hasErrors(errors.value)) return
  emit('submit', {
    ...form,
    employeeNumber: props.employee?.employeeNumber,
    departmentId: Number(form.departmentId),
    positionId: Number(form.positionId),
    salary: Number(form.salary),
  })
}
</script>

<template>
  <AppModal
    :open="open"
    :title="title"
    subtitle="Los campos se validan en el cliente; las reglas de negocio las resuelve la API."
    @close="emit('close')"
  >
    <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <AppInput id="employee-first-name" v-model="form.firstName" label="Nombre" :error="errors.firstName" />
      <AppInput id="employee-last-name" v-model="form.lastName" label="Apellidos" :error="errors.lastName" />
      <AppInput id="employee-email" v-model="form.email" label="Correo" type="email" :error="errors.email" />
      <AppInput id="employee-phone" v-model="form.phone" label="Teléfono" />
      <AppSelect
        id="employee-department"
        v-model="form.departmentId"
        label="Departamento"
        :error="errors.departmentId"
        @change="onDepartmentChange"
      >
        <option v-for="department in departments" :key="department.id" :value="String(department.id)">
          {{ department.name }}
        </option>
      </AppSelect>
      <AppSelect id="employee-position" v-model="form.positionId" label="Puesto" :error="errors.positionId">
        <option v-for="position in filteredPositions" :key="position.id" :value="String(position.id)">
          {{ position.name }}
        </option>
      </AppSelect>
      <AppInput id="employee-hire-date" v-model="form.hireDate" label="Fecha de ingreso" type="date" :error="errors.hireDate" />
      <AppSelect
        id="employee-status"
        v-model="form.status"
        label="Estatus"
        :options="EMPLOYEE_STATUS_OPTIONS"
        :error="errors.status"
      />
      <AppInput id="employee-salary" v-model="form.salary" label="Salario mensual" type="number" :error="errors.salary" />
      <div class="flex justify-end gap-2 sm:col-span-2">
        <AppButton variant="secondary" @click="emit('close')">Cancelar</AppButton>
        <AppButton type="submit" :disabled="saving">Guardar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
