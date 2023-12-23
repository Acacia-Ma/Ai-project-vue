<template>
  <div class="profile-view">
    <el-dialog
      title="个人信息"
      v-model="dialogVisible"
      width="30%"
      @close="handleClose">
      <el-form :model="userInfo">
        <!-- 用户名（不可编辑） -->
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <!-- 原密码输入 -->
        <el-form-item label="原密码">
          <el-input v-model="userInfo.password_old" type="password"></el-input>
        </el-form-item>
        <!-- 新密码输入 -->
        <el-form-item label="新密码">
          <el-input v-model="userInfo.password" type="password"></el-input>
        </el-form-item>
        <!-- 真实姓名输入 -->
        <el-form-item label="真实姓名">
          <el-input v-model="userInfo.realname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitUserInfo">保存修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getUser,editUser } from '@/api/user';
// import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: Boolean,
    default: false
  }
});

const userInfo = ref({
  username: '', // 只读
  password_old: '', // 原密码
  password: '', // 新密码
  realname: '' // 可编辑
});
const dialogVisible = ref(false);
const emit = defineEmits(['close']);

function getUserInfo(){
  getUser({}).then((res) => {
    userInfo.value.username = res.data.username;
    userInfo.value.realname = res.data.realname;
  });
}

const submitUserInfo = () => {
  // TODO: 发送更新请求到服务器
  // 使用 userInfo.value 和 originalPassword.value 发送更新请求
  console.log('原密码:', userInfo.value.password_old, '新提交的用户信息', userInfo.value);
  editUser(userInfo.value).then((res) => {
    console.log(res);
    ElMessage.success('提交成功');
  }).catch((err) => {
    console.error(err);
    ElMessage.error('提交失败');
  });
  dialogVisible.value = false;
};

const handleClose = () => {
  dialogVisible.value = false;
  emit('close', dialogVisible.value);
};

watch(() => props.title, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    getUserInfo();
  }
});
</script>

<style lang="scss" scoped>
.profile-view {
  .el-dialog {
    padding: 20px; /* 增加对话框内边距 */

    .el-form-item {
      margin-bottom: 15px; /* 增加表单项间距 */

      .el-input {
        border-radius: 4px; /* 轻微圆角的输入框 */
      }
    }

    .dialog-footer {
      text-align: center; /* 按钮居中 */
      padding-top: 15px; /* 顶部间距 */

      .el-button {
        margin: 0 10px; /* 按钮间距 */
        border-radius: 4px; /* 轻微圆角的按钮 */

        &:first-of-type {
          background-color: #f56c6c; /* 取消按钮颜色 */
          border-color: #f56c6c;
        }
      }
    }
  }
}
</style>

