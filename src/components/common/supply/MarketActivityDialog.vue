<template>
  <div>
    <el-input ref="text1" :placeholder="placeholderText" v-model="userInput" readonly="">
      <i slot="suffix" style="cursor: pointer;" class="el-input__icon el-icon-more" @click="handleOpenDialog"></i>
    </el-input>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" :modal-append-to-body=false append-to-body :close-on-click-modal=false>
      <div class="table">
        <div class="handle-box">
          <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
            <el-form-item>
              <el-input v-model="queryForm.name" clearable placeholder="活动名称" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryForm.categoryId" style="width:100%" placeholder="活动分类" clearable>
                <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryForm.theType" value=1 clearable placeholder="活动状态" class="handle-select mr10">
                <el-option key="1" label="计划中" value="1"></el-option>
                <el-option key="2" label="进行中" value="2"></el-option>
                <el-option key="3" label="已结束" value="3"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item >
                            <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange" :the-type="2" place-text="校区" ></school-tree>
                        </el-form-item> -->
            <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          </el-form>
        </div>
        <el-table :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick" style="width: 100%">
          <el-table-column label="市场活动" prop="name">
          </el-table-column>
          <el-table-column label="校区" prop="schoolZoneName">
          </el-table-column>
          <el-table-column label="负责人" prop="userName">
          </el-table-column>
          <el-table-column sortable label="状态" prop="theType" :formatter="filterType">
          </el-table-column>
          <el-table-column sortable min-width="145" label="计划招生人数" prop="targetNumber">
          </el-table-column>
          <el-table-column sortable min-width="110" label="活动分类" prop="cateGoryName">
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div style=" overflow: hidden;">
          <div style="float: left;">
            已选择：
            <el-input size="small" style="width:70%" v-model="userInput" disabled>
            </el-input>
          </div>
          <div style="float: right;">
            <el-button size="small" @click="userInput='';userId='';dialogTableVisible=false">取消</el-button>
            <el-button size="small" type="primary" @click="dialogTableVisible=false">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.el-input.is-disabled .el-input__inner {
  color: #2d2f33;
}
</style>
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import { findBranchParameterValueAll, getActivityList } from "../../api/api";
export default {
  data() {
    return {
      userInput: this.defaultText,
      userId: "",
      dialogTableVisible: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      queryForm: {
        name: "",
        schoolZoneId2: [],
        categoryId: "",
        theType: "2"
      },
      loading: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() { },
  computed: {
    //实时计算
  },
  watch: {
    value(val) {
      if (!val) this.userInput = "";
    },
    userId(val) {
      this.$emit("input", val);
    },
    defaultText(val) {
      this.userInput = val;
    }
  },
  methods: {
    //初始化属性start
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
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
    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) { },
    handleSchool(data) {
      this.form.schoolName = data.name;
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
    filterType(value, row) {
      if (value.theType == 1) row.tag = "计划中";
      else if (value.theType == 2) row.tag = "进行中";
      else row.tag = "已结束";
      return row.tag;
    },
    handleRowClick(row, event, column) {
      //点击数据行触发的方法
      this.userInput = row.name;
      this.userId = row.id;
    },
    handleOpenDialog() {
      this.dialogTableVisible = true;
      if (this.tableData.length == 0) {
        this.getData();
        this.getParameterValue(1);
      }
    }
  },
  props: {
    value: "",
    title: {
      default: "选择市场活动"
    },
    defaultText: "",//默认文本
    placeholderText: {
      default: "活动"
    },
    theType: {
      default: 0
    },
    parentSchoolId: ""
  },
  components: { SchoolTree } //注入组件
};
</script>
