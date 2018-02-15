<template>
  <div>
    <el-tabs tab-position="top" @tab-click="handleTabClick" :value="tableName">
      <el-tab-pane label="全部课表" name="course-schedule-all">
      </el-tab-pane>
      <el-tab-pane label="教师课表" name="course-schedule-teach">
        <!-- <refund></refund> -->
      </el-tab-pane>
      <el-tab-pane label="教室课表" name="course-schedule-room">
        <!-- <sale></sale> -->
      </el-tab-pane>
    </el-tabs>
    <component :is="tableName" transition="bounce" transition-mode="out-in"></component>
  </div>

</template>
<script>
import CourseScheduleClass from "./CourseScheduleClass.vue";
import CourseScheduleAll from "./CourseScheduleAll.vue";
import CourseScheduleTeach from "./CourseScheduleTeach.vue";
import CourseScheduleRoom from "./CourseScheduleRoom.vue";
export default {
  data() {
    return {
      tableName: "course-schedule-class"
    }
  },
  methods: {
    handleTabClick(element) {
      this.tableName = element.name;
      // console.log(element);
    }
  },
  components: { CourseScheduleAll, CourseScheduleClass, CourseScheduleTeach, CourseScheduleRoom }
}
</script>

