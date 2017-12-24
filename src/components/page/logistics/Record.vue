<template>
<el-tabs tab-position="top" >
    <el-tab-pane label="进货">
      <div class="table">
          <div class="handle-box">
              <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                  <el-form-item>
                      <el-input v-model="queryForm.goodsName" clearable placeholder="物资"
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加进货</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
          </div>
          <el-table
              :data="tableData" stripe v-loading="loading" border
              style="width: 100%">
              <el-table-column
                  label="物品" prop="goodsName">
              </el-table-column>
              <el-table-column
                  label="校区"
                  prop="schoolZoneName">
              </el-table-column>
              <el-table-column
                  label="类别" prop="clazzName">
              </el-table-column>
              <el-table-column
                  label="数量"
                  prop="amount">
              </el-table-column>
              <el-table-column
                  label="价格" prop="price">
              </el-table-column>
              <el-table-column
                  label="其他名称"
                  prop="otherName">
              </el-table-column>
              <el-table-column
                  label="创建时间" sortable
                  prop="createTime">
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
          <el-dialog title="添加进货" :visible.sync="dialogFormVisible" width="750px">
            <el-form :model="form" ref="ruleForm2">
              <!-- <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
              <el-input v-model="form.name"  autofocus placeholder="课程名称"  auto-complete="off"></el-input>
              </el-form-item> -->
              <el-form-item label="登记日期" :label-width="formLabelWidth" style="display:inline-block;">
                <el-date-picker
                v-model="createTime"
                type="date"
                placeholder="进货日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="供应商" :label-width="formLabelWidth" style="display:inline-block;" :rules="[{required:true,message:'供应商必填'}]">
                  <el-select v-model="form.clazzId"  placeholder="供应商" >
                    <el-option v-for="(item,index) in parameterValue" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="收费信息" required :label-width="formLabelWidth" size="mini" style="margin-bottom:0px;">
                  <el-form-item class="freeTitle" size="mini">
                       名称
                   </el-form-item>
                   <el-form-item class="freeTitle" size="mini">
                       进价
                   </el-form-item>
                   <el-form-item class="freeTitle" size="mini">
                       数量
                   </el-form-item>
                   <el-form-item size="mini" style="text-align:left;display: inline-block;margin-bottom:5px;">
                       <el-button size="mini" @click="addChargeStandard">添加</el-button>
                   </el-form-item>
              </el-form-item>
              <el-form-item  :label-width="formLabelWidth"  v-for="(chargeStandard, index) in form.chargeStandard" :key="index" style="margin-bottom:0px;">
                   <el-form-item  style="display:inline-block;width:100px;margin-bottom:5px;" :key="index"
                    :prop="'chargeStandard.' + index + '.goodsId'"
                    :rules="[
                        { required: true, message: '必填项'},
                         size="mini" >
                       <el-input v-model.number="chargeStandard.minHourse" placeholder="最小课时" ></el-input>
                   </el-form-item>
                   <el-form-item  style="display:inline-block;width:220px;margin-bottom:5px;"
                     :prop="'chargeStandard.' + index + '.amount'"
                     :rules="[
                        { required: true, message: '必填项'},
                        { type: 'number', message: '必须为数字值'}]" size="mini" >
                        <el-input v-model.number="chargeStandard.amount" placeholder="课时" ></el-input>
                   </el-form-item>
                   <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;"
                    :prop="'chargeStandard.' + index + '.price'"   :rules="[
                        { required: true, message: '必填项'},
                        { validator:$validate.validateMoney, trigger: 'blur'}]" size="mini"  >
                       <el-input v-model.number="chargeStandard.price" placeholder="费用"  ></el-input>
                   </el-form-item>
                   <el-form-item style="display:inline-block;width:220px;margin-bottom:5px;"   >
                        <el-button  size="mini" @click="removeChargeStandard(chargeStandard)">删除</el-button>
                   </el-form-item>
              </el-form-item>
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </el-dialog>
      </div>
    </el-tab-pane>
    <el-tab-pane label="退货"> 
      配置管理</el-tab-pane>
    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
  </el-tabs>
    
</template>
<style>
.el-steps--simple {
  padding: 8px 8%;
  border-radius: 4px;
  background: #f5f7fa;
  line-height: 6px;
  margin-bottom: 15px;
}
</style>

<style scoped>
.freeTitle {
  display: inline-block;
  background-color: #faebd7;
  width: 120px;
  text-align: center;
  margin-bottom: 5px;
}
</style>


// =========================================
<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
    getRecordList,
    findBranchParameterValueAll,
    createRecord
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
                schoolZoneId2: []
            },
            parameterValue: [],
            form: {
                //表单 v-modle绑定的值
                name: "",
                sex: 1,
                contactId: "",
                sourceId: "",
                ownerId: "",
                phone: "",
                remarks: "",
                schoolZoneId: "",
                schoolName: "",
                intentionId: [],
                chargeStandard:[
                    {
                        goodsId:"",
                        amount:"",
                        price:""
                    }
                ]

            },
            formLabelWidth: "120px",
            loading: false,
            loadingForm: false,
            schoolId: "" //添加用户默认学校id
        };
    },
    created() {
        this.getData();
        this.getSchoolId();
        this.getParameterValue(10);
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
                    createRecord(self.form).then(data => {
                        self.$message.success(data.message);
                        self.$refs[formName].resetFields();
                        self.dialogFormVisible = false;
                        self.getData();
                    });
                } else {
                    return false;
                }
            });
        },
        //数据过滤

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
        removeChargeStandard(item) {
            if (this.form.chargeStandard.length == 1) return;
            var index = this.form.chargeStandard.indexOf(item);
            if (index !== -1) {
                this.form.chargeStandard.splice(index, 1);
            }
        },
        addChargeStandard() {
            this.form.chargeStandard.push({
                price: "",
                amount:""
            });
        }
    },
    components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog } //注入组件
};
</script>


