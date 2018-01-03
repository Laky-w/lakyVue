<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item>
                    <el-input v-model="queryForm.className" placeholder="班级名称" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <school-tree :is-show-checkbox=true :the-type="2" place-text="校区"
                                 @handleCheckChange="handleCheckChange"></school-tree>
                </el-form-item>
                <el-form-item>
                  <date-range startPlaceholder="上课日期" v-model="queryForm.startTime" endPlaceholder="上课日期"></date-range>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
                label="校区" prop="schoolZoneName">
            </el-table-column>
            <el-table-column
                label="班级"
                prop="schoolClassName">
            </el-table-column>
            <el-table-column
                label="上课时间" min-width="220px"
                prop="startTime" :formatter="filterScheduleTime">
            </el-table-column>
            <el-table-column
                label="课时"
                prop="hour">
            </el-table-column>
            <el-table-column
                label="教室"
                prop="roomName">
            </el-table-column>

            <el-table-column
                label="主教"
                prop="teachName">
            </el-table-column>
            <el-table-column
                label="助教"
                prop="headTeachName">
            </el-table-column>
            <el-table-column
                label="考勤状态"
                prop="attendanceStatus" :formatter="filterAttendanceStatus">
            </el-table-column>
            <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown  @command="handleCommand">
                <el-button type="primary" size="mini">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{item:'a',class:scope.row}">排课</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
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
import { getClassSchedule } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      dialogScheduleFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        className: "",
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
      getClassSchedule(
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
      let endTime=value.endTime;//2017-01-22
      var fullDate = time.substring(0,10).split("-");
      let sDate=new Date(fullDate[0], fullDate[1]-1, fullDate[2], 0, 0, 0);
      let str= time.substring(0,10);
      let weekDay =["星期日","星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
      str +="("+time.substring(11,16)+"~"+endTime.substring(11,16)+")"+"["+weekDay[sDate.getDay()]+"]";
      row.tag = str;
      return row.tag;
    },
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) { },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
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
  components: { SchoolTree, ScheduleForm, DateRange } //注入组件
};
</script>
