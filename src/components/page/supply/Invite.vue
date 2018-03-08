<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.studentId" placeholder="邀约人名称/拼音/手机号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="contactStatus">
          <el-select v-model="queryForm.inviteStatus" clearable placeholder="到访状态" class="handle-select mr10">
            <el-option key="1" label="未到访" value="1"></el-option>
            <el-option key="2" label="已到访" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <date-range startPlaceholder="参观时间" v-model="queryForm.contactTime" endPlaceholder="参观时间"></date-range>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==false" type="primary" icon="el-icon-arrow-down" @click="isShowMore=true"></el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==true" type="primary" icon="el-icon-arrow-up" @click="isShowMore=false"></el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="$refs['queryForm'].resetFields();search('queryForm');">重置</el-button>
        <div v-show="isShowMore">
          <el-form-item prop="userName" v-if="$isAuthority('show-all-invite')">
            <el-input v-model="queryForm.userName" placeholder="记录人" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <div style="margin:5px;">
        <el-button type="primary" v-if="$isAuthority('add-invite')" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加邀约记录</el-button>
        <el-button type="success" v-if="$isAuthority('import-invite')" icon="el-icon-download" size="mini">导出信息</el-button>
      </div>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button v-if="$isAuthority('delete-invite')" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteInvite">批量删除</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" @sort-change="handSortChange" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column label="邀约人" sortable="custom" prop="studentName">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="viewId=scope.row.studentId;dialogStudentVisible=true;">{{ scope.row.studentName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="到访时间" sortable="custom" prop="inviteTime">
      </el-table-column>
      <el-table-column label="到访状态" sortable="custom" :formatter="filterInviteStatus" prop="inviteStatus">
      </el-table-column>
      <el-table-column label="记录人" v-if="$isAuthority('show-all-invite')" sortable="custom" prop="userName">
      </el-table-column>
      <el-table-column label="备注" sortable="custom" prop="remarks">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" v-if="$isAuthority('update-invite')" plain size="mini" @click="$refs['inviteForm'].editForm(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <customer-view :view-id="viewId" :dialog-view-visible.sync="dialogStudentVisible"></customer-view>
    <invite-form @saveSuccess="getData" ref="inviteForm" :dialog-form-visible.sync="dialogFormVisible"></invite-form>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script >
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import DateRange from "../../common/Daterange.vue";
import CustomerDialog from "../../common/supply/CustomerDialog";
import InviteForm from "./InviteForm.vue";
import CustomerView from "./CustomerView.vue";
import { getInviteList, deleteInvite } from "../../api/api";
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
      queryForm: {
        userName: "",
        studentId: "",
        contactTime: "",
        inviteStatus: "1",
        schoolZoneId2: []
      },
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
      let falg = this.$isAuthority('show-all-invite');
      if (!falg) self.queryForm.ownerId = self.$user().id; //查询全部用户权限
      self.loading = true;
      getInviteList(
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
    filterInviteStatus(value, row) {
      if (value.inviteStatus == 1) row.tag = "未到访";
      else row.tag = "已到访";
      return row.tag;
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
    handleDeleteInvite() {
      let self = this;
      self.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = "";
        self.checkedData.forEach(item => {
          ids += item.id + ",";
        })
        deleteInvite(ids).then(data => {
          if (data.code == 200) {
            self.getData();
            self.$message.success(data.message);
          } else {
            self.$message.error(data.message);
          }
        })
      }).catch(() => {

      });
    }
  },
  components: { SchoolTree, UserDialog, CustomerDialog, DateRange, InviteForm, CustomerView } //注入组件
};
</script>



