<template>
    <div>
        <div style="margin-bottom: 5px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item   v-for="(item,index) in levelList" :key="item.id">
                    <span v-if='index==levelList.length-1' class="redirect" @click="reload(index)">{{item.name}}</span>
                    <span v-else class="no-redirect">{{item.name}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="sidebar">
            <router-link style="margin-left: 5px;cursor: pointer;" tag="span" v-for="item in visitedViews" :to="item.path" :key="item.id">
               <el-tag size="mini" disable-transitions :style="visitedViewsCurrent.path==item.path?'color:#f5f7fa':'color:#2d2f33'" :key="item.id"
                :color="visitedViewsCurrent.path==item.path?'#67c23a':''" @close.stop="closeTag(item.path,$event)"
                closable>{{item.name}}
              </el-tag>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: [],
      visitedViews: [],
      visitedViewMap: new Map(),
      visitedViewsCurrent: {}
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    reload(index) {
      // console.log(this.levelList[index].components.default.created());
      // this.levelList[index].components.created();
      // // this.levelList[index].components.default.methods.getData();
      this.$router.push("reload");
      // this.$router.push(this.levelList[index].path+"?key="+new Date().getTime());
    },
    closeTag(path, event) {
      if (path) {
        for (let i = 0; i < this.visitedViews.length; i++) {
          var obj = this.visitedViews[i];
          if (obj.name == this.visitedViewMap.get(path).name) {
            this.visitedViews.splice(i, 1);
            break;
          }
        }
        this.visitedViewMap.delete(path);
      }
      event.cancelBubble = true;
      if (this.visitedViews.length > 0) {
        if (path == this.visitedViewsCurrent.path) {
          //关闭的是当前选择的标签
          this.$router.push(this.visitedViews[this.visitedViews.length - 1]);
        }
      } else {
        this.$router.push("/laky");
      }

      return false;

      // this.$router.push(this.visitedViews[this.visitedViews.length-1]);
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      //   const first = matched[0]
      //   if (first && first.name !== 'dashboard') {
      //     matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      //   }
      if (matched[matched.length - 1]) {
        var obj = matched[matched.length - 1];
        this.visitedViewsCurrent = obj; //当前路由

        if (!this.visitedViewMap.get(obj.path)) {
          //不存在
          if (this.visitedViews.length > 5) { //路由数量超出，就删除第一个
            console.log(this.visitedViews[0].path);
            this.visitedViewMap.delete(this.visitedViews[0].path);
            this.visitedViews.shift();
          }
          this.visitedViewMap.set(obj.path, obj);
          this.visitedViews.push(obj);
        }
      }
      this.levelList = matched;
    }
  }
};
</script>
<style>
.el-tag .el-icon-close {
  color: #2d2f33;
}
</style>

<style scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
.redirect {
  color: #2d2f33;
}
.redirect:hover {
  cursor: pointer;
  color: #409eff;
}
.sidebar {
  border: solid 1px #e6ebf5;
  border-right: 0px;
  border-left: 0px;
  margin: 2px -5px;
  padding: 3px;
  color: #2d2f33;
}
</style>
