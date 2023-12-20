<template>
  <div class="home-view">
    <div class="chat-panel">
      <div class="left-panel">
        <div class="session-panel">
          <div class="title">ChatGPT助手</div>
          <div class="description">构建你的AI助手</div>
          <div class="session-list">
            <SessionItem 
              v-for="session in sessions" 
              :key="session.id" 
              :session="session"
              :active="session.id === selectedSession.id"
              @select="selectSession"
              @delete="deleteSession"
            />
          </div>
        </div>
        <el-button-group class="user-actions">
          <el-button type="text">个人信息</el-button>
          <el-button type="text">设置</el-button>
          <el-button type="text">退出</el-button>
        </el-button-group>
      </div>
      <div class="message-panel">
        <div class="header">
          <div class="front">
            <div class="title">{{ selectedSession.title }}</div>
            <div class="description">与ChatGPT的对话</div>
          </div>
        </div>
        <div class="message-list">
          <div v-for="message in selectedSession.messages" :key="message.id" :class="['message', message.type === 'user' ? 'user-message' : 'chatgpt-message']">
            {{ message.text }}
          </div>
        </div>
        <MessageInput @send="handleSendMessage"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SessionItem from './components/SessionItem.vue';
import MessageInput from './components/MessageInput.vue';

const sessions = ref([
  { id: 1, title: '会话 1', messages: [{ id: 1, text: '你好!' }], updatedAt: '2023-12-20' },
  { id: 2, title: '会话 2', messages: [], updatedAt: '2023-12-20' }
]);
const selectedSession = ref(sessions.value[0]);

const selectSession = (session) => {
  selectedSession.value = session;
};

const deleteSession = (sessionToDelete) => {
  sessions.value = sessions.value.filter(session => session.id !== sessionToDelete.id);
  if (selectedSession.value.id === sessionToDelete.id) {
    selectedSession.value = sessions.value[0] || {};
  }
};

const handleSendMessage = (message) => {
  if (!selectedSession.value || !selectedSession.value.messages) return;
  selectedSession.value.messages.push({
    id: Date.now(),
    text: message,
    type: 'user'
  });
};
</script>

<style lang="scss" scoped>
.home-view {
  width: 100vw;
  display: flex;
  justify-content: center;

  .chat-panel {
    display: flex;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 20px 20px rgba(black, 0.05);
    margin-top: 70px;

    .left-panel {
      width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: rgb(231, 248, 255);
      border-radius: 20px;
      overflow: hidden;

      .session-panel {
        padding: 20px;
        position: relative;
        border-right: 1px solid rgba(black, 0.07);

        .title {
          margin-top: 20px;
          font-size: 20px;
        }

        .description {
          color: rgba(black, 0.7);
          font-size: 14px;
          margin-top: 10px;
        }

        .session-list {
          .session {
            margin-top: 20px;
          }
        }
      }

      .user-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-top: 2px solid rgba(0, 0, 0, 0.1);

        .el-button {
          margin-bottom: 10px;
          width: 100%;
        }
      }
    }

    .message-panel {
      width: 700px;

      .header {
        padding: 20px 20px 0 20px;
        display: flex;
        justify-content: space-between;

        .front {
          .title {
            color: rgba(black, 0.7);
            font-size: 20px;
          }

          .description {
            margin-top: 10px;
            color: rgba(black, 0.5);
          }
        }
      }

      .message-list {
        height: 700px;
        padding: 15px;
        overflow-y: scroll;

        .list-enter-active,
        .list-leave-active {
          transition: all 0.5s ease;
        }

        .list-enter-from,
        .list-leave-to {
          opacity: 0;
          transform: translateX(30px);
        }

        .user-message {
          background-color: #e3f2fd;
          border: 1px solid #90caf9;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          margin-left: auto;
          max-width: 70%;
        }

        .chatgpt-message {
          background-color: #f0f4c3;
          border: 1px solid #e6ee9c;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          margin-right: auto;
          max-width: 70%;
        }
      }
    }
  }
}
</style>
