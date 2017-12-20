<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item>
                    <el-input v-model="queryForm.userName" placeholder="用户名" class="handle-input mr10"></el-input>
                </el-form-item>
                <!-- <el-form-item >
                    <el-select v-model="queryForm.theType"   value=1 clearable placeholder="登录类型" class="handle-select mr10" >
                        <el-option key="1" label="登录" value="1"></el-option>
                        <el-option key="2" label="退出" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <school-tree :is-show-checkbox=true :the-type="2" place-text="校区"
                                 @handleCheckChange="handleCheckChange"></school-tree>
                </el-form-item>

                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <div style="margin:5px;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible=true">开班</el-button>
            <el-button type="success" icon="el-icon-download" size="mini">导出信息</el-button>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column
                label="校区" prop="schoolZoneName">
            </el-table-column>
            <el-table-column
                label="名称"
                prop="name">
            </el-table-column>
            <el-table-column
                label="课程"
                prop="courseName">
            </el-table-column>
            <el-table-column
                label="教室"
                prop="roomName">
            </el-table-column>
            <el-table-column
                label="班主任"
                prop="teacherName">
            </el-table-column>
            <el-table-column
                label="主教"
                prop="mainTeacherName">
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="createTime">
            </el-table-column>
            <el-table-column
                label="计划开班日期"
                prop="startDate">
            </el-table-column>
            <el-table-column
                label="计划结课日期"
                prop="endDate">
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
        <el-dialog title="开班" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
            <el-form :model="form" ref="ruleForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name"
                              :rules="[{ required: true, message: '班级名称必填'}]">
                    <el-input v-model="form.name" placeholder="班级名称"></el-input>
                </el-form-item>
                <el-form-item label="课程" :label-width="formLabelWidth" prop="courseId"
                              :rules="[{ required: true, message: '课程必填'}]">
                    <course v-model="form.courseId"></course>
                </el-form-item>
                <el-form-item label="校区" :label-width="formLabelWidth" prop="schoolName"
                              :rules="[{ required: true, message: '校区必填'}]">
                    <school-tree @nodeClick="handleSchool" :name="form.schoolName" :the-type="2" place-text="校区"
                                 :default-value="schoolId"></school-tree>
                </el-form-item>
                <el-form-item label="主教" :label-width="formLabelWidth" prop="mainTeacherId">
                    <user-dialog v-model="form.mainTeacherId" title="选择主教"
                                 :the-type="3" :parent-school-id="form.schoolZoneId"
                                 placeholder-text="主教"></user-dialog>
                </el-form-item>
                <el-form-item label="班主任" :label-width="formLabelWidth" prop="teacherId">
                    <user-dialog v-model="form.teacherId" title="选择班主任"
                                 :the-type="3" :parent-school-id="form.schoolZoneId"
                                 placeholder-text="班主任"></user-dialog>
                </el-form-item>
                <el-form-item label="默认教室" :label-width="formLabelWidth" prop="roomId">
                    <room-dialog v-model="form.roomId" :parent-school-id="form.schoolZoneId"
                                 :is-all="false"></room-dialog>
                </el-form-item>
                <el-form-item label="计划开班日期" :label-width="formLabelWidth" prop="startDate">
                    <el-date-picker
                        v-model="form.startDate"
                        type="date" value-format="yyyy-MM-dd"
                        placeholder="计划开班日期" :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="计划结课日期" :label-width="formLabelWidth" prop="endDate">
                    <el-date-picker
                        v-model="form.endDate" :picker-options="pickerOptions2"
                        type="date" value-format="yyyy-MM-dd"
                        placeholder="计划结课日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                    <el-input v-model="form.remarks" :rows=3 type="textarea" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="loadForm" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
                    theDate: "",
                    theType: "",
                    schoolZoneId2: []
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                form: {
                    //表单 v-modle绑定的值
                    name: "",
                    courseId: "",
                    mainTeacherId: "",
                    teacherId: "",
                    startDate: "",
                    endDate: "",
                    schoolZoneId: "",
                    schoolName: ""
                },
                pickerOptions2: {
                    disabledDate: (time) => {
                        if (this.form.startDate) {
                            return time.getTime() < new Date(this.form.startDate);
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
            this.getSchoolId();
        },
        computed: {
            //实时计算
            startDate() {
                return this.form.startDate;
            }
        },
        watch: {
            startDate(val) {
                this.form.endDate = "";
            }
        },
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
                        "teach/getSchoolClassList/" + this.cur_page + "/" + this.page_size,
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
                        self.$axios.post("teach/createSchoolClass", this.form).then(res => {
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
        components: {SchoolTree, Course, UserDialog, RoomDialog} //注入组件
    };
</script>
