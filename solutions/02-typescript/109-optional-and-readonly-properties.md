# Решения: Optional and Readonly Properties

## Концептуальные вопросы

### 1. Что означает `?` после имени свойства?

Ответ: свойство необязательное.

Объяснение: объект может не содержать это свойство.

Типичная ошибка: обращаться к optional property так, будто она всегда есть.

Связь с Automation QA: error message может быть только у упавшей проверки.

### 2. Что запрещает `readonly`?

Ответ: переназначение свойства через TypeScript-договор.

Объяснение: TypeScript покажет ошибку при попытке изменить readonly property.

Типичная ошибка: считать `readonly` runtime-заморозкой.

Связь с Automation QA: baseUrl в config обычно не должен меняться после загрузки.

### 3. Почему optional property не означает runtime-валидацию?

Ответ: это только правило TypeScript.

Объяснение: runtime-данные все равно нужно проверять отдельно.

Типичная ошибка: считать `?` проверкой внешнего JSON.

Связь с Automation QA: API response требует runtime assertions.

### 4. Почему `readonly` не делает объект неизменяемым в runtime?

Ответ: TypeScript-типы исчезают после компиляции.

Объяснение: `readonly` защищает код на этапе проверки.

Типичная ошибка: ожидать JavaScript-блокировку изменения.

Связь с Automation QA: дисциплина изменения config все равно важна.

### 5. Где optional и readonly свойства полезны в QA-проекте?

Ответ: в metadata, конфигурации и кратких отчетах.

Объяснение: часть данных может отсутствовать, а часть должна быть стабильной.

Типичная ошибка: делать все свойства обязательными или изменяемыми без причины.

Связь с Automation QA: это помогает точнее описывать test results.

## Чтение кода

Ответ: обязательное свойство — `name`, необязательное — `errorMessage`.

Объяснение: знак `?` делает `errorMessage` необязательным.

Типичная ошибка: требовать `errorMessage` у успешного результата.

Связь с Automation QA: сообщение об ошибке обычно нужно только при падении.

## Предскажите результат проверки

Ответ: код согласован.

Объяснение: изменяется `timeoutMs`, а он не readonly.

Типичная ошибка: считать весь объект readonly из-за одного readonly-свойства.

Связь с Automation QA: часть config может быть изменяемой, а часть стабильной.

## Задание на отладку

Ответ:

```typescript
const config: { readonly baseUrl: string } = {
  baseUrl: 'https://api.example.test',
};

console.log(config.baseUrl);
```

Объяснение: `baseUrl` нельзя переназначать.

Типичная ошибка: путать чтение readonly-свойства и запись в него.

Связь с Automation QA: базовый адрес окружения лучше не менять случайно.

## Задание Automation QA

Ответ:

```typescript
const metadata: { readonly testId: string; title: string; owner?: string } = {
  testId: 'T-100',
  title: 'login form',
};
```

Объяснение: `testId` стабилен, `title` обязателен, `owner` может отсутствовать.

Типичная ошибка: делать `owner` обязательным, если он реально не всегда известен.

Связь с Automation QA: metadata часто частично заполняется.

## Мини-проект

Ответ:

```typescript
function formatMetadata(
  metadata: { readonly testId: string; title: string; owner?: string },
): string {
  return `${metadata.testId}: ${metadata.title}`;
}

console.log(formatMetadata({ testId: 'T-100', title: 'login form' }));
```

Объяснение: функция использует только обязательные свойства.

Типичная ошибка: без проверки использовать optional `owner`.

Связь с Automation QA: formatter может работать даже без owner.
