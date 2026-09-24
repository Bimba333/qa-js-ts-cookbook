import { exampleCardPlugin } from './plugins/example-card.mjs'
import { defineConfig } from 'vitepress'
import { sidebar, sidebarEn } from './sidebar.generated'

export default defineConfig({
  title: 'JS/TS QA Book',
  description: 'Книга по JavaScript и TypeScript для QA Automation',

  base: '/qa-js-ts-cookbook/',

  cleanUrls: true,

  srcExclude: [
    'AGENTS.md',
    'README.md',
    'SUMMARY.md',
    '.meta/**',
    'practice/**',
    'solutions/**',
    'examples/**',
    'sut/**',
    'playground/**',
    'scripts/**',
    'tests/**',
    'test-results/**',
    'en/practice/**',
    'en/solutions/**',
    'en/examples/**',
    'en/playground/**'
  ],

  markdown: {
    config(md) {
      md.use(exampleCardPlugin)
    }
  },

  themeConfig: {
    siteTitle: 'JS/TS QA Book',
    logo: '/logo.svg',

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Bimba333/qa-js-ts-cookbook' }
    ]
  },

  locales: {
    root: {
      label: 'Русский',
      lang: 'ru-RU',
      themeConfig: {
        nav: [
          {
            text: 'Читать книгу',
            items: [
              { text: 'Введение', link: '/docs/00-introduction/01-about-course' },
              { text: 'JavaScript', link: '/docs/01-javascript/01-what-is-javascript' },
              { text: 'TypeScript', link: '/docs/02-typescript/97-typescript-compiler' },
              { text: 'Automation QA', link: '/docs/03-automation-qa/160-what-is-automation-qa-framework' },
              { text: 'Финальный проект', link: '/docs/04-final-project/250-project-requirements-and-readiness-criteria' }
            ]
          },
          { text: 'Прогресс', link: '/docs/progress' }
        ],

        sidebar,

        // Оглавление страницы отключено: навигацию по главе ведёт полоса
        // шагов, а дублирующий список разделов только спорил с ней.
        outline: false,

        docFooter: {
          prev: 'Предыдущая',
          next: 'Следующая'
        },

        lastUpdated: {
          text: 'Обновлено'
        }
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          {
            text: 'Read the book',
            items: [
              { text: 'Introduction', link: '/en/docs/00-introduction/01-about-course' },
              { text: 'JavaScript', link: '/en/docs/01-javascript/01-what-is-javascript' }
            ]
          }
        ],

        sidebar: sidebarEn,

        // Оглавление страницы отключено: навигацию по главе ведёт полоса
        // шагов, а дублирующий список разделов только спорил с ней.
        outline: false,

        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },

        lastUpdated: {
          text: 'Updated'
        }
      }
    }
  }
})
