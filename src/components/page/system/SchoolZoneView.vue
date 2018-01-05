<template>
  <el-dialog title="校区/部门/详情" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm">
      <el-form-item label="名称：">{{view.name}}</el-form-item>
      <el-form-item label="编号：">{{view.name}}</el-form-item>
      <el-form-item label="地址：">{{view.address}}</el-form-item>
      <el-form-item label="创建时间：">{{view.createDatetime}}</el-form-item>
      <el-form-item label="职能：">{{view.name}}</el-form-item>
      <el-form-item label="负责人：">{{view.name}}</el-form-item>
      <el-form-item label="电话：">{{view.owner}}</el-form-item>
      <el-form-item label="上级部门：">{{view.fatherId}}</el-form-item>
    </el-form>
  </el-dialog>
</template>
<style>
.viewForm .el-form-item {
  width: 45%;
}
</style>

<script>
import { getSchoolZoneView } from "../../api/api";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: this.dialogViewVisible,
      view: {}
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
      getSchoolZoneView(self.viewId).then(data => {
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

