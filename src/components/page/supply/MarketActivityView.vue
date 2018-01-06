<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="市场活动">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{view.schoolZoneName}}</el-tag>
      </el-form-item>
      <el-form-item label="负责人:">
        <el-tag type="info">{{view.userName}}</el-tag>
      </el-form-item>
      <el-form-item label="状态:">
        <el-tag type="info">{{filterType(view.theType)}}</el-tag>
      </el-form-item>
      <el-form-item label="预算支出:">
        <el-tag type="info"> {{view.cost}}</el-tag>
      </el-form-item>
      <el-form-item label="计划招生人数:">
        <el-tag type="info">{{view.targetNumber}}</el-tag>
      </el-form-item>
      <el-form-item label="活动分类:">
        <el-tag type="info">{{view.cateGoryName}}</el-tag>
      </el-form-item>
      <el-form-item label="计划开始日期:">
        <el-tag type="info">{{view.startDate}}</el-tag>
      </el-form-item>
      <el-form-item label="计划结束日期:">
        <el-tag type="info"> {{view.endDate}}</el-tag>
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
import { getMarketActivityView } from "../../api/api";
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
      getMarketActivityView(self.viewId).then(data => {
        this.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
        } else {
          self.$message.error(data.message);
        }
      })
    },
    filterType(theType) {
      let tag = "";
      if (theType == 1) tag = "计划中";
      else if (theType == 2) tag = "进行中";
      else tag = "已结束";
      return tag;
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

