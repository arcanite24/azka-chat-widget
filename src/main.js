// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueScrollTo from 'vue-scrollto'

import './assets/app.scss'

import ChatWindow from './components/chat-window'
import Message from './components/message'

Vue.component('chat-window', ChatWindow)
Vue.component('message', Message)

Vue.config.productionTip = false
Vue.use(VueScrollTo)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
