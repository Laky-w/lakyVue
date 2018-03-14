<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="name">
          <el-input v-model="queryForm.studentName" placeholder="学生名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="teacherName">
          <el-input v-model="queryForm.teacherName" placeholder="班主任" clearable class="handle-input mr10"></el-input>
        </el-form-item> -->
        <el-form-item prop="className">
          <el-input v-model="queryForm.className" placeholder="班级名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="startTime">
          <date-range startPlaceholder="考勤日期" v-model="queryForm.attendanceTime" endPlaceholder="考勤日期"></date-range>
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
          <el-form-item prop="attendanceStatus">
            <el-select v-model="queryForm.attendanceStatus" placeholder="考勤状态" class="handle-input mr10">
              <!-- <el-option label="未考勤" :value="1"></el-option> -->
              <el-option label="到" :value="2"></el-option>
              <el-option label="未到" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="姓名" sortable="custom" prop="studentName">
        <template slot-scope="scope">
          {{scope.row.studentName}}
        </template>
      </el-table-column>
      <el-table-column label="电话" sortable="custom" prop="phone">
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="班级" sortable="custom" prop="className">
      </el-table-column>
      <el-table-column label="考勤状态" sortable="custom" prop="attendanceStatus" :formatter="filterAttendanceStatus">
      </el-table-column>
      <el-table-column label="考勤时间" sortable="custom" prop="theTime">
      </el-table-column>
      <el-table-column label="备注" sortable="custom" prop="remarks">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import {
  getStudentAttendanceAll,
} from "../../api/api";

export default {
  data() {
    return {
      isShowMore: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      visible: false,
      queryForm: {
        studentName: "",
        className: "",
        attendanceStatus: "",
        attendanceTime: [],
        schoolZoneId2: []
      },
      loading: false,
    };
  },
  created() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.queryForm.attendanceTime = [firstDay, lastDay]
    this.getData();
  },
  watch: {
    viewId(val) {
      this.getData(val);
    }
  },
  computed: {
    //实时计算
  },
  methods: {
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
      getStudentAttendanceAll(
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
    filterAttendanceStatus(value, row) {
      switch (value.attendanceStatus) {
        case 1:
          row.tag = "未考勤";
          break;
        case 2:
          row.tag = "以到";
          break;
        case 3:
          row.tag = "未到";
          break;
      }
      return row.tag;
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
    },
  },
  components: { SchoolTree, DateRange } //注入组件
};
</script>
