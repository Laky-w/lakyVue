<template>
  <el-dialog :title="titleDialog" :visible.sync="visible" width="750px" :close-on-click-modal=false @close="$emit('update:dialogFormVisible', false)" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm" inline size="small">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '名称必填'},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]">
        <el-input v-model="form.name" placeholder="学员名称"></el-input>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机" :label-width="formLabelWidth" prop="phone" :rules="[{ required: true, message: '该项必填'}]">
        <el-input v-model="form.phone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactId" :rules="[{ required: true, message: '该项必填'}]">
        <el-select v-model="form.contactId" style="width:100%" placeholder="联系人">
          <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '部门必填'}]">
        <school-tree @nodeClick="handleSchool" the-type="2" :name="form.schoolZoneName" :default-value="form.schoolZoneId"></school-tree>
      </el-form-item>
      <el-form-item label="学管师" :label-width="formLabelWidth" prop="ownerId">
        <user-dialog v-model="form.ownerId" title="学管师" :the-type="3" :parent-school-id="form.schoolZoneId" :default-text="form.ownerName" placeholder-text="学管师"></user-dialog>
      </el-form-item>
      <el-form-item label="来源活动" :label-width="formLabelWidth" prop="sourceId">
        <market-activity-dialog v-model="form.sourceId"></market-activity-dialog>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
        <el-input v-model="form.remarks" style="width:535px" :rows=3 type="textarea" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  findBranchParameterValueAll,
  createStudent,
  getStudentView,
  getStudentList
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      parameterValue: [],
      oldForm: {
        name: "",
        sex: 1,
        contactId: "",
        sourceId: "",
        ownerName: "",
        ownerId: "",
        phone: "",
        remarks: "",
        schoolZoneId: "",
        schoolZoneName: "",
      },
      form: {},//
      titleDialog: "添加正式学员",
      formLabelWidth: "120px",
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  watch: {
    dialogFormVisible(val) {
      this.visible = val;
    }
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.oldForm.schoolZoneId = user.schoolZoneId;
      self.oldForm.schoolZoneName = user.schoolZone.name;
      self.schoolId = user.schoolZoneId;
    },
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.contactId = self.parameterValue[0].id;
        }
      });
    },
    validateStudent(rule, value, callback) {//手机验证
      if (value.length != 11) {
        callback(new Error("请输入正确的手机号"));
      } else {
        getStudentList(1, 20, { "phone": value }).then(data => {
          if (data.code == 200) {
            if (data.data.total > 0) {
              let message = "";
              data.data.list.forEach(item => {
                if (item.id != this.form.id) {
                  message += item.name + "，所属校区:" + item.schoolZoneName + ";"
                }
              })
              if (message) {
                this.$message.warning(message);
                callback(new Error("该电话信息已存在！"));
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
      }
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createStudent(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.visible = false;
              this.$emit("saveSuccess", data.data);
            } else {
              self.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleEditOpenDialog(id) {
      getStudentView(id).then(data => {
        this.visible = true;
        if (data.code == 200) {
          let obj = data.data;
          this.titleDialog = "修改-" + obj.name;
          this.form = obj;
          console.log(this.form);
          this.dialogFormVisible = true;
        }
        if (this.parameterValue.length == 0) {
          this.getParameterValue(3);
        }

      })
    },
    handleOpenDialog() {
      this.visible = true;
      this.form = this.oldForm;
      this.titleDialog = "添加正式学员";
      if (this.parameterValue.length == 0) {
        this.getSchoolId();
        this.getParameterValue(3);
      }
    },
    handleSchool(data) {
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
      this.form.roles = [];
    },
  },
  props: {
    text: {
      default: "添加正式学员"
    },
  },
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog } //注入组件
}
</script>