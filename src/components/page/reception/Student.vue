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
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="$refs['studentForm'].handleOpenDialog()">添加正式学员</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" :row-class-name="tableRowClassName" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="姓名" sortable="custom" prop="name">
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
      <el-table-column label="联系人" sortable="custom" prop="contactName">
      </el-table-column>
      <el-table-column label="学管师" sortable="custom" prop="ownerName">
      </el-table-column>
      <el-table-column label="报名状态" sortable="custom" prop="classStatus" :formatter="filterClassStatus">
      </el-table-column>
      <el-table-column label="来源活动" sortable="custom" prop="sourceName">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="备注" sortable="custom" prop="remarks">
      </el-table-column>
      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="primary" plain size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <student-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></student-view>
    <student-form @saveSuccess="getData" :dialog-form-visible.sync="dialogFormVisible" ref="studentForm"></student-form>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>




<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import StudentView from "./StudentView.vue";
import StudentForm from "./StudentForm.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  getStudentList,
  findBranchParameterValueAll,
  deleteStudent
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      titleDialog: "添加正式学员",
      queryForm: {
        name: "",
        schoolZoneId2: []
      },
      dialogViewVisible: false,
      viewId: "",//详情id
      parameterValue: [],
      oldForm: {
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
      form: {},
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
      self.oldForm.schoolZoneId = user.schoolZoneId;
      self.oldForm.schoolName = user.schoolZone.name;
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
    saveSuccess(data) {
      this.getData();
    },
    //保存表单
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
      let self = this;
      self.$refs["studentForm"].handleEditOpenDialog(row.id);
    },
    handleDelete(index, row) {
      let self = this;
      self.$confirm('确定删除该正式学员信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        console.log(row);
        deleteStudent(row.id).then(data => {
          if (data.code == 200) {
            self.getData();
            self.$message.success(data.message);
          } else {
            self.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
    },
    handleAdd() {
      let self = this;
      self.dialogFormVisible = true;
      self.titleDialog = "添加正式学员";
      self.form = self.oldFrom;
    },
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
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog, StudentView, StudentForm } //注入组件
};
</script>
