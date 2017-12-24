<template>
  <div style="display: inline-block;">
    <el-button :type="type" :icon="icon" :size="size"  @click="handleOpenDialog">{{text}}</el-button>
    <el-dialog title="添加生源" :visible.sync="dialogFormVisible" width="750px" custom-class="dialog-form"
                    :close-on-click-modal=false>
        <el-form :model="form" ref="ruleForm" inline size="small">
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="name"
                          :rules="[{ required: true, message: '名称必填'},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]">
                <el-input v-model="form.name" placeholder="学员名称"></el-input>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone"
                          :rules="[{ required: true, message: '该项必填'}]">
                <el-input v-model="form.phone" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactId"
                          :rules="[{ required: true, message: '该项必填'}]">
                <el-select v-model="form.contactId" style="width:100%" placeholder="科目">
                    <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName"
                          :rules="[{ required: true, message: '部门必填'}]">
                <school-tree @nodeClick="handleSchool" the-type="2" :name="form.schoolName"
                              :default-value="schoolId"></school-tree>
            </el-form-item>
            <el-form-item label="负责人" :label-width="formLabelWidth" prop="ownerId">
                <user-dialog v-model="form.ownerId" title="选择负责人"
                              :the-type="3" :parent-school-id="form.schoolZoneId"
                              placeholder-text="负责人"></user-dialog>
            </el-form-item>
            <el-form-item label="来源活动" :label-width="formLabelWidth" prop="sourceId">
                <market-activity-dialog v-model="form.sourceId"></market-activity-dialog>
            </el-form-item>
            <el-form-item label="意向课程" :label-width="formLabelWidth" prop="intentionId">
                <course-dialog v-model="form.intentionId" title="意向课程" selected-type="2"
                                placeholder-text="意向课程"></course-dialog>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                <el-input v-model="form.remarks" style="width:535px" :rows=3 type="textarea"
                          placeholder="备注"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  getCustomerList,
  findBranchParameterValueAll,
  createCustomer
} from "../../api/api";

export default {
  data() {
    return {
      dialogFormVisible: false,
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        name: "",
        sex: 1,
        contactId: "",
        sourceId: "",
        ownerId: "",
        phone: "",
        remarks: "",
        schoolZoneId: "",
        schoolName: "",
        intentionId: []
      },
      formLabelWidth: "120px",
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {

  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
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
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createCustomer(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.dialogFormVisible = false;
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
    handleOpenDialog() {
      this.dialogFormVisible = true;
      if (this.parameterValue.length == 0) {
        this.getSchoolId();
        this.getParameterValue(3);
      }
    },
    handleSchool(data) {
      this.form.schoolName = data.name;
      this.form.schoolZoneId = data.id;
      this.form.roles = [];
    },
  },
  props: {
    type: {
      default: "primary"
    },
    icon: {
      default: "el-icon-edit"
    },
    size: {
      default: "mini"
    },
    text: {
      default: "添加生源"
    }
  },
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog } //注入组件
};
</script>


