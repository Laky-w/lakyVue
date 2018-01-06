<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.studentName" clearable placeholder="联系人名称/拼音/手机号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.userName" clearable placeholder="记录人" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.content" clearable placeholder="联系内容" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <date-range startPlaceholder="联系时间" v-model="queryForm.contactTime" endPlaceholder="联系时间"></date-range>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
        <!--<el-form-item>-->
        <!--<el-select v-model="queryForm.contactStyleId" value=1 clearable placeholder="联系方式"-->
        <!--class="handle-select mr10">-->
        <!--<el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加联系情况</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border style="width: 100%">
      <el-table-column label="联系人" prop="studentName">
      </el-table-column>
      <el-table-column label="记录人" prop="userName">
      </el-table-column>
      <el-table-column label="联系时间" prop="contactTime">
      </el-table-column>
      <el-table-column label="联系内容" prop="content">
      </el-table-column>
      <el-table-column label="联系方式" prop="contactStyleId">
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加跟进记录" :visible.sync="dialogFormVisible" width="750px" :close-on-click-modal=false custom-class="dialog-form">
      <el-form :model="form" ref="ruleForm" size="small">
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="studentId" :rules="[{ required: true, message: '名称必填'}]">
          <customer-dialog v-model="form.studentId" title="联系人" placeholder-text="联系人名称">
          </customer-dialog>
        </el-form-item>
        <el-form-item label="记录人" :label-width="formLabelWidth" prop="userId">
          <user-dialog v-model="form.userId" title="选择记录人" :rules="[{ required: true, message: '该项必填'}]" placeholder-text="记录人"></user-dialog>
        </el-form-item>
        <el-form-item label="联系时间" :label-width="formLabelWidth" prop="contactTime">
          <el-date-picker v-model="form.contactTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="联系时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="contactStyleId">
          <el-select v-model="form.contactStyleId" value=1 clearable placeholder="联系方式" style="width: 100%" class="handle-select mr10">
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系内容" :label-width="formLabelWidth" prop="content" :rules="[{ required: true, message: '该项必填'}]">
          <el-input v-model="form.content" style="height:100px" :rows=3 type="textarea" placeholder="联系内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script type="text/ecmascript-6">
import DateRange from "../../common/Daterange.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import CustomerDialog from "../../common/supply/CustomerDialog";
import {
  findBranchParameterValueAll,
  getContactList,
  createContact
} from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      queryForm: {
        userName: "",
        contactTime: "",
        content: "",
        studentName: "",
        contactStyleId: ""
      },
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        userId: "",
        contactTime: "",
        content: "",
        studentId: "",
        contactStyleId: ""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getData();
    this.getParameterValue(8);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.categoryId = self.parameterValue[0].id;
        }
      });
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
      getContactList(
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
          createContact(self.form).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.dialogFormVisible = false;
              self.getData();
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
    handleDelete(index, row) { },
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
    }
  },
  components: {
    DateRange,
    UserDialog,
    CustomerDialog
  } //注入组件
};
</script>
