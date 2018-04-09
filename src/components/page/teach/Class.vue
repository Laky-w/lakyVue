<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="name">
          <el-input v-model="queryForm.name" placeholder="班级名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="teacherName">
          <el-input v-model="queryForm.teacherName" placeholder="班主任" clearable class="handle-input mr10"></el-input>
        </el-form-item> -->
        <el-form-item prop="courseName">
          <el-input v-model="queryForm.courseName" placeholder="课程" clearable class="handle-input mr10"></el-input>
        </el-form-item>

        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==false" type="primary" icon="el-icon-arrow-down" @click="isShowMore=true"></el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==true" type="primary" icon="el-icon-arrow-up" @click="isShowMore=false"></el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="$refs['queryForm'].resetFields();search('queryForm')">重置</el-button>
        <div v-show="isShowMore">
          <el-form-item>
            <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
          </el-form-item>
          <el-form-item prop="roomName">
            <el-input v-model="queryForm.roomName" placeholder="教室" clearable class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="teacherName" v-if="$isAuthority('show-all-class')">
            <el-input v-model="queryForm.teacherName" placeholder="班主任/主教" clearable class="handle-input mr10"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" v-if="$isAuthority('add-class')" icon="el-icon-edit" size="mini" @click="$refs['classForm'].handleOpenDialog()">开班</el-button>
      <el-button type="success" v-if="$isAuthority('import-class')" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="名称" sortable="custom" prop="name" fixed>
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id,'class-info')">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="课程" sortable="custom" prop="courseName">
      </el-table-column>
      <el-table-column label="教室" sortable="custom" prop="roomName">
      </el-table-column>
      <el-table-column label="班主任" sortable="custom" prop="teacherName" v-if="$isAuthority('show-all-class')">
      </el-table-column>
      <el-table-column label="主教" sortable="custom" prop="mainTeacherName" v-if="$isAuthority('show-all-class')">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime" min-width="155px">
      </el-table-column>
      <el-table-column label="计划开班日期" sortable="custom" prop="startDate">
      </el-table-column>
      <el-table-column label="计划结课日期" sortable="custom" prop="endDate">
      </el-table-column>
      <el-table-column label="人数" sortable="custom" prop="nowStudentNumber">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id,'class-student')">{{ scope.row.nowStudentNumber }}/{{ scope.row.studentNumber?scope.row.studentNumber:0 }}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120px">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" v-if="$isAuthority('update-class') || $isAuthority('add-schedule-class') || $isAuthority('delete-class')" @click="handleEdit(scope.$index, scope.row)" @command="handleCommand" size="small">
            {{$isAuthority('update-class')?'修改':'操作'}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$isAuthority('add-schedule-class')" :command="{item:'course',row:scope.row}">排课</el-dropdown-item>
              <el-dropdown-item v-if="$isAuthority('delete-class')" :command="{item:'delete',row:scope.row}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <class-view :view-id="viewId" :current-table-name="viewTable" :dialog-view-visible.sync="dialogViewVisible"></class-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <class-form ref="classForm" @saveSuccess="getData"></class-form>
    <schedule-form ref="scheduleForm"></schedule-form>
    <!-- <el-dialog title="排课" :visible.sync="dialogScheduleFormVisible" :close-on-click-modal=false>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScheduleFormVisible=false;">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('scheduleForm')">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<style scoped>
table td {
  line-height: 26px;
}
</style>

<script>
import ClassView from "./ClassView.vue";
import SchoolTree from "../../common/system/SchoolTree.vue";
import ClassForm from "./ClassForm.vue";
import ScheduleForm from "./ScheduleForm.vue";
import { getSchoolClassList, deleteSchoolClass } from "../../api/api";
export default {
  data() {
    return {
      isShowMore: false,
      tableData: [],
      dialogFormVisible: false,
      dialogScheduleFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",
      viewTable: "",
      dialogViewVisible: false,
      queryForm: {
        name: "",
        teacherName: "",
        courseName: "",
        roomName: "",
        mainTeacherName: "",
        theDate: "",
        theType: "",
        schoolZoneId2: []
      },
      currentClass: {},//当前班级
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //初始化属性start
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
      let falg = this.$isAuthority('show-all-class');//所有班主任或者主教的
      if (!falg) self.queryForm.teacherId = self.$user().id; //查询全部用户权限
      self.loading = true;
      getSchoolClassList(
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
      // self.loadingForm = true;
      this.$refs[formName].submitForm(function (data) {
        self.loadingForm = false;
        if (data !== false) {
          self.dialogFormVisible = false;
          self.loadingForm = false;
          self.getData();
        }
      });
    },
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
      return row.tag;
    },
    filterIsSuper(value, row) {
      if (value.isSuper == 1) row.tag = "超级管理员";
      else row.tag = "普通用户";
      return row.tag;
    },
    //控件方法
    handleEdit(index, row) {
      if (this.$isAuthority('update-class')) {
        this.$refs['classForm'].handleEditOpenDialog(row.id);
      }
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('确定删除开班信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        console.log(row);
        deleteSchoolClass(row.id).then(data => {
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleView(id, tableName) {
      let self = this;
      self.viewId = id;
      self.viewTable = tableName;
      self.dialogViewVisible = true;
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
    handleCommand(command) {
      // console.log(command);
      let self = this;
      switch (command.item) {
        case "course":
          self.$refs["scheduleForm"].handleOpenDialog(command.row);
          break;
        case "delete":
          self.handleDelete(command.row);
          break;
      }
    }
  },
  components: { ClassForm, SchoolTree, ScheduleForm, ClassView } //注入组件
};
</script>
