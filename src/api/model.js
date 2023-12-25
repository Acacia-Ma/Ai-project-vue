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
  export function addChatHistory(chatId, data) {
    return service.request({
      method: "post",
      url: `/chathistory/${chatId}`,
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

  