<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.contactTime" clearable placeholder="客户名称" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item  >
                    <el-input v-model="queryForm.content" clearable placeholder="内容查询" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加联系情况</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
                label="联系人" prop="userName">
            </el-table-column>
            <el-table-column
                label="联系时间"
                prop="contactTime">
            </el-table-column>
            <el-table-column
                label="联系内容" prop="content">
            </el-table-column>
            <el-table-column
                label="学员名称"
                prop="studentName">
            </el-table-column>
            <el-table-column
                label="联系方式" prop="contactStyleId">
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
        <el-dialog title="添加联系记录" :visible.sync="dialogFormVisible" width="750px" custom-class="dialog-form">
            <el-form :model="form" ref="ruleForm" v-loading="loadingForm" inline size="small">
                <el-form-item label="联系人" :label-width="formLabelWidth" prop="userName"
                              :rules="[{ required: true, message: '名称必填'},{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]">
                    <el-input v-model="form.userName"   placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系时间" :label-width="formLabelWidth" prop="contactTime" :rules="[{ required: true, message: '该项必填'}]" >
                    <el-input v-model="form.contactTime"   placeholder="联系时间"  ></el-input>
                </el-form-item>
                <el-form-item label="联系内容" :label-width="formLabelWidth" prop="content">
                    <market-activity-dialog v-model="form.content"></market-activity-dialog>
                </el-form-item>
                <el-form-item label="学员名称" :label-width="formLabelWidth" prop="studentName">
                    <market-activity-dialog v-model="form.studentName"></market-activity-dialog>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" prop="contactStyleId"  >
                    <el-input v-model="form.contactStyleId" style="width:535px" :rows=3 type="textarea"  placeholder="联系方式"  ></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>




<script>
    import SchoolTree from "../../common/system/SchoolTree.vue";
    import UserDialog from "../../common/system/UserDialog.vue";
    import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
    import CourseDialog from "../../common/teach/CourseDialog.vue";
    export default {
        data() {
            return {
                tableData: [],
                dialogFormVisible: false,
                total: 0,
                cur_page: 1,
                page_size: 20,
                queryForm: {
                    userName: "",
                },
                parameterValue: [],
                form: {
                    //表单 v-modle绑定的值
                    userName:"",
                    contactTime:"",
                    content:"",
                    studentName:"",
                    contactStyleId:""
                },
                formLabelWidth: "120px",
                loading: false,
                loadingForm: false,
            };
        },
        created() {
            this.getData();
        },
        computed: {
            //实时计算
        },
        methods: {
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
                self.$axios
                    .post("supply/getContactList/" + this.cur_page + "/" + this.page_size,self.queryForm)
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
            //保存表单
            submitForm(formName) {
                let self = this;
                self.$refs[formName].validate(valid => {
                    if (valid) {
                        self.loadingForm = true;
                        self.$axios.post("supply/createContact", this.form).then(res => {
                            var data = res.data;
                            self.loadingForm = false;
                            if (data.code == 200) {
                                self.$message.success(data.message);
                                self.$refs[formName].resetFields();
                                self.dialogFormVisible = false;
                                self.getData();
                            } else {
                                this.$message.error(data.data);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            //控件方法
            handleEdit(index, row) {
                this.form.fatherId = row.id;
                this.form.fatherName = row.name;
                this.dialogFormVisible = true;
            },
            handleDelete(index, row) {},
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
            }
        },

    };
</script>
