/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { vMaska } from 'maska'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import I18Core from "@/plugins/i18_ui/i18Core";

loadFonts()
const toastOptions = {
    position: "bottom-right"
}

// Create vue app
const app = createApp(App)

app.directive('maska', vMaska)





// Use plugins
app.use(vuetify)
app.use(I18Core.getInstance())
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions);
// Mount vue app
app.mount('#app')
