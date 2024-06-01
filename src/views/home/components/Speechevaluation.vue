<template>
  <div class="speech-evaluation">
    <div class="evaluation-content">
      <div class="language-tab">
        <span :class="{ active: activeTab === 'english' }" @click="activeTab = 'english'">英语</span>
        <span :class="{ active: activeTab === 'chinese' }" @click="activeTab = 'chinese'">汉语</span>
      </div>
      <div class="evaluation-text">
        <p v-if="activeTab === 'english'">Learn as much as you can while you are young, since life becomes too busy later.</p>
        <p v-if="activeTab === 'chinese'">尽量在年轻的时候学习，因为以后生活会变得非常忙碌。</p>
        <button @click="startRecording">录音</button>
        <button @click="stopRecording">停止</button>
        <button @click="playRecording">回放</button>
        <button @click="reset">换一换</button>
        <button @click="submitEvaluation">提交评测</button>
      </div>
    </div>
    <div class="evaluation-result">
      <div class="result-bar">
        <div class="result-very-good">很好 (&gt; 75)</div>
        <div class="result-good">还行 (75 ~ 60)</div>
        <div class="result-error">错误 (&lt; 60)</div>
        <div class="result-miss">漏读</div>
      </div>
      <div class="result-graph">
        <p v-if="evaluationResult === null">等待评测结果...</p>
        <p v-else>评测结果分数：{{ evaluationResult.score }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const activeTab = ref('english');
const recording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const audioBlob = ref(null);
const audioUrl = ref(null);
const evaluationResult = ref(null);

function startRecording() {
  if (!navigator.mediaDevices) {
    alert('浏览器不支持录音功能');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder.value = new MediaRecorder(stream);
      mediaRecorder.value.start();
      audioChunks.value = [];
      
      mediaRecorder.value.addEventListener("dataavailable", event => {
        audioChunks.value.push(event.data);
      });

      mediaRecorder.value.addEventListener("stop", () => {
        audioBlob.value = new Blob(audioChunks.value);
        audioUrl.value = URL.createObjectURL(audioBlob.value);
      });
    })
    .catch(error => {
      console.error('录音出错:', error);
    });
  
  recording.value = true;
}

function stopRecording() {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    recording.value = false;
  }
}

function playRecording() {
  if (audioUrl.value) {
    const audio = new Audio(audioUrl.value);
    audio.play();
  }
}

function reset() {
  activeTab.value = activeTab.value === 'english' ? 'chinese' : 'english';
}

function submitEvaluation() {
  if (!audioBlob.value) {
    alert('请先录音');
    return;
  }

  const formData = new FormData();
  formData.append('audio', audioBlob.value);

  axios.post('YOUR_API_ENDPOINT', formData)
    .then(response => {
      evaluationResult.value = response.data;
    })
    .catch(error => {
      console.error('评测出错:', error);
    });
}
</script>

<style scoped>
.speech-evaluation {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.evaluation-content, .evaluation-result {
  width: 48%;
}

.language-tab {
  display: flex;
  margin-bottom: 10px;
}

.language-tab span {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: #eee;
}

.language-tab span.active {
  background-color: #007bff;
  color: white;
}

.evaluation-text p {
  font-size: 16px;
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.result-bar {
  display: flex;
  margin-bottom: 10px;
}

.result-bar div {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #eee;
}

.result-very-good {
  background-color: green;
  color: white;
}

.result-good {
  background-color: orange;
  color: white;
}

.result-error {
  background-color: red;
  color: white;
}

.result-miss {
  background-color: gray;
  color: white;
}

.result-graph {
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
