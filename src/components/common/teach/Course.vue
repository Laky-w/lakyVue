<template>
    <div class="block">
        <el-cascader style="width:100%"
            placeholder="试试搜索：课程名称"
            :options="options"  expand-trigger="hover" v-model="selectedOptions"
            filterable>
        </el-cascader>
    </div>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: []
    };
  },
  watch: {
    value(val) {
      if (!val) this.selectedOptions = [];
    },
    selectedOptions(val) {
      console.log(val);
      if (val.length>0 ) this.$emit("input", val[2]);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios.get("teach/getCourseTreeList").then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.options = data.data;
        }
      });
    }
  },
  props: {
    value: ""
  }
};
</script>
