<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="姓名/拼音/电话" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>
        <el-form-item prop="contactStatus">
          <el-select v-model="queryForm.contactStatus" clearable placeholder="状态" class="handle-select mr10">
            <el-option key="1" label="未跟进" value="1"></el-option>
            <el-option key="2" label="已跟进" value="2"></el-option>
            <el-option key="3" label="已放弃" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==false" type="primary" icon="el-icon-arrow-down" @click="isShowMore=true"></el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==true" type="primary" icon="el-icon-arrow-up" @click="isShowMore=false"></el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="refresh('queryForm')">重置</el-button>
        <div v-show="isShowMore">
          <el-form-item style="width:178px" prop="sex">
            <el-radio-group v-model="queryForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="allotStatus">
            <el-select v-model="queryForm.allotStatus" clearable placeholder="分配状态" class="handle-select mr10">
              <el-option key="1" label="未分配" value="1"></el-option>
              <el-option key="2" label="已分配" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="inviteStatus">
            <el-select v-model="queryForm.inviteStatus" clearable placeholder="邀约状态" class="handle-select mr10">
              <el-option key="1" label="未邀约" value="1"></el-option>
              <el-option key="2" label="已邀约" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="theType">
            <el-select v-model="queryForm.theType" clearable placeholder="转换状态" class="handle-select mr10">
              <el-option key="1" label="生源" value="1"></el-option>
              <el-option key="9" label="正式学员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="意向级别" label-width="120px" prop="intentionLevel">
            <el-rate v-model="queryForm.intentionLevel" :texts="['没意向', '观望', '一般', '考虑', '极高']" show-text :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
            </el-rate>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <el-button v-if="$isAuthority('add-customer')" type="primary" icon="el-icon-edit" size="mini" @click="$refs['customerForm'].handleOpenDialog()">添加生源</el-button>
      <el-button v-if="$isAuthority('import-customer')" type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button v-if="$isAuthority('allort-customer')" type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">批量修改</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" @sort-change="handSortChange" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column label="名称" sortable="custom" prop="name" fixed>
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="性别" sortable="custom" prop="sex" :formatter="filterSex">
      </el-table-column>
      <el-table-column label="联系电话" sortable="custom" prop="phone">
      </el-table-column>
      <el-table-column label="联系人" sortable="custom" prop="contactName">
      </el-table-column>
      <el-table-column label="负责人" sortable="custom" prop="ownerName" v-if="$isAuthority('show-all-customer')">
      </el-table-column>
      <el-table-column label="来源活动" sortable="custom" prop="sourceName">
      </el-table-column>
      <el-table-column label="沟通次数" sortable="custom" prop="contactNumber">
        <template slot-scope="scope">
          <a v-if="$isAuthority('contant-customer')" href="javascript:void(0)" @click="handleContact(scope.row)">{{scope.row.contactNumber}}</a>
          <span v-if="!$isAuthority('contant-customer')">{{scope.row.contactNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="转换状态" sortable="custom" prop="theType" :formatter="filterTheType">
      </el-table-column>
      <!-- <el-table-column label="分配状态" prop="allotStatus" :formatter="filterAllotStatus">
      </el-table-column> -->
      <!-- <el-table-column label="邀约状态" sortable="custom" prop="inviteStatus" :formatter="filterInviteStatus">
      </el-table-column> -->
      <el-table-column label="状态" sortable="custom" prop="contactStatus" :formatter="filterContactStatus">
      </el-table-column>
      <el-table-column label="意向级别" sortable="custom" prop="intentionLevel" min-width="160px">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.intentionLevelInt" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="意向课程" sortable="custom" prop="intentionCourseName">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime" min-width="120px">
      </el-table-column>
      <!-- <el-table-column sortable label="备注" prop="remarks" min-width="180px">
      </el-table-column> -->
      <el-table-column label="操作" min-width="110px">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="hadleCommand" size="small">
            {{$isAuthority('inivte-customer')?'修改':'操作'}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-show="$isAuthority('inivte-customer')" :command="{row:scope.row,type:'invite'}">邀约</el-dropdown-item>
              <el-dropdown-item v-show="$isAuthority('delete-customer')" v-if="scope.row.theType!=9" :command="{row:scope.row,type:'delete'}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <customer-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></customer-view>
    <customer-form @saveSuccess="getData" :dialog-form-visible.sync="dialogFormVisible" ref="customerForm"></customer-form>
    <contact-form :student-add-id="studentId" @saveSuccess="getData" :studnet-name="studentName" :the-type="2" :dialog-form-visible.sync="dialogContactVisible"></contact-form>
    <invite-form :student-add-id="studentId" @saveSuccess="getData" :studnet-name="studentName" :the-type="2" :dialog-form-visible.sync="dialogInviteVisible"></invite-form>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import CustomerForm from "./CustomerForm.vue";
import InviteForm from "./InviteForm.vue";
import CustomerView from "./CustomerView.vue";
import ContactForm from "./ContactForm.vue";
import {
  getCustomerList,
  findBranchParameterValueAll,
  deleteCustomer
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      checkedData: [],
      isShowMore: false,//显示更多查询条件
      total: 0,
      cur_page: 1,
      page_size: 20,
      viewId: "",//详情id
      studentId: "",
      studentName: "",
      dialogFormVisible: false,
      dialogViewVisible: false,
      dialogContactVisible: false,
      dialogInviteVisible: false,
      queryForm: {
        name: "",
        schoolZoneId2: [],
        sex: "",
        allotStatus: "",
        inviteStatus: "",
        contactStatus: "",
        intentionLevel: 0,
        theType: "1",
        sort: {}
      },
      parameterValue: [],
      loading: false,
      intentionLevel: 5
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
    refresh(form) {
      this.$refs[form].resetFields();
      this.search(form);
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      let falg = this.$isAuthority('show-all-customer');
      if (!falg) self.queryForm.ownerId = self.$user().id; //查询全部用户权限
      getCustomerList(
        self.cur_page,
        self.page_size,
        self.queryForm
      ).then(data => {
        self.loading = false;
        if (data.code == 200) {
          self.tableData = data.data.list;
          self.tableData.forEach(item => {
            item.intentionLevelInt = Number(item.intentionLevel);
          })
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
      else if (value.contactStatus == 2) row.tag = "已跟进";
      else row.tag = "已放弃";
      return row.tag;
    },
    filterTheType(value, row) {
      if (value.theType == 1) row.tag = "生源";
      else row.tag = "正式学员";
      return row.tag;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
      // self.$refs["view"].show();
    },
    handleContact(row) {
      let self = this;
      self.studentId = row.id;
      self.studentName = row.name;
      self.dialogContactVisible = true;
    },
    hadleCommand(command) {
      switch (command.type) {
        case "delete": //删除
          this.handleDelete(command.row);
          break;
        case "invite"://邀约
          this.handleInvite(command.row);
          break;
      }
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
    //控件方法
    handleEdit(index, row) {
      if (this.$isAuthority('inivte-customer')) {
        let self = this;
        self.$refs["customerForm"].handleEditOpenDialog(row.id);
      }
    },
    handleInvite(row) {
      let self = this;
      self.studentId = row.id;
      self.studentName = row.name;
      self.dialogInviteVisible = true;
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('确定删除该生源信息吗?', '提示', {
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
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { CustomerForm, CustomerView, ContactForm, InviteForm, SchoolTree } //注入组件
};
</script>
