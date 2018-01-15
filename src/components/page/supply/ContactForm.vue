<template>
  <el-dialog title="添加沟通记录" :visible.sync="visible" width="750px" :close-on-click-modal=false @close="$emit('update:dialogFormVisible', false)" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item v-if="theType==1 && !form.id" label="联系人" style="width:100%" :label-width="formLabelWidth" prop="studentId" :rules="[{ required: true, message: '名称必填'}]">
        <customer-dialog v-model="form.studentId" title="联系人" placeholder-text="联系人名称">
        </customer-dialog>
      </el-form-item>
      <el-form-item v-if="theType==2 || form.id" label="联系人" :label-width="formLabelWidth">
        {{studnetName}}{{form.studentName}}
      </el-form-item>
      <el-form-item style="display:inline-block" label="意向级别" prop="intentionLevel" :label-width="formLabelWidth" :rules="[{ required: true, message: '该项必填'}]">
        <el-rate v-model="form.intentionLevel" :texts="['没意向', '观望', '一般', '考虑', '极高']" show-text :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </el-rate>
      </el-form-item>
      <el-form-item style="display:inline-block" label="生源状态" prop="theStatus" :label-width="formLabelWidth" :rules="[{ required: true, message: '该项必填'}]">
        <el-tooltip :content="'标记为 ' + theStatus" placement="top">
          <el-switch v-model="form.theStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="2" inactive-value="3">
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <!-- <el-form-item label="记录人" :label-width="formLabelWidth" prop="userId">
        <user-dialog v-model="form.userId" title="选择记录人" :rules="[{ required: true, message: '该项必填'}]" placeholder-text="记录人"></user-dialog>
      </el-form-item> -->
      <el-form-item label="联系时间" :label-width="formLabelWidth" prop="contactTime" :rules="[{ required: true, message: '该项必填'}]">
        <el-date-picker v-model="form.contactTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="联系时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下次联系时间" :label-width="formLabelWidth" prop="lastContactTime">
        <el-date-picker v-model="form.lastContactTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="联系时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="联系方式" :label-width="formLabelWidth" prop="contactStyleId" :rules="[{ required: true, message: '该项必填'}]">
        <el-select v-model="form.contactStyleId" clearable placeholder="联系方式" style="width: 100%" class="handle-select mr10">
          <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系内容" :label-width="formLabelWidth" prop="content" :rules="[{ required: true, message: '该项必填'}]">
        <el-input v-model="form.content" style="height:100px" :rows=3 type="textarea" placeholder="联系内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserDialog from "../../common/system/UserDialog.vue";
import CustomerDialog from "../../common/supply/CustomerDialog.vue";
import {
  findBranchParameterValueAll,
  getContactView,
  createContact
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      parameterValue: [],
      oldForm: {
        //表单 v-modle绑定的值
        userId: "",
        contactTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
        lastContactTime: "",
        intentionLevel: 3,
        theStatus: "2",
        content: "",
        studentId: self.studentAddId,
        contactStyleId: ""
      },
      form: {

      },
      formLabelWidth: "120px",
      loadingForm: false
    };
  },
  computed: {
    theStatus() {
      if (this.form.theStatus == 3) return "已跟进";
      return "已放弃";
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) { this.form = this.oldForm };
      this.visible = val;
    },
    studentAddId(val) {
      this.oldForm.studentId = val;
    }
  },
  created() {
    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"));
    this.getParameterValue(8);
  },
  methods: {
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.categoryId = self.parameterValue[0].id;
        }
      });
    },
    editForm(id) {
      let self = this;
      getContactView(id).then(data => {
        if (data.code == 200) {
          self.visible = true;
          let obj = data.data;
          obj.intentionLevel = Number(obj.intentionLevel);
          obj.theStatus = obj.contactStatus + "";
          self.form = data.data;
        }
      })
    },
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createContact(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.visible = false;
              self.$emit("saveSuccess");
            } else {
              self.$message.error(data.data);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  components: {
    UserDialog,
    CustomerDialog
  }, //注入组件
  props: {
    studentAddId: "",
    theType: { //1全部，2单个
      default: 1
    },
    studnetName: "",
    dialogFormVisible: {
      default: false
    }
  }
}
</script>

