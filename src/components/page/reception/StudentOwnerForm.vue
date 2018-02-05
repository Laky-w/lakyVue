<template>
  <el-dialog title="分配学管师" :visible.sync="visible" width="300px" :close-on-click-modal="false" custom-class="dialog-form">
    <!-- <el-dialog title="分配生源" :visible.sync="visible"> -->
    <div slot="footer" class="dialog-footer">
      <el-form :model="form" ref="ruleForm" size="small">
        <el-form-item prop="ownerId" :rules="[{ required: true, message: '该项必填'}]">
          <user-dialog v-model="form.ownerId" :default-text="form.ownerName" title="选择学管师" :the-type="3" placeholder-text="学管师"></user-dialog>
        </el-form-item>
      </el-form>
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserDialog from "../../common/system/UserDialog.vue";
import {
  updateStudentOwner
} from "../../api/api";
export default {
  data() {
    return {
      visible: false,
      loadingForm: false,
      form: {
        ownerId: "",
        students: []
      }
    }
  },
  methods: {
    openDialog() {
      this.visible = true;
    },
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.students.forEach(item => {
            self.form.students.push(item.id);
          })
          self.loadingForm = true;
          updateStudentOwner(self.form.ownerId, { students: self.form.students }).then(data => {
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
  props: {
    students: {
      default: []
    }
  },
  components: { UserDialog } //注入组件
}
</script>

