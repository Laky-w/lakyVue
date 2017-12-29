<template>
<el-tabs tab-position="top" >
    <el-tab-pane label="进货">
      <purchase></purchase>
    </el-tab-pane>
    <el-tab-pane label="退货">
      配置管理</el-tab-pane>
    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
  </el-tabs>

</template>





// =========================================
<script>
import Purchase from "./Purchase.vue";

export default {

  components: { Purchase} //注入组件
};
</script>


