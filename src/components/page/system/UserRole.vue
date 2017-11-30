<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统</el-breadcrumb-item>
                <el-breadcrumb-item>员工职能</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column  
            label="角色名" prop="name">
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
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">添加</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
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
        <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
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
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>



<script>
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
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getNotice();
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
    getNotice() {
      let self = this;
      self.loading = true;
      self.$axios
        .post(
          "/organization/getRoleList/" + this.cur_page + "/" + this.page_size
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
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {}
  }
};
</script>
