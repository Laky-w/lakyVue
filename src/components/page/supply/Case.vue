<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.name" clearable  placeholder="xx名称"
                    class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.theType"    clearable placeholder="课程类型" class="handle-select mr10" >
                        <el-option key="1" label="一对一" value="1"></el-option>
                        <el-option key="2" label="一对多" value="2" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.clazzId" multiple  value=1 clearable placeholder="科目" class="handle-select mr10" >
                        <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"></school-tree>
                </el-form-item> -->

                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加课程</el-button>
          <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="课程" prop="name" >
            </el-table-column>
            <el-table-column
            label="科目"
            prop="clazzName">
            </el-table-column>
            <el-table-column
            label="类型"
            prop="theType" :formatter="filterTheType">
            </el-table-column>
            <el-table-column
            label="描述"
            prop="remarks" >
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
        <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
              <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="课程名称"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型" :label-width="formLabelWidth" prop="theType"  :rules="[{ required: true, message: '类型必填'}]">
              <el-select v-model="form.theType" style="width:100%"   placeholder="课程类型" >
                    <el-option  label="一对一" value="1"></el-option>
                    <el-option  label="一对多" value="2" ></el-option>
              </el-select>
              </el-form-item>
              <el-form-item label="科目" :label-width="formLabelWidth" prop="clazzId"  :rules="[{ required: true, message: '科目必填'}]">
                <el-select v-model="form.clazzId" style="width:100%"  placeholder="科目" >
                    <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" :label-width="formLabelWidth" prop="remarks" >
                <el-input v-model="form.remarks"  :rows=5 type="textarea" placeholder="请输入描述信息" ></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
table td {
  line-height: 26px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        name: "",
        theType: "",
        clazzId: []
      },
      parameterValue: [],
      authorityOptions: [],
      form: {
        //表单 v-modle绑定的值
        name: "",
        theType: "2",
        clazzId: "",
        remarks:""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getSchoolId();
    this.getParameterValue(7);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = JSON.parse(sessionStorage.getItem("userInfo"));
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
      self.getAuthorityOptions();
      self.schoolId = user.schoolZoneId;
    },
    getAuthorityOptions() {
      let self = this;
      console.log(self.authorityOptions);
      self.$axios
        .get("organization/getRoleListBySchoolZoneId/" + this.form.schoolZoneId)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            self.authorityOptions = data.data;
          } else {
            self.$message.error(data.data);
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
    getParameterValue(id) {
      let self = this;
      self.$axios
        .get("/organization/findBranchParameterValueAll/" + id)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            self.parameterValue = data.data;
          }
        });
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      self.$axios
        .post(
          "teach/getCourseList/" + this.cur_page + "/" + this.page_size,
          self.queryForm
        )
        .then(res => {
          let data = res.data;
          self.loading = false;
          if (data.code == 200) {
            self.tableData = data.data.list;
            self.total = data.data.total;
          } else {
            self.$message.error(data.data);
          }
        });
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          self.$axios.post("teach/createCourse", this.form).then(res => {
            var data = res.data;
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.dialogFormVisible = false;
              self.getData();
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
    //数据过滤
    filterTheType(value, row) {
      if (value.theType == 1) row.tag = "一对一";
      else row.tag = "一对多";
      return row.tag;
    },
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {},
    handleSchool(data) {
      this.form.schoolName = data.name;
      this.form.schoolZoneId = data.id;
      console.log(this.form.schoolZoneId);
      this.form.roles = [];
      this.getAuthorityOptions();
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
