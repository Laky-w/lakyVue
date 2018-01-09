<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="姓名/拼音/电话" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加生源</el-button> -->
      <customer-form @saveSuccess="saveSuccess" ref="customerForm"></customer-form>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border style="width: 100%">
      <el-table-column label="名称" fixed>
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="性别" prop="sex" :formatter="filterSex">
      </el-table-column>
      <el-table-column label="联系电话" prop="phone">
      </el-table-column>
      <el-table-column label="联系人" prop="contactId">
      </el-table-column>
      <el-table-column label="负责人" prop="ownerId">
      </el-table-column>
      <el-table-column label="来源活动" prop="sourceId">
      </el-table-column>
      <el-table-column label="分配状态" prop="allotStatus" :formatter="filterAllotStatus">
      </el-table-column>
      <el-table-column label="邀约状态" prop="inviteStatus" :formatter="filterInviteStatus">
      </el-table-column>
      <el-table-column label="跟进状态" prop="contactStatus" :formatter="filterContactStatus">
      </el-table-column>
      <el-table-column label="意向课程" prop="intentionCourseName">
      </el-table-column>
      <el-table-column label="最后修改时间" sortable prop="createTime">
      </el-table-column>
      <!-- <el-table-column sortable label="备注" prop="remarks" min-width="180px">
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="hadleCommand" size="small">
            修改
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.isSuper!==1&&scope.row.quitStatus==1" :command="{row:scope.row,type:'quit'}">新建联系记录</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.isSuper!==1&&scope.row.quitStatus==2" :command="{row:scope.row,type:'sealup'}">邀约</el-dropdown-item>
              <el-dropdown-item :command="{row:scope.row,type:'delete'}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <customer-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></customer-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import CustomerForm from "./CustomerForm.vue";
import CustomerView from "./CustomerView.vue";
import {
  getCustomerList,
  findBranchParameterValueAll,
  deleteCustomer
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",//详情id
      dialogViewVisible: false,
      queryForm: {
        name: "",
        schoolZoneId2: []
      },
      parameterValue: [],
      loading: false,
    };
  },
  created() {
    this.getData();
    this.getParameterValue(3);
  },
  computed: {
    //实时计算
  },
  methods: {
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
        }
      });
    },
    //初始化属性end
    //分页方法start
    handleSizeChange(val) {
      console.log(this.page_size);
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
      getCustomerList(
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
    saveSuccess(data) {
      this.getData();
    },
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
      return row.tag;
    },
    filterAllotStatus(value, row) {
      if (value.allotStatus == 1) row.tag = "未分配";
      else row.tag = "已分配";
      return row.tag;
    },
    filterInviteStatus(value, row) {
      if (value.inviteStatus == 1) row.tag = "未邀约";
      else row.tag = "已邀约";
      return row.tag;
    },
    filterContactStatus(value, row) {
      if (value.contactStatus == 1) row.tag = "未跟进";
      else row.tag = "已跟进";
      return row.tag;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
      // self.$refs["view"].show();
    },
    hadleCommand(command) {
      switch (command.type) {
        case "delete": //删除
          this.handleDelete(command.row);
          break;
        case "quit": //离职
          this.handleQuit(command.row);
          break;
        case "sealup":
          this.handleSealup(command.row);
          break;
      }
    },
    //控件方法
    handleEdit(index, row) {
      let self = this;
      self.$refs["customerForm"].handleEditOpenDialog(row.id);
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('确定删除该员工信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        console.log(row);
        deleteCustomer(row.id, { name: row.name }).then(data => {
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { CustomerForm, CustomerView, SchoolTree } //注入组件
};
</script>
