// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue' // Import your custom layout
import PublicationList from './components/PublicationList.vue'
import CVViewer from './components/CVViewer.vue'
import CVEntry from './components/CVEntry.vue'
import Photography from './components/Photography.vue'
import Impressum from './components/Impressum.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout, // Register it
  enhanceApp({ app }) {
    // Register components globally
    app.component('PublicationList', PublicationList)
    app.component('CVViewer', CVViewer)
    app.component('CVEntry', CVEntry)
    app.component('Photography', Photography)
    app.component('Impressum', Impressum)
  },
}
