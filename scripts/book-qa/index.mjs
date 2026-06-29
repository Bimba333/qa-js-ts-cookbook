import childProcess from 'node:child_process'
import { checkExamples } from './examples.mjs'
import { checkFiles } from './files.mjs'
import { checkLinks } from './links.mjs'
import { checkMarkdown } from './markdown.mjs'
import { checkMermaid } from './mermaid.mjs'
import { checkPracticeSolutions } from './practice-solutions.mjs'
import { printReport, createReport } from './report.mjs'
import { checkSidebar } from './sidebar.mjs'

const root = process.cwd()
const report = createReport()
const context = { root, report }

const fileData = checkFiles(context)
Object.assign(context, fileData)

checkMarkdown(context)
checkLinks(context)
checkPracticeSolutions(context)
checkExamples(context)
await checkMermaid(context)
await checkSidebar(context)

const build = childProcess.spawnSync('npm', ['run', 'docs:build'], {
  cwd: root,
  encoding: 'utf8'
})

if (build.status === 0) {
  report.ok('Build')
} else {
  report.fail('Build', `docs:build завершился с ошибкой:\n${build.stderr || build.stdout}`)
}

if (context.mermaidTotals) {
  for (const [section, total] of Object.entries(context.mermaidTotals)) {
    report.warn(`Mermaid count: ${section} — ${total}`)
  }
}

printReport(report)

if (report.errors.length) {
  process.exit(1)
}

