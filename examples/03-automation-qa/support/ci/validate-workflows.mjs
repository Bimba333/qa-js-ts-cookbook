import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(dirname(fileURLToPath(import.meta.url)), "../..");

assert(
  !`${moduleDirectory}${sep}`.includes(`${sep}.github${sep}workflows${sep}`),
  "educational workflow fixtures must not be validated from an active .github/workflows path",
);

const expectedFixtures = new Map([
  ["chapter-240/01-playwright-pipeline.workflow.yml", {
    name: "Educational Playwright pipeline",
    triggers: { push: { branches: ["main"] }, pull_request: null, workflow_dispatch: null },
    job: "test",
    actions: ["actions/checkout@v6", "actions/setup-node@v6"],
  }],
  ["chapter-241/01-browser-setup.workflow.yml", {
    name: "Educational browser setup",
    triggers: { workflow_dispatch: null },
    job: "browser-test",
    actions: ["actions/checkout@v6", "actions/setup-node@v6"],
  }],
  ["chapter-242/01-environment-and-secrets.workflow.yml", {
    name: "Educational environment contract",
    triggers: { workflow_dispatch: null },
    job: "validate-environment",
    actions: ["actions/checkout@v6", "actions/setup-node@v6"],
  }],
  ["chapter-243/01-artifacts-and-reports.workflow.yml", {
    name: "Educational diagnostic artifacts",
    triggers: { workflow_dispatch: null },
    job: "diagnostics",
    actions: ["actions/checkout@v6", "actions/setup-node@v6", "actions/upload-artifact@v6"],
  }],
  ["chapter-244/01-sharded-diagnostics.workflow.yml", {
    name: "Educational sharded diagnostics",
    triggers: { pull_request: null, schedule: [{ cron: "17 3 * * 1-5" }], workflow_dispatch: null },
    job: "shard",
    actions: ["actions/checkout@v6", "actions/setup-node@v6", "actions/upload-artifact@v6"],
  }],
]);

const allowedActions = new Set([
  "actions/checkout@v6",
  "actions/setup-node@v6",
  "actions/upload-artifact@v6",
]);

const environmentValidationCommand = `set -euo pipefail
require_non_blank() {
  local value="\${!1-}"
  test -n "\${value//[[:space:]]/}"
}
require_non_blank API_BASE_URL
require_non_blank API_TOKEN
`;

const allowedCommands = new Set([
  "npm ci",
  "npm run docs:ts:smoke",
  "npm run test:playwright",
  "npx playwright install --with-deps chromium",
  "npx playwright test --config=examples/03-automation-qa/playwright.stability.config.ts",
  "npx playwright test --config=examples/03-automation-qa/playwright.diagnostics.config.ts",
  'npx playwright test --config=examples/03-automation-qa/playwright.stability.config.ts examples/03-automation-qa/chapter-237 --shard="${{ matrix.shard }}/2"',
  environmentValidationCommand,
]);

const rubyParser = String.raw`
require "json"
require "yaml"

path = ARGV.fetch(0)
source = File.binread(path)
raise "UTF-8 BOM is not allowed" if source.start_with?("\xEF\xBB\xBF".b)
raise "tabs are not allowed" if source.include?("\t")

def inspect_node(node, path)
  raise "#{path}: aliases are not allowed" if node.is_a?(Psych::Nodes::Alias)
  raise "#{path}: anchors are not allowed" if node.respond_to?(:anchor) && node.anchor

  if node.is_a?(Psych::Nodes::Mapping)
    keys = {}
    node.children.each_slice(2) do |key, value|
      name = key.respond_to?(:value) ? key.value : key.to_s
      raise "#{path}: duplicate key #{name}" if keys.key?(name)
      keys[name] = true
      inspect_node(value, "#{path}.#{name}")
    end
  elsif node.respond_to?(:children) && node.children
    node.children.each_with_index { |child, index| inspect_node(child, "#{path}[#{index}]") }
  end
end

stream = Psych.parse_stream(source, filename: path)
inspect_node(stream, path)
data = Psych.safe_load(source, permitted_classes: [], permitted_symbols: [], aliases: false, filename: path)
puts JSON.generate(data)
`;

function parseYaml(filename) {
  try {
    return JSON.parse(execFileSync("ruby", ["-e", rubyParser, filename], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }));
  } catch (error) {
    const detail = error?.stderr?.toString().trim() || error.message;
    throw new Error(`${relative(moduleDirectory, filename)}: YAML parse failed: ${detail}`);
  }
}

function assertPlainObject(value, message) {
  assert(value !== null && typeof value === "object" && !Array.isArray(value), message);
}

function collectRunCommands(steps) {
  return steps.filter((step) => Object.hasOwn(step, "run")).map((step) => step.run);
}

async function discoverFixtures() {
  const discovered = [];
  for (let chapter = 240; chapter <= 244; chapter += 1) {
    const directory = resolve(moduleDirectory, `chapter-${chapter}`);
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".workflow.yml")) {
        discovered.push(relative(moduleDirectory, resolve(directory, entry.name)));
      }
    }
  }
  return discovered.sort();
}

const discoveredFixtures = await discoverFixtures();
assert.deepEqual(discoveredFixtures, [...expectedFixtures.keys()].sort(), "unexpected or missing workflow fixture");

for (const [fixture, expected] of expectedFixtures) {
  const filename = resolve(moduleDirectory, fixture);
  const source = await readFile(filename, "utf8");
  const workflow = parseYaml(filename);

  assertPlainObject(workflow, `${fixture}: workflow root must be a mapping`);
  assert.deepEqual(Object.keys(workflow), ["name", "on", "permissions", "jobs"], `${fixture}: unexpected top-level structure`);
  assert.equal(workflow.name, expected.name, `${fixture}: unexpected workflow name`);
  assert(source.includes('"on":\n'), `${fixture}: on must be quoted for YAML 1.1 parser compatibility`);
  assertPlainObject(workflow.on, `${fixture}: on must remain a string key with a trigger mapping`);
  assert.deepEqual(workflow.on, expected.triggers, `${fixture}: unexpected triggers`);
  assertPlainObject(workflow.permissions, `${fixture}: permissions must be explicit`);
  assert.deepEqual(workflow.permissions, { contents: "read" }, `${fixture}: permissions must be contents: read only`);
  assertPlainObject(workflow.jobs, `${fixture}: jobs must be a mapping`);
  assert.deepEqual(Object.keys(workflow.jobs), [expected.job], `${fixture}: unexpected jobs`);

  const job = workflow.jobs[expected.job];
  assertPlainObject(job, `${fixture}: job must be a mapping`);
  assert.equal(job["runs-on"], "ubuntu-latest", `${fixture}: unexpected runner`);
  assert(Number.isInteger(job["timeout-minutes"]), `${fixture}: timeout-minutes must be an integer`);
  assert(job["timeout-minutes"] > 0 && job["timeout-minutes"] <= 30, `${fixture}: timeout-minutes is unbounded`);
  assert(Array.isArray(job.steps) && job.steps.length > 0, `${fixture}: steps must be non-empty`);

  for (const [index, step] of job.steps.entries()) {
    assertPlainObject(step, `${fixture}: step ${index + 1} must be a mapping`);
    assert.equal(typeof step.name, "string", `${fixture}: step ${index + 1} needs a name`);
    assert(step.name.trim().length > 0, `${fixture}: step ${index + 1} has an empty name`);
    assert(Object.hasOwn(step, "uses") !== Object.hasOwn(step, "run"), `${fixture}: step ${index + 1} needs exactly one of uses or run`);
    if (step.uses) assert(allowedActions.has(step.uses), `${fixture}: unexpected action ${step.uses}`);
  }

  const actions = job.steps.filter((step) => Object.hasOwn(step, "uses")).map((step) => step.uses);
  assert.deepEqual(actions, expected.actions, `${fixture}: missing, duplicate, or reordered action`);

  for (const command of collectRunCommands(job.steps)) {
    assert.equal(typeof command, "string", `${fixture}: run command must be a string`);
    assert(allowedCommands.has(command), `${fixture}: unexpected run command ${command}`);
    assert(!/\|\|\s*true|set\s+\+e|\bsleep\b|curl\s+[^\n]*\|\s*(?:sh|bash)|\beval\b|npm\s+publish|git\s+(?:reset|clean)/.test(command), `${fixture}: unsafe shell command`);
  }

  assert(!/ghp_|github_pat_|AKIA|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/.test(source), `${fixture}: secret-like literal`);
  assert(!/pull_request_target|repository_dispatch|release:|write-all|contents:\s*write|id-token:\s*write|continue-on-error/.test(source), `${fixture}: unsafe trigger, permission, or failure handling`);
  assert(!/actions\/deploy|npm\s+publish|docker\s+push|kubectl|terraform/.test(source), `${fixture}: deployment scope leakage`);
}

const environmentWorkflow = parseYaml(resolve(moduleDirectory, "chapter-242/01-environment-and-secrets.workflow.yml"));
const validationStep = environmentWorkflow.jobs["validate-environment"].steps.find((step) => step.name === "Validate required configuration");
assert.deepEqual(validationStep.env, {
  API_BASE_URL: "${{ vars.API_BASE_URL }}",
  API_TOKEN: "${{ secrets.API_TOKEN }}",
});
assert(validationStep.run.includes("set -euo pipefail"));
assert(validationStep.run.includes("require_non_blank API_BASE_URL"));
assert(validationStep.run.includes("require_non_blank API_TOKEN"));

for (const step of environmentWorkflow.jobs["validate-environment"].steps) {
  if (step.name !== "Validate required configuration") {
    assert(!Object.hasOwn(step, "env"), `chapter-242: secrets must be scoped to the validation step`);
  }
}

const artifactWorkflow = parseYaml(resolve(moduleDirectory, "chapter-243/01-artifacts-and-reports.workflow.yml"));
const artifactStep = artifactWorkflow.jobs.diagnostics.steps.find((step) => step.uses === "actions/upload-artifact@v6");
assert.equal(artifactStep.if, "always()");
assert.deepEqual(artifactStep.with, {
  name: "diagnostics-${{ github.run_id }}",
  path: "test-results/diagnostics",
  "if-no-files-found": "error",
  "retention-days": 7,
});

const shardWorkflow = parseYaml(resolve(moduleDirectory, "chapter-244/01-sharded-diagnostics.workflow.yml"));
assert.deepEqual(shardWorkflow.jobs.shard.strategy, {
  "fail-fast": false,
  matrix: { shard: [1, 2] },
});
const shardUpload = shardWorkflow.jobs.shard.steps.find((step) => step.uses === "actions/upload-artifact@v6");
assert.equal(shardUpload.with.name, "stability-shard-${{ matrix.shard }}-of-2");
assert.equal(shardUpload.with.path, "test-results/stability/passing");
assert.equal(shardUpload.with["if-no-files-found"], "error");
assert.equal(shardUpload.with["retention-days"], 7);

console.log(`CI workflow fixtures: PASS (${expectedFixtures.size})`);
