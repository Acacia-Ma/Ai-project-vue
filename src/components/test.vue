<template>
<div class="profile-view">
    <div class="title">我的信息</div>
    <el-form class="form" label-position="top">
      <el-form-item label="昵称">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          action="/api/upload/upload"
          class="avatar-uploader"
        >
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-button type="success" @click="submit"> 提交修改</el-button>
  </div>
</template>
<script setup>
import {ref,reactive} from 'vue'

</script>
<style scoped>

</style>