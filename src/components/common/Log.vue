<template>
  <div style="height:800px">
    <p class="title">项目开发重要节点记录</p>
    <el-steps direction="vertical" :active="16" align-center style="width:300px; float: left;">
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
      <el-step title="2017/12/27" description="报名功能完结————by laky-w"></el-step>
      <el-step title="2017/12/28" description="财务功能开始————by laky-w"></el-step>
      <el-step title="2018/1/4" description="财务基本功能完结、后勤功能完结。第一阶段完成————by laky-w"></el-step>、
      <!-- <el-step title="2017/1/4" description="排课基础功能完结————by laky-w"></el-step> -->
    </el-steps>
    <el-steps direction="vertical" :active="1" align-center style="width:300px; float: left;">
      <el-step title="2018/1/5" description="项目第二阶段开始————by laky-w"></el-step>
      <el-step title="？？？" description="系统细化————by laky-w"></el-step>
      <el-step title="？？？" description="前台细化————by laky-w"></el-step>
    </el-steps>
  </div>
</template>
<style scoped>
.title {
  color: #67c23a;
  font-weight: bold;
  text-align: center;
  margin: 10px;
}
</style>

