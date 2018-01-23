<template>
  <div class="table">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item>
          <el-input v-model="queryForm.schoolName" clearable placeholder="校区名称" class="handle-input mr10"></el-input>
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
    <el-table :data="tableData" stripe v-loading="loading" style="width: 100%" :row-style="showTr" border="" :row-class-name="selectTr">
      <el-table-column fixed="left" width="300px" label="校区">
        <template slot-scope="scope">
          <span v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <span style="cursor: pointer;color: #3a8ee6;" v-if="toggleIconShow(scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-circle-plus-outline" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-remove-outline" aria-hidden="true"></i>
          </span>
          <i :class="{ 'el-icon-sort': scope.row.theType ==1 }"></i>
          <i :class="{ 'el-icon-sold-out': scope.row.theType ==2 }"></i>
          <i :class="{ 'el-icon-tickets': scope.row.theType ==3 }"></i>
          <a href="javascript:void(0)" @click="handleView(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="校长/主管" prop="owner">
      </el-table-column>
      <el-table-column label="联系方式" prop="phone">
      </el-table-column>
      <el-table-column label="职能" prop="remarks">
      </el-table-column>
      <!-- <el-table-column
            label="类型"
            prop="theType" :formatter="filterType"> -->

      <el-table-column prop="theType" label="类型" width="100" :formatter="filterType" :filters="[{ text: '分校', value: '2' }, { text: '部门', value: '3' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <!-- {{scope.row.theType}} -->
          <el-tag :type="scope.row.theType === 2 ? 'primary' : 'success'" close-transition>
            {{scope.row.theType===1?"总校":""}}{{scope.row.theType===2?"分校":""}}{{scope.row.theType===3?"部门":""}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="theType" label="状态">
        <template slot-scope="scope">
          <!-- {{scope.row.theType}} -->
          <el-tag :type="scope.row.theStatus === 2 ? 'info' : 'success'" close-transition>
            {{scope.row.theStatus===1?"正常":""}}{{scope.row.theStatus===2?"封存":""}}
          </el-tag>
        </template>
      </el-table-column>

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" @click="handleEdit(scope.$index, scope.row)" @command="handleCommand" size="small">
            修改
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.theType!==3" :command="{row:scope.row,type:'add'}">添加下级</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.theType!==1" :command="{row:scope.row,type:'delete'}">删除</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.theType!==1 && scope.row.theStatus ==2" :command="{row:scope.row,type:'normal'}">启用</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.theType!==1 && scope.row.theStatus ==1" :command="{row:scope.row,type:'sealup'}">封存</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <school-zone-view :view-id="viewId" :dialog-view-visible.sync="dialogViewVisible" ref="view"></school-zone-view>
    <el-dialog :title="form.id?('修改'+form.name):'添加校区/部门'" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '名称必填'}]">
          <el-input v-model="form.name" autofocus placeholder="名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" v-if="form.id==''" :label-width="formLabelWidth" required>
          <el-radio-group v-model="form.theType">
            <el-radio :label="2">校区</el-radio>
            <el-radio :label="3">部门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编号" prop="serial" :label-width="formLabelWidth">
          <el-input v-model="form.serial" placeholder="内部编号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="form.address" placeholder="地址" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职能" prop="remarks" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" placeholder="描述、职能" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="校长/主管" prop="owner" :label-width="formLabelWidth">
          <el-input v-model="form.owner" auto-complete="off" placeholder="校长/主管"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item label="所属校区" :label-width="formLabelWidth">
          <el-input v-model="form.fatherName" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.selectTr > td {
  background-color: rgba(235, 158, 5, 0.48) !important;
}
.top > td {
  background-color: #ecf6ff !important;
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
import SchoolZoneView from "./SchoolZoneView.vue";
import { findSchoolZoneAll, createSchoolZone, getSchoolZoneView, deleteSchoolZone, sealUpSchoolZone, normalSchoolZone } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      viewId: "",//详情id
      treeStructure: true,
      dialogFormVisible: false,
      dialogViewVisible: false,
      visible2: false,
      queryForm: {
        schoolName: ""
      },
      oldform: {
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
      form: {
        id: "",
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
    parseStr(object) {
      console.log(object);
      return JSON.stringify(object);
    },
    showTr: function (tr) {
      let row = tr.row;
      let show = row._parent ? this.getParentExpanded(row) : true;
      return show ? "" : "display:none;";
    },
    selectTr: function (row) {
      if (row.row.selected) {
        return "selectTr";
      }
      if (row.rowIndex == 0) {
        return "top";
      }
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
    getSchool() {
      let self = this;
      self.loading = true;
      findSchoolZoneAll(0).then(data => {
        self.loading = false;
        if (data.code == 200) {
          let treeData = self.parseSchoolTree(data.data, null, null, true);
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
          record["_level"] = _level;
          //record["_expanded"]
          tmp.push(record);
          if (record.childrenList && record.childrenList.length > 0) {
            let children = self.parseSchoolTree(
              record.childrenList,
              record,
              _level,
              false
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
          createSchoolZone(self.form).then(data => {
            if (data.code == 200) {
              self.loadingForm = false;
              self.$message.success(data.message);
              self.dialogFormVisible = false;
              self.getSchool();
              self.$refs[formName].resetFields();
            } else {
              this.$message.error(data.data);
            }
          })
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
      if (row.theType === 1) return true;
      return row.theType == value;
    },
    handleView(id) {
      let self = this;
      self.viewId = id;
      self.dialogViewVisible = true;
    },
    handleCommand(command) {
      switch (command.type) {
        case "add":
          this.handleAdd(command.row);
          break;
        case "delete":
          this.handleDelete(command.row);
          break;
        case "normal":
          this.handleNormal(command.row);
          break;
        case "sealup":
          this.handleSealup(command.row);
          break;
      }
    },
    handleAdd(row) {
      this.form = this.oldform;
      this.form.fatherName = row.name;
      this.form.fatherId = row.id;
      this.dialogFormVisible = true;
    },
    handleEdit(index, row) {
      let self = this;
      getSchoolZoneView(row.id).then(data => {
        this.dialogFormVisible = true;
        self.form = data.data;
        self.form.fatherId = "";
        self.form.fatherName = data.data.fatherName;
      })
    },
    handleDelete(row) {
      let self = this;
      self.$confirm('该操作会把当前校区的部门，及所属下级校区的数据会全部删除。请谨慎操作！ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        deleteSchoolZone(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getSchool();
          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
      // getSchoolZoneView(row.id).then(data => {
      //   this.dialogFormVisible = true;
      //   self.form = data.data;
      // })
    },
    handleNormal(row) {
      let self = this;
      self.$confirm('确定启用该校区吗，启用后该校区的所属数据会恢复正常！是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        normalSchoolZone(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getSchool();
          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
      // getSchoolZoneView(row.id).then(data => {
      //   this.dialogFormVisible = true;
      //   self.form = data.data;
      // })
    },
    handleSealup(row) {
      let self = this;
      self.$confirm('该操作会把当前校区的部门，及所属下级校区的数据会全部封存。请谨慎操作！ 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', closeOnClickModal: false
      }).then(() => {
        sealUpSchoolZone(row.id).then(data => {
          if (data.code == 200) {
            self.$message.success(data.message);
            self.getSchool();
          } else {
            this.$message.error(data.message);
          }
        })
      }).catch(() => {
      });
      // getSchoolZoneView(row.id).then(data => {
      //   this.dialogFormVisible = true;
      //   self.form = data.data;
      // })
    }
  },
  components: { SchoolZoneView } //注入组件
};
</script>
