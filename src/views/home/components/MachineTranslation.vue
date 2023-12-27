<template>
  <div class="machine-translation-container">
    <div class="translation-panel">
      <div class="language-selectors">
        <el-select v-model="sourceLanguage" placeholder="源语言">
          <el-option
            v-for="language in languages"
            :key="language.value"
            :label="language.label"
            :value="language.value">
          </el-option>
        </el-select>

        <el-button type="info" @click="swapLanguages" size="large" :icon="Switch" plain>交换</el-button>

        <el-select v-model="targetLanguage" placeholder="目标语言">
          <el-option
            v-for="language in languages"
            :key="language.value"
            :label="language.label"
            :value="language.value">
          </el-option>
        </el-select>
      </div>

      <div class="translation-boxes">
        <el-input
          type="textarea"
          placeholder="输入文本"
          v-model="sourceText"
          :rows="10"
          maxlength="1000"
          show-word-limit>
        </el-input>

        <el-input
          type="textarea"
          placeholder="翻译结果"
          v-model="translatedText"
          :rows="10"
          readonly>
        </el-input>
      </div>

      <div class="translate-button">
        <el-button type="primary" size="large" @click="translateText" round>翻译</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Switch } from '@element-plus/icons-vue';
import { translate } from '@api/model';

const sourceLanguage = ref('auto'); // 设置默认语言为自动
const targetLanguage = ref('cn');
const sourceText = ref('');
const translatedText = ref('');
const detectedSourceLanguage = ref(''); // 用于存储自动检测到的源语言

const languages = ref([
    {"label": "自动识别", "value": "auto"},
    {"label": "中文(简体)", "value": "cn"},
    {"label": "中文(繁体)", "value": "cht"},
    {"label": "英语", "value": "en"},
    {"label": "日语", "value": "ja"},
    {"label": "韩语", "value": "ko"},
    {"label": "俄语", "value": "ru"},
    {"label": "法语", "value": "fr"},
    {"label": "西班牙语", "value": "es"},
    {"label": "阿拉伯语", "value": "ar"},
    {"label": "葡萄牙语", "value": "pt"},
    {"label": "南非荷兰语", "value": "af"},
    {"label": "阿姆哈拉语", "value": "am"},
    {"label": "阿塞拜疆语", "value": "az"},
    {"label": "巴什基尔语", "value": "ba"},
    {"label": "白俄罗斯语", "value": "be"},
    {"label": "别姆巴语", "value": "bem"},
    {"label": "保加利亚语", "value": "bg"},
    {"label": "比斯拉马语", "value": "bi"},
    {"label": "孟加拉语", "value": "bn"},
    {"label": "波斯尼亚语", "value": "bs"},
    {"label": "加泰罗尼亚语", "value": "ca"},
    {"label": "宿务语", "value": "ceb"},
    {"label": "科西嘉语", "value": "co"},
    {"label": "塞舌尔克里奥尔语", "value": "crs"},
    {"label": "捷克语", "value": "cs"},
    {"label": "威尔士语", "value": "cy"},
    {"label": "丹麦语", "value": "da"},
    {"label": "德语", "value": "de"},
    {"label": "埃维语", "value": "ee"},
    {"label": "希腊语", "value": "el"},
    {"label": "世界语", "value": "eo"},
    {"label": "爱沙尼亚语", "value": "et"},
    {"label": "巴斯克语", "value": "eu"},
    {"label": "波斯语", "value": "fa"},
    {"label": "芬兰语", "value": "fi"},
    {"label": "菲律宾语", "value": "fil"},
    {"label": "斐济语", "value": "fj"},
    {"label": "弗里西语", "value": "fy"},
    {"label": "爱尔兰语", "value": "ga"},
    {"label": "苏格兰盖尔语", "value": "gd"},
    {"label": "加利西亚", "value": "gl"},
    {"label": "古吉拉特语", "value": "gu"},
    {"label": "豪萨语", "value": "ha"},
    {"label": "夏威夷语", "value": "haw"},
    {"label": "希伯来语", "value": "he"},
    {"label": "印地语", "value": "hi"},
    {"label": "克罗地亚语", "value": "hr"},
    {"label": "海地克里奥尔语", "value": "ht"},
    {"label": "匈牙利语", "value": "hu"},
    {"label": "亚美尼亚语", "value": "hy"},
    {"label": "印尼语", "value": "id"},
    {"label": "伊博语", "value": "ig"},
    {"label": "冰岛语", "value": "is"},
    {"label": "意大利语", "value": "it"},
  // 添加更多语言选项
  // ...
]);

const swapLanguages = () => {
  if (sourceLanguage.value !== 'auto') {
    [sourceLanguage.value, targetLanguage.value] = [targetLanguage.value, sourceLanguage.value];
  } else {
    ElMessage.warning("无法交换自动识别语言");
  }
};

const translateText = () => {
  if (!sourceText.value.trim()) {
    ElMessage.error("请输入要翻译的文本");
    return;
  }
  translate({
    sourceLanguage: sourceLanguage.value,
    targetLanguage: targetLanguage.value,
    text: sourceText.value
  }).then(response => {
    if (response.code === 0) {
      translatedText.value = response.data.translatedText; // 获取翻译结果
      detectedSourceLanguage.value = response.data.detectedSourceLanguage || ''; // 获取检测到的源语言
      console.log('检测到的语言为:',detectedSourceLanguage.value)
      // 如果是自动检测的语言则更新源语言
      if (detectedSourceLanguage.value !== '' && sourceLanguage.value === 'auto') {
        sourceLanguage.value = detectedSourceLanguage.value;
      }
      ElMessage.success("翻译成功");
    } else {
      ElMessage.error("翻译失败：" + response.msg);
    }
  }).catch(error => {
    console.error("翻译接口调用失败", error);
    ElMessage.error("翻译时发生错误，请稍后重试");
  });
};

</script>

<style scoped>
.machine-translation-container {
  padding: 20px;
  max-width: 900px; /* 调整为合适的宽度 */
  margin: auto;
}

.translation-panel {
  border: 1px solid #ebebeb;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.language-selectors {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.translation-boxes {
  display: flex;
  gap: 20px; /* 为输入框和结果框之间添加间隙 */
}

/* 调整输入框和结果框的样式 */
.translation-boxes > .el-input {
  flex: 1; /* 让两个框平分可用空间 */
}

.translate-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
