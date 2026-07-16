import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const supportDirectory = dirname(fileURLToPath(import.meta.url));

const layers = new Map([
  ["contracts.ts", 0],
  ["adapters.ts", 1],
  ["task-scenario.ts", 2],
  ["composition-root.ts", 3],
  ["fixtures.ts", 4],
  ["architecture-review.ts", 2],
]);

export function validateGraph(graph, layerByNode) {
  const visiting = new Set();
  const visited = new Set();

  function visit(node, path) {
    if (visiting.has(node)) {
      throw new Error(`Циклическая зависимость: ${[...path, node].join(" -> ")}`);
    }
    if (visited.has(node)) return;
    visiting.add(node);

    for (const dependency of [...(graph.get(node) ?? [])].sort()) {
      assert(layerByNode.has(dependency), `Неизвестная module dependency: ${dependency}`);
      assert(
        layerByNode.get(dependency) <= layerByNode.get(node),
        `Запрещённое направление импорта: ${node} -> ${dependency}`,
      );
      visit(dependency, [...path, node]);
    }

    visiting.delete(node);
    visited.add(node);
  }

  for (const node of [...graph.keys()].sort()) visit(node, []);
}

export async function buildGraph(
  directory = supportDirectory,
  layerByNode = layers,
) {
  const graph = new Map();
  const entries = await readdir(directory, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(sourceFiles, [...layerByNode.keys()].sort(), "Неожиданный набор integration files");

  for (const entry of entries.filter((item) => item.isFile() && layerByNode.has(item.name))) {
    const source = await readFile(resolve(directory, entry.name), "utf8");
    const dependencies = [...source.matchAll(
      /(?:from\s+|import\s*(?:\(\s*)?)["'](\.{1,2}\/[^"']+)\.js["']/g,
    )]
      .map((match) => resolve(directory, `${match[1]}.ts`))
      .filter((dependencyPath) => dirname(dependencyPath) === directory)
      .map((dependencyPath) => relative(directory, dependencyPath));

    for (const dependency of dependencies) {
      assert(
        layerByNode.has(dependency),
        `Неизвестная module dependency: ${entry.name} -> ${dependency}`,
      );
    }
    graph.set(entry.name, new Set(dependencies));
  }
  return graph;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const graph = await buildGraph();
  assert.deepEqual([...graph.keys()].sort(), [...layers.keys()].sort(), "Неполный integration graph");
  validateGraph(graph, layers);
  console.log(`Integration dependency graph: PASS (${graph.size} files, ${relative(process.cwd(), supportDirectory)})`);
}
