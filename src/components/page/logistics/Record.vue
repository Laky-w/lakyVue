<template>
  <div>
    <el-tabs tab-position="top" @tab-click="handleTabClick" :value="tableName">
      <el-tab-pane label="进货" name="stock">
      </el-tab-pane>
      <el-tab-pane label="退货" name="refund">
        <!-- <refund></refund> -->
      </el-tab-pane>
      <el-tab-pane label="销售" name="sale">
        <!-- <sale></sale> -->
      </el-tab-pane>
      <el-tab-pane label="领用" name="receive">
        <!-- <receive></receive> -->
      </el-tab-pane>
      <el-tab-pane label="图书借阅" name="library">
        <!-- <library></library> -->
      </el-tab-pane>
      <el-tab-pane label="调拨" name="allocate">
        <!-- <allocate></allocate> -->
      </el-tab-pane>
      <el-tab-pane label="库存调整" name="inventoryAdjustment">
        <!-- <inventory-adjustment></inventory-adjustment> -->
      </el-tab-pane>
    </el-tabs>
    <!-- <stock></stock> -->
    <component :is="tableName" transition="bounce" transition-mode="out-in"></component>
  </div>
</template>

<script>
import Stock from "./Stock.vue";
import Refund from "./Refund.vue";
import Sale from "./Sale.vue";
import Library from "./Library.vue";
import Allocate from "./Allocate.vue";
import Receive from "./Receive.vue";
import InventoryAdjustment from "./InventoryAdjustment.vue";

export default {
  data() {
    return {
      tableName: "stock"
    }
  },
  methods: {
    handleTabClick(element) {
      this.tableName = element.name;
      // console.log(element);
    }
  },
  components: { Stock, Refund, Sale, Library, Receive, Allocate, InventoryAdjustment, } //注入组件
};
</script>


