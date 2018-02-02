<template>
  <el-dialog :title="titleDialog" :visible.sync="visible" width="450px" :close-on-click-modal=false custom-class="dialog-form">
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item label="总额" :label-width="formLabelWidth" prop="total">
        <el-tag type="info" style="width:100%">{{form.total}}</el-tag>
      </el-form-item>
      <el-form-item label="已交" :label-width="formLabelWidth">
        <el-tag type="info" style="width:100%">{{form.oldReceivable}}</el-tag>
      </el-form-item>
      <el-form-item label="欠费" :label-width="formLabelWidth">
        <el-tag type="info" style="width:100%">{{form.total-form.oldReceivable-form.oldSubtractMoney}}</el-tag>
      </el-form-item>
      <el-form-item label="实收" :label-width="formLabelWidth" prop="money" :rules="[{  required: true, message: '该项必填'}]">
        <el-input-number style="width:100%" v-model="form.money" :min="0" :max="form.maxReceivable"></el-input-number>
      </el-form-item>
      <el-form-item label="收款账户" :label-width="formLabelWidth" prop="accountId" :rules="[{  required: true, message: '该项必填'}]">
        <el-select v-model="form.accountId" style="width:100%" placeholder="收款账户">
          <el-option v-for="(item,index) in financeAccount" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抹零" :label-width="formLabelWidth" prop="subtractMoney">
        <el-input-number style="width:100%" v-model="form.subtractMoney" :min="0" :max="form.maxSubtractMoney"></el-input-number>
      </el-form-item>
      <el-form-item label="剩余" :label-width="formLabelWidth">
        <el-tag type="info" style="width:100%">{{bill.arrears}}</el-tag>
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
import { getOrderDetail, getFinanceAccountList, createOrderMoneyRecord } from "../../api/api"
export default {
  data() {
    return {
      visible: false,
      financeAccount: [],
      oldForm: {
        name: "",
        sex: 1,
        contactId: "",
        sourceId: "",
        ownerId: "",
        phone: "",
        remarks: "",
        schoolZoneId: "",
        schoolZoneName: "",
        intentionId: []
      },
      form: {
        total: 2,
        oldReceivable: 0,
        money: 0,
        subtractMoney: 0,
        accountId: ""
      },//
      titleDialog: "收费",
      formLabelWidth: "120px",
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  computed: {
    bill() {
      this.form.arrears = this.form.total - this.form.oldReceivable - this.form.money - this.form.subtractMoney - this.form.oldSubtractMoney;
      this.form.maxSubtractMoney = this.form.total - this.form.oldReceivable - this.form.oldSubtractMoney - this.form.money;
      this.form.maxReceivable = this.form.total - this.form.oldReceivable - this.form.subtractMoney - this.form.oldSubtractMoney;
      console.log(this.form);
      return this.form;
    }
  },
  methods: {
    openDialog(id) {
      getOrderDetail(id).then(data => {
        if (data.code == 200) {
          this.visible = true;
          let obj = data.data;
          if (this.financeAccount.length == 0) {
            this.loadFinanceAccouont();
          }
          obj.oldReceivable = obj.receivable;
          obj.money = 0;
          obj.oldSubtractMoney = obj.subtractMoney;
          obj.subtractMoney = 0;
          if (this.financeAccount.length > 0) {
            obj.accountId = this.financeAccount[0].id;
          } else {
            obj.accountId = "";
          }
          this.form = obj;
          console.log(this.form);
        }
      })
      console.log(id);
    },
    loadFinanceAccouont() {
      let self = this;
      getFinanceAccountList(1, 20, { schoolZoneId2: this.$schoolZone().id, theOpen: 1 }).then(data => {
        if (data.data) {
          self.financeAccount = data.data.list;
          if (self.financeAccount.length > 0) {
            this.form.accountId = self.financeAccount[0].id;
          }
        }
      });
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createOrderMoneyRecord(self.form).then(data => {
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
  }
}
</script>

