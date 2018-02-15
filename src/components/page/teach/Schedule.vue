<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="className">
          <el-input v-model="queryForm.className" placeholder="班级名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="roomName">
          <el-input v-model="queryForm.roomName" placeholder="教室名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="startTime">
          <date-range startPlaceholder="上课日期" v-model="queryForm.startTime" endPlaceholder="上课日期"></date-range>
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
          <el-form-item prop="teachName">
            <el-input v-model="queryForm.teachName" placeholder="主教姓名" clearable class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="helpTeacherName">
            <el-input v-model="queryForm.helpTeacherName" placeholder="助教姓名" clearable class="handle-input mr10"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleBatchDelete">批量删除</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="班级" sortable="custom" prop="schoolClassName">
      </el-table-column>
      <el-table-column label="上课时间" sortable="custom" min-width="220px" prop="startTime" :formatter="filterScheduleTime">
      </el-table-column>
      <el-table-column label="课时" sortable="custom" prop="hour">
      </el-table-column>
      <el-table-column label="教室" sortable="custom" prop="roomName">
      </el-table-column>

      <el-table-column label="主教" sortable="custom" prop="teachName">
      </el-table-column>
      <el-table-column label="助教" sortable="custom" prop="helpTeacherName">
      </el-table-column>
      <el-table-column label="考勤状态" sortable="custom" prop="attendanceStatus" :formatter="filterAttendanceStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="$refs['simpleForm'].openDialog(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <schedule-simple-form ref="simpleForm" @saveSuccess="getData"></schedule-simple-form>
  </div>
</template>

<style scoped>
table td {
  line-height: 26px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import ScheduleForm from "./ScheduleForm.vue";
import ScheduleSimpleForm from "./ScheduleSimpleForm.vue";
import { getClassScheduleAll, deleteClassSchedule } from "../../api/api";
export default {
  data() {
    return {
      isShowMore: false,
      tableData: [],
      checkedData: [],
      dialogFormVisible: false,
      dialogScheduleFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        className: "",
        roomName: "",
        teachName: "",
        helpTeacherName: "",
        // theDate: "",
        // theType: "",
        schoolZoneId2: [],
        startTime: []
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
      getClassScheduleAll(
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
    filterAttendanceStatus(value, row) {
      console.log(value.attendanceStatus);
      if (value.attendanceStatus == 1) {
        row.tag = "未考勤"
      } else {
        row.tag = "已考勤"
      }
      return row.tag;
    },
    filterScheduleTime(value, row) {
      let time = value.startTime;
      let endTime = value.endTime;//2017-01-22
      let fullDate = time.substring(0, 10).split("-");
      let sDate = new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0);
      let str = time.substring(0, 10);
      let weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
      str += "(" + time.substring(11, 16) + "~" + endTime.substring(11, 16) + ")" + "[" + weekDay[sDate.getDay()] + "]";
      row.tag = str;
      return row.tag;
    },
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleBatchDelete() {
      let self = this;
      self.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = "";
        self.checkedData.forEach(item => {
          ids += item.id + ",";
        })
        deleteClassSchedule(ids).then(data => {
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
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    handleDelete(index, row) { },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
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
        case "a":
          self.currentClass = command.class;
          console.log(self.currentClass);
          self.dialogScheduleFormVisible = true;
          break;

        default:
          break;
      }
    }
  },
  components: { SchoolTree, ScheduleForm, ScheduleSimpleForm, DateRange } //注入组件
};
</script>
