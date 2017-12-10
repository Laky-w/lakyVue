<template>
<!-- 标题路径 -->
<div class="table" style="height: 90%;">
  <!-- 添加公共参数,导出div -->
  <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加公共参数</el-button>
  </div>
  <!-- 公共参数页面 -->
  <el-container style="height: 100%; border: 1px solid #eee">
    <!-- 公共参数侧边栏 -->
    <el-aside width="200px" style="background-color:#fff9e7">
    <p v-for="(space, levelIndex) in parameterData" @click="parameterChange(levelIndex,space)"
    :class="{active: activeIndex==levelIndex}">{{space.name}}</p>
    </el-aside>
    <el-container>
      <!-- 公共参数表格信息 -->
      <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="创建人" prop="createUser.name">
            </el-table-column>
            <el-table-column
            label="名称"
            prop="name">
            </el-table-column>
            <el-table-column
            label="排序"
            prop="sort" sortable>
            </el-table-column>
        </el-table>
    </el-container>
  </el-container>
<!-- 添加悬浮表单 -->
<el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="400px">
          <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
              <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="自定义名称"  auto-complete="off"></el-input>
              </el-form-item>
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
      formTitle:"",
      parameterData: [],
      dialogFormVisible: false,
      tableData: [],
      activeIndex: 0,
      form: {
        name:"",
        parameterId:"",
        sort:"2"
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
      self.$axios.get("/organization/findBranchParameterByType/2").then(res => {
        let data = res.data;
        if (data.code == 200) {
          data.data.forEach(element => {
            element.active = false;
          });
          self.parameterData = data.data;
        //   self.parameterData[0].active=true;
          self.formTitle="添加参数--"+data.data[0].name;

          self.getParameterValue(data.data[0].id);
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    getParameterValue(id) {
      let self = this;
      self.form.parameterId=id;
      self.loading = true;
      self.$axios
        .get("/organization/findBranchParameterValueAll/" + id)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            self.tableData = data.data;
            self.loading = false;
          } else {
            self.$message.error(data.data);
          }
        });
    },
    parameterChange(level, obj) {
      this.activeIndex = level;
      this.formTitle="添加参数--"+obj.name;
      this.getParameterValue(obj.id);
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {

    },
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.form.sort=self.tableData.length+1;
          self.loadingForm = true;
          self.$axios
            .post("organization/createBranchParameterValue", this.form)
            .then(res => {
              var data = res.data;
              if (data.code == 200) {
                self.loadingForm = false;
                self.$message.success(data.message);
                self.dialogFormVisible = false;
                self.getParameterValue(self.form.parameterId);
                self.$refs[formName].resetFields();
              } else {
                this.$message.error(data.data);
              }
            });
        } else {
          return false;
        }
      });
    },
  }
};
</script>

<style scoped>
p {
  height: 50px;
  line-height: 50px;
  width: 185px;
  margin: 5px 0px;
  padding-left: 15px;
  cursor: pointer;
  font-size: 14px;
}
p:first-child {
  margin-top: 0px;
}
p:hover {
  background-color: #71afef;
  color: white;
}
p.active {
  background-color: #66b1ff;
  color: white;
}
</style>
