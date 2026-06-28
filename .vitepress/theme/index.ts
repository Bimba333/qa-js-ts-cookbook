import DefaultTheme from 'vitepress/theme'
import CodeRunner from './components/CodeRunner.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CodeRunner', CodeRunner)
  }
}