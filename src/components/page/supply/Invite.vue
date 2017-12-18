<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item>
                    <el-input v-model="queryForm.studentId" placeholder="邀约人名称/拼音/手机号" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="queryForm.userId" placeholder="记录人" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item>
                    <school-tree :is-show-checkbox=true :the-type="2" place-text="校区"
                                 @handleCheckChange="handleCheckChange"></school-tree>
                </el-form-item>

                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">添加邀约记录</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
                label="邀约人"
                prop="studentId">
            </el-table-column>
            <el-table-column
                label="校区" prop="schoolZoneName">
            </el-table-column>
            <el-table-column
                label="到访时间" sortable
                prop="inviteTime">
            </el-table-column>
            <el-table-column
                label="到访状态" :formatter="filterInviteStatus"
                prop="inviteStatus">
            </el-table-column>
            <el-table-column
                label="记录人"
                prop="userId">
            </el-table-column>
            <el-table-column
                label="备注"
                prop="remarks">
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
        <el-dialog title="添加邀约记录" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
            <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
                <!--<el-form-item label="名称" :label-width="formLabelWidth" prop="studentId"  :rules="[{ required: true, message: '邀约人必填'}]">-->
                <!--<el-input v-model="form.studentId"   placeholder="邀约人"  ></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="邀约人" :label-width="formLabelWidth" prop="studentId"
                              :rules="[{ required: true, message: '名称必填'}]">
                    <customer-dialog v-model="form.studentId" title="邀约人" placeholder-text="邀约人">
                    </customer-dialog>
                </el-form-item>
                <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName"
                              :rules="[{ required: true, message: '参观校区必填'}]">
                    <school-tree @nodeClick="handleSchool" :name="form.schoolName" :the-type="2" place-text="参观校区"
                                 :default-value="schoolId"></school-tree>
                </el-form-item>
                <el-form-item label="到访状态" :label-width="formLabelWidth" prop="inviteStatus"
                              :rules="[{ required: true, message: '必选项'}]">
                    <el-radio-group v-model="form.inviteStatus">
                        <el-radio :label="1">未到</el-radio>
                        <el-radio :label="2">到达</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="到访时间" :label-width="formLabelWidth" prop="inviteTime"
                              :rules="[{ required: true, message: '必选项'}]">
                    <el-date-picker
                        v-model="form.inviteTime"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="到访时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="记录人" :label-width="formLabelWidth" prop="userId">
                    <user-dialog v-model="form.userId" title="选择记录人"
                                 placeholder-text="记录人"></user-dialog>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                    <el-input v-model="form.remarks" :rows=3 type="textarea" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
        line-height: 2;
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

<script type="text/ecmascript-6">
    import SchoolTree from "../../common/system/SchoolTree.vue";
    import UserDialog from "../../common/system/UserDialog.vue";
    import CustomerDialog from "../../common/supply/CustomerDialog";

    export default {
        data() {
            return {
                tableData: [],
                dialogFormVisible: false,
                total: 0,
                cur_page: 1,
                page_size: 20,
                queryForm: {
                    userId: "",
                    studentId: "",
                    schoolZoneId2: []
                },
                form: {
                    //表单 v-modle绑定的值
                    nameId: "",
                    studentId: "",
                    inviteStatus: 1,
                    inviteTime: "",
                    remarks: "",
                    schoolZoneId: "",
                    schoolName: ""
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
        },
        computed: {},
        methods: {
            //初始化属性start
            getSchoolId() {
                let self = this;
                let user = JSON.parse(sessionStorage.getItem("userInfo"));
                self.form.schoolZoneId = user.schoolZoneId;
                self.form.schoolName = user.schoolZone.name;
                self.schoolId = user.schoolZoneId;
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
            //加载数据
            getData() {
                let self = this;
                self.loading = true;
                self.$axios
                    .post(
                        "supply/getInviteList/" + this.cur_page + "/" + this.page_size,
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
            //保存表单
            submitForm(formName) {
                let self = this;
                self.$refs[formName].validate(valid => {
                    if (valid) {
                        self.loadingForm = true;
                        self.$axios.post("supply/createInvite", this.form).then(res => {
                            var data = res.data;
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
            filterInviteStatus(value, row) {
                if (value.inviteStatus == 1) row.tag = "未到";
                else row.tag = "到达";
                return row.tag;
            },
            //控件方法
            handleEdit(index, row) {
                this.form.fatherId = row.id;
                this.form.fatherName = row.name;
                this.dialogFormVisible = true;
            },
            handleDelete(index, row) {
            },
            handleSchool(data) {
                this.form.schoolName = data.name;
                this.form.schoolZoneId = data.id;
            },
            handleCheckChange(allNode) {
                let self = this;
                self.queryForm.schoolZoneId2 = [];
                for (let i = 0; i < allNode.length; i++) {
                    self.queryForm.schoolZoneId2.push(allNode[i].id);
                }
            }
        },
        components: {SchoolTree, UserDialog, CustomerDialog} //注入组件
    };
</script>



