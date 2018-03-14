<template>
  <el-dialog title="上课记录" :visible.sync="visible" :close-on-click-modal="false">
    <div class="table">
      <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
        <el-table-column label="姓名" sortable="custom" prop="studentName">
          <template slot-scope="scope">
            {{scope.row.studentName}}
          </template>
        </el-table-column>
        <el-table-column label="电话" sortable="custom" prop="phone">
        </el-table-column>
        <el-table-column label="考勤状态" sortable="custom" prop="attendanceStatus" :formatter="filterAttendanceStatus">
        </el-table-column>
        <el-table-column label="考勤时间" sortable="custom" prop="theTime">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getStudentAttendanceAll,
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      visible: false,
      queryForm: {
        scheduleId: "",
      },
      loading: false,
    };
  },
  created() {
    this.getData(this.viewId);
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
    handleOpenDialog(scheduleId) {
      this.queryForm.scheduleId = scheduleId;
      this.getData();
      this.visible = true;
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
          row.tag = "签到";
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
  },
  props: {
    viewId: ""
  },
};
</script>
