<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="性别:">
        <el-tag type="info">{{view.sex ==1?'男':'女'}}</el-tag>
      </el-form-item>
      <el-form-item label="生日:">
        <el-tag type="info"> {{view.birthday}}</el-tag>
      </el-form-item>
      <el-form-item label="电话:">
        <el-tag type="info">{{view.phone}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{view.schoolZoneName}}</el-tag>
      </el-form-item>
      <el-form-item label="负责人:">
        <el-tag type="info">{{view.ownerName}}</el-tag>
      </el-form-item>
      <el-form-item label="课程:">
        <el-tag type="info"> {{view.intentionCourseName}}</el-tag>
      </el-form-item>
      <el-form-item label="联系人:">
        <el-tag type="info">{{view.contactName}}</el-tag>
      </el-form-item>
      <el-form-item label="活动:">
        <el-tag type="info">{{view.sourceName}}</el-tag>
      </el-form-item>
      <el-form-item label="最后更新时间:">
        <el-tag type="info"> {{view.createTime}}</el-tag>
      </el-form-item>
      <el-form-item label="备注:" style="width:100%">
        <el-input type="textarea" style="width:585px" :rows="3" placeholder="请输入内容" disabled v-model="view.remarks" resize="none">
        </el-input>
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
import { getCustomerView } from "../../api/api";
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
      getCustomerView(self.viewId).then(data => {
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

