<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="活动名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.theType" value=1 clearable placeholder="活动状态" class="handle-select mr10">
            <el-option key="1" label="计划中" value="1"></el-option>
            <el-option key="2" label="进行中" value="2"></el-option>
            <el-option key="3" label="已结束" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.categoryId" style="width:100%" placeholder="活动分类" clearable>
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div v-if="checkedData.length==0" style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleAdd">添加活动</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <div v-if="checkedData.length>0" style="margin:5px;min-height:18px">
      <el-button v-if="$isAuthority('allort-customer')" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteInvite">批量删除</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" @sort-change="handSortChange" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column sortable="custom" label="市场活动" prop="name" min-width="100px">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <el-table-column label="负责人" sortable="custom" prop="userName">
      </el-table-column>
      <el-table-column sortable="custom" label="状态" prop="theType" :formatter="filterType">
      </el-table-column>
      <el-table-column sortable="custom" label="预算支出" prop="cost" min-width="100px">
      </el-table-column>
      <el-table-column sortable="custom" label="计划招生人数" prop="targetNumber" min-width="120px">
      </el-table-column>
      <el-table-column sortable="custom" label="活动分类" prop="cateGoryName" min-width="120px">
      </el-table-column>
      <el-table-column sortable="custom" label="计划开始日期" prop="startDate" min-width="120px">
      </el-table-column>
      <el-table-column sortable="custom" label="计划结束日期" prop="endDate" min-width="120px">
      </el-table-column>
      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="primary" plain size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <market-activity-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></market-activity-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleDialog" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '班级名称必填'},{validator:validateMarketActivityName,trigger:'blur'},]">
          <el-input v-model="form.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动分类" :label-width="formLabelWidth" prop="categoryId" :rules="[{ required: true, message: '该项必填'}]">
          <el-select v-model="form.categoryId" style="width:100%" placeholder="活动分类">
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '校区必填'}]">
          <school-tree @nodeClick="handleSchool" :name="form.schoolZoneName" :default-value="form.schoolZoneId" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth" prop="userId">
          <user-dialog v-model="form.userId" :default-text="form.userName" title="选择负责人" :the-type="3" :parent-school-id="form.schoolZoneId" placeholder-text="负责人"></user-dialog>
        </el-form-item>
        <el-form-item label="活动日期" :label-width="formLabelWidth" prop="startDate" :rules="[{ required: true, message: '该项必填'}]">
          <el-date-picker style="width:48%" v-model="form.startDate" type="date" value-format="yyyy-MM-dd" placeholder="活动开始日期" :picker-options="pickerOptions1">
          </el-date-picker>
          - -
          <el-date-picker style="width:48%" v-model="form.endDate" :picker-options="pickerOptions2" type="date" value-format="yyyy-MM-dd" placeholder="活动结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划招生数量" :label-width="formLabelWidth" prop="targetNumber" :rules="[{type: 'number', message: '必须为数字值'}]">
          <el-input v-model.number="form.targetNumber" placeholder="计划招生数量"></el-input>
        </el-form-item>
        <el-form-item label="预算经费" :label-width="formLabelWidth" prop="cost" :rules="[{type: 'number', message: '必须为数字值'}]">
          <el-input v-model.number="form.cost" placeholder="预算经费"></el-input>
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
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityView from "./MarketActivityView.vue";
import { findBranchParameterValueAll, getActivityList, createActivity, getMarketActivityView, deleteActivity } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      checkedData: [],
      viewId: "",
      dialogViewVisible: false,
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      queryForm: {
        name: "",
        schoolZoneId2: [],
        categoryId: "",
        theType: "",
        sort: ""
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          if (this.form.startDate) {
            return time.getTime() < new Date(this.form.startDate);
          } else {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      },
      oldForm: {
        //表单 v-modle绑定的值
        name: "",
        userId: "",
        schoolZoneId: "",
        schoolZoneName: "",
        categoryId: "",
        startDate: new Date().Format("yyyy-MM-dd"),
        endDate: "",
        targetNumber: 0,
        cost: 0
      },
      form: {
      },
      titleDialog: "添加市场活动",
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getSchoolId();
    this.getParameterValue(1);
  },
  computed: {
    //实时计算
    startDate() {
      return this.form.startDate;
    }
  },
  watch: {
    startDate(val) {
      this.form.endDate = "";
    }
  },
  methods: {
    validateMarketActivityName(rule, value, callback) {//名称验证
      getActivityList(1, 20, { "name2": value }).then(data => {
        if (data.code == 200) {
          if (data.data.total > 0) {
            let i = 0;
            data.data.list.forEach(item => {
              if (item.id != this.form.id) {//判断是不是当前修改的数据
                i++;
              }
            })
            if (i > 0) {
              callback(new Error("该市场活动名称已存在！"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback(new Error("网络错误，请尝试刷新操作！"));
        }
      })
    },
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user();
      console.log(user);
      self.oldForm.schoolZoneId = user.schoolZoneId;
      self.oldForm.schoolZoneName = user.schoolZone.name;
      self.schoolId = user.schoolZoneId;
    },
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.categoryId = self.parameterValue[0].id;
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
      getActivityList(
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
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createActivity(self.form).then(data => {
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
      getMarketActivityView(row.id).then(data => {
        if (data.code == 200) {
          let obj = data.data;
          self.titleDialog = "修改-" + obj.name;
          self.form = obj;
          this.dialogFormVisible = true;
        }
      })
    },
    handSortChange(column) {//排序方法
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    handleDelete(index, row) {
      let self = this;
      self.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(data => {
        let ids = "";
        self.checkedData.forEach(item => {
          ids += item.id + ",";
        })
        deleteActivity(ids).then(data => {
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
    },
    handleAdd() {
      let self = this;
      self.dialogFormVisible = true;
      self.titleDialog = "添加市场活动";
      self.form = self.oldForm;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    filterType(value, row) {
      if (value.theType == 1) row.tag = "计划中";
      else if (value.theType == 2) row.tag = "进行中";
      else row.tag = "已结束";
      return row.tag;
    }
  },
  components: { SchoolTree, UserDialog, MarketActivityView, getMarketActivityView, deleteActivity } //注入组件
};
</script>
