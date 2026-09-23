export default [
  {
    id: 'qa-243-artifact-plan',
    title: 'Что сохранять после прогона',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `planUpload(run)`, где `run` — `{ status, artifacts, retentionDays }`, ' +
      'а `artifacts` — массив `{ name, path, exists, sizeBytes, onlyOnFailure }`. ' +
      'Верните `{ upload, skipped, warnings, retentionDays }`: имена артефактов к ' +
      'сохранению, имена пропущенных и предупреждения. Правила: артефакт с ' +
      '`onlyOnFailure` сохраняется лишь при `status === "failed"`; ' +
      'несуществующий артефакт не сохраняется, но даёт предупреждение ' +
      '`<name>: файл не создан`; пустой файл (`sizeBytes` равен нулю) сохраняется ' +
      'с предупреждением `<name>: файл пуст`. Срок хранения меньше единицы ' +
      'заменяется на `1` с предупреждением `срок хранения увеличен до 1 дня`.',
    starter: `function planUpload(run) {
  // Молча пропущенный артефакт превращает расследование в гадание.

  return { upload: [], skipped: [], warnings: [], retentionDays: 1 };
}`,
    hints: [
      'Пропуск по условию и пропуск из-за отсутствия файла — разные случаи.',
      'Пустой файл всё равно сохраняется: его отсутствие и его пустота — разные сигналы.',
      'Предупреждение о сроке хранения добавляется один раз, а не на каждый артефакт.'
    ],
    tests: [
      {
        name: 'успешный прогон: сохраняется только общее',
        code: `expect(planUpload({
  status: 'passed',
  retentionDays: 7,
  artifacts: [
    { name: 'report', path: 'r', exists: true, sizeBytes: 100, onlyOnFailure: false },
    { name: 'trace', path: 't', exists: true, sizeBytes: 100, onlyOnFailure: true }
  ]
})).toEqual({ upload: ['report'], skipped: ['trace'], warnings: [], retentionDays: 7 });`
      },
      {
        name: 'при падении сохраняется всё',
        code: `const failed = planUpload({
  status: 'failed',
  retentionDays: 3,
  artifacts: [
    { name: 'report', path: 'r', exists: true, sizeBytes: 10, onlyOnFailure: false },
    { name: 'trace', path: 't', exists: true, sizeBytes: 10, onlyOnFailure: true }
  ]
});
expect(failed.upload).toEqual(['report', 'trace']);
expect(failed.skipped).toEqual([]);`
      },
      {
        name: 'отсутствующий файл даёт предупреждение',
        code: `const missing = planUpload({
  status: 'failed',
  retentionDays: 1,
  artifacts: [{ name: 'trace', path: 't', exists: false, sizeBytes: 0, onlyOnFailure: true }]
});
expect(missing.upload).toEqual([]);
expect(missing.skipped).toEqual(['trace']);
expect(missing.warnings).toEqual(['trace: файл не создан']);`
      },
      {
        name: 'пустой файл сохраняется с предупреждением',
        code: `const empty = planUpload({
  status: 'passed',
  retentionDays: 1,
  artifacts: [{ name: 'report', path: 'r', exists: true, sizeBytes: 0, onlyOnFailure: false }]
});
expect(empty.upload).toEqual(['report']);
expect(empty.warnings).toEqual(['report: файл пуст']);`
      },
      {
        name: 'срок хранения не может быть меньше суток',
        code: `const short = planUpload({ status: 'passed', retentionDays: 0, artifacts: [] });
expect(short.retentionDays).toBe(1);
expect(short.warnings).toEqual(['срок хранения увеличен до 1 дня']);`
      },
      {
        name: 'предупреждение о сроке добавляется один раз',
        code: `const many = planUpload({
  status: 'passed',
  retentionDays: -5,
  artifacts: [
    { name: 'a', path: 'a', exists: true, sizeBytes: 1, onlyOnFailure: false },
    { name: 'b', path: 'b', exists: true, sizeBytes: 1, onlyOnFailure: false }
  ]
});
expect(many.warnings).toEqual(['срок хранения увеличен до 1 дня']);`
      }
    ],
    solution: `function planUpload(run) {
  const { status, artifacts, retentionDays } = run;

  const upload = [];
  const skipped = [];
  const warnings = [];

  for (const artifact of artifacts) {
    if (artifact.onlyOnFailure && status !== 'failed') {
      skipped.push(artifact.name);
      continue;
    }

    if (!artifact.exists) {
      skipped.push(artifact.name);
      warnings.push(artifact.name + ': файл не создан');
      continue;
    }

    if (artifact.sizeBytes === 0) {
      warnings.push(artifact.name + ': файл пуст');
    }

    upload.push(artifact.name);
  }

  let days = retentionDays;

  if (days < 1) {
    days = 1;
    warnings.push('срок хранения увеличен до 1 дня');
  }

  return { upload, skipped, warnings, retentionDays: days };
}`
  }
]
