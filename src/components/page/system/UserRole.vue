<template>
  <div class="table">
    <!-- 筛选条件创建用户和角色名 -->
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="职能名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="$refs['authority'].openDialog()">添加职能
      </el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border style="width: 100%">
      <el-table-column label="职能名" prop="name">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column label="描述" prop="remarks">
      </el-table-column>
      <el-table-column label="创建用户" prop="createUser.name">
      </el-table-column>
      <el-table-column label="校区" prop="schoolZone.name">
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <authority ref="authority"></authority>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import Authority from "./Authority.vue";
import { getRoleList, deleteRole, getRoleDetail } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 50,
      form: {
        schoolId: "",
        theType: 2,
        userId: "",
        createDatetime: "",
        content: "",
        lastDatetime: ""
      },
      queryForm: {
        name: "",
        schoolZoneId2: []
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //分页方法start
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    //分页方法结束
    search(form) {
      //搜索方法
      this.cur_page = 1;
      this.getData();
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      getRoleList(self.cur_page, self.page_size, self.queryForm).then(data => {
        self.loading = false;
        if (data.code == 200) {
          self.total = data.data["total"];
          self.tableData = data.data.list;
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    //控件方法
    handleEdit(index, row) {
      this.$refs["authority"].openEditDialog(row.id);
    },
    handleDelete(index, row) {
      let self = this;
      self.$confirm('确定删除该职能吗，删除后拥有该职能的教师对应的职能也会消失，请谨慎操作！是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        deleteRole(row.id).then(data => {
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
      this.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        this.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree, Authority } //注入组件
};
</script>
