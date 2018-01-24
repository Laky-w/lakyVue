<template>
  <div class="block">
    <el-cascader style="width:100%" placeholder="试试搜索：课程名称/类别名称/类型" :options="options" expand-trigger="hover" v-model="selectedOptions" filterable>
    </el-cascader>
  </div>
</template>
<script>
import { getCourseTreeList } from "../../api/api";
export default {
  data() {
    return {
      options: [],
      selectedOptions: this.defaultValue
    };
  },
  watch: {
    value(val) {
      if (!val) {
        this.selectedOptions = [];
      } else {
        this.selectedOptions = this.defaultValue;
      }
    },
    selectedOptions(val) {
      if (val.length > 0) this.$emit("input", val[2]);
    }
  },

  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCourseTreeList().then(data => {
        if (data.code == 200) {
          this.options = data.data;
        }
      });
    }
  },
  props: {
    value: "",
    defaultValue: {
      default: []
    }
  }
};
</script>
