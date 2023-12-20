<template>
    <div class="message-input">
      <div class="input-wrapper">
        <!-- 按回车键发送，输入框高度三行 -->
        <el-input
          v-model="message"
          :autosize="false"
          :rows="3"
          class="input"
          resize="none"
          type="textarea"
          @keydown.enter="sendMessage"
        >
        </el-input>
        <div class="button-wrapper">
          <el-button type="primary" @click="sendMessage">
            <el-icon class="el-icon--left">
              <Position />
            </el-icon>
            发送
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Position } from '@element-plus/icons-vue';
  
  const message = ref('');
  const emit = defineEmits(['send']);
  
  const sendMessage = () => {
    if (message.value.trim()) {
      emit('send', message.value);
      message.value = '';
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .message-input {
    padding: 20px;
    border-top: 1px solid rgba(black, 0.07);
    border-left: 1px solid rgba(black, 0.07);
    border-right: 1px solid rgba(black, 0.07);
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .input-wrapper {
  flex-grow: 1; /* 使输入框占据多余空间 */
  display: flex;
  align-items: center; /* 垂直居中输入框和按钮 */

  .input {
    flex-grow: 1; /* 使输入框占据多余空间 */
    margin-right: 10px; /* 为按钮留出间隔 */
  }
}
  .button-wrapper {
    margin-top: 0; /* 在同一行上时不需要顶部间距 */
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  </style>
  