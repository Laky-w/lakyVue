<template>
  <el-dialog :title="title" v-loading="loading" :visible.sync="visible" :close-on-click-modal="false">
    <div class="course-active">
      <el-steps :active="formActive" :simple="true" finish-status="success">
        <el-step title="课程基本信息"></el-step>
        <el-step title="收费标准"></el-step>
        <el-step title="授权校区"></el-step>
      </el-steps>
    </div>
    <el-form :model="form" ref="ruleForm1" :style="formActive!=1?'display:none':''">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="course.name" :rules="[{ required: true, message: '名称必填'},{ validator:validateCourseName, trigger: 'blur'}]">
        <el-input v-model="form.course.name" autofocus placeholder="课程名称" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="课程类型" :label-width="formLabelWidth" prop="course.theType" :rules="[{ required: true, message: '类型必填'}]">
        <el-select v-model="form.course.theType" style="width:100%" placeholder="课程类型">
          <el-option label="一对一" value="1"></el-option>
          <el-option label="一对多" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别" :label-width="formLabelWidth" prop="course.clazzId" :rules="[{ required: true, message: '类别必填'}]">
        <el-select v-model="form.course.clazzId" style="width:100%" placeholder="类别">
          <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="course.remarks">
        <el-input v-model="form.course.remarks" :rows=5 type="textarea" placeholder="请输入描述信息"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form" ref="ruleForm2" :style="formActive!=2?'display:none':''">
      <!-- <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="课程名称"  auto-complete="off"></el-input>
              </el-form-item> -->
      <el-form-item label="收费类型" :label-width="formLabelWidth" prop="course.standardType" :rules="[{ required: true, message: '类型必填'}]">
        <el-radio-group v-model="form.course.standardType">
          <el-radio :label="1">标准收费</el-radio>
          <el-radio :label="2">区间收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收费信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
        <el-form-item class="freeTitle" size="mini">
          课时
        </el-form-item>
        <el-form-item class="freeTitle" size="mini">
          费用
        </el-form-item>
        <el-form-item size="mini" style="text-align:left;display: inline-block;margin-bottom:5px;">
          <el-button size="mini" @click="addChargeStandard">添加</el-button>
        </el-form-item>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" v-for="(chargeStandard, index) in form.chargeStandard" :key="index" style="margin-bottom:0px;">
        <el-form-item v-if="form.course.standardType==2" style="display:inline-block;width:100px;margin-bottom:5px;" :prop="'chargeStandard.' + index + '.minHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini">
          <el-input v-model.number="chargeStandard.minHourse" placeholder="最小课时"></el-input>
        </el-form-item>
        <span v-if="form.standardType==2">--</span>
        <el-form-item v-if="form.course.standardType==2" style="display:inline-block;width:100px;margin-bottom:5px;" :prop="'chargeStandard.' + index + '.maxHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini">
          <el-input v-model.number="chargeStandard.maxHourse" placeholder="最大课时"></el-input>
        </el-form-item>

        <el-form-item v-if="form.course.standardType==1" style="display:inline-block;width:220px;margin-bottom:5px;" :prop="'chargeStandard.' + index + '.minHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini">
          <el-input v-model.number="chargeStandard.minHourse" placeholder="课时"></el-input>
        </el-form-item>
        <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;" :prop="'chargeStandard.' + index + '.price'" :rules="[
                        { required: true, message: '必填项'},
                        { validator:$validate.validateMoney, trigger: 'blur'}]" size="mini">
          <el-input v-model.number="chargeStandard.price" placeholder="费用"></el-input>
        </el-form-item>
        <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;">
          <el-button size="mini" v-if="index!=0" @click="removeChargeStandard(chargeStandard)">删除</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-form :model="form" ref="ruleForm3" :style="formActive!=3?'display:none':''">
      <el-transfer style="padding-left: 180px;" v-model="form.schoolIds" filterable :titles="['全部校区', '授权校区']" :button-texts="['取消', '授权']" :props="{key: 'id',label: 'name'}" :data="schoolData">
        <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                    <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" v-if="formActive!=1" @click="formActive--">上一步</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">{{formActive!=3?'下一步':'保存'}}</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
.course-active .el-steps--simple {
  padding: 8px 8%;
  border-radius: 4px;
  background: #f5f7fa;
  line-height: 6px;
  margin-bottom: 15px;
}
.freeTitle {
  display: inline-block;
  background-color: #faebd7;
  width: 220px;
  text-align: center;
  margin-bottom: 5px;
}
</style>
<script>
import { createCourse, findChildSchoolZoneAll, getBranchCourseList, findBranchParameterValueAll, getCourseView } from "../../api/api";
export default {
  data() {
    return {
      // dialogViewVisible: false,
      visible: false,
      loading: false,
      parameterValue: [],
      title: "新增课程",
      formActive: 1,
      schoolData: [], //全部授权校区
      oldForm: {
        course: {
          name: "",  //表单 v-modle绑定的值
          theType: "2",
          clazzId: "",
          remarks: "",
          standardType: 1,
        },
        schoolIds: [],
        chargeStandard: [
          {
            minHourse: "",
            maxHourse: "",
            price: ""
          }
        ]
      },
      form: {
        course: {}
      },
      loadingForm: false,
      formLabelWidth: "120px"
    }
  },
  created() {
    this.getSchool();
    this.getParameterValue(7);
  },
  methods: {
    getSchool() { //获取下级所有校区
      let self = this;
      findChildSchoolZoneAll(2, self.$schoolZone().id).then(data => {
        if (data.code == 200) {
          let parent = data.data;
          self.oldForm.schoolIds.push(parent.id);
          let dataArray = [];
          parent["disabled"] = true;
          dataArray.push(parent);
          if (parent.childrenList) {
            dataArray = dataArray.concat(
              self.parseSchoolArray(parent.childrenList)
            );
          }
          self.schoolData = dataArray;
        } else {
          self.$message.error(data.data);
        }
      })
    },
    parseSchoolArray(data) { //递归处理校区
      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        dataArray.push(data[i]);
        if (data[i].childrenList) {
          dataArray = dataArray.concat(
            this.parseSchoolArray(data[i].childrenList)
          );
        }
      }
      return dataArray;
    },
    getParameterValue(id) {//课程类别
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
        }
      });
    },
    validateCourseName(rule, value, callback) {//验证名称
      getBranchCourseList(1, 20, { "name2": value }).then(data => {
        if (data.code == 200) {
          if (data.data.total > 0) {
            let count = 0;
            data.data.list.forEach(item => {
              if (item.id != this.form.course.id) {
                count++;
              }
            })
            if (count > 0) {
              callback(new Error("该课程名称已存在！"));
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
    },
    handleAddCourse() {//点击添加课程
      let self = this;
      self.form = self.oldForm;
      self.title = "新增课程";
      self.formActive = 1;
      self.visible = true;
    },
    handleUpdateCourse(courseId) { //修改课程
      let self = this;
      getCourseView(courseId).then(data => {
        if (data.code == 200) {
          let course = data.data;
          course.chargeStandard = course.chargeStandards;
          course.schoolIds = [];
          self.title = "修改-" + course.course.name;
          course.courseSchool.forEach(item => {
            course.schoolIds.push(item.schoolZoneId);
          })
          course.course.theType = course.course.theType + "";
          self.formActive = 1;
          self.form = { "chargeStandard": course.chargeStandard, "schoolIds": course.schoolIds, "course": course.course };
          self.visible = true;
        } else {
          self.$message.error(data.message);
        }
      })

    },
    //保存课程
    submitForm(formName) {
      let self = this;
      self.$refs[formName + self.formActive].validate(valid => {
        if (valid) {
          if (self.formActive == 3) {
            self.loadingForm = true;
            let formJson = JSON.stringify(self.form);
            console.log(JSON.stringify(formJson));
            createCourse({ "courseJson": formJson }).then(data => {
              self.loadingForm = false;
              if (data.code == 200) {
                self.$message.success(data.message);
                self.visible = false;
                self.$emit("saveSuccess", data.data);
              } else {
                self.$message.error(data.data);
              }
            });
          } else {
            self.formActive++;
          }
        } else {
          return false;
        }
      });
    },
    removeChargeStandard(item) {
      if (this.form.chargeStandard.length == 1) return;
      var index = this.form.chargeStandard.indexOf(item);
      if (index !== -1) {
        this.form.chargeStandard.splice(index, 1);
      }
    },
    addChargeStandard() {
      this.form.chargeStandard.push({
        minHourse: "",
        maxHourse: "",
        price: ""
      });
    },
  }

}
</script>
