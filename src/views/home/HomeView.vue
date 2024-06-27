<template>
  <div class="home-view">
    <!-- 菜单置于顶部 -->
    <div class="top-menu">
      <el-menu default-active="1" mode="horizontal" class="el-menu-horizontal" @select="handleSelect">
        <el-menu-item index="1">对话</el-menu-item>
        <el-menu-item index="2">图片识别</el-menu-item>
        <el-menu-item index="3">机器翻译</el-menu-item>
        <el-menu-item index="4">语音测评</el-menu-item>
        <li v-if = "user.permission == 100">
           <el-menu-item index="5">通讯录</el-menu-item>
        </li>
      </el-menu>
    </div>
    <RouterView/>
  </div>
</template>


<script setup>
import { ref , onMounted} from 'vue';
import { useRouter } from 'vue-router';
import {useTestStore} from '@/store/user' // 确保正确导入user

// 用户信息
const user = useTestStore()
const router = useRouter();

// 菜单选项点击事件
const handleSelect = (index) => {
  switch (index) {
    case '1':
    router.push({ path: '/home/Chat' });
      break;
    case '2':
      router.push({ path: '/home/recognition' });
      break;
    case '3':
      router.push({ path: '/home/translation' });
      break;
    case '4':
      router.push({ path: '/home/evaluation' });
      break;
    case '5':
     router.push({ path: '/home/contacts' });
      break;
    default:
      // 默认行为
      break;
  }
};

</script>

<style scoped>

/* 新增的顶部菜单样式 */

.home-view {
  width: 100vw;
  /* display: flex; */
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-image: url(https://bu.dusays.com/2023/12/12/6577c98beafc0.webp);
}

</style>
