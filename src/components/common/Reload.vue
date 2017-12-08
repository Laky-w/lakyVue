<template>
<div v-loading="loading" style="height:100%"></div>
</template>

<script >
export default {
   data(){
       return{
           loading:true
       }
   },
   created() {
    this.$router.history.go(-1);
  },
}
</script>
