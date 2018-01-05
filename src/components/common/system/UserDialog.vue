<template>
  <div>
    <el-input ref="text1" :placeholder="placeholderText" v-model="userInput" readonly="">
      <i slot="suffix" style="cursor: pointer;" class="el-input__icon el-icon-more" @click="dialogTableVisible=true"></i>
    </el-input>
    <el-dialog :title="title" ref="dialog2" :visible.sync="dialogTableVisible" v-drag="" :modal-append-to-body=false append-to-body :close-on-click-modal="false">
      <div class="table">
        <div class="handle-box">
          <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
            <el-form-item>
              <el-input v-model="queryForm.userName" placeholder="用户名" clearable class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item>
              <school-tree v-if="isAll" :is-show-checkbox=true @handleCheckChange="handleCheckChange" place-text="部门" the-type="3" :parent-id="parentSchoolId"></school-tree>
            </el-form-item>

            <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          </el-form>
        </div>
        <el-table :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick" style="width: 100%">
          <el-table-column label="校区/部门" prop="schoolZone.name" v-if="isAll">
          </el-table-column>
          <el-table-column label="姓名" prop="name">
          </el-table-column>
          <el-table-column label="联系方式" prop="phone">
          </el-table-column>
          <el-table-column label="性别" prop="sex" :formatter="filterSex">
          </el-table-column>
          </el-table-column>
          <el-table-column label="职能" prop="isSuper" :formatter="filterIsSuper">
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div style=" overflow: hidden;">
          <!-- <div style="float: left;">
                    已选择：<el-input size="small" style="width:70%"
                                v-model="userInput" disabled>
                            </el-input>

                    </div> -->
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
<script scoped>
import SchoolTree from "../system/SchoolTree.vue";
import { getUserList } from "../../api/api";
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
      queryForm: {
        userName: "",
        theDate: "",
        theType: "",
        parentSchoolId: "",
        schoolZoneId2: []
      },
      loading: false
    };
  },
  created() {
    this.queryForm.theType = this.theType;
    if (!this.isAll) {
      this.queryForm.schoolZoneId2.push(this.parentSchoolId);
    }
    this.getUser();
  },
  watch: {
    value(val) {
      if (!val) this.userInput = "";
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
    },
    defaultText(val) {
      this.userInput = val;
    },
    parentSchoolId(val) {
      this.queryForm.parentSchoolId = val;
      this.userId = "";
      this.userInput = "";
      this.getUser();
    }
  },
  mounted() { },
  methods: {
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
      })
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
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
        this.userId.push(row);
      }
    },
    handleTagClose(tag) {
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
    title: {
      default: "选择老师"
    },
    placeholderText: {
      default: "老师"
    },
    theType: {//包括部门
      default: 0
    },
    isAll: { //显示全部校区
      default: true
    },
    defaultText: "",//默认文本
    parentSchoolId: "",
    selectedType: {
      //1单选 2 多选
      default: 1
    }
  },
  components: { SchoolTree } //注入组件
};
</script>
