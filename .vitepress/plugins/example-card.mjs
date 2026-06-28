export function exampleCardPlugin(md) {
  const defaultFence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const content = token.content.trim()

    const isExamplePath =
      /^examples\/.+\.(js|ts|json|md)$/.test(content) &&
      !content.includes('\n')

    if (!isExamplePath) {
      return defaultFence(tokens, idx, options, env, self)
    }

    const escapedPath = md.utils.escapeHtml(content)

    return `
<div class="example-card">
  <div class="example-card__label">Файл примера</div>
  <code class="example-card__path">${escapedPath}</code>
  <div class="example-card__actions">
    <a href="/qa-javascript-book/${escapedPath}" target="_blank" rel="noreferrer">Открыть файл</a>
  </div>
</div>
`
  }
}
