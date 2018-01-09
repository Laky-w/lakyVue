<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称：">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="编号：">
        <el-tag type="info">{{view.serial}}</el-tag>
      </el-form-item>
      <el-form-item label="地址：">
        <el-tag type="info">{{view.address}}</el-tag>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-tag type="info">{{view.createTime}}</el-tag>
      </el-form-item>
      <el-form-item label="职能：">
        <el-tag type="info">{{view.remarks}}</el-tag>
      </el-form-item>
      <el-form-item label="校长/主管：">
        <el-tag type="info">{{view.owner}}</el-tag>
      </el-form-item>
      <el-form-item label="电话：">
        <el-tag type="info">{{view.phone}}</el-tag>
      </el-form-item>
      <el-form-item label="所属校区" v-if="view.theType !=1">
        <el-tag type="info">{{view.fatherName}}</el-tag>
      </el-form-item>
      <el-form-item label="员工数量：">
        <el-tag type="info">{{view.userNumber}}</el-tag>
      </el-form-item>
      <el-form-item label="校区数量：" v-if="view.theType !=3">
        <el-tag type="info">{{view.schoolNumber}}</el-tag>
      </el-form-item>
      <el-form-item label="学员数量：" v-if="view.theType !=3">
        <el-tag type="info">{{view.studentNumber}}</el-tag>
      </el-form-item>
      <el-form-item label="生源数量：" v-if="view.theType !=3">
        <el-tag type="info">{{view.customerNumber}}</el-tag>
      </el-form-item>
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
import { getSchoolZoneView } from "../../api/api";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: this.dialogViewVisible,
      loadingView: false,
      view: { name: "详情" }
    }
  },
  watch: {
    dialogViewVisible(val) {
      // alert(val);
      this.visible = val;
      if (val === true) {
        this.getData();
      }
    }
  },
  methods: {
    show() {
      this.dialogFormVisible = true;
      console.log(this.id);
      // this.getData();
    },
    getData() {
      let self = this;
      self.loadingView = true;
      self.view = { name: "详情" };
      getSchoolZoneView(self.viewId).then(data => {
        self.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
        } else {
          self.$message.error(data.message);
        }
      })
    }
  },
  props: {
    viewId: "",
    dialogViewVisible: {
      default: false,
    }
  }
}
</script>

