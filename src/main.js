import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/all.scss'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
