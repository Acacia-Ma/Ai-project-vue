<template>
    <div class="homework-correction">
      <HomeworkUpload @file-uploaded="handleFileUploaded" />
      <HomeworkAnalysis v-if="uploadedFile" :file="uploadedFile" @analysis-completed="handleAnalysisCompleted" />
      <HomeworkFeedback v-if="analysisResult" :feedback="analysisResult" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import HomeworkUpload from '../components/HomeworkUpload.vue';
  import HomeworkAnalysis from '../components/HomeworkAnalysis.vue';
  import HomeworkFeedback from '../components/HomeworkFeedback.vue';
  
  const uploadedFile = ref(null);
  const analysisResult = ref(null);
  
  function handleFileUploaded(file) {
    uploadedFile.value = file;
  }
  
  function handleAnalysisCompleted(result) {
    analysisResult.value = result;
  }
  </script>
  
  <style scoped>
  .homework-correction {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  