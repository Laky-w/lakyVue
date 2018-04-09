<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item>
        <el-form-item>
          <date-range startPlaceholder="导入时间" v-model="queryForm.contactTime" endPlaceholder="导入时间"></date-range>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
        </el-button-group>
      </el-form>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" @sort-change="handSortChange" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column label="文件名称" sortable="custom" prop="fileName">
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="表格记录总数" sortable="custom" prop="amount">
        <template slot-scope="scope">
          {{scope.row.successNumber+scope.row.errorNumber}}
        </template>
      </el-table-column>
      <el-table-column label="成功行数" sortable="custom" prop="successNumber">
      </el-table-column>
      <el-table-column label="失败行数" sortable="custom" prop="errorNumber">
      </el-table-column>
      <el-table-column label="导入人" sortable="custom" prop="operationName">
      </el-table-column>
      <el-table-column label="导入时间" sortable="custom" prop="theTime">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script >
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import { getImportRecordList } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      checkedData: [],
      dialogFormVisible: false,
      dialogStudentVisible: false,
      isShowMore: false,
      viewId: "",
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {},
      loading: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getSchoolId();
  },
  computed: {},
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.schoolId = user.schoolZoneId;
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
      getImportRecordList(
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

    //控件方法
    handSortChange(column) {
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleSchool(data) {
      this.form.schoolName = data.name;
      this.form.schoolZoneId = data.id;
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleSelectionChange(val) {
      this.checkedData = val;
    },
  },
  components: { SchoolTree, DateRange } //注入组件
};
</script>



