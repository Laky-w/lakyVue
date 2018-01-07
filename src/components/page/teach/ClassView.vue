<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称:">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{view.schoolZoneName}}</el-tag>
      </el-form-item>
      <el-form-item label="课程:">
        <el-tag type="info">{{view.courseName}}</el-tag>
      </el-form-item>
      <el-form-item label="教室:">
        <el-tag type="info"> {{view.roomName}}</el-tag>
      </el-form-item>
      <el-form-item label="班主任:">
        <el-tag type="info">{{view.teacherName}}</el-tag>
      </el-form-item>
      <el-form-item label="主教:">
        <el-tag type="info"> {{view.mainTeacherName}}</el-tag>
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-tag type="info">{{view.createTime}}</el-tag>
      </el-form-item>
      <el-form-item label="计划开班日期:">
        <el-tag type="info">{{view.startDate}}</el-tag>
      </el-form-item>
      <el-form-item label="计划结课日期:">
        <el-tag type="info">{{view.endDate}}</el-tag>
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
import { getSchoolClassView } from "../../api/api";
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
      getSchoolClassView(self.viewId).then(data => {
        this.loadingView = false;
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

