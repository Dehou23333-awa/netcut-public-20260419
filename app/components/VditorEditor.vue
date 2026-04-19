<template>
  <div ref="container" class="vditor-wrapper"></div>
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'

interface Props {
  modelValue: string
  placeholder?: string
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '正文内容...',
  height: 'auto'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const container = ref<HTMLElement | null>(null)
let vditor: Vditor | null = null

onMounted(() => {
  if (!container.value) return

  vditor = new Vditor(container.value, {
    mode: 'ir', // Instant Rendering mode (类似 Typora)
    height: props.height,
    placeholder: props.placeholder,
    value: props.modelValue,
    minHeight: 300,
    tab: '\t',
    toolbarConfig: {
      pin: false
    },
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'list',
      'ordered-list',
      'check',
      '|',
      'code',
      'inline-code',
      'link',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'edit-mode',
      'preview',
      'outline'
    ],
    cache: {
      enable: false
    },
    preview: {
      delay: 0,
      markdown: {
        autoSpace: false,
        gfmAutoLink: true,
        fixTermTypo: false
      }
    },
    input(value: string) {
      emit('update:modelValue', value)
    },
    after() {
      // Editor initialized
    }
  })
})

onUnmounted(() => {
  if (vditor) {
    vditor.destroy()
    vditor = null
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

// Expose Vditor instance for external control if needed
defineExpose({
  getVditor: () => vditor,
  getValue: () => vditor?.getValue() || '',
  setValue: (value: string) => vditor?.setValue(value)
})
</script>

<style scoped>
.vditor-wrapper {
  width: 100%;
}

:deep(.vditor) {
  border: none;
  background: transparent;
}

:deep(.vditor-ir) {
  background: transparent;
}

:deep(.vditor-toolbar) {
  border-bottom: 1px solid var(--line);
  background: transparent;
}

:deep(.vditor-content) {
  background: transparent;
}
</style>
