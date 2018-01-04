<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.goodsName" clearable  placeholder="物品"
                    class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2"
                                 place-text="校区"></school-tree>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border show-summary
            style="width: 100%">
            <el-table-column
            label="校区"
            prop="schoolZoneId">
            </el-table-column>
            <el-table-column
            label="物品" prop="goodsName" >
            </el-table-column>
            <el-table-column
            label="类别" prop="clazzName" >
            </el-table-column>
            <el-table-column
            label="剩余数量"
            prop="lastAmount" >
            </el-table-column>
            <el-table-column
            label="消耗数量"
            prop="consumeAmount" >
            </el-table-column>
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
    </div>

</template>
// =========================================
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import { getRepositoryList } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      tabPosition: 'top',
      queryForm: {
        goodsName: "",
        schoolZoneId: "",
        consumeAmount: "",
        lastAmount: "",
      },
      form: {
        goodsId: "",
        schoolName: "",
        schoolZoneId: "",
        consumeAmount: "",
        lastAmount: ""
      },
      formActive: 1,
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
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
      self.form.schoolZoneId = user.schoolZoneId;
      self.form.schoolName = user.schoolZone.name;
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
      getRepositoryList(
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
  },
  components: { SchoolTree } //注入组件
};
</script>
