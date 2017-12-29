<template>
  <div class="table">
    <div class="handle-box">
        <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
          <el-form-item >
              <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange" :the-type="2" place-text="校区" ></school-tree>
          </el-form-item>
           <el-form-item >
              <el-select v-model="queryForm.costStatus"   clearable placeholder="缴费状态" class="handle-select mr10" >
                  <el-option  key="1" label="已交齐" value="1"></el-option>
                  <el-option  key="2" label="未交齐" value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <date-range startPlaceholder="下单日期" v-model="queryForm.createTime" endPlaceholder="下单日期"></date-range>
          </el-form-item>
          <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
        </el-form>
    </div>
    <div style="margin:5px;">
      <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加</el-button> -->
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table
        :summary-method="getSummaries"
        show-summary
        :data="tableData" stripe v-loading="loading" border @expand-change="handleExpandChange"
        style="width: 100%">
         <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="order-table-expand" :loading="loadingAccount">
              <el-form-item v-for="(item,index) in props.row.detailList" :label="'明细'+(index+1)+'：'" :key="index" class="detail-content">
                <el-form-item label="课程：">{{item.courseName}}</el-form-item>
                <el-form-item label="班级：">{{item.className}}</el-form-item>
                <el-form-item label="报班类型：">{{item.courseName}}</el-form-item>
                <el-form-item label="课时：">{{item.number}}</el-form-item>
                <el-form-item label="原单价：">{{item.price}}</el-form-item>
                <el-form-item label="折扣：">{{item.discount}}</el-form-item>
                <el-form-item label="售价：">{{item.sellPrice}}</el-form-item>
                <el-form-item label="总价：">{{item.total}}</el-form-item>
                <el-form-item label="减免：">{{item.subtractMoney}}</el-form-item>
                <!-- {{item.name}}：<span style="color:#67c23a">{{item.money}}￥</span> -->
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
        label="学生"
        prop="studentName">
        </el-table-column>
        <el-table-column
        sortable
        label="总额"
        prop="total">
        </el-table-column>
        <el-table-column
        sortable
        label="抹零"
        prop="subtractMoney">
        </el-table-column>
        <el-table-column
        sortable
        label="已交"
        prop="receivable">
        </el-table-column>
        <el-table-column
        sortable
        label="欠费"
        prop="refund" :formatter="filterTotal">
        </el-table-column>
        <el-table-column
        label="下单人"
        prop="userName">
        </el-table-column>
        <el-table-column
        label="下单时间" sortable
        prop="createTime">
        </el-table-column>
        <el-table-column
        label="状态"
        prop="costStatus" :formatter="filterCostStatus">
        </el-table-column>
         <el-table-column
        label="校区"
        prop="schoolZoneName" >
        </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
            @size-change="handleSizeChange"
            @current-change ="handleCurrentChange"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<style >
.order-table-expand {
  font-size: 0;
  min-height: 50px;
}
.order-table-expand label {
  /* width: 90px; */
  color: #99a9bf;
}
.order-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  /* padding-left: 45px; */
  /* width: 100%; */
}
.order-table-expand .detail-content{
  padding-left: 45px;
  width: 100%;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.detail-content .el-form-item {
  padding-left: 15px;
  margin-left: -1px;
  border-right: 1px solid #ebeef5;
  /* border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5; */
}
</style>

<script scoped>
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import { getOrderList, getOrderDetailList } from "../../api/api"
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
        theType: 1,
        createTime: "",
        costStatus: "1",
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
      getOrderList(
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
    getSummaries(param){
      let { columns, data } = param;
        let sums = [];
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '合计';
            return;
          }
          if(column.label=="状态"){
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleExpandChange(row, expandedRows) {
      if (!row.detailList) {
        row.detailList = [];
        let self = this;
        self.loadingAccount = true;
        getOrderDetailList(row.id).then(data => {
          if (data.code == 200) {
            self.loadingAccount = false;
            data.data.forEach(element => {
              row.detailList.push(element);
            });
          }
        })

      }
    },
    filterType(value, row) {
      if (value.theType == 1) {
        row.tag = "缴费"
      } else {
        row.tag = "退费"
      }
      return row.tag;
    },
    filterCostStatus(value, row) {
      if (value.costStatus == 1) {
        row.tag = "已交齐"
      } else {
        row.tag = "未交齐"
      }
      return row.tag;
    },
    filterTotal (value, row) {
      value.refund = value.total.sub(value.receivable).sub(value.subtractMoney);
      // value.refund =30;
      row.tag=value.refund;
      return row.tag;
    },
  },
  components: { SchoolTree, DateRange } //注入组件
}
</script>

