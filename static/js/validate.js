let validate = {
    validateMoney(rule, value, callback) { //金钱验证
        let reg = /(^\d+\.\d{2}$)|(^[0-9]*$)|(^\d+\.\d{1}$)/;
        if (value !== "" && !reg.test(value)) {
            callback(new Error("格式错误,正确格式[0.00]"));
        } else {
            callback();
        }
    },
}
export default validate;