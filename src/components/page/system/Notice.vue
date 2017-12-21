<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item>
                    <el-input v-model="queryForm.content" clearable placeholder="公告内容"
                              class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="queryForm.theType" value=1 clearable placeholder="通知范围"
                               class="handle-select mr10">
                        <el-option key="1" label="机构公告" value="1"></el-option>
                        <el-option key="2" label="校区公告" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <date-range startPlaceholder="有效日期" v-model="queryForm.lastDatetime"
                                endPlaceholder="有效日期"></date-range>
                </el-form-item>
                <el-form-item>
                    <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange"></school-tree>
                </el-form-item>

                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加公告</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading"
            style="width: 100%">
            <el-table-column
                label="校区" prop="schoolZone.name">
            </el-table-column>
            <el-table-column
                label="用户名"
                prop="user.name">
            </el-table-column>
            <el-table-column
                label="发布时间"
                prop="createDatetime">
            </el-table-column>
            <el-table-column
                label="公告内容"
                prop="content">
            </el-table-column>
            <el-table-column
                label="有效时间"
                prop="lastDatetime">
            </el-table-column>
            <el-table-column
                label="通知范围"
                prop="theType" :formatter="filterType">
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
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="添加公告" :visible.sync="dialogFormVisible" width="750px" :close-on-click-modal=false>
            <el-form :model="form" ref="ruleForm">
                <el-form-item label="公告范围" :label-width="formLabelWidth" required>
                    <el-radio-group v-model="form.theType">
                        <el-radio :label="1">机构公告</el-radio>
                        <el-radio :label="2">校区公告</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效时间" prop="lastDatetime" :label-width="formLabelWidth">
                    <el-date-picker style="width:100%" v-model="form.lastDatetime" value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime" placeholder="有效时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="公告内容" prop="content" :label-width="formLabelWidth"
                              :rules="[{ required: true, message: '必选项'} ,{ min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }]">
                    <el-input v-model="form.content" :rows=5 type="textarea" placeholder="请输入公告内容"
                              auto-complete="off"></el-input>
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
import DateRange from "../../common/Daterange.vue";
import { findNoticeAll, createNotice } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      cur_page: 1,
      page_size: 20,
      total: 0,
      queryForm: {
        lastDatetime: "",
        theType: "",
        content: "",
        schoolZoneId2: []
      },
      form: {
        theType: 2,
        content: "",
        lastDatetime: ""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      let self = this;
      self.loading = true;
      findNoticeAll(
        self.cur_page,
        self.page_size,
        self.queryForm
      ).then(data => {
        if (data.code == 200) {
          self.total = data.data["total"];
          self.tableData = data.data.list;
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    filterType(value, row) {
      if (value.theType == 1) row.tag = "机构公告";
      else row.tag = "校区公告";
      return row.tag;
    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          createNotice(self.form).then(data => {
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
    handleCheckChange(allNode) {
      this.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        this.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    search(form) {
      this.cur_page = 1;
      this.getData();
    },
    handleCheckChange(allNode) {
      this.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        this.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleDelete(index, row) {}
  },
  components: {
    SchoolTree,
    DateRange
  } //注入组件
};
</script>
