<template>
  <el-dialog title="导入生源" :visible.sync="visible" width="750px" :close-on-click-modal=false custom-class="dialog-form">

    <!-- <div style="height: 300px;display: inline-block;">
      <el-steps direction="vertical" :active="4">
        <el-step title="1">
          <el-button type="primary">下载模板</el-button>
        </el-step>
        <el-step title="2"></el-step>
        <el-step title="3"></el-step>
        <el-step title="4"></el-step>
      </el-steps>
    </div> -->
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item label="导入模板" :label-width="formLabelWidth">
        <a :href="baseUrl+'resource/生源导入模板.xls'">
          <el-button type="primary">下载模板 </el-button>
        </a>
      </el-form-item>
      <el-form-item label="选择校区" :label-width="formLabelWidth" prop="schoolZoneName" :rules="[{ required: true, message: '校区必填'}]">
        <school-tree @nodeClick="handleSchool" place-text="校区" the-type="2" :name="form.schoolZoneName" :default-value="form.schoolZoneId"></school-tree>
      </el-form-item>
      <el-form-item label="上传文件" :label-width="formLabelWidth" prop="customerExcel" :rules="[{ required: true, message: '选择上传excel'}]">
        <input type="file" @change="getFile($event)" accept="application/vnd.ms-excel">
        <!-- <el-upload class="upload-demo" @on-change="handleChange" action="" :file-list="form.customerExcel" ref="upload" :auto-upload="false" :multiple="false" :limit="1">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload> -->
      </el-form-item>
    </el-form>
    <div class="warning">
      <p>注意事项</p>
      <p>1.上传文件请使用 97-2003 Excel格式，建议按下载到的模板数据为例标准化您的数据在进行导入。</p>
      <p>2.上传的生源数据姓名和手机是必填的，且联系人为空的话默认联系人为本人。</p>
      <p>3.上传的生源数据负责人默认为导入人，跟进状态为未跟进。</p>
      <p>4.系统会对手机号进行重复验证，如果某行数据手机号系统已存在，则会对该行数据进行跳过处理。</p>
      <p>5.系统最大导入数据量为2000条，如果数据量超过上限，所有数据都会导入失败哦！这时建议您按每次2000条对数据进行分批次导入。</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loadingForm" type="primary" @click="submitForm('ruleForm')">导 入</el-button>
    </div>
  </el-dialog>
</template>
<style >
.warning {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 20px 0;
}
.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}
.upload-demo .el-upload--text {
  width: 120px;
  height: 30px;
  border: 0px;
}
</style>

<script>
import SchoolTree from "../../common/system/SchoolTree.vue";
import UserDialog from "../../common/system/UserDialog.vue";
import MarketActivityDialog from "../../common/supply/MarketActivityDialog.vue";
import CourseDialog from "../../common/teach/CourseDialog.vue";
import {
  importCustomer,
} from "../../api/api";
export default {
  data() {
    return {
      visible: this.dialogFormVisible,
      baseUrl: this.$axios.defaults.baseURL,
      form: {
        schoolZoneName: this.$schoolZone().name,
        schoolZoneId: this.$schoolZone().id,
        customerExcel: [],
      },//
      titleDialog: "添加生源",
      formLabelWidth: "120px",
      loadingForm: false,
      schoolId: "" //添加用户默认学校id
    };
  },
  watch: {
    dialogFormVisible(val) {
      this.visible = val;
    }
  },
  methods: {
    handleOpenDialog() {
      this.visible = true;

    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleChange(file, fileList) {
      alert(1);
      console.log(file);
    },
    handleSchool(data) {
      this.form.schoolZoneName = data.name;
      this.form.schoolZoneId = data.id;
    },
    getFile(event) {
      let file = event.target.files[0];
      console.log();
      let fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (fileType != "xls") { //格式错误
        this.$message.error("文件格式错误！");
        event.target.value = "";
        return;
      }
      this.form.customerExcel = event.target.files[0];

    },
    //保存表单
    submitForm(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loadingForm = true;
          let formData = new FormData();
          formData.append('name', "hello");
          console.log(this.form.customerExcel);
          formData.append('customerExcel', this.form.customerExcel);
          importCustomer(formData).then(data => {
            self.loadingForm = false;
            console.log(data);
          })
        } else {
          return false;
        }
      });
    },

  },
  props: {
  },
  components: { SchoolTree, UserDialog, MarketActivityDialog, CourseDialog } //注入组件
}
</script>