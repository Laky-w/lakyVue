<template>
  <el-submenu :index="data.index" v-if="data.subs">
    <template slot="title"><i :class="data.icon" style="color: #2d2f33;font-size:26px"></i>
    <span style="padding-left:15px">{{data.title}}</span></template>
    <template v-for="obj in data.subs">
      <sub-menu :data="obj"></sub-menu> <!-- <<<<<<<<修改处 -->
    </template>
  </el-submenu>
  <el-menu-item :index="data.index" v-else>
    <i :class="data.icon" style="color: #2d2f33;font-size:26px"></i>
    <span slot="title" style="padding-left:15px">{{data.title}}</span>
  </el-menu-item>
</template>
<script>
import subMenu from './Sub'
export default {
  name: 'subMenu',
  props: ['data'],
  components: {subMenu}
}
</script>
