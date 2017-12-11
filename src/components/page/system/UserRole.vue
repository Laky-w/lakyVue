<template>
    <div class="table">
        <!-- 筛选条件创建用户和角色名 -->
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.name"  placeholder="职能名称" clearable class="handle-input mr10"></el-input>
                </el-form-item>
                 <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"></school-tree>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$router.push('/authority1');">添加职能</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="职能名" prop="name">
            </el-table-column>
            <el-table-column
            label="创建时间"
            prop="createTime">
            </el-table-column>
            <el-table-column
            label="创建用户"
            prop="createUser.name">
            </el-table-column>
            <el-table-column
            label="校区"
            prop="schoolZone.name">
            </el-table-column>
            <!-- <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">添加</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column> -->
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
        <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="userName"  :rules="[{ required: true, message: '名称必填'}]">
            <el-input v-model="form.name"  autofocus placeholder="名称"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" required>
                <el-radio-group v-model="form.theType">
                    <el-radio :label="2">校区</el-radio>
                    <el-radio :label="3">部门</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="编号" prop="serial" :label-width="formLabelWidth">
            <el-input v-model="form.serial" placeholder="内部编号"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
            <el-input v-model="form.address" placeholder="地址"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="职能" prop="remarks" :label-width="formLabelWidth">
            <el-input v-model="form.remarks" placeholder="描述、职能"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="owner" :label-width="formLabelWidth">
            <el-input v-model="form.owner" auto-complete="off" placeholder="负责人"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
            <el-input v-model="form.phone" auto-complete="off" placeholder="联系方式"></el-input>
            </el-form-item>
            <el-form-item label="上级部门" :label-width="formLabelWidth"><el-input v-model="form.fatherName" disabled></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </div>
        </el-dialog>
    </div>
</template>



<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
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
    search(form) { //搜索方法
      this.cur_page = 1;
      this.getData();
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      self.$axios
        .post(
          "/organization/getRoleList/" + this.cur_page + "/" + this.page_size,self.queryForm
        )
        .then(res => {
          let data = res.data;
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
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {},
    handleCheckChange(allNode) {
      this.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        this.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
