<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.name" clearable placeholder="账户名称" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange" :the-type="2" place-text="校区" ></school-tree>
                </el-form-item>
                <el-form-item >
                   <el-select v-model="queryForm.theType"   value=1 clearable placeholder="账户类型" class="handle-select mr10" >
                        <el-option  key="1" label="现金账户" value="1"></el-option>
                        <el-option  key="2" label="银行账户" value="2"></el-option>
                        <el-option  key="3" label="第三方支付账户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加账户</el-button>
          <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="账户名称" prop="name" >
            </el-table-column>
            <el-table-column
            label="校区"
            prop="schoolZoneName" :formatter="filterSchoolZoneName">
            </el-table-column>
            <el-table-column
            label="账户类型" sortable
            prop="theType" :formatter="filterType">
            </el-table-column>

            <el-table-column
            label="前台账户"
            prop="theOpen" :formatter="filterOpen">
            </el-table-column>
            <el-table-column
            sortable
            label="余额"
            prop="money">
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
        <el-dialog title="添加账户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="form" ref="ruleForm" v-loading="loadingForm" >
               <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '班级名称必填'}]">
                <el-input v-model="form.name"   placeholder="账户名称"  ></el-input>
              </el-form-item>
              <el-form-item label="类型" style="display: inline-block;" :label-width="formLabelWidth" prop="theType"  :rules="[{ required: true, message: '该项必填'}]">
                <el-select v-model="form.theType"  placeholder="账户类型" >
                    <el-option  key="1" label="现金账户" value="1"></el-option>
                    <el-option  key="2" label="银行账户" value="2"></el-option>
                    <el-option  key="3" label="第三方支付账户" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用于前台收费" style="display:inline-block;" :label-width="formLabelWidth" prop="isOpen">
                <el-switch
                    v-model="form.isOpen" >
                </el-switch>
              </el-form-item>
              <el-form-item label="公共账户" style="display:inline-block;" :label-width="formLabelWidth" prop="isPublic">
                <el-switch
                    v-model="form.isPublic" >
                </el-switch>
              </el-form-item>
              <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName"  :rules="[{ required: true, message: '校区必填'}]">
                <school-tree @nodeClick="handleSchool" :name="form.schoolName" :the-type="2" :disabled="form.isPublic" place-text="校区" :default-value="schoolId"></school-tree>
              </el-form-item>
               <el-form-item label="初始金额" :label-width="formLabelWidth" prop="money"
               :rules="[{validator:$validate.validateMoney, trigger: 'blur'}]">
               <el-input v-model="form.money"   placeholder="0"  clearable>
                   <template slot="append">元(￥)</template>
               </el-input>
              </el-form-item>
              <el-form-item label="描述" :label-width="formLabelWidth" prop="remarks">
                <el-input v-model="form.remarks"   placeholder="描述"  clearable></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          </div>
        </el-dialog>
    </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import { getFinanceAccount,createFinanceAccount } from "../../api/api";
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
        schoolZoneId2: [],
        theType: ""
      },
      form: {
        //表单 v-modle绑定的值
        name: "",
        userId: "",
        schoolZoneId: "",
        schoolName: "",
        theType: "1",
        isOpen: true,
        isPublic: false,
        money: 0,
        remarks: ""
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
  },
  computed: {
    //实时计算
    startDate() {
      return this.form.startDate;
    }
  },
  watch: {
    startDate(val) {
      this.form.endDate = "";
    }
  },
  methods: {
    //初始化属性start
    validateMoney(rule, value, callback) {
      console.log(this.$validate.validateMoney);
      return;
      let reg = /(^\d+\.\d{2}$)|(^[0-9]*$)|(^\d+\.\d{1}$)/;
      console.log(this.form.money);
      console.log(reg.test(value));
      if (value !== "" && !reg.test(value)) {
        callback(new Error("格式错误,正确格式[0.00]"));
      } else {
        callback();
      }
    },
    getSchoolId() {
      let self = this;
      let user = self.$user();
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
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      getFinanceAccount(
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
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createFinanceAccount(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.dialogFormVisible = false;
              self.getData();
              self.$refs[formName].resetFields();
            } else {
              this.$message.error(data.data);
            }
          });
        } else {
          return false;
        }
      });
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
      this.form.roles = [];
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    filterSchoolZoneName(value, row) {
      if (row.thePublic == 1) row.tag = "公共";
      else row.tag = value.schoolZoneName;
      return row.tag;
    },
    filterType(value, row) {
      if (value.theType == 1) row.tag = "现金账户";
      else if (value.theType == 2) row.tag = "银行账户";
      else row.tag = "第三方支付账户";
      return row.tag;
    },
    filterOpen(value, row) {
      if (row.theOpen == 1) row.tag = "开启";
      else row.tag = "关闭";
      return row.tag;
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
