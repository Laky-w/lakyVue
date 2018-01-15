<template>
  <div>
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '班级名称必填'}]">
        <el-input v-model="form.name" placeholder="班级名称"></el-input>
      </el-form-item>
      <el-form-item label="课程" :label-width="formLabelWidth" prop="courseId" :rules="[{ required: true, message: '课程必填'}]">
        <course v-model="form.courseId" :default-value="form.courseInfo"></course>
      </el-form-item>
      <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '校区必填'}]">
        <school-tree @nodeClick="handleSchool" :name="form.schoolZoneName" :the-type="2" place-text="校区" :default-value="form.schoolZoneId"></school-tree>
      </el-form-item>
      <el-form-item label="主教" :label-width="formLabelWidth" prop="mainTeacherId">
        <user-dialog v-model="form.mainTeacherId" title="选择主教" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="主教" :default-text="form.mainTeacherName"></user-dialog>
      </el-form-item>
      <el-form-item label="班主任" :label-width="formLabelWidth" prop="teacherId">
        <user-dialog v-model="form.teacherId" title="选择班主任" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="班主任" :default-text="form.teacherName"></user-dialog>
      </el-form-item>
      <el-form-item label="默认教室" :label-width="formLabelWidth" prop="roomId">
        <room-dialog v-model="form.roomId" :parent-school-id="form.schoolZoneId" :is-all="false" :default-text="form.roomName"></room-dialog>
      </el-form-item>
      <el-form-item label="计划开班日期" :label-width="formLabelWidth" prop="startDate">
        <el-date-picker v-model="form.startDate" type="date" value-format="yyyy-MM-dd" placeholder="计划开班日期" :picker-options="pickerOptions1">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划结课日期" :label-width="formLabelWidth" prop="endDate">
        <el-date-picker v-model="form.endDate" :picker-options="pickerOptions2" type="date" value-format="yyyy-MM-dd" placeholder="计划结课日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
        <el-input v-model="form.remarks" :rows=3 type="textarea" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import Course from "../../common/teach/Course.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
import { createSchoolClass, getSchoolClassView } from "../../api/api";
export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          if (this.form.startDate) {
            return time.getTime() < new Date(this.form.startDate);
          } else {
            return time.getTime() < Date.now();
          }
        }
      },
      oldForm: {
        //表单 v-modle绑定的值
        name: "",
        courseId: "",
        courseInfo: [],
        mainTeacherId: "",
        teacherId: "",
        startDate: "",
        endDate: "",
        schoolZoneId: "",
        schoolZoneName: ""
      },
      form: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loadingForm: false,
    };
  },
  created() {
    this.getSchoolId();
    if (this.editClass) {
      let obj = this.editClass;
      obj.courseInfo = [obj.clazzId, obj.theType, obj.courseId];
      this.form = obj;
    }
  },
  computed: {
    //实时计算
    startDate() {
      return this.form.startDate;
    }
  },
  watch: {
    startDate(val) {

      this.form.endDate = "";
    },
    editClass(val) {
      val.courseInfo = [val.clazzId, val.theType, val.courseId];
      this.form = val;
    }
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.oldForm.schoolZoneId = user.schoolZoneId;
      self.oldForm.schoolZoneName = user.schoolZone.name;
    },
    //保存表单
    submitForm(callback) {
      let self = this;
      self.$refs["ruleForm"].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createSchoolClass(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.dialogFormVisible = false;
            } else {
              this.$message.error(data.data);
            }
            if (callback) {
              callback(data.data);
            }
          });
        } else {
          if (callback) {
            callback(false);
          }
          return false;
        }
      });
    },
    handleEditOpenDialog(id) {
      getSchoolClassView(id).then(data => {
        this.dialogFormVisible = true;
        let obj = data.data;
        obj.courseInfo = [obj.clazzId, obj.theType, obj.courseId]
        this.form = obj;
      })
    },
    handleSchool(data) {
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
    }
  },
  props: {
    editClass: "",//选择班级
  },
  components: { SchoolTree, Course, UserDialog, RoomDialog } //注入组件
}
</script>
