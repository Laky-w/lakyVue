<template>
  <el-dialog title="修改排课" :visible.sync="visbile" :close-on-click-modal="false">
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="任课老师" :label-width="formLabelWidth" prop="teachId" :rules="[{ required: true, message: '任课老师必填'}]">
        <user-dialog v-model="form.teachId" title="选择任课老师" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="任课老师" :default-text="form.teachName" />
      </el-form-item>
      <el-form-item label="助教" :label-width="formLabelWidth">
        <user-dialog v-model="form.helpTeacherId" title="选择助教" :selected-type="2" :default-text="form.helpTeacherName" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="助教老师" />
      </el-form-item>
      <el-form-item label="教室" :label-width="formLabelWidth" prop="roomId" :rules="[{ required: true, message: '教室必填'}]">
        <room-dialog v-model="form.roomId" :is-all="false" :default-text="form.roomName" :parent-school-id="form.schoolZoneId" />
      </el-form-item>
      <el-form-item label="上课日期" :label-width="formLabelWidth" prop="scheduleDate" :rules="[{ required: true, message: '上课时间必填'}]">
        <el-date-picker v-model="form.scheduleDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上课时间" :label-width="formLabelWidth" prop="scheduleTime" :rules="[{ required: true, message: '上课时间必填'}]">
        <el-time-picker is-range v-model="form.scheduleTime" format="HH:mm" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择上课时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="课时" :label-width="formLabelWidth" prop="hour" :rules="[{ required: true, message: '课时必填'}]">
        <el-input-number style="width:100%" v-model="form.hour" :min="0.5" :max="10"> </el-input-number>
      </el-form-item>
      <el-form-item label="冲突检测" style="display:inline-block;" :label-width="formLabelWidth" prop="isChecked">
        <el-switch v-model="form.isChecked">
        </el-switch>
        教师，教室，班级，上课时间是否冲突
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visbile=false;">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserDialog from "../../common/system/UserDialog.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
//getClassSchedule
import { getClassSchedule, updateClassSchedule, doCheckedScheduleRepeat } from "../../api/api";
export default {
  data() {
    return {
      visbile: false,
      loadingForm: false,
      formLabelWidth: "120px",
      form: {
        teachId: "",
        teachName: "",
        helpTeacherId: [],
        isChecked: true,
        helpTeacherName: "",
        roomId: "",
        roomName: "",
        hour: 0,
        scheduleDate: [],
        scheduleTime: []
      }
    }
  },
  methods: {
    openDialog(id) {
      getClassSchedule(id).then(data => {
        if (data.code == 200) {
          this.visbile = true;
          let obj = data.data;
          let helpTeacherId = [];
          if (obj.helpTeacherId) {
            helpTeacherId = obj.helpTeacherId.split(",");
          }
          // obj.helpTeacherId = helpTeacherId;
          this.form = {
            id: obj.id,
            teachId: obj.teachId,
            teachName: obj.teachName,
            helpTeacherId: helpTeacherId,
            isChecked: true,
            classId: obj.schoolClassId,
            className: obj.schoolClassName,
            helpTeacherName: obj.helpTeacherName,
            roomName: obj.roomName,
            roomId: obj.roomId,
            hour: obj.hour,
            schoolZoneId: obj.schoolZoneId,
            scheduleDate: obj.startTime.split(" ")[0],
            scheduleTime: [obj.startTime.split(" ")[1], obj.endTime.split(" ")[1]]
          };
        }
      })

    },
    submitForm(refForm) {
      let self = this;
      let scheduleDates = this.form.scheduleDate.replace(/-/g, "/");
      let scheduleDateNext = new Date((new Date(scheduleDates) / 1000 + 86400) * 1000).Format("yyyy-MM-dd")
      console.log(new Date(scheduleDates).getDay(), this.form.scheduleDate);
      self.$refs[refForm].validate(valid => {
        if (valid) {
          if (self.form.isChecked) {//检查排课冲突
            self.loadingForm = true;
            let checkFrom = {
              scheduleId: self.form.id,
              classId: self.form.classId,
              className: self.form.className,
              teacherId: self.form.teachId,
              teacherName: self.form.teachName,
              isChecked: self.form.isChecked,
              roomId: self.form.roomId,
              roomName: self.form.roomName,
              helpTeacherId: self.form.helpTeacherId,
              scheduleDate: [self.form.scheduleDate, scheduleDateNext],
              maxCount: 1,
              schoolZoneId: self.form.schoolZoneId,
              classTimes: [{
                weekDay: new Date(scheduleDates).getDay() + 1,
                classTime: self.form.scheduleTime,
                courseHour: self.form.hour,
              }]
            };
            doCheckedScheduleRepeat({ scheduleFormStr: JSON.stringify(checkFrom) }).then(data => {
              self.loadingForm = false;
              if (data.code == 200) {
                let repeatData = data.data;
                if (repeatData.code == 200) {
                  self.saveClassSchedule();
                } else {
                  this.$confirm(repeatData.message + '是否忽略继续?', '排课资源冲突检测提醒', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                  }).then(() => {
                    self.saveClassSchedule();
                  }).catch(() => {
                    return false;
                  });
                }
              } else {
                self.$message.error(data.data);
              }
            })
          } else {
            self.saveClassSchedule();
          }
        } else {
          return false;
        }
      })
    },
    saveClassSchedule() {
      let self = this;
      self.loadingForm = true;
      updateClassSchedule(self.form).then(data => {
        self.loadingForm = false;
        if (data.code == 200) {
          self.$message.success(data.message);
          self.$refs[refForm].resetFields();
          self.visbile = false;
          self.$emit("saveSuccess", data.data);
        } else {
          self.$message.error(data.data);
        }
      })
    }
  },
  components: { UserDialog, RoomDialog } //注入组件
}
</script>
