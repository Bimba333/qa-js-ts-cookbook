export default [
  {
    id: 'fp-259-blocker-cancels-release',
    title: 'Один блокер отменяет выпуск',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `auditVerdict(findings)`. Каждая находка — ' +
      '`{ id, severity, status }`, где `severity` — `blocker`, `major` или ' +
      '`minor`, а `status` — `PASS` или `FAIL`. Верните ' +
      '`{ verdict, weight, blockers }`: `weight` — сумма весов невыполненных ' +
      'находок (блокер 100, major 10, minor 1), `blockers` — отсортированные ' +
      'идентификаторы невыполненных блокеров, а `verdict` — ' +
      '`RELEASE CANDIDATE`, если невыполненных блокеров нет, и ' +
      '`REWORK REQUIRED`, если есть. Сумма весов на вердикт не влияет.',
    starter: `const WEIGHT = { blocker: 100, major: 10, minor: 1 };

function auditVerdict(findings) {
  const failed = findings.filter(finding => finding.status === 'FAIL');
  const weight = failed.reduce((sum, finding) => sum + WEIGHT[finding.severity], 0);

  // Вердикт решает не сумма, а наличие невыполненного блокера.
  return { verdict: weight < 100 ? 'RELEASE CANDIDATE' : 'REWORK REQUIRED', weight, blockers: [] };
}`,
    hints: [
      'Блокеры отбираются отдельно от подсчёта веса.',
      'Девяносто девять minor дают вес 99, но выпуск не отменяют.',
      'Идентификаторы блокеров сортируются обычным sort().'
    ],
    tests: [
      {
        name: 'без невыполненных находок выпуск возможен',
        code: `const clean = [
  { id: 'API-01', severity: 'blocker', status: 'PASS' },
  { id: 'UI-02', severity: 'minor', status: 'PASS' }
];
expect(auditVerdict(clean)).toEqual({
  verdict: 'RELEASE CANDIDATE',
  weight: 0,
  blockers: []
});`
      },
      {
        name: 'один невыполненный блокер отменяет выпуск',
        code: `const blocked = [{ id: 'PORT-01', severity: 'blocker', status: 'FAIL' }];
const blockedVerdict = auditVerdict(blocked);
expect(blockedVerdict.verdict).toBe('REWORK REQUIRED');
expect(blockedVerdict.blockers).toEqual(['PORT-01']);`
      },
      {
        name: 'большая сумма весов без блокеров выпуск не отменяет',
        code: `const heavy = [];
for (let index = 0; index < 30; index += 1) {
  heavy.push({ id: 'MIN-' + index, severity: 'major', status: 'FAIL' });
}
const heavyVerdict = auditVerdict(heavy);
expect(heavyVerdict.weight).toBe(300);
expect(heavyVerdict.verdict).toBe('RELEASE CANDIDATE');`
      },
      {
        name: 'вес считается только по невыполненным',
        code: `const mixed = [
  { id: 'A', severity: 'major', status: 'FAIL' },
  { id: 'B', severity: 'minor', status: 'FAIL' },
  { id: 'C', severity: 'blocker', status: 'PASS' }
];
expect(auditVerdict(mixed).weight).toBe(11);`
      },
      {
        name: 'блокеры отсортированы',
        code: `const twoBlockers = [
  { id: 'Z-01', severity: 'blocker', status: 'FAIL' },
  { id: 'A-02', severity: 'blocker', status: 'FAIL' }
];
expect(auditVerdict(twoBlockers).blockers).toEqual(['A-02', 'Z-01']);`
      }
    ],
    solution: `const WEIGHT = { blocker: 100, major: 10, minor: 1 };

function auditVerdict(findings) {
  const failed = findings.filter(finding => finding.status === 'FAIL');

  const weight = failed.reduce((sum, finding) => sum + WEIGHT[finding.severity], 0);

  const blockers = failed
    .filter(finding => finding.severity === 'blocker')
    .map(finding => finding.id)
    .sort();

  return {
    verdict: blockers.length === 0 ? 'RELEASE CANDIDATE' : 'REWORK REQUIRED',
    weight,
    blockers
  };
}`
  },
  {
    id: 'fp-259-observation-needs-evidence',
    title: 'Наблюдение без доказательства не считается',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Аудит не придумывает итог: каждая находка должна опираться на ' +
      'проверяемое доказательство. Напишите `acceptFindings(findings)`, который ' +
      'возвращает `{ accepted, rejected }`. Находка принимается, только если у ' +
      'неё есть непустая команда (`command`) и непустой ожидаемый результат ' +
      '(`expected`). Остальные попадают в `rejected`. В оба массива кладите ' +
      'идентификаторы, порядок — как во входных данных.',
    starter: `function acceptFindings(findings) {
  // Наблюдение без команды и ожидаемого результата воспроизвести нельзя.

  return { accepted: findings.map(finding => finding.id), rejected: [] };
}`,
    hints: [
      'Пустая строка и отсутствующее поле — одинаково негодны.',
      'Достаточно одного отсутствующего поля, чтобы находку отклонить.',
      'Порядок входных данных сохраняется в обоих списках.'
    ],
    tests: [
      {
        name: 'находка с командой и ожиданием принимается',
        code: `const good = [{ id: 'DB-01', command: 'npm run final-project:db', expected: '6 passed' }];
expect(acceptFindings(good)).toEqual({ accepted: ['DB-01'], rejected: [] });`
      },
      {
        name: 'без команды находка отклоняется',
        code: `const noCommand = [{ id: 'UI-09', command: '', expected: 'страница открылась' }];
expect(acceptFindings(noCommand)).toEqual({ accepted: [], rejected: ['UI-09'] });`
      },
      {
        name: 'без ожидаемого результата находка отклоняется',
        code: `const noExpected = [{ id: 'API-03', command: 'npm run final-project:api' }];
expect(acceptFindings(noExpected).rejected).toEqual(['API-03']);`
      },
      {
        name: 'порядок сохраняется',
        code: `const several = [
  { id: 'A', command: 'c', expected: 'e' },
  { id: 'B', command: '', expected: 'e' },
  { id: 'C', command: 'c', expected: 'e' },
  { id: 'D', command: 'c', expected: '' }
];
const orderResult = acceptFindings(several);
expect(orderResult.accepted).toEqual(['A', 'C']);
expect(orderResult.rejected).toEqual(['B', 'D']);`
      }
    ],
    solution: `function acceptFindings(findings) {
  const accepted = [];
  const rejected = [];

  for (const finding of findings) {
    const hasCommand = typeof finding.command === 'string' && finding.command !== '';
    const hasExpected = typeof finding.expected === 'string' && finding.expected !== '';

    if (hasCommand && hasExpected) accepted.push(finding.id);
    else rejected.push(finding.id);
  }

  return { accepted, rejected };
}`
  }
];
