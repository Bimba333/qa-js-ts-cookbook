export default [
  {
    id: 'qa-233-quarantine-record',
    title: 'Запись карантина с обязательным сроком',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `reviewQuarantine(records, today)` — разбор списка карантина. ' +
      'Запись: `{ testId, reason, owner, until }`, где `until` — дата в виде ' +
      'строки `YYYY-MM-DD`. Верните ' +
      '`{ active, expired, invalid }`: идентификаторы записей, срок которых ещё ' +
      'не истёк (`until` не раньше `today`), истёкших и некорректных. ' +
      'Некорректна запись без `reason`, без `owner`, без `until` или с ' +
      'неразбираемой датой. Некорректная запись в две другие группы не попадает.',
    starter: `function reviewQuarantine(records, today) {
  // Карантин без срока — это потерянный тест, а не отложенный.

  return { active: [], expired: [], invalid: [] };
}`,
    hints: [
      'Сравнивать даты в формате YYYY-MM-DD можно и как строки, но надёжнее разобрать их.',
      'Пустая строка в поле причины — это отсутствие причины.',
      'Проверка корректности выполняется до проверки срока.'
    ],
    tests: [
      {
        name: 'срок не истёк',
        code: `expect(reviewQuarantine([
  { testId: 'T-1', reason: 'сеть', owner: 'команда', until: '2026-10-01' }
], '2026-09-23')).toEqual({ active: ['T-1'], expired: [], invalid: [] });`
      },
      {
        name: 'срок истёк',
        code: `expect(reviewQuarantine([
  { testId: 'T-2', reason: 'сеть', owner: 'команда', until: '2026-09-01' }
], '2026-09-23').expired).toEqual(['T-2']);`
      },
      {
        name: 'последний день срока ещё активен',
        code: `expect(reviewQuarantine([
  { testId: 'T-3', reason: 'сеть', owner: 'команда', until: '2026-09-23' }
], '2026-09-23').active).toEqual(['T-3']);`
      },
      {
        name: 'запись без срока некорректна',
        code: `const result = reviewQuarantine([
  { testId: 'T-4', reason: 'сеть', owner: 'команда' }
], '2026-09-23');
expect(result.invalid).toEqual(['T-4']);
expect(result.active).toEqual([]);
expect(result.expired).toEqual([]);`
      },
      {
        name: 'запись без причины или владельца некорректна',
        code: `const checked = reviewQuarantine([
  { testId: 'T-5', reason: '', owner: 'команда', until: '2026-10-01' },
  { testId: 'T-6', reason: 'сеть', owner: '', until: '2026-10-01' }
], '2026-09-23');
expect(checked.invalid).toEqual(['T-5', 'T-6']);`
      },
      {
        name: 'неразбираемая дата некорректна',
        code: `expect(reviewQuarantine([
  { testId: 'T-7', reason: 'сеть', owner: 'команда', until: 'скоро' }
], '2026-09-23').invalid).toEqual(['T-7']);`
      },
      {
        name: 'группы не пересекаются',
        code: `const mixed = reviewQuarantine([
  { testId: 'A', reason: 'x', owner: 'y', until: '2026-10-01' },
  { testId: 'B', reason: 'x', owner: 'y', until: '2026-01-01' },
  { testId: 'C', reason: 'x', owner: 'y' }
], '2026-09-23');
expect(mixed.active.concat(mixed.expired, mixed.invalid)).toEqual(['A', 'B', 'C']);`
      }
    ],
    solution: `function reviewQuarantine(records, today) {
  const active = [];
  const expired = [];
  const invalid = [];

  const limit = new Date(today).getTime();

  for (const record of records) {
    const { testId, reason, owner, until } = record;

    const hasFields = Boolean(reason) && Boolean(owner) && Boolean(until);
    const deadline = hasFields ? new Date(until).getTime() : Number.NaN;

    if (!hasFields || Number.isNaN(deadline)) {
      invalid.push(testId);
      continue;
    }

    if (deadline >= limit) {
      active.push(testId);
    } else {
      expired.push(testId);
    }
  }

  return { active, expired, invalid };
}`
  }
]
