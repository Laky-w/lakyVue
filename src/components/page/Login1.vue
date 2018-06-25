
<template>
  <div>
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <vue-particles color="#FFFFFF" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle" :particleSize="4" linesColor="#F69A9F" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <div class="message-title">湖之教育</div>
        <el-form-item prop="serial">
          <!-- <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
                        <template slot="prepend">密码</template>
                    </el-input>   -->
          <!-- <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker> -->
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
    <div style="position: fixed;bottom: 150px;text-align: center;margin: 0 auto;width: 100%;color: white;">技术支持@湖之教育工作室.2018/06/21</div>
  </div>
</template>

<script>
import { requestLogin } from "../api/api";

import animation from "../../../static/js/html5_3d_animation.js";
export default {
  data: function () {
    return {
      loadForm: false,
      clientHeight: 0,
      clientWidth: 0,
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
    },
  },
  mounted: function () {
    var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      w = canvas.width = window.innerWidth,
      h = canvas.height = window.innerHeight,

      hue = 217,
      stars = [],
      count = 0,
      maxStars = 1300;//星星数量

    var canvas2 = document.createElement('canvas'),
      ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
    var half = canvas2.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    // End cache

    function random(min, max) {
      if (arguments.length < 2) {
        max = min;
        min = 0;
      }

      if (min > max) {
        var hold = max;
        max = min;
        min = hold;
      }

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
      var max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max));
      return diameter / 2;
      //星星移动范围，值越大范围越小，
    }

    var Star = function () {

      this.orbitRadius = random(maxOrbit(w, h));
      this.radius = random(60, this.orbitRadius) / 8;
      //星星大小
      this.orbitX = w / 2;
      this.orbitY = h / 2;
      this.timePassed = random(0, maxStars);
      this.speed = random(this.orbitRadius) / 50000;
      //星星移动速度
      this.alpha = random(2, 10) / 10;

      count++;
      stars[count] = this;
    }

    Star.prototype.draw = function () {
      var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
        twinkle = random(10);

      if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;
      } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
      }

      ctx.globalAlpha = this.alpha;
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
      this.timePassed += this.speed;
    }

    for (var i = 0; i < maxStars; i++) {
      new Star();
    }

    function animation() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.5; //尾巴
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter';
      for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw();
      };

      window.requestAnimationFrame(animation);
    }

    animation();
  }
};
</script>

<style scoped>
.message-title {
  text-align: center;
  height: 45px;
  position: relative;
  color: #fff;
  font-size: 16px;
}
.el-button--primary {
  color: #fff;
  background-color: #040d1a;
  border-color: #6486bb;
}
.el-button--primary :hover {
  color: #fff;
  background-color: #cdd7e9;
  border-color: #010614;
}
.login-wrap {
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
  background: rgba(255, 0, 0, 0.5);
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
