<template>
  <div class="image-recognition-container">
    <!-- 上传面板区域 -->
    <div class="upload-panel">
      <el-upload
        class="image-uploader"
        :on-change="handleImageChange"  
        :on-remove="handleImageRemove" 
        :on-preview="()=>{dialogVisible=true}"
        :auto-upload="false"
        v-model:file-list="fileList1"  
        list-type="picture-card">
        <i class="el-icon-plus"></i>  <!-- 上传按钮的图标 -->
      </el-upload>
      <el-dialog v-model="dialogVisible"> <!-- 图片预览对话框，可见性由dialogVisible控制 -->
        <img :src="currentImage" style="width: 100%;" /> <!-- 显示当前选择的图片 -->
      </el-dialog>
    </div>
    <!-- 图像识别操作面板区域 -->
    <div class="recognition-panel">
      <el-button type="primary" size="large" @click="recognizeImage" :disabled="!currentImage" round>开始识别</el-button>
      <!-- 识别按钮，如果没有图片则禁用 -->
      <div class="result-box">
        <el-input
          type="textarea"
          placeholder="识别结果"
          v-model="recognitionResult" 
          :rows="10"
          readonly>  <!-- 设置为只读，不允许编辑 -->
        </el-input>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { uploadImage } from '@api/model';  //API 方法，用于上传图片
import { useUtilStore } from '@/store/util'; // 全局状态管理器，用于获取图片的 URL
// 当前选中的图片
const currentImage = ref(null);
// 控制对话框显示的响应式变量
const dialogVisible = ref(false);
// 存储图像识别结果的响应式变量
const recognitionResult = ref('');
// 存储图片的URL
const imageUrl = ref('');
// 文件列表
const fileList1 = ref([]);
// 处理图片更改事件
const handleImageChange = (file,fileList)=> {
  // console.log('0000000000000000000000')
  // 调用 API 上传图片，并在完成后显示图片预览
  // console.log(fileList1.value)
  // console.log(file.raw)
  let formData = new FormData();
  formData.append('file', file.raw);
  // console.log(formData)
  uploadImage(formData).then((res) => {
    console.log(res)
    //从后端返回的结果中获取图片的 URL
    imageUrl.value = useUtilStore().base_url + '/imgadownload/' + res.data.filename
    // console.log(imageUrl.value)
    currentImage.value = imageUrl.value;
    console.log('单前选中的图片URL:',currentImage.value)
    // console.log(fileList)
    // fileList[0].url = imageUrl.value
    dialogVisible.value = true; // 显示图片预览对话框
  });
};
// 处理图片移除事件
const handleImageRemove = () => {
  // 在这里实现图片移除的逻辑
  currentImage.value = null;
  dialogVisible.value = false;
};

// 调用后端 API 进行图像识别
const recognizeImage = async () => {
  // 在这里实现调用后端进行图像识别的逻辑
};
</script>
<style scoped>
.image-recognition-container {
  /* 整体容器样式 */
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 10px;
}

.upload-panel, .recognition-panel {
  /* 上传和识别面板的样式 */
  margin-bottom: 20px;
}

.image-uploader {
  /* 图片上传器的样式 */
}

.result-box {
  /* 结果显示框的样式 */
}
</style>
