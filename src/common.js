import axios from 'axios';
import qs from 'qs';
import router from './router';
import { Message } from 'element-ui';
// axios.defaults.baseURL = 'http://192.168.0.103/laky/';
axios.defaults.baseURL = 'http://192.168.0.100/laky/';
// axios.defaults.baseURL = 'http://192.168.0.100:8081/laky/';
// axios.defaults.baseURL = 'http://qfjjsk.natappfree.cc/';

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.common['token'] = sessionStorage.getItem("token");
  // config.headers.common['content-type'] = "json";
  let data = qs.stringify(config.data);
  config.data = data.replace(/\%5B[0-9]\%5D=/g, "=");//数组过滤[0-9],加=是防止误杀[1]这样value值。通过=保证是key值，
  // config.data = config.data.replace(/\%5B/g, ".");//数组过滤[0-9]
  // config.data = config.data.replace(/\%5D/g, "");//数组过滤[0-9]
  console.log(config.data);
  return config;
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  if (error.response) {
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    // console.log(error.response.data);
    // console.log(error.response.status);
    if (error.response.status == "420") { //登录过期
      sessionStorage.setItem("isOut", "false");
      Message.error(error.response.data.data);
      router.push('/login');
    }
  } else {
    Message.error("服务器连接超时，请检查您的网络！");
  }
  return Promise.reject(error);
});
Date.prototype.Format = function (fmt) {
  console.log(fmt);
  var date = this;
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

// 表单序列化，IE9+
HTMLFormElement.prototype.serialize = function () {
  var form = this;
  // 表单数据
  var arrFormData = [],
    objFormData = {};

  [].slice.call(form.elements).forEach(function (ele) {
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
      [].slice.call(ele.querySelectorAll('option')).forEach(function (option) {
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

//加法函数
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return Number((arg1 * m + arg2 * m) / m);
}
//给Number类型增加一个add方法，，使用时直接用 .add 即可完成计算。
Number.prototype.add = function (arg) {
  return accAdd(arg, this);
};


//减法函数
let subtr = (arg1, arg2) => {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}

//给Number类型增加一个sub方法，，使用时直接用 .sub 即可完成计算。
Number.prototype.sub = function (arg) {
  return subtr(this, arg);
};


//乘法函数
function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  }
  catch (e) {
  }
  return Number(Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m));
}
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算。
Number.prototype.mul = function (arg) {
  return accMul(arg, this);
};


//除法函数
function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return Number((r1 / r2) * pow(10, t2 - t1));
}
//给Number类型增加一个div方法，，使用时直接用 .div 即可完成计算。
Number.prototype.div = function (arg) {
  return accDiv(this, arg);
};
