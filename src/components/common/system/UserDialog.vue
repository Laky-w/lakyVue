<template>
    <div>
        <el-input ref="text1"
            :placeholder="placeholderText"
            v-model="userInput" readonly="">
            <i slot="suffix"  style="cursor: pointer;" class="el-input__icon el-icon-more" @click="dialogTableVisible=true"></i>
        </el-input>
        <el-dialog :title="title" ref="dialog2" :visible.sync="dialogTableVisible" v-drag=""
             :modal-append-to-body=false append-to-body :close-on-click-modal=false>
             <div class="table">
                <div class="handle-box">
                    <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                        <el-form-item  >
                            <el-input v-model="queryForm.userName"  placeholder="用户名" clearable class="handle-input mr10"></el-input>
                        </el-form-item>
                        <el-form-item >
                        <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"
                        place-text="部门" the-type="3" :parent-id="parentSchoolId"></school-tree>
                        </el-form-item>

                        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
                    </el-form>
                </div>
                <el-table
                    :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick"
                    style="width: 100%">
                    <el-table-column
                    label="校区/部门" prop="schoolZone.name" >
                    </el-table-column>
                    <el-table-column
                    label="用户名"
                    prop="userName">
                    </el-table-column>
                    <el-table-column
                    label="联系方式"
                    prop="phone">
                    </el-table-column>
                    <el-table-column
                    label="性别"
                    prop="sex" :formatter="filterSex">
                    </el-table-column>
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
                <div style=" overflow: hidden;">
                    <div style="float: left;">
                    已选择：<el-input size="small" style="width:70%"
                                v-model="userInput" disabled>
                            </el-input>

                    </div>
                    <div style="float: right;">
                        <el-button size="small" @click="userInput='';userId='';dialogTableVisible=false">取消</el-button>
                        <el-button size="small" type="primary"  @click="dialogTableVisible=false">确定</el-button>
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
    this.getUser();
  },
  watch: {
    value(val) {
      if (!val) this.userInput = "";
    },
    userId(val) {
      this.$emit("input", val);
    },
    parentSchoolId(val) {
      this.queryForm.parentSchoolId = val;
      this.userId = "";
      this.userInput = "";
      this.getUser();
    }
  },
  mounted() {},
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
      self.$axios
        .post(
          "organization/getUserList/" + this.cur_page + "/" + this.page_size,
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
      this.userInput = row.userName;
      this.userId = row.id;
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
    theType: {
      default: 0
    },
    parentSchoolId: ""
  },
  components: { SchoolTree } //注入组件
};
</script>
