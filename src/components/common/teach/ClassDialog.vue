<template>
  <div>
    <el-input ref="text1" :placeholder="placeholderText" v-model="userInput" readonly="">
      <i slot="suffix" style="cursor: pointer;" class="el-input__icon el-icon-more" @click="handleOpenDialog"></i>
    </el-input>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" v-drag="" :modal-append-to-body=false append-to-body :close-on-click-modal=false>
      <div class="table">
        <div class="handle-box">
          <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
            <el-form-item>
              <el-input v-model="queryForm.userName" placeholder="班级名称" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item>
              <school-tree :default-value="schoolId" :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
            </el-form-item>

            <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          </el-form>
        </div>
        <el-table :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick" style="width: 100%">
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="课程" prop="courseName">
          </el-table-column>
          <el-table-column label="教室" prop="roomName">
          </el-table-column>
          <el-table-column label="班主任" prop="teacherName">
          </el-table-column>
          <el-table-column label="主教" prop="mainTeacherName">
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
          </el-table-column>
          <el-table-column label="计划开班日期" prop="startDate">
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div style=" overflow: hidden;">
          <div style="float: left;" v-if="selectedType==1">
            已选择：
            <el-input size="small" style="width:70%;" v-model="userInput" disabled>
            </el-input>

          </div>
          <div style="float: left;" v-else>
            已选择：
            <el-tag size="mini" style="margin-right:3px" v-for="tag in userId" :key="tag.id" @close="handleTagClose(tag)" closable>
              {{tag.name}}
            </el-tag>
          </div>
          <div style="float: right;">
            <el-button size="small" @click="userInput='';userId='';dialogTableVisible=false">取消</el-button>
            <el-button size="small" type="primary" @click="handleOK">确定</el-button>
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
import { getSchoolClassList, findBranchParameterValueAll } from "../../api/api";
export default {
  data() {
    return {
      userInput: "",
      userId: "",
      dialogTableVisible: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      parameterValue: [],
      schoolId: "",//添加用户默认学校id
      queryForm: {
        userName: "",
        theDate: "",
        theType: "",
        schoolZoneId2: []
      },
      loading: false
    };
  },
  created() { },
  watch: {
    value(val) {
      if (!val || val.length == 0) {
        this.userInput = "";
        this.userId = "";
      }
    },
    userId(val) {
      if (this.selectedType != 1) {
        let userInput = "";
        val = [];
        for (let i = 0; i < this.userId.length; i++) {
          userInput += this.userId[i].name + ",";
          val.push(this.userId[i].id);
        }
        this.userInput = userInput.substring(0, userInput.length - 1);
      }
      this.$emit("input", val);
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
    getSchoolId() {
      let self = this;
      let user = self.$user();
      self.queryForm.schoolZoneId2 = user.schoolZoneId;
      self.schoolId = user.schoolZoneId;
    },
    //初始化属性end
    //分页方法start
    handleSizeChange(val) {
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
      if (self.courseId) {
        self.queryForm.courseId = self.courseId;
      }
      getSchoolClassList(
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
    //数据过滤
    filterTheType(value, row) {
      if (value.theType == 1) row.tag = "一对一";
      else row.tag = "一对多";
      return row.tag;
    },
    handleRowClick(row, event, column) {
      if (this.selectedType == 1) {
        this.userInput = row.name;
        this.userId = row.id;
      } else {
        if (this.userId == "") {
          this.userId = [];
        } else {
          let falg = false;
          for (let i = 0; i < this.userId.length; i++) {
            if (this.userId[i].id == row.id) {
              falg = true;
              break;
            }
          }
          if (falg) return;
        }
        // if (this.userInput == "") {
        //   this.userInput += row.name;
        // } else {
        //   this.userInput += "," + row.name;
        // }
        this.userId.push(row);
      }
    },
    handleOpenDialog() {
      this.dialogTableVisible = true;
      if (this.tableData.length == 0) {
        this.getSchoolId();
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
    handleOK() {
      this.dialogTableVisible = false;
      this.$emit("selectData", this.userId);
    },
    handleTagClose(tag) {
      console.log(tag);
      for (let i = 0; i < this.userId.length; i++) {
        if (this.userId[i].id == tag.id) {
          // delete this.userId[i];
          this.userId.splice(i, 1);
          break;
        }
      }
    }
  },
  props: {
    value: "",
    courseId: "",
    title: {
      default: "选择班级"
    },
    placeholderText: {
      default: "班级"
    },
    theType: {
      default: 0
    },
    parentSchoolId: "",
    selectedType: {
      //1单选 2 多选
      default: 1
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
