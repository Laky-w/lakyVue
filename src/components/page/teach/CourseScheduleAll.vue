<template>
  <div class="course-div">
    <div class="handle-box">
      <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px" size="mini">
        <el-form-item prop="className">
          <el-input v-model="queryForm.className" placeholder="班级名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="roomName">
          <el-input v-model="queryForm.roomName" placeholder="教室名称" clearable class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item prop="week" :rules="[{ required: true, message: '该项必填'}]">
          <el-date-picker :picker-options="{firstDayOfWeek:1}" v-model="queryForm.week" type="week" format="yyyy 第 WW 周" placeholder="选择周">
          </el-date-picker>
        </el-form-item>
        <el-button-group>
          <el-button size="mini" icon="el-icon-search" @click="search('queryForm')">搜索</el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==false" type="primary" icon="el-icon-arrow-down" @click="isShowMore=true"></el-button>
          <el-button size="mini" style="padding:7px" v-if="isShowMore==true" type="primary" icon="el-icon-arrow-up" @click="isShowMore=false"></el-button>
        </el-button-group>
        <el-button size="mini" icon="el-icon-refresh" @click="$refs['queryForm'].resetFields();search('queryForm')">重置</el-button>
        <div v-show="isShowMore">
          <!-- <el-form-item>
            <school-tree :is-show-checkbox=true :the-type="2" place-text="校区" @handleCheckChange="handleCheckChange"></school-tree>
          </el-form-item> -->
          <el-form-item prop="teachName">
            <el-input v-model="queryForm.teachName" placeholder="主教姓名" clearable class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="helpTeacherName">
            <el-input v-model="queryForm.helpTeacherName" placeholder="助教姓名" clearable class="handle-input mr10"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table class="course-schedule" :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column label="时间" prop="time" width="80px" class-name="title">
        <template slot-scope="scope">
          <div>{{scope.row.time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="星期一" prop="monday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.monday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期二" prop="tuesday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.tuesday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期三" prop="wednesday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.wednesday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期四" prop="thursday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.thursday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期五" prop="friday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.friday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期六" prop="saturday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.saturday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="星期日" prop="sunday">
        <template slot-scope="scope">
          <div class="item" v-for="item in scope.row.sunday">
            <p>班级：{{item.schoolClassName}}</p>
            <p>教室：{{item.roomName}}</p>
            <p>时间：{{filterScheduleTime(item)}}</p>
            <p>教师：{{item.teachName}}</p>
            <p>助教：{{item.helpTeacherName}}</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style >
.course-schedule .item {
  background-color: #e3edfd;
  margin: 2px 0px;
  padding-left: 15px;
  /* text-align: center; */
}
.el-table__body .title {
  background-color: #66b1ff;
}
.course-schedule .el-table__row {
  background-color: #fff8da;
}
.course-schedule .title {
  vertical-align: middle;
}
.course-schedule .title .cell {
  height: 100%;
  /* background-color: aliceblue; */
}
.course-schedule tr:hover {
  background: #fff8da;
}
.course-schedule td {
  vertical-align: top;
}
.course-schedule tr:hover > td {
  background-color: #fff8da;
}
.course-div .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff8da;
}
.course-div .el-table--enable-row-hover .el-table__body tr:hover > td.title {
  background-color: #66b1ff;
}
.course-schedule .morning-row {
  background-color: oldlace;
}

.course-schedule .afternoon-row {
  background-color: #f0f9eb;
}
.course-schedule .night-row {
  background-color: #f0f9eb;
}
</style>

<script>
import { getClassScheduleAll } from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      isShowMore: false,
      queryForm: {
        className: "",
        roomName: "",
        teachName: "",
        week: "",
        helpTeacherName: "",
        startTime: []

      },
      loading: false
    }
  },
  created() {
    var date = new Date();
    var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
    date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
    this.queryForm.week = date;
    this.getData();
  },
  methods: {
    search(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getData();
        } else {
          return false;
        }
      });
    },
    getData() {
      let self = this;
      self.loading = true;
      let endDate = new Date(self.queryForm.week.getTime() + (6 * 24 * 60 * 60 * 1000));
      self.queryForm.startTime = [self.queryForm.week.Format("yyyy-MM-dd") + " 00:00:00", endDate.Format("yyyy-MM-dd") + " 23:59:59"];
      getClassScheduleAll(1, 1000, self.queryForm).then(data => {
        self.loading = false;
        if (data.code == 200) {
          let list = data.data.list;
          self.tableData = self.parseData(list);
        }
      })
    },
    parseData(list) {
      let data = [];
      //00：00 - 12：00
      let obj = { time: "上午", monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] };
      //12：00-18：00
      let obj1 = { time: "下午", monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] };
      //18：00-24：00
      let obj2 = { time: "晚上", monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] };
      list.forEach(item => {
        let time = item.startTime;
        console.log(time.substring(11, 19));
        let fullDate = time.substring(0, 10).split("-");
        let times = time.substring(11, 19).split(":");
        let sDate = new Date(fullDate[0], fullDate[1] - 1, fullDate[2], times[0], times[1], times[2]);
        let hour = Number(times[0]);
        let weeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        if (hour >= 0 && hour < 12) {
          obj[weeks[sDate.getDay()]].push(item);
        }
        if (hour >= 12 && hour < 18) {
          obj1[weeks[sDate.getDay()]].push(item);
        }
        if (hour >= 18 && hour <= 24) {
          obj2[weeks[sDate.getDay()]].push(item);
        }
        // let str = sDate.Format("yyyy-MM-dd hh:mm:ss");

        // console.log(time, str);

      })
      data.push(obj);
      data.push(obj1);
      data.push(obj2);
      return data;
    },
    tableRowClassName({ row, rowIndex }) {
      let rowName = "";
      switch (rowIndex) {
        case 1:
          rowName = "warning-row";
          break;
        case 2:
          rowName = "success-row";
          break;
        case 3:
          rowName = "warning-row";
          break;
      }
      return rowName;
    },
    filterScheduleTime(value) {
      if (value.startTime) {
        let time = value.startTime;
        let endTime = value.endTime;//2017-01-22
        return time.substring(11, 16) + "~" + endTime.substring(11, 16);
      } else {
        return "";
      }

    },
  }
}
</script>
