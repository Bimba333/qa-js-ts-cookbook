import fs from 'node:fs'
import path from 'node:path'

export function createFileCache(root = process.cwd()) {
  const cache = new Map()

  function absolute(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.join(root, filePath)
  }

  function exists(filePath) {
    return fs.existsSync(absolute(filePath))
  }

  function read(filePath) {
    const absPath = absolute(filePath)

    if (!cache.has(absPath)) {
      cache.set(absPath, fs.existsSync(absPath) ? fs.readFileSync(absPath, 'utf8') : '')
    }

    return cache.get(absPath)
  }

  return {
    exists,
    read,
    size: () => cache.size
  }
}
