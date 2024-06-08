<template>
    <div class="speech-evaluation">
      <div class="evaluation-content">
        <div class="language-tab">
          <span :class="{ active: activeTab === 'en' }" @click="activeTab = 'en'">英语</span>
          <span :class="{ active: activeTab === 'cn' }" @click="activeTab = 'cn'">汉语</span>
        </div>
        <div class="evaluation-text">
          <p v-if="activeTab === 'en'">
            <span v-for="(char, index) in currentEvaluationText.en" :key="index" :style="{ color: getColor(evaluationResult?.charScores?.[index]) }">
              {{ char }}
            </span>
          </p>
          <p v-if="activeTab === 'cn'">
            <span v-for="(char, index) in currentEvaluationText.cn" :key="index" :style="{ color: getColor(evaluationResult?.charScores?.[index]) }">
              {{ char }}
            </span>
          </p>
          <button @click="startRecording" :disabled="recording">录音</button>
          <button @click="stopRecording" :disabled="!recording">停止</button>
          <button @click="playRecording" :disabled="!audioUrl">回放</button>
          <button @click="saveRecording" :disabled="!audioUrl">保存</button>
          <button @click="resetText">换一换</button>
          <button @click="submitEvaluation" :disabled="!audioBlob">提交评测</button>
        </div>
      </div>
      <div class="evaluation-result">
        <div class="result-bar">
          <div class="result-very-good" :class="{ active: evaluationResult && evaluationResult.totalScore > 75 }">很好 (&gt; 75)</div>
          <div class="result-good" :class="{ active: evaluationResult && evaluationResult.totalScore <= 75 && evaluationResult.totalScore >= 60 }">还行 (75 ~ 60)</div>
          <div class="result-error" :class="{ active: evaluationResult && evaluationResult.totalScore < 60 }">错误 (&lt; 60)</div>
          <div class="result-miss" :class="{ active: evaluationResult && evaluationResult.missed }">漏读</div>
        </div>
        <!-- 评测结果图表 -->
        <div class="result-graph">
          <p v-if="evaluationResult === null">等待评测结果...</p>
          <p v-else>评测结果分数：{{ evaluationResult.totalScore }}</p>
          <div v-if="evaluationResult !== null">
            <span v-for="(char, index) in currentEvaluationText[activeTab]" :key="index" :style="{ color: getColor(evaluationResult.charScores?.[index]) }">
              {{ char }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue';
  import { languageEvaluation } from '@api/model';
  
  // 当前激活的语言选项卡
  const activeTab = ref('en');
  // 是否正在录音
  const recording = ref(false);
  // 媒体录制器
  const mediaRecorder = ref(null);
  // 音频数据块
  const audioChunks = ref([]);
  // 音频 Blob 对象
  const audioBlob = ref(null);
  // 音频 URL 地址
  const audioUrl = ref(null);
  // 评测结果
  const evaluationResult = ref(null);
  // 评测样例文本
  const evaluationText = ref([
    { en: "Learn as much as you can while you are young, since life becomes too busy later.", cn: "尽量在年轻的时候学习，因为以后生活会变得非常忙碌。" },
    { en: "The only way to do great work is to love what you do.", cn: "做出伟大的工作的唯一方法是热爱自己的工作。" },
    { en: "The best way to predict the future is to create it.", cn: "预测未来的最好方法是创造未来。" },
    { en: "The only limit to our realization of tomorrow will be our doubts of today.", cn: "我们对明天的实现的唯一限制将是我们今天的怀疑。" },
    { en: "The best preparation for tomorrow is doing your best today.", cn: "明天的最好准备是今天尽力而为。" },
    { en: "The future belongs to those who believe in the beauty of their dreams.", cn: "未来属于那些相信自己梦想之美的人。" },
    { en: "The only way to achieve the impossible is to believe it is possible.", cn: "实现不可能的唯一方法是相信它是可能的。" },
    { en: "The best way to find yourself is to lose yourself in the service of others.", cn: "找到自己的最好方法是在为他人服务中迷失自己。" },
    { en: "The best and most beautiful things in the world cannot be seen or even touched. They must be felt with the heart.", cn: "世界上最好最美的东西是看不见的，甚至不能触摸的。它们必须用心感受。" },
    { en: "The best way to cheer yourself up is to try to cheer somebody else up.", cn: "让自己振作的最好方法是尽力让别人振作。" },
    { en: "The best way to make your dreams come true is to wake up.", cn: "实现梦想的最好方法是醒来。" },
    { en: "Good.", cn: "好。"},
  ]);
  // 当前显示的评测文本
  const currentEvaluationText = ref(evaluationText.value[0]);
  
  function switchLanguage(lang) {
    activeTab.value = lang;
  }
  
  // 开始录音;要求：采样率为 16k,位长为 16bit,单声道，降低文件大小
  function startRecording() {
    if (!navigator.mediaDevices) {
      alert('浏览器不支持录音功能');
      return;
    }
    
    const constraints = {
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        bitDepth: 16,
      }
    };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        mediaRecorder.value = new MediaRecorder(stream);
        mediaRecorder.value.start();
        audioChunks.value = [];
        mediaRecorder.value.addEventListener("dataavailable", event => {
          audioChunks.value.push(event.data);
        });
        mediaRecorder.value.addEventListener("stop", () => {
          audioBlob.value = new Blob(audioChunks.value, { 'type' : 'audio/wav; codecs=MS_PCM' });
          audioUrl.value = URL.createObjectURL(audioBlob.value);
        });
      })
      .catch(error => {
        console.error('录音出错:', error);
      });
    
    recording.value = true;
  }
  
  // 停止录音
  function stopRecording() {
    if (mediaRecorder.value) {
      mediaRecorder.value.stop();
      recording.value = false;
    }
  }
  // 保存录音
  function saveRecording() {
    if (audioBlob.value) {
      const a = document.createElement('a');
      a.href = audioUrl.value;
      a.download = 'audio.wav';
      a.click();
    }
  }
  
  // 回放录音
  function playRecording() {
    if (audioUrl.value) {
      const audio = new Audio(audioUrl.value);
      audio.play();
    }
  }
  
  // 换一换
  function resetText() {
    const randomIndex = Math.floor(Math.random() * evaluationText.value.length);
    currentEvaluationText.value = evaluationText.value[randomIndex];
  }
  
  // 提交评测
  function submitEvaluation() {
    if (!audioBlob.value) {
      alert('请先录音');
      return;
    }
    // 返回结果示例
  //   {
  //     "score": {
  //         "尽": "0",
  //         "量": "0",
  //         "在": "16",
  //         "年": "16",
  //         "轻": "16",
  //         "的": "16",
  //         "时": "16",
  //         "候": "16",
  //         "学": "16",
  //         "习": "16",
  //         "因": "16",
  //         "为": "16",
  //         "以": "16",
  //         "后": "16",
  //         "生": "16",
  //         "活": "16",
  //         "会": "16",
  //         "变": "16",
  //         "得": "16",
  //         "非": "16",
  //         "常": "16",
  //         "忙": "16",
  //         "碌": "16"
  //     },
  //     "msg": "success",
  //     "total_score": 14.608695652173912
  // }
    const formData = new FormData();
    formData.append('text', currentEvaluationText.value[activeTab.value]);
    formData.append('language', activeTab.value);
    formData.append('audio', audioBlob.value, 'audio.wav'); // 确保正确添加文件名
    console.log('评测数据:', formData);
    // 根据返回结果，设置评测结果，以及渲染每个字符的评分颜色
    languageEvaluation(formData)
      .then(res => {
        evaluationResult.value = res.data;
        console.log('评测结果:', res.data);
      })
      .catch(error => {
        console.error('评测出错:', error);
      });
  }
  
  // 根据得分获取颜色
  function getColor(score) {
    if (score === undefined) return 'black'; // 默认颜色
    if (score > 75) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
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
  
  .result-bar div.active {
    font-weight: bold;
  }
  
  .result-very-good.active {
    background-color: green;
    color: white;
  }
  
  .result-good.active {
    background-color: orange;
    color: white;
  
  }
  
  .result-error.active {
    background-color: red;
    color: white;
  }
  
  .result-miss.active {
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
  