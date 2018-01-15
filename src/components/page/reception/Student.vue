<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="姓名/拼音/电话" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.sex" value=1 clearable placeholder="性别" class="handle-select mr10">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="2" label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.classStatus" value=1 clearable placeholder="报名状态" class="handle-select mr10">
            <el-option key="1" label="未报名" value="1"></el-option>
            <el-option key="2" label="已报名" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加正式学员</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" :row-class-name="tableRowClassName" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="名称" sortable="custom" prop="name">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="性别" sortable="custom" prop="sex" :formatter="filterSex">
      </el-table-column>
      <el-table-column label="联系电话" sortable="custom" prop="phone">
      </el-table-column>
      <el-table-column label="联系人" sortable="custom" prop="contactId">
      </el-table-column>
      <el-table-column label="学管师" sortable="custom" prop="ownerId">
      </el-table-column>
      <el-table-column label="报名状态" sortable="custom" prop="classStatus" :formatter="filterClassStatus">
      </el-table-column>
      <el-table-column label="来源活动" sortable="custom" prop="sourceId">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="备注" sortable="custom" prop="remarks">
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
    <student-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></student-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加正式学员" :visible.sync="dialogFormVisible" width="750px" custom-class="dialog-form" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm" inline size="small">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '名称必填'},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]">
          <el-input v-model="form.name" placeholder="学员名称"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone" :rules="[{ required: true, message: '该项必填'}]">
          <el-input v-model="form.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactId" :rules="[{ required: true, message: '该项必填'}]">
          <el-select v-model="form.contactId" style="width:100%" placeholder="科目">
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName" :rules="[{ required: true, message: '部门必填'}]">
          <school-tree @nodeClick="handleSchool" the-type="2" :name="form.schoolName" :default-value="schoolId"></school-tree>
        </el-form-item>
        <el-form-item label="学管师" :label-width="formLabelWidth" prop="ownerId">
          <user-dialog v-model="form.ownerId" title="学管师" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="学管师"></user-dialog>
        </el-form-item>
        <el-form-item label="来源活动" :label-width="formLabelWidth" prop="sourceId">
          <market-activity-dialog v-model="form.sourceId"></market-activity-dialog>
        </el-form-item>
        <!-- <el-form-item label="意向课程" :label-width="formLabelWidth" prop="intentionId">
                <course-dialog v-model="form.intentionId" title="意向课程" selected-type="2"
                                placeholder-text="意向课程"></course-dialog>
            </el-form-item> -->
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
          <el-input v-model="form.remarks" style="width:535px" :rows=3 type="textarea" placeholder="备注"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import StudentView from "./StudentView.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  getStudentList,
  findBranchParameterValueAll,
  createStudent
} from "../../api/api";

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
        schoolZoneId2: []
      },
      dialogViewVisible: false,
      viewId: "",//详情id
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        name: "",
        sex: 1,
        contactId: "",
        sourceId: "",
        ownerId: "",
        phone: "",
        remarks: "",
        schoolZoneId: "",
        schoolName: "",
        intentionId: []
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
    this.getParameterValue(3);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
      self.schoolId = user.schoolZoneId;
    },
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.contactId = self.parameterValue[0].id;
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
      getStudentList(
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
          createStudent(self.form).then(data => {
            self.$message.success(data.message);
            self.$refs[formName].resetFields();
            self.dialogFormVisible = false;
            self.getData();
          });
        } else {
          return false;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row.classStatus == 1);
      if (row.classStatus == 1) {
        return "warning-row";
      }
      return "";
    },
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
      return row.tag;
    },
    filterClassStatus(value, row) {
      if (value.classStatus == 1) row.tag = "未报名";
      else row.tag = "已报名";
      return row.tag;
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
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
      // self.$refs["view"].show();
    },
    handSortChange(column, prop, order) {
      console.log(column);
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog, StudentView } //注入组件
};
</script>
