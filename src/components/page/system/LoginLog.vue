<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统</el-breadcrumb-item>
                <el-breadcrumb-item>登录日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.userName"  placeholder="用户名" class="handle-input mr10"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="queryForm.theType"   value=1 clearable placeholder="登录类型" class="handle-select mr10" >
                        <el-option key="1" label="登录" value="1"></el-option>
                        <el-option key="2" label="退出" value="2"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item >
                    <el-date-picker
                        v-model="queryForm.theDate" value-format="yyyy-MM-dd"
                        type="daterange" align="center"unlink-panels range-separator="至"
                        start-placeholder="登录日期"
                        end-placeholder="登录日期" :picker-options="pickerOptions2">
                    </el-date-picker>
                 </el-form-item>
               
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <el-table :data="tableData"  v-loading="loading" :row-class-name="tableRowClassName" border stripe style="width: 100%" >
            <el-table-column prop="user.name" label="用户名" sortable width="150">
            </el-table-column>
            <el-table-column prop="ip" label="登录IP" width="120">
            </el-table-column>
            <el-table-column prop="schoolZone.name" label="校区" >
            </el-table-column>
            <el-table-column prop="theType" label="操作" :formatter="filterType">
            </el-table-column>
            <el-table-column prop="theDatetime" sortable label="登录时间" >
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change ="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totol">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                totol:0,
                cur_page: 1,
                page_size:20,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                queryForm: {
                    userName:'',
                    theDate:'',
                    theType: ''
                },
                // loading:true,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.tableData.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.address.indexOf(self.select_cate) > -1 && 
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.address.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            handleSizeChange(val){
                console.log(this.page_size);
                this.page_size = val;
                this.getData();
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                self.loading=true;
                self.$axios.post("log/findLoginLog/"+this.cur_page+"/"+this.page_size,this.queryForm).then( (res) => {
                    var data = res.data;
                    if (data.code==200) {
                        self.totol=data.data["total"];
                        self.tableData=data.data.list;
                        self.loading=false;
                    } else {
                        self.$message.error(data.data);
                    }
                 })
            },
            tableRowClassName({row, rowIndex}) {
                if (row.theType == 2) {
                    return 'warning-row';
                } 
                return '';
            },
            search(form){
                this.cur_page=1;
                console.debug(this.queryForm.theDate);
                if(this.queryForm.theDate){
                    this.queryForm.theDate1=this.queryForm.theDate[0] +" 00:00:00";
                    this.queryForm.theDate2=this.queryForm.theDate[1] +" 23:59:59";
                }
                this.getData();
            },
            formatter(row, column) {
                return row.address;
            },
            filterType(value, row) {
                if(value.theType==1) 
                    row.tag="登录";
                else
                    row.tag="退出";
                return row.tag;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
<style type="text/css">
    .el-table .warning-row td{
        background: oldlace !important;
    }
   
    .el-table .success-row {
        background: #f0f9eb;
    }
</style>

<style scoped>
</style>