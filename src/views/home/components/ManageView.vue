<template>
  <div class="user-management">
    <!-- 搜索栏和新增按钮 -->
    <div class="search-bar">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        class="search-input"
      />
      <el-button type="primary" @click="openAddUserDialog">新增</el-button>
      <el-button type="warning" @click="backg">返回</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="currentData"
      class="admin-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="userid" label="用户ID"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div class="action-buttons">
            <el-button  type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页容器 -->
  <div class="pagination-container">
    <!-- 批量删除按钮 -->
    <el-button
      type="danger"
      :disabled="!hasSelectedMembers"
      @click="batchDelete"
      class="batch-delete-button"
    >批量删除</el-button>
    <!-- 分页控件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    >
    </el-pagination>
  </div>

    <!-- 新增管理员对话框 -->
    <el-dialog
      v-model="addUserDialogVisible"
      :title="dialogTitle"
      width="30%"
      class="add-user-dialog"
    >
      <div v-if="dialogStep === 'selectDepartment'">
        <!-- 部门树组件，用于选择部门 -->
        <department-tree
          @node-click="handleDepartmentSelect"
          ref="departmentTree"
        ></department-tree>
      </div>
      <div v-if="dialogStep === 'selectMembers'">
        <!-- 成员选择表格，用于选择成员 -->
        <el-table
          :data="selectedMembers"
          @selection-change="handleMemberSelectionChange"
          class="user-table"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="userid" label="用户ID"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button
          v-if="dialogStep === 'selectDepartment'"
          type="primary"
          @click="nextStep"
        >下一步</el-button>
        <el-button
          v-if="dialogStep === 'selectMembers'"
          type="primary"
          @click="confirmAddUser"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DepartmentTree from '@/views/home/components/DepartmentTree.vue';
import { getAdmin, addAdmin, delAdmin, getDepartPerson } from '@api/contacts';

// 路由实例
const router = useRouter();

// 过滤文本，用于搜索用户
const filterText = ref('');

// 用户列表，从 API 获取
const users = ref([]);

// 选中的用户列表
const selectedUsers = ref([]);

// 是否有选中的用户
const hasSelectedMembers = computed(() => selectedUsers.value.length > 0);

// 处理用户选择变化
const handleSelectionChange = (val) => {
  selectedUsers.value = val;
};

// 计算属性，根据过滤文本显示用户列表
const filteredUsers = computed(() => {
  const lowerCaseFilter = filterText.value.toLowerCase();
  return users.value.filter((user) =>
    user.username.toLowerCase().includes(lowerCaseFilter)
  );
});

// 总用户数
const total = ref(0);

// 当前页码
const currentPage = ref(1);

// 每页显示的用户数
const pageSize = ref(5);

// 对话框状态
const addUserDialogVisible = ref(false);
const dialogStep = ref('selectDepartment'); // 步骤: 选择部门或选择成员
const dialogTitle = ref('选择部门'); // 对话框标题
const selectedDepartment = ref(null); // 选中的部门
const selectedMembers = ref([]); // 选中的成员列表
const selectedMembersToPromote = ref([]); // 将要提升为管理员的成员

// 监听 filterText 的变化更新 filteredUsers
watch(filterText, (newVal) => {
  filteredUsers.value = users.value.filter((user) =>
    user.username.includes(newVal)
  );
});

// 获取用户列表的方法
const fetchUserList = async () => {
  try {
    const response = await getAdmin();
    if (response.code === 0) {
      users.value = response.data;
      total.value = users.value.length;
    } else {
      ElMessage.error('获取用户列表失败');
    }
  } catch (error) {
    ElMessage.error('获取用户列表时发生错误');
    console.error(error);
  }
};

// 删除用户的方法
const deleteUser = async (user) => {
  try {
    const response = await delAdmin({ userid: user.userid });
    if (response.code === 0) {
      await fetchUserList();
      ElMessage.success('删除成功');
    } else {
      ElMessage.error('删除用户失败');
    }
  } catch (error) {
    ElMessage.error('删除用户时发生错误');
    console.error(error);
  }
};

// 批量删除用户的方法
const batchDelete = async () => {
  if (!selectedUsers.value.length) {
    ElMessage.warning('请先选择要删除的用户');
    return;
  }
  try {
    for (const user of selectedUsers.value) {
      await delAdmin({ userid: user.userid });
    }
    await fetchUserList();
    ElMessage.success('批量删除成功');
  } catch (error) {
    ElMessage.error('批量删除用户时发生错误');
    console.error(error);
  }
};

// 分页变化时的回调
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// 返回上一页的方法
const backg = () => {
  router.back();
};

// 打开新增管理员对话框
const openAddUserDialog = () => {
  addUserDialogVisible.value = true;
  console.log('打开了新增管理员对话框');
  dialogStep.value = 'selectDepartment';
  dialogTitle.value = '选择部门';
};

// 处理部门选择事件
const handleDepartmentSelect = (node) => {
  selectedDepartment.value = node;
  loadMembersForDepartment(node.department_id);
};

// 加载部门成员的方法
const loadMembersForDepartment = async (departmentId) => {
  try {
    const response = await getDepartPerson({ department_id: departmentId });
    if (response.code === 0) {
      selectedMembers.value = response.data;
    } else {
      ElMessage.error('加载部门成员失败');
    }
  } catch (error) {
    ElMessage.error('加载部门成员时发生错误');
    console.error(error);
  }
};

// 处理成员选择变化
const handleMemberSelectionChange = (val) => {
  selectedMembersToPromote.value = val;
};

// 下一步，从选择部门转到选择成员
const nextStep = () => {
  if (!selectedDepartment.value) {
    ElMessage.warning('请选择一个部门');
    return;
  }
  dialogStep.value = 'selectMembers';
  dialogTitle.value = '选择成员';
};

// 确认新增用户，将选中的成员提升为管理员，后端只需要userid
const confirmAddUser = async () => {
  if (!selectedMembersToPromote.value.length) {
    ElMessage.warning('请选择至少一个成员');
    return;
  }
  try {
    for (const member of selectedMembersToPromote.value) {
      await addAdmin({ userid: member.userid });
    }
    await fetchUserList();
    ElMessage.success('新增管理员成功');
    addUserDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('新增管理员时发生错误');
    console.error(error);
  }
};
// 计算单前页数据的计算属性
const currentData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});
// 组件挂载后获取用户列表
onMounted(async () => {
  await fetchUserList();
});


</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 200px;
  margin-right: 10px;
}

.user-table {
  width: 100%;
  margin-bottom: 10px;
  overflow: auto;
  height: 195px
}

.admin-table {
  width: 100%;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.batch-delete-button {
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
  float: right;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--success {
  background-color: #67c23a;
  border-color: #67c23a;
}

.el-button--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.pagination-container {
  position: fixed; /* 固定在页面底部 */
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff; /* 根据需要调整背景颜色 */
  padding: 10px 20px; /* 根据需要调整内边距 */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  z-index: 1000; /* 确保分页容器在其他内容之上 */
}

.pagination {
  display: flex;
  justify-content: center;
}

.add-user-dialog {
  max-height: 80vh;
}

.dialog-footer {
  text-align: center;
}
</style>