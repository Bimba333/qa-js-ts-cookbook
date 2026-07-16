# Практика: Tags, annotations и test selection

## 1. Tags и annotations
Разделите tags для выбора тестов и annotations, которые должны только добавлять контекст к результату.

## 2. Выбор через grep
Предскажите выбор для `--grep @smoke`, `--grep @regression`, `--grep-invert @smoke` и `--grep-invert @slow`, если один тест имеет одновременно `@smoke` и `@regression`, а второй — только `@regression`.

## 3. Project и tag
Объясните, почему project браузера не заменяет `@smoke`.

## 4. Skip и fixme
Объясните различие `test.skip` и `test.fixme`, затем сформулируйте политику с причиной, владельцем и сроком пересмотра.

## 5. Automation QA-задача
Создайте пересекающиеся smoke- и regression-наборы без копирования файлов с тестами. Объясните, почему выбор не создаёт изоляцию ресурсов.

## 6. Мини-проект: матрица выбора
Добавьте tags и annotations в один набор и проверьте точное число тестов через `--grep`, `--grep-invert`, выбор файла и `--project`.
