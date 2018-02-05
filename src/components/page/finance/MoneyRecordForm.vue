<template>
  <el-dialog :title="titleDialog" :visible.sync="visible" :close-on-click-modal="false" width="750px" custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="金额" :label-width="formLableWidth" prop="money" :rules="[{required:true,message:'必填项'},{validator:$validate.validateMoney,trigger:'blur',}]">
        <el-input v-model="form.money" placeholder="金额">
          <template slot="append">元(￥)</template>
        </el-input>
      </el-form-item>
      <el-form-item label="类型" :label-width="formLableWidth" prop="theType" :rules="[{required:true,message:'必填项'}]">
        <el-radio-group v-model="form.theType">
          <el-radio :label="1">缴费</el-radio>
          <el-radio :label="2">退费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账户" :label-width="formLableWidth" prop="accountId" :rules="[{ required: true, message: '该项必填'}]">
        <el-select v-model="form.accountId" style="width:100%" placeholder="账户">
          <el-option v-for="(item,index) in financeAccount" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别" :label-width="formLableWidth" prop="clazzId" :rules="[{required:true,message:'必填项'}]">
        <el-select v-model="form.clazzId" style="width:100%" placeholder="类别">
          <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLableWidth" prop="remarks">
        <el-input type="textarea" :rows="3" v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script scoped>
import { findBranchParameterValueAll, createMoneyRecord, getFinanceAccountList, getMoneyRecordView } from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      financeAccount: [],
      parameterValue: [],
      dialogFormVisible: false,
      oldForm: {
        money: "",
        remarks: "",
        clazzId: "",
        theType: 1,
        accountId: "",
      },
      form: {},
      titleDialog: "添加收支流水",
      formLableWidth: "120px",
      loadingForm: false,
      schoolId: ""
    };
  },
  watch: {
    dialogFormVisible(val) {
      this.visible = val;
    }
  },
  methods: {
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.clazzId = self.parameterValue[0].id;
        }
      })
    },
    handleOpenDialog() {
      let self = this;
      self.visible = true;
      self.form = self.oldForm;
      self.titleDialog = "添加收支流水";

      if (self.parameterValue.length == 0) {
        self.getParameterValue(11);
      }
      if (self.financeAccount.length == 0) {
        self.loadFinanceAccount();
      }
      if (self.financeAccount.length > 0) {
        self.form.accountId = self.financeAccount[0].id;
      }
    },
    OpenEditDialog(id) {
      let self = this;
      getMoneyRecordView(id).then(data => {
        if (data.code == 200) {
          self.visible = true;
          let obj = data.data;
          self.titleDialog = "修改收支流水";
          if (self.parameterValue.length == 0) {
            self.getParameterValue(11);
          }
          if (self.financeAccount.length > 0) {
            obj.accountId = self.financeAccount[0].id;
          } else {
            obj.accountId = "";
          }
          self.form = obj;
          if (self.financeAccount
            .length == 0) {
            self.loadFinanceAccount();
          }
        }
      })
    },
    loadFinanceAccount() {
      let self = this;
      getFinanceAccountList(1, 20, { schoolZoneId2: this.$schoolZone().id, theOpen: 1 }).then(data => {
        if (data.data) {
          self.financeAccount = data.data.list;
          if (self.financeAccount.length > 0) {
            this.form.accountId = self.financeAccount[0].id;
          }
        }
      })
    },
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createMoneyRecord(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.visible = false;
              self.$refs[formName].resetFields();
              this.$emit("saveSuccess", data.data);
            } else {
              this.$message.error(data.data);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
}
</script>

