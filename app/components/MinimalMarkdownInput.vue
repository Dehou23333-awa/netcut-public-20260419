<template>
  <div ref="container" class="minimal-vditor"></div>
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start typing...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const container = ref<HTMLElement | null>(null)
let vditor: Vditor | null = null

onMounted(() => {
  if (!container.value) return

  vditor = new Vditor(container.value, {
    mode: 'ir',
    height: 400,
    placeholder: props.placeholder,
    value: props.modelValue,
    minHeight: 300,
    tab: '\t',
    toolbarConfig: {
      hide: true
    },
    toolbar: [],
    cache: { enable: false },
    preview: {
      delay: 0,
      markdown: {
        autoSpace: false,
        gfmAutoLink: true
      }
    },
    input(value: string) {
      emit('update:modelValue', value)
    }
  })
})

onUnmounted(() => {
  if (vditor) {
    vditor.destroy()
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (vditor && vditor.getValue() !== newValue) {
      vditor.setValue(newValue)
    }
  }
)
</script>

<style scoped>
.minimal-vditor {
  width: 100%;
  border: 0 !important;
  outline: 0 !important;
}

:deep(.vditor) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0;
}

:deep(.vditor-ir) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0;
}

:deep(.vditor-content) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0;
}

:deep(.vditor-reset) {
  background: transparent !important;
}

:deep(.vditor-reset--ir) {
  background: transparent !important;
}

:deep(.vditor-ir__node) {
  background: transparent !important;
}

:deep(.vditor-ir pre.vditor-reset) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.vditor-ir pre.vditor-reset:focus) {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.vditor-ir__marker) {
  border: none !important;
}

:deep(.vditor-toolbar) {
  display: none;
}

:deep(.vditor-resize) {
  display: none;
}

:deep(.vditor-divider) {
  display: none;
}

:deep(h1) {
  font-size: 1.8em;
  font-weight: 700;
  margin: 0.2em 0;
}

:deep(h2) {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.2em 0;
}

:deep(h3) {
  font-size: 1.3em;
  font-weight: 700;
  margin: 0.2em 0;
}
</style>
