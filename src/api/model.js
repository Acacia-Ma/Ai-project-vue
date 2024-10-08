import { imageEmits } from 'element-plus';
import service from './index.js'
// 获取所有聊天会话
export function getChatSessions() {
    return service.request({
      method: "get",
      url: "/chatsessions/",
    });
  }
  
  // 创建新聊天会话
  export function createChatSession(data) {
    return service.request({
      method: "post",
      url: "/chatsession/",
      data: data
    });
  }
  
  // 删除聊天会话
  export function deleteChatSession(chatId) {
    return service.request({
      method: "delete",
      url: `/chatsession/${chatId}`,
    });
  }

  // 获取指定聊天会话的历史记录
export function getChatHistory(chatId) {
    return service.request({
      method: "get",
      url: `/chathistory/${chatId}`,
    });
  }
  
  // 添加新的聊天记录到指定会话
  export function addChatHistory(data) {
    
    return service.request({
      method: "post",
      url: `/chathistory/${data.id}`,
      data: data
    });
  }
  // 更新聊天会话的标题
  export function updateChatSession(chatId, data) {
    return service.request({
      method: "put",
      url: `/chatsession/${chatId}`,
      data: data
    });
  }

  // 机器翻译
export function translate(data) {
    return service.request({
      method: "post",
      url: "/translation/",
      data: data
    });
  }

// 图片上传
export function uploadImage(data) {
    return service.request({
      method: "post",
      url: "/uploadimg/",
      data: data
    });
  }

// 图片展示
export function showImage(data) {
    return service.request({
      method: "get",
      url:`/imgadownload/${image_name}`,
      data: data
    });
  }

  // OCR识别接口（传入文件名）
export function ocrImage(data) {
    return service.request({
      method: "post",
      url:"/ocr/",
      data: data
    });
  }

  export function ocrImagehistory(data) {
    return service.request({
      method: "get",
      url:"/imgaresult/",
      data: data
    });
  }

// 语言评测接口
export function languageEvaluation(data) {
    return service.request({
      method: "post",
      url:"/suntone/",
      data: data
    });
  }

// 作文批改接口
export function correctCompositionAPI(data) {
    return service.request({
      method: "post",
      url:"/ocr/",
      data: data
    });
  }