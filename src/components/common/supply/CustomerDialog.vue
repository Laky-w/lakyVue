<template>
  <div>
    <!-- <el-input ref="text1"
                  :placeholder="placeholderText"
                  v-model="userInput" readonly="">
            <i slot="suffix" style="cursor: pointer;" class="el-input__icon el-icon-more"
               @click="handleOpenDialog"></i>
        </el-input> -->
    <el-autocomplete style="width:100%" v-model="userInput" valueKey="name" value="id" @blur="handleBlur" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" @select="handleSelect" :placeholder="placeholderText">
      <i slot="suffix" style="cursor: pointer;" class="el-input__icon el-icon-more" @click="handleOpenDialog"></i>
    </el-autocomplete>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" :modal-append-to-body=false append-to-body :close-on-click-modal=false>
      <div class="table">
        <div class="handle-box">
          <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
            <el-form-item>
              <el-input v-model="queryForm.name" clearable placeholder="客户名称" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item>
              <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
            </el-form-item>

            <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          </el-form>
        </div>
        <el-table :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick" style="width: 100%">
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="校区" prop="schoolZoneName">
          </el-table-column>
          <el-table-column label="性别" prop="sex" :formatter="filterSex">
          </el-table-column>
          <el-table-column label="联系电话" prop="phone">
          </el-table-column>
          <el-table-column label="负责人" prop="ownerName">
          </el-table-column>
          <el-table-column label="来源活动" prop="sourceName">
          </el-table-column>
          <el-table-column label="意向课程" prop="intentionCourseName">
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, prev, pager, next, jumper" :total="total">
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


<script type="text/ecmascript-6">
import SchoolTree from "../../common/system/SchoolTree.vue";
import { getCustomerList } from "../../api/api";
import { findBranchParameterValueAll } from "../../api/api";
export default {
  data() {
    return {
      user: "",
      userInput: "",
      userId: "",
      dialogTableVisible: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      queryForm: {
        name: "",
        schoolZoneId2: []
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() { },
  watch: {
    value(val) {
      if (!val) this.userInput = "";
    },
    defaulUser(val) {
      this.user = val;
      this.userId = val.id;
      this.userInput = val.name;
    },
    userId(val) {
      this.$emit("input", val); //向父组件v-modle传值。
    }
  },
  methods: {
    //初始化属性start
    getSchoolId() {
      let self = this;
      let user = self.$user;
      if (user) {
        self.form.schoolZoneId = user.schoolZoneId;
        self.form.schoolName = user.schoolZone.name;
        self.schoolId = user.schoolZoneId;
      }

    },
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
      if (self.studentTypeNo) {
        self.queryForm.theType2 = self.studentTypeNo;
      }
      getCustomerList(
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
    //数据过滤
    filterSex(value, row) {
      if (value.sex == 1) row.tag = "男";
      else row.tag = "女";
      return row.tag;
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
    handleRowClick(row, event, column) {
      this.userInput = row.name;
      this.userId = row.id;
      this.user = row;
    },
    handleOpenDialog() {
      this.dialogTableVisible = true;
      if (this.tableData.length == 0) {
        this.getData();
        this.getParameterValue(7);
      }
    },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let queryObj = { name: queryString }
        if (this.studentTypeNo) {
          queryObj.theType2 = this.studentTypeNo;
        }
        getCustomerList(1, 20, queryObj).then(data => {
          if (data.code == 200) {
            cb(data.data.list);
          }
        })
      }
    },
    handleSelect(item) {
      this.user = item;
      this.userId = item.id;
    },
    handleBlur() {
      if (this.user) {
        this.userInput = this.user.name;
        this.userId = this.user.id;
      } else {
        this.userInput = "";
      }
    }
  },
  props: {
    value: "",
    studentTypeNo: "",
    defaulUser: "",
    title: {
      default: "选择学员"
    },
    placeholderText: {
      default: "学员"
    },
    selectedType: {
      //1单选 2 多选
      default: 1
    },
    parentSchoolId: ""
  },
  components: {
    SchoolTree
  } //注入组件
};
</script>
