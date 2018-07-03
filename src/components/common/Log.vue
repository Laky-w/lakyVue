<template>
  <div style="height:800px">
    <vue-particles style="position: absolute;z-index: 22;width:100%;height:800px" color="#fff" :particleOpacity="0.7" :particlesNumber="120" shapeType="circle" :particleSize="4" linesColor="#409eff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <p class="title" style="color:#2d2f33;">项目重要节点记录</p>
    <div style="width:300px; float: left;">
      <p class="title">项目第一阶段————核心流程搭建</p>
      <el-steps direction="vertical" :active="16" align-center>
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
    </div>
    <div style="width:300px; float: left;">
      <p class="title">项目第二阶段————功能细化</p>
      <el-steps direction="vertical" :active="8" align-center style="width:300px; float: left;">
        <el-step title="2018/1/5" description="项目第二阶段开始————by laky-w"></el-step>
        <el-step title="2018/1/6" description="系统细化————by laky-w"></el-step>
        <el-step title="2018/1/6" description="页面详情搭建————by hreo"></el-step>
        <el-step title="2018/1/7" description="部署到服务器————by w"></el-step>
        <el-step title="2018/1/13" description="页面详情搭建end————by hreo"></el-step>
        <el-step title="2018/1/14" description="页面排序搭建start————by hreo"></el-step>
        <el-step title="2018/01/09" description="前台细化start————by laky-w"></el-step>
        <el-step title="2018/01/15" description="前台细化end————by laky-w"></el-step>
        <el-step title="2018/01/16" description="教务细化start————by laky-w"></el-step>
        <el-step title="2018/02/15" description="教务细化end————by laky-w"></el-step>
        <el-step title="2018/02/15" description="第二阶段基本完工————by laky-w"></el-step>
      </el-steps>
    </div>
    <div style="clear: both;"></div>

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

