<template>
  <div class="image-recognition-container">
    <!-- 图片上传区域 -->
    <div class="upload-panel">
      <el-upload
        class="image-uploader"
        :on-change="handleImageChange"
        :on-preview="()=>{dialogVisible=true}"
        :auto-upload="false"
        list-type="picture-card"
        :file-list="fileList">
        <i class="el-icon-plus"></i> <!-- 上传按钮的图标 -->
      </el-upload>
    </div>

    <!-- 图片缩略图与操作区域 -->
    <div v-if="currentImage" class="recognition-panel">
      <!-- 识别与移除按钮 -->
      <div class="buttons">
        <el-button type="primary" size="large" @click="recognizeImage" round>开始识别</el-button>
        <el-button type="danger" size="large" @click="handleImageRemove" round>移除图片</el-button>
      </div>
      
      <!-- 识别结果显示框 -->
      <div class="result-box" :class="{'not-recognized': !isRecognized, 'recognized': isRecognized}">
        <el-input
          type="textarea"
          placeholder="识别结果"
          v-model="recognitionResult"
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
</template>

<script setup>
import { ref } from 'vue';
import { uploadImage,ocrImage } from '@api/model';
import { useUtilStore } from '@/store/util';

const currentImage = ref('');
const recognitionResult = ref('');
const dialogVisible = ref(false);
const isRecognized = ref(false); // 表示是否完成识别
const fileList = ref([]); // 用于存储上传的图片列表
const currentImageName = ref(''); // 用于存储当前上传的图片名称

// 只能上传一张图片，且图片大小不能超过 4MB，格式只能是 jpg、jpeg、png、bpm
const handleImageChange = async (file) => {
  let formData = new FormData();
  formData.append('file', file.raw);

  try {
    const response = await uploadImage(formData);
    console.log("后端返回图片信息:",response)
    currentImage.value = useUtilStore().base_url + '/imgadownload/' + response.data.filename;
    currentImageName.value = response.data.filename;
    fileList.value = [{ name: file.raw.name, url: currentImage.value }]; // 创建文件列表的缩略图
  } catch (error) {
    console.error("上传失败:", error);
    // 清空图片信息
    currentImage.value = null;
    currentImageName.value = '';
    fileList.value = [];
  }
};

const handleImageRemove = () => {
  currentImage.value = null;
  recognitionResult.value = '';
  isRecognized.value = false;
  fileList.value = [];
};

const recognizeImage = async () => {
  try {
    let data = {
      image_name: currentImageName.value
    }
    const response = await ocrImage(data);
    console.log("后端返回识别结果:",response)
    recognitionResult.value = response.data.text;
    isRecognized.value = true;
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

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.result-box {
  margin-bottom: 20px;
}

.result-box.not-recognized {
  border: 1px solid red;
}

.result-box.recognized {
  border: 1px solid green;
}
</style>
