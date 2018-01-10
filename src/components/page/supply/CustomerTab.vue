<template>
  <div>
    <el-tabs tab-position="top" @tab-click="handleTabClick" :value="tableName">
      <el-tab-pane label="全部" name="customer">
      </el-tab-pane>
      <el-tab-pane label="待分配生源" name="customer-allot">
        <!-- <refund></refund> -->
      </el-tab-pane>
      <el-tab-pane label="已分配生源" name="customer-allot-y">
        <!-- <sale></sale> -->
      </el-tab-pane>
      <el-tab-pane label="已回收生源" name="customer-public">
        <!-- <receive></receive> -->
      </el-tab-pane>
      <el-tab-pane label="今日新增生源" name="customer-today">
        <!-- <library></library> -->
      </el-tab-pane>
    </el-tabs>
    <!-- <stock></stock> -->
    <component :is="tableName" transition="bounce" transition-mode="out-in"></component>
  </div>
</template>

<script>
import Customer from "./Customer.vue";
import CustomerAllot from "./CustomerAllot.vue";
import CustomerAllotY from "./CustomerAllotY.vue";
import CustomerPublic from "./CustomerPublic.vue";
import CustomerToday from "./CustomerToday.vue";

export default {
  data() {
    return {
      tableName: "customer"
    }
  },
  methods: {
    handleTabClick(element) {
      this.tableName = element.name;
      // console.log(element);
    }
  },
  components: { Customer, CustomerAllot, CustomerAllotY, CustomerPublic, CustomerToday } //注入组件
};
</script>


