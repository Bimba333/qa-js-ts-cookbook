import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function collectItems(items, result = []) {
  for (const item of items) {
    if (item.link) {
      result.push(item)
    }

    if (item.items) {
      collectItems(item.items, result)
    }
  }

  return result
}

export async function checkSidebar(context) {
  const { root, report } = context
  const result = childProcess.spawnSync('npm', ['run', 'docs:sidebar'], {
    cwd: root,
    encoding: 'utf8'
  })

  if (result.status !== 0) {
    report.fail('Sidebar', `docs:sidebar завершился с ошибкой:\n${result.stderr || result.stdout}`)
    return
  }

  const sidebarPath = path.join(root, '.vitepress/sidebar.generated.ts')
  const bookPath = path.join(root, '.vitepress/book.generated.mjs')

  if (!fs.existsSync(sidebarPath)) {
    report.fail('Sidebar', 'Не найден .vitepress/sidebar.generated.ts')
  }

  if (!fs.existsSync(bookPath)) {
    report.fail('Sidebar', 'Не найден .vitepress/book.generated.mjs')
  }

  if (!fs.existsSync(sidebarPath)) {
    return
  }

  const { sidebar } = await import(`${sidebarPath}?t=${Date.now()}`)
  const items = collectItems(sidebar)

  for (const item of items) {
    const markdownPath = `${item.link.replace(/^\//, '')}.md`

    if (!fs.existsSync(path.join(root, markdownPath))) {
      report.fail('Sidebar', `Sidebar ведет на несуществующий markdown: ${item.link}`)
    }

    if (/(^|\/)(practice|solutions)(\/|$)/.test(item.link)) {
      report.fail('Sidebar', `Sidebar содержит practice/solutions: ${item.link}`)
    }

    if (/^\d+-|\.md$|[-_]{2,}/.test(item.text)) {
      report.warn(`Возможное filename-название в sidebar: ${item.text}`)
    }
  }

  if (!report.checks.some(check => check.name === 'Sidebar' && check.status === 'FAIL')) {
    report.ok('Sidebar')
  }
}
