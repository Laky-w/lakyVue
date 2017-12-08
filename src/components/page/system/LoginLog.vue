<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.userName"  placeholder="用户名" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.theType"   value=1 clearable placeholder="登录类型" class="handle-select mr10" >
                        <el-option key="1" label="登录" value="1"></el-option>
                        <el-option key="2" label="退出" value="2"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item >
                    <!-- <el-date-picker
                        v-model="queryForm.theDate" value-format="yyyy-MM-dd"
                        type="daterange" align="center"unlink-panels range-separator="至"
                        start-placeholder="登录日期"
                        end-placeholder="登录日期" :picker-options="pickerOptions2">
                    </el-date-picker> -->
                    <date-range startPlaceholder="登录日期" v-model="queryForm.theDate" endPlaceholder="结束日期" ></date-range>
                 </el-form-item>
                 <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"></school-tree>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <el-table :data="tableData"  v-loading="loading" :row-class-name="tableRowClassName" border stripe style="width: 100%" >
            <el-table-column prop="user.name" label="用户名" sortable width="150">
            </el-table-column>
            <el-table-column prop="ip" label="登录IP" width="120">
            </el-table-column>
            <el-table-column prop="schoolZone.name" label="校区" >
            </el-table-column>
            <el-table-column prop="theType" label="操作" :formatter="filterType">
            </el-table-column>
            <el-table-column prop="theDatetime" sortable label="登录时间" >
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change ="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totol">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import SchoolTree from "../../common/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
export default {
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      totol: 0,
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
      }
    }
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
      self.$axios
        .post(
          "log/findLoginLog/" + this.cur_page + "/" + this.page_size,
          this.queryForm
        )
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            self.totol = data.data["total"];
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
      if (value.theType == 1) row.tag = "登录";
      else row.tag = "退出";
      return row.tag;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
  }//注入组件
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

