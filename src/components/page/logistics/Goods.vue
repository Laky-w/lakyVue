<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item>
                    <el-input v-model="queryForm.name" placeholder="物品名称" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="queryForm.clazzId" clearable style="width:100%" placeholder="类别">
                        <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加物品</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
                label="物品"
                prop="name">
            </el-table-column>
            <el-table-column
                label="成本价" sortable
                prop="price">
            </el-table-column>
            <el-table-column
                label="售价" sortable
                prop="sellPrice">
            </el-table-column>
            <el-table-column
                label="类别"
                prop="clazzId">
            </el-table-column>
            <el-table-column
                label="库存"
                prop="lastAmount">
            </el-table-column>
            <el-table-column
                label="创建时间" sortable
                prop="createTime">
            </el-table-column>
            <el-table-column
                label="状态" :formatter="filterType"
                prop="theType">
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
        <el-dialog title="添加物品" :visible.sync="dialogFormVisible" width="550px" :close-on-click-modal=false>
            <el-form :model="form" ref="ruleForm" >
                <el-form-item label="物品" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '物品必填'}]">
                <el-input v-model="form.name"   placeholder="物品"  ></el-input>
                </el-form-item>
                <el-form-item label="类别" :label-width="formLabelWidth" prop="clazzId"
                              :rules="[{ required: true, message: '类别必填'}]">
                    <el-select v-model="form.clazzId" style="width:100%" placeholder="类别">
                        <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成本价" :label-width="formLabelWidth" prop="price"
                              :rules="[{ required: true, message: '成本价必填'},
                              {validator:$validate.validateMoney,trigger:'blur',}]">
                    <el-input v-model="form.price">
                        <template slot="append">元(￥)</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="售价" :label-width="formLabelWidth" prop="sellPrice"
                              :rules="[{ required: true, message: '售价必填'},
                              {validator:$validate.validateMoney,trigger:'blur',}]">
                    <el-input v-model="form.sellPrice">
                        <template slot="append">元(￥)</template>
                    </el-input>
                </el-form-item>

                <!--<el-form-item label="物品类型" :label-width="formLabelWidth" prop="theType">-->
                    <!--<el-radio-group v-model="form.theType">-->
                        <!--<el-radio :label="1">启用</el-radio>-->
                        <!--<el-radio :label="2">封存</el-radio>-->
                    <!--</el-radio-group>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.ms-tree-space::before {
  content: "";
}

table td {
  line-height: 26px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import Course from "../../common/teach/Course.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
import { getGoodsList, createGoods,findBranchParameterValueAll } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 50,
      queryForm: {
        name: "",
        clazzId: ""
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        name: "",
        theType: 1,
        clazzId: "",
        price: "",
        lastAmount:1
      },
      pickerOptions2: {
        disabledDate: time => {
          if (this.form.createTime) {
            return time.getTime() < new Date(this.form.createTime);
          } else {
            return time.getTime() < Date.now();
          }
        }
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getParameterValue(9);
  },
  computed: {},
  watch: {},
  methods: {
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
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
        }
      });
    },
    //加载数据
    getData() {
      let self = this;
      self.loading = true;
      getGoodsList(self.cur_page, self.page_size, self.queryForm).then(data => {
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
          createGoods(self.form).then(data => {
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
    // 数据过滤
    filterType(value, row) {
      if (value.theType == 1) row.tag = "正常";
      else row.tag = "封存";
      return row.tag;
    },

    //控件方法
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {}
  },
  components: { SchoolTree, Course, UserDialog, RoomDialog } //注入组件
};
</script>

