<template>
    <el-container>
      <el-main class="chat-container">
        <div class="message" v-for="message in messages" :key="message.id">
          <!-- 根据消息类型来决定消息的对齐方式 -->
          <div class="chat-bubble" :class="{ 'self': message.isSelf }">
            {{ message.content }}
          </div>
        </div>
      </el-main>
      <el-footer class="chat-footer">
        <el-input
          type="textarea"
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </el-footer>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const messages = ref([]); // 存储聊天消息的数组
  const inputMessage = ref(''); // 绑定到输入框的数据
  
  const sendMessage = () => {
    if (inputMessage.value.trim()) {
      const newMessage = {
        id: Date.now(), // 简单的生成消息id的方法
        content: inputMessage.value,
        isSelf: true // 假设所有消息都是自己发送的
      };
      messages.value.push(newMessage);
      inputMessage.value = ''; // 清空输入框
      // 这里可以加入发送消息的API调用
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    overflow-y: auto;
  }
  
  .message {
    padding: 10px;
  }
  
  .chat-bubble {
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    display: inline-block;
  }
  
  .chat-bubble.self {
    background-color: #409EFF;
    color: white;
    margin-left: auto;
  }
  
  .chat-footer {
    display: flex;
    align-items: center;
  }
  </style>
  