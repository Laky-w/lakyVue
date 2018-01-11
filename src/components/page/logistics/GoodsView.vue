<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-form ref="queryForm" :inline="true" :model="view" label-width="120px" class="viewForm" v-loading="loadingView">
      <el-form-item label="物品:">
        <el-tag type="info">{{view.name}}</el-tag>
      </el-form-item>
      <el-form-item label="成本价:">
        <el-tag type="info">{{view.price}}</el-tag>
      </el-form-item>
      <el-form-item label="售价:">
        <el-tag type="info">{{view.sellPrice}}</el-tag>
      </el-form-item>
      <el-form-item label="类别:">
        <el-tag type="info"> {{view.clazzName}}</el-tag>
      </el-form-item>
      <el-form-item label="库存:">
        <el-tag type="info">{{view.lastAmount}}</el-tag>
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-tag type="info">{{view.createTime}}</el-tag>
      </el-form-item>
      <el-form-item label="状态:">
        <el-tag type="info">{{(view.theType==1?"正常":"封存")}}</el-tag>
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
import { getGoodsView } from "../../api/api";
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
      getGoodsView(self.viewId).then(data => {
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

