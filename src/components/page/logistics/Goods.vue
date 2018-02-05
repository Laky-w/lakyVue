<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="物品名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.clazzId" clearable style="width:100%" placeholder="类别">
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleAdd">添加物品</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="物品" sortable="custom" prop="name">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="成本价" sortable="custom" prop="price">
      </el-table-column>
      <el-table-column label="售价" sortable="custom" prop="sellPrice">
      </el-table-column>
      <el-table-column label="类别" sortable="custom" prop="clazzName">
      </el-table-column>
      <el-table-column label="库存" sortable="custom" prop="lastAmount">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="状态" sortable="custom" :formatter="filterType" prop="theType">
      </el-table-column>
      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <goods-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible"></goods-view>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="titleDialog" :visible.sync="dialogFormVisible" width="550px" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="物品" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '物品必填'},{ validator:validateGoodsName, trigger: 'blur'},]">
          <el-input v-model="form.name" placeholder="物品"></el-input>
        </el-form-item>
        <el-form-item label="类别" :label-width="formLabelWidth" prop="clazzId" :rules="[{ required: true, message: '类别必填'}]">
          <el-select v-model="form.clazzId" style="width:100%" placeholder="类别">
            <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成本价" :label-width="formLabelWidth" prop="price" :rules="[{ required: true, message: '成本价必填'},
                              {validator:$validate.validateMoney,trigger:'blur',}]">
          <el-input v-model="form.price">
            <template slot="append">元(￥)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="售价" :label-width="formLabelWidth" prop="sellPrice" :rules="[{ required: true, message: '售价必填'},
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
import GoodsView from "./GoodsView.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
import { getGoodsList, createGoods, findBranchParameterValueAll, deleteGoods, getGoodsView } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      viewId: "",
      dialogViewVisible: false,
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
      oldForm: {
        //表单 v-modle绑定的值
        name: "",
        theType: 1,
        clazzId: "",
        price: "",
        lastAmount: 1
      },
      form: {

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
      titleDialog: "添加物品",
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
    validateGoodsName(rule, value, callback) {//手机验证
      getGoodsList(1, 20, { "name2": value }).then(data => {
        if (data.code == 200) {
          if (data.data.total > 0) {
            let i = 0;
            data.data.list.forEach(item => {
              if (item.id != this.form.id) {//判断是不是当前修改的数据
                i++;
              }
            })
            if (i > 0) {
              callback(new Error("该物品名称已存在！"));
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
      let self = this;
      getGoodsView(row.id).then(data => {
        if (data.code == 200) {
          let obj = data.data;
          self.titleDialog = "修改-" + obj.name;
          self.form = obj;
          this.dialogFormVisible = true;
        }
      })
    },
    handleAdd() {
      let self = this;
      self.dialogFormVisible = true;
      self.titleDialog = "添加物品";
      self.form = self.oldForm;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handSortChange(column, prop, order) {
      console.log(column);
      let self = this;
      if (column.column) {
        self.queryForm.sort = JSON.stringify({ prop: column.prop, order: column.order });
      } else {
        self.queryForm.sort = "";
      }
      self.getData();
    },
    handleDelete(index, row) {
      let self = this;
      self.$confirm('确定删除该物品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(data => {
        deleteGoods(row.id).then(data => {
          if (data.code == 200) {
            self.getData();
            self.$message.success(data.message);
          } else {
            self.$message.error(data.message);
          }
        })
      }).catch(() => {

      });
    }
  },
  components: { SchoolTree, Course, UserDialog, RoomDialog, GoodsView } //注入组件
}
</script>

