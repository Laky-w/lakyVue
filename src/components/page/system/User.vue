<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统</el-breadcrumb-item>
                <el-breadcrumb-item>教职员工</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
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
                  <el-date-picker
                      v-model="queryForm.theDate" value-format="yyyy-MM-dd"
                      type="daterange" align="center"unlink-panels range-separator="至"
                      start-placeholder="登录日期"
                      end-placeholder="登录日期" :picker-options="pickerOptions2">
                  </el-date-picker>
                </el-form-item>
                <el-form-item >
                   <school-tree  :is-show-checkbox=true :name="form.schoolName"></school-tree>
                </el-form-item>
               
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加员工</el-button>
          <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
            label="校区" prop="schoolZone.name" >
            </el-table-column>
            <el-table-column
            label="用户名"
            prop="userName">
            </el-table-column>
            <el-table-column
            label="真实姓名"
            prop="name">
            </el-table-column>
            <el-table-column
            label="联系方式"
            prop="phone">
            </el-table-column>
            <el-table-column
            label="邮箱"
            prop="email">
            </el-table-column>
            <el-table-column
            label="性别"
            prop="sex">
            </el-table-column>
            <el-table-column
            label="角色"
            prop="phone">
            </el-table-column>
            <el-table-column
            label="出生日期"
            prop="birthday">
            </el-table-column>
            <el-table-column
            label="是否超级用户"
            prop="theStatus">
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
        <el-dialog title="新增员工" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
              <el-form-item label="姓名" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="真实姓名"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.userName"  autofocus placeholder="登录用户名"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="部门" :label-width="formLabelWidth" prop="schoolName"  :rules="[{ required: true, message: '部门必填'}]">
                <school-tree @nodeClick="handleSchool" :name="form.schoolName"></school-tree>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth"  >
                <el-radio-group v-model="form.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="form.phone"  autofocus placeholder="手机号"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="form.email"  autofocus placeholder="邮箱"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="身份证" :label-width="formLabelWidth" prop="idCard">
              <el-input v-model="form.idCard"  autofocus placeholder="身份证"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" :label-width="formLabelWidth" prop="birthday">
                <el-date-picker
                  v-model="form.birthday" style="width: 100%;"
                  type="date" value-format="yyyy-MM-dd"
                  placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="权限" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
                <el-input v-model="form.name"  autofocus placeholder="出生日期"  auto-complete="off"></el-input>
              </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
import SchoolTree from '../../common/SchoolTree1.vue'
export default {
  
  data() {
    return {
      tableData: [],
      treeStructure: true,
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
          userName:'',
          theDate:'',
          theType: ''
      },
      form: {
        name: "",
        userName:"",
        sex:1,
        phone:"",
        email:"",
        birthday:"",
        schoolZoneId:"",
        schoolName:"",
        idCard:""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    pickerOptions2: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
            }
        }]
    },
    getUser() {
      let self = this;
      self.loading = true;
      self.$axios
        .post("organization/getUserList/" + this.cur_page + "/" + this.page_size)
        .then(res => {
          let data = res.data;
          self.loading = false;
          if (data.code == 200) {
            self.tableData = data.data.list;
            self.total=data.data.total;
          } else {
            self.$message.error(data.data);
          }
        });
    },
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          self.$axios
            .post("organization/createUser", this.form)
            .then(res => {
              var data = res.data;
              if (data.code == 200) {
                self.loadingForm = false;
                self.$message.success(data.message);
                self.dialogFormVisible = false;
                self.getUser();
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
    filterType(value, row) {
      if (value.theType == 1) row.tag = "总校";
      else if (value.theType == 2) row.tag = "分校";
      else row.tag = "部门";
      return row.tag;
    },
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getUser();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getUser();
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {},
    handleSchool(data){
      this.form.schoolName=data.name;
      this.form.schoolZoneId=data.id;
    }
  },
  components: {SchoolTree}
};
</script>