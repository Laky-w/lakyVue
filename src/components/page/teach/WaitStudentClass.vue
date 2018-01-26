<template>
  <el-dialog title="分班" :visible.sync="visible" :close-on-click-modal="false" custom-class="dialog-form">
    <div class="table">
      <el-table :data="tableData" stripe v-loading="loading" border @row-click="handleRowClick" style="width: 100%">
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="课程" prop="courseName">
        </el-table-column>
        <el-table-column label="教室" prop="roomName">
        </el-table-column>
        <el-table-column label="班主任" prop="teacherName">
        </el-table-column>
        <el-table-column label="主教" prop="mainTeacherName">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 50, 100, 200]" :page-size="page_size" layout="total,prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="float: left;">
        已选择：
        <el-input size="small" style="width:70%;" v-model="selected.name" disabled>
        </el-input>
      </div>
      <el-button size="small" @click="visible=false">取消</el-button>
      <el-button size="small" type="primary" :loading="loadingForm" @click="saveStudentClass">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSchoolClassList, updateStudentClass } from "../../api/api";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      loadingForm: false,
      tableData: [],
      total: 0,
      cur_page: 1,
      page_size: 20,
      queryForm: {
        courseId: "",
        schoolZoneId2: []
      },
      selected: "",
      form: {
        studentClassIds: "",
        classId: "",
      }
    }
  },
  methods: {
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
    openDialog(courseId, studentIds) {
      this.visible = true;
      this.cur_page = 1;
      this.queryForm.courseId = courseId;
      this.queryForm.schoolZoneId2 = [];
      this.queryForm.schoolZoneId2.push(this.$schoolZone().id);
      this.form.studentClassIds = studentIds;
      this.getData();
    },
    getData() {
      let self = this;
      getSchoolClassList(self.cur_page, self.page_size, self.queryForm
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
    saveStudentClass() {
      let self = this;
      self.form.classId = self.selected.id;
      if (self.form.classId) {
        console.log(this.form);
        self.loadingForm = true;
        updateStudentClass(this.form).then(data => {
          self.loadingForm = false;
          if (data.code == 200) {

          } else {

          }
        })
      } else {
        self.$message.error("请选择班级");
        return false;
      }

    },
    handleRowClick(val) {
      this.selected = val;
    }
  }

}
</script>

