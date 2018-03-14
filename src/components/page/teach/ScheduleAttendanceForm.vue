<template>
  <el-dialog title="考勤" :visible.sync="visbile" :close-on-click-modal="false">
    <el-form :model="form" ref="ruleForm">
      <el-table :data="form.attendanceList" stripe v-loading="loading" border style="width: 100%">
        <el-table-column label="姓名" prop="studentName">
          <template slot-scope="scope">
            <el-form-item>
              {{scope.row.studentName}}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone">
          <template slot-scope="scope">
            <el-form-item>
              {{scope.row.phone}}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="考勤状态">
          <template slot-scope="scope">
            <el-form-item :prop="'attendanceList.' + scope.$index + '.attendanceStatus'" :rules="{validator: validateAttendanceStatus}">
              <el-select v-model="scope.row.attendanceStatus" placeholder="请选择">
                <el-option label="未考勤" :value="1"></el-option>
                <el-option label="到" :value="2"></el-option>
                <el-option label="未到" :value="3"></el-option>
              </el-select>
            </el-form-item>

          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-form-item :prop="'attendanceList.' + scope.$index + '.remarks'">
              <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visbile=false;">取 消</el-button>
      <el-button :loading="loadingForm" :disabled="this.form.attendanceList.length==0" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserDialog from "../../common/system/UserDialog.vue";
import RoomDialog from "../../common/teach/RoomDialog.vue";
//getClassSchedule
import { getStudentAttendanceAll, doSaveAttendance } from "../../api/api";
export default {
  data() {
    return {
      visbile: false,
      loadingForm: false,
      formLabelWidth: "120px",
      loading: false,
      total: 0,
      cur_page: 1,
      page_size: 100,
      tableData: [],
      queryForm: {
        scheduleId: "",
      },
      form: {
        scheduleId: "",
        attendanceList: []
        // studentName: "",
        // phone: "",
        // attendanceId: "",
        // attendanceStatus: "",
        // remarks: ""
      }
    }
  },
  methods: {
    validateAttendanceStatus(rule, value, callback) {
      if (value === 1) {
        callback(new Error('请选择学生考勤状态!'));
      } else {
        callback();
      }
    },
    openDialog(id) {
      this.queryForm.scheduleId = id;
      this.form.scheduleId = id;
      this.getData();
      this.visbile = true;
    },
    getData() {
      let self = this;
      self.loading = true;
      getStudentAttendanceAll(
        self.cur_page,
        self.page_size,
        self.queryForm
      ).then(data => {
        self.loading = false;
        if (data.code == 200) {
          self.form.attendanceList = [];
          data.data.list.forEach(item => {
            // let attendanceStatus = item.attendanceStatus;
            // if (item.attendanceStatus == 1) {//未考勤，默认到
            //   attendanceStatus = 2;
            // }
            let obj = {
              studentName: item.studentName, phone: item.phone, id: item.id,
              attendanceStatus: item.attendanceStatus, remarks: item.remarks
            }
            self.form.attendanceList.push(obj);
          })
        } else {
          self.$message.error(data.data);
        }
      });
    },
    submitForm(refForm) {
      let self = this;
      self.$refs[refForm].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          doSaveAttendance({ attendanceFormStr: JSON.stringify(this.form) }).then(data => {
            self.loadingForm = false;
            if (data.code == 200) {
              self.$message.success(data.message);
              self.visbile = false;
              self.$emit("saveSuccess", data.data);
            } else {
              self.$message.error(data.data);
            }
          })
        } else {
          return false;
        }
      })

    }
  },
  components: { UserDialog, RoomDialog } //注入组件
}
</script>
