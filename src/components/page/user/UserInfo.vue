<template>
  <el-dialog title="我的资料" :visible.sync="visible" :close-on-click-modal="false">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="姓名：">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-tag type="info">{{view.userName}}</el-tag>
      </el-form-item>
      <el-form-item label="职能：">
        <el-tag type="info">{{filterIsSuper(view)}}</el-tag>
      </el-form-item>
      <el-form-item label="校区/部门：">
        <el-tag type="info">{{view.schoolName}}</el-tag>
      </el-form-item>
      <el-form-item label="性别：">
        <el-tag type="info">{{view.sex ==1?'男':'女'}}</el-tag>
      </el-form-item>
      <el-form-item label="电话：">
        <el-tag type="info">{{view.phone}}</el-tag>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-tag type="info">{{view.createTime}}</el-tag>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-tag type="info">{{view.email}}</el-tag>
      </el-form-item>
      <el-form-item label="身份证：">
        <el-tag type="info">{{view.idCard}}</el-tag>
      </el-form-item>
      <el-form-item label="生日：">
        <el-tag type="info">{{view.birthday}}</el-tag>
      </el-form-item>
       -->
    </el-form>
  </el-dialog>
</template>
<style>
.viewForm .el-form-item {
  width: 45%;
}
.viewForm .el-tag--info {
  width: 180px;
}
</style>

<script>
import { getUserView } from "../../api/api";
export default {
  data() {
    return {
      visible: false,
      loadingView: false,
      view: {}
    }
  },
  created() {
    this.getData();
  },
  methods: {
    show() {
      this.dialogFormVisible = true;
    },
    getData() {
      let self = this;
      self.loadingView = true;
      getUserView(self.$user().id).then(data => {
        self.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
        } else {
          self.$message.error(data.message);
        }
      })
    },
    handleOpen() {
      this.visible = true;
    },
    filterIsSuper(value) {
      let tag = "";
      if (value.isSuper == 1) tag = "超级管理员";
      else tag = value.roleName;
      return tag;
    },
  },
  props: {

  }
}
</script>

