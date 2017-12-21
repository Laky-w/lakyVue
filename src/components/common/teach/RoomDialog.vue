<template>
    <div>
        <el-input
            :placeholder="placeholderText"
            v-model="userInput" readonly="">
            <i slot="suffix"  style="cursor: pointer;" class="el-input__icon el-icon-more" @click="dialogTableVisible=true"></i>
        </el-input>
        <el-dialog :title="title" :visible.sync="dialogTableVisible"
        :modal-append-to-body=false append-to-body :close-on-click-modal=false>
            <div class="handle-box">
                <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                    <el-form-item  >
                        <el-input v-model="queryForm.name" clearable placeholder="教室名称" class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isAll">
                        <school-tree  :is-show-checkbox=true @handleCheckChange ="handleCheckChange"
                        place-text="校区" the-type="2" :parent-id="parentSchoolId"></school-tree>
                    </el-form-item>
                    </el-form-item>
                    <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
                </el-form>
            </div>
            <el-table
                :data="tableData" stripe v-loading="loading" border
                style="width: 100%" @row-click="handleRowClick">
                <el-table-column
                label="教室名称" prop="name" >
                </el-table-column>
                <el-table-column
                label="校区" v-if="isAll"
                prop="schoolZoneName">
                </el-table-column>
                <el-table-column
                sortable
                label="容纳人数"
                prop="maxCount">
                </el-table-column>
                <el-table-column
                label="排序" sortable
                prop="sort">
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
import { getRoomList } from "../../api/api";
export default {
  data() {
    return {
      userId: "",
      userInput: "",
      dialogTableVisible: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        name: "",
        theType: 2,
        schoolZoneId2: [],
        parentSchoolId: ""
      },
      loading: false
    };
  },
  created() {
    if (!this.isAll) {
      this.queryForm.schoolZoneId2.push(this.parentSchoolId);
    }
    this.getData();
  },
  watch: {
    value(val) {
      //当外部 v-modle值清空时，清空显示信息
      if (!val) this.userInput = "";
    },
    userId(val) {
      this.$emit("input", val); //向父组件v-modle传值。
    },
    parentSchoolId(val) {
      console.log(val);
      if (this.isAll) {
        this.queryForm.parentSchoolId = val;
      } else {
        this.queryForm.schoolZoneId2 = [];
        this.queryForm.schoolZoneId2.push(val);
      }
      this.userId = "";
      this.userInput = "";
      this.getData();
    }
  },
  methods: {
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
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    handleRowClick(row, event, column) {
      this.userInput = row.name;
      this.userId = row.id;
    }
  },
  props: {
    value: "",
    title: {
      default: "选择教室"
    },
    placeholderText: {
      default: "教室"
    },
    theType: {
      default: 0
    },
    isAll: {
      default: true
    },
    parentSchoolId: ""
  },
  components: { SchoolTree } //注入组件
};
</script>
