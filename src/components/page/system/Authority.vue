<template>
  <el-dialog title="添加职能" :visible.sync="visible" :close-on-click-modal=false :fullscreen="true" custom-class="dialog-form">
    <div class="table">
      <el-form ref="authorityform" :model="authorityform" label-width="80px">
        <el-form-item label="职能名称" prop="name" style="width:100%" :rules="[{ required: true, message: '名称必填'}]">
          <el-input v-model="authorityform.name" clearable placeholder="职能名称" class="handle-input mr10">
          </el-input>
        </el-form-item>
        <el-form-item label="职能描述" prop="remarks" style="width:100%">
          <el-input v-model="authorityform.remarks" :rows=3 type="textarea" placeholder="职能描述"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%" :row-style="showTr" border="" :row-class-name="selectTr">
        <el-table-column fixed="left" width="300px" label="菜单">
          <template slot-scope="scope">
            <span v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
            <span style="cursor: pointer;color: #3a8ee6;" v-if="toggleIconShow(scope.row)" @click="toggle(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-circle-plus-outline" aria-hidden="true"></i>
              <i v-if="scope.row._expanded" class="el-icon-remove-outline" aria-hidden="true"></i>
            </span>
            <i :class="scope.row.icon"></i>
            {{ scope.row.title }}
          </template>

        </el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <el-checkbox v-if="scope.row.authoritiyCount>0" v-model="scope.row.checkAll" :indeterminate="scope.row.isIndeterminate" :true-label="scope.row.id+':true'" :false-label="scope.row.id+':false'" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group style="display: inline-block;" v-model="scope.row.checkedAuthorities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item, levelIndex) in scope.row.authorities" :label="item.id" :key="item.id">{{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="margin:10px 10px 0px 10px;text-align: right; background-color: #f0f0f0;">
        <el-button @click="$router.push('/员工职能');">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('authorityform')">保 存</el-button>
      </div> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('authorityform')">保 存</el-button>
    </div>
  </el-dialog>
</template>

<style>
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
import { getMenu, getRoleDetail, createNewRole } from "../../api/api";
export default {
  data() {
    return {
      checkAll: true,
      tableData: [],
      treeStructure: true,
      dialogFormVisible: false,
      visible: false,
      oldAuthorities: [],
      oldAuthorityform: {
        name: "",
        authorities: [],
        remarks: ""
      },
      authorityform: {
        name: "",
        authorities: [],
        remarks: ""
      },
      formLabelWidth: "120px",
      loading: false,
      loadingForm: false
    };
  },
  created() {
    // this.getdata();
  },
  methods: {
    openDialog() {
      this.visible = true;
      this.authorityform = this.oldAuthorityform;
      this.oldAuthorities = [];
      this.getData();
    },
    openEditDialog(id) {
      getRoleDetail(id).then(data => {
        if (data.code == 200) {
          this.visible = true;
          let obj = {
            id: data.data.id,
            name: data.data.name,
            remarks: data.data.remarks
          }
          this.authorityform = obj;
          this.oldAuthorities = data.data.roleAuthorities;
          this.getData();
        }
      })
    },
    showTr(tr) {
      let row = tr.row;
      let subsCheckedCount = this.getSubsCheckedCount(row.id);
      row["isIndeterminate"] =
        subsCheckedCount > 0 && subsCheckedCount < row["authoritiyCount"];
      row["checkAll"] =
        subsCheckedCount == row["authoritiyCount"]
          ? row.id + ":true"
          : row.id + ":false";
      let show = row._parent ? this.getParentExpanded(row) : true;
      return show ? "" : "display:none;";
    },
    selectTr(row) {
      if (row.row.selected) {
        return "selectTr";
      }
    },
    getSubsCheckedCount(id) {
      let self = this;
      let i = 0;
      Array.from(self.tableData).forEach(function (record) {
        if (record.id == id) {
          i += record.checkedAuthorities ? record.checkedAuthorities.length : 0; //选中的权限
        }
        if (record.parentId == id) {
          if (record.subs && record.subs.length > 0) {
            i += self.getSubsCheckedCount(record.id);
          }
          i += record.checkedAuthorities ? record.checkedAuthorities.length : 0; //选中的权限
        }
      });
      return i;
    },

    getParentExpanded(row) {
      if (row._parent) {
        if (!(row._parent._expanded && row._parent._show)) {
          return false;
        } else {
          return this.getParentExpanded(row._parent);
        }
      } else {
        return row._expanded && row._show;
      }
    },
    getData() {
      let self = this;
      self.loading = true;
      getMenu().then(data => {
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
      Array.from(data).forEach(function (record) {
        if (record._expanded === undefined) {
          record["_expanded"] = false;
        }
        if (parent) {
          record["_parent"] = parent;
        }
        let _level = 0;
        if (level !== undefined && level !== null) {
          if (record.theType == 2) {
            _level = level + 1;
          } else {
            _level = level + 2;
          }
        }
        record["selected"] = false;
        record["_show"] = true;
        record["checkAll"] = false;
        record["_level"] = _level;
        record["checkedAuthorities"] = [];//已选择的
        self.oldAuthorities.forEach(item => {
          if (item.menuId == record.id) {
            console.log(item.menuId);
            record["checkedAuthorities"].push(item.authorityId);
          }
        })
        console.log(record["checkedAuthorities"]);
        record["authoritiyCount"] = record.authorities
          ? record.authorities.length
          : 0;
        tmp.push(record);
        if (record.subs && record.subs.length > 0) {
          let children = self.parseSchoolTree(
            record.subs,
            record,
            _level,
            expandedAll
          );
          tmp = tmp.concat(children);
          let authoritiyCount = 0;
          Array.from(children).forEach(function (node) {
            authoritiyCount += node.authorities ? node.authorities.length : 0;
          });
          record["authoritiyCount"] += authoritiyCount;
        }
      });

      return tmp;
    },
    getTabsChecked() {
      let self = this;
      self.authorityform.authorities = [];
      self.tableData.forEach(record => {
        if (record.checkedAuthorities && record.checkedAuthorities.length > 0) {
          self.authorityform.authorities = self.authorityform.authorities.concat(
            record.checkedAuthorities
          );
        }
      });
    },
    submitForm(formName) {
      const self = this;
      self.getTabsChecked();
      if (self.authorityform.authorities.length == 0) {
        self.$message.error("请选择权限！");
        return;
      }
      self.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingForm = true;
          createNewRole(self.authorityform).then(data => {
            this.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.visible = false;
              self.$emit("saveSuccess", data.data);
              // self.$router.push("/员工职能");
            } else {
              self.$message.error(data.data);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 展开下级
    toggle: function (trIndex) {
      let me = this;
      let record = me.tableData[trIndex];
      record._expanded = !record._expanded;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(record) {
      let me = this;
      if (me.treeStructure && record.subs && record.subs.length > 0) {
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
      if (row.theType === 1) return true;
      return row.theType == value;
    },
    handleEdit(index, row) {
      this.form.fatherId = row.id;
      this.form.fatherName = row.name;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) { },
    handleCheckAllChange(val) {
      let vals = val.split(":");
      console.log(vals);
      //改变选中值。
      let self = this;
      Array.from(self.tableData).forEach(function (record) {
        if (vals[0] == record.id) {
          let authorities = [];
          // record.checkAll="5:true";
          if (record.subs && record.subs.length > 0) {
            self.changeSubsChecked(record.id, vals[1]);
          }
          for (let i in record.authorities) {
            authorities.push(record.authorities[i].id);
          }
          // `let authorities =;
          // record._parent["checkAll"]=true;
          record.checkedAuthorities = vals[1] == "true" ? authorities : [];
          return;
        }
      });
      // this.checkedCities = val ? cityOptions : [];

      //改变半选状态
      //this.isIndeterminate = false;
    },
    changeSubsChecked(id, flag) {
      let self = this;
      Array.from(self.tableData).forEach(function (record) {
        if (record.parentId == id) {
          //
          let authorities = [];
          if (record.subs && record.subs.length > 0) {
            self.changeSubsChecked(record.id, flag);
          }

          record.checkAll = record.id + ":" + flag;
          for (let i in record.authorities) {
            authorities.push(record.authorities[i].id);
          }
          record.checkedAuthorities = flag == "true" ? authorities : [];
        }
      });
    },
    handleCheckedCitiesChange(value) {
      console.log("====");
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
};
</script>
