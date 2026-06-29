const TERMS = [
  { term: 'Execution Context', path: 'docs/01-javascript/03-execution-context.md' },
  { term: 'Call Stack', path: 'docs/01-javascript/04-call-stack.md' },
  { term: 'Scope', path: 'docs/01-javascript/07-scope.md' },
  { term: 'Hoisting', path: 'docs/01-javascript/09-hoisting.md' },
  { term: 'Temporal Dead Zone', path: 'docs/01-javascript/10-temporal-dead-zone.md' },
  { term: 'Closure', path: 'docs/01-javascript/28-closures.md' },
  { term: 'this', path: 'docs/01-javascript/29-this.md' },
  { term: 'Prototype', path: 'docs/01-javascript/39-prototype.md' },
  { term: 'Promise', path: 'docs/01-javascript/72-promise.md' },
  { term: 'Event Loop', path: 'docs/01-javascript/73-event-loop.md' },
  { term: 'Microtask Queue', path: 'docs/01-javascript/75-microtasks.md' },
  { term: 'Macrotask Queue', path: 'docs/01-javascript/76-macrotasks.md' },
  { term: 'async/await', path: 'docs/01-javascript/78-async-await.md' },
  { term: 'Iterable Protocol', path: 'docs/01-javascript/81-iterable-protocol.md' },
  { term: 'Iterator', path: 'docs/01-javascript/82-iterators.md' },
  { term: 'Generator', path: 'docs/01-javascript/83-generators.md' },
  { term: 'Modules', path: 'docs/01-javascript/85-javascript-modules.md' },
  { term: 'Garbage Collector', path: 'docs/01-javascript/87-garbage-collector.md' },
  { term: 'JSON', path: 'docs/01-javascript/94-json.md' },
  { term: 'Date', path: 'docs/01-javascript/95-date.md' }
]

function containsTerm(markdown, term) {
  return markdown.includes(term)
}

export function applyCrossReferences(chapters, fileCache) {
  const byPath = new Map(chapters.map(chapter => [chapter.path, chapter]))

  return chapters.map(chapter => {
    const markdown = fileCache.read(chapter.path)
    const related = []

    for (const item of TERMS) {
      if (item.path === chapter.path || !containsTerm(markdown, item.term)) {
        continue
      }

      const target = byPath.get(item.path)

      if (!target) {
        continue
      }

      related.push({
        term: item.term,
        title: target.title,
        number: target.number,
        link: target.link
      })
    }

    return {
      ...chapter,
      related: related.slice(0, 4)
    }
  })
}
