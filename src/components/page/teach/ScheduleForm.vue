<template>
  <el-dialog title="排课" :visible.sync="visbile" :close-on-click-modal="false">
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="班级" style="display:inline-block;" :label-width="formLabelWidth" required>
        {{form.className}}
      </el-form-item>
      <el-form-item label="冲突检测" style="display:inline-block;" :label-width="formLabelWidth" prop="isChecked">
        <el-switch v-model="form.isChecked">
        </el-switch>
        教师，教室，班级，上课时间是否冲突
      </el-form-item>
      <el-form-item label="任课老师" :label-width="formLabelWidth" prop="teacherId" :rules="[{ required: true, message: '任课老师必填'}]">
        <user-dialog v-model="form.teacherId" title="选择任课老师" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="任课老师" :default-text="form.teacherName" />
      </el-form-item>
      <el-form-item label="助教" :label-width="formLabelWidth">
        <user-dialog v-model="form.helpTeacherId" title="选择助教" :selected-type="2" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="助教老师" />
      </el-form-item>
      <el-form-item label="教室" :label-width="formLabelWidth" prop="roomId" :rules="[{ required: true, message: '教室必填'}]">
        <room-dialog v-model="form.roomId" :default-text="form.roomName" />
      </el-form-item>
      <el-form-item label="排课日期" :label-width="formLabelWidth" prop="scheduleDate" :rules="[{ required: true, message: '排课日期必填'}]">
        <el-date-picker v-model="form.scheduleDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排课次数" :label-width="formLabelWidth" prop="maxCount">
        <el-input-number style="width:100%" v-model="form.maxCount" :min="0" />
      </el-form-item>
      <el-form-item label="上课时间" :label-width="formLabelWidth" prop="startDate">
        <el-table :data="form.classTimes" stripe border empty-text="请选择上课时间" style="width: 100%" class="scheduleTable">
          <el-table-column label="星期">
            <template slot-scope="scope">
              <el-form-item size="mini" :prop="'classTimes.' + scope.$index + '.weekDay'" :rules="[{ required: true, message: '该项必填'}]">
                <el-select v-model="scope.row.weekDay" placeholder="星期" class="handle-select">
                  <el-option v-for="item in weeks" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="上课时间" width="230px">
            <template slot-scope="scope">
              <el-form-item size="mini" :prop="'classTimes.' + scope.$index + '.classTime'" :rules="[{ required: true, message: '该项必填'}]">
                <el-time-picker is-range v-model="scope.row.classTime" format="HH:mm" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择上课时间">
                </el-time-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="课时">
            <template slot-scope="scope">
              <el-form-item size="mini" :prop="'classTimes.' + scope.$index + '.courseHour'" :rules="[{ required: true, message: '该项必填'}]">
                <el-input-number style="width:100%" v-model="scope.row.courseHour" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button size="mini" v-if="form.classTimes.length!=1" type="danger" plain @click="form.classTimes.splice(scope.$index, 1);">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item style="margin-top:10px">
          <el-button type="success" @click="dialogVisible=true">添加上课时间</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-dialog title="选择日期" :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="weekForm" ref="weekForm">
        <el-card>
          <div slot="header">
            <el-checkbox v-model="workDay" @change="handleChangeWorkDay">工作日</el-checkbox>
            <el-checkbox v-model="restDay" @change="handleChangeRestDay">周 末</el-checkbox>
          </div>
          <el-form-item prop="checkedDay" :rules="[{ required: true, message: '该项必填'}]">
            <el-checkbox-group v-model="weekForm.checkedDay">
              <el-checkbox v-for="item in weeks" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-card>
        <el-card>
          <div slot="header">

            <el-form-item label="常用时间段" :label-width="formLabelWidth" style="margin-bottom:0px">
              <el-select v-model="weekForm.schoolTime" placeholder="请选择" size="mini" @change="handleChangeSchoolTime">
                <el-option v-for="item in schoolTimes" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.startTime }}--{{ item.endTime }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-table :data="weekForm.classTimes" stripe border empty-text="请选择上课时间" style="width: 100%" class="scheduleTable">
            <el-table-column label="上课时间">
              <template slot-scope="scope">
                <el-form-item size="mini" :prop="'classTimes.' + scope.$index + '.classTime'" :rules="[{ required: true, message: '该项必填'}]">
                  <el-time-picker is-range v-model="scope.row.classTime" range-separator="至" format="HH:mm" value-format="HH:mm" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择上课时间">
                  </el-time-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="课时">
              <template slot-scope="scope">
                <el-form-item size="mini" :prop="'classTimes.' + scope.$index + '.courseHour'" :rules="[{ required: true, message: '该项必填'}]">
                  <el-input-number style="width:100%" v-model="scope.row.courseHour" :min="0" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false;">取 消</el-button>
        <el-button type="primary" @click="handleClickTimeOk">确 定</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visbile=false;">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style>
.scheduleTable .el-form-item {
  margin-bottom: 0px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import Course from "../../common/teach/Course.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
import { createClassSchedule, getScheduleStandard, doCheckedScheduleRepeat } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: false,
      visbile: false,
      workDay: "",
      restDay: "",
      weeks: [
        {
          id: 2,
          label: "星期一",
        },
        {
          id: 3,
          label: "星期二",
        },
        {
          id: 4,
          label: "星期三",
        },
        {
          id: 5,
          label: "星期四",
        },
        {
          id: 6,
          label: "星期五",
        },
        {
          id: 7,
          label: "星期六",
        },
        {
          id: 1,
          label: "星期日",
        },
      ],
      schoolTimes: [],
      weekForm: {
        checkedDay: [],
        schoolTime: "",
        classTimes: [
          {
            classTime: [new Date().Format("hh:ss"), new Date((Date.now() + 60 * 60 * 1000)).Format("hh:ss")],
            courseHour: 1
          }
        ]

      },
      form: {
        //表单 v-modle绑定的值
        classId: "",
        className: "",
        teacherId: "",
        teacherName: "",
        isChecked: true,
        roomId: "",
        roomName: "",
        helpTeacherId: [],
        scheduleDate: [],
        maxCount: 0,
        schoolZoneId: "",
        classTimes: [{
          weekDay: 2,
          classTime: [new Date().Format("hh:ss"), new Date((Date.now() + 60 * 60 * 1000)).Format("hh:ss")],
          courseHour: 1,
        }]
      },
      formLabelWidth: "120px",
      loadingForm: false,
    };
  },
  created() {
    this.getSchoolId();
    this.loadScheduleStandard();
  },
  computed: {
    //实时计算
    startDate() {
      return this.form.startDate;
    }
  },
  watch: {
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
    },
    loadScheduleStandard() {
      getScheduleStandard(1, 20, { parentSchoolId: this.form.schoolZoneId }).then(data => {
        if (data.code == 200) {
          this.schoolTimes = data.data.list;
        }
      })
    },
    handleOpenDialog(val) {
      this.visbile = true;
      // console.log(this.form);
      this.form.classId = val.id;
      this.form.className = val.name;
      this.form.roomId = val.roomId;
      this.form.roomName = val.roomName;
      this.form.teacherId = val.teacherId;
      this.form.teacherName = val.teacherName;
      // this.titleText = "开班";
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields();
      }

    },
    //保存表单
    submitForm() {
      let self = this;
      let message = self.checkisExistTime(); //本地上课时间重复检测
      if (message) {
        this.$message.error(message);
        return false;
      }
      //服务器冲突检测

      self.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (self.form.isChecked) {//检查排课冲突
            self.loadingForm = true;
            doCheckedScheduleRepeat({ scheduleFormStr: JSON.stringify(self.form) }).then(data => {
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
      });
    },

    saveClassSchedule() {
      let self = this;
      self.loadingForm = true;
      createClassSchedule({ scheduleFormStr: JSON.stringify(self.form) }).then(data => {
        self.loadingForm = false;
        if (data.code == 200) {
          self.visbile = false;
          self.$message.success(data.message);
          self.$refs["ruleForm"].resetFields();
        } else {
          this.$message.error(data.data);
        }
      });
    },
    checkisExistTime() {//检查重复上课时间
      let message = "";
      this.form.classTimes.forEach((item, i) => {
        for (let j = i; j < this.form.classTimes.length; j++) {
          let item2 = this.form.classTimes[j];
          if (i != j && item.weekDay == item2.weekDay && item.classTime[0] == item2.classTime[0] && item.classTime[1] && item2.classTime[1]) {
            message += "第" + (i + 1) + "行和第" + (j + 1) + "行上课时间重复！";
          }
        }
      })
      return message;
    },
    handleSchool(data) {
      this.form.schoolName = data.name;
      this.form.schoolZoneId = data.id;
    },

    handleChangeWorkDay(val) {
      let self = this;
      if (val) {
        for (let i = 2; i < 7; i++) {
          if (self.weekForm.checkedDay.indexOf(i) == -1) {
            self.weekForm.checkedDay.push(i);
          }
        }
      } else {
        for (let i = 2; i < 7; i++) {
          let index = self.weekForm.checkedDay.indexOf(i);
          if (index != -1) {
            self.weekForm.checkedDay.splice(index, 1);
          }
        }
      }
    },
    handleChangeRestDay(val) {
      let self = this;
      if (val) {
        for (let i = 1; i < 8; i = i + 6) {
          if (self.weekForm.checkedDay.indexOf(i) == -1) {
            self.weekForm.checkedDay.push(i);
          }
        }
      } else {
        for (let i = 1; i < 8; i = i + 6) {
          let index = self.weekForm.checkedDay.indexOf(i);
          if (index != -1) {
            self.weekForm.checkedDay.splice(index, 1);
          }
        }
      }
    },
    handleClickTimeOk() {
      let self = this;
      self.$refs["weekForm"].validate(valid => {
        if (valid) {
          self.weekForm.checkedDay.forEach(item => {
            self.weekForm.classTimes.forEach(tiem => {
              self.form.classTimes.push({
                weekDay: item,
                classTime: tiem.classTime,
                courseHour: tiem.courseHour
              })
            })
          })
          self.dialogVisible = false;
          self.$refs["weekForm"].resetFields();
        } else {
          return false;
        }
      })
    },
    handleChangeSchoolTime(value) {
      let self = this;
      console.log(value);
      this.schoolTimes.forEach(item => {
        if (item.id == value) {
          self.weekForm.classTimes.forEach(time => {
            time.classTime = [item.startTime, item.endTime];
            time.courseHour = item.courseHour;
          })
        }
      })
    },

  },
  props: {
  },
  components: { SchoolTree, Course, UserDialog, RoomDialog } //注入组件
}
</script>
