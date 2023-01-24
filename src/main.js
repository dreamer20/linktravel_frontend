import { createApp } from 'vue'
import App from './App.vue'
import LinkTree from './components/LinkTree.vue'
const app = createApp(App)
app.component('LinkTree', LinkTree)
app.mount('#app')
