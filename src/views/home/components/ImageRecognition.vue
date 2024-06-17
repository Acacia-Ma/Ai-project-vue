<template>
  <div class="image-recognition-container">
    <div class="layout-container">
      <!-- 识别历史区域 -->
      <div class="history-panel">
        <div class="title">识别历史</div>
        <div class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item" @click="selectHistory(item)">
            <img :src="item.thumbnail" class="history-thumbnail" />
            <div class="history-details">
              <div class="history-name">{{ item.name }}</div>
              <div class="history-time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图片及识别区域 -->
      <div class="image-panel">
        <!-- 图片上传区域 -->
        <div class="upload-panel">
          <el-upload
            class="image-uploader"
            :on-change="handleImageChange"
            :on-preview="() => { dialogVisible = true }"
            :auto-upload="false"
            list-type="picture-card"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>

        <!-- 图片识别按钮 -->
        <div v-if="currentImage" class="recognition-action">
          <el-button type="primary" @click="recognizeImage">识别图片</el-button>
        </div>

        <!-- 上传作文的语言 -->
        <div v-if="currentImage" class="recognition-action">
          <el-select v-model="language" placeholder="请选择语言">
            <el-option label="中文" value="ch"></el-option>
            <el-option label="英文" value="en"></el-option>
          </el-select>
        </div>

        <!-- 选中的历史记录详情 -->
        <div v-if="selectedHistory" class="recognition-panel">
          <div class="result-box">
            <el-input
              type="textarea"
              placeholder="识别结果"
              v-model="selectedHistory.text"
              :rows="10"
              readonly>
            </el-input>
            <TextLoading v-if="isLoading" />
          </div>
        </div>

        <!-- 作文批改区域 -->
        <div v-if="currentImage && !isLoading" class="composition-correction-panel">
          <div class="title">作文批改</div>
          <div class="correction-box">
            <el-input
              type="textarea"
              placeholder="请输入要批改的作文"
              v-model="compositionText"
              :rows="10">
            </el-input>
            <div class="correction-action">
              <el-button type="primary" @click="correctComposition">批改作文</el-button>
            </div>
          </div>
          <div v-if="correctionResult" class="correction-result-box">
            <el-input
              type="textarea"
              placeholder="批改结果"
              v-model="correctionResult"
              :rows="10"
              readonly>
            </el-input>
          </div>
        </div>

        <!-- 图片预览对话框 -->
        <el-dialog v-model="dialogVisible">
          <img :src="currentImage" class="full-image" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { uploadImage, ocrImage, ocrImagehistory, correctCompositionAPI } from '@api/model';
import TextLoading from './TextLoading.vue';
import { useUtilStore } from '@/store/util';

const language = ref('');

const currentImage = ref('');
const dialogVisible = ref(false);
const fileList = ref([]);
const currentImageName = ref('');
const history = ref([]);
const selectedHistory = ref(null);
const isLoading = ref(false);
const compositionText = ref('');
const correctionResult = ref('');

const handleImageChange = async (file) => {
  let formData = new FormData();
  formData.append('file', file.raw);

  try {
    const response = await uploadImage(formData);
    const imageUrl = useUtilStore().base_url + '/imgadownload/' + response.data.filename;
    currentImage.value = imageUrl;
    currentImageName.value = response.data.filename;
    fileList.value = [{ name: file.raw.name, url: imageUrl }];

    selectedHistory.value = {
      id: Date.now(),
      name: currentImageName.value,
      text: '',
      thumbnail: imageUrl,
      time: new Date().toLocaleString(),
    };
  } catch (error) {
    console.error("上传失败:", error);
    currentImage.value = null;
    currentImageName.value = '';
    fileList.value = [];
  }
};

const getHistory = async () => {
  try {
    const response = await ocrImagehistory();
    history.value = response.data.map(item => ({
      id: item.img_id,
      name: item.name,
      text: item.content,
      thumbnail: useUtilStore().base_url + '/imgadownload/' + item.name,
      time: item.created_at,
    }));
    console.log('历史记录：', history.value);
  } catch (error) {
    console.error("获取历史记录失败:", error);
  }
};

onMounted(getHistory);

const selectHistory = (item) => {
  selectedHistory.value = item;
};

const recognizeImage = async () => {
  if (!currentImageName.value) {
    console.error("没有图片进行识别");
    return;
  }
  isLoading.value = true;
  try {
    const requestData = {
      image_name: currentImageName.value,
      id: Date.now(),
      create_time: new Date().toISOString(),
      language: language.value,
    };

    const response = await ocrImage(requestData);
    console.log('识别结果：', response);
    selectedHistory.value = {
      id: requestData.id,
      name: currentImageName.value,
      text: response.data,
      thumbnail: currentImage.value,
      time: new Date().toLocaleString(),
    };
    history.value.push({ ...selectedHistory.value });
  } catch (error) {
    console.error("识别失败:", error);
  } finally {
    isLoading.value = false;
  }
};

const correctComposition = async () => {
  if (!compositionText.value) {
    console.error("没有输入作文内容");
    return;
  }
  isLoading.value = true;
  try {
    const response = await correctCompositionAPI({ text: compositionText.value });
    correctionResult.value = response.data.correctedText;
  } catch (error) {
    console.error("批改失败:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.image-recognition-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
}

.layout-container {
  display: flex;
  gap: 20px;
}

.history-panel {
  flex: 1;
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.history-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
  border-bottom: 1px solid #ddd;
}

.history-item:hover {
  background-color: #e0e0e0;
}

.history-details {
  display: flex;
  flex-direction: column;
}

.history-name {
  font-weight: bold;
}

.history-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
}

.image-panel {
  flex: 2;
}

.upload-panel {
  margin-bottom: 20px;
  text-align: center;
}

.recognition-action {
  margin-bottom: 20px;
  text-align: center;
}

.result-box {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.composition-correction-panel {
  margin-top: 20px;
}

.correction-box {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.correction-action {
  margin-top: 10px;
  text-align: center;
}

.correction-result-box {
  margin-top: 20px;
}

.full-image {
  width: 100%;
}

.el-dialog__wrapper {
  z-index: 9999;
}

.el-upload-list {
  display: none;
}

.el-upload-list__item {
  display: none;
}

.el-upload-list__item-thumbnail {
  display: none;
}

.el-upload-list__item-name {
  display: none;
}
</style>
