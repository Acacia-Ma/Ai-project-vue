<template>
    <div class="homework-upload">
      <input type="file" @change="handleFileUpload" accept="image/*,application/pdf" />
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['file-uploaded']);
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      emit('file-uploaded', file);
    }
  }
  </script>
  
  <style scoped>
  .homework-upload input {
    margin: 20px;
  }
  </style>
  