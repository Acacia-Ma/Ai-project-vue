<template>
    <div class="recognition-view">
      <h1>图像识别</h1>
      <div class="recognition-container">
        <input type="file" @change="onFileChange">
        <button @click="recognizeImage">识别图像</button>
        <div v-if="imageSrc" class="image-preview">
          <img :src="imageSrc" alt="预览图"/>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const imageSrc = ref('');
  
  const onFileChange = (e) => {
    const file = e.target.files[0];
    imageSrc.value = URL.createObjectURL(file);
  };
  
  const recognizeImage = () => {
    // 添加图像识别逻辑
  };
  </script>
  
  <style scoped>
  .recognition-view {
    padding: 20px;
  }
  .recognition-container {
    margin-top: 20px;
  }
  .image-preview img {
    max-width: 100%;
    height: auto;
  }
  </style>
  