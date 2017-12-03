import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
// import "../static/js/common.js";
import "common.js";
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import "../static/css/icon/iconfont.css";
import "../static/css/main.css";
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);
Vue.prototype.$axios = axios;


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');