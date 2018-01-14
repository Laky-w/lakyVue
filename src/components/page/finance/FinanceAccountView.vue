<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{filterSchoolZoneName(view)}}</el-tag>
      </el-form-item>
      <el-form-item label="账户类型:">
        <el-tag type="info">{{filterType(view.theType)}}</el-tag>
      </el-form-item>
      <el-form-item label="前台账户:">
        <el-tag type="info">{{filterOpen(view.theOpen)}}</el-tag>
      </el-form-item>
      <el-form-item label="余额:">
        <el-tag type="info"> {{view.money}}</el-tag>
      </el-form-item>
      <el-form-item label="备注:">
        <el-tag type="info"> {{view.remarks}}</el-tag>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style>
.viewForm .el-form-item {
  width: 45%;
}
.viewForm .el-tag {
  width: 180px;
}
</style>

<script>
import { getFinanceAccountView } from "../../api/api";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: this.dialogViewVisible,
      view: {},
      loadingView: false
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
    getData() {
      let self = this;
      this.loadingView = true;
      getFinanceAccountView(self.viewId).then(data => {
        this.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
        } else {
          self.$message.error(data.message);
        }
      })
    },
    filterSchoolZoneName(view) {
      let tag = "";
      if (view.thePublic == 1) tag = "公共";
      else tag = view.schoolZoneName;
      return tag;
    },
    filterType(theType) {
      let tag = "";
      if (theType == 1) tag = "现金账户";
      else if (theType == 2) tag = "银行账户";
      else tag = "第三方支付账户";
      return tag;
    },
    filterOpen(theOpen) {
      let tag = "";
      if (theOpen == 1) tag = "开启 ";
      else tag = "关闭";
      return tag;
    },


  },
  props: {
    viewId: "",
    dialogViewVisible: {
      default: false,
    }
  }
}
</script>

