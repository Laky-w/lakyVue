<template>
  <div class="table">
    <el-form :model="form" ref="ruleForm">
      <el-form-item label="选择学员" :label-width="formLabelWidth" prop="studentId" :rules="[{ required: true, message: '学员必填'}]">
        <customer-dialog :defaulUser="student" :student-type-no="9" style="width:80%" v-model="form.studentId" title="选择意向学员" placeholder-text="姓名/拼音/手机号"></customer-dialog>
        <div style="display:inline-block;">
          <customer-form size="medium" text="快速添加" @saveSuccess="handleSaveSuccess"></customer-form>
        </div>
      </el-form-item>
      <el-form-item label="选择课程" :label-width="formLabelWidth" prop="courseId">
        <course-dialog @selectData="handleCourse" style="width:80%" v-model="courseId" :selected-type="2"></course-dialog>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;">
        <p style="background-color: rgb(64, 158, 255);font-size: 18px;text-align: center;">课程信息</p>
      </el-form-item>
      <el-form-item>
        <el-table :data="chargeDetails" stripe border empty-text="请选择报名课程" style="width: 100%">
          <el-table-column label="课程名" prop="courseName" min-width="70px" />
          <el-table-column label="班级" min-width="80px">
            <template slot-scope="scope">
              <el-form-item size="mini" :prop="'chargeDetails.' + scope.$index + '.classId'" class="clean-bottom">
                <class-dialog v-model="scope.row.classId" :course-id="scope.row.courseId"></class-dialog>
              </el-form-item>
              <!-- <class-dialog  v-model="chargeDetail.classId" :course-id="chargeDetail.courseId"></class-dialog> -->
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <el-form-item size="mini" :prop="'chargeDetails.' + scope.$index + '.theType'" class="clean-bottom">
                <el-select v-model="scope.row.theType" placeholder="课程类型" class="handle-select">
                  <el-option key="1" label="新报" value="1"></el-option>
                  <el-option key="2" label="扩科" value="2"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="收费项目(费用类型)" min-width="130px">
            <template slot-scope="scope">
              {{scope.row.itemName}}({{scope.row.itemType == 1?"标准收费":"区间收费"}})
            </template>
          </el-table-column>
          <el-table-column label="收费标准" min-width="120px">
            <template slot-scope="scope">
              <el-form-item size="mini" class="clean-bottom">
                <el-select placeholder="收费标准" @change="changeChargeStandard(scope.row)" class="handle-select mr10" v-model.number="scope.row.chargeStandardId">
                  <el-option v-for="(item,index) in scope.row.chargeStandard" :label="item.label" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量(单位)" min-width="120px">
            <template slot-scope="scope">
              <el-form-item :prop="'chargeDetails.' + scope.$index + '.number'" size="mini" class="clean-bottom" :rules="[{ validator:$validate.validateMoney}]">
                <el-input-number style="width:80px" v-model="scope.row.number" :min="1">
                </el-input-number>({{scope.row.unit}})
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="原单价" prop="price" min-width="65px" />
          <el-table-column label="折扣(%)" prop="courseName" min-width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'chargeDetails.' + scope.$index + '.discount'" size="mini" class="clean-bottom" :rules="[{ validator:$validate.validateMoney}]">
                <el-input-number style="width:100px" v-model="scope.row.discount" :min="1" :max="100">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="折单价" prop="sellPrice" min-width="65px" />
          <el-table-column label="总额" min-width="55px">
            <template slot-scope="scope">
              <span style="color:red">{{scope.row.total}}</span>
            </template>
          </el-table-column>
          <el-table-column label="减免" min-width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'chargeDetails.' + scope.$index + '.subtractPrice'" size="mini" class="clean-bottom" :rules="[{ validator:$validate.validateMoney}]">
                <el-input-number style="width:100px" v-model="scope.row.subtractPrice" :min="1" :max="scope.row.total">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="removeChargeDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- <el-form-item label="收费信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
        <el-form-item :class="item.type ==1 ?'freeTitle':'freeTitle itemText'" :style="item.type ==3?'width:130px':''" v-for="(item,index) in titleLabel" size="mini" :key="index">
              {{item.label}}
        </el-form-item>
      </el-form-item> -->

      <!-- <el-form-item  :label-width="formLabelWidth"   v-for="(chargeDetail,index) in chargeDetails" style="margin-bottom:0px;" :key="index">
          <el-form-item  class="freeContent itemText" size="mini" >
              {{chargeDetail.courseName}}
          </el-form-item>
          <el-form-item  class="freeContent itemText" size="mini" :prop="'chargeDetails.' + index + '.classId'" >
              <class-dialog  v-model="chargeDetail.classId" :course-id="chargeDetail.courseId"></class-dialog>
          </el-form-item>
           <el-form-item  class="freeContent itemText" size="mini" :prop="'chargeDetails.' + index + '.theType'">
            <el-select v-model="chargeDetail.theType"   placeholder="课程类型" class="handle-select mr10" >
              <el-option key="1" label="新报" value="1"></el-option>
              <el-option key="2" label="扩科" value="2" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="freeContent" size="mini" >
              {{chargeDetail.itemName}}({{chargeDetail.itemType == 1?"标准收费":"区间收费"}})
          </el-form-item>
          <el-form-item  class="freeContent" size="mini" >
            <el-select placeholder="收费标准" @change="changeChargeStandard(chargeDetail)"
            class="handle-select mr10" v-model.number="chargeDetail.chargeStandardId">
              <el-option v-for="(item,index) in chargeDetail.chargeStandard" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="freeContent" style="width:120px" :prop="'chargeDetails.' + index + '.number'" size="mini"
           :rules="[{ validator:$validate.validateMoney}]">
              <el-input-number style="width:80px" v-model="chargeDetail.number"  :min="1" >
              </el-input-number>({{chargeDetail.unit}})
          </el-form-item>
          <el-form-item  class="freeContent itemText" :prop="'chargeDetails.' + index + '.price'" size="mini" >
            {{chargeDetail.price}}
          </el-form-item>
          <el-form-item  class="freeContent"  :prop="'chargeDetails.' + index + '.discount'" size="mini" >
            <el-input-number style="width:100px" v-model="chargeDetail.discount"  :min="1" :max="100">
            </el-input-number>
          </el-form-item>
          <el-form-item  class="freeContent itemText"  size="mini" >
            {{chargeDetail.sellPrice}}
          </el-form-item>

          <el-form-item  class="freeContent itemText" size="mini" style="color: red;">
            {{chargeDetail.total}}
          </el-form-item>
          <el-form-item  class="freeContent " :prop="'chargeDetails.' + index + '.subtractPrice'"
            :rules="[{ validator:$validate.validateMoney}]" size="mini" >
            <el-input-number style="width:100px" v-model="chargeDetail.subtractPrice"  :min="0" :max="chargeDetail.total">
            </el-input-number>
          </el-form-item>
          <el-form-item class="freeContent" >
              <el-button  size="mini" @click="removeChargeDetail(chargeDetail)">删除</el-button>
          </el-form-item>
      </el-form-item> -->
      <el-form-item style="padding-left:100px">
        <div class="accountContent">
          <div class="head" style="background-color: #eca061;">收款账户</div>
          <div class="cardContent">
            <el-form-item :label="item.name" v-for="(item,index) in account" label-width="100px" :prop="'financeAccount.' + index + '.money'" size="mini" :key="item.id">
              <el-input-number style="width:150px" v-model="item.money" :min="0" :max="item.arrears">
              </el-input-number>
            </el-form-item>
          </div>
        </div>
        <div class="accountContent" style="margin-left:15px">
          <div class="head" style="background-color: #409eff;">收款信息</div>
          <div class="cardContent">
            <el-form-item label-width="100px" label="应收金额" style="color: #67c23a;">{{bill.total}}</el-form-item>
            <el-form-item label-width="100px" label="实收金额" style="color: #f56c6c;">{{bill.receivable}}</el-form-item>
            <el-form-item label-width="100px" label="抹零" prop="bill.subtractMoney" size="mini">
              <el-input-number style="width:120px" v-model.number="form.bill.subtractMoney" :min="0" :max="bill.total">
              </el-input-number>
            </el-form-item>
            <el-form-item label-width="100px" label="欠费">{{bill.arrears}}</el-form-item>
          </div>
        </div>
        <p style="clear:both;min-height:20px"></p>
        <div style="text-align: center;clear:both;background-color: #ebeef5;padding: 5px 0px;margin-right:48px">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingForm">报 名</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped>
.freeTitle {
  display: inline-block;
  background-color: #f0f9eb;
  width: 120px;
  text-align: center;
  margin-bottom: 5px;
}
.freeContent {
  display: inline-block;
  width: 115px;
  margin-bottom: 5px;
  text-align: center;
}
.accountContent {
  /* display: inline-block;   */
  float: left;
  width: 47%;
  border: 1px solid silver;
  /* margin-left: 25px; */
  margin-top: 50px;
  min-height: 350px;
}
.head {
  height: 50px;
  line-height: 50px;
  font-family: "Microsoft YaHei";
  padding-left: 20px;
  color: #ffffff;
  font-size: 16px;
}
.cardContent {
  /* text-align: right; */
  padding: 10px 0px 0px 20px;
  min-height: 280px;
  max-height: 280px;
  overflow-y: auto;
}

.itemText {
  width: 70px;
}
.clean-bottom {
  margin-bottom: 0px;
}
</style>


<script scoped>
import CustomerDialog from "../../common/supply/CustomerDialog.vue";
import CustomerForm from "../supply/CustomerForm.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import ClassDialog from "../../common/teach/ClassDialog.vue";
import { getChargeStandard, getFinanceAccountList, createStudentApply } from "../../api/api";

export default {
  data() {
    return {
      formLabelWidth: "90px",
      loadingForm: false,
      titleLabel: [
        { label: "课程", type: 2 },
        { label: "班级", type: 2 },
        { label: "类型", type: 2 },
        { label: "收费项目(费用类型)", type: 3 },
        { label: "收费标准", type: 1 },
        { label: "数量(单位)", type: 1 },
        { label: "原单价", type: 2 },
        { label: "折扣(%)", type: 1 },
        { label: "折单价", type: 2 },
        { label: "总额", type: 2 },
        { label: "减免", type: 1 },
        { label: "操作", type: 1 },
      ],
      courseId: "",
      financeAccount: [],
      form: {
        studentId: "",
        chargeDetails: [
          // {
          //   courseId: "",
          //   courseName: "课程",
          //   classId: "",
          //   className: "",
          //   itemType: "1",
          //   itemName: "学费",
          //   number: "", //
          //   unit: "学时",
          //   price: "",
          //   sellPrice: "",//
          //   discount: 100,
          //   total: 0, //
          //   subtractPrice: 0,
          // }
        ],
        bill: {
          total: 0,//应收
          receivable: 0,//实收
          arrears: 0,//欠费
          // subtractPrice: 0, //去零
          subtractMoney: 0 //去零
        },
        financeAccount: []
      },
      studentId: "",
      student: {}//当前报名的学生
    };
  },
  computed: {
    chargeDetails() {
      this.form.bill.total = 0;
      this.form.chargeDetails.forEach(item => {
        item.sellPrice = item.price * item.discount / 100;
        if (item.itemType == 2) {//区间收费
          // item.total = item.sell * item.subtractPrice;
          item.total = Number(item.sellPrice.sub(item.subtractPrice));//售价-减免
        } else {
          // item.total =item.sellPrice * item.count - item.subtractPrice;//售价*数量 - 减免
          item.total = Number(Number(item.sellPrice.mul(item.number)).sub(item.subtractPrice));//售价*数量 - 减免
        }
        // this.form.bill.total +=  item.total;
        this.form.bill.total = Number(this.form.bill.total.add(item.total));
        this.form.financeAccount[0].money = this.form.bill.total;
      })
      return this.form.chargeDetails;
    },
    bill() {
      let money = 0;
      this.form.financeAccount.forEach(item => {
        // money = money+item.money;
        money = money.add(item.money)
        // item.arrears = this.form.bill.arrears;
      })
      let receivable = money;
      //实收
      this.form.bill.receivable = receivable < 0 ? 0 : receivable;
      // this.form.bill.receivable = this.form.bill.receivable - this.form.bill.subtractMoney;
      // let arrears = this.form.bill.total - this.form.bill.receivable - this.form.bill.subtractMoney;
      let arrears = Number(Number(this.form.bill.total.sub(this.form.bill.receivable)).sub(this.form.bill.subtractMoney));
      //欠费
      this.form.bill.arrears = arrears < 0 ? 0 : arrears;
      return this.form.bill;
    },
    account() {
      this.form.financeAccount.forEach(item => {
        let maxMoney = 0;
        this.form.financeAccount.forEach(otherItem => {
          if (otherItem.accountId != item.accountId) {
            //maxMoney = maxMoney+otherItem.money;
            maxMoney = maxMoney.add(otherItem.money);
          }
        })
        // let totalMoney =this.form.bill.total-this.form.bill.subtractMoney-maxMoney);
        let totalMoney = Number(Number(this.form.bill.total.sub(this.form.bill.subtractMoney)).sub(maxMoney));
        // console.log(maxMoney);
        if (totalMoney < 0) {
          item.arrears = 0;
          item.money = 0;
        } else {
          if (totalMoney < item.money) {
            item.money = totalMoney;
          }
          item.arrears = totalMoney;
        }
      })
      // console.log(this.form.financeAccount);
      return this.form.financeAccount;
    }
  },
  watch: {
    'form.courseId'(val) {
      console.log(val);
    }
  },
  created() {
    this.loadFinanceAccount();
  },
  methods: {
    loadFinanceAccount() {
      let self = this;
      let schoolZoneId = self.$user().schoolZoneId;
      getFinanceAccountList(1, 20, { schoolZoneId2: schoolZoneId, theOpen: 1 }).then(data => {
        if (data.data) {
          self.financeAccount = data.data.list;
          self.financeAccount.forEach(item => {
            if (item.thePublic == 2) {
              self.form.financeAccount.push({ accountId: item.id, money: 0, name: item.name });
            }
          })
          console.log(self.form.financeAccount)
        }
      });
    },
    submitForm(ref) {
      let self = this;
      if (self.form.chargeDetails.length == 0) {
        self.$message.error("请选择报名课程");
        return false;
      }
      self.$refs[ref].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          let formJson = JSON.stringify(self.form);
          createStudentApply(self.form.studentId, { form: formJson }).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$refs[ref].resetFields();
              self.form.chargeDetails = [];
              self.$message.success("报名成功");
            } else {
              self.$message.error("报名失败");
            }
          })
        } else {
          return false;
        }

      })
    },
    handleSaveSuccess(data) {
      this.student = data;
    },

    removeChargeDetail(item) {
      var index = this.form.chargeDetails.indexOf(item);
      if (index !== -1) {
        this.form.chargeDetails.splice(index, 1);
      }
    },
    addChargeStandard() {
      this.form.chargeStandard.push({
        minHourse: "",
        maxHourse: "",
        price: ""
      });
    },
    changeChargeStandard(chargeDetail) {
      chargeDetail.chargeStandard.forEach(item => {
        if (item.id == chargeDetail.chargeStandardId) {
          chargeDetail.price = item.price;
          return;
        }
      })
    },
    handleCourse(data) {
      let self = this;
      if (data) {
        data.forEach(course => {
          if (self.form.chargeDetails) {
            let falg = false;
            self.form.chargeDetails.forEach(detail => {
              if (detail.courseId == course.id) {
                falg = true;
                return;
              }
            })
            if (falg) {
              self.$message.warning(course.name + "已存在报名列表。");
              return;
            }
          }
          getChargeStandard(course.id).then(data => {
            if (data.code == 200) {
              let chargeDetail = {};
              let chargeStandards = [];
              data.data.forEach(chargeStandard => {
                chargeStandard.label = "(" + chargeStandard.minHourse + "-"
                  + chargeStandard.maxHourse + ")课时" + chargeStandard.price + "￥";
                chargeStandards.push(chargeStandard);
              })
              chargeDetail.chargeStandard = chargeStandards;
              chargeDetail.chargeStandardId = chargeStandards[0].id;//默认第一个
              chargeDetail.itemType = course.standardType;

              chargeDetail.courseId = course.id;
              chargeDetail.schoolId = course.schoolId;
              chargeDetail.courseName = course.name;
              chargeDetail.classId = "";
              chargeDetail.theType = "1"; // 1新报，2扩科（续报）
              chargeDetail.itemName = "学费";
              chargeDetail.number = 0;//数量
              chargeDetail.unit = "学时";
              chargeDetail.price = chargeStandards[0].price;//原价
              chargeDetail.sellPrice = chargeStandards[0].price;//售价
              chargeDetail.discount = 100;//折扣
              chargeDetail.total = 0;//总价
              chargeDetail.subtractPrice = 0;//减免

              self.form.chargeDetails.push(chargeDetail);
            } else {
              self.$message.warning(course.name + "收费标准获取错误。");
            }

          })

        })
        self.courseId = "";
      }
    }
  },
  components: { CustomerDialog, CustomerForm, CourseDialog, ClassDialog } //注入组S件
};
</script>
