<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.theType" clearable placeholder="收费类型" class="handle-select mr10">
            <el-option key="1" label="缴费" value="1"></el-option>
            <el-option key="2" label="退费" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="queryForm.checkStatus" clearable placeholder="审核状态" class="handle-select mr10">
            <el-option key="1" label="未审核" value="1"></el-option>
            <el-option key="2" label="已审核" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <date-range startPlaceholder="费用日期" v-model="queryForm.createTime" endPlaceholder="费用日期"></date-range>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加流水</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe :summary-method="getSummaries" show-summary v-loading="loading" border @expand-change="handleExpandChange" @sort-change="handSortChange" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" :loading="loadingAccount">
            <el-form-item v-for="(item,index) in props.row.recordAccount" :key="index">
              {{item.name}}：
              <span style="color:#67c23a">{{item.money}}￥</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="收费类型" sortable="custom" prop="theType" :formatter="filterType">
      </el-table-column>
      <el-table-column label="审核状态" sortable="custom" prop="checkStatus" :formatter="filterCheckStatus">
      </el-table-column>
      <el-table-column label="金额" sortable="custom" prop="money">
      </el-table-column>
      <el-table-column label="缴费时间" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="收费人" sortable="custom" prop="salesmanName">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<style >
.demo-table-expand {
  font-size: 0;
  min-height: 50px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  padding-left: 45px;
  width: 20%;
}
</style>

<script scoped>
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import { getMoneyRecordList, getMoneyRecordAccountList } from "../../api/api"
export default {
  data() {
    return {
      loadingAccount: false,
      loading: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        schoolZoneId2: [],
        theType: "",
        checkStatus: 2,
        createTime: ""
      }
    }
  },
  created() {
    this.getData();
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
    getData() {
      let self = this;
      self.loading = true;
      getMoneyRecordList(
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleExpandChange(row, expandedRows) {
      if (!row.recordAccount) {
        row.recordAccount = [];
        let self = this;
        self.loadingAccount = true;
        getMoneyRecordAccountList(row.id).then(data => {
          if (data.code == 200) {
            self.loadingAccount = false;
            data.data.forEach(element => {
              row.recordAccount.push({ name: element.accountName, money: element.money });
            });
            console.log(row, expandedRows);
          }
        })

      }
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (column.label == "收费类型" || column.label == "审核状态") {
          sums[index] = '';
          return;
        }
        let values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            let value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev).add(value);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
    filterType(value, row) {
      if (value.theType == 1) {
        row.tag = "缴费"
      } else {
        row.tag = "退费"
      }
      return row.tag;
    },
    filterCheckStatus(value, row) {
      if (value.checkStatus == 1) {
        row.tag = "未审核"
      } else {
        row.tag = "已审核"
      }
      return row.tag;
    }
  },
  components: { SchoolTree, DateRange } //注入组件
}
</script>

