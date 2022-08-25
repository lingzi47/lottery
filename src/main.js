import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/vantui"
import "reset-css"
import {Base64} from 'js-base64'
import VueResource from 'vue-resource'; 

Vue.use(VueResource);  
Vue.use(Base64);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
