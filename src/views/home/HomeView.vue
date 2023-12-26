<template>
  <div class="home-view">
    <div class="chat-panel">
      <div class="left-panel">
        <div class="session-panel">
          <div class="title">ChatGPT助手 <el-button :icon="Plus" @click="addClick()">添加会话</el-button></div>
          <div class="description">构建你的AI助手</div>
          <el-scrollbar class="session-list-scrollbar">
            <div class="session-list">
              <div v-if="sessions.length==0">暂无数据</div>
              <div   v-else>
                <SessionItem 
                  v-for="session in sessions"
                  :key="session.id" 
                  :session="session"
                  :active="session.id === selectedSession.id"
                  @select="selectSession"
                  @delete="deleteSession"
                  @edit="editSession"
                />
              </div>
          </div>
        </el-scrollbar>
        </div>
        <el-button-group class="user-actions">
          <el-button type="primary" :icon="UserFilled" size="large" @click="isUserInfoFormVisible = true">个人信息</el-button>
          <UserInfoForm :title="isUserInfoFormVisible" @close="close"/>
          <el-button type="primary" :icon="Setting" size="large">设置</el-button>
          <el-button type="primary" :icon="SwitchButton" size="large" @click="logoutClick">退出</el-button>
        </el-button-group>
      </div>
      <div class="message-panel">
        <div class="header">
          <div class="front">
            <div class="title">{{ selectedSession?.title || '请选择会话' }}</div>
            <div class="description">与ChatGPT的对话</div>
          </div>
        </div>
        <div class="message-list" id="chat-box">
          <div v-for="message in selectedSession?.messages || []" :key="message.id" :class="['message', message.type === 'user' ? 'user-message' : 'chatgpt-message']">
            <div v-html="message.text" class="message-content"></div>
          </div>
          <TextLoading v-if="isLoading" />
        </div>
        <MessageInput @send="handleSendMessage"/>
      </div>
    </div>
  </div>
  <!-- 会话名称编辑对话框 -->
  <el-dialog title="编辑会话名称" v-model="isEditingSession" width="500px">
    <el-input v-model="editingSessionName" placeholder="请输入新的会话名称"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditingSession = false">取消</el-button>
      <el-button type="primary" @click="saveSessionName">保存</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref , onMounted} from 'vue';
import { useRouter } from 'vue-router';
import SessionItem from './components/SessionItem.vue';
import MessageInput from './components/MessageInput.vue';
import UserInfoForm from './components/UserInfoForm.vue';
import TextLoading from './components/TextLoading.vue';
import { Setting, UserFilled, SwitchButton, Plus } from '@element-plus/icons-vue';
import { Logout,Chat } from '@api/user';
import {useTestStore} from '@/store/user' // 确保正确导入user
import { getChatSessions, createChatSession, deleteChatSession,updateChatSession,addChatHistory,getChatHistory } from '@api/model';

// 加载状态变量
const isLoading = ref(false);
const isUserInfoFormVisible = ref(false);
const router = useRouter();
const sessions = ref([]);

const selectedSession = ref([]);
const isEditingSession = ref(false);
const editingSessionId = ref(null);
const editingSessionName = ref('');
const user = useTestStore()

function getList(){
   getChatSessions().then((response) => {
      console.log("res:",response)
      if (response && response.data && Array.isArray(response.data)) {
      sessions.value = response.data.map(session => ({
        id: session.chat_id,
        title: session.title,
        messages: [],
        updatedAt: session.updated_at // 确保这与后端返回的字段匹配
      }));
      if(response.data.length>0){
        selectedSession.value = sessions.value[0];
        getselectHistory()
      }
      console.log('Processed sessions:', sessions.value);
      console.log("sessions.value:",sessions.value)
    } else {
      console.error('Invalid session data:', response);
    }
    })
}
//初始化会话列表
onMounted(async () => {
  getList()
});

// 创建新会话
const addClick = async () => {
  try {
    const newSession = {
      chat_id: Date.now().toString(),
      username: user.username,
      title: '新会话'
    };
  createChatSession(newSession).then(data=>{
     // 添加到本地状态
     sessions.value.push({ ...newSession, id: newSession.chat_id, messages: [] ,updatedAt:data.data.updatedAt});
    console.log(sessions.value)
    console.log('会话创建成功');
    // 可选：重新获取会话列表
    // await getList();
  })
  } catch (error) {
    console.error('Error creating session:', error);
  }
};
// 弹窗
const editSession = (session) => {
  editingSessionId.value = session.id;
  editingSessionName.value = session.title;
  isEditingSession.value = true;
};
// 编辑会话
const saveSessionName = async () => {
  const session = sessions.value.find(s => s.id === editingSessionId.value);
  console.log('session:', session)
  if (session) {
    try {
      // 发送请求更新后端数据
      await updateChatSession(session.id, { title: editingSessionName.value });
      // 更新前端状态
      session.title = editingSessionName.value;
      console.log('会话名称更新成功');
    } catch (error) {
      console.error('更新会话名称时出错:', error);
      console.log(session.chat_id, { title: editingSessionName.value });
    }
  }
  isEditingSession.value = false;
};
// 获取单前会话历史聊天记录  getChatHistory
function getselectHistory(){
  getChatHistory(selectedSession.value.id).then((response) => {
    console.log("res:",response)
    if (response && response.data && Array.isArray(response.data)) {
      selectedSession.value.messages = response.data.map(session => ({
        id: session.chat_id,
        text: session.text,
        type: session.type
      }));
      document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
      console.log('Processed sessions:', selectedSession.value.messages);
    } else {
      console.error('Invalid session data:', response);
    }
  })
}

const selectSession = (session) => {
  selectedSession.value = session;
  getselectHistory()
};

// 删除会话
function deleteSession(sessionToDelete) {
  console.log("删除会话：",sessionToDelete)
  console.log("删除会话ID:",sessionToDelete.id)
  deleteChatSession(sessionToDelete.id)
    .then(() => {
      sessions.value = sessions.value.filter(session => session.id !== sessionToDelete.id);
      // 处理当前选中的会话被删除的情况
      if (selectedSession.value.id === sessionToDelete.id) {
        selectedSession.value = sessions.value[0] || {};
      }
      console.log('Session deleted successfully');
    })
    .catch(error => {
      console.error('Error deleting session:', error);
    });
}


const handleSendMessage = async (message) => {
  if (!selectedSession.value || !selectedSession.value.messages) return;
  let val={
    id: selectedSession.value.id,
    text: message,
    type: 'user'
  }
  // 将用户的消息添加到会话中
  selectedSession.value.messages.push(val);
  // 将用户的消息添加到历史记录中
  addChatHistory(sessions.id,val)
  // 显示加载动画
  isLoading.value = true;

  try {
    // 使用 Chat 函数发送请求到后端
    const response = await Chat({ text: message });
    const reply = response.data.response;
    let val1 = {
      id: selectedSession.value.id,
      text: reply,
      type: 'chatgpt'
    }
    // 将回复添加到会话中
    selectedSession.value.messages.push(val1);
    addChatHistory(sessions.id,val1)
    // 隐藏加载动画
    isLoading.value = false;
  } catch (error) {
    console.error('Error during message send:', error);
    // 出错时也要隐藏加载动画
    isLoading.value = false;
  }
};
const close = ({ value }) => {
  isUserInfoFormVisible.value = value;
};

//点击退出按钮，退出登录，回到主页
const logoutClick = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      Logout().then(() => {
        user.Logout()
        router.push({ path: '/' })
        ElMessage({
          type: 'success',
          message: '退出成功',
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
}
</script>

<style scoped>
.home-view {
  width: 100vw;
  display: flex;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  .session-list-scrollbar {
  max-height: 600px; 
  height: 46vh;
}
.message-content {
  white-space: pre-wrap; /* 保留空白符和换行符，同时允许自动换行 */
}
  .chat-panel {
    display: flex;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 20px 20px rgba(black, 0.05);
    margin-top: 65px;

    .left-panel {
      width: 300px;
      height: calc(100vh - 90px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: rgb(231, 248, 255);
      border-radius: 20px;
      overflow: hidden;

      .session-panel {
        height: calc(100vh - 120px - 192px);
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
          margin-bottom: 10px;
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
            margin-bottom: 10px;
            color: rgba(black, 0.5);
          }
        }
      }

      .message-list {
        height: calc(100vh - 120px - 192px);
        /* calc() */
        padding: 15px;
        overflow-y: auto;
        overflow-x: hidden;
        .list-enter-active,
        .list-leave-active {
          transition: all 0.5s ease;
        }

        .list-enter-from,
        .list-leave-to {
          opacity: 0;
          transform: translateX(30px);
        }

        .user-message, .chatgpt-message {
          background-color: #e3f2fd;
          /* border: 1px solid #90caf9; */
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          max-width: 70%;
          position: relative;
          word-wrap: break-word;
        }

        .user-message {
          margin-left: auto;
          background-color: #e3f2fd;
        }

        .chatgpt-message {
          margin-right: auto;
          background-color: #f0f4c3;
        }

        .user-message::after, .chatgpt-message::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          /* border: 10px solid transparent; */
          /* border-top-color: inherit; */
        }

        .user-message::after {
          content: "";
            width: 0;
            height: 0;
            position: absolute;
            /* 边框宽度为5px 颜色透明(也就是隐藏) */
            border: 10px solid transparent;
            /* 箭头向右 则左边框显示 */
            border-left-color: #e3f2fd;
            /* 在div右边展示 偏移量为 边框宽度*2 即5*2px */
            right: -19px;
            /*垂直居中计算*/
            /*如果有高度 则(父元素高度 - 子元素高度 )/2 */
            /*如果是边框 则(父元素高度 - 边框宽度*2 )/2 */
            /* (40-5*2)/2=15 */
            top: 15px;
        }

        .chatgpt-message::after {
          left: -20px;
          border-left-color: inherit;
          content: "";
            width: 0;
            height: 0;
            position: absolute;
            /* 边框宽度为5px 颜色透明(也就是隐藏) */
            border: 10px solid transparent;
            /* 箭头向左 则右边框显示 */
            border-right-color: #f0f4c3;
            /* 在div左边展示 偏移量为 边框宽度*2 即5*2px */
            left: -19px;
            /*垂直居中计算*/
            /*如果有高度 则(父元素高度 - 子元素高度 )/2 */
            /*如果是边框 则(父元素高度 - 边框宽度*2 )/2 */
            /* (40-5*2)/2=15 */
            top: 15px;
        }
      }
    }
  }
}
</style>
