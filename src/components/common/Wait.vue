<template>
  <div class="wait">
    <h3 style="text-align: center;color: #eb9e05;">系统开发中，敬请期待！！！</h3>
    <img src="../../../static/img/wait3.gif" />
  </div>
</template>
<style>
.wait {
  width: 100%;
  min-height: 800px;
  /* background-image: url(../../../static/img/wait.png); */
  background-repeat: no-repeat;
  background-size: 100%;
  text-align: center;
}
</style>
<script>
export default {
  created() {
    // this.$router.history.go(-1);
    // this.$router.push(this.$router.currentRoute.redirectedFrom);
    // console.log(this.$router.currentRoute.redirectedFrom);
  },
}
</script>
