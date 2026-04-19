<template>
  <div ref="previewRef" class="vditor-preview-host"></div>
</template>

<script setup lang="ts">
import VditorPreview from 'vditor/dist/method.min'
import 'vditor/dist/index.css'
import mermaid from 'mermaid'

const props = defineProps<{
  markdown: string
}>()

const previewRef = ref<HTMLElement | null>(null)

async function renderMermaidBlocks() {
  if (!previewRef.value) {
    return
  }

  const blocks = previewRef.value.querySelectorAll('pre code.language-mermaid')
  if (!blocks.length) {
    return
  }

  mermaid.initialize({ startOnLoad: false, theme: 'neutral' })

  for (const [index, block] of Array.from(blocks).entries()) {
    const source = block.textContent || ''
    const id = `mermaid-${Date.now()}-${index}`

    try {
      const { svg } = await mermaid.render(id, source)
      const host = document.createElement('div')
      host.className = 'mermaid-box'
      host.innerHTML = svg
      block.parentElement?.replaceWith(host)
    } catch {
      // Keep original mermaid source block on render failure.
    }
  }
}

function render() {
  if (!previewRef.value) {
    return
  }

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
      renderMermaidBlocks()
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
