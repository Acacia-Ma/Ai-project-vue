<template>
  <div class="image-recognition-container">
    <div class="layout-container">
      <!-- 识别历史区域 -->
      <div class="history-panel">
        <h3>识别历史</h3>
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
import { ref } from 'vue';
import { uploadImage, ocrImage, ocrImagehistory } from '@api/model';
import { useUtilStore } from '@/store/util';

const currentImage = ref('');
const dialogVisible = ref(false);
const fileList = ref([]);
const currentImageName = ref('');
const history = ref([]);
const selectedHistory = ref(null);

// 处理图片上传
const handleImageChange = async (file) => {
  let formData = new FormData();
  formData.append('file', file.raw);

  try {
    const response = await uploadImage(formData);
    const imageUrl = useUtilStore().base_url + '/imgadownload/' + response.data.filename;
    currentImage.value = imageUrl;
    currentImageName.value = response.data.filename;
    fileList.value = [{ name: file.raw.name, url: imageUrl }];

    // 在创建历史记录时添加图片名称
    selectedHistory.value = {
      id: Date.now(),
      name: currentImageName.value, // 添加图片名称
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
// 获取历史记录
// 获取历史记录
const getHistory = async () => {
  try {
    const response = await ocrImagehistory();
    history.value = response.data.map(item => ({
      id: item.img_id,
      name: item.name,
      text: item.content, // 确保这个字段存在
      thumbnail: useUtilStore().base_url + '/imgadownload/' + item.name, // 确保这个字段存在并且是正确的URL
      time: item.created_at, // 格式化时间如果需要
    }));
    console.log('历史记录：', history.value);
  } catch (error) {
    console.error("获取历史记录失败:", error);
  }
};

onMounted(getHistory);
// 选择历史记录
const selectHistory = (item) => {
  selectedHistory.value = item;
};

// 进行图片识别
const recognizeImage = async () => {
  if (!currentImageName.value) {
    console.error("没有图片进行识别");
    return;
  }

  try {
    // 构造要发送到后端的数据
    const requestData = {
      image_name: currentImageName.value,
      id: Date.now(), // 根据需要生成或获取id
      create_time: new Date().toISOString(), // 使用ISO格式的时间
    };

    const response = await ocrImage(requestData);
    selectedHistory.value = {
      id: requestData.id,
      name: currentImageName.value,
      text: response.data.text,
      thumbnail: currentImage.value,
      time: new Date().toLocaleString(),
    };
    history.value.push({ ...selectedHistory.value });
  } catch (error) {
    console.error("识别失败:", error);
  }
};
</script>

<style scoped>
.image-recognition-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 10px;
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
}

.history-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid #ddd;
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
}

.image-panel {
  flex: 2;
}

.upload-panel, .recognition-panel {
  margin-bottom: 20px;
}

.image-uploader, .thumbnail {
  /* 图片上传器和缩略图样式 */
}

.uploaded-thumbnail {
  max-width: 100px;
  height: auto;
  cursor: pointer;
}

.full-image {
  width: 100%;
}

.recognition-action {
  margin-bottom: 20px;
}

.result-box {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
