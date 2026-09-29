import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CodeRunner from './components/CodeRunner.vue'
import BookMap from './components/BookMap.vue'
import ChapterAccess from './components/ChapterAccess.vue'
import ChapterOutline from './components/ChapterOutline.vue'
import ChapterSteps from './components/ChapterSteps.vue'
import CodeTask from './components/CodeTask.vue'
import HomeBoard from './components/HomeBoard.vue'
import MermaidChart from './components/MermaidChart.vue'
import PanelToggles from './components/PanelToggles.vue'
import ProgressBoard from './components/ProgressBoard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Панель доступа стоит перед текстом главы: читатель должен узнать о
      // границе до того, как начнёт читать, а не после.
      'doc-before': () => [h(ChapterAccess), h(ChapterOutline)],
      'layout-bottom': () => h(PanelToggles)
    })
  },
  enhanceApp({ app }) {
    app.component('CodeRunner', CodeRunner)
    app.component('BookMap', BookMap)
    app.component('ChapterAccess', ChapterAccess)
    app.component('ChapterOutline', ChapterOutline)
    app.component('ChapterSteps', ChapterSteps)
    app.component('CodeTask', CodeTask)
    app.component('HomeBoard', HomeBoard)
    app.component('MermaidChart', MermaidChart)
    app.component('ProgressBoard', ProgressBoard)
  }
}
