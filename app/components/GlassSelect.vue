<template>
  <div ref="root" class="glass-select" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button
      type="button"
      class="glass-select-trigger"
      :disabled="disabled"
      :aria-expanded="open"
      @click="toggle"
    >
      <span>{{ selectedLabel }}</span>
      <span class="glass-select-chevron" aria-hidden="true"></span>
    </button>

    <ul v-if="open" class="glass-select-menu" role="listbox">
      <li v-for="option in options" :key="String(option.value)">
        <button
          type="button"
          class="glass-select-option"
          :class="{ 'is-selected': isSelected(option.value) }"
          @click="select(option.value)"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)

const selectedLabel = computed(() => {
  const matched = props.options.find((item) => String(item.value) === String(props.modelValue))
  return matched?.label || ''
})

function isSelected(value: string | number) {
  return String(value) === String(props.modelValue)
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function select(value: string | number) {
  emit('update:modelValue', value)
  open.value = false
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (!root.value || !target) return
  if (!root.value.contains(target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>
