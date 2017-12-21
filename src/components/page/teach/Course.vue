<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.name" clearable  placeholder="课程名称"
                    class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.theType"    clearable placeholder="课程类型" class="handle-select mr10" >
                        <el-option key="1" label="一对一" value="1"></el-option>
                        <el-option key="2" label="一对多" value="2" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.clazzId" multiple  value=1 clearable placeholder="科目" class="handle-select mr10" >
                        <el-option v-for="item in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"></school-tree>
                </el-form-item> -->

                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加课程</el-button>
          <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="课程" prop="name" >
            </el-table-column>
            <el-table-column
            label="科目"
            prop="clazzName">
            </el-table-column>
            <el-table-column
            label="类型"
            prop="theType" :formatter="filterTheType">
            </el-table-column>
            <el-table-column
            label="描述"
            prop="remarks" >
            </el-table-column>
            <!-- <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">添加</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination">
          <el-pagination
                @size-change="handleSizeChange"
                @current-change ="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="新增课程" :visible.sync="dialogFormVisible" :close-on-click-modal=false v-loading="loadingForm">
            <el-steps  :active="formActive" :simple=true finish-status="success">
                <el-step title="课程基本信息"></el-step>
                <el-step title="收费标准"></el-step>
                <el-step title="授权校区"></el-step>
            </el-steps>
          <el-form :model="form" ref="ruleForm1" :style="formActive!=1?'display:none':''">
              <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="课程名称"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="课程类型" :label-width="formLabelWidth" prop="theType"  :rules="[{ required: true, message: '类型必填'}]">
              <el-select v-model="form.theType" style="width:100%"   placeholder="课程类型" >
                    <el-option  label="一对一" value="1"></el-option>
                    <el-option  label="一对多" value="2" ></el-option>
              </el-select>
              </el-form-item>
              <el-form-item label="科目" :label-width="formLabelWidth" prop="clazzId"  :rules="[{ required: true, message: '科目必填'}]">
                <el-select v-model="form.clazzId" style="width:100%"  placeholder="科目" >
                    <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" :label-width="formLabelWidth" prop="remarks" >
                <el-input v-model="form.remarks"  :rows=5 type="textarea" placeholder="请输入描述信息" ></el-input>
              </el-form-item>
          </el-form>
          <el-form :model="form" ref="ruleForm2" :style="formActive!=2?'display:none':''">
              <!-- <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="课程名称"  auto-complete="off"></el-input>
              </el-form-item> -->
              <el-form-item label="收费类型" :label-width="formLabelWidth" prop="standardType"  :rules="[{ required: true, message: '类型必填'}]">
                <el-radio-group v-model="form.standardType">
                  <el-radio :label="1">标准收费</el-radio>
                  <el-radio :label="2">区间收费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="收费信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
                  <el-form-item class="freeTitle" size="mini">
                       课时
                   </el-form-item>
                   <el-form-item class="freeTitle" size="mini">
                       费用
                   </el-form-item>
                   <el-form-item size="mini" style="text-align:left;display: inline-block;margin-bottom:5px;">
                       <el-button size="mini" @click="addChargeStandard">添加</el-button>
                   </el-form-item>
              </el-form-item>
              <el-form-item  :label-width="formLabelWidth"  v-for="(chargeStandard, index) in form.chargeStandard" :key="index"  style="margin-bottom:0px;">
                   <el-form-item v-if="form.standardType==2" style="display:inline-block;width:100px;margin-bottom:5px;" 
                   :prop="'chargeStandard.' + index + '.minHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini" >
                       <el-input v-model.number="chargeStandard.minHourse" placeholder="最小课时" ></el-input>
                   </el-form-item>
                   <span v-if="form.standardType==2">--</span>
                   <el-form-item v-if="form.standardType==2"  style="display:inline-block;width:100px;margin-bottom:5px;"
                    :prop="'chargeStandard.' + index + '.maxHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini" >
                        <el-input v-model.number="chargeStandard.maxHourse" placeholder="最大课时" ></el-input>
                   </el-form-item>

                   <el-form-item v-if="form.standardType==1" style="display:inline-block;width:220px;margin-bottom:5px;"
                    :prop="'chargeStandard.' + index + '.minHourse'" :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini" >
                        <el-input v-model.number="chargeStandard.minHourse" placeholder="课时" ></el-input>
                   </el-form-item>
                   <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;"
                    :prop="'chargeStandard.' + index + '.price'"   :rules="[
                        { required: true, message: '必填项'},
                        { validator:$validate.validateMoney, trigger: 'blur'}]" size="mini"  >
                       <el-input v-model.number="chargeStandard.price" placeholder="费用"  ></el-input>
                   </el-form-item>
                   <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;"   >
                        <el-button  size="mini" @click="removeChargeStandard(chargeStandard)">删除</el-button>
                   </el-form-item>
              </el-form-item>
          </el-form>
          <el-form :model="form" ref="ruleForm3" :style="formActive!=3?'display:none':''">
                <el-transfer style="padding-left: 180px;"
                    v-model="form.schoolIds"
                    filterable
                    :titles="['全部校区', '授权校区']"
                    :button-texts="['取消', '授权']"
                    :props="{key: 'id',label: 'name'}"
                    :data="schoolData">
                    <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                    <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
                </el-transfer>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" v-if="formActive!=1" @click="formActive--">上一步</el-button>
                <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">{{formActive!=3?'下一步':'保存'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
.el-steps--simple {
  padding: 8px 8%;
  border-radius: 4px;
  background: #f5f7fa;
  line-height: 6px;
  margin-bottom: 15px;
}
</style>

<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
.freeTitle {
  display: inline-block;
  background-color: #faebd7;
  width: 220px;
  text-align: center;
  margin-bottom: 5px;
}

table td {
  line-height: 26px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import { findChildSchoolZoneAll,createCourse,getCourseList,findBranchParameterValueAll} from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        name: "",
        theType: "",
        clazzId: []
      },
      parameterValue: [],
      formActive: 1,
      schoolData: [], //全部授权校区
      form: {
        //表单 v-modle绑定的值
        name: "",
        theType: "2",
        clazzId: "",
        remarks: "",
        standardType: 1,
        schoolIds: [],
        chargeStandardStr: "", //收费信息json
        chargeStandard: [
          {
            minHourse: "",
            maxHourse: "",
            price: ""
          }
        ]
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getSchoolId();
    this.getSchool();
    this.getParameterValue(7);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = JSON.parse(sessionStorage.getItem("userInfo"));
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
      self.schoolId = user.schoolZoneId;
    },
    //初始化属性end
    //分页方法start
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getData();
    },
    //分页方法结束
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    search(form) {
      //搜索方法
      this.cur_page = 1;
      this.getData();
    },
    getSchool() {
      let self = this;
      findChildSchoolZoneAll(2,self.schoolId).then(data => {
        if (data.code == 200) {
          let parent = data.data;
          self.form.schoolIds.push(parent.id);
          let dataArray = [];
          parent["disabled"] = true;
          dataArray.push(parent);
          if (parent.childrenList) {
            dataArray = dataArray.concat(
              self.parseSchoolArray(parent.childrenList)
            );
          }
          self.schoolData = dataArray;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    parseSchoolArray(data) {
      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        dataArray.push(data[i]);
        if (data[i].childrenList) {
          dataArray = dataArray.concat(
            this.parseSchoolArray(data[i].childrenList)
          );
        }
      }
      return dataArray;
    },
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
        }
      });
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      getCourseList(
        self.cur_page,
        self.page_size,
        self.queryForm
      ).then(data => {
        self.loading = false;
        if (data.code == 200) {
          self.tableData = data.data.list;
          self.total = data.data.total;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    resetFormFields() {
      let self = this;
      self.$refs["ruleForm1"].resetFields();
      self.$refs["ruleForm2"].resetFields();
      self.form.schoolIds = [self.schoolId];
      self.formActive = 1;
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName + self.formActive].validate(valid => {
        if (valid) {
          if (self.formActive == 3) {
            self.loadingForm = true;
            self.form.chargeStandardStr = JSON.stringify(
              self.form.chargeStandard
            );
            createCourse(self.form).then(data => {
              self.loadingForm = false;
              if (data.code == 200) {
                self.$message.success(data.message);
                self.dialogFormVisible = false;
                self.getData();
                self.resetFormFields();
              } else {
                this.$message.error(data.data);
              }
            });
          } else {
            self.formActive++;
          }
        } else {
          return false;
        }
      });
    },
    //数据过滤
    filterTheType(value, row) {
      if (value.theType == 1) row.tag = "一对一";
      else row.tag = "一对多";
      return row.tag;
    },
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {},
    handleSchool(data) {
      this.form.schoolName = data.name;
      this.form.schoolZoneId = data.id;
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    removeChargeStandard(item) {
      if (this.form.chargeStandard.length == 1) return;
      var index = this.form.chargeStandard.indexOf(item);
      if (index !== -1) {
        this.form.chargeStandard.splice(index, 1);
      }
    },
    addChargeStandard() {
      this.form.chargeStandard.push({
        minHourse: "",
        maxHourse: "",
        price: ""
      });
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
