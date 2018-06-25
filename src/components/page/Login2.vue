
<template>

  <div class="login-wrap1">
    <vue-particles color="#B2363E" :particleOpacity="0.7" :particlesNumber="120" shapeType="circle" :particleSize="4" linesColor="#EA343B" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <div class="message-title">湖之教育</div>
        <el-form-item prop="serial">
          <el-input v-model="ruleForm.serial" name="serial" placeholder="机构代码">
            <template slot="prepend">
              <i class="el-icon-laky-branch"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" name="userName" placeholder="用户名/邮箱/电话">
            <template slot="prepend">
              <i class="el-icon-laky-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="password" placeholder="密码" name="pwd" v-model="ruleForm.pwd" autofocus @keyup.enter.native="submitForm('ruleForm')">
            <template slot="prepend">
              <i class="el-icon-laky-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button :loading="loadForm" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#fff000;"></p>
      </el-form>
    </div>
    <div style="position: fixed;bottom: 150px;text-align: center;margin: 0 auto;width: 100%;">技术支持@湖之教育工作室.2018/06/21</div>
  </div>
</template>

<script>
import { requestLogin } from "../api/api";
export default {
  data: function () {
    return {
      loadForm: false,
      ruleForm: {
        serial: "001",
        userName: "admin",
        pwd: "123456"
      },
      rules: {
        serial: [{ required: true, message: "请输入机构代码", trigger: "blur" }],
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadForm = true;
          requestLogin(self.ruleForm).then(data => {
            self.loadForm = false;
            if (data.code == 200) {
              //登录成功

              sessionStorage.setItem("token", data.data["token"]);
              sessionStorage.setItem(
                "branch",
                JSON.stringify(data.data["branch"])
              );
              sessionStorage.setItem(
                "userInfo",
                JSON.stringify(data.data["userInfo"])
              );
              let isOut = sessionStorage.getItem("isOut");
              if (isOut === "false") {
                sessionStorage.removeItem("isOut");
                window.history.back(-1);
              } else {
                self.$router.push("/laky");
              }
            } else {
              this.$message.error(data.data);
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  mounted: function () {
    // var code = sessionStorage.getItem("code");
    // if(code == 420) {
    //     this.$message({
    //         showClose: true,
    //         message: sessionStorage.getItem("message"),
    //         type: 'warning'
    //     });
    //     sessionStorage.removeItem("code");
    //     sessionStorage.removeItem("message");
    // }
  }
};
</script>

<style scoped>
.login-wrap1 {
  background: url("../../../static/img/login_bg1.jpg") no-repeat;
  background-size: 100%;
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.message-title {
  text-align: center;
  height: 45px;
  position: relative;
  color: #303133;
  font-size: 16px;
}
.el-button--primary {
  color: #fff;
  background-color: #f69a9f;
  border-color: #ffebe0;
}
/* .ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 320px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
} */
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 320px;
  margin: -150px 0 0 -190px;
  padding: 1em;
  max-width: 30em;
  border-radius: 0.3em;
  box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
    0 0.5em 1em rgba(0, 0, 0, 0.6);
  text-shadow: 0 1px 1px hsla(0, 0%, 100%, 0.3);
  background: hsla(0, 0%, 100%, 0.3);
  overflow: hidden;
  /*    -webkit-filter: blur(3px);
    filter: blur(3px);*/
}
.ms-login::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  -webkit-filter: blur(20px);
  filter: blur(20px);
  margin: -30px;
  /*background: rgba(255,0,0,.5);*/
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
