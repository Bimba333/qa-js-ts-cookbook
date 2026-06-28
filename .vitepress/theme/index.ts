import DefaultTheme from 'vitepress/theme'
import CodeRunner from './components/CodeRunner.vue'
import MermaidChart from './components/MermaidChart.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CodeRunner', CodeRunner)
    app.component('MermaidChart', MermaidChart)
  }
}
