import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { BCard, BCardBody, BCollapse, BButton, BPopover, vBPopover, vBToggle } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './assets/styles/styles.css'
import CustomSidebar from './components/CustomSidebar.vue'
import '@fortawesome/fontawesome-free/css/all.css'
const app = createApp(App)
app.use(router)
// Registrar componentes globalmente
app.component('BButton', BButton)
app.component('BCollapse', BCollapse)
app.component('BCard', BCard)
app.component('BCardBody', BCardBody)
app.component('CustomSidebar', CustomSidebar)
app.component('BPopover', BPopover)
// Registrar directivas globalmente
app.directive('b-popover', vBPopover)
app.directive('b-toggle', vBToggle)
app.mount('#app')
