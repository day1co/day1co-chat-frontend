import hljs from 'highlight.js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  highlight(code, lang) {
    const langExists = hljs.getLanguage(lang)
    try {
      if (lang && langExists) {
        return hljs.highlight(lang, code, true).value
      }
    } catch (e) {}
    return hljs.highlightAuto(code).value
  },
  langPrefix: 'hljs language-',
  silent: import.meta.env.NODE_ENV === 'production',
})

const sanitizeOptions = {
  USE_PROFILE: {
    html: true,
    svg: true,
    svgFilters: true,
    mathMl: true,
  },
  ALLOW_DATA_ATTR: false,
}

export default function renderMarkdown(string) {
  const rendered = marked(string)
  const sanitized = DOMPurify.sanitize(rendered, sanitizeOptions)
  return sanitized
}
