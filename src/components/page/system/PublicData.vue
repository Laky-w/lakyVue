<template>
<div class="table" style="height: 100%;">
  <div class="crumbs">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 系统</el-breadcrumb-item>
        <el-breadcrumb-item>机构参数</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color:#fff9e7">
    <p v-for="(space, levelIndex) in parameterData" @click="parameterChange(levelIndex,space.id)" 
    :class="{active: activeIndex==levelIndex}">{{space.name}}</p>    
    </el-aside>
    <el-container>
      <el-table
            :data="tableData" stripe v-loading="loading" border
            style="width: 100%">
            <el-table-column  
            label="创建人" prop="createUser.name ">
            </el-table-column>
            <el-table-column
            label="名称"
            prop="name">
            </el-table-column>
            <el-table-column
            label="排序"
            prop="sort" sortable>
            </el-table-column>
        </el-table>
    </el-container>
  </el-container>
</div>
</template>



<script>
export default {
  data() {
    return {
      parameterData: [],
      dialogFormVisible: false,
      tableData:[],
      activeIndex:0,
      form: {
        schoolId: "",
        theType: 2,
        userId: "",
        createDatetime: "",
        content: "",
        lastDatetime: ""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      console.log(this.page_size);
      this.page_size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      let self = this;
      self.loading = true;
      self.$axios.get("/organization/findBranchParameterAll").then(res => {
        let data = res.data;
        if (data.code == 200) {
          data.data.forEach(element => {
            element.active=false;
          });
          self.parameterData = data.data;
          // self.parameterData[0].active=true;
          self.getParameterValue(data.data[0].id);
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });

    },
    getParameterValue(id){
      let self = this;
      self.loading = true;
      self.$axios.get("/organization/findBranchParameterValueAll/"+id).then(res => {
        let data = res.data;
        if (data.code == 200) {
          self.tableData = data.data;
          self.loading = false;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    parameterChange(level,id){
      this.activeIndex=level
      this.getParameterValue(id);
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {}
  }
};
</script>

<style scoped>
  p{
    height: 50px;
    line-height: 50px;
    width: 185px;
    margin: 5px 0px;
    padding-left:15px;
    cursor: pointer;
    font-size: 14px;
  }
  p:first-child{
    margin-top: 0px;
  }
  p:hover{
    background-color: #71afef;
    color: white;
  }
  p.active{
    background-color: #66b1ff;
    color: white;
  }
</style>
