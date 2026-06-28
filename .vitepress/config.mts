import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.generated'

export default defineConfig({
  title: 'JS/TS QA Book',
  description: 'Книга по JavaScript и TypeScript для QA Automation',

  base: '/qa-javascript-book/',

  cleanUrls: true,

  themeConfig: {
    siteTitle: 'JS/TS QA Book',
    logo: '/assets/logo.svg',

    nav: [
      { text: 'Теория', link: '/docs/00-introduction/01-about-course' },
      { text: 'Практика', link: '/practice/01-javascript/01-what-is-javascript' },
      { text: 'Решения', link: '/solutions/01-javascript/01-what-is-javascript' },
      { text: 'GitHub', link: 'https://github.com/Bimba333/qa-javascript-book' }
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
