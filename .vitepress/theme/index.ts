import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CodeRunner from './components/CodeRunner.vue'
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
      'layout-bottom': () => h(PanelToggles)
    })
  },
  enhanceApp({ app }) {
    app.component('CodeRunner', CodeRunner)
    app.component('CodeTask', CodeTask)
    app.component('HomeBoard', HomeBoard)
    app.component('MermaidChart', MermaidChart)
    app.component('ProgressBoard', ProgressBoard)
  }
}
