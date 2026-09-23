export default [
  {
    id: 'qa-212-savepoint-rollback',
    title: 'Точка сохранения внутри транзакции',
    difficulty: 'hard',
    lang: 'sql',
    transaction: true,
    prompt:
      'Решение выполняется внутри транзакции, которую проверка всегда ' +
      'откатывает, поэтому писать можно свободно. ' +
      'Создайте таблицу `sandbox.run_notes (id int primary key, note text)`, ' +
      'вставьте строки с `id` 1 и 2, затем поставьте точку сохранения, вставьте ' +
      'строку с `id` 3 и откатитесь к точке сохранения. ' +
      'Последней инструкцией верните колонки `id` и `note` всех оставшихся строк, ' +
      'отсортированные по `id`.',
    starter: `-- Точка сохранения объявляется явно: сама по себе она не появляется.
select 1 as id, 'замените это решением' as note;`,
    hints: [
      'DDL в PostgreSQL тоже участвует в транзакции.',
      'Точка сохранения создаётся инструкцией SAVEPOINT с именем.',
      'Откат к точке сохранения не завершает транзакцию целиком.'
    ],
    tests: [
      {
        name: 'осталось две строки',
        code: `expect(rows).toHaveLength(2);`
      },
      {
        name: 'третья вставка откачена',
        code: `expect(rows.map(row => row.id)).toEqual([1, 2]);`
      },
      {
        name: 'строки содержат заметки',
        code: `expect(rows.every(row => typeof row.note === 'string')).toBe(true);`
      },
      {
        name: 'после проверки таблицы на стенде не остаётся',
        code: `const left = await query(
  "select count(*)::int as total from information_schema.tables " +
  "where table_schema = 'sandbox' and table_name = 'run_notes'"
);
expect(left[0].total).toBe(0);`
      }
    ],
    solution: `create table sandbox.run_notes (id int primary key, note text);

insert into sandbox.run_notes (id, note) values (1, 'первая'), (2, 'вторая');

savepoint before_third;

insert into sandbox.run_notes (id, note) values (3, 'третья');

rollback to savepoint before_third;

select id, note from sandbox.run_notes order by id;`
  }
]
