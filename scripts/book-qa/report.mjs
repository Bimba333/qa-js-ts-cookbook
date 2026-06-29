import fs from 'node:fs'
import path from 'node:path'

export function createReport() {
  const checks = []
  const warnings = []
  const errors = []

  return {
    checks,
    warnings,
    errors,
    ok(name) {
      checks.push({ name, status: 'OK' })
    },
    fail(name, message) {
      if (!checks.some(check => check.name === name && check.status === 'FAIL')) {
        checks.push({ name, status: 'FAIL' })
      }

      errors.push(message)
    },
    warn(message) {
      warnings.push(message)
    }
  }
}

export function printReport(report) {
  console.log('\nBook QA Report\n')

  for (const check of report.checks) {
    console.log(`${check.name}: ${check.status}`)
  }

  console.log('\nWarnings:')

  if (report.warnings.length) {
    for (const warning of report.warnings) {
      console.log(`- ${warning}`)
    }
  } else {
    console.log('- none')
  }

  console.log('\nErrors:')

  if (report.errors.length) {
    for (const error of report.errors) {
      console.log(`- ${error}`)
    }
  } else {
    console.log('- none')
  }
}

export function readText(root, filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8')
}

export function exists(root, filePath) {
  return fs.existsSync(path.join(root, filePath))
}

export function walk(root, dir, predicate = () => true) {
  const base = path.join(root, dir)

  if (!fs.existsSync(base)) {
    return []
  }

  const result = []

  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const fullPath = path.join(base, entry.name)
    const relativePath = path.relative(root, fullPath).replace(/\\/g, '/')

    if (entry.isDirectory()) {
      const segments = relativePath.split('/')

      if (
        segments.includes('node_modules') ||
        segments.includes('.git') ||
        relativePath === '.vitepress/dist' ||
        relativePath === '.vitepress/.temp'
      ) {
        continue
      }

      result.push(...walk(root, relativePath, predicate))
      continue
    }

    if (predicate(relativePath)) {
      result.push(relativePath)
    }
  }

  return result.sort()
}

export function parseSummaryLinks(summary) {
  return [...summary.matchAll(/^\s*\*\s+\[([^\]]+)]\(([^)]+)\)/gm)]
    .map(match => ({
      title: match[1].trim(),
      path: match[2].trim()
    }))
}

export function firstH1(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m)

  return match ? match[1].trim() : ''
}

export function fencedBlocks(markdown) {
  return [...markdown.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)]
    .map(match => ({
      info: match[1].trim(),
      body: match[2]
    }))
}

export function stripFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '')
}

export function unique(values) {
  return [...new Set(values)]
}
