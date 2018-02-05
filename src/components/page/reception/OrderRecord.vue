<template>
  <el-dialog title="收支记录" :visible.sync="visible" :close-on-click-modal="false">
    <el-table :data="tableData" stripe v-loading="loading" border @expand-change="handleExpandChange" @sort-change="handSortChange" style="width: 100%">
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
      <el-table-column label="抹零" sortable="custom" prop="subtractMoney">
      </el-table-column>
      <el-table-column label="缴费时间" sortable="custom" prop="createTime" min-width="150px">
      </el-table-column>
      <el-table-column label="收费人" sortable="custom" prop="salesmanName">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { getMoneyRecordList, getMoneyRecordAccountList } from "../../api/api"
export default {
  data() {
    return {
      visible: false,
      loadingAccount: false,
      loading: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        orderId: 0,
        sort: {}
      }
    }
  },
  methods: {
    //分页方法结束
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    openDialog(id) {
      let self = this;
      self.visible = true;
      self.queryForm.orderId = id;
      self.getData();
    },
    getData() {
      let self = this;
      self.visible = true;
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
    filterCheckStatus(value, row) {
      if (value.checkStatus == 1) {
        row.tag = "未审核"
      } else if (value.checkStatus == 2) {
        row.tag = "审核成功"
      } else if (value.checkStatus == 3) {
        row.tag = "审核失败"
      }
      return row.tag;
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
  }
}
</script>

