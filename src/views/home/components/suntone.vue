<template>
  <div style="padding: 20px;">
    <h3>录音上传</h3>

    <div style="font-size:14px">
      <h3>录音时长：{{ recorder && recorder.duration.toFixed(4) }}</h3>
      <br />
      <el-button type="primary" @click="handleStart">开始录音</el-button>
      <el-button type="info" @click="handlePause">暂停录音</el-button>
      <el-button type="success" @click="handleResume">继续录音</el-button>
      <el-button type="warning" @click="handleStop">停止录音</el-button>
      <br />
      <br />
      <h3>
        播放时长：{{
          recorder &&
            (playTime > recorder.duration
              ? recorder.duration.toFixed(4)
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
</template>

<script setup>
import Recorder from 'js-audio-recorder';
import { languageEvaluation } from '@api/model';
import { ref } from 'vue';

const recorder = new Recorder();
const playTime = ref(0);
const src = ref(null);
let timer = null;

function handleStart() {
  Recorder.getPermission().then(() => {
    console.log('开始录音');
    recorder.start();
  }, (error) => {
    console.log(`${error.name} : ${error.message}`);
  });
}

function handlePause() {
  console.log('暂停录音');
  recorder.pause();
}

function handleResume() {
  console.log('恢复录音');
  recorder.resume();
}

function handleStop() {
  console.log('停止录音');
  recorder.stop();
}

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

function handlePausePlay() {
  console.log('暂停播放');
  recorder.pausePlay();

  playTime.value = recorder.getPlayTime();
  clearInterval(timer);
}

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

function handleStopPlay() {
  console.log('停止播放');
  recorder.stopPlay();

  playTime.value = recorder.getPlayTime();
  clearInterval(timer);
}

function handleDestroy() {
  console.log('销毁实例');
  recorder.destroy();
  clearInterval(timer);
}

function uploadRecord() {
  if (recorder.duration === 0) {
    console.error('请先录音');
    return;
  }

  recorder.pause();
  clearInterval(timer);
  console.log('上传录音');

  const formData = new FormData();
  const blob = recorder.getWAVBlob();
  const newBlob = new Blob([blob], { type: 'audio/wav' });
  const fileOfBlob = new File([newBlob], 'audio.wav');
  formData.append('audio', fileOfBlob);

  languageEvaluation(formData).then(res => {
    console.log('评测结果:', res.data);
  }).catch(error => {
    console.error('评测出错:', error);
  });

  const url = window.URL.createObjectURL(newBlob);
  src.value = url;
}
</script>

