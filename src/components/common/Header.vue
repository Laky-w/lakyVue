<template>
  <div>
    <div class="header">
      <div class="logo" ref="logo">
        <img src="../../../static/img/logo2.png" :title="branchName" width="80px">
      </div>
      <div class="notice">
        <i class="el-icon-location"></i>公告:{{notice}}</div>
      <div class="user-info">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <img class="user-logo" :src="userHeadLogo" onerror="this.src='../../../static/img/headPhoto.jpg'"> {{username}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">我的资料
            </el-dropdown-item>
            <el-dropdown-item command="updatePWD">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
        <user-info ref="userInfo"></user-info>
        <user-password ref="passwordForm" @saveSuccess="loginOut"></user-password>
      </div>
  </div>
</template>
<script>
import UserInfo from "../page/user/UserInfo.vue";
import UserPassword from "../page/user/UserPassword.vue";
import { findNewNoticeAll, loginOut } from "../api/api";
export default {
  data() {
    return {
      name: "linxin",
      branchNameDefault: "大海教育",
      defaultHeadLogo: "../../../static/img/img.jpg",
      notices: "",
      notice: "",
      noticeIndex: 0,
      viewId: "",//详情id
      dialogViewVisible: false
    };
  },
  computed: {
    userHeadLogo() {
      let user = this.$user();
      if (user == "null") {
        this.$router.push("/login");
        return;
      }
      let userHeadLogo = user.headLogo;
      return userHeadLogo ? userHeadLogo : this.defaultHeadLogo;
    },
    username() {
      let user = this.$user();
      let username = user.nickName;
      return username ? username : this.name;
    },
    branchName() {
      let branch = sessionStorage.getItem("branch");
      console.debug(branch);
      let branchName = JSON.parse(branch).branchName;
      return branchName ? branchName : this.branchNameDefault;
    }
  },
  created() {
    this.loadNotice();
  },

  methods: {
    loadNotice() {
      let self = this;
      function setNotice() {
        self.notice = self.notices[self.noticeIndex].content;
        self.noticeIndex = self.noticeIndex + 1;
        if (self.noticeIndex == self.notices.length) {
          self.noticeIndex = 0;
        }
      }
      findNewNoticeAll().then(data => {
        if (data.code == 200) {
          self.notices = data.data;
          if (self.notices) {
            window.setInterval(setNotice, 1000);
          }
        }
      });
    },
    getData() { },
    handleUpdatePWD() {
      console.log(this.$refs);
      this.$refs["passwordForm"].handleOpen();
    },
    loginOut() {
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("branch");
      loginOut().then(data => {
        if (data.code == 200) {
          //退出成功
          sessionStorage.removeItem("token");
          this.$router.push('/login');
        }
      });
    },
    userInfo() {
      this.$refs["userInfo"].visible = true;
    },
    handleCommand(command) {
      if (command == "loginout") {
        this.loginOut();
      } else if (command == "updatePWD") {
        this.handleUpdatePWD();
      } else if (command == "userinfo") {
        this.userInfo();
      }
    },
  },
  components: { UserPassword, UserInfo } //注入组件
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  line-height: 70px;
  color: #fff;
  background: url("../../../static/img/logo5.png") no-repeat 80px 10px #409eff;
}
.header .logo {
  float: left;
  /* width: 250px; */
  text-align: center;
}
/* .logo image,
img {
  -webkit-filter: opacity(50%);
  filter: opacity(50%);
} */
.notice {
  float: left;
  position: absolute;
  font-size: 18px;
  left: 45%;
}
.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #fff;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #fff;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo {
  position: absolute;
  left: 0;
  top: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
