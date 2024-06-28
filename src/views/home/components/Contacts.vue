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
      <!-- 解释上述每个属性的作用：
      - data：部门树的数据源，是一个数组，数组中的每个元素代表一个部门节点，每个部门节点包含 id、label 和 children 等属性。
      - props：配置树组件的属性映射，确保树组件能正确识别数据结构中的属性名。
      - node-key：树节点的唯一标识符，这里使用 department_id
      - ref：为树组件添加一个引用，方便在组件中通过 ref 获取树组件实例。
      - expand-on-click-node：是否在点击节点时展开子节点，默认为 true。
      - default-expanded-keys：默认展开的节点的 key 数组。
      - filter-node-method：过滤节点的方法，接收两个参数：value 和 data，分别表示输入框的值和节点数据。
      - filter：过滤输入框的值。
      - node-click：节点点击事件的处理函数。
      - class：树组件的样式类名。 -->
      <el-tree
        :data="data"
        :props="defaultProps"
        node-key="department_id"
        ref="tree"
        :highlight-current="true"
        :expand-on-click-node="true"
        :default-expanded-keys="[1]"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        class="contacts-tree"
      />
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <!--添加成员对话框-->
      <div>
    <el-dialog v-model="addMemberDialogVisible" title="添加成员" width="30%">
      <el-form ref="addMemberForm" :model="form" label-width="80px">
        <el-form-item label="工号" required>
          <el-input v-model="form.userid" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" required>
          <el-input v-model="form.username" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddMember">确定</el-button>
      </span>
    </el-dialog>
  </div>
      <!-- 部门信息 -->
      <div class="department-header">
        <h3>
          <!-- {{ selectedNode.label }} -->
          <!-- 编辑按钮 -->
          <el-button
            v-if="!isRootNode(selectedNode)"
            type="primary"
            @click="editDepartmentName"
            class="edit-button"
            :icon="EditPen"
          >
            编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            v-if="!isRootNode(selectedNode) && !hasChildren(selectedNode)"
            type="danger"
            @click="deleteDepartment"
            class="edit-button"
            :icon="Delete"
          >
            删除
          </el-button>
          <!-- 跳转到权限管理界面-->
          <el-button
            v-if="!isRootNode(selectedNode)"
            type="warning"
            :icon="Switch"
            @click="goToPermission"
            class="edit-button"
          >
            权限管理
          </el-button>
        </h3>
      </div>
      <!-- 下级部门 -->
      <div class="sub-departments">
        <h4>下级部门</h4>
        <el-button type="primary" :icon="Plus" @click="addSubDepartment">添加子部门</el-button>
        <el-table
          :data="selectedNode.children"
          stripe
          class="sub-departments-table"
          @selection-change="handleMembersSelectionChange"
        >
          <el-table-column prop="label" label="部门名称"></el-table-column>
        </el-table>
      </div>
      <!-- 部门人员 -->
      <div class="department-members">
        <h4>部门人员</h4>
        <el-button type="primary" 
        style="margin-left: 10px;margin-bottom:10px"
        :icon="Plus" 
        @click="addMember"
        >
        添加成员
      </el-button>
        <el-button
          type="danger"
          style="margin-left: 10px;margin-bottom:10px"
          :icon="DeleteFilled"
          :disabled="!hasSelectedMembers"
          @click="deleteMembers"
        >
          批量删除
        </el-button>
        <span class="selected-members-info">
          已选择 {{ selectedMembers.length }} 名成员
        </span>
        <!-- 表格 -->
        <el-table
          border
          stripe
          :data="currentPageData"
          @selection-change="handleMembersSelectionChange"
          @row-dblclick="openEditDialog"
          class="members-table"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="名字"></el-table-column>
          <el-table-column prop="position" label="职位"></el-table-column>
          <el-table-column prop="userid" label="工号"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
        </el-table>
        <!-- 添加编辑成员信息的 Dialog 组件 -->
        <el-dialog
          v-model="editDialogVisible"
          title="编辑成员信息"
          width="30%"
        >
        <!-- 工号不能修改-->
          <el-form ref="editForm" :model="EditForms" :rules="rules" label-width="80px">
            <el-form-item label="名字" prop="username">
              <el-input v-model="EditForms.username" placeholder="请输入名字"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="EditForms.position" placeholder="请输入职位"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="userid">
              <el-input v-model="EditForms.userid" disabled placeholder="请输入工号"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="EditForms.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitEditForm">确定</el-button>
          </span>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[1, 3, 5, 10, 20]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
    />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, onMounted, computed} from 'vue'; // 确保从 vue 中导入 h 函数
import { addDepartment,addDepart,getSubDepart,getDepartPerson,getdepartment,editDepartment,delDepartment,delDepartPerson,editDepartPerson } from '@api/contacts';
import { Switch,Plus,EditPen,Delete,DeleteFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// 添加成员对话框是否可见
const addMemberDialogVisible = ref(false);

// 添加成员表单
const form = ref({
  username: '',
  userid: '',
  mobile: ''
});

// 过滤输入框的值
const filterText = ref('');

// 部门树
const tree = ref(null);

// 部门树数据，初始为空数组，将从后端接口加载
const data = ref([]);


// 默认属性配置
const defaultProps = ref({
  children: 'children', // 后端数据中的子节点数组键名
  label: 'label', // 后端数据中的部门名称字段
  value: 'department_id' // 如果需要，设置value字段，用于tree组件的value属性
});

// 选中的部门
const selectedNode = ref({});


// 表格数据，初始为空数组，将从后端接口加载
const tableData = ref([]);

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

// 组件挂载后加载数据
onMounted(async () => {
  loadDepartmentData();
});

// 加载部门数据
const loadDepartmentData = async () => {
  try {
    const response = await getdepartment();
    console.log('部门数据response：', response);
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
  console.log("部门数据",data.value)
};

// 处理节点点击事件
const handleNodeClick = async (nodeData) => {
  // 更新选中节点
  selectedNode.value = nodeData;
  console.log('选中的部门：', nodeData);

  // 使用已定义的方法来异步加载子部门并更新树
  await loadSubDepartments(nodeData);
  // 使用已定义的方法来异步加载部门成员数据
  tableData.value = await getMembersByDepartment(nodeData.department_id);
  total.value = tableData.value.length;
  console.log('部门成员：', tableData.value);
};

// 异步加载子部门并更新树
const loadSubDepartments = async (node) => {
  if (!node.children || node.children.length === 0) {
    const response = await getSubDepart({ department_id: node.department_id });
    if (response.code === 0) {
      // 确保子部门数据被添加到节点的 children 属性中
      node.children = response.data.map(child => ({
        ...child,
        label: child.department // 确保子节点具有正确的 label 属性
      }));
      // 更新树
      tree.value.updateKeyChildren(node, node.children);
    } else {
      ElMessage.error('加载子部门数据失败');
    }
  }
};


// 根据部门 ID 获取成员数据
const getMembersByDepartment = async (departmentId) => {
  try {
    const response = await getDepartPerson({ department_id: departmentId });
    if (response.code === 0 && Array.isArray(response.data)) {
      return response.data;
    } else {
      ElMessage.error('加载成员数据失败');
      return [];
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('加载成员数据时发生错误');
    return [];
  }
};

// 是否为根节点, 这里假设根节点的 ID 为 1
const isRootNode = (node) => {
  return node.id === 1;
};

// 编辑部门名称(修改部门名称),editDepartment接口需要：department_id，depart_name
const editDepartmentName = async () => {
  ElMessageBox.prompt('请输入新的部门名称', '编辑部门名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: selectedNode.value.label
  })
  .then(async ({ value }) => {
    if (value.trim()) {
      const response = await editDepartment({
        parent_id: selectedNode.value.parent_id,
        department_id: selectedNode.value.department_id,
        depart_name: value
      });
      // console.log("编辑部门Id",selectedNode.value.department_id)
      if (response.code === 0) {
        // 直接更新当前选中节点的 label 属性
        // console.log('选中的部门：', selectedNode.value);
        selectedNode.value.label = value;
        // console.log('修改后的部门：', selectedNode.value);
        ElMessage.success('编辑成功');
      } else {
        ElMessage.error('编辑失败');
      }
    }
  })
  .catch(() => {});
};

// 添加子部门，addDepart接口需要：parent_id，depart_name，并返回新添加的部门的ID
const addSubDepartment = async () => {
  ElMessageBox.prompt('请输入子部门名称', '添加子部门', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  .then(async ({ value }) => {
    if (value.trim()) {
      console.log('这是添加部门里选中的部门：', selectedNode.value);
      const response = await addDepart({
        parent_id: selectedNode.value.department_id,
        depart_name: value
      });
      if (response.code === 0) {
        // 添加成功后，将新的子部门添加到当前选中节点的 children 属性中
        if (!selectedNode.value.children) {
          selectedNode.value.children = [];
        }
        selectedNode.value.children.push({
          department_id: response.data,
          label: value,
          children: [] // 新增子部门默认没有子部门
        });
        // 更新树
        tree.value.updateKeyChildren(selectedNode.value, selectedNode.value.children);
        ElMessage.success('添加成功');
      } else {
        ElMessage.error('添加失败');
      }
    }
  })
  .catch(() => {});
};


// 添加成员，后端接口需要：department_id，username，userid，mobile
const addMember = () => {
  addMemberDialogVisible.value = true;
};

// 提交添加成员
const submitAddMember = async () => {
  try {
    if (!form.value.username.trim() || !form.value.userid.trim() || !form.value.mobile.trim()) {
      ElMessage.warning('请填写完整信息');
      return;
    }
    // 检查手机号格式
    if (!/^\d{11}$/.test(form.value.mobile)) {
      ElMessage.warning('手机号格式不正确');
      return;
    }
    // 检查是否选择了部门
    if (!selectedNode.value.department_id) {
      ElMessage.warning('请选择部门');
      return;
    }
    // 检查工号
    if (!/^\d+$/.test(form.value.userid)) {
      ElMessage.warning('工号只能是数字');
      return;
    }
    // 检查名字
    if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(form.value.username)) {
      ElMessage.warning('名字只能是中文或英文');
      return;
    }
    const response = await addDepartment({
      department_id: selectedNode.value.department_id,
      username: form.value.username,
      userid: form.value.userid,
      mobile: form.value.mobile
    });
    if (response.code === 0) {
      tableData.value.push({
        username: form.value.username,
        userid: form.value.userid,
        phone: form.value.mobile,
        position: response.data
      });
      total.value = tableData.value.length;
      ElMessage.success('添加成功');
      addMemberDialogVisible.value = false;
    } else {
      ElMessage.error('添加失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('添加成员时发生错误');
  }
};

// 批量删除成员，使用delDepartPerson接口，需要传入department_id和userid，删除成功后更新表格数据
// 注意：delDepartPerson接口一次只能删除一个成员，所以需要循环调用
const deleteMembers = () => {
  ElMessageBox.confirm('确定要删除选中的成员吗？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async () => {
    for (const member of selectedMembers.value) {
      const response = await delDepartPerson({
        department_id: selectedNode.value.department_id,
        userid: member.userid
      });
      if (response.code === 0) {
        tableData.value = tableData.value.filter(item => item.userid !== member.userid);
        total.value = tableData.value.length;
      }
    }
    ElMessage.success('删除成功');
  })
  .catch(() => {});
};

// 处理成员选中变化
const handleMembersSelectionChange = (val) => {
  selectedMembers.value = val;
};

// 分页
// currentPage4 和 pageSize4 是 ref 类型的响应式变量，用于控制当前页和每页显示条数
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const size = ref('small');
const disabled = ref(false);
const background = ref(true);

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};

// 计算单前页数据的计算属性
const currentPageData = computed(() => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = currentPage4.value * pageSize4.value;
  return tableData.value.slice(start, end);
});


// 检查是否有子部门的方法
const hasChildren = (node) => {
  return node.children && node.children.length > 0;
};

// 删除部门(只有没有子部门的部门才能删除)，使用delDepartment接口，需要department_id，删除成功后更新树
const deleteDepartment = () => {
  ElMessageBox.confirm('确定要删除该部门吗？', '删除部门', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async () => {
    const response = await delDepartment({ department_id: selectedNode.value.department_id });
    if (response.code === 0) {
      const parent = getParentNode(selectedNode.value.department_id);
      parent.children = parent.children.filter(node => node.department_id !== selectedNode.value.department_id);
      selectedNode.value = parent;
      tree.value.updateKeyChildren(parent, parent.children);
      ElMessage.success('部门删除成功');
    } else {
      ElMessage.error('部门删除失败');
    }
  })
  .catch(() => {});
};

// 获取父节点
const getParentNode = (id) => {
  const findParent = (node) => {
    if (node.children) {
      for (const child of node.children) {
        if (child.department_id === id) {
          return node;
        }
        const parent = findParent(child);
        if (parent) {
          return parent;
        }
      }
    }
  };
  return findParent({ children: data.value });
};

// 跳转到权限管理界面
const goToPermission = () => {
  console.log('跳转到权限管理界面');
  router.push({ path: '/manage'});
};

// 编辑成员信息的对话框是否可见
const editDialogVisible = ref(false);

const editForm = ref(null);

// 编辑成员信息的表单数据
const EditForms = ref({
  username: '',
  userid: '',
  phone: '',
  position: ''
});

// 编辑成员信息的表单验证规则，名字只能是中文或英文，手机号必须是 11 位数字，工号不能修改
const rules = ref({
  username: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, message: '名字只能是中文或英文', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  userid: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^\d+$/, message: '工号只能是数字', trigger: 'blur' }
  ]
});

// 打开编辑对话框的方法
const openEditDialog = (row) => {
  console.log('双击的行数据：', row); // 打印被双击的行数据
  if (row) {
    // 将被双击的成员信息复制到 editForm 中
    EditForms.value = { ...row };
    // 显示对话框
    editDialogVisible.value = true;
  } else {
    console.error('没有获取到双击的行数据');
  }
};

// 提交编辑表单的方法,使用editDepartPerson接口，需要传入userid，username，phone，position，使用editForm.value.validate()方法验证表单
const submitEditForm = async () => {
  try {
    await editForm.value.validate();
    const response = await editDepartPerson({
      userid: EditForms.value.userid,
      username: EditForms.value.username,
      phone: EditForms.value.phone,
      position: EditForms.value.position
    });
    if (response.code === 0) {
      // 更新表格数据
      tableData.value = tableData.value.map(item => {
        if (item.userid === EditForms.value.userid) {
          return {
            ...item,
            username: EditForms.value.username,
            phone: EditForms.value.phone,
            position: EditForms.value.position
          };
        }
        return item;
      });
      ElMessage.success('编辑成功');
      editDialogVisible.value = false;
    } else {
      ElMessage.error('编辑失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('编辑成员信息时发生错误');
  }
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
overflow: auto;
height: 120px
}

.department-members {
margin-top: 20px;
}

.members-table {
margin-bottom: 20px;
overflow: auto;
height: 195px
}

.selected-members-info {
margin-left: 10px;
font-size: 14px;
}


</style>