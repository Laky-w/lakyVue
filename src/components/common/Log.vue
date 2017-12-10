<template>
    <div style="height:800px">
        <p class="title">项目开发重要节点记录</p>
        <el-steps direction="vertical" :active="3" align-center>
            <el-step title="2017/11/13" description="项目开始————by laky-w"></el-step>
            <el-step title="2017/12/08" description="系统基本功能ok"></el-step>
            <el-step title="2017/12/10" description="教务模块开始启动"></el-step>
            <el-step title="？？？" description="教务模块-课程功能"></el-step>
            <el-step title="？？？" description="教务模块-班级功能"></el-step>
            <el-step title="？？？" description="教务模块-排课功能"></el-step>
        </el-steps>
    </div>
</template>
<style scoped>
.title{
    color: #67c23a;
    font-weight: bold;
    text-align: center;
    margin: 10px;
}
</style>

