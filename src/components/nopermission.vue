<template>
  <div class="no-permission">
    <h1>403 Forbidden</h1>
    <p>您没有权限访问此页面。</p>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.no-permission {
  text-align: center;
  margin-top: 50px;
}

.no-permission h1 {
  color: red;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>