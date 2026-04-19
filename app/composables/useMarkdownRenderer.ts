import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import DOMPurify from 'isomorphic-dompurify'

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true
}).use(markdownItKatex)

export function renderMarkdown(raw: string) {
  const rendered = md.render(raw || '')
  return DOMPurify.sanitize(rendered)
}
