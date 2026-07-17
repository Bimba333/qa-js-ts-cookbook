import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CodeRunner from './components/CodeRunner.vue'
import MermaidChart from './components/MermaidChart.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-after': () => h(SidebarToggle)
    })
  },
  enhanceApp({ app }) {
    app.component('CodeRunner', CodeRunner)
    app.component('MermaidChart', MermaidChart)
  }
}
