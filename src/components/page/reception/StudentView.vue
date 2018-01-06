<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="名称:">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="校区:">
        <el-tag type="info">{{view.schoolZoneName}}</el-tag>
      </el-form-item>
      <el-form-item label="性别:">
        <el-tag type="info">{{view.sex==1?'男':'女'}}</el-tag>
      </el-form-item>
      <el-form-item label="联系电话:">
        <el-tag type="info"> {{view.phone}}</el-tag>
      </el-form-item>
      <el-form-item label="联系人:">
        <el-tag type="info">{{view.contactId}}</el-tag>
      </el-form-item>
      <el-form-item label="学管师:">
        <el-tag type="info">{{view.ownerId}}</el-tag>
      </el-form-item>
      <el-form-item label="报名状态:">
        <el-tag type="info">{{filterClassStatus(view.theType)}}</el-tag>
      </el-form-item>
      <el-form-item label="来源活动:">
        <el-tag type="info">{{view.sourceId}}</el-tag>
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-tag type="info">{{view.createTime}}</el-tag>
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
import { getStudentView } from "../../api/api";
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
      getStudentView(self.viewId).then(data => {
        this.loadingView = false;
        if (data.code == 200) {
          self.view = data.data;
        } else {
          self.$message.error(data.message);
        }
      })
    },
    filterClassStatus(theType) {
      let tag = "";
      if (theType == 1) tag = "未报名";
      else tag = "已报名";
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

