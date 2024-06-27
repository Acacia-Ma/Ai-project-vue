<template>
    <div class="department-tree">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        class="filter-input"
      />
      <el-tree
        :data="data"
        :props="defaultProps"
        node-key="department_id"
        ref="tree"
        :expand-on-click-node="true"
        :default-expanded-keys="[1]"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        class="department-tree"
      />
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { addDepartment,addDepart,getSubDepart,getDepartPerson,getdepartment,editDepartment,delDepartment,delDepartPerson } from '@api/contacts';
  
  export default {
    name: 'DepartmentTree',
    emits: ['node-click'], // 声明可发出的事件
  
    setup(props, { emit }) {
      const filterText = ref(''); // 过滤输入框的值
      const tree = ref(null); // 部门树
      const data = ref([]); // 部门树数据
      const defaultProps = ref({
        children: 'children',
        label: 'label',
        value: 'department_id'
      });
  
      // 加载部门数据
      const loadDepartmentData = async () => {
        try {
          const response = await getdepartment();
          if (response.code === 0 && Array.isArray(response.data)) {
            data.value = response.data.map(item => ({
              ...item,
              label: item.label // 确保label是树组件所期望的属性
            }));
          } else {
            ElMessage.error('加载部门数据失败');
          }
        } catch (error) {
          console.error(error);
          ElMessage.error('加载部门数据时发生错误');
        }
      };
  
      // 过滤节点
      const filterNode = (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      };
  
      // 监听 filterText 的变化
      watch(filterText, (newVal) => {
        tree.value.filter(newVal);
      });
  
      // 处理节点点击事件
      const handleNodeClick = (nodeData) => {
        emit('node-click', nodeData); // 发出 node-click 事件
      };
  
      onMounted(() => {
        loadDepartmentData();
      });
  
      return {
        filterText,
        tree,
        data,
        defaultProps,
        loadDepartmentData,
        filterNode,
        handleNodeClick
      };
    }
  };
  </script>
  
  <style scoped>
  .department-tree {
    margin: 20px;
  }
  
  .filter-input {
    margin-bottom: 20px;
  }
  
  .department-tree /deep/ .el-tree {
    width: 100%;
    overflow: auto;
    max-height: 500px;
  }
  </style>