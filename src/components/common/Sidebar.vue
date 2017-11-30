<template>
    <div  class="sidebar" style="float:left">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 5px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <div :class="{'active':isCollapse,'unactive':!isCollapse}" >
            <span @click="changeCollapse"><i class="el-icon-menu"></i></span>
        </div>
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"  :collapse="isCollapse"  router>
            <template v-for="item in items">
                <sub-menu :data="item"></sub-menu>
            </template>
        </el-menu>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo"  :collapse="isCollapse">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">导航一</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">分组一</span>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <span slot="title">选项4</span>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-setting"></i>
                <span slot="title">导航三</span>
            </el-menu-item>
        </el-menu> -->
    </div>
</template>

<script>
    import subMenu from './Sub';
    export default {
        data() {
            return {
                items: [],
                isCollapse:true
            }
        },
        methods: {
            changeCollapse(){
                this.isCollapse=!this.isCollapse;
                this.$emit("changeCollapseEvent",this.isCollapse);
            }
        },
        created:function(){
            var self = this;
            self.$axios.get("organization/getMenu").then((res) => {
                self.items = res.data.data;
            })
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        components: {subMenu}
    }
    
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 500px;
        left: 0;
        top: 70px;
        bottom:0;
        /* box-sizing: border-box; */
        overflow-y:scroll;
        background-color: #f5f7fa;
        /* background: #2E363F; */
    }
    .sidebar > ul {
        height:95%;
    }
    .active,.unactive{
        transition: width .28s;
        text-align: center;
        font-size: 25px;
            
        cursor: pointer;  
        border-right: solid 1px #e6e6e6;
        color: #409eff;
        padding-top: 15px;
        
    }
    .active{
        width: 64px;
    }
    .unactive{
        width: 200px;
    }
    
</style>
