<template>
    <div class="table">
        <div class="handle-box">
            <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
                <el-form-item  >
                    <el-input v-model="queryForm.schoolName"  clearable placeholder="校区名称" class="handle-input mr10"></el-input>
                </el-form-item>
                <!-- <el-form-item >
                    <el-select v-model="queryForm.theType"   value=1 clearable placeholder="下级类型" class="handle-select mr10" >
                        <el-option key="1" label="校区" value="1"></el-option>
                        <el-option key="2" label="部门" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-button type="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
            </el-form>
        </div>
        <el-table
            :data="tableData" stripe v-loading="loading"
            style="width: 100%" :row-style="showTr" border="" :row-class-name="selectTr">
            <el-table-column fixed="left" width="300px"
            label="校区" >
            <template slot-scope="scope">
                <span  v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
                <span  style="cursor: pointer;color: #3a8ee6;" v-if="toggleIconShow(scope.row)" @click="toggle(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-circle-plus-outline" aria-hidden="true"></i>
                <i v-if="scope.row._expanded" class="el-icon-remove-outline" aria-hidden="true"></i>
                </span>
                <i :class="{ 'el-icon-sort': scope.row.theType ==1 }"></i>
                <i :class="{ 'el-icon-sold-out': scope.row.theType ==2 }"></i>
                <i :class="{ 'el-icon-tickets': scope.row.theType ==3 }"></i>
                {{ scope.row.name }}
            </template>
            </el-table-column>
            <el-table-column
            label="负责人"
            prop="owner">
            </el-table-column>
            <el-table-column
            label="联系方式"
            prop="phone">
            </el-table-column>
            <el-table-column
            label="职能"
            prop="remarks">
            </el-table-column>
            <!-- <el-table-column
            label="类型"
            prop="theType" :formatter="filterType"> -->


            <el-table-column
              prop="theType"
              label="类型"
              width="100"
              :formatter="filterType"
              :filters="[{ text: '分校', value: '2' }, { text: '部门', value: '3' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <!-- {{scope.row.theType}} -->
                <el-tag
                  :type="scope.row.theType === 2 ? 'primary' : 'success'"
                  close-transition>{{scope.row.theType===1?"总校":""}}{{scope.row.theType===2?"分校":""}}{{scope.row.theType===3?"部门":""}}</el-tag>
              </template>
            </el-table-column>

            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">添加</el-button>
                <!-- <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加校区/部门" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="ruleForm" v-loading="loadingForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name"  :rules="[{ required: true, message: '名称必填'}]">
            <el-input v-model="form.name"  autofocus placeholder="名称"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" required>
                <el-radio-group v-model="form.theType">
                    <el-radio :label="2">校区</el-radio>
                    <el-radio :label="3">部门</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="编号" prop="serial" :label-width="formLabelWidth">
            <el-input v-model="form.serial" placeholder="内部编号"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
            <el-input v-model="form.address" placeholder="地址"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="职能" prop="remarks" :label-width="formLabelWidth">
            <el-input v-model="form.remarks" placeholder="描述、职能"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="owner" :label-width="formLabelWidth">
            <el-input v-model="form.owner" auto-complete="off" placeholder="负责人"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
            <el-input v-model="form.phone" auto-complete="off" placeholder="联系方式"></el-input>
            </el-form-item>
            <el-form-item label="上级部门" :label-width="formLabelWidth"><el-input v-model="form.fatherName" disabled></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<style >
.selectTr > td {
  background-color: rgba(235, 158, 5, 0.48) !important;
}
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
  line-height: 15px;
}
</style>

<script>
export default {
  data() {
    return {
      tableData: [],
      treeStructure: true,
      dialogFormVisible: false,
      queryForm: {
        schoolName: ""
      },
      form: {
        name: "",
        theType: 2,
        serial: "",
        remarks: "",
        owner: "",
        phone: "",
        fatherId: "",
        fatherName: "",
        address: ""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    this.getSchool();
  },
  methods: {
    showTr: function(tr) {
      let row = tr.row;
      let show = row._parent
        ? this.getParentExpanded((row))
        : true;
      return show ? "" : "display:none;";
    },
    selectTr: function(row) {
      if (row.row.selected) {
        return "selectTr";
      }
    },
    getParentExpanded(row){
      if(row._parent){
        if(!(row._parent._expanded && row._parent._show)){
          return false;
        } else{
          return this.getParentExpanded(row._parent);
        }
      } else {
        return (row._expanded && row._show);
      }
    },
    getSchool() {
      let self = this;
      self.loading = true;
      self.$axios.get("organization/findSchoolZoneAll/0").then(res => {
        let data = res.data;
        self.loading = false;
        if (data.code == 200) {
          let treeData = self.parseSchoolTree(data.data, null, null, true);
          console.log(treeData);
          self.tableData = treeData;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    search(form) {
      var self = this;
      if (self.queryForm.schoolName) {
        self.tableData.forEach(record => {
          if (record.name.indexOf(self.queryForm.schoolName) >= 0) {
            console.debug("==");
            // record._expanded = !record._expanded;
            record.selected = true;
          } else {
            //record._show=false;
            record.selected = false;
          }
        });
      }
    },
    parseSchoolTree(data, parent, level, expandedAll) {
      var self = this;
      let tmp = [];
      if (!parent) {
        //根节点
        data["_parent"] = parent;
        data["_expanded"] = expandedAll;
        data["_level"] = 0;
        data["selected"] = false;
        data["_show"] = true;
        tmp.push(data);
        if (data.childrenList && data.childrenList.length > 0) {
          let children = self.parseSchoolTree(
            data.childrenList,
            data,
            0,
            expandedAll
          );
          tmp = tmp.concat(children);
        }
      } else {
        Array.from(data).forEach(function(record) {
          if (record._expanded === undefined) {
            record["_expanded"] = expandedAll;
          }
          if (parent) {
            record["_parent"] = parent;
          }
          let _level = 0;
          if (level !== undefined && level !== null) {
            if(record.theType==2){
              _level = level + 1;
            }else{
              _level = level + 2;
            }
          }
          record["selected"] = false;
          record["_show"] = true;
          record["_level"] = _level;
          tmp.push(record);
          if (record.childrenList && record.childrenList.length > 0) {
            let children = self.parseSchoolTree(
              record.childrenList,
              record,
              _level,
              expandedAll
            );
            tmp = tmp.concat(children);
          }
        });
      }

      return tmp;
    },
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          self.$axios
            .post("organization/createSchoolZone", this.form)
            .then(res => {
              let data = res.data;
              if (data.code == 200) {
                //登录成功
                self.loadingForm = false;
                self.$message.success(data.message);
                self.dialogFormVisible = false;
                self.getSchool();
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
    // 展开下级
    toggle: function(trIndex) {
      let me = this;
      let record = me.tableData[trIndex];
      record._expanded = !record._expanded;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(record) {
      let me = this;
      if (
        me.treeStructure &&
        record.childrenList &&
        record.childrenList.length > 0
      ) {
        return true;
      }
      return false;
    },
    filterType(value, row) {
      if (value.theType == 1) row.tag = "总校";
      else if (value.theType == 2) row.tag = "分校";
      else row.tag = "部门";
      return row.tag;
    },
    filterTag(value, row) {
      if(row.theType===1)return true;

      console.debug(row.theType +"==》"+ value+"==>"+(row.theType == value));
      return row.theType == value;
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
