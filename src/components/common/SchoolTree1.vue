<template>
  <div style="height:50px;position:relative;">
    <span @click="isShow=!isShow">
      <el-input 
        placeholder="校区/部门" :clearable=true readonly=""
        v-model="filterText">
        <i slot="suffix"  style="cursor: pointer;" class="el-input__icon el-icon-arrow-down"></i>
      </el-input>
    </span>
    <div :class="{treeDivH:isShow,treeDiv:true}">
      <el-tree
        class="filter-tree" :expand-on-click-node=false
        :data="data2" node-key="id" 
        :props="defaultProps" 
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick" :show-checkbox="isShowCheckbox"
         @check-change="handleCheckChange"
        ref="tree2">
      </el-tree>
    </div>
  </div>
</template>
<style scoped>
.treeDivH {
  display: none;
}
.treeDiv{
    position: absolute ;
    z-index: 88;
    width: 99.80%;
    top:42px;
    border: solid 1px #66b1ff;
}
</style>

<script scoped>
export default {
  // watch: {
  //   filterText(val) {
  //     this.$refs.tree2.filter(val);
  //   }
  // },
  created() {
    // 点击其他不在的区域触发事件
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)){
          this.isShow = true; 
      }
    })
    this.getSchool();
  },
  methods: {
    
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    changeShow() {
      this.isShow = false;
    },
    getSchool() {
      let self = this;
      self.loading = true;
      self.$axios.get("organization/findSchoolZoneAll").then(res => {
        let data = res.data;
        self.loading = false;
        if (data.code == 200) {
          let treeArray = [];
          treeArray.push(data.data)
          console.debug(treeArray);
          self.data2 = treeArray;
        } else {
          self.$message.error(data.data);
        }
      });
    },
    handleNodeClick(data) {
      // 
      if(this.isShowCheckbox){
        console.log(data);
        var allNode=this.$refs["tree2"].getCheckedNodes();
        let checked = true;
        for(let i=0;i<allNode.length;i++){
          if(data.id == allNode[i].id){
            checked=false;
            break;
          }
        }
        this.$refs["tree2"].setChecked(data,checked,false,false);
      }else{
        this.filterText=data.name;
        this.isShow=true;
      }
      this.$emit("nodeClick",data);
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      if(indeterminate){
        this.$refs["tree2"].setChecked(data,true,false,false);
      }
      
      var allNode=this.$refs["tree2"].getCheckedNodes();
      let fileName = "";
      for(let i=0;i<allNode.length;i++){
        fileName+=allNode[i].name+",";
      }
      this.filterText=fileName.substring(0,fileName.length-1);
      this.$emit("handleCheckChange",allNode);
    },
  },

  data() {
    return {
      filterText: name,
      checkedNodes:{},
      isShow: true,
      pid:0,
      data2: [
      ],
      defaultProps: {
        children: "childrenList",
        label: "name"
      }
    };
  },
  props: {
    name:"",
    isShowCheckbox:{
      default:false
    }
  }

};
</script>
