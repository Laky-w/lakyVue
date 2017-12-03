<<template>
<div>
    <el-tree
    :data="data4"
    :props="defaultProps"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :render-content="renderContent">
    </el-tree>
</div>
</template>
<script>
  let id = 1000;

  export default {
    data() {
      return {
        data4: [{
          id: 1,
          label: '系统',
          children: [{
            id: 4,
            label: '校区设置',
            children: [{
              id: 9,
              label: '校区和部门'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          type:1,
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
        renderContent(h, { node, data, store }) {
            return (
            <span style="flex:1,display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                <span>{node.label}</span>
                </span>
                <span>{!data.children?<el-checkbox >增加</el-checkbox>:""}</span>
                <span>{!data.children?<el-checkbox >删除</el-checkbox>:""}</span>
                <span>{!data.children?<el-checkbox >修改</el-checkbox>:""}</span>
            </span>);
        }
    }
  };
</script>