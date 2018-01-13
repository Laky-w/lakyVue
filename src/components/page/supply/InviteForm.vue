<template>
  <el-dialog title="添加邀约记录" :visible.sync="visible" width="750px" :close-on-click-modal=false @close="$emit('update:dialogFormVisible', false)" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item v-if="theType==1" label="邀约人" :label-width="formLabelWidth" prop="studentId" :rules="[{ required: true, message: '名称必填'}]">
        <customer-dialog v-model="form.studentId" title="邀约人" placeholder-text="邀约人">
        </customer-dialog>
      </el-form-item>
      <el-form-item v-if="theType==2" label="邀约人" :label-width="formLabelWidth">
        {{studnetName}}
      </el-form-item>
      <el-form-item label="到访时间" :label-width="formLabelWidth" prop="inviteTime" :rules="[{ required: true, message: '必选项'}]">
        <el-date-picker v-model="form.inviteTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="到访时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
        <el-input v-model="form.remarks" :rows=3 type="textarea" placeholder="备注"></el-input>
      </el-form-item>
      <!-- <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName" :rules="[{ required: true, message: '参观校区必填'}]">
        <school-tree @nodeClick="handleSchool" :name="form.schoolName" :the-type="2" place-text="参观校区" :default-value="schoolId"></school-tree>
      </el-form-item>
      <el-form-item label="到访状态" :label-width="formLabelWidth" prop="inviteStatus" :rules="[{ required: true, message: '必选项'}]">
        <el-radio-group v-model="form.inviteStatus">
          <el-radio :label="1">未到</el-radio>
          <el-radio :label="2">到达</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="记录人" :label-width="formLabelWidth" prop="userId">
        <user-dialog v-model="form.userId" title="选择记录人" placeholder-text="记录人"></user-dialog>
      </el-form-item> -->
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
  createInvite
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      parameterValue: [],
      form: {
        remarks: "",
        inviteTime: "",
        studentId: self.studentAddId,
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
  },
  methods: {
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createInvite(self.form).then(data => {
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

