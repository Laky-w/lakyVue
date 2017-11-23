import axios from 'axios';
axios.defaults.baseURL = 'http://192.168.0.100/laky/';
axios.defaults.headers.common['token'] = sessionStorage.getItem("token");
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