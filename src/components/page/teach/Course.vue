<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="课程名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item> -->
        <el-form-item prop="theType">
          <el-select v-model="queryForm.theType" clearable placeholder="课程类型" class="handle-select mr10">
            <el-option key="1" label="一对一" value="1"></el-option>
            <el-option key="2" label="一对多" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="theStatus2">
          <el-select v-model="queryForm.theStatus2" clearable placeholder="课程状态" class="handle-select mr10">
            <el-option key="1" label="正常" value="1"></el-option>
            <el-option key="2" label="封存" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="clazzId">
          <el-select v-model="queryForm.clazzId" multiple collapse-tags clearable placeholder="类别" class="handle-select mr10">
            <el-option v-for="item in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="refresh('queryForm')">重置</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="$refs['courseForm'].handleAddCourse();">添加课程</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="课程" sortable="custom" prop="name">
        <template slot-scope="scope">
          <a @click="handleView(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="收费类型" sortable="custom" prop="standardType" :formatter="filterStandardType">
      </el-table-column>
      <el-table-column label="授权校区" sortable="custom" prop="schoolZoneNumber">
        <template slot-scope="scope">
          <a @click="handleCourseShool(scope.row.id);">{{scope.row.schoolZoneNumber}}个校区</a>
        </template>
      </el-table-column>
      <el-table-column label="类别" sortable="custom" prop="clazzName">
      </el-table-column>
      <el-table-column label="课程类型" sortable="custom" prop="theType" :formatter="filterTheType">
      </el-table-column>
      <el-table-column label="状态" sortable="custom" prop="theStatus">
        <template slot-scope="scope">
          <!-- {{scope.row.theType}} -->
          <el-tag :type="scope.row.theStatus === 2 ? 'info' : 'success'" close-transition>
            {{scope.row.theStatus===1?"正常":""}}{{scope.row.theStatus===2?"封存":""}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" sortable="custom" prop="remarks">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="handleCommand" size="small">
            修改
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.theStatus ==2" :command="{row:scope.row,type:'normal'}">启用</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.theStatus ==1" :command="{row:scope.row,type:'sealup'}">封存</el-dropdown-item>
              <el-dropdown-item :command="{row:scope.row,type:'delete'}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <course-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></course-view>
    <course-form ref="courseForm" @saveSuccess="getData()"></course-form>
    <course-school :couser-id="viewId" :dialog-form-visible.sync="dialogSchoolVisible" @saveSuccess="getData()"></course-school>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import CourseView from "./CourseView.vue";
import CourseForm from "./CourseForm.vue";
import CourseSchool from "./CourseSchool.vue";
import { getBranchCourseList, findBranchParameterValueAll, deleteCourse, normalCourse, sealUpCourse } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogSchoolVisible: false,
      dialogViewVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",
      queryForm: {
        name: "",
        theStatus2: "1",
        theType: "",
        clazzId: [],
        schoolZoneId2: ""
      },
      parameterValue: [],
      loading: false,
    };
  },
  created() {
    this.getParameterValue(7);
    this.getData();
  },
  methods: {
    //初始化属性start
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
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
    search() {
      //搜索方法
      this.cur_page = 1;
      this.getData();
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      getBranchCourseList(
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
    //数据过滤
    filterTheType(value, row) {
      if (value.theType == 1) row.tag = "一对一";
      else row.tag = "一对多";
      return row.tag;
    },
    filterStandardType(value, row) {
      if (value.standardType == 1) row.tag = "标准收费";
      else row.tag = "区间收费";
      return row.tag;
    },
    //控件方法
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handleCourseShool(courseId) {//弹出授权校区
      let self = this;
      self.viewId = courseId;
      self.dialogSchoolVisible = true;
      // self.$refs["courseSchool"].getSchool();
    },
    handleEdit(index, row) {
      this.$refs['courseForm'].handleUpdateCourse(row.id);
    },
    handleCommand(command) {
      switch (command.type) {
        case "add":
          this.handleAdd(command.row);
          break;
        case "delete":
          this.handleDelete(command.row);
          break;
        case "normal":
          this.handleNormal(command.row);
          break;
        case "sealup":
          this.handleSealup(command.row);
          break;
      }
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('确定删除该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        deleteCourse(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getData();
          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
    },
    handleNormal(row) {
      let self = this;
      self.$confirm('确定封存该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        normalCourse(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getData();

          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
    },
    handleSealup(row) {
      let self = this;
      self.$confirm('确定启用该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        sealUpCourse(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getData();
          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
    },
    handleSchool(data) {
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handSortChange(column) {//排序
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },

  },
  components: { SchoolTree, CourseForm, CourseView, CourseSchool } //注入组件
};
</script>
