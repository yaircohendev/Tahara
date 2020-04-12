import Vue from 'vue'
import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')
export const EventBus = new Vue();
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import App from './App.vue'
import router from './router'
Vue.use(VueMaterial)
Vue.config.productionTip = false
import fireBaseInstance from "./firebase/firebase";
import Toasted from 'vue-toasted';
Vue.use(Toasted)
import './registerServiceWorker'

fireBaseInstance.firebase.auth().onAuthStateChanged((user) => {
    window.user = user;
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
})


Vue.toasted.register('err',
    (payload) => {
        return payload.message;
    }, {
        type : 'error',
        icon : 'error_outline',
        duration: 2000,
        closeOnSwipe: true,
        singleton: true,
    })
Vue.toasted.register('success',
    (payload) => {
        return payload.message;
    }, {
        type : 'success',
        icon : 'check_circle',
        duration: 2000,
        closeOnSwipe: true,
        className: 'pinkBack',
        singleton: true,
    })