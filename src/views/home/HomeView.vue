<template>
  <div class="home-view">
    <!-- 菜单置于顶部 -->
    <div class="top-menu">
      <el-menu default-active="1" mode="horizontal" class="el-menu-horizontal" @select="handleSelect">
        <el-menu-item index="1">对话</el-menu-item>
        <el-menu-item index="2">图片识别</el-menu-item>
        <el-menu-item index="3">机器翻译</el-menu-item>
        <el-menu-item index="4">语音测评</el-menu-item>
        <li v-if = "user.permission == 100">
           <el-menu-item index="5">通讯录</el-menu-item>
        </li>
      </el-menu>
    </div>

    <!-- 对话界面 -->
    <div v-if="currentView === 'chat'" class="chat-panel">
      <div class="left-panel">
        <div class="session-panel">
          <div class="title">ChatGPT助手 <el-button :icon="Plus" @click="addClick()">添加会话</el-button></div>
          <div class="description">构建你的AI助手</div>
          <el-scrollbar class="session-list-scrollbar">
            <div class="session-list">
              <div v-if="sessions.length==0">暂无数据</div>
              <div v-else>
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
        <div class="user-actions">
          <!-- 头像上传 -->
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <el-avatar :src="avatarUrl" size="large" class="avatar"></el-avatar>
          </el-upload>
          <el-button type="success" :icon="UserFilled" size="large" @click="isUserInfoFormVisible = true" round>个人信息</el-button>
          <UserInfoForm :title="isUserInfoFormVisible" @close="close"/>
          <el-button type="danger" :icon="SwitchButton" size="large" @click="logoutClick" round>退出</el-button>
        </div>
      </div>
      <div class="message-panel">
        <div class="header">
          <div class="front">
            <div class="title">{{ selectedSession?.title || '请选择会话' }}</div>
            <div class="description">与ChatGPT的对话</div>
          </div>
          <!-- 角色选择器 -->
          <div class="role-selector">
            <el-select v-model="selectedRole" placeholder="请选择一个角色">
              <el-option
                v-for="role in roles"
                :key="role.value"
                :label="role.label"
                :value="role.value">
              </el-option>
            </el-select>
          </div>
          <!-- 模型选择器 -->
          <div class="model-selector">
            <el-select v-model="selectedModel" placeholder="请选择一个模型">
              <el-option
                v-for="model in models"
                :key="model.value"
                :label="model.label"
                :value="model.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 消息列表和输入框 -->
        <div class="message-list" id="chat-box">
          <div v-for="message in selectedSession?.messages || []" :key="message.id" :class="['message', message.type === 'user' ? 'user-message' : 'chatgpt-message']">
            <!-- 添加头像 -->
            <el-avatar v-if="message.type === 'user'" :src="userAvatarUrl" class="message-avatar_user"></el-avatar>
            <el-avatar v-else :src="chatGptAvatarUrl" class="message-avatar_chat"></el-avatar>
        
            <div v-html="renderMarkdown(message.text)" class="message-content"></div>
          </div>
          <TextLoading v-if="isLoading" />
        </div>
        <MessageInput @send="handleSendMessage"/>
      </div>
    </div>

    <!-- 图片识别界面内容（需要您自己填充具体内容） -->
    <div v-if="currentView === 'imageRecognition'" class="image-recognition-panel">
      <!-- 图片识别相关内容 -->
      <ImageRecognition />
    </div>

    <!-- 机器翻译界面内容（需要您自己填充具体内容） -->
    <div v-if="currentView === 'machineTranslation'" class="machine-translation-panel">
      <!-- 机器翻译相关内容 -->
      <MachineTranslation/>
    </div>

    <!-- 语音测评界面内容（需要您自己填充具体内容） -->
    <div v-if="currentView === 'Speechevaluation'" class="speech-evaluation-panel">
      <!-- 语音测评相关内容 -->
      <Speechevaluation />
    </div>

    <!-- 通讯录界面内容（需要您自己填充具体内容） -->
    <div v-if="currentView === 'contacts'" class="contacts-panel">
      <!-- 通讯录相关内容 -->
      <Contacts />
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
import ImageRecognition from './components/ImageRecognition.vue';
import MachineTranslation from './components/MachineTranslation.vue';
import SessionItem from './components/SessionItem.vue';
import MessageInput from './components/MessageInput.vue';
import UserInfoForm from './components/UserInfoForm.vue';
import TextLoading from './components/TextLoading.vue';
import Speechevaluation from './components/Speechevaluation.vue';
import Contacts from './components/Contacts.vue';
import { UserFilled, SwitchButton, Plus } from '@element-plus/icons-vue';
import { Logout,Chat,uploadAvatar,getAvatar } from '@api/user';
import { uploadImage} from '@api/model';
import {useTestStore} from '@/store/user' // 确保正确导入user
import { getChatSessions, createChatSession, deleteChatSession,updateChatSession,addChatHistory,getChatHistory } from '@api/model';
import { useUtilStore } from '@/store/util';

// 导入markdown-it,markdown-it-highlightjs
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import Clipboard from 'clipboard'

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 当前时间加随机数生成唯一的id标识
    const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000)
    // 复制功能主要使用的是 clipboard.js
    let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
    const linesLength = str.split(/\n/).length - 1
    // 生成行号
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
    for (let index = 0; index < linesLength; index++) {
      linesNum = linesNum + '<span></span>'
    }
    linesNum += '</span>'
    if (lang && hljs.getLanguage(lang)) {
      try {
        // highlight.js 高亮代码
        const preCode = hljs.highlight(lang, str, true).value
        html = html + preCode
        if (linesLength) {
          html += '<b class="name">' + lang + '</b>'
        }
        // 将代码包裹在 textarea 中
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
      } catch (error) {
        console.log(error)
      }
    }

    const preCode = md.utils.escapeHtml(str)
    html = html + preCode
    // 将代码包裹在 textarea 中
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
  }
})

// 复制代码
const copyCode = () => {
  const clipboard = new Clipboard('.copy-btn')
  clipboard.on('success', () => {
    ElMessage({
      type: 'success',
      message: '复制成功'
    })
  })
  clipboard.on('error', () => {
    ElMessage({
      type: 'error',
      message: '复制失败'
    })
  })
}
// 在页面加载完成后，对代码块进行处理
onMounted(() => {
  copyCode();
});

// 渲染markdown文本
const renderMarkdown = (text) => {
  console.log('text:', text)
  return md.render(text);
};
// 移除.hljs和p的margin,指定字体大小和背景色，移除p的自动换行
const style = document.createElement('style');
style.innerHTML = `
  .hljs {
    margin: 0;
    padding: 0;
    font-size: 16px;
    background-color: #f0f4c3;
  }
  p {
    margin: 0;
    padding: 0;
  }
`;
document.head.appendChild(style);

// 菜单选项点击事件
const handleSelect = (index) => {
  switch (index) {
    case '1':
    currentView.value = 'chat';
      break;
    case '2':
    currentView.value = 'imageRecognition';
      break;
    case '3':
    currentView.value = 'machineTranslation';
      break;
    case '4':
    currentView.value = 'Speechevaluation';
      break;
    case '5':
    currentView.value = 'contacts';
      break;
    default:
      // 默认行为
      break;
  }
};
// 默认头像URL
const defaultAvatarUrl = 'https://bu.dusays.com/2023/10/21/6533d9c12532c.jpg';
const userAvatarUrl = ref(defaultAvatarUrl);
const chatGptAvatarUrl = 'https://open.bigmodel.cn/img/icons/favicon-16x16.png'; // 替换为 ChatGPT 头像的 URL

// 模型选项数据
const models = ref([
  // { value: 'v1.5', label: '星火大模型v1.5' },
  // { value: 'v3.0', label: '星火大模型v3.0' },
  { value: 'glm-4', label: 'GLM-4'},
  { value: 'glm-4-0520', label: 'GLM-4-0520'},
  { value: 'glm-3-turbo', label: 'GLM-3-Turbo'},
  // ... 其他模型 ...
]);
// 选择的模型
const selectedModel = ref('');

// 角色选项数据，分为 正常 和 数据分析
const roles = ref([
  { value: '1', label: '正常' },
  { value: '2', label: '数据分析' },
]);
// 选择的角色
const selectedRole = ref('');
// 加载状态变量
const isLoading = ref(false);
const isUserInfoFormVisible = ref(false);
const router = useRouter();
const sessions = ref([]);
// 选中的会话
const selectedSession = ref([]);
// 编辑会话相关
const isEditingSession = ref(false);
// 正在编辑的会话的 ID 和名称
const editingSessionId = ref(null);
// 正在编辑的会话的名称
const editingSessionName = ref('');
// 用户信息
const user = useTestStore()
// 当前视图
const currentView = ref('chat');

// 获取会话列表
function getList(){
   getChatSessions().then((response) => {
      console.log("res:",response)
      if (response && response.data && Array.isArray(response.data)) {
      sessions.value = response.data.map(session => ({
        id: session.chat_id,
        title: session.title,
        messages: [],
        updatedAt: session.updated_at, // 确保这与后端返回的字段匹配
        role: session.role,
        models: session.models,
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
  getAvatar().then((response) => {
    console.log("用户头像:",response)
    if (response && response.data && response.data.img) {
      user.avatar = useUtilStore().base_url + '/imgadownload/' + response.data.img;
      console.log('用户目前头像:', user.avatar)
      console.log('Processed sessions:', user.avatar);
      userAvatarUrl.value = user.avatar;
      // user.avatar = user.avatar;
    } else {
      console.error('Invalid session data:', response);
    }
  }).catch((error) => {
    console.error('获取用户头像失败:', error);
    // 使用默认头像
    user.avatar = userAvatarUrl;
  });
});

// 创建新会话
function addClick() {
    // 如果存在模型，且没有选中模型，自动选择第一个模型
    if (models.value && models.value.length > 0 && !selectedModel.value) {
      selectedModel.value = models.value[0].value;
    }
    // 如果存在角色，且没有选中角色，自动选择第一个角色
    if (roles.value && roles.value.length > 0 && !selectedRole.value) {
      selectedRole.value = roles.value[0].value;
    }
    console.log('selectedModel:', selectedModel.value);
    console.log('selectedRole:', selectedRole.value);
  const newSession = {
    chat_id: Date.now().toString(),
    username: user.username,
    title: '新会话',
    // 类型为 reply_first 表示这是一个新的会话
    type: "reply_first",
    // 系统角色
    role: "system",
    // 角色对应的prompt为content
    content : selectedRole.value,
    // 模型
    model: selectedModel.value,
  };
  return new Promise((resolve,rejects)=>{
    // console.log('-------------121323----------')
    // console.log(newSession)
  createChatSession(newSession)
    .then(data => {
      console.log('data:',data)
      // 添加到本地状态
      sessions.value.push({ ...newSession, 
        id: newSession.chat_id, 
        messages: [], 
        updatedAt: data.data.updatedAt,
        role: newSession.role,
        type: newSession.type,
        content: newSession.content
      });
      // 自动选中新会话
      selectedSession.value = sessions.value[sessions.value.length - 1];
      // 重新获取历史记录
      getselectHistory()
      console.log(sessions.value);
      console.log('会话创建成功');
      // 可选：重新获取会话列表
      // getList();
      resolve()
    })
    .catch(error => {
      console.error('Error creating session:', error);
    });
})
}

// 弹窗
const editSession = (session) => {
  editingSessionId.value = session.id;
  editingSessionName.value = session.title;
  isEditingSession.value = true;
};
// 编辑会话
function saveSessionName() {
  const session = sessions.value.find(s => s.id === editingSessionId.value);
  console.log('session:', session);

  if (session) {
    // 发送请求更新后端数据
    updateChatSession(session.id, { title: editingSessionName.value })
      .then(() => {
        // 更新前端状态
        session.title = editingSessionName.value;
        console.log('会话名称更新成功');
      })
      .catch(error => {
        console.error('更新会话名称时出错:', error);
        console.log(session.chat_id, { title: editingSessionName.value });
      });
  }

  isEditingSession.value = false;
}

// 获取单前会话历史聊天记录  getChatHistory
function getselectHistory(){
  return new Promise((resolve,rejects)=>{
  getChatHistory(selectedSession.value.id).then((response) => {
    console.log("res:",response)
    if (response && response.data && Array.isArray(response.data)) {
      // 将后端返回的数据转换为前端需要的格式
      selectedSession.value.messages = response.data.map(session => ({
        id: session.chat_id,
        text: session.text,
        type: session.type,
        role: session.role,
        model: session.model,
      }));
      selectedModel.value=selectedSession.value.messages[0].model
      selectedRole.value=selectedSession.value.messages[0].role
      document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
      console.log('Processed sessions:', selectedSession.value.messages);
      console.log('选择的模型:', selectedModel.value);
      console.log('选择的角色:', selectedRole.value);
    } else {
      console.error('Invalid session data:', response);
    }
    // resolve() 为了让外部调用时可以使用then
    resolve()
  })
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
// 发送消息
const handleSendMessage= async (message)=>{
  // 如果没有选中的会话，先添加一个会话
  if (!selectedSession.value || !selectedSession.value.messages){
    addClick().then(()=>{
      // selectSession.value为当前选中的会话
      selectedSession.value = sessions.value[0];
      // 重新获取历史记录
      getselectHistory().then(()=>{
        console.log('-----')
        // 发送消息
        handleSendMessage1(message)})
    })
  }else{
    // 发送消息
    handleSendMessage1(message)
  }
  // 将聊天框滚动到底部
  document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}
// 发送消息
const handleSendMessage1 = async (message) => {
  
  let val={
    id: selectedSession.value.id,
    text: message,
    type: 'user',
    role: selectedRole.value,
  }
  console.log('val:',val)
  // 将用户的消息添加到会话中
  selectedSession.value.messages.push(val);
  console.log('selectedSession:', selectedSession.value);
  // 将用户的消息添加到历史记录中
  console.log(val.id)
  addChatHistory(val)
  // 显示加载动画 
  isLoading.value = true;
  try {
     // 使用 selectedModel.value 来确定使用哪个模型
    const response = await Chat({ text: selectedSession.value.messages, model: selectedModel.value });
    const reply = response.data.response;
    let val1 = {
      id: selectedSession.value.id,
      text: reply,
      type: 'assistant',
      role: selectedRole.value,
    }
    // 将回复添加到会话中
    selectedSession.value.messages.push(val1);
    addChatHistory(val1)
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

// 上传头像，后端返回头像名字，前端拼接url
let avatarUrl = ref(user.avatar);
const beforeAvatarUpload = (file) => {
  console.log('beforeAvatarUpload:', file);
  let formData = new FormData();
  formData.append('file', file);
  console.log('formData:', formData);
  uploadImage(formData).then((response) => {
    console.log("上传头像后图片名称:",response)
    if (response && response.data && response.data.filename) {
      avatarUrl.value = useUtilStore().base_url + '/imgadownload/' + response.data.filename;
      let imgname = response.data.filename;
      console.log('上传后头像URL:', avatarUrl.value);
      uploadAvatar({image_name:imgname}).then(()=>{
        user.avatar = avatarUrl.value
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
      })
    } else {
      console.error('Invalid session data:', response);
    }
  })
};

</script>

<style scoped>

/* 新增的顶部菜单样式 */

.home-view {
  width: 100vw;
  /* display: flex; */
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-image: url(https://bu.dusays.com/2023/12/12/6577c98beafc0.webp);
  .session-list-scrollbar {
  max-height: 600px; 
  height: 46vh;
}
.avatar{
  margin-bottom: 15px;
}
.avatar-uploader {
    cursor: pointer;
}
.message-content {
 white-space: pre-wrap;  /* 保留空白符和换行符，同时允许自动换行 */
  /* font-size: 18px */
  /* 移除 */
}
  .chat-panel {
    display: flex;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 20px 20px rgba(black, 0.05);
    width: 1002px;
    margin: auto;
    margin-top: 10px;


    .left-panel {
      width: 300px;
      /* height: calc(100vh - 90px); */
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
        padding: 10px;
        border-top: 2px solid rgba(0, 0, 0, 0.1);

        .el-button {
          margin-bottom: 10px;
          width: 100%;
          margin-left:0;
        }
      }
    }

    .message-panel {
      width: 700px;
      border-top: 1px solid rgba(0,0,0, 0.07);
      border-left: 1px solid rgba(0, 0, 0, 0.07);
      border-right: 1px solid rgba(0,0,0, 0.07);
      border: 1px solid rgba(0,0,0, 0.07);
      border-radius: 20px;
      
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
          margin-left: 40px;
          margin-right: 40px;
          max-width: 60%;
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

        .message-avatar_user {
          position: absolute;
          top: 0;
          right: -50px;
        }

        .message-avatar_chat {
          position: absolute;
          top: 0;
          left: -50px;
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
