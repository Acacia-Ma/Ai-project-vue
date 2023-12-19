<template>
    <el-container style="height: 100vh;">
      <el-aside width="300px" style="background-color: #f2f2f2;">
        <!-- 这里可以放置用户信息，联系人列表等 -->
      </el-aside>
  
      <el-container>
        <el-header style="text-align: right; padding: 0 20px;">
          <!-- 这里可以放置用户的登出按钮等 -->
          <el-button type="danger" @click="logout">登出</el-button>
        </el-header>
        
        <el-main>
          <ChatInterface />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ChatInterface from './ChatInterface.vue';
  import { ElMessageBox } from 'element-plus';
  
  const logout = () => {
    ElMessageBox.confirm('确定要登出吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 这里实现登出逻辑，通常是调用API然后清理本地状态
    }).catch(() => {
      // 处理取消操作
    });
  };
  </script>
  
  <style scoped>
  /* CSS 样式 */
  </style>
  