<template>
  <el-date-picker v-model="mVal" value-format="yyyy-MM-dd" type="daterange" align="center" unlink-panels range-separator="至" :start-placeholder="startPlaceholder" @change="handleDateChange" :end-placeholder="endPlaceholder" :picker-options="pickerOptions">
  </el-date-picker>
</template>


<script scoped>
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
        // onPick: function(Data) {
        //   console.log(Data);
        //   console.log(this.mVal);
        // }
      },
      mVal: ""
    };
  },
  created() {
    if (this.value) { //默认值处理
      this.mVal = this.value;
    }
  },
  methods: {
    handleDateChange: function (val) {
      if (val) {
        val[0] = val[0] + " 00:00:00";
        val[1] = val[1] + " 23:59:59";
      }
    }
  },
  watch: {
    value(val) {
      console.log(val);
      if (val != null && val.length == 0 && this.mVal != null && this.mVal.length > 0) {
        this.mVal = [];
      }
    },
    mVal(val) {
      this.$emit("input", val);
    }
  },
  props: {
    value: "",
    startPlaceholder: "",
    endPlaceholder: ""
  }
};
</script>
