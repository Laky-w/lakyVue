<template>
  <el-dialog :title="titleText" :visible.sync="visible" :close-on-click-modal="false" custom-class="dialog-form">
    <el-form :model="form" ref="classForm">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '班级名称必填'}, { validator:validateClassName, trigger: 'blur'}]">
        <el-input v-model="form.name" placeholder="班级名称"></el-input>
      </el-form-item>
      <el-form-item label="课程" :label-width="formLabelWidth" prop="courseId" :rules="[{ required: true, message: '课程必填'}]">
        <course v-model="form.courseId" :default-value="form.courseInfo"></course>
      </el-form-item>
      <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '校区必填'}]">
        <school-tree @nodeClick="handleSchool" :name="form.schoolZoneName" the-type="2" place-text="校区" :default-value="form.schoolZoneId"></school-tree>
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
      <el-form-item label="预招人数" :label-width="formLabelWidth" prop="studentNumber">
        <el-input-number v-model="form.studentNumber" :min="0" style="width:100%"></el-input-number>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible=false;">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('classForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import Course from "../../common/teach/Course.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
import { createSchoolClass, getSchoolClassView, getSchoolClassList } from "../../api/api";
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
      visible: false,
      titleText: "开班",
      oldForm: {
        //表单 v-modle绑定的值
        name: "",
        courseId: "",
        courseInfo: [],
        mainTeacherId: "",
        mainTeacherName: "",
        teacherId: "",
        teacherName: "",
        startDate: "",
        roomId: "",
        roomName: "",
        endDate: "",
        schoolZoneId: "",
        schoolZoneName: "",
        studentNumber: 1,
      },
      form: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loadingForm: false,
    };
  },
  created() {
    this.getSchoolId();
  },
  computed: {
    //实时计算
    startDate() {
      return this.form.startDate;
    }
  },
  watch: {
    startDate(val) {
      if (new Date(this.form.endDate).getTime() < new Date(this.form.startDate).getTime()) {
        this.form.endDate = "";
      }
      console.log(new Date(this.form.endDate));
      // this.form.endDate = "";
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
    validateClassName(rule, value, callback) {//名字重复验证
      if (value) {
        getSchoolClassList(1, 20, { "name2": value }).then(data => {
          if (data.code == 200) {
            if (data.data.total > 0) {
              let count = 0;
              data.data.list.forEach(item => {
                if (item.id != this.form.id) {
                  count++;
                }
              })
              if (count > 0) {
                callback(new Error("该班级名称已存在，请重新填写！"));
              } else {
                callback();
              }
            } else {
              callback();
            }
          } else {
            callback(new Error("网络错误，请尝试刷新操作！"));
          }
        })
      } else {
        callback(new Error("请输入班级名称！"));
      }
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createSchoolClass(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.visible = false;
              this.$emit("saveSuccess", data.data);
            } else {
              this.$message.error(data.data);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleOpenDialog() {
      this.visible = true;
      this.form = this.oldForm;
      this.titleText = "开班";
      if (this.$refs['classForm']) {
        this.$refs['classForm'].resetFields();
      }
    },
    handleEditOpenDialog(id) {
      getSchoolClassView(id).then(data => {
        if (data.code == 200) {
          this.visible = true;
          let obj = data.data;
          obj.courseInfo = [obj.clazzId, obj.theType, obj.courseId];
          this.titleText = "修改-" + obj.name;
          this.form = obj;
        }
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
