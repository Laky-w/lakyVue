<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.userName" clearable placeholder="用户名" class="handle-input mr10"></el-input>
                </el-form-item>
                <!-- <el-form-item >
                    <el-select v-model="queryForm.theType"   value=1 clearable placeholder="登录类型" class="handle-select mr10" >
                        <el-option key="1" label="登录" value="1"></el-option>
                        <el-option key="2" label="退出" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item >
                   <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"></school-tree>
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
            prop="sex" :formatter="filterSex">
            </el-table-column>
            <el-table-column
            label="电话号"
            prop="phone">
            </el-table-column>
            <el-table-column
            label="出生日期"
            prop="birthday">
            </el-table-column>
            <el-table-column
            label="职能"
            prop="isSuper" :formatter="filterIsSuper">
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
                <school-tree @nodeClick="handleSchool" :name="form.schoolName" :default-value="schoolId"></school-tree>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth" prop="sex"  :rules="[{ required: true, message: '必选项'}]">
                <el-radio-group v-model="form.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="超级管理员" :label-width="formLabelWidth" prop="isSuper" :rules="[{ required: true, message: '必选项'}]" >
                <el-radio-group v-model="form.isSuper">
                  <el-radio :label="2">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="职能" :label-width="formLabelWidth" prop="roles" :rules="[{ required: (form.isSuper==2), message: '必选项'}]">
                <el-select
                    :disabled="form.isSuper==1"
                    v-model="form.roles"
                    multiple no-data-text ="该部门没有职能，请添加。"
                    collapse-tags
                    placeholder="请选择权限" style="width:100%">
                    <el-option
                        v-for="item in authorityOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
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
        userName: "",
        theDate: "",
        theType: "",
        schoolZoneId2: []
      },
      authorityOptions: [],
      form: {
        //表单 v-modle绑定的值
        name: "",
        userName: "",
        sex: 1,
        phone: "",
        email: "",
        isSuper: 2,
        birthday: "",
        schoolZoneId: "",
        schoolName: "",
        idCard: "",
        roles: []
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getUser();
    this.getSchoolId();
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
      this.getUser();
    },
    //分页方法结束
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getUser();
    },
    search(form) { //搜索方法
      this.cur_page = 1;
      this.getUser();
    },
    //加载数据
    getUser() {
      let self = this;
      self.loading = true;
      self.$axios
        .post(
          "organization/getUserList/" + this.cur_page + "/" + this.page_size,self.queryForm
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
          self.$axios.post("organization/createUser", this.form).then(res => {
            var data = res.data;
            self.loadingForm = false;
            if (data.code == 200) {
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
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
      return row.tag;
    },
    filterIsSuper(value, row) {
      if (value.isSuper == 1) row.tag = "超级管理员";
      else row.tag = "普通用户";
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
      self.queryForm.schoolZoneId2=[];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
