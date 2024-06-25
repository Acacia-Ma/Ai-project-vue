<template>
  <div class="contacts-container">
    <div class="sidebar">
      <!-- 过滤输入框 -->
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        class="filter-input"
      />
      <!-- 部门树 -->
      <el-tree
        :data="data"
        :props="defaultProps"
        node-key="id"
        ref="tree"
        :expand-on-click-node="false"
        :default-expanded-keys="[1, 2]"
        :filter-node-method="filterNode"
        :filter="filterText"
        @node-click="handleNodeClick"
        class="contacts-tree"
      />
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 部门信息 -->
      <div class="department-header">
        <h3>{{ selectedNode.label }}
          <!-- 编辑按钮 -->
          <el-button
            v-if="!isRootNode(selectedNode)"
            type="primary"
            @click="editDepartmentName"
            class="edit-button"
          >
            编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            v-if="!isRootNode(selectedNode) && !hasChildren(selectedNode)"
            type="danger"
            @click="deleteDepartment"
            class="edit-button"
          >
            删除
          </el-button>
        </h3>
      </div>
      <!-- 下级部门 -->
      <div class="sub-departments">
        <h4>下级部门</h4>
        <el-button type="primary" @click="addSubDepartment">添加子部门</el-button>
        <el-table
          :data="selectedNode.children"
          class="sub-departments-table"
          @selection-change="handleMembersSelectionChange"
        >
          <el-table-column prop="label" label="部门名称"></el-table-column>
        </el-table>
      </div>
      <!-- 部门人员 -->
      <div class="department-members">
        <h4>部门人员</h4>
        <el-button type="primary" @click="addMember">添加成员</el-button>
        <el-button
          type="danger"
          style="margin-left: 10px;"
          :disabled="!hasSelectedMembers"
          @click="deleteMembers"
        >
          批量删除
        </el-button>
        <span class="selected-members-info">
          已选择 {{ selectedMembers.length }} 名成员
        </span>
        <el-table
          :data="tableData"
          @selection-change="handleMembersSelectionChange"
          class="members-table"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名字"></el-table-column>
          <el-table-column prop="position" label="职位"></el-table-column>
          <el-table-column prop="jobNumber" label="工号"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { addDepartment,addDepart,getSubDepart,getDepartPerson,getdepartment,editDepartment,delDepartment,delDepartPerson } from '@api/contacts';


// 过滤输入框的值
const filterText = ref('');

// 部门树
const tree = ref(null);

// 部门树数据
const data = ref([
  {
    id: 1,
    label: '人工智能',
    children: [
      {
        id: 2,
        label: '1班',
        children: [{ id: 3, label: '子部门' }]
      },
      { id: 4, label: '2班' }
    ]
  }
]);

// 默认属性配置
const defaultProps = ref({
  children: 'children',
  label: 'label'
});

// 选中的部门
const selectedNode = ref(data.value[0].children?.[0] || data.value[0]);

// 表格数据
const tableData = ref([
  { name: '张三', position: '经理', jobNumber: '001', phone: '12345678901' },
  { name: '李四', position: '员工', jobNumber: '002', phone: '12345678902' },
]);

// 选中的成员
const selectedMembers = ref([]);

// 是否有选中的成员
const hasSelectedMembers = computed(() => selectedMembers.value.length > 0);

// 总数
const total = ref(tableData.value.length);

// 过滤节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

// 监听 filterText 的变化
watch(filterText, (val) => {
  tree.value.filter(val);
});

// 处理节点点击事件
const handleNodeClick = (nodeData) => {
  selectedNode.value = nodeData;
  tableData.value = getMembersByDepartment(nodeData.id);
  total.value = tableData.value.length;
};

// 根据部门 ID 获取成员数据
const getMembersByDepartment = (departmentId) => {
  // 这里只是模拟数据
  switch (departmentId) {
    case 2:
      return [
        { name: '张三', position: '经理', jobNumber: '001', phone: '12345678901' },
        { name: '李四', position: '员工', jobNumber: '002', phone: '12345678902' },
      ];
    case 4:
      return [];
    default:
      return [];
  }
};

// 是否为根节点, 这里假设根节点的 ID 为 1
const isRootNode = (node) => {
  return node.id === 1;
};

// 编辑部门名称(修改部门名称)
const editDepartmentName = () => {
  ElMessageBox.prompt('请输入新的部门名称', '编辑部门名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: selectedNode.value.label
  })
  .then(({ value }) => {
    if (value.trim()) {
      selectedNode.value.label = value;
      ElMessage.success('修改成功');
    }
  })
  .catch(() => {});
};

// 添加子部门
const addSubDepartment = () => {
  if (!selectedNode.value.children) {
    selectedNode.value.children = [];
  }
  ElMessageBox.prompt('请输入子部门名称', '添加子部门', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  .then(({ value }) => {
    if (value.trim()) {
      selectedNode.value.children.push({
        id: Date.now(),
        label: value,
        children: [] // 新增子部门默认没有子部门
      });
      ElMessage.success('添加成功');
    }
  })
  .catch(() => {});
};

// 添加成员
const addMember = () => {
  ElMessageBox.prompt('请输入成员信息', '添加成员', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  .then(({ value }) => {
    tableData.value.push({
      name: value,
      position: '新成员',
      jobNumber: Date.now().toString(),
      phone: '13800000000',
    });
    total.value = tableData.value.length;
    ElMessage.success('添加成功');
  })
  .catch(() => {});
};

// 批量删除成员
const deleteMembers = () => {
  ElMessageBox.confirm('确定要删除选中的成员吗？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    tableData.value = tableData.value.filter(member => !selectedMembers.value.includes(member));
    selectedMembers.value = []; // 清空选中的成员
    total.value = tableData.value.length; // 更新总数
    ElMessage.success('成员删除成功');
  })
  .catch(() => {});
};

// 处理成员选中变化
const handleMembersSelectionChange = (val) => {
  selectedMembers.value = val;
};

// 处理分页变化
const handlePageChange = (page) => {
  ElMessage({
    message: `当前页: ${page}`,
    type: 'info'
  });
};

// 检查是否有子部门的方法
const hasChildren = (node) => {
  return node.children && node.children.length > 0;
};

// 删除部门(只有没有子部门的部门才能删除)
const deleteDepartment = () => {
  ElMessageBox.confirm('确定要删除该部门吗？', '删除部门', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(() => {
    const parent = getParentNode(selectedNode.value.id);
    parent.children = parent.children.filter(node => node.id !== selectedNode.value.id);
    selectedNode.value = parent;
    ElMessage.success('部门删除成功');
  })
  .catch(() => {});
};

// 获取父节点
const getParentNode = (id) => {
  const findParent = (node) => {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === id) {
          return node;
        }
        const parent = findParent(child);
        if (parent) {
          return parent;
        }
      }
    }
  };
  return findParent(data.value[0]);
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
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.department-header h3 {
  display: flex;
  align-items: center;
}

.edit-button {
  margin-left: 10px;
}

.sub-departments {
  margin-bottom: 20px;
}

.sub-departments-table
{
margin-top: 10px;
}

.department-members {
margin-top: 20px;
}

.members-table {
margin-bottom: 20px;
}

.selected-members-info {
margin-left: 10px;
font-size: 14px;
}
</style>