<template>
  <el-dialog title="分配生源" :visible.sync="visible" width="300px" :close-on-click-modal="false" custom-class="dialog-form" @close="$emit('update:dialogFormVisible', false)">
    <!-- <el-dialog title="分配生源" :visible.sync="visible"> -->
    <div slot="footer" class="dialog-footer">
      <el-form :model="form" ref="ruleForm" size="small">
        <el-form-item prop="ownerId" :rules="[{ required: true, message: '该项必填'}]">
          <user-dialog v-model="form.ownerId" :default-text="form.ownerName" title="选择负责人" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="负责人"></user-dialog>
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
  updateUserOwner
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      loadingForm: false,
      form: {
        ownerId: "",
        students: []
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      this.visible = val;
    }
  },
  methods: {
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.students.forEach(item => {
            self.form.students.push(item.id);
          })
          self.loadingForm = true;
          updateUserOwner(self.form.ownerId, { students: self.form.students }).then(data => {
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
    dialogFormVisible: {
      default: false
    },
    students: {
      default: []
    }
  },
  components: { UserDialog } //注入组件
}
</script>

