import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

Vue.prototype.$$cookies = Cookies
Vue.prototype.$axios = axios
Vue.prototype.$notify = Notification;
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
