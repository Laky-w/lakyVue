<template>
  <el-dialog :title="view.name" :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:dialogViewVisible', false)">
    <el-tabs tab-position="top" @tab-click="handleTabClick" :value="tableName">
      <el-tab-pane label="基本信息" name="class-info">
        <class-info ref="classInfo" :view-id="viewId" @loadSccess="loadSccess"></class-info>
      </el-tab-pane>
      <el-tab-pane label="在读学员" name="class-student">
        <!-- <refund></refund> -->
      </el-tab-pane>
    </el-tabs>

    <class-student v-if="tableName=='class-student'" :view-id="viewId" ref="class-student"></class-student>
    <!-- <component ref="currentComponent" :is="tableName" transition="bounce" transition-mode="out-in"></component> -->
  </el-dialog>
</template>


<script>
import ClassInfo from "./ClassInfo.vue";
import ClassStudent from "./ClassStudent.vue";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: this.dialogViewVisible,
      tableName: "class-info",
      view: {},
      loadingView: false
    }
  },
  watch: {
    dialogViewVisible(val) {
      this.visible = val;
      if (val === true) {
        this.tableName = this.currentTableName;
      }
    }
  },
  methods: {
    handleTabClick(element) {
      this.tableName = element.name;
      console.log(this.$refs["currentComponent"]);
      // console.log(element);
    },
    loadSccess(data) {
      this.view = data;
    }
  },
  props: {
    viewId: "",
    currentTableName: "",
    dialogViewVisible: {
      default: false,
    }
  },
  components: { ClassInfo, ClassStudent } //注入组件
}
</script>

