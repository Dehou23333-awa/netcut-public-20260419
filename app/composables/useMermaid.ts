import mermaid from 'mermaid'

export function useMermaid() {
  async function renderMermaidBlocks(container: HTMLElement | null) {
    if (!container) return

    const blocks = container.querySelectorAll('pre code.language-mermaid')
    if (!blocks.length) return

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
        /* keep source block on render failure */
      }
    }
  }

  return { renderMermaidBlocks }
}
