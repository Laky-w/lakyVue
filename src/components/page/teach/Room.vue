<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="教室名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleAdd">添加教室</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border style="width: 100%">
      <el-table-column label="教室名称">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" prop="schoolZoneName">
      </el-table-column>
      <el-table-column sortable label="容纳人数" prop="maxCount">
      </el-table-column>
      <el-table-column label="排序" sortable prop="sort">
      </el-table-column>
      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <room-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></room-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleDialog" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="教室" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '名称必填'},{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }]">
          <el-input v-model="form.name" placeholder="教室名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" :label-width="formLabelWidth" prop="maxCount">
          <el-input v-model="form.maxCount" placeholder="容纳人数" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '部门必填'}]">
          <school-tree @nodeClick="handleSchool" :name="form.schoolZoneName" :the-type="2" place-text="校区" :default-value="form.schoolZoneId"></school-tree>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" placeholder="排序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import RoomView from "./RoomView.vue";
import { getRoomList, createRoom, deleteRoom, getRoomView } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      viewId: "",
      dialogViewVisible: false,
      dialogFormVisible: false,
      titleDialog: "添加教室",
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        name: "",
        schoolZoneId2: []
      },
      oldFrom: {
        //表单 v-modle绑定的值
        name: "",
        maxCount: "",
        schoolZoneId: "",
        schoolZoneName: "",
        sort: ""
      },
      form: {},
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getSchoolId();
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.oldFrom.schoolZoneId = user.schoolZoneId;
      self.oldFrom.schoolZoneName = user.schoolZone.name;
      self.schoolId = user.schoolZoneId;
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
      getRoomList(self.cur_page, self.page_size, self.queryForm).then(data => {
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
          createRoom(self.form).then(data => {
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
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      let self = this;
      getRoomView(row.id).then(data => {
        if (data.code == 200) {
          let obj = data.data;
          self.titleDialog = "修改-" + obj.name;
          self.form = obj;
          console.log(self.form);
          this.dialogFormVisible = true;
        }
      })
    },
    handleDelete(index, row) {
      let self = this;
      self.$confirm('确定删除该教室吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(data => {
        deleteRoom(row.id).then(data => {
          if (data = code == 200) {
            self.getData();
            self.$message.success(data.message);
          } else {
            self.$message.error(data.message)
          }
        })
      }).catch(() => {

      });
    },
    handleAdd() {
      let self = this;
      self.dialogFormVisible = true;
      self.titleDialog = "添加教室";
      self.form = self.oldFrom;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handleSchool(data) {
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
      this.form.roles = [];
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    }
  },
  components: { SchoolTree, getRoomList, deleteRoom, createRoom, RoomView, getRoomView } //注入组件
};
</script>
