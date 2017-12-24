<template>
  <div class="table" style="min-width:1200px">
    <el-form :model="form" ref="ruleForm" >
      <el-form-item label="选择学员" :label-width="formLabelWidth" prop="studentId"  :rules="[{ required: true, message: '学员必填'}]">
        <customer-dialog :defaulUser="student" style="width:80%" v-model="form.studentId" title="选择意向学员" placeholder-text="姓名/拼音/手机号"></customer-dialog>
        <div style="display:inline-block;">
          <customer-form size="medium" text="快速添加" @saveSuccess="handleSaveSuccess"></customer-form>
        </div>
      </el-form-item>
      <el-form-item label="选择课程" :label-width="formLabelWidth" prop="courseId"  >
        <course-dialog @selectData="handleCourse" style="width:80%" v-model="courseId" :selected-type="2"></course-dialog>
      </el-form-item>
      <el-form-item label="收费信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
        <el-form-item class="freeTitle" v-for="item in titleLabel" size="mini">
              {{item}}
        </el-form-item>
      </el-form-item>

      <el-form-item  :label-width="formLabelWidth"  v-for="(chargeDetail,index) in form.chargeDetails" style="margin-bottom:0px;">
          <el-form-item  class="freeContent" size="mini" >
              {{chargeDetail.courseName}}
          </el-form-item>
          <el-form-item  class="freeContent" size="mini" :prop="'chargeDetails.' + index + '.classId'">
              <customer-dialog v-model="chargeDetail.classId"></customer-dialog>
          </el-form-item>
           <el-form-item  class="freeContent" size="mini" :prop="'chargeDetails.' + index + '.theType'">
              <el-select v-model="chargeDetail.theType"   placeholder="课程类型" class="handle-select mr10" >
                  <el-option key="1" label="新报" value="1"></el-option>
                  <el-option key="2" label="扩科" value="2" ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item  class="freeContent" size="mini" >
              {{chargeDetail.itemName}}
          </el-form-item>
          <el-form-item  class="freeContent" :prop="'chargeDetails.' + index + '.count'" size="mini" >
              <el-input-number style="width:80px" v-model="chargeDetail.count"  :min="1" >
              </el-input-number>({{chargeDetail.unit}})
          </el-form-item>
          <el-form-item  class="freeContent" :prop="'chargeDetails.' + index + '.price'" size="mini" >
            <el-input v-model="chargeDetail.price" style="width:80px">

            </el-input>
          </el-form-item>
          <el-form-item  class="freeContent" style="150px" :prop="'chargeDetails.' + index + '.discount'" size="mini" >
            <!-- <el-input v-model="chargeDetail.discount"></el-input> -->
            <el-input-number style="width:100px" v-model="chargeDetail.discount"  :min="1" :max="100">
               <!-- <template slot="append">%</template> -->
            </el-input-number>
          </el-form-item>
          <el-form-item  class="freeContent" :prop="'chargeDetails.' + index + '.sell'" size="mini" >
            <el-input v-model="chargeDetail.sell"></el-input>
          </el-form-item>

          <el-form-item  class="freeContent" size="mini" >
            {{chargeDetail.totalPrice}}
          </el-form-item>
          <el-form-item  class="freeContent" :prop="'chargeDetails.' + index + '.subtractPrice'" size="mini" >
            <el-input v-model="chargeDetail.subtractPrice"></el-input>
          </el-form-item>
          <el-form-item class="freeContent" >
              <el-button  size="mini" @click="removeChargeDetail(chargeDetail)">删除</el-button>
          </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped>
.freeTitle {
  display: inline-block;
  background-color: #f0f9eb;
  width: 125px;
  text-align: center;
  margin-bottom: 5px;
}
.freeContent {
  display: inline-block;
  width: 120px;
  margin-bottom: 5px;
  text-align: center;
}
</style>


<script scoped>
import CustomerDialog from "../../common/supply/CustomerDialog.vue";
import CustomerForm from "../supply/CustomerForm.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";


export default {
  data() {
    return {
      formLabelWidth: "120px",
      titleLabel: ["课程", "班级", "类型", "收费项目", "数量(单位)", "标准价", "折扣(%)", "现价", "总额", "减免", "操作"],
      courseId: "",
      form: {
        studentId: "",

        chargeDetails: [
          // {
          //   courseId: "",
          //   courseName: "课程",
          //   classId: "",
          //   className: "",
          //   theType: "1",
          //   itemName: "学费",
          //   count: "",
          //   unit: "学时",
          //   price: "",
          //   sell: "",
          //   discount: 100,
          //   totalPrice: 0,
          //   subtractPrice: 0,
          // }
        ]
      },
      studentId: "",
      student: {}//当前报名的学生
    };
  },
  watch: {
    'form.courseId'(val) {
      console.log(val);
    }
  },
  created() {
  },
  computed: {
    //实时计算
  },
  methods: {
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
    handleCourse(data) {
      console.log(data);
      let self = this;
      if (data) {
        data.forEach(course => {
          if(self.form.chargeDetails){
            let falg = false;
            self.form.chargeDetails.forEach(detail=>{
              if(detail.courseId == course.id){
                falg=true;
                return;
              }
            })
            if(falg){
              self.$message.warning(course.name+"已存在报名列表");
              return;
            }
          }
          let chargeDetail = {};
          chargeDetail.courseId = course.id;
          chargeDetail.courseName = course.name;
          chargeDetail.classId = "";
          chargeDetail.theType = "1"; // 1新报，2扩科（续报）
          chargeDetail.itemName = "学费";
          chargeDetail.count = "";//数量
          chargeDetail.unit = "学时";
          chargeDetail.price = 0;//原价
          chargeDetail.sell = "";//售价
          chargeDetail.discount = 100;//折扣
          chargeDetail.totalPrice = 0;//总价
          chargeDetail.subtractPrice = 0;//减免
          self.form.chargeDetails.push(chargeDetail);
        })
        self.courseId = "";
      }
    }
  },
  components: { CustomerDialog, CustomerForm, CourseDialog } //注入组S件
};
</script>
