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
        <div style="font-size:14px">
          <h3>录音时长：{{ recorder && duration.toFixed(4) }}</h3>
          <br />
          <el-button type="primary" @click="resetText">换一换</el-button>
          <el-button type="primary" @click="handleStart">开始录音</el-button>
          <el-button type="info" @click="handlePause">暂停录音</el-button>
          <el-button type="success" @click="handleResume">继续录音</el-button>
          <el-button type="warning" @click="handleStop">停止录音</el-button>
          <br />
          <br />
          <h3>
            播放时长：{{
              recorder &&
              (playTime > duration
                ? duration.toFixed(4)
                : playTime.toFixed(4))
            }}
          </h3>
          <br />
          <el-button type="primary" @click="handlePlay">播放录音</el-button>
          <el-button type="info" @click="handlePausePlay">暂停播放</el-button>
          <el-button type="success" @click="handleResumePlay">继续播放</el-button>
          <el-button type="warning" @click="handleStopPlay">停止播放</el-button>
          <el-button type="error" @click="handleDestroy">销毁录音</el-button>
          <el-button type="primary" @click="uploadRecord">上传</el-button>
        </div>
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
import Recorder from 'js-audio-recorder';
import { languageEvaluation } from '@api/model';
import { ref } from 'vue';

// 录音实例(采样率16k、位长16bit、单声道)
let recorder = new Recorder({
    sampleBits: 16,         // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1,         // 声道，支持 1 或 2， 默认是1
});
// 播放时长
const playTime = ref(0);
// 上传的音频地址
const src = ref(null);
const duration = ref(0);

let timer = null;
let recordTimer = null;

// 当前激活的语言选项卡
const activeTab = ref('en');
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

// 评测结果
const evaluationResult = ref(null);

// 开始录音
function handleStart() {
  Recorder.getPermission().then(() => {
    console.log('开始录音');
    recorder.start();
    recordTimer = setInterval(() => {
      duration.value = recorder.duration;
    }, 100);
  }, (error) => {
    console.log(`${error.name} : ${error.message}`);
  });
}

// 暂停录音
function handlePause() {
  console.log('暂停录音');
  recorder.pause();
  clearInterval(recordTimer);
}

// 继续录音
function handleResume() {
  console.log('恢复录音');
  recorder.resume();
  recordTimer = setInterval(() => {
    duration.value = recorder.duration;
  }, 100);
}

// 停止录音
function handleStop() {
  console.log('停止录音');
  recorder.stop();
  clearInterval(recordTimer);
}

// 播放录音
function handlePlay() {
  console.log('播放录音');
  recorder.play();

  timer = setInterval(() => {
    try {
      playTime.value = recorder.getPlayTime();
    } catch (error) {
      clearInterval(timer);
    }
  }, 100);
}

// 暂停播放
function handlePausePlay() {
  console.log('暂停播放');
  recorder.pausePlay();

  playTime.value = recorder.getPlayTime();
  clearInterval(timer);
}

// 继续播放
function handleResumePlay() {
  console.log('恢复播放');
  recorder.resumePlay();

  timer = setInterval(() => {
    try {
      playTime.value = recorder.getPlayTime();
    } catch (error) {
      clearInterval(timer);
    }
  }, 100);
}

// 停止播放
function handleStopPlay() {
  console.log('停止播放');
  recorder.stopPlay();

  playTime.value = recorder.getPlayTime();
  clearInterval(timer);
}

// 销毁录音实例
function handleDestroy() {
  console.log('销毁实例');
  // 销毁录音实例，置为null释放资源，fn为回调函数，
  recorder.destroy().then(function() {
      recorder = null;
  });
  clearInterval(timer);
  clearInterval(recordTimer);
  playTime.value = 0; // Reset play time
  duration.value = 0; // Reset duration
}

// 上传录音评测
function uploadRecord() {
  if (recorder.duration === 0) {
    console.error('请先录音');
    return;
  }

  recorder.pause();
  clearInterval(timer);
  clearInterval(recordTimer);
  console.log('上传录音');

  const formData = new FormData();
  // wav格式
  const blob = recorder.getWAVBlob();
  const newBlob = new Blob([blob], { type: 'audio/wav' });
  const fileOfBlob = new File([newBlob], 'audio.wav');
  // pcm格式
  // const blob = recorder.getPCMBlob();
  // const newBlob = new Blob([blob], { type: 'audio/pcm' });
  // const fileOfBlob = new File([newBlob], 'audio.pcm');
  formData.append('text', currentEvaluationText.value[activeTab.value]);
  formData.append('language', activeTab.value);
  formData.append('audio', fileOfBlob);

  languageEvaluation(formData).then(res => {
    console.log('评测结果:', res.data);
    evaluationResult.value = res.data;
  }).catch(error => {
    console.error('评测出错:', error);
  });
  const url = window.URL.createObjectURL(newBlob);
  src.value = url;
}

// 重置评测文本
function resetText() {
  const index = Math.floor(Math.random() * evaluationText.value.length);
  currentEvaluationText.value = evaluationText.value[index];
}

// 根据分数获取颜色
function getColor(score) {
  if (score === 0) {
    return '#00FF00'; // 绿色 (正确)
  } else if (score === 16) {
    return '#FFFF00'; // 黄色 (漏读)
  } else if (score === 32) {
    return '#FFA500'; // 橙色 (增读)
  } else if (score === 64) {
    return '#FF0000'; // 红色 (回读)
  } else if (score === 128) {
    return '#800080'; // 紫色 (替换)
  } else {
    return '#000000'; // 默认黑色
  }
}
// {score: {…}, AccuracyScore: 0, Fluency Score: 88.026398, Phone Score: 95.833336, Time Length: 404, …}
// AccuracyScore
// : 
// 0
// Fluency Score
// : 
// 88.026398
// Phone Score
// : 
// 95.833336
// Time Length
// : 
// 404
// Tone Score
// : 
// 91.666664
// Total Score
// : 
// 87.737236
// msg
// : 
// "success"
// score
// : 
// 好
// : 
// "0"
// 实
// : 
// "0"
// 想
// : 
// "0"
// 方
// : 
// "0"
// 是
// : 
// "0"
// 最
// : 
// "0"
// 来
// : 
// "0"
// 梦
// : 
// "0"
// 法
// : 
// "0"
// 现
// : 
// "0"
// 的
// : 
// "0"
// 醒
// : 
// "0"
// [[Prototype]]
// : 
// Object
// [[Prototype]]
// : 
// Object

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
