<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{view.schoolZoneName}}</el-tag>
      </el-form-item>
      <el-form-item label="上课时间:">
        <el-tag type="info">{{view.startTime}}--{{view.endTime}}</el-tag>
      </el-form-item>
      <el-form-item label="学时:">
        <el-tag type="info">{{view.courseHour}}</el-tag>
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
import { getScheduleStandardView } from "../../api/api";
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
      getScheduleStandardView(self.viewId).then(data => {
        this.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;

        } else {
          self.$message.error(data.message);
        }
      })
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

