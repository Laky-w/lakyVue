<template>
  <el-dialog title="授权校区" :visible.sync="visible" width="750px" :close-on-click-modal=false @close="$emit('update:dialogFormVisible', false)" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm">
      <el-transfer style="padding-left: 80px;" v-model="form.schoolIds" filterable :titles="['全部校区', '授权校区']" :button-texts="['取消', '授权']" :props="{key: 'id',label: 'name'}" :data="schoolData">
        <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                    <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { findChildSchoolZoneAll, getCourseSchool, updateCourseSchool } from "../../api/api";
export default {
  data() {
    return {
      visible: false,
      schoolData: [], //全部授权校区
      form: {
        schoolIds: []
      },
      loadingForm: false,
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {
        this.getSchool();
      }
      this.visible = val;
    }
  },
  created() {
    // this.getSchool();
  },
  methods: {
    getSchool() {
      let self = this;
      self.form.schoolIds = [];
      findChildSchoolZoneAll(2, self.$schoolZone().id).then(data => {
        if (data.code == 200) {
          // console.log(self.couserId);
          getCourseSchool(self.couserId).then(schoolIdData => {
            if (schoolIdData.code == 200) {
              schoolIdData.data.forEach(item => {
                self.form.schoolIds.push(item.schoolZoneId);
              })
            }
          })
          let parent = data.data;
          // self.form.schoolIds.push(parent.id);
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
      });
    },
    parseSchoolArray(data) {
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
    submitForm(formName) {
      let self = this;
      // self.form.id = self.couserId;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          updateCourseSchool(self.couserId, self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.visible = false;
              self.$emit("saveSuccess", data.data);
            } else {
              self.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  props: {
    couserId: "",//课程id
    dialogFormVisible: {
      default: false
    }
  }
}
</script>

