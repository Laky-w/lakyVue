<template>
  <el-dialog title="添加沟通记录" :visible.sync="visible" width="750px" :close-on-click-modal=false @close="$emit('update:dialogFormVisible', false)" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item v-if="theType==1" label="联系人" :label-width="formLabelWidth" prop="studentId" :rules="[{ required: true, message: '名称必填'}]">
        <customer-dialog v-model="form.studentId" title="联系人" placeholder-text="联系人名称">
        </customer-dialog>
      </el-form-item>
      <el-form-item v-if="theType==2" label="联系人" :label-width="formLabelWidth">
        {{studnetName}}
      </el-form-item>
      <el-form-item label="意向级别" prop="intentionLevel" :label-width="formLabelWidth" :rules="[{ required: true, message: '该项必填'}]">
        <el-rate v-model="form.intentionLevel" :texts="['没意向', '观望', '一般', '考虑', '极高']" show-text :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </el-rate>
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
import CustomerDialog from "../../common/supply/CustomerDialog";
import {
  findBranchParameterValueAll,
  createContact
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        userId: "",
        contactTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
        lastContactTime: "",
        intentionLevel: 3,
        content: "",
        studentId: self.studentAddId,
        contactStyleId: ""
      },
      formLabelWidth: "120px",
      loadingForm: false
    };
  },
  watch: {
    dialogFormVisible(val) {
      this.visible = val;
    },
    studentAddId(val) {
      this.form.studentId = val;
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

