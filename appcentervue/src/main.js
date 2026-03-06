import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

<<<<<<< Updated upstream
import "@fortawesome/fontawesome-free/js/all"
=======
import '@fortawesome/fontawesome-free/js/all'
>>>>>>> Stashed changes

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

app.use(router)
app.use(vuetify)
app.mount('#app')
