<template>
  <section class="panel preview" ref="previewRef" v-html="html"></section>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'

const props = defineProps<{ html: string }>()
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
      const pre = block.parentElement
      pre?.replaceWith(host)
    } catch {
      // Keep source block if diagram rendering fails.
    }
  }
}

watch(
  () => props.html,
  () => {
    nextTick(() => {
      renderMermaidBlocks()
    })
  },
  { immediate: true }
)
</script>
