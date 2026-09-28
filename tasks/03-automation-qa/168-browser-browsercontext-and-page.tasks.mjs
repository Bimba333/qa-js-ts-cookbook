export default [
  {
    id: 'qa-168-context-isolation',
    title: 'Что изолирует контекст',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Смоделируйте иерархию браузера. `createBrowser()` возвращает объект с ' +
      'методами `newContext()` и `close()`. Контекст имеет `newPage()`, ' +
      '`setCookie(name, value)`, `cookies()` и `close()`. Страница имеет ' +
      '`setCookie(name, value)`, `cookies()` и `close()`. Куки принадлежат ' +
      '**контексту**: страницы одного контекста видят их вместе, страницы ' +
      'разных контекстов — нет. Закрытый контекст закрывает свои страницы, ' +
      'закрытый браузер — свои контексты. Обращение к закрытому объекту даёт ' +
      '`Error` с сообщением `ресурс закрыт`.',
    starter: `function createBrowser() {
  // Куки хранит контекст, а не страница и не браузер.

  return {
    newContext() {},
    close() {}
  };
}`,
    hints: [
      'Хранилище куки заводится один раз на контекст, а страницы только обращаются к нему.',
      'Закрытие удобно выразить флагом и общей проверкой перед каждой операцией.',
      'Закрытие контекста должно пройти по его страницам, а закрытие браузера — по контекстам.'
    ],
    tests: [
      {
        name: 'страницы одного контекста делят куки',
        code: `const browser = createBrowser();
const context = browser.newContext();
const first = context.newPage();
const second = context.newPage();
first.setCookie('session', 'abc');
expect(second.cookies()).toEqual({ session: 'abc' });`
      },
      {
        name: 'разные контексты изолированы',
        code: `const isolated = createBrowser();
const left = isolated.newContext();
const right = isolated.newContext();
left.newPage().setCookie('session', 'abc');
expect(right.newPage().cookies()).toEqual({});`
      },
      {
        name: 'контекст видит куки своих страниц',
        code: `const shared = createBrowser();
const ctx = shared.newContext();
ctx.newPage().setCookie('a', '1');
ctx.setCookie('b', '2');
expect(ctx.cookies()).toEqual({ a: '1', b: '2' });`
      },
      {
        name: 'закрытый контекст закрывает свои страницы',
        code: `const closing = createBrowser();
const owner = closing.newContext();
const page = owner.newPage();
owner.close();
expect(() => page.cookies()).toThrow('ресурс закрыт');`
      },
      {
        name: 'закрытый браузер закрывает свои контексты',
        code: `const whole = createBrowser();
const inner = whole.newContext();
whole.close();
expect(() => inner.newPage()).toThrow('ресурс закрыт');`
      },
      {
        name: 'соседний контекст не страдает',
        code: `const pair = createBrowser();
const closed = pair.newContext();
const alive = pair.newContext();
closed.close();
alive.setCookie('a', '1');
expect(alive.cookies()).toEqual({ a: '1' });`
      },
      {
        name: 'закрытая страница не мешает соседней',
        code: `const survivor = createBrowser();
const room = survivor.newContext();
const gone = room.newPage();
const kept = room.newPage();
gone.close();
kept.setCookie('a', '1');
expect(kept.cookies()).toEqual({ a: '1' });
expect(() => gone.cookies()).toThrow('ресурс закрыт');`
      },
      {
        name: 'повторное закрытие безопасно',
        code: `const twice = createBrowser();
const ctx2 = twice.newContext();
ctx2.close();
ctx2.close();
expect(() => ctx2.cookies()).toThrow('ресурс закрыт');`
      }
    ],
    solution: `function createBrowser() {
  const contexts = [];
  let browserClosed = false;

  function ensure(closed) {
    if (closed()) throw new Error('ресурс закрыт');
  }

  return {
    newContext() {
      ensure(() => browserClosed);

      const cookies = new Map();
      const pages = [];
      let contextClosed = false;
      const isClosed = () => browserClosed || contextClosed;

      const context = {
        newPage() {
          ensure(isClosed);

          let pageClosed = false;
          const pageIsClosed = () => isClosed() || pageClosed;

          const page = {
            setCookie(name, value) {
              ensure(pageIsClosed);
              cookies.set(name, value);
            },
            cookies() {
              ensure(pageIsClosed);
              return Object.fromEntries(cookies);
            },
            close() {
              pageClosed = true;
            }
          };

          pages.push(page);

          return page;
        },
        setCookie(name, value) {
          ensure(isClosed);
          cookies.set(name, value);
        },
        cookies() {
          ensure(isClosed);
          return Object.fromEntries(cookies);
        },
        close() {
          contextClosed = true;
        }
      };

      contexts.push(context);

      return context;
    },
    close() {
      browserClosed = true;
      for (const context of contexts) context.close();
    }
  };
}`
  }
]
