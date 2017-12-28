<template>
    <div  class="sidebar" style="float:left">
        <div :class="{'active':isCollapse,'unactive':!isCollapse}" >
            <span @click="changeCollapse"><i class="el-icon-menu"></i></span>
        </div>
        <el-menu :default-active="onRoutes" unique-opened class="el-menu-vertical-demo"  :collapse="isCollapse"  router>
            <template v-for="item in items">
                <sub-menu :data="item"></sub-menu>
            </template>
        </el-menu>
    </div>
</template>

<script>
import subMenu from "./Sub";
import { getMenu } from "../api/api";
import { getRoutesList } from "../../router";
export default {
  data() {
    return {
      items: [],
      isCollapse: true
    };
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("changeCollapseEvent", this.isCollapse);
    }
  },
  created: function() {
    var self = this;
    getMenu().then(data => {
      self.items = data.data;
      getRoutesList(data.data);
    });
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  components: { subMenu }
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.sidebar {
  display: block;
  position: absolute;
  width: 500px;
  left: 0;
  top: 70px;
  bottom: 0;
  /* box-sizing: border-box; */
  overflow-y: scroll;
  background-color: #f5f7fa;
  /* background: #2E363F; */
}
.sidebar > ul {
  height: 95%;
}
.active,
.unactive {
  transition: width 0.28s;
  text-align: center;
  font-size: 25px;

  cursor: pointer;
  border-right: solid 1px #e6e6e6;
  color: #409eff;
  padding-top: 15px;
}
.active {
  width: 64px;
}
.unactive {
  width: 200px;
}
</style>
