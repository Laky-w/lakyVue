<template>
  <div class="table">
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="姓名" sortable="custom" prop="studentName">
        <template slot-scope="scope">
          {{scope.row.studentName}}
        </template>
      </el-table-column>
      <el-table-column label="电话" sortable="custom" prop="phone">
      </el-table-column>
      <el-table-column label="性别" sortable="custom" prop="sex" :formatter="filterSex">
      </el-table-column>
      <el-table-column label="入班时间" sortable="custom" prop="createTime">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getWaitStudentList,
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        classId: "",
        classStatus: 1
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
    //加载数据
    getData(viewId) {
      let self = this;
      self.loading = true;
      self.queryForm.classId = viewId;
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
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
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
