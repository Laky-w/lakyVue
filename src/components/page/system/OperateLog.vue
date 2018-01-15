<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.userName" clearable placeholder="用户名" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.theType" value=1 clearable placeholder="操作类型" class="handle-select mr10">
            <el-option label="增加" value="1"></el-option>
            <el-option label="删除" value="2"></el-option>
            <el-option label="修改" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <date-range startPlaceholder="操作日期" v-model="queryForm.theDate" endPlaceholder="操作日期"></date-range>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading="loading" :row-class-name="tableRowClassName" border stripe @sort-change="handSortChange" style="width: 100%">
      <el-table-column prop="userName" sortable="custom" label="用户名">
      </el-table-column>
      <el-table-column prop="schoolZoneName" sortable="custom" label="操作校区">
      </el-table-column>
      <el-table-column prop="theType" sortable="custom" label="操作" :formatter="filterType">
      </el-table-column>
      <el-table-column prop="title" sortable="custom" label="标题">
      </el-table-column>
      <el-table-column prop="content" sortable="custom" label="内容" min-width="150">
      </el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="操作时间">
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
import { findOperateLogAll } from "../../api/api";
export default {
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      queryForm: {
        userName: "",
        theDate: "",
        theType: "",
        schoolZoneId2: []
      },
      loading: true
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      let self = this;
      self.loading = true;
      findOperateLogAll(
        self.cur_page,
        self.page_size,
        self.queryForm
      ).then(data => {
        if (data.code == 200) {
          self.total = data.data["total"];
          self.tableData = data.data.list;
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.theType == 2) {
        return "warning-row";
      }
      return "";
    },
    search(form) {
      this.cur_page = 1;
      this.getData();
    },
    formatter(row, column) {
      return row.address;
    },
    filterType(value, row) {
      if (value.theType == 1) row.tag = "增加";
      else if (value.theType == 2) row.tag = "删除";
      else if (value.theType == 3) row.tag = "修改";
      return row.tag;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handSortChange(column, prop, order) {
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleCheckChange(allNode) {
      this.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        this.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: {
    SchoolTree,
    DateRange
  } //注入组件
};
</script>
<style type="text/css">
.el-table .warning-row td {
  background: oldlace !important;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style scoped>

</style>
