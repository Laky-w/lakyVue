import axios from 'axios';
import qs from 'qs';
import router from './router';
// axios.defaults.baseURL = 'http://192.168.0.103/laky/';
axios.defaults.baseURL = 'http://192.168.0.100/laky/';
// axios.defaults.baseURL = 'http://192.168.0.100:8081/laky/';
// axios.defaults.baseURL = 'http://jjs7av.natappfree.cc/laky/';

axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    config.headers.common['token'] = sessionStorage.getItem("token");
    let data = qs.stringify(config.data);
    config.data = data.replace(/\%5B[0-9]\%5D/g, "");
    console.log(config.data);
    return config;
});
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    return response;
}, function(error) {
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log(error.response.data);
        console.log(error.response.status);
        if (error.response.status == "420") { //登录过期
            sessionStorage.setItem("code", 420);
            sessionStorage.setItem("message", error.response.data.data);
            sessionStorage.setItem("isOut", "false");
            router.push('/login');
            // self.$message.error(error.response.data.data);
        }
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});
// 表单序列化，IE9+
HTMLFormElement.prototype.serialize = function() {
    var form = this;
    // 表单数据
    var arrFormData = [],
        objFormData = {};

    [].slice.call(form.elements).forEach(function(ele) {
        // 元素类型和状态
        var type = ele.type,
            disabled = ele.disabled;

        // 元素的键值
        var name = ele.name,
            value = encodeURIComponent(ele.value || 'on');

        // name参数必须，元素非disabled态，一些类型忽略
        if (!name || disabled || !type || (/^reset|submit|image$/i.test(type)) || (/^checkbox|radio$/i.test(type) && !ele.checked)) {
            return;
        }

        type = type.toLowerCase();

        if (type !== 'select-multiple') {
            if (objFormData[name]) {
                objFormData[name].push(value);
            } else {
                objFormData[name] = [value];
            }
        } else {
            [].slice.call(ele.querySelectorAll('option')).forEach(function(option) {
                var optionValue = encodeURIComponent(option.value || 'on');
                if (option.selected) {
                    if (objFormData[name]) {
                        objFormData[name].push(optionValue);
                    } else {
                        objFormData[name] = [optionValue];
                    }
                }
            });
        }
    });

    for (var key in objFormData) {
        arrFormData.push(key + '=' + objFormData[key].join());
    }

    return arrFormData.join('&');
};