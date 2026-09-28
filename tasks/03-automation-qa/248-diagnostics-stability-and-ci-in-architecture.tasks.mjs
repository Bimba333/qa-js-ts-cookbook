export default [
  {
    id: 'qa-248-three-identities',
    title: 'Три идентичности одного падения',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `buildFailureRecord(run, entity, attempt)`, которая ' +
      'собирает запись о падении. `run` — `{ project, shard, workerIndex, retry, commit }`, ' +
      '`entity` — `{ id }` созданной сущности либо `null`, `attempt` — ' +
      '`{ correlationId, error }`. Верните ' +
      '`{ execution, domain, correlation, comparable }`: строку идентичности ' +
      'запуска `<project>/<shard>/w<workerIndex>/r<retry>`, идентификатор ' +
      'сущности либо `null`, связывающий идентификатор и признак ' +
      '`comparable` — можно ли сравнивать этот запуск с другим. Сравнивать ' +
      'можно только запуски одного `commit` и одного `project`, поэтому ' +
      '`comparable` — строка `<commit>@<project>`. Отсутствующий ' +
      '`correlationId` даёт `Error` с сообщением `нет связывающего идентификатора`.',
    starter: `function buildFailureRecord(run, entity, attempt) {
  // Три идентичности отвечают на разные вопросы и не заменяют друг друга.

  return { execution: '', domain: null, correlation: '', comparable: '' };
}`,
    hints: [
      'Идентичность запуска меняется при повторе, идентичность сущности — нет: в этом и разница.',
      'Связывающий идентификатор обязателен: без него записи журнала нельзя собрать вместе.',
      'Признак сопоставимости не включает номер повтора — иначе сравнивать станет нечего.'
    ],
    tests: [
      {
        name: 'идентичность запуска собирается по порядку',
        code: `expect(buildFailureRecord(
  { project: 'ui', shard: '1-of-2', workerIndex: 3, retry: 0, commit: 'abc' },
  { id: 't-1' },
  { correlationId: 'c-1', error: 'упало' }
).execution).toBe('ui/1-of-2/w3/r0');`
      },
      {
        name: 'идентичность сущности переносится',
        code: `expect(buildFailureRecord(
  { project: 'ui', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'abc' },
  { id: 't-42' },
  { correlationId: 'c-1' }
).domain).toBe('t-42');`
      },
      {
        name: 'без созданной сущности домен пуст',
        code: `expect(buildFailureRecord(
  { project: 'api', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'abc' },
  null,
  { correlationId: 'c-1' }
).domain).toBe(null);`
      },
      {
        name: 'повтор меняет идентичность запуска, но не сопоставимость',
        code: `const base = { project: 'ui', shard: '1-of-1', workerIndex: 0, commit: 'abc' };
const first = buildFailureRecord({ ...base, retry: 0 }, null, { correlationId: 'c-1' });
const second = buildFailureRecord({ ...base, retry: 1 }, null, { correlationId: 'c-2' });
expect(first.execution === second.execution).toBe(false);
expect(first.comparable).toBe(second.comparable);`
      },
      {
        name: 'другой коммит делает запуски несопоставимыми',
        code: `const left = buildFailureRecord(
  { project: 'ui', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'abc' },
  null, { correlationId: 'c-1' }
);
const right = buildFailureRecord(
  { project: 'ui', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'def' },
  null, { correlationId: 'c-2' }
);
expect(left.comparable === right.comparable).toBe(false);`
      },
      {
        name: 'связывающий идентификатор переносится',
        code: `expect(buildFailureRecord(
  { project: 'ui', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'abc' },
  null, { correlationId: 'c-99' }
).correlation).toBe('c-99');`
      },
      {
        name: 'без связывающего идентификатора — ошибка',
        code: `expect(() => buildFailureRecord(
  { project: 'ui', shard: '1-of-1', workerIndex: 0, retry: 0, commit: 'abc' },
  null, {}
)).toThrow('нет связывающего идентификатора');`
      }
    ],
    solution: `function buildFailureRecord(run, entity, attempt) {
  if (typeof attempt?.correlationId !== 'string' || attempt.correlationId === '') {
    throw new Error('нет связывающего идентификатора');
  }

  return {
    execution: \`\${run.project}/\${run.shard}/w\${run.workerIndex}/r\${run.retry}\`,
    domain: entity?.id ?? null,
    correlation: attempt.correlationId,
    comparable: \`\${run.commit}@\${run.project}\`
  };
}`
  }
]
