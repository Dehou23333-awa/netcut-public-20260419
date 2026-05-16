<template>
  <section class="panel preview" ref="previewRef" v-html="sanitizedHtml"></section>
</template>

<script setup lang="ts">
const props = defineProps<{ html: string }>()
const previewRef = ref<HTMLElement | null>(null)
const { renderMermaidBlocks } = useMermaid()

const sanitizedHtml = computed(() => {
  return props.html
    .replace(/<\/?(?:script|iframe|object|embed|form|input|style|link|meta|base)\b[^>]*>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
})

watch(
  () => sanitizedHtml.value,
  () => {
    nextTick(() => {
      renderMermaidBlocks(previewRef.value)
    })
  },
  { immediate: true }
)
</script>
