<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.userName" placeholder="用户名" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.quitStatus" clearable placeholder="在职状态" class="handle-select mr10">
            <el-option key="1" label="在职" value="1"></el-option>
            <el-option key="2" label="离职" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleAdd">添加员工</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border style="width: 100%">
      <el-table-column label="用户名" prop="userName">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.userName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区/部门" prop="schoolName">
      </el-table-column>
      <el-table-column label="真实姓名" prop="name">
      </el-table-column>
      <el-table-column label="邮箱" prop="email">
      </el-table-column>
      <el-table-column label="性别" prop="sex" :formatter="filterSex">
      </el-table-column>
      <el-table-column label="状态" prop="quitStatus">
        <template slot-scope="scope">
          <!-- {{scope.row.theType}} -->
          <el-tag :type="scope.row.quitStatus === 2 ? 'info' : 'success'" close-transition>
            {{scope.row.quitStatus===1?"在职":""}}{{scope.row.quitStatus===2?"离职":""}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone">
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday">
      </el-table-column>
      <el-table-column label="职能" prop="isSuper" :formatter="filterIsSuper">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="hadleCommand" size="small">
            修改
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.isSuper!==1&&scope.row.quitStatus==1" :command="{row:scope.row,type:'quit'}">离职</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.isSuper!==1&&scope.row.quitStatus==2" :command="{row:scope.row,type:'sealup'}">恢复入职</el-dropdown-item>
              <el-dropdown-item :command="{row:scope.row,type:'delete'}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <user-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></user-view>
    <el-dialog title="添加员工" width="750px" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm" :inline="true" size="small">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '名称必填'}]">
          <el-input v-model="form.name" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName" :rules="[{ required: true, message: '名称必填'}]">
          <el-input v-model="form.userName" placeholder="登录用户名"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" prop="schoolName" :rules="[{ required: true, message: '部门必填'}]">
          <school-tree @nodeClick="handleSchool" :name="form.schoolName" :default-value="form.schoolZoneId"></school-tree>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex" :rules="[{ required: true, message: '必选项'}]">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="超级管理员" :label-width="formLabelWidth" prop="isSuper" :rules="[{ required: true, message: '必选项'}]">
          <el-radio-group v-model="form.isSuper" style="width:200px">
            <el-radio :label="2">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职能" :label-width="formLabelWidth" prop="roles" :rules="[{ required: (form.isSuper==2), message: '必选项'}]">
          <el-select :disabled="form.isSuper==1" v-model="form.roles" multiple no-data-text="该部门没有职能，请添加。" collapse-tags placeholder="请选择权限" style="width:100%">
            <el-option v-for="item in authorityOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="身份证" :label-width="formLabelWidth" prop="idCard">
          <el-input v-model="form.idCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="birthday">
          <el-date-picker v-model="form.birthday" type="date" value-format="yyyy-MM-dd" style="width: 200px;" placeholder="出生日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
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
import UserView from "./UserView.vue";
import {
  getUserList,
  getRoleListBySchoolZoneId,
  createUser,
  getUserView,
  deleteUser,
  updateUserQuitStatus
} from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      viewId: "",
      dialogFormVisible: false,
      dialogViewVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        userName: "",
        theDate: "",
        theType: "",
        quitStatus: "1",
        schoolZoneId2: []
      },
      authorityOptions: [],
      formFocus: false,
      oldForm: { //用于编辑之后表单的初始化
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
  watch: {
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.oldForm.schoolZoneId = user.schoolZoneId;
      self.oldForm.schoolName = user.schoolZone.name;
      self.getAuthorityOptions();
      self.schoolId = user.schoolZoneId;
    },
    getAuthorityOptions() {
      let self = this;
      console.log(self.authorityOptions);
      getRoleListBySchoolZoneId(self.oldForm.schoolZoneId).then(data => {
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
    search(form) {
      //搜索方法
      this.cur_page = 1;
      this.getUser();
    },
    //加载数据
    getUser() {
      let self = this;
      self.loading = true;
      getUserList(self.cur_page, self.page_size, self.queryForm).then(data => {
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
          createUser(self.form).then(data => {
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
    filterQuitStatus(value, row) {
      if (value.quitStatus == 1) row.tag = "在职";
      else row.tag = "离职";
      return row.tag;
    },
    filterIsSuper(value, row) {
      if (value.isSuper == 1) row.tag = "超级管理员";
      else row.tag = value.roleName;
      return row.tag;
    },
    //控件方法
    hadleCommand(command) {
      switch (command.type) {
        case "delete": //删除
          this.handleDelete(command.row);
          break;
        case "quit": //离职
          this.handleQuit(command.row);
          break;
        case "sealup":
          this.handleSealup(command.row);
          break;
      }
    },
    //修改
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      let self = this;
      getUserView(row.id).then(data => {
        if (data.code == 200) {

          // self.form = data.data;
          let obj = data.data;
          let roles = [];
          if (obj.roleId) {
            obj.roleId.split(",").forEach(item => {
              roles.push(Number(item));
            })
          }
          obj.roles = roles;
          self.form = obj;
          this.dialogFormVisible = true;
        }
      })
    },
    handleAdd() {
      let self = this;
      self.dialogFormVisible = true;
      self.form = self.oldForm;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('确定删除该员工信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        deleteUser(row.id).then(data => {
          if (data.code == 200) {
            self.getUser();
            self.$message.success(data.message);
          } else {
            self.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
    },
    handleQuit(row) {
      let self = this;
      self.$prompt('请输入离职原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '离职原因'
      }).then(({ value }) => {
        let obj = { id: row.id, quitStatus: 2, name: row.name, quitRemarks: value };
        updateUserQuitStatus(obj).then(data => {
          self.loadingForm = false;
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getUser();
          } else {
            self.$message.error(data.message);
          }
        });
      }).catch(() => {
      });
    },
    handleSealup(row) {
      let self = this;
      self.$confirm('确定恢复该员工为在职状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        let obj = { id: row.id, quitStatus: 1, name: row.name };
        updateUserQuitStatus(obj).then(data => {
          self.loadingForm = false;
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getUser();
          } else {
            self.$message.error(data.message);
          }
        });
      }).catch(() => {
      });
    },
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
  components: { SchoolTree, UserView } //注入组件
};
</script>
