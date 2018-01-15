<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="班级名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">开班</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="名称" sortable="custom" prop="name">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="课程" sortable="custom" prop="courseName">
      </el-table-column>
      <el-table-column label="教室" sortable="custom" prop="roomName">
      </el-table-column>
      <el-table-column label="班主任" sortable="custom" prop="teacherName">
      </el-table-column>
      <el-table-column label="主教" sortable="custom" prop="mainTeacherName">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="计划开班日期" sortable="custom" prop="startDate">
      </el-table-column>
      <el-table-column label="计划结课日期" sortable="custom" prop="endDate">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="handleCommand" size="small">
            编辑
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{item:'course',row:scope.row}">排课</el-dropdown-item>
              <el-dropdown-item :command="{item:'delete',row:scope.row}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <class-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></class-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="开班" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <class-form ref="classForm" :edit-class="currentClass"></class-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false;">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('classForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="排课" :visible.sync="dialogScheduleFormVisible" :close-on-click-modal=false>
      <schedule-form ref="scheduleForm" :current-class="currentClass"></schedule-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScheduleFormVisible=false;">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('scheduleForm')">确 定</el-button>
      </div>
    </el-dialog>
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
import { getSchoolClassList, deleteSchoolClass, getSchoolClassView } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      dialogScheduleFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",
      dialogViewVisible: false,
      queryForm: {
        name: "",
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
      let self = this;
      getSchoolClassView(row.id).then(data => {
        self.dialogFormVisible = true;
        let obj = data.data;
        self.currentClass = obj;
      })
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
    handleView(id) {
      let self = this;
      self.viewId = id;
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
          self.currentClass = command.row;
          console.log(self.currentClass);
          self.dialogScheduleFormVisible = true;
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
