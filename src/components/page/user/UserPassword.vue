<template>
  <el-dialog :title="titleDialog" :visible.sync="visible" width="750px" :close-on-click-modal=false custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldpwd" :rules="[{ required: true, message: '该项必填'},
        { validator:validatePassword, trigger: 'blur'},{ min:6, max: 11, message: '请输入旧密码', trigger: 'change' }]">
        <el-input v-model="form.oldpwd" type="password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="newpwd" :rules="[{ required: true, message: '该项必填'},
        { validator:validateNewpwd, trigger: 'blur'},{ min:6, max: 11, message: '请输入新密码', trigger: 'change' }]">
        <el-input v-model="form.newpwd" type="password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirm" :rules="[{ required: true, message: '该项必填'},
        { validator:validateConfirm, trigger: 'blur'},{ min:6, max: 11, message: '请输入再次输入新密码', trigger: 'change' }]">
        <el-input v-model="form.confirm" type="password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
  </el-dialog>
</template>

<script>
import { validateUserPassword, updateUserPassword } from "../../api/api";
export default {
  data() {
    return {
      titleDialog: "修改用户密码",
      form: {
        oldpwd: "",
        newpwd: "",
        confirm: ""
      },
      loadingForm: false,
      visible: false,
      formLabelWidth: "120px"
    };

  },
  methods: {
    handleOpen() {
      this.visible = true;
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields();
      }
    },
    validatePassword(rule, value, callback) {
      if (value) {
        validateUserPassword({ "password": value }).then(data => {
          if (data.code == 200) {
            callback();
          } else {
            callback(new Error("密码错误,请输入正确的旧密码!"));
          }
        })
      }
    },
    validateNewpwd(rule, value, callback) {
      if (value == this.form.oldpwd) {
        callback(new Error('请输入新的密码!'));
      } else {
        callback();
      }
    },
    validateConfirm(rule, value, callback) {
      if (value !== this.form.newpwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          updateUserPassword(self.form).then(data => {
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
  },
  props: {

  }
}
</script>