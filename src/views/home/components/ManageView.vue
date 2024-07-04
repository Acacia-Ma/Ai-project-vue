<template>
  <!--标题居中对齐美化-->
  <div class ='flicker-in-2'>
    <span>通讯录后台权限管理</span>
  </div>
  <!-- 居中卡片，shadow='always' -->
  <el-card style="margin: 30px auto; height: 450px;" shadow="always" class="slide-in-blurred-top">
  <div class="user-management">
    <!-- 搜索栏和新增按钮 -->
    <div class="search-bar">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        class="search-input"
      />
      <el-button color="#626aef" :dark="isDark" :icon="Plus" @click="openAddUserDialog">新增</el-button>
      <el-button type="warning" :icon="Switch" @click="backg">返回</el-button>
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
  </el-card>
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
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DepartmentTree from '@/views/home/components/DepartmentTree.vue';
import { getAdmin, addAdmin, delAdmin, getDepartPerson,getDepartPersonAll } from '@api/contacts';
import { Switch,Plus } from '@element-plus/icons-vue';

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

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};
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
    const response = await getDepartPersonAll({ department_id: departmentId });
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
/* 样式美化 */
.flicker-in-2 {
  /* 居中对齐 */
  text-align: center;
  /* 字体大小 */
  font-size: 24px;
  /* 添加阴影 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 内边距 */
  padding: 10px 0;
  /* 背景颜色 */
  /* background-color: #f5f7fa; */
  font-size: 80px;   /*设置文字大小*/            
  font-weight: bolder;  /*设置文字宽度*/                              
  text-align: center;  /*设置文字居中*/  
  -webkit-animation: flicker-in-2 2s linear both;
	        animation: flicker-in-2 2s linear both;      
}
/* ----------------------------------------------
 * Generated by Animista on 2024-6-28 10:47:15
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * @animation flicker-in-2
 * ----------------------------------------
 */
 @-webkit-keyframes flicker-in-2 {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  10.1% {
    opacity: 1;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  10.2% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  20% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  20.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
  }
  20.6% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  30% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  30.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  30.5% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  30.6% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  45% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  45.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  50% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  55% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  55.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  57% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  57.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
  }
  60% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
  }
  60.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  65% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  65.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  75% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  75.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  77% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  77.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  85% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  85.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  86% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  86.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  100% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
  }
}
@keyframes flicker-in-2 {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  10.1% {
    opacity: 1;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  10.2% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  20% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  20.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
  }
  20.6% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  30% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  30.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  30.5% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  30.6% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  45% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  45.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  50% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  55% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), 0 0 60px rgba(255, 255, 255, 0.25);
  }
  55.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  57% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  57.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
  }
  60% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3);
  }
  60.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  65% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  65.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  75% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.55), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  75.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  77% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  77.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  85% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 110px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  85.1% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  86% {
    opacity: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }
  86.1% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
  }
  100% {
    opacity: 1;
    -webkit-box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.45), 0 0 110px rgba(255, 255, 255, 0.25), 0 0 100px rgba(255, 255, 255, 0.1);
  }
}

.flicker-in-2 span {
  background-image: linear-gradient(90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-size: 400% 100%;
  animation: wzw 10s linear infinite;
}

@keyframes wzw {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.slide-in-blurred-top {
	-webkit-animation: slide-in-blurred-top 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
	        animation: slide-in-blurred-top 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2024-6-28 14:18:20
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-blurred-top
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-blurred-top {
  0% {
    -webkit-transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
            transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}
@keyframes slide-in-blurred-top {
  0% {
    -webkit-transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
            transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
}


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
  bottom: 0; /* 距离底部 0 像素 */
  left: 0; /* 距离左侧 0 像素 */
  right: 0; /* 距离右侧 0 像素 */
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