<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="studentName">
          <el-input v-model="queryForm.studentName" clearable placeholder="联系人名称/拼音/手机号" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <el-input v-model="queryForm.content" clearable placeholder="联系内容" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="contactTime">
          <date-range startPlaceholder="联系时间" v-model="queryForm.contactTime" endPlaceholder="联系时间"></date-range>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==false" type="primary" icon="el-icon-arrow-down" @click="isShowMore=true"></el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==true" type="primary" icon="el-icon-arrow-up" @click="isShowMore=false"></el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="$refs['queryForm'].resetFields();search('queryForm');">重置</el-button>
        <div v-show="isShowMore">
          <el-form-item v-if="$isAuthority('show-all-contact')">
            <el-input v-model="queryForm.userName" clearable placeholder="记录人 " class="handle-input mr10 "></el-input>
          </el-form-item>
          <el-form-item>
            <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange " :the-type="2 " place-text="校区 "></school-tree>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.contactStyleId" clearable placeholder="联系方式" style="width: 100%" class="handle-select mr10">
              <el-option v-for="(item,index) in parameterValue " :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <el-button type="primary" v-if="$isAuthority('add-contact')" icon="el-icon-edit" size="mini" @click="dialogContactVisible=true ">添加沟通记录</el-button>
      <el-button type="success" v-if="$isAuthority('import-contact')" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button v-if="$isAuthority('delete-contact')" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteInvite">批量删除</el-button>
    </div>
    <el-table :data="tableData" @sort-change="handSortChange" @selection-change="handleSelectionChange" stripe v-loading="loading" border style="width: 100%">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column label="联系人" sortable="custom" prop="studentName">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="viewId=scope.row.studentId;dialogStudentVisible=true;">{{ scope.row.studentName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="记录人" v-if="$isAuthority('show-all-contact')" sortable="custom" prop="userName">
      </el-table-column>
      <el-table-column label="联系时间" sortable="custom" prop="contactTime">
      </el-table-column>
      <el-table-column label="联系内容" sortable="custom" prop="content">
      </el-table-column>
      <el-table-column label="联系方式" sortable="custom" prop="contactStyleId">
      </el-table-column>
      <el-table-column label="操作 ">
        <template slot-scope="scope ">
          <el-button type="primary" v-if="$isAuthority('update-contact')" plain size="mini" @click="$refs['contactForm'].editForm(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <customer-view :view-id="viewId" :dialog-view-visible.sync="dialogStudentVisible"></customer-view>
    <contact-form @saveSuccess="getData" ref="contactForm" :dialog-form-visible.sync="dialogContactVisible"></contact-form>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import DateRange from "../../common/Daterange.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import CustomerView from "./CustomerView.vue";
import ContactForm from "./ContactForm.vue";
import {
  findBranchParameterValueAll,
  getContactList,
  deleteContent
} from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      checkedData: [],
      dialogContactVisible: false,
      dialogStudentVisible: false,
      isShowMore: false,
      viewId: "",//详情id
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      queryForm: {
        schoolZoneId2: [],
        userName: "",
        contactTime: [],
        content: "",
        studentName: "",
        contactStyleId: "",
      },
      loading: false,
    };
  },
  created() {
    this.getData();
    this.getParameterValue(8);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
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
      let falg = self.$isAuthority('show-all-contact');
      if (!falg) self.queryForm.userId = self.$user().id; //查询全部用户权限
      getContactList(
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
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    handSortChange(column, prop, order) {//排序方法
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleEdit(index, row) { },
    handleDelete(index, row) { },
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
        deleteContent(ids).then(data => {
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
  components: {
    DateRange,
    UserDialog,
    CustomerView,
    SchoolTree,
    ContactForm
  } //注入组件
};
</script>
