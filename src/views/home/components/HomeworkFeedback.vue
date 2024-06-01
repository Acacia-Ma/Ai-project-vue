<template>
    <div class="homework-feedback">
      <h3>批改反馈</h3>
      <div v-if="feedback">
        <p><strong>得分:</strong> {{ feedback.score }}</p>
        <p><strong>反馈:</strong> {{ feedback.comments }}</p>
      </div>
      <div v-else>
        <p>等待批改结果...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps(['feedback']);
  </script>
  
  <style scoped>
  .homework-feedback {
    margin: 20px;
  }
  </style>
  