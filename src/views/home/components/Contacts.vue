<template>
    <div class="contacts-container">
      <div class="sidebar">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          class="filter-input"
        ></el-input>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          default-expand-all
          class="contacts-tree"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="main-content">
        <div class="department-header">
          <h3>{{ selectedDepartment.label }}</h3>
          <div class="sub-departments">
            <h4>下级部门</h4>
            <el-button type="primary" @click="addSubDepartment">添加子部门</el-button>
            <div class="sub-departments-list">
              <div
                v-for="subDept in selectedDepartment.children"
                :key="subDept.id"
                class="sub-department"
              >
                {{ subDept.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="department-members">
          <h4>部门人员</h4>
          <el-button type="primary" @click="addMember">添加成员</el-button>
          <el-button type="danger" @click="deleteMembers">批量删除</el-button>
          <el-table :data="tableData" class="members-table" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="名字"></el-table-column>
            <el-table-column prop="position" label="职位"></el-table-column>
            <el-table-column prop="workId" label="工号"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
//   import { ElMessageBox, ElMessage } from 'element-plus';
  // 搜索关键字
  const filterText = ref('');
  // 选中的部门
  const selectedDepartment = ref({});
  // 树形数据
  const treeData = ref([
    {
      id: 1,
      label: '人工智能',
      children: [
        { id: 2, label: '1班', children: [{ id: 3, label: '子部门' }] },
        { id: 4, label: '2班' },
      ],
    },
  ]);
  // 表格数据，用于展示部门成员，根据选中部门的不同展示不同的数据
    const tableData = ref([
        {
        name: '张三',
        position: '前端工程师',
        workId: '10001',
        phone: '13811111111',
        },
        {
        name: '李四',
        position: '后端工程师',
        workId: '10002',
        phone: '13822222222',
        },
    ]);
  // 总条数, 用于分页
  const total = ref(1);
  // 树形组件默认配置, 用于配置树形数据的字段
  const defaultProps = {
    children: 'children',
    label: 'label',
  };
  // 过滤树节点, 根据关键字过滤
  const filterNode = (value, data) => {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  };
  // 点击树节点, 选中部门
  const handleNodeClick = (data) => {
    selectedDepartment.value = data;
  };

  
  // 添加子部门，如果当前部门下没有子部门，则添加一个子部门，并修改当前部门的 children 属性
  const addSubDepartment = () => {
    ElMessageBox.prompt('请输入子部门名称', '添加子部门', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        // 添加子部门逻辑
        selectedDepartment.value.children.push({
          id: Date.now(),
          label: value,
        });
        ElMessage.success('添加成功');
      })
      .catch(() => {});
  };
  // 添加成员
  const addMember = () => {
    // 输入成员信息逻辑
  };
  // 批量删除成员
  const deleteMembers = () => {
    // 批量删除成员逻辑
  };
  // 分页逻辑
  const handlePageChange = (page) => {
    // 分页逻辑
  };
  </script>
  
  <style scoped>
  .contacts-container {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
    border-right: 1px solid #dcdcdc;
  }
  
  .filter-input {
    margin-bottom: 20px;
  }
  
  .contacts-tree {
    overflow-y: auto;
    max-height: calc(100vh - 60px);
  }
  
  .main-content {
    flex: 3;
    padding: 20px;
    background-color: #dcdcdc;
  }
  
  .department-header {
    margin-bottom: 20px;
  }
  
  .sub-departments {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .sub-departments-list {
    margin-top: 10px;
  }
  
  .sub-department {
    padding: 5px 0;
  }
  
  .department-members {
    margin-top: 20px;
  }
  
  .members-table {
    margin-bottom: 20px;
  }
  </style>
  