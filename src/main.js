import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
// import "../static/js/common.js";
import axios from 'axios';
import validateLaky from "./validate";
import { _getCurrentUserInfo, _getUserAuthority } from "./components/api/api";
import "common.js";
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import "../static/css/icon/iconfont.css";
import "../static/css/main.css";
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
Vue.use(ElementUI);
Vue.prototype.$validate = validateLaky;
Vue.prototype.$user = _getCurrentUserInfo;
Vue.prototype.$isAuthority = _getUserAuthority;
Vue.prototype.$axios = axios;
// Vue.directive('authority',{

// })
Vue.directive('drag', //自定义指令
  {
    bind: function (el, binding) {
      let oDiv = el; //当前元素
      // oDiv = el.getElementsByClassName(
      //     "el-dialog__header"
      // );
      let self = this; //上下文
      oDiv.onmousedown = function (e) {
        //鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - oDiv.offsetLeft;
        let disY = e.clientY - oDiv.offsetTop;

        document.onmousemove = function (e) {
          //通过事件委托，计算移动的距离
          let l = e.clientX - disX;
          let t = e.clientY - disY;
          //移动当前元素
          oDiv.style.left = l + 'px';
          oDiv.style.top = t + 'px';
          //将此时的位置传出去
          // binding.value({ x: e.pageX, y: e.pageY })
        };
        document.onmouseup = function (e) {

          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }
);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');