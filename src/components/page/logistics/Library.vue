<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.name" clearable placeholder="物品" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <school-tree :is-show-checkbox=true @handleCheckChange="handleCheckChange" :the-type="2" place-text="校区"></school-tree>
        </el-form-item>

        <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
      </el-form>
    </div>
    <div style="margin:5px;">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加借阅</el-button>
      <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
    </div>
    <el-table :data="tableData" stripe v-loading="loading" border show-summary :summary-method="getSummaries" @sort-change="handSortChange" style="width: 100%">
      <el-table-column label="物品" sortable="custom" prop="goodsName">
      </el-table-column>
      <el-table-column label="校区" sortable="custom" prop="schoolZoneName">
      </el-table-column>
      <!-- <el-table-column
              label="类别" prop="clazzName">
          </el-table-column> -->
      <el-table-column label="借阅数量" sortable="custom" prop="amount">
      </el-table-column>
      <el-table-column label="借阅人" sortable="custom" prop="otherName">
      </el-table-column>
      <el-table-column label="归还日期" sortable="custom" prop="returnDate">
      </el-table-column>
      <el-table-column label="归还状态" sortable="custom" prop="returnStatus" :formatter="filterStatus">
      </el-table-column>
      <el-table-column label="经手人" sortable="custom" prop="userName">
      </el-table-column>
      <el-table-column label="借阅日期" sortable="custom" prop="createTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.returnStatus ==1" @click="handleReturn(scope.$index, scope.row)">归还</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加借阅" :visible.sync="dialogFormVisible" width="750px">
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="借阅日期" prop="createTime" :label-width="formLabelWidth" style="display:inline-block;" :rules="[{required:true,message:'借阅日期必填'}]">
          <el-date-picker type="date" v-model="form.createTime" format="yyyy-MM-dd" placeholder="借阅日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="借阅人" :label-width="formLabelWidth" prop="otherName" style="display:inline-block;" :rules="[{required:true,message:'供应商必填'}]">
          <el-input v-model="form.otherName" placeholder="借阅人">
            <!-- <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option> -->
          </el-input>
        </el-form-item>
        <el-form-item label="借阅信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
          <el-form-item class="freeTitle" size="mini">
            名称
          </el-form-item>
          <el-form-item class="freeTitle" size="mini">
            数量
          </el-form-item>
          <el-form-item class="freeTitle" size="mini">
            售价
          </el-form-item>
          <!--<el-form-item class="freeTitle" size="mini">
                    总额
                </el-form-item> -->
          <el-form-item size="mini" style="display: inline-block;">
            <goods-dialog :button-type="2" @selectData="addGoods" ref="goodsDialog" placeholder-text="添加物品" selected-type=2 v-model="selectedGoods"></goods-dialog>
            <!-- <el-button @click="addChargeStandard" text-align="添加物品" icon="el-icon-edit" size="mini" type="primary"></el-button> -->
          </el-form-item>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" v-for="(goods, index) in form.goodsList" style="margin-bottom:0px;" :key="goods.goodsId">
          <el-form-item style="display:inline-block;width:100px;margin-bottom:5px;" size="mini">
            {{goods.goodsName}}
          </el-form-item>

          <el-form-item style="display:inline-block;width:100px;margin-bottom:5px;" :prop="'goodsList.' + index + '.amount'" :rules="[
                    { required: true, message: '必填项'}
                    ]" size="mini">
            <el-input-number style="width:100px" v-model.number="goods.amount" :min="0" placeholder="价格" :max="goods.oldAmount"></el-input-number>
            <!-- <el-input v-model.number="goods.amount" placeholder="数量" ></el-input> -->
          </el-form-item>
          <el-form-item style="display:inline-block;width:100px;margin-bottom:5px;center" size="mini">
            {{goods.price}}
          </el-form-item>
          <!-- <el-form-item   style="display:inline-block;width:100px;margin-bottom:5px;"
                :prop="'goodsList.' + index + '.totalPrice'" :rules="[
                    { required: true, message: '必填项'},
                    { type: 'number', message: '必须为数字值'}]" size="mini" >
                    <el-input placeholder="金额" disabled v-model="goods.totalPrice" ></el-input>
                </el-form-item> -->
          <el-form-item style="display:inline-block;width:100px;margin-bottom:5px;">
            <el-button size="mini" @click="removeGoods(goods)">删除</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>

</template>



<style scoped>
.freeTitle {
  display: inline-block;
  background-color: #faebd7;
  width: 100px;
  text-align: center;
  margin-bottom: 5px;
}
.freeContent {
  display: inline-block;
  width: 120px;
  margin-bottom: 5px;
  text-align: center;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import GoodsDialog from "../../common/logistics/GoodsDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  getRecordList,
  findBranchParameterValueAll,
  createGoodsRecord,
  returnLibrary
} from "../../api/api";

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        name: "",
        schoolZoneId2: [],
        theType: 5//图书借阅
      },
      selectedGoods: [],//选择物品
      parameterValue: [],
      form: {
        //表单 v-modle绑定的值
        amount: "",
        createTime: new Date().Format("yyyy-MM-dd"),
        userId: "",//经手人
        returnStatus: 1,
        otherName: "",//借阅人
        goodsList: []//进货列表

      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  created() {
    this.getData();
    this.getParameterValue(10);
  },
  computed: {
    //实时计算
  },
  methods: {
    //初始化属性start
    getParameterValue(id) {
      let self = this;
      findBranchParameterValueAll(id).then(data => {
        if (data.code == 200) {
          self.parameterValue = data.data;
          self.form.contactId = self.parameterValue[0].id;
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
      getRecordList(
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
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          let goodsJson = JSON.stringify(self.form);
          createGoodsRecord({ goodsRecordJson: goodsJson }).then(data => {
            self.dialogFormVisible = false;
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.$refs[formName].resetFields();
              self.form.goodsList = [];
              self.$refs["goodsDialog"].getData();
              self.$refs["goodsDialog"].clean();
              self.getData();
            } else {
              self.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    //数据过滤
    filterStatus(value, row) {

      if (value.returnStatus == 1) row.tag = "未归还";
      else row.tag = "已归还";
      return row.tag;
    },
    //控件方法
    handleReturn(index, row) {
      let self = this;
      self.$confirm('确定归还吗?', '提示', { type: 'warning' }).then(() => {
        returnLibrary(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getData();
          } else {
            self.$message.error(data.message);
          }
        });
      }).catch(() => { });
    },
    handleDelete(index, row) { },
    handleCheckChange(allNode) {
      let self = this;
      self.queryForm.schoolZoneId2 = [];
      for (let i = 0; i < allNode.length; i++) {
        self.queryForm.schoolZoneId2.push(allNode[i].id);
      }
    },
    removeGoods(item) {
      var index = this.form.goodsList.indexOf(item);
      if (index !== -1) {
        this.form.goodsList.splice(index, 1);
      }
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
    addGoods(data) {
      let self = this;
      data.forEach(item => {
        let falg = false;
        if (self.form.goodsList) {
          self.form.goodsList.forEach(goods => {
            if (goods.goodsId == item.id) {
              falg = true;
              return;
            }
          })
        }
        if (falg) {
          self.$message.warning(item.name + "已存在物品列表");
          return;
        }
        self.form.goodsList.push(
          {
            price: item.sellPrice,
            amount: 1,
            theType: 5,
            returnStatus: 1,
            otherName: item.otherName,
            goodsId: item.id,
            oldAmount: item.lastAmount,
            goodsName: item.name
          })
        self.selectedGoods = [];
      });
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (column.label == "归还状态") {
          sums[index] = '';
          return;
        }
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            let value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev).add(value);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    filterTotalPrice(value, row) {
      value.totalPrice = value.amount.mul(value.price);
      row.tag = value.totalPrice;
      return row.tag;
    }
  },
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog, GoodsDialog } //注入组件
};
</script>


