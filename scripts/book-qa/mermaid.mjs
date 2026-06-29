import { fencedBlocks, readText, walk } from './report.mjs'

function countBySection(file) {
  if (file.startsWith('docs/00-introduction/')) {
    return 'Введение'
  }

  if (file.startsWith('docs/01-javascript/')) {
    return 'JavaScript'
  }

  if (file.startsWith('practice/')) {
    return 'Практика'
  }

  if (file.startsWith('solutions/')) {
    return 'Решения'
  }

  return 'Другое'
}

export async function checkMermaid(context) {
  const { root, report } = context
  const files = walk(root, '.', file => file.endsWith('.md'))
  const totals = new Map()
  let mermaidApi = null
  let mermaidParserDisabled = false

  try {
    const mermaid = await import('mermaid')
    mermaidApi = mermaid.default?.mermaidAPI || mermaid.mermaidAPI || null
  } catch {
    report.warn('Mermaid package недоступен для глубокой проверки синтаксиса')
  }

  for (const file of files) {
    const markdown = readText(root, file)

    for (const block of fencedBlocks(markdown)) {
      const info = block.info.trim()

      if (info === 'mermaid') {
        if (!block.body.trim()) {
          report.fail('Mermaid', `Пустой Mermaid-блок: ${file}`)
        }

        const section = countBySection(file)
        totals.set(section, (totals.get(section) || 0) + 1)

        if (mermaidApi?.parse) {
          try {
            await mermaidApi.parse(block.body)
          } catch (error) {
            if (/DOMPurify/.test(error.message)) {
              if (!mermaidParserDisabled) {
                report.warn('Mermaid package загружен, но parser недоступен в текущей Node-среде без DOMPurify')
                mermaidParserDisabled = true
              }

              mermaidApi = null
            } else {
              report.warn(`Mermaid parse warning: ${file} (${error.message})`)
            }
          }
        }
      }

      if (info === 'text' && /flowchart|sequenceDiagram|stateDiagram-v2|classDiagram/.test(block.body)) {
        report.fail('Mermaid', `Mermaid-синтаксис находится внутри text fence: ${file}`)
      }

      if (info === 'text' && /[A-Za-zА-Яа-я0-9`)]\s*(?:->|↓|→)\s*[A-Za-zА-Яа-я0-9`(]/.test(block.body) && markdown.includes('```mermaid')) {
        report.warn(`Возможная ASCII-диаграмма рядом с Mermaid: ${file}`)
      }
    }
  }

  context.mermaidTotals = Object.fromEntries(totals)

  if (!report.checks.some(check => check.name === 'Mermaid' && check.status === 'FAIL')) {
    report.ok('Mermaid')
  }
}
