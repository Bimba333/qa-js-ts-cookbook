# Концептуальная визуализация AST

Исходный код:

```javascript
console.log('Hello');
```

Концептуальное дерево:

```text
Program
└── ExpressionStatement
    └── CallExpression
        ├── callee
        │   └── console.log
        └── arguments
            └── 'Hello'
```

Это упрощенная учебная модель, а не точная внутренняя структура V8.
