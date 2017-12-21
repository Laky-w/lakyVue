<template>
  <div style="height:50px;position:relative;">
    <el-input @focus="isShow=false"
      placeholder="输入校区名称"
      v-model="filterText">
    </el-input>
    <div :class="{treeDivH:isShow,treeDiv:true}">
      <el-tree
        class="filter-tree"
        :data="data2"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree2">
      </el-tree>
    </div>
  </div>
</template>
<style scoped>
.treeDivH {
  display: none;
}
.treeDiv {
  position: absolute;
  z-index: 88;
  width: 99.8%;
  top: 42px;
  border: solid 1px #66b1ff;
}
</style>

<script scoped>
import { findSchoolZoneAll } from "../../../api/api";
export default {
  // watch: {
  //   filterText(val) {
  //     this.$refs.tree2.filter(val);
  //   }
  // },
  created() {
    // 点击其他不在的区域触发事件
    document.addEventListener("click", e => {
      if (!this.$el.contains(e.target)) {
        this.isShow = true;
      }
    });
    this.getSchool();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    changeShow() {
      this.isShow = false;
    },
    getSchool() {
      let self = this;
      self.loading = true;
      findSchoolZoneAll().then(data => {
        self.loading = false;
        if (data.code == 200) {
          let treeArray = [];
          treeArray.push(data.data);
          self.data2 = treeArray;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    handleNodeClick(data) {
      this.filterText = data.name;
      this.isShow = true;
      this.$emit("nodeClick", data);
    }
  },

  data() {
    return {
      filterText: "",
      isShow: true,
      data2: [],
      defaultProps: {
        children: "childrenList",
        label: "name"
      }
    };
  }
};
</script>
