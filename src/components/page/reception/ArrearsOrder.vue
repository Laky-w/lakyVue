<template>
<el-tabs tab-position="top"  type="card">
  <el-tab-pane label="收费">
    <charge-order></charge-order>
  </el-tab-pane>
  <el-tab-pane label="退费">
    <!-- <charge-order></charge-order> -->
    <refund-order></refund-order>
  </el-tab-pane>
</el-tabs>

</template>
<script>
import ChargeOrder from "./ChargeOrder.vue";
import RefundOrder from "./RefundOrder.vue";
export default {
  components:{ChargeOrder,RefundOrder}
}

</script>
