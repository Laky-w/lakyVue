<template>
    <div style="height:800px">
        <p class="title">项目开发重要节点记录</p>
        <el-steps direction="vertical" :active="11" align-center>
            <el-step title="2017/11/13" description="项目开始————by laky-w"></el-step>
            <el-step title="2017/12/08" description="系统基本功能ok"></el-step>
            <el-step title="2017/12/10" description="教务模块开始启动"></el-step>
            <el-step title="2017/12/11" description="教务模块-课程功能"></el-step>
            <el-step title="2017/12/15" description="教务模块-班级功能"></el-step>
            <el-step title="2017/12/15" description="教务模块-核心功能ok"></el-step>
            <el-step title="2017/12/16" description="招生模块-启动"></el-step>
            <el-step title="2017/12/17" description="招生模块基础功能完成，功能文档编写启动"></el-step>
            <el-step title="2017/12/22" description="apiJs处理"></el-step>
            <el-step title="2017/12/23" description="后勤模块开始————by hreo"></el-step>
            <el-step title="2017/12/23" description="前台模块开始————by laky-w"></el-step>
            <el-step title="2017/12/24" description="报名"></el-step>
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

