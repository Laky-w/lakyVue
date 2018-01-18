<template>
  <el-dialog :title="view.course.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="课程">
        <el-tag type="info">{{view.course.name}}</el-tag>
      </el-form-item>
      <el-form-item label="科目:">
        <el-tag type="info">{{view.course.clazzName}}</el-tag>
      </el-form-item>
      <el-form-item label="课程类型:">
        <el-tag type="info"> {{view.course.theType==1?"一对一":"一对多"}}</el-tag>
      </el-form-item>
      <el-form-item label="收费类型:">
        <el-tag type="info"> {{view.course.standardType==1?"标准收费":"区间收费"}}</el-tag>
      </el-form-item>
      <el-form-item label="描述:" style="width:100%">
        <el-input type="textarea" style="width:585px" :rows="3" disabled v-model="view.course.remarks" resize="none">
        </el-input>
      </el-form-item>
      <el-form-item label="收费信息" style="width:100%">
        <el-table :data="view.chargeStandards" stripe border empty-text="暂无收费信息" style="width:585px">
          <el-table-column label="课时" prop="minHourse">
            <template slot-scope="scope">
              <el-tag style="width:80px" type="info"> {{scope.row.minHourse}}</el-tag>
              <span v-if="view.course.standardType==2"> --</span>
              <el-tag style="width:80px" type="info"> {{scope.row.maxHourse}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="费用(￥)" prop="price">
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.freeTitle {
  display: inline-block;
  background-color: #faebd7;
  width: 220px;
  text-align: center;
  margin-bottom: 5px;
}
</style>
<script>
import { getCourseView } from "../../api/api";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: this.dialogViewVisible,
      view: {
        course: {},
        chargeStandards: []
      },
      loadingView: false,
      formLabelWidth: "120px"
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
      getCourseView(self.viewId).then(data => {
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

