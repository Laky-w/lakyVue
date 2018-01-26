<template>
  <div>
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
      <el-form-item label="计划日期:">
        <el-tag type="info">{{view.startDate}}--{{view.endDate}}</el-tag>
      </el-form-item>
      <el-form-item label="预招人数:">
        <el-tag type="info">{{view.studentNumber}}</el-tag>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSchoolClassView } from "../../api/api";
export default {
  data() {
    return {
      view: {},
      loadingView: false
    }
  },
  created() {
    this.getData(this.viewId);
  },
  watch: {
    viewId(val) {
      this.getData(val);
    }
  },
  methods: {
    getData(viewId) {
      let self = this;
      this.loadingView = true;
      getSchoolClassView(viewId).then(data => {
        this.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
          self.$emit("loadSccess", data.data);
        } else {
          self.$message.error(data.message);
        }
      })
    }
  },
  props: {
    viewId: {
      default: "-1"
    }
  },
}
</script>

