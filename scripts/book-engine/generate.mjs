import fs from 'node:fs'
import path from 'node:path'
import { createFileCache } from './cache.mjs'
import { parseSummary } from './parser.mjs'
import { buildChapterMetadata } from './metadata.mjs'
import { applyNavigation } from './navigation.mjs'
import { applyCrossReferences } from './cross-references.mjs'
import { buildStatistics } from './statistics.mjs'
import { applyChapterCardData } from './chapter-cards.mjs'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.vitepress', 'book.generated.mjs')

const fileCache = createFileCache(ROOT)
const summary = fileCache.read('SUMMARY.md')
const parts = parseSummary(summary)
const chapters = []

for (const part of parts) {
  part.sections.forEach((section, sectionIndex) => {
    section.chapters.forEach((chapter, chapterIndex) => {
      chapters.push(buildChapterMetadata(chapter, {
        fileCache,
        partTitle: part.title,
        sectionTitle: section.title,
        sectionIndex,
        chapterIndex
      }))
    })
  })
}

const withNavigation = applyNavigation(chapters)
const withCrossReferences = applyCrossReferences(withNavigation, fileCache)
const withCards = applyChapterCardData(withCrossReferences)
const statistics = buildStatistics(withCards)

const data = {
  cacheReads: fileCache.size(),
  parts,
  chapters: Object.fromEntries(withCards.map(chapter => [chapter.path, chapter])),
  statistics
}

fs.writeFileSync(OUT, `export const bookEngineData = ${JSON.stringify(data, null, 2)}\n`)

console.log(`Generated ${OUT}`)
console.log('Book statistics:')
console.log(`- Chapters: ${statistics.chapters}`)
console.log(`- Tasks: ${statistics.tasks}`)
console.log(`- Solutions: ${statistics.solutions}`)
console.log(`- Examples: ${statistics.examples}`)
console.log(`- Mermaid: ${statistics.mermaid}`)
console.log(`- Mini-projects: ${statistics.miniProjects}`)
console.log(`- Reading time: ${statistics.readingMinutes} min`)
console.log(`- Cached file reads: ${fileCache.size()}`)
