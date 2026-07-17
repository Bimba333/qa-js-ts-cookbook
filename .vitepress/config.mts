import { exampleCardPlugin } from './plugins/example-card.mjs'
import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.generated'

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
    'playground/**',
    'scripts/**',
    'tests/**',
    'test-results/**'
  ],

  markdown: {
    config(md) {
      md.use(exampleCardPlugin)
    }
  },

  themeConfig: {
    siteTitle: 'JS/TS QA Book',
    logo: '/logo.svg',

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
      { text: 'GitHub', link: 'https://github.com/Bimba333/qa-js-ts-cookbook' }
    ],

    sidebar,

    search: {
      provider: 'local'
    },

    outline: {
      label: 'На странице',
      level: [2, 3]
    },

    docFooter: {
      prev: 'Предыдущая',
      next: 'Следующая'
    },

    lastUpdated: {
      text: 'Обновлено'
    }
  }
})
