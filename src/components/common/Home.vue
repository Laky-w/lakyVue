<template>
  <div class="wrapper">
    <v-head></v-head>
    <div>
      <v-sidebar v-on:changeCollapseEvent="changeCollapse"></v-sidebar>
      <div :class="{'big-content':isCollapse,'content':!isCollapse}">
        <div style="background-color:#ffffff;padding:5px;min-height: 98%;">
          <nav-bar></nav-bar>
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import NavBar from "./Navbar.vue";
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  components: {
    vHead,
    vSidebar,
    NavBar
  },
  methods: {
    changeCollapse(data) {
      this.isCollapse = data;
    }
  }
};
</script>
