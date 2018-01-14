
import { getCustomerList } from "../components/api/api";
import { Message } from 'element-ui';
export const validateMoney = (rule, value, callback) => { //金钱验证
  let reg = /(^\d+\.\d{2}$)|(^[0-9]*$)|(^\d+\.\d{1}$)/;
  if (value !== "" && !reg.test(value)) {
    callback(new Error("格式错误,正确格式[0.00]"));
  } else {
    callback();
  }
}

export const validateStudent = (rule, value, callback) => {
  if (value.length != 11) {
    callback(new Error("请输入正确的手机号"));
  } else {
    getCustomerList(1, 20, { "phone": value }).then(data => {
      if (data.code == 200) {
        if (data.data.total > 0) {
          let message = "";
          data.data.list.forEach(item => {
            message += item.name + "，所属校区:" + item.schoolZoneName + ";"
          })
          Message({
            message: message,
            type: 'warning'
          });
          callback(new Error("该电话信息已存在！"));
        } else {
          callback();
        }
      } else {
        callback(new Error("网络错误，请尝试刷新操作！"));
      }
    })
  }
}