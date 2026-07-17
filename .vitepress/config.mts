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
      { text: 'Читать книгу', link: '/docs/00-introduction/01-about-course' },
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
