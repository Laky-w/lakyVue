<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="姓名/拼音/电话" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <course-dialog v-model="queryForm.courseId"></course-dialog>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleClass">分班</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" :row-class-name="tableRowClassName" border @sort-change="handSortChange" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column label="姓名" sortable="custom" prop="studentName">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.studentId)">{{scope.row.studentName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="课程" sortable="custom" prop="courseName">
      </el-table-column>
      <el-table-column label="报名时间" sortable="custom" prop="createTime">
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
    <student-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></student-view>
    <wait-student-class ref="waitStudentClass" @saveSuccess="getData"></wait-student-class>
  </div>
</template>




<script>
import StudentView from "../reception/StudentView.vue";
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import WaitStudentClass from "./WaitStudentClass.vue";
import {
  getWaitStudentList,
  findBranchParameterValueAll,
  createStudent
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      checkedData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",
      dialogViewVisible: false,
      queryForm: {
        name: "",
        schoolZoneId2: [],
        courseId: "",
        classStatus: 2
      },
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
        schoolZoneName: "",
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
      self.form.schoolZoneName = user.schoolZone.name;
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
      getWaitStudentList(
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
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
      this.form.roles = [];
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handleClass() {//分班
      let falg = true;
      let courseId = this.checkedData[0].courseId;
      let studentIds = "";
      this.checkedData.forEach(item => {
        studentIds += item.id + ",";

        this.checkedData.forEach(item2 => {
          if (item.courseId != item2.courseId) {
            this.$message.warning("请选择同一课程学员进行分班！");
            falg = false;
            return false;
          }
        })
        if (falg) {
          this.$refs["waitStudentClass"].openDialog(courseId, studentIds);
          // this.$message.success("开始分班！");
        }

      })
    },
    handleSelectionChange(val) {
      this.checkedData = val;
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
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog, StudentView, WaitStudentClass } //注入组件
};
</script>
