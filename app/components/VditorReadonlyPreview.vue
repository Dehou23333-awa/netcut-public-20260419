<template>
  <div ref="previewRef" class="vditor-preview-host"></div>
</template>

<script setup lang="ts">
import VditorPreview from 'vditor/dist/method.min'
import 'vditor/dist/index.css'

const props = defineProps<{
  markdown: string
}>()

const previewRef = ref<HTMLElement | null>(null)
const { renderMermaidBlocks } = useMermaid()

function render() {
  if (!previewRef.value) return

  VditorPreview.preview(previewRef.value, props.markdown || '', {
    mode: 'light',
    math: {
      engine: 'KaTeX'
    },
    markdown: {
      autoSpace: false,
      gfmAutoLink: true,
      sanitize: true
    },
    hljs: {
      enable: true,
      style: 'github'
    },
    after() {
      renderMermaidBlocks(previewRef.value)
    }
  })
}

watch(
  () => props.markdown,
  () => {
    nextTick(() => {
      render()
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.vditor-preview-host {
  width: 100%;
  background: transparent;
}

:deep(.vditor-reset) {
  background: transparent;
  color: var(--ink);
}
</style>
